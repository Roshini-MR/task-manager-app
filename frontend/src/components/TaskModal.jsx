import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Flag, AlignLeft, Type } from 'lucide-react'
import useTaskStore from '../store/taskStore'
import toast from 'react-hot-toast'

const priorities = [
  { value: 'low', label: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
  { value: 'high', label: 'High', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
]

const statuses = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export default function TaskModal({ isOpen, onClose, task = null }) {
  const { createTask, updateTask, fetchStats } = useTaskStore()
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      })
    } else {
      setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' })
    }
  }, [task, isOpen])
const handleSubmit = async () => {
  if (!form.title.trim()) return toast.error('Title is required')
  setLoading(true)
  try {
    const res = task
      ? await updateTask(task.id, form)
      : await createTask(form)
    
    if (res.success) {
      toast.success(task ? 'Task updated! ✅' : 'Task created! 🎉')
      fetchStats()
      onClose()
    } else {
      toast.error('Something went wrong')
    }
  } catch (err) {
    toast.error('Something went wrong')
  }
  setLoading(false)
}
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">
                {task ? 'Edit Task' : 'New Task'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 mb-2">
                  <Type className="w-3.5 h-3.5" /> Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 mb-2">
                  <AlignLeft className="w-3.5 h-3.5" /> Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Add some details..."
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition resize-none"
                />
              </div>

              {/* Priority + Status row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 mb-2">
                    <Flag className="w-3.5 h-3.5" /> Priority
                  </label>
                  <div className="flex flex-col gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setForm({ ...form, priority: p.value })}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
                          form.priority === p.value
                            ? p.color
                            : 'text-zinc-500 bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-zinc-400 mb-2 block">Status</label>
                  <div className="flex flex-col gap-2">
                    {statuses.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => setForm({ ...form, status: s.value })}
                        className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
                          form.status === s.value
                            ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
                            : 'text-zinc-500 bg-zinc-800 border-zinc-700 hover:border-zinc-600'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5 mb-2">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition"
              >
                {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}