'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface PomodoroTimerProps {
  routineName: string
}

export function PomodoroTimer({ routineName }: PomodoroTimerProps) {
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completado
            setIsRunning(false)
            if (!isBreak) {
              // Cambiar a descanso
              setIsBreak(true)
              setMinutes(1)
              setSeconds(0)
            } else {
              // Volver a trabajo
              setIsBreak(false)
              setMinutes(25)
              setSeconds(0)
            }
          } else {
            setMinutes(minutes - 1)
            setSeconds(59)
          }
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, minutes, seconds, isBreak])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setMinutes(25)
    setSeconds(0)
  }

  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <Card className="w-full max-w-lg p-12 bg-card/50 backdrop-blur-sm border-2">
      <div className="flex flex-col items-center gap-8">
        {/* Nombre de la rutina */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {routineName}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isBreak ? '☕ Tiempo de descanso' : '🎯 Tiempo de trabajo'}
          </p>
        </div>

        {/* Timer circular */}
        <div className="relative w-80 h-80">
          {/* Círculo de progreso */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${
                2 * Math.PI * 45 * (1 - ((minutes * 60 + seconds) / ((isBreak ? 5 : 25) * 60)))
              }`}
              className={isBreak ? 'text-accent' : 'text-primary'}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>

          {/* Tiempo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-7xl font-bold text-foreground tabular-nums">
                {formatTime(minutes, seconds)}
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={resetTimer}
            className="w-16 h-16 rounded-full"
          >
            <RotateCcw className="w-6 h-6" />
            <span className="sr-only">Reiniciar</span>
          </Button>

          <Button
            size="lg"
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full text-lg font-semibold ${
              isBreak ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-8 h-8" />
                <span className="sr-only">Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-8 h-8 ml-1" />
                <span className="sr-only">Iniciar</span>
              </>
            )}
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">4</div>
            <div className="text-sm text-muted-foreground">Completados hoy</div>
          </div>
          <div className="w-px bg-border" />
          <div>
            <div className="text-2xl font-bold text-foreground">25</div>
            <div className="text-sm text-muted-foreground">min por sesión</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
