const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } })
}

const createUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: { name, email, password: hashed }
  })
}

const verifyPassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed)
}

module.exports = { findUserByEmail, createUser, verifyPassword }