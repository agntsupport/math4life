import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import rateLimit from 'express-rate-limit'
import { logger } from './utils/logger'
import mathRoutes from './routes/math.routes'
import healthRoutes from './routes/health.routes'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 4000

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
})

app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', limiter)

app.use('/api/math', mathRoutes)
app.use('/api/health', healthRoutes)

app.get('/api', (_req, res) => {
  res.json({
    message: 'Math4Life API v0.1.0',
    endpoints: {
      math: '/api/math',
      health: '/api/health'
    }
  })
})

io.on('connection', (socket) => {
  logger.info(`New client connected: ${socket.id}`)
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    logger.info(`Socket ${socket.id} joined room ${roomId}`)
  })
  
  socket.on('math-action', (data) => {
    socket.to(data.roomId).emit('math-update', data)
  })
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  })
})

httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
})