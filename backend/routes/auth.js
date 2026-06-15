const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const { sendWelcomeEmail } = require('../services/email')
const prisma = new PrismaClient()

module.exports = async function (fastify, opts) {
  fastify.post('/register', async (request, reply) => {
    const { name, email, password } = request.body
    try {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return reply.status(400).send({ message: 'Email already exists' })
      const hashed = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: { name, email, password: hashed }
      })
      const token = fastify.jwt.sign({ id: user.id, email: user.email })

      // Send welcome email in background
      setTimeout(() => {
        sendWelcomeEmail(email, name).catch(() => {})
      }, 0)

      return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      return reply.status(500).send({ message: 'Server error' })
    }
  })

  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return reply.status(400).send({ message: 'Invalid credentials' })
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return reply.status(400).send({ message: 'Invalid credentials' })
      const token = fastify.jwt.sign({ id: user.id, email: user.email })
      return reply.send({ token, user: { id: user.id, name: user.name, email: user.email } })
    } catch (err) {
      return reply.status(500).send({ message: 'Server error' })
    }
  })

  fastify.get('/me', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: request.user.id },
        select: { id: true, name: true, email: true, createdAt: true }
      })
      return reply.send(user)
    } catch (err) {
      return reply.status(500).send({ message: 'Server error' })
    }
  })
}