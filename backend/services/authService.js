const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { sendWelcomeEmail } = require('./email')

const prisma = new PrismaClient()

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } })
}

const createUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  })

  try {
    await sendWelcomeEmail(email, name)
  } catch (err) {
    console.error('Welcome email failed:', err.message)
  }

  return user
}

const verifyPassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed)
}

module.exports = { findUserByEmail, createUser, verifyPassword }