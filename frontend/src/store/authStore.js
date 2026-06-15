import { create } from 'zustand'
import api from '../utils/api'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      set({ user: res.data.user, token: res.data.token, loading: false })
      return { success: true }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false })
      return { success: false }
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null })
    try {
      const res = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      set({ user: res.data.user, token: res.data.token, loading: false })
      return { success: true }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Register failed', loading: false })
      return { success: false }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  }
}))

export default useAuthStore