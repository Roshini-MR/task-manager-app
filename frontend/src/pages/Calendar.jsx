import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import useTaskStore from '../store/taskStore'

const priorityColor = {
  low: 'bg-emerald-400',
  medium: 'bg-yellow-400',
  high: 'bg-red-400',
}

export default function CalendarPage() {
  const { tasks, fetchTasks } = useTaskStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchTasks()
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const getTasksForDay = (day) => {
    return tasks.filter(t => {
      if (!t.dueDate) return false
      const d = new Date(t.dueDate)
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
  }

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date())

  const today = new Date()
  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const cells = []
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-400" />
              Calendar
            </h1>
            <p className="text-zinc-400 text-sm mt-1">View your tasks by due date.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-sm font-medium transition border border-zinc-700"
            >
              Today
            </button>
            <button
              onClick={goToPrevMonth}
              className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white font-semibold w-36 sm:w-40 text-center text-sm sm:text-base">{monthName}</span>
            <button
              onClick={goToNextMonth}
              className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-3 lg:p-4">
          {/* Week days header */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-[10px] sm:text-xs font-bold text-zinc-400 py-2 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1 lg:gap-2">
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={i} className="aspect-square" />
              }
              const dayTasks = getTasksForDay(day)
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className={`aspect-square rounded-xl border p-1 lg:p-2 flex flex-col transition-all ${
                    isToday(day)
                      ? 'border-indigo-400 bg-indigo-500/15 shadow-sm shadow-indigo-500/20'
                      : 'border-zinc-700 hover:border-zinc-500 bg-zinc-950/50'
                  }`}
                >
                  <span className={`text-xs sm:text-sm font-bold mb-1 ${
                    isToday(day) ? 'text-indigo-300' : 'text-zinc-300'
                  }`}>
                    {day}
                  </span>
                  <div className="flex-1 space-y-0.5 overflow-hidden">
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        title={task.title}
                        className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 rounded-md px-1 py-0.5 transition"
                      >
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityColor[task.priority] || 'bg-zinc-400'}`} />
                        <span className="text-[9px] sm:text-[10px] text-zinc-200 truncate">{task.title}</span>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <span className="text-[9px] sm:text-[10px] text-indigo-400 px-1">+{dayTasks.length - 2} more</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4">
          {Object.entries(priorityColor).map(([priority, color]) => (
            <div key={priority} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-zinc-400 capitalize">{priority} priority</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}