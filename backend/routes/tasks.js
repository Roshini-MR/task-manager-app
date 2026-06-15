const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const { getTasks, getTask, createTask, updateTask, deleteTask, getStats } = require('../controllers/taskController')


module.exports = async function (fastify, opts) {
  fastify.get('/stats/summary', { onRequest: [fastify.authenticate] }, getStats)
  fastify.get('/', { onRequest: [fastify.authenticate] }, getTasks)
  fastify.get('/:id', { onRequest: [fastify.authenticate] }, getTask)
  fastify.post('/', { onRequest: [fastify.authenticate] }, createTask)
  fastify.put('/:id', { onRequest: [fastify.authenticate] }, updateTask)
  fastify.delete('/:id', { onRequest: [fastify.authenticate] }, deleteTask)
}

module.exports = async function (fastify, opts) {
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { status, priority, search } = request.query
    const filters = { userId: request.user.id }
    if (status) filters.status = status
    if (priority) filters.priority = priority
    if (search) filters.title = { contains: search, mode: 'insensitive' }
    const tasks = await prisma.task.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    })
    return reply.send(tasks)
  })

  fastify.get('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const task = await prisma.task.findFirst({
      where: { id: Number(request.params.id), userId: request.user.id }
    })
    if (!task) return reply.status(404).send({ message: 'Task not found' })
    return reply.send(task)
  })

  fastify.post('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const { title, description, status, priority, dueDate } = request.body

      const task = await prisma.task.create({
        data: {
          title,
          description,
          status: status || 'todo',
          priority: priority || 'medium',
          dueDate: dueDate ? new Date(dueDate) : null,
          userId: request.user.id
        }
      })

      await prisma.activity.create({
        data: {
          action: 'created',
          detail: `Created task "${title}"`,
          userId: request.user.id
        }
      })

      await prisma.notification.create({
        data: { message: `New task created: "${title}"`, userId: request.user.id }
      })

      if (fastify.io) fastify.io.to(`user_${request.user.id}`).emit('task:created', task)

      return reply.status(201).send(task)
    } catch (err) {
      console.error('CREATE TASK ERROR:', err.message)
      return reply.status(500).send({ message: err.message })
    }
  })

  fastify.put('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const existing = await prisma.task.findFirst({
        where: { id: Number(request.params.id), userId: request.user.id }
      })
      if (!existing) return reply.status(404).send({ message: 'Task not found' })

      const { title, description, status, priority, dueDate } = request.body
      const task = await prisma.task.update({
        where: { id: Number(request.params.id) },
        data: { title, description, status, priority, dueDate: dueDate ? new Date(dueDate) : null }
      })

      if (status && status !== existing.status) {
        await prisma.notification.create({
          data: { message: `Task "${existing.title}" moved to ${status}`, userId: request.user.id }
        })
        await prisma.activity.create({
          data: {
            action: 'moved',
            detail: `Moved "${existing.title}" to ${status}`,
            userId: request.user.id
          }
        })
        if (fastify.io) {
          fastify.io.to(`user_${request.user.id}`).emit('notification:new', {
            message: `Task "${existing.title}" moved to ${status}`
          })
        }
      } else {
        await prisma.activity.create({
          data: {
            action: 'updated',
            detail: `Updated task "${existing.title}"`,
            userId: request.user.id
          }
        })
      }

      if (fastify.io) fastify.io.to(`user_${request.user.id}`).emit('task:updated', task)

      return reply.send(task)
    } catch (err) {
      console.error('UPDATE TASK ERROR:', err.message)
      return reply.status(500).send({ message: err.message })
    }
  })

  fastify.delete('/:id', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const existing = await prisma.task.findFirst({
        where: { id: Number(request.params.id), userId: request.user.id }
      })
      if (!existing) return reply.status(404).send({ message: 'Task not found' })

      await prisma.task.delete({ where: { id: Number(request.params.id) } })

      await prisma.activity.create({
        data: {
          action: 'deleted',
          detail: `Deleted task "${existing.title}"`,
          userId: request.user.id
        }
      })

      if (fastify.io) fastify.io.to(`user_${request.user.id}`).emit('task:deleted', { id: Number(request.params.id) })

      return reply.send({ message: 'Task deleted' })
    } catch (err) {
      console.error('DELETE TASK ERROR:', err.message)
      return reply.status(500).send({ message: err.message })
    }
  })

  fastify.get('/stats/summary', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const userId = request.user.id
    const [total, todo, inProgress, done, high] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: 'todo' } }),
      prisma.task.count({ where: { userId, status: 'in-progress' } }),
      prisma.task.count({ where: { userId, status: 'done' } }),
      prisma.task.count({ where: { userId, priority: 'high' } })
    ])
    return reply.send({ total, todo, inProgress, done, high })
  })
}