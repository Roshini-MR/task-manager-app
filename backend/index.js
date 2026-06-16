const fastify = require('fastify')({ logger: false })
const cors = require('@fastify/cors')
const jwt = require('@fastify/jwt')
const path = require('path')
const { Server } = require('socket.io')

fastify.register(cors, {
 origin: ['http://localhost:5173', 'https://task-manager-app-inky-chi.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

fastify.register(jwt, {
secret: process.env.JWT_SECRET || 'taskmanager_secret_key_2024'
})

fastify.register(require('@fastify/multipart'))

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'uploads'),
  prefix: '/uploads/'
})

fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.send(err)
  }
})

fastify.decorate('io', null)

fastify.register(require('./routes/auth'), { prefix: '/api/auth' })
fastify.register(require('./routes/tasks'), { prefix: '/api/tasks' })
fastify.register(require('./routes/notifications'), { prefix: '/api/notifications' })
fastify.register(require('./routes/profile'), { prefix: '/api/profile' })
fastify.register(require('./routes/activity'), { prefix: '/api/activity' })

const start = async () => {
  try {
    await fastify.ready()

    const io = new Server(fastify.server, {
      cors: {
     origin: ['http://localhost:5173', 'https://task-manager-app-inky-chi.vercel.app'],
        methods: ['GET', 'POST']
      }
    })

    fastify.io = io

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)
      socket.on('join', (userId) => {
        socket.join(`user_${userId}`)
        console.log(`User ${userId} joined`)
      })
      socket.on('disconnect', () => {
        console.log('Client disconnected')
      })
    })

fastify.server.listen(process.env.PORT || 5000, '0.0.0.0', () => {
      console.log('Server running on port 5000')
    })

  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()