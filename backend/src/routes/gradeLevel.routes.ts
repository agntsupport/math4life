import { Router } from 'express'
import { Pool } from 'pg'
import GradeLevelController from '../controllers/gradeLevel.controller'
import { authenticateToken } from '../middlewares/auth'
import { validateRequest } from '../middlewares/validation'
import { body, param, query } from 'express-validator'

const createGradeLevelRoutes = (pool: Pool): Router => {
  const router = Router()
  const gradeLevelController = new GradeLevelController(pool)

  // Validation middleware
  const validateGradeCode = [
    param('code').matches(/^(K|[1-8])$/).withMessage('Invalid grade code. Must be K, 1, 2, 3, 4, 5, 6, 7, or 8')
  ]

  const validateDomainCode = [
    param('domainCode').matches(/^(CC|OA|NBT|NF|MD|G|RP|NS|EE|F|SP)$/)
      .withMessage('Invalid domain code')
  ]

  const validateStudentId = [
    param('studentId').isInt({ min: 1 }).withMessage('Invalid student ID')
  ]

  const validateProgressUpdate = [
    body('standardId').isInt({ min: 1 }).withMessage('Standard ID must be a positive integer'),
    body('score').isFloat({ min: 0, max: 1 }).withMessage('Score must be between 0 and 1'),
    body('timeSpentMinutes').isInt({ min: 0 }).withMessage('Time spent must be a non-negative integer')
  ]

  const validateGradeUpdate = [
    body('gradeCode').matches(/^(K|[1-8])$/).withMessage('Invalid grade code')
  ]

  // Public routes (basic grade level information)
  
  /**
   * GET /api/grade-levels
   * Get all available grade levels
   */
  router.get('/', gradeLevelController.getAllGradeLevels)

  /**
   * GET /api/grade-levels/:code
   * Get specific grade level information
   */
  router.get('/:code', 
    validateGradeCode,
    validateRequest,
    gradeLevelController.getGradeLevelByCode
  )

  /**
   * GET /api/grade-levels/:code/domains
   * Get domains available for a specific grade
   */
  router.get('/:code/domains',
    validateGradeCode,
    validateRequest,
    gradeLevelController.getDomainsForGrade
  )

  /**
   * GET /api/grade-levels/:code/domains/:domainCode/standards
   * Get standards for a specific grade and domain
   */
  router.get('/:code/domains/:domainCode/standards',
    validateGradeCode,
    validateDomainCode,
    validateRequest,
    gradeLevelController.getStandardsForGradeDomain
  )

  // Protected routes (require authentication)

  /**
   * GET /api/grade-levels/:code/stats
   * Get statistics for a grade level (teachers and admins only)
   */
  router.get('/:code/stats',
    authenticateToken,
    validateGradeCode,
    validateRequest,
    gradeLevelController.getGradeLevelStats
  )

  /**
   * GET /api/students/:studentId/grade-level
   * Get current grade level for a student
   */
  router.get('/students/:studentId/grade-level',
    authenticateToken,
    validateStudentId,
    validateRequest,
    gradeLevelController.getStudentGradeLevel
  )

  /**
   * PUT /api/students/:studentId/grade-level
   * Update student's grade level
   */
  router.put('/students/:studentId/grade-level',
    authenticateToken,
    validateStudentId,
    validateGradeUpdate,
    validateRequest,
    gradeLevelController.updateStudentGradeLevel
  )

  /**
   * GET /api/students/:studentId/progress/grade
   * Get student's progress overview for their current grade
   */
  router.get('/students/:studentId/progress/grade',
    authenticateToken,
    validateStudentId,
    validateRequest,
    gradeLevelController.getStudentGradeProgress
  )

  /**
   * GET /api/students/:studentId/recommendations
   * Get recommended next standards for a student
   */
  router.get('/students/:studentId/recommendations',
    authenticateToken,
    validateStudentId,
    [query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')],
    validateRequest,
    gradeLevelController.getRecommendedStandards
  )

  /**
   * POST /api/students/:studentId/progress
   * Record student progress on a standard
   */
  router.post('/students/:studentId/progress',
    authenticateToken,
    validateStudentId,
    validateProgressUpdate,
    validateRequest,
    gradeLevelController.updateStudentProgress
  )

  /**
   * GET /api/students/:studentId/access/:gradeCode
   * Check if student can access specific grade level content
   */
  router.get('/students/:studentId/access/:gradeCode',
    authenticateToken,
    validateStudentId,
    validateGradeCode,
    validateRequest,
    gradeLevelController.checkGradeAccess
  )

  return router
}

export default createGradeLevelRoutes