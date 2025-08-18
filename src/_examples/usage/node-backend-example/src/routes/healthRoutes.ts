import { Router } from 'express'
import { logger } from '../utils/logger'

const router = Router()

router.get('/', (req, res) => {
  logger.info('Health check requested')
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

router.get('/ready', (req, res) => {
  // Add any readiness checks here (database, external services, etc.)
  res.json({
    status: 'ready',
    timestamp: new Date().toISOString()
  })
})

export const healthRoutes = router
