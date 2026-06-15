import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import {
  CheckSquare, Loader2, AlertTriangle, Plus, Search
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import useTaskStore from '../store/taskStore'
import useAuthStore from '../store/authStore'

const COLORS = ['#818cf8', '#60a5fa', '#34d399']

const statCards = (stats) => [
  { label: 'Total Tasks', value: stats?.total ?? 0, icon: CheckSquare, color: 'text-indigo-300', bg: 'bg-indigo-500/15 border-indigo-400/30' },
  { label: 'In Progress', value: stats?.inProgress ?? 0, icon: Loader2, color: 'text-blue-300', bg: 'bg-blue-500/15 border-blue-400/30' },
  { label: 'Completed', value: stats?.done ?? 0, icon: CheckSquare, color: 'text-emerald-300', bg: 'bg-emerald-500/15 border-emerald-400/30' },
  { label: 'High Priority', value: stats?.high ?? 0, icon: AlertTriangle, color: 'text-red-300', bg: 'bg-red-500/15 border-red-400/30' },
]

export default function Dashboard() {
  const { user } = useAuthStore()
  const { tasks, stats, fetchTasks, fetchStats, connectSocket, disconnectSocket } = useTaskStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

  useEffect(() => {
    fetchTasks()
    fetchStats()
  }, [])

  useEffect(() => {
    if (user) connectSocket(user.id)
    return () => disconnectSocket()
  }, [user])

  useEffect(() => {
    fetchTasks({
      ...(search && { search }),
      ...(filterStatus && { status: filterStatus }),
      ...(filterPriority && { priority: filterPriority }),
    })
  }, [filterStatus, filterPriority])

  const handleSearch = () => {
    fetchTasks({
      ...(search && { search }),
      ...(filterStatus && { status: filterStatus }),
      ...(filterPriority && { priority: filterPriority }),
    })
  }

  const handleEdit = (task) => {
    setEditTask(task)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditTask(null)
    fetchTasks()
    fetchStats()
  }

  const pieData = [
    { name: 'To Do', value: stats?.todo ?? 0 },
    { name: 'In Progress', value: stats?.inProgress ?? 0 },
    { name: 'Done', value: stats?.done ?? 0 },
  ]

  const barData = [
    { name: 'To Do', count: stats?.todo ?? 0 },
    { name: 'In Progress', count: stats?.inProgress ?? 0 },
    { name: 'Done', count: stats?.done ?? 0 },
    { name: 'High Priority', count: stats?.high ?? 0 },
  ]

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-3">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
              <span className="text-indigo-300">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Here's what's happening with your tasks today.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 lg:px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            New Task
          </motion.button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
          {statCards(stats).map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-2xl border p-4 lg:p-5 ${card.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-zinc-400">{card.label}</span>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className={`text-2xl lg:text-3xl font-bold ${card.color}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 lg:p-6"
          >
            <h3 className="text-sm font-semibold text-white mb-4 lg:mb-6">Task Overview</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData} barSize={28}>
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 10, color: '#fff' }} cursor={{ fill: '#ffffff08' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 lg:p-6"
          >
            <h3 className="text-sm font-semibold text-white mb-4 lg:mb-6">Status Breakdown</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 10, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 shrink-0">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-zinc-400">{entry.name}</span>
                    <span className="text-xs font-semibold text-white ml-auto pl-3">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Task List */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
            <h3 className="text-sm font-semibold text-white mr-auto">All Tasks</h3>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search..."
                  className="bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 w-36 lg:w-48 transition"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <AnimatePresence>
            {tasks.length === 0 ? (
              <div className="text-center py-16">
                <CheckSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-400 text-sm">No tasks yet. Create your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <TaskModal isOpen={modalOpen} onClose={handleCloseModal} task={editTask} />
    </div>
  )
}