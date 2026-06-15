const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createNotification = async (userId, message) => {
  return await prisma.notification.create({
    data: { message, userId }
  })
}

const getNotifications = async (userId, limit = 20) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  })
}

const getUnreadCount = async (userId) => {
  return await prisma.notification.count({
    where: { userId, read: false }
  })
}

const markAllRead = async (userId) => {
  return await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  })
}

module.exports = { createNotification, getNotifications, getUnreadCount, markAllRead }