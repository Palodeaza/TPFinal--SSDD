'use client'

import { PomodoroTimer } from '@/components/pomodoro-timer'
import { RoutineSidebar } from '@/components/routine-sidebar'
import { useState } from 'react'

export default function Home() {
  const [currentRoutine, setCurrentRoutine] = useState<string>('Trabajo')

  return (
    <div className="flex min-h-screen">
      <RoutineSidebar 
        currentRoutine={currentRoutine}
        onSelectRoutine={setCurrentRoutine}
      />
      <main className="flex-1 flex items-center justify-center p-8">
        <PomodoroTimer routineName={currentRoutine} />
      </main>
    </div>
  )
}
