export type RoutinePayload = {
  id?: string;
  name: string;
  workDuration: number;
  breakDuration: number;
  cycles?: number;
  image?: string;
  category?: string;
  description?: string;
};

export async function getRoutines(): Promise<RoutinePayload[]> {
  const res = await fetch("/api/routines");
  if (!res.ok) throw new Error("Error fetching routines");
  return res.json();
}

export async function createRoutine(payload: RoutinePayload) {
  const res = await fetch("/api/routines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(t || "Error creating");
  }
  return res.json();
}

export async function updateRoutine(id: string, payload: Partial<RoutinePayload>) {
  const res = await fetch(`/api/routines/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error updating");
  return res.json();
}

export async function deleteRoutine(id: string) {
  const res = await fetch(`/api/routines/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error deleting");
  return res.json();
}

export async function importRoutines(body: any) {
  const res = await fetch("/api/routines/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Error importing");
  return res.json();
}

export function exportRoutinesUrl() {
  
  return "/api/routines/export";
}
