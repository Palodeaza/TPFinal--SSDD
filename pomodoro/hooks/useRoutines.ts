// hooks/useRoutines.ts
import { useEffect, useState } from "react";
import * as service from "@/services/routines.service";

export function useRoutines() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await service.getRoutines();
      setRoutines(data);
    } catch (e: any) {
      setError(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (payload: any) => {
    const created = await service.createRoutine(payload);
    setRoutines((p) => [...p, created]);
    return created;
  };

  const remove = async (id: string) => {
    await service.deleteRoutine(id);
    setRoutines((p) => p.filter((r) => r.id !== id));
  };

  const overwriteImport = async (arr: any[]) => {
    await service.importRoutines({ routines: arr });
    await load();
  };

  return { routines, loading, error, load, add, remove, overwriteImport };
}
