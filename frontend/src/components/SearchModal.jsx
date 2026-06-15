import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useTaskStore from '../store/taskStore'

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('')
  const { tasks, fetchTasks } = useTaskStore()
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
    inputRef.current?.focus()
  }, [])

  const filtered = query.trim()
    ? tasks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description?.toLowerCase().includes(query.toLowerCase())
      )
    : tasks.slice(0, 5)

  const priorityColor = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-emerald-500/20 text-emerald-400',
  }

  const statusColor = {
    todo: 'text-zinc-400',
    'in-progress': 'text-yellow-400',
    done: 'text-emerald-400',
  }

  const handleSelect = (task) => {
    navigate('/kanban')
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none text-sm"
            />
            <button onClick={onClose}>
              <X className="w-4 h-4 text-zinc-500 hover:text-white transition" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No tasks found for "{query}"
              </div>
            ) : (
              <>
                <div className="px-4 py-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
                  {query ? 'Results' : 'Recent Tasks'}
                </div>
                {filtered.map(task => (
                  <button
                    key={task.id}
                    onClick={() => handleSelect(task)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-zinc-500 truncate mt-0.5">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[task.priority]}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs ${statusColor[task.status]}`}>
                        {task.status}
                      </span>
                    </div>
                    <ArrowRight className="w-3 h-3 text-zinc-600" />
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-[10px] text-zinc-600">
            <span>↵ to select</span>
            <span>esc to close</span>
            <span>ctrl+k to open</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}