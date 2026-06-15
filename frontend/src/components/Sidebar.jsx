import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Kanban, LogOut, Zap, Bell, Check, UserCircle, Calendar, Activity, Search, Menu, X } from 'lucide-react'
import useAuthStore from '../store/authStore'
import useNotificationStore from '../store/notificationStore'
import SearchModal from './SearchModal'
import toast from 'react-hot-toast'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/kanban', icon: Kanban, label: 'Kanban Board' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/activity', icon: Activity, label: 'Activity Log' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const { notifications, unreadCount, fetchNotifications, fetchUnreadCount, markAllRead } = useNotificationStore()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    fetchUnreadCount()
    fetchNotifications()

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(true)
      }
      if (e.key === 'Escape') {
        setShowSearch(false)
        setMobileOpen(false)
        setShowNotifs(false)
      }
    }

    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/login')
    setMobileOpen(false)
  }

  const handleBell = () => {
    setShowNotifs(!showNotifs)
    if (!showNotifs && unreadCount > 0) markAllRead()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <span className="text-white font-black text-lg tracking-tight">TaskFlow</span>
            <div className="text-[10px] text-indigo-300 font-medium -mt-0.5">PRO WORKSPACE</div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <button
        onClick={() => { setShowSearch(true); setMobileOpen(false) }}
        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white bg-zinc-800 border border-zinc-700 hover:border-indigo-500/50 hover:bg-zinc-700 transition mb-6"
      >
        <Search className="w-4 h-4 text-indigo-400" />
        <span>Search tasks...</span>
        <span className="ml-auto text-xs bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded">Ctrl+K</span>
      </button>

      {/* Nav */}
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-3 mb-2">Menu</p>
      <nav className="flex-1 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-300' : 'text-zinc-500'}`} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Notifications */}
      <div className="relative mb-3" ref={notifRef}>
        <button
          onClick={handleBell}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-zinc-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-indigo-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-500/50">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          Notifications
          {unreadCount > 0 && (
            <span className="ml-auto text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-12 left-0 w-72 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={markAllRead} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-zinc-500 text-xs text-center py-6">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className={`px-4 py-3 border-b border-zinc-800/50 ${!n.read ? 'bg-indigo-500/5' : ''}`}>
                      <p className="text-xs text-zinc-300">{n.message}</p>
                      <p className="text-[10px] text-zinc-600 mt-1">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User + Logout */}
      <div className="border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-500/30">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-zinc-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-zinc-950 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="text-white font-black">TaskFlow</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-zinc-400 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-zinc-950 border-r border-zinc-800 z-50 px-4 py-6 overflow-y-auto"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 min-h-screen bg-zinc-950 border-r border-zinc-800 flex-col px-4 py-6 fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
    </>
  )
}