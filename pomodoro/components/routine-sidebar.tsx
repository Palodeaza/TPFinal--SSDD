"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Clock, Trash2, Upload, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoutines } from "@/hooks/useRoutines";
import { exportRoutinesUrl } from "@/services/routines.service";

interface RoutineSidebarProps {
  currentRoutine: any;
  onSelectRoutine: (routine: any) => void;
}

export function RoutineSidebar({ currentRoutine, onSelectRoutine }: RoutineSidebarProps) {
  const { routines, loading, add, remove, overwriteImport, error } = useRoutines();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState(""); //seria el estado del timer por defecto si no se selecciona ninguna rutina
  const [newWorkDuration, setNewWorkDuration] = useState("25");
  const [newBreakDuration, setNewBreakDuration] = useState("5");
  const [newCycles, setNewCycles] = useState("4");
  const [importing, setImporting] = useState(false);
  
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!error) return;
    alert(error);
  }, [error]);

  const limpiarInputs = (value: string) => {
    const cleanead = value.replace(/[^\d]/g, "");
    return cleanead;
  }

  //validacion del formulario para mostrar un mensaje de error
  const isFormValid = useMemo(() => {
    if (!newRoutineName.trim()) return false;
    const w = Number(newWorkDuration);
    const b = Number(newBreakDuration);
    const c = Number(newCycles);
    if (!Number.isFinite(w) || w <= 0) return false;
    if (!Number.isFinite(b) || b <= 0) return false;
    if (!Number.isFinite(c) || c <= 0) return false;
    return true;
  }, [newRoutineName, newWorkDuration, newBreakDuration, newCycles]);


  const handleCreateRoutine = async () => {
    if (!newRoutineName.trim()) return;
    await add({
      name: newRoutineName.trim(),
      workDuration: Number(newWorkDuration) || 25,
      breakDuration: Number(newBreakDuration) || 5,
      cycles: Number(newCycles) || 1,
    });
    setNewRoutineName("");
    setNewWorkDuration("25");
    setNewBreakDuration("5");
    setNewCycles("4");
    setIsDialogOpen(false);
  };

  const handleDeleteRoutine = async (id: string) => {
    await remove(id);
  };


  const handleExport = () => {
    window.open(exportRoutinesUrl(), "_blank");
  };

  const handleFileImport = async (file: File | null) => {
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      let arr = parsed;
      if (parsed && parsed.routines) arr = parsed.routines;
      if (!Array.isArray(arr)) throw new Error("Formato inválido");
      await overwriteImport(arr);
    } catch (e) {
      console.error(e);
      alert("Error importando. Revisa el archivo.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <aside className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground mb-1">🍅 Pomodoro Timer</h2>
        <p className="text-sm text-sidebar-foreground/60">Gestiona tus rutinas de productividad</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {loading ? (
            <div>Loading...</div>
          ) : (
            routines.map((routine: any) => (
              <div
                key={routine.id}
                className={`group relative rounded-lg transition-colors ${
                  currentRoutine?.name === routine.name
                    ? "bg-sidebar-accent"
                    : "hover:bg-sidebar-accent/50"
                }`}
              >
                <button
                  onClick={() => onSelectRoutine(routine)}
                  className="w-full text-left p-4 pr-12"
                >
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-sidebar-primary mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sidebar-foreground mb-1">
                        {routine.name}
                      </div>
                      <div className="text-sm text-sidebar-foreground/60">
                        {routine.workDuration} min trabajo · {routine.breakDuration} min descanso · {routine.cycles} ciclos
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleDeleteRoutine(routine.id)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-sidebar-accent rounded-md"
                >
                  <Trash2 className="w-4 h-4 text-sidebar-foreground/60 hover:text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* botones reorganizados verticalmente, full width */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex flex-col gap-3">

          {/* nueva rutina */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" /> Nueva Rutina
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Rutina</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="routine-name">Nombre de la rutina</Label>
                  <Input
                    id="routine-name"
                    placeholder="Ej: Trabajo profundo"
                    value={newRoutineName}
                    onChange={(e) => setNewRoutineName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="work-duration">Trabajo (min)</Label>
                    <Input
                      id="work-duration"
                      type="number"
                      min={1}
                      step={1}
                      value={newWorkDuration}
                      onChange={(e) => setNewWorkDuration(limpiarInputs(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="break-duration">Descanso (min)</Label>
                    <Input
                      id="break-duration"
                      type="number"
                      min={1}
                      step={1}
                      value={newBreakDuration}
                      onChange={(e) => setNewBreakDuration(limpiarInputs(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routine-cycles">Cantidad de ciclos</Label>
                  <Input
                    id="routine-cycles"
                    type="number"
                    min={1}
                    step={1}
                    value={newCycles}
                    onChange={(e) => setNewCycles(limpiarInputs(e.target.value))}
                  />
                </div>
                
                {/* mensaje simple de validación */}
                {!isFormValid && (
                  <div className="text-sm text-destructive">
                    Por favor completa nombre y números válidos (&gt;= 1).
                  </div>
                )}

                <Button onClick={handleCreateRoutine} className="w-full" disabled={!isFormValid}>
                  Crear Rutina
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* importar */}
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => handleFileImport(e.target.files?.[0] ?? null)}
          />

          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Importar
          </Button>

          {/* exportar */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Exportar
          </Button>

        </div>
      </div>
    </aside>
  );
}
