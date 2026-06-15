const taskService = require('../services/taskservice')
const activityService = require('../services/activityService')
const notificationService = require('../services/notificationService')

const getTasks = async (request, reply) => {
  try {
    const tasks = await taskService.getAllTasks(request.user.id, request.query)
    return reply.send(tasks)
  } catch (err) {
    return reply.status(500).send({ message: err.message })
  }
}

const getTask = async (request, reply) => {
  try {
    const task = await taskService.getTaskById(request.params.id, request.user.id)
    if (!task) return reply.status(404).send({ message: 'Task not found' })
    return reply.send(task)
  } catch (err) {
    return reply.status(500).send({ message: err.message })
  }
}

const createTask = async (request, reply) => {
  try {
    const task = await taskService.createTask(request.body, request.user.id)

    await activityService.logActivity(request.user.id, 'created', `Created task "${task.title}"`)
    await notificationService.createNotification(request.user.id, `New task created: "${task.title}"`)

    if (request.server.io) {
      request.server.io.to(`user_${request.user.id}`).emit('task:created', task)
    }

    return reply.status(201).send(task)
  } catch (err) {
    console.error('CREATE TASK ERROR:', err.message)
    return reply.status(500).send({ message: err.message })
  }
}

const updateTask = async (request, reply) => {
  try {
    const existing = await taskService.getTaskById(request.params.id, request.user.id)
    if (!existing) return reply.status(404).send({ message: 'Task not found' })

    const task = await taskService.updateTask(request.params.id, request.body)

    if (request.body.status && request.body.status !== existing.status) {
      await notificationService.createNotification(
        request.user.id,
        `Task "${existing.title}" moved to ${request.body.status}`
      )
      await activityService.logActivity(
        request.user.id, 'moved',
        `Moved "${existing.title}" to ${request.body.status}`
      )
      if (request.server.io) {
        request.server.io.to(`user_${request.user.id}`).emit('notification:new', {
          message: `Task "${existing.title}" moved to ${request.body.status}`
        })
      }
    } else {
      await activityService.logActivity(
        request.user.id, 'updated',
        `Updated task "${existing.title}"`
      )
    }

    if (request.server.io) {
      request.server.io.to(`user_${request.user.id}`).emit('task:updated', task)
    }

    return reply.send(task)
  } catch (err) {
    console.error('UPDATE TASK ERROR:', err.message)
    return reply.status(500).send({ message: err.message })
  }
}

const deleteTask = async (request, reply) => {
  try {
    const existing = await taskService.getTaskById(request.params.id, request.user.id)
    if (!existing) return reply.status(404).send({ message: 'Task not found' })

    await taskService.deleteTask(request.params.id)
    await activityService.logActivity(
      request.user.id, 'deleted',
      `Deleted task "${existing.title}"`
    )

    if (request.server.io) {
      request.server.io.to(`user_${request.user.id}`).emit('task:deleted', {
        id: Number(request.params.id)
      })
    }

    return reply.send({ message: 'Task deleted' })
  } catch (err) {
    console.error('DELETE TASK ERROR:', err.message)
    return reply.status(500).send({ message: err.message })
  }
}

const getStats = async (request, reply) => {
  try {
    const stats = await taskService.getStats(request.user.id)
    return reply.send(stats)
  } catch (err) {
    return reply.status(500).send({ message: err.message })
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getStats }