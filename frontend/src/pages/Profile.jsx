import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { User, Lock, Camera, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import useAuthStore from '../store/authStore'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || null)
  const [uploading, setUploading] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' })
  const [savingPassword, setSavingPassword] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/tasks/stats/summary').then(res => setStats(res.data))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0]
      if (!file) return
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await api.post('/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        setAvatar(res.data.avatar)
        const updatedUser = { ...user, avatar: res.data.avatar }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        toast.success('Avatar updated! 🎉')
      } catch (err) {
        toast.error('Upload failed')
      }
      setUploading(false)
    }
  })

  const handleSaveName = async () => {
    if (!name.trim()) return
    setSavingName(true)
    try {
      const res = await api.put('/profile', { name })
      const updatedUser = { ...user, name: res.data.name }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      toast.success('Name updated!')
    } catch (err) {
      toast.error('Failed to update name')
    }
    setSavingName(false)
  }

  const handleChangePassword = async () => {
    if (!passwords.currentPassword || !passwords.newPassword)
      return toast.error('Fill in both fields')
    if (passwords.newPassword.length < 6)
      return toast.error('New password must be at least 6 characters')
    setSavingPassword(true)
    try {
      await api.put('/profile/password', passwords)
      toast.success('Password changed! 🔐')
      setPasswords({ currentPassword: '', newPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    }
    setSavingPassword(false)
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 ml-0 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">

        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* Left — Avatar + Stats */}
          <div className="space-y-4 lg:space-y-6">

            {/* Avatar Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center"
            >
              <div className="relative inline-block mb-4">
                <div
                  {...getRootProps()}
                  className="relative w-24 h-24 rounded-full cursor-pointer group"
                >
                  <input {...getInputProps()} />
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/30">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                {uploading && (
                  <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <p className="text-white font-semibold">{user?.name}</p>
              <p className="text-zinc-400 text-xs mt-1">{user?.email}</p>
              <p className="text-zinc-500 text-xs mt-3">
                {isDragActive ? 'Drop image here...' : 'Click or drag to change photo'}
              </p>

              <div className="mt-4 pt-4 border-t border-zinc-700">
                <p className="text-zinc-500 text-xs">Member since</p>
                <p className="text-zinc-300 text-xs mt-0.5">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                    month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Your Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Tasks', value: stats?.total ?? 0, color: 'text-indigo-300' },
                  { label: 'Completed', value: stats?.done ?? 0, color: 'text-emerald-300' },
                  { label: 'In Progress', value: stats?.inProgress ?? 0, color: 'text-blue-300' },
                  { label: 'High Priority', value: stats?.high ?? 0, color: 'text-red-300' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">{s.label}</span>
                    <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Settings */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">

            {/* Edit Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 lg:p-6"
            >
              <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="w-full bg-zinc-800/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 text-sm cursor-not-allowed"
                  />
                  <p className="text-zinc-600 text-xs mt-1.5">Email cannot be changed</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  {savingName ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </motion.button>
              </div>
            </motion.div>

            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 lg:p-6"
            >
              <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                    <button
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 rounded-xl px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                    <button
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwords.newPassword.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <CheckCircle className={`w-3.5 h-3.5 ${passwords.newPassword.length >= 6 ? 'text-emerald-400' : 'text-zinc-600'}`} />
                      <span className={`text-xs ${passwords.newPassword.length >= 6 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                        At least 6 characters
      </span>
                    </div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  {savingPassword ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  Update Password
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}