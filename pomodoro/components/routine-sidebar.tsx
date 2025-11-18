'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Clock, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RoutineSidebarProps {
  currentRoutine: string
  onSelectRoutine: (routine: string) => void
}

interface Routine {
  id: string
  name: string
  workDuration: number
  breakDuration: number
}

export function RoutineSidebar({ currentRoutine, onSelectRoutine }: RoutineSidebarProps) {
  const [routines, setRoutines] = useState<Routine[]>([
    { id: '1', name: 'Trabajo', workDuration: 25, breakDuration: 5 },
    { id: '2', name: 'Estudio', workDuration: 50, breakDuration: 10 },
    { id: '3', name: 'Lectura', workDuration: 30, breakDuration: 5 },
    { id: '4', name: 'Ejercicio', workDuration: 20, breakDuration: 3 },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRoutineName, setNewRoutineName] = useState('')
  const [newWorkDuration, setNewWorkDuration] = useState('25')
  const [newBreakDuration, setNewBreakDuration] = useState('5')

  const handleCreateRoutine = () => {
    if (newRoutineName.trim()) {
      const newRoutine: Routine = {
        id: Date.now().toString(),
        name: newRoutineName,
        workDuration: parseInt(newWorkDuration) || 25,
        breakDuration: parseInt(newBreakDuration) || 5,
      }
      setRoutines([...routines, newRoutine])
      setNewRoutineName('')
      setNewWorkDuration('25')
      setNewBreakDuration('5')
      setIsDialogOpen(false)
    }
  }

  const handleDeleteRoutine = (id: string) => {
    setRoutines(routines.filter(r => r.id !== id))
  }

  return (
    <aside className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-xl font-bold text-sidebar-foreground mb-1">
          🍅 Pomodoro Timer
        </h2>
        <p className="text-sm text-sidebar-foreground/60">
          Gestiona tus rutinas de productividad
        </p>
      </div>

      {/* Rutinas */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className={`group relative rounded-lg transition-colors ${
                currentRoutine === routine.name
                  ? 'bg-sidebar-accent'
                  : 'hover:bg-sidebar-accent/50'
              }`}
            >
              <button
                onClick={() => onSelectRoutine(routine.name)}
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
          ))}
        </div>
      </ScrollArea>

      {/* Crear nueva rutina */}
      <div className="p-4 border-t border-sidebar-border">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Rutina
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
      </div>
    </aside>
  )
}
