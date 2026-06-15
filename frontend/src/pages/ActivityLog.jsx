import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Plus, Pencil, Trash2, ArrowRight, Clock } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import api from '../utils/api'

const actionConfig = {
  created: { icon: Plus, color: 'text-emerald-300', bg: 'bg-emerald-500/20 border-emerald-400/30' },
  updated: { icon: Pencil, color: 'text-blue-300', bg: 'bg-blue-500/20 border-blue-400/30' },
  moved: { icon: ArrowRight, color: 'text-yellow-300', bg: 'bg-yellow-500/20 border-yellow-400/30' },
  deleted: { icon: Trash2, color: 'text-red-300', bg: 'bg-red-500/20 border-red-400/30' },
}

const timeAgo = (date) => {
  const diff = Math.floor((new Date() - new Date(date)) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const actionLabel = {
  created: 'Created',
  updated: 'Updated',
  moved: 'Moved',
  deleted: 'Deleted',
}

export default function ActivityLogPage() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/activity').then(res => {
      setActivities(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            Activity Log
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Full history of all your actions.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-20">
            <Activity className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400">No activity yet. Start creating tasks!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity, i) => {
              const config = actionConfig[activity.action] || actionConfig.updated
              const Icon = config.icon
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-3 transition group"
                >
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">{activity.detail}</p>
                    <span className={`text-xs font-semibold ${config.color}`}>
                      {actionLabel[activity.action] || 'Action'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-400 text-xs shrink-0 bg-zinc-800 px-2 py-1 rounded-lg">
                    <Clock className="w-3 h-3" />
                    {timeAgo(activity.createdAt)}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}