const { PrismaClient } = require('@prisma/client')
const path = require('path')
const fs = require('fs')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

module.exports = async function (fastify, opts) {
  // Get profile
  fastify.get('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: { id: true, name: true, email: true, avatar: true, createdAt: true }
    })
    return reply.send(user)
  })

  // Update name
  fastify.put('/', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { name } = request.body
    const user = await prisma.user.update({
      where: { id: request.user.id },
      data: { name },
      select: { id: true, name: true, email: true, avatar: true }
    })
    return reply.send(user)
  })

  // Upload avatar
  fastify.post('/avatar', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const data = await request.file()
    if (!data) return reply.status(400).send({ message: 'No file uploaded' })

    const ext = path.extname(data.filename)
    const filename = `avatar_${request.user.id}_${Date.now()}${ext}`
    const uploadPath = path.join(__dirname, '..', 'uploads', filename)

    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(uploadPath)
      data.file.pipe(writeStream)
      writeStream.on('finish', resolve)
      writeStream.on('error', reject)
    })

    const avatarUrl = `http://localhost:5000/uploads/${filename}`

    const user = await prisma.user.update({
      where: { id: request.user.id },
      data: { avatar: avatarUrl },
      select: { id: true, name: true, email: true, avatar: true }
    })

    return reply.send(user)
  })

  // Change password
  fastify.put('/password', { onRequest: [fastify.authenticate] }, async (request, reply) => {
    const { currentPassword, newPassword } = request.body

    if (!currentPassword || !newPassword) {
      return reply.status(400).send({ message: 'Both fields are required' })
    }

    try {
      const user = await prisma.user.findUnique({ where: { id: request.user.id } })
      const valid = await bcrypt.compare(currentPassword, user.password)
      if (!valid) return reply.status(400).send({ message: 'Current password is incorrect' })

      const hashed = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({
        where: { id: request.user.id },
        data: { password: hashed }
      })

      return reply.send({ message: 'Password updated successfully' })
    } catch (err) {
      console.error(err)
      return reply.status(500).send({ message: 'Server error' })
    }
  })
}