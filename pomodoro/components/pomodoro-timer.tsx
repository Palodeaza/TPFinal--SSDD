'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface PomodoroTimerProps {
  routineName: string
  workDuration: number
  breakDuration: number
  cycles: number
}

export function PomodoroTimer({
  routineName,
  workDuration,
  breakDuration,
  cycles
}: PomodoroTimerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [currentCycle, setCurrentCycle] = useState(1)
  const [remainingSeconds, setRemainingSeconds] = useState(workDuration * 60)

  const lastPhaseChange = useRef(false)

  
  useEffect(() => {
    setIsRunning(false)
    setIsBreak(false)
    setCurrentCycle(1)
    setRemainingSeconds(workDuration * 60)
  }, [routineName, workDuration, breakDuration])

  // timer principal
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev > 1) return prev - 1

        // Prev == 1 → cambio de fase
        const nextIsBreak = !isBreak

        
        if (!lastPhaseChange.current) {
          lastPhaseChange.current = true

          // FIN DE DESCANSO → vuelve a trabajo → suma ciclo
          if (isBreak && !nextIsBreak) {
            setCurrentCycle(c => {
              const next = c + 1
              if (next > cycles) {
                // sesión completa
                setIsRunning(false)
                setIsBreak(false)
                return 1
              }
              return next
            })
          }

          // cambio a recreo
          setIsBreak(nextIsBreak)
        }

        // reiniciar contador
        return (nextIsBreak ? breakDuration : workDuration) * 60
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      lastPhaseChange.current = false 
    }
  }, [isRunning, workDuration, breakDuration, isBreak, cycles])

  const toggleTimer = () => setIsRunning(r => !r)

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setCurrentCycle(1)
    setRemainingSeconds(workDuration * 60)
  }

  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60

  const formatTime = (m: number, s: number) =>
    `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  const totalPhaseSeconds = (isBreak ? breakDuration : workDuration) * 60
  const progressRatio = remainingSeconds / totalPhaseSeconds

  return (
    <Card className="w-full max-w-lg p-12 bg-card/50 backdrop-blur-sm border-2">
      <div className="flex flex-col items-center gap-8">

        {/* Título */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{routineName}</h1>
          <p className="text-muted-foreground text-sm">
            {isBreak ? '☕ Tiempo de descanso' : '🎯 Tiempo de trabajo'}
          </p>
        </div>

        {/* Timer circular */}
        <div className="relative w-80 h-80">
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
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressRatio)}`}
              className={isBreak ? 'text-accent' : 'text-primary'}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>

          {/* Tiempo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="font-mono text-7xl font-bold text-foreground tabular-nums">
              {formatTime(minutes, seconds)}
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
          </Button>

          <Button
            size="lg"
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full text-lg font-semibold ${
              isBreak ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="flex gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-foreground">{currentCycle}</div>
            <div className="text-sm text-muted-foreground">ciclo actual</div>
          </div>
          <div className="w-px bg-border" />
          <div>
            <div className="text-2xl font-bold text-foreground">{cycles}</div>
            <div className="text-sm text-muted-foreground">ciclos por sesión</div>
          </div>
        </div>

      </div>
    </Card>
  )
}
