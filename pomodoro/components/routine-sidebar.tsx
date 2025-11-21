// components/routines/routine-sidebar.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Clock, Trash2, Upload, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoutines } from "@/hooks/useRoutines";
import { exportRoutinesUrl } from "@/services/routines.service";

interface RoutineSidebarProps {
  currentRoutine: any;       // antes era string
  onSelectRoutine: (routine: any) => void;
}

export function RoutineSidebar({ currentRoutine, onSelectRoutine }: RoutineSidebarProps) {
  const { routines, loading, add, remove, overwriteImport } = useRoutines();

  // new routine modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newWorkDuration, setNewWorkDuration] = useState("25");
  const [newBreakDuration, setNewBreakDuration] = useState("5");
  const [importing, setImporting] = useState(false);

  // ref for file import
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCreateRoutine = async () => {
    if (!newRoutineName.trim()) return;
    await add({
      name: newRoutineName.trim(),
      workDuration: Number(newWorkDuration) || 25,
      breakDuration: Number(newBreakDuration) || 5,
      cycles: 1,
    });
    setNewRoutineName("");
    setNewWorkDuration("25");
    setNewBreakDuration("5");
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
          {loading ? <div>Loading...</div> : (
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
                    <div className="mt-0.5">
                      <Clock className="w-5 h-5 text-sidebar-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sidebar-foreground mb-1">
                        {routine.name}
                      </div>
                      <div className="text-sm text-sidebar-foreground/60">
                        {routine.workDuration} min trabajo · {routine.breakDuration} min descanso
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

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <div className="flex gap-2">

          {/* Nueva rutina */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex-1 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
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
                      placeholder="25"
                      value={newWorkDuration}
                      onChange={(e) => setNewWorkDuration(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="break-duration">Descanso (min)</Label>
                    <Input
                      id="break-duration"
                      type="number"
                      placeholder="5"
                      value={newBreakDuration}
                      onChange={(e) => setNewBreakDuration(e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={handleCreateRoutine} className="w-full">
                  Crear Rutina
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Importar rutinas */}
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => handleFileImport(e.target.files?.[0] ?? null)}
          />

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Importar
          </Button>

          {/* Exportar rutinas */}
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Exportar
          </Button>
        </div>
      </div>
    </aside>
  );
}
