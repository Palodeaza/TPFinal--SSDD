'use client'

import { PomodoroTimer } from '@/components/pomodoro-timer'
import { RoutineSidebar } from '@/components/routine-sidebar'
import { useState } from 'react'

export default function Home() {
  const [currentRoutine, setCurrentRoutine] = useState<any>({
  name: "Trabajo",
  workDuration: 25,
  breakDuration: 5,
  cycles: 1
  });

  return (
    <div className="flex min-h-screen">
      <RoutineSidebar 
        currentRoutine={currentRoutine}
        onSelectRoutine={setCurrentRoutine}
      />

      <main className="flex-1 flex items-center justify-center p-8">
        <PomodoroTimer 
          routineName={currentRoutine.name}
          workDuration={currentRoutine.workDuration}
          breakDuration={currentRoutine.breakDuration}
        />
      </main>
    </div>
  )
}
