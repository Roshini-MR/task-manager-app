import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, CheckCircle, LayoutDashboard, Kanban, Calendar, Activity, ArrowRight, Bell, Plus, Circle } from 'lucide-react'

const features = [
  { icon: LayoutDashboard, title: 'Smart Dashboard', desc: 'Beautiful charts and stats showing your productivity at a glance.' },
  { icon: Kanban, title: 'Kanban Board', desc: 'Drag and drop tasks between columns like a pro.' },
  { icon: Calendar, title: 'Calendar View', desc: 'See all your tasks organized by due date.' },
  { icon: Activity, title: 'Activity Log', desc: 'Full history of every action you take.' },
]

function AppMockup() {
  return (
    <div className="w-full bg-zinc-900 rounded-2xl border border-zinc-700 overflow-hidden shadow-2xl shadow-indigo-500/10">
      {/* Mockup top bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <div className="flex-1 mx-4 bg-zinc-800 rounded-md h-5" />
      </div>
      {/* Mockup content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden sm:flex w-36 bg-zinc-950 border-r border-zinc-800 flex-col p-3 gap-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600" />
            <div className="h-3 bg-zinc-700 rounded w-14" />
          </div>
          {['Dashboard', 'Kanban', 'Calendar', 'Activity'].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg ${i === 0 ? 'bg-indigo-500/20' : ''}`}>
              <div className={`w-3 h-3 rounded ${i === 0 ? 'bg-indigo-400' : 'bg-zinc-600'}`} />
              <div className={`h-2 rounded w-14 ${i === 0 ? 'bg-indigo-400/50' : 'bg-zinc-700'}`} />
            </div>
          ))}
        </div>
        {/* Main content */}
        <div className="flex-1 p-4">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Total', value: '8', color: 'bg-indigo-500/20 border-indigo-500/30' },
              { label: 'Todo', value: '3', color: 'bg-zinc-800 border-zinc-700' },
              { label: 'In Progress', value: '2', color: 'bg-yellow-500/20 border-yellow-500/30' },
              { label: 'Done', value: '3', color: 'bg-emerald-500/20 border-emerald-500/30' },
            ].map((stat, i) => (
              <div key={i} className={`rounded-xl border p-2 ${stat.color}`}>
                <div className="text-xs text-zinc-500 mb-1">{stat.label}</div>
                <div className="text-lg font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
          {/* Kanban columns */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { title: 'Todo', color: 'border-zinc-700', tasks: ['Setup DB', 'Write tests'] },
              { title: 'In Progress', color: 'border-yellow-500/30', tasks: ['Build API'] },
              { title: 'Done', color: 'border-emerald-500/30', tasks: ['JWT Auth', 'UI Design', 'Deploy'] },
            ].map((col, i) => (
              <div key={i} className={`bg-zinc-800/50 rounded-xl border ${col.color} p-2`}>
                <div className="text-xs font-semibold text-zinc-400 mb-2">{col.title}</div>
                {col.tasks.map((task, j) => (
                  <div key={j} className="bg-zinc-800 rounded-lg p-2 mb-1.5 border border-zinc-700">
                    <div className="text-xs text-zinc-300 truncate">{task}</div>
                    <div className="flex gap-1 mt-1">
                      <div className="h-1.5 w-8 bg-indigo-500/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-zinc-800/50 backdrop-blur bg-[#0a0a0a]/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-white font-black text-lg">TaskFlow</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-3 sm:px-4 py-2 text-sm text-zinc-400 hover:text-white transition"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-3 sm:px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition font-medium"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-32 sm:pt-40 pb-16">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] sm:h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs sm:text-sm text-indigo-400 mb-6">
            <Zap className="w-3.5 h-3.5" />
            Full-stack Task Management App
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Manage tasks like
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              a pro
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-8 sm:mb-10">
            TaskFlow helps you organize, track, and complete tasks with a beautiful Kanban board, real-time updates, and smart analytics.
          </p>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition text-sm"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-semibold transition text-sm"
            >
              Sign In
            </button>
          </div>

          {/* App Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none bottom-0 h-1/3 top-auto" />
            <AppMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-4 sm:px-8 py-12 border-t border-zinc-800/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '10+', label: 'Features' },
            { value: 'Real-time', label: 'Updates' },
            { value: 'JWT', label: 'Secure Auth' },
            { value: 'REST API', label: 'Backend' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-8 py-16 sm:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Everything you need</h2>
          <p className="text-zinc-500 text-sm sm:text-base">Built with modern tech stack for maximum productivity.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 sm:p-6 hover:border-indigo-500/30 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{title}</h3>
              <p className="text-zinc-500 text-xs sm:text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 sm:px-8 py-12 sm:py-16 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-600 text-xs sm:text-sm uppercase tracking-widest mb-6">Built with</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {['React', 'Fastify', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Socket.io', 'JWT', 'Nodemailer'].map((tech, i) => (
              <span key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs sm:text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-8 py-16 sm:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to get started?</h2>
          <p className="text-zinc-500 mb-8 text-sm sm:text-base">Create your free account and start managing tasks today.</p>
          <button
            onClick={() => navigate('/register')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition text-sm"
          >
            Create Free Account
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-4 sm:px-8 py-6 text-center text-zinc-600 text-xs sm:text-sm">
        Built with ❤️ using React + Fastify + PostgreSQL
      </footer>
    </div>
  )
}