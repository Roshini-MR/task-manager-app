import { create } from 'zustand'
import api from '../utils/api'
import socket from '../utils/socket'

const useTaskStore = create((set, get) => ({
  tasks: [],
  stats: null,
  loading: false,
  error: null,

  connectSocket: (userId) => {
    socket.connect()
    socket.emit('join', userId)

    socket.on('task:created', (task) => {
      set({ tasks: [task, ...get().tasks] })
      get().fetchStats()
    })

    socket.on('task:updated', (updatedTask) => {
      set({
        tasks: get().tasks.map((t) => t.id === updatedTask.id ? updatedTask : t)
      })
      get().fetchStats()
    })

    socket.on('task:deleted', ({ id }) => {
      set({ tasks: get().tasks.filter((t) => t.id !== id) })
      get().fetchStats()
    })
  },

  disconnectSocket: () => {
    socket.off('task:created')
    socket.off('task:updated')
    socket.off('task:deleted')
    socket.disconnect()
  },

  fetchTasks: async (filters = {}) => {
    set({ loading: true })
    try {
      const params = new URLSearchParams(filters).toString()
      const res = await api.get(`/tasks?${params}`)
      set({ tasks: res.data, loading: false })
    } catch (err) {
      set({ error: 'Failed to fetch tasks', loading: false })
    }
  },

  fetchStats: async () => {
    try {
      const res = await api.get('/tasks/stats/summary')
      set({ stats: res.data })
    } catch (err) {
      set({ error: 'Failed to fetch stats' })
    }
  },

  createTask: async (data) => {
    try {
      await api.post('/tasks', data)
      return { success: true }
    } catch (err) {
      return { success: false }
    }
  },

  updateTask: async (id, data) => {
    try {
      await api.put(`/tasks/${id}`, data)
      return { success: true }
    } catch (err) {
      return { success: false }
    }
  },

  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      return { success: true }
    } catch (err) {
      return { success: false }
    }
  }
}))

export default useTaskStore