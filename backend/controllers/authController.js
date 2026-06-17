const authService = require('../services/authService')

const register = async (request, reply) => {
  try {
    const { name, email, password } = request.body
    const existing = await authService.findUserByEmail(email)
    if (existing) return reply.status(400).send({ message: 'Email already exists' })

    const user = await authService.createUser(name, email, password)
    const token = request.server.jwt.sign({ id: user.id, email: user.email })

    return reply.send({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (err) {
console.error('REGISTER ERROR:', err)
return reply.status(500).send({ message: err.message })  }
}

const login = async (request, reply) => {
  try {
    const { email, password } = request.body
    const user = await authService.findUserByEmail(email)
    if (!user) return reply.status(400).send({ message: 'Invalid credentials' })

    const valid = await authService.verifyPassword(password, user.password)
    if (!valid) return reply.status(400).send({ message: 'Invalid credentials' })

    const token = request.server.jwt.sign({ id: user.id, email: user.email })

    return reply.send({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (err) {
    return reply.status(500).send({ message: err.message })
  }
}

const getMe = async (request, reply) => {
  try {
    const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient()
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: { id: true, name: true, email: true, createdAt: true }
    })
    return reply.send(user)
  } catch (err) {
    return reply.status(500).send({ message: err.message })
  }
}

module.exports = { register, login, getMe }