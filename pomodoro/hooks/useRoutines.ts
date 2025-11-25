import { useEffect, useState } from "react";
import * as service from "@/services/routines.service";

export function useRoutines() {
  const [routines, setRoutines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getRoutines();
      setRoutines(data);
    } catch (e: any) {
      setError(e.message || "Error cargando rutinas");
    } finally {
      setLoading(false);
    }
  };

  const add = async (payload: any) => {
    setError(null);
    try {
      const created = await service.createRoutine(payload);
      setRoutines((prev) => [...prev, created]);
      return created;
    } catch (e: any) {
      setError(e.message || "Error creando rutina");
      throw e; 
    }
  };

  const remove = async (id: string) => {
    setError(null);
    const before = routines; // por si falla
    try {
      await service.deleteRoutine(id);
      setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      setError(e.message || "Error eliminando rutina");
      setRoutines(before); // revertir cambios 
      throw e;
    }
  };

  const overwriteImport = async (arr: any[]) => {
    setError(null);
    try {
      await service.importRoutines({ routines: arr });
      await load();
    } catch (e: any) {
      setError(e.message || "Error importando rutinas");
      throw e;
    }
  };

  return { routines, loading, error, load, add, remove, overwriteImport };
}
