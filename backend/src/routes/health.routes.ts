import { Router } from 'express'

const router = Router()

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

router.get('/ping', (_req, res) => {
  res.send('pong')
})

router.post('/seed', async (_req, res) => {
  try {
    const { seedData } = require('../../scripts/seed-data')
    await seedData()
    res.json({
      success: true,
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Manual seeding failed:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

export default router