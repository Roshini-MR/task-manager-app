const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const logActivity = async (userId, action, detail) => {
  return await prisma.activity.create({
    data: { action, detail, userId }
  })
}

const getActivities = async (userId, limit = 20) => {
  return await prisma.activity.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit
  })
}

module.exports = { logActivity, getActivities }