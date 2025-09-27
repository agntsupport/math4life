import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import rateLimit from 'express-rate-limit'
import { Pool } from 'pg'
import { logger } from './utils/logger'
import mathRoutes from './routes/math.routes'
import healthRoutes from './routes/health.routes'
import createGradeLevelRoutes from './routes/gradeLevel.routes'
import createLessonRoutes from './routes/lesson.routes'

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
  max: 1000, // Increased for development/testing
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

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'math4life',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test database connection and initialize if needed
pool.connect()
  .then(async client => {
    logger.info('Database connected successfully')
    
    // Check if database is initialized
    try {
      const result = await client.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'grade_levels'
      `)
      
      if (result.rows.length === 0) {
        logger.info('Database not initialized, running initialization...')
        // Import and run initialization  
        const { initDatabase } = require('../scripts/init-db')
        await initDatabase()
        logger.info('Database initialization completed')
      } else {
        logger.info('Database already initialized')
      }
    } catch (error) {
      logger.error('Database initialization check failed:', error)
    }
    
    client.release()
  })
  .catch(err => {
    logger.error('Database connection failed:', err)
  })

// Routes
app.use('/api/math', mathRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/grade-levels', createGradeLevelRoutes(pool))
app.use('/api', createLessonRoutes(pool))

app.get('/api', (_req, res) => {
  res.json({
    message: 'Math4Life API v0.1.0 - K-8 Curriculum System',
    endpoints: {
      math: '/api/math',
      health: '/api/health',
      gradeLevels: '/api/grade-levels',
      curriculum: '/api/grade-levels/:code/domains',
      lessons: '/api/standards/:standardId/lessons',
      problems: '/api/lessons/:lessonId/problems'
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