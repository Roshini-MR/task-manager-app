const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async function (fastify, opts) {
  // Get all notifications for current user
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return reply.send(notifications)
  })

  // Mark all as read
  fastify.put('/read-all', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    await prisma.notification.updateMany({
      where: { userId: request.user.id, read: false },
      data: { read: true }
    })
    return reply.send({ message: 'All marked as read' })
  })

  // Mark one as read
  fastify.put('/:id/read', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    await prisma.notification.update({
      where: { id: Number(request.params.id) },
      data: { read: true }
    })
    return reply.send({ message: 'Marked as read' })
  })

  // Unread count
  fastify.get('/unread-count', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const count = await prisma.notification.count({
      where: { userId: request.user.id, read: false }
    })
    return reply.send({ count })
  })
}