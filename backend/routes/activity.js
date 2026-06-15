const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = async function (fastify, opts) {
  // Get activity log
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
const activities = await prisma.activity.findMany({      where: { userId: request.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return reply.send(activities)
  })
}