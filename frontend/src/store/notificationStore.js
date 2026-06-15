import { create } from 'zustand'
import api from '../utils/api'
import socket from '../utils/socket'

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  connectNotifications: (userId) => {
    socket.on('notification:new', (notif) => {
      set({
        notifications: [notif, ...get().notifications],
        unreadCount: get().unreadCount + 1
      })
    })
  },

  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications')
      set({ notifications: res.data })
    } catch (err) {}
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.get('/notifications/unread-count')
      set({ unreadCount: res.data.count })
    } catch (err) {}
  },

  markAllRead: async () => {
    try {
      await api.put('/notifications/read-all')
      set({
        unreadCount: 0,
        notifications: get().notifications.map((n) => ({ ...n, read: true }))
      })
    } catch (err) {}
  }
}))

export default useNotificationStore