import { motion } from 'framer-motion'
import { Calendar, Flag, Trash2, Pencil } from 'lucide-react'
import useTaskStore from '../store/taskStore'
import toast from 'react-hot-toast'

const priorityConfig = {
  low: { label: 'Low', class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  medium: { label: 'Medium', class: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  high: { label: 'High', class: 'text-red-400 bg-red-500/10 border-red-500/20' },
}

const statusConfig = {
  'todo': { label: 'To Do', class: 'text-zinc-400 bg-zinc-700/50 border-zinc-600/30' },
  'in-progress': { label: 'In Progress', class: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  'done': { label: 'Done', class: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, fetchStats } = useTaskStore()

  const handleDelete = async () => {
    const res = await deleteTask(task.id)
    if (res.success) {
      toast.success('Task deleted')
      fetchStats()
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'

  const priority = priorityConfig[task.priority] || priorityConfig.medium
  const status = statusConfig[task.status] || statusConfig.todo

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 group transition-all cursor-pointer"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className={`text-sm font-medium leading-snug flex-1 ${
          task.status === 'done' ? 'line-through text-zinc-500' : 'text-white'
        }`}>
          {task.title}
        </h3>

        {/* Actions - show on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-indigo-600/20 hover:text-indigo-400 flex items-center justify-center text-zinc-500 transition"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-zinc-500 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-zinc-500 mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Bottom row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${priority.class}`}>
          <Flag className="w-3 h-3" />
          {priority.label}
        </span>

        {/* Status badge */}
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-medium ${status.class}`}>
          {status.label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ml-auto ${
            isOverdue
              ? 'text-red-400 bg-red-500/10 border-red-500/20'
              : 'text-zinc-400 bg-zinc-800 border-zinc-700'
          }`}>
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            {isOverdue && ' · Overdue'}
          </span>
        )}
      </div>
    </motion.div>
  )
}