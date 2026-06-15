const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getAllTasks = async (userId, filters = {}) => {
  const where = { userId }
  if (filters.status) where.status = filters.status
  if (filters.priority) where.priority = filters.priority
  if (filters.search) where.title = { contains: filters.search, mode: 'insensitive' }

  return await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
}

const getTaskById = async (id, userId) => {
  return await prisma.task.findFirst({
    where: { id: Number(id), userId }
  })
}

const createTask = async (data, userId) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId
    }
  })
}

const updateTask = async (id, data) => {
  return await prisma.task.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null
    }
  })
}

const deleteTask = async (id) => {
  return await prisma.task.delete({
    where: { id: Number(id) }
  })
}

const getStats = async (userId) => {
  const [total, todo, inProgress, done, high] = await Promise.all([
    prisma.task.count({ where: { userId } }),
    prisma.task.count({ where: { userId, status: 'todo' } }),
    prisma.task.count({ where: { userId, status: 'in-progress' } }),
    prisma.task.count({ where: { userId, status: 'done' } }),
    prisma.task.count({ where: { userId, priority: 'high' } })
  ])
  return { total, todo, inProgress, done, high }
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getStats }