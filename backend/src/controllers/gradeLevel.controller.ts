import { Request, Response } from 'express'
import { Pool } from 'pg'
import GradeLevelService from '../models/GradeLevel'

export class GradeLevelController {
  private gradeLevelService: GradeLevelService

  constructor(pool: Pool) {
    this.gradeLevelService = new GradeLevelService(pool)
  }

  /**
   * GET /api/grade-levels
   * Get all available grade levels
   */
  getAllGradeLevels = async (req: Request, res: Response) => {
    try {
      const gradeLevels = await this.gradeLevelService.getAllGradeLevels()
      res.json({
        success: true,
        data: gradeLevels
      })
    } catch (error) {
      console.error('Error fetching grade levels:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch grade levels'
      })
    }
  }

  /**
   * GET /api/grade-levels/:code
   * Get specific grade level by code
   */
  getGradeLevelByCode = async (req: Request, res: Response) => {
    try {
      const { code } = req.params
      const gradeLevel = await this.gradeLevelService.getGradeLevelByCode(code)
      
      if (!gradeLevel) {
        return res.status(404).json({
          success: false,
          error: `Grade level ${code} not found`
        })
      }

      res.json({
        success: true,
        data: gradeLevel
      })
    } catch (error) {
      console.error('Error fetching grade level:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch grade level'
      })
    }
  }

  /**
   * GET /api/grade-levels/:code/domains
   * Get domains for a specific grade level
   */
  getDomainsForGrade = async (req: Request, res: Response) => {
    try {
      const { code } = req.params
      const domains = await this.gradeLevelService.getDomainsForGrade(code)
      
      res.json({
        success: true,
        data: domains
      })
    } catch (error) {
      console.error('Error fetching domains for grade:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch domains'
      })
    }
  }

  /**
   * GET /api/grade-levels/:code/domains/:domainCode/standards
   * Get standards for a specific grade and domain
   */
  getStandardsForGradeDomain = async (req: Request, res: Response) => {
    try {
      const { code, domainCode } = req.params
      const standards = await this.gradeLevelService.getStandardsForGradeDomain(code, domainCode)
      
      res.json({
        success: true,
        data: standards
      })
    } catch (error) {
      console.error('Error fetching standards:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch standards'
      })
    }
  }

  /**
   * GET /api/students/:studentId/grade-level
   * Get current grade level for a student
   */
  getStudentGradeLevel = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const gradeLevel = await this.gradeLevelService.getStudentGradeLevel(parseInt(studentId))
      
      if (!gradeLevel) {
        return res.status(404).json({
          success: false,
          error: 'Student grade level not found'
        })
      }

      res.json({
        success: true,
        data: gradeLevel
      })
    } catch (error) {
      console.error('Error fetching student grade level:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch student grade level'
      })
    }
  }

  /**
   * PUT /api/students/:studentId/grade-level
   * Update student's grade level
   */
  updateStudentGradeLevel = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { gradeCode } = req.body

      if (!gradeCode) {
        return res.status(400).json({
          success: false,
          error: 'Grade code is required'
        })
      }

      const success = await this.gradeLevelService.updateStudentGradeLevel(
        parseInt(studentId), 
        gradeCode
      )

      if (!success) {
        return res.status(404).json({
          success: false,
          error: 'Student or grade level not found'
        })
      }

      res.json({
        success: true,
        message: `Student grade level updated to ${gradeCode}`
      })
    } catch (error) {
      console.error('Error updating student grade level:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update student grade level'
      })
    }
  }

  /**
   * GET /api/students/:studentId/progress/grade
   * Get student's progress overview for their current grade
   */
  getStudentGradeProgress = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const progress = await this.gradeLevelService.getStudentGradeProgress(parseInt(studentId))
      
      res.json({
        success: true,
        data: progress
      })
    } catch (error) {
      console.error('Error fetching student grade progress:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch student progress'
      })
    }
  }

  /**
   * GET /api/students/:studentId/recommendations
   * Get recommended next standards for a student
   */
  getRecommendedStandards = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { limit = 5 } = req.query
      
      const recommendations = await this.gradeLevelService.getRecommendedStandards(
        parseInt(studentId), 
        parseInt(limit as string)
      )
      
      res.json({
        success: true,
        data: recommendations
      })
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recommendations'
      })
    }
  }

  /**
   * POST /api/students/:studentId/progress
   * Record student progress on a standard
   */
  updateStudentProgress = async (req: Request, res: Response) => {
    try {
      const { studentId } = req.params
      const { standardId, score, timeSpentMinutes } = req.body

      if (!standardId || score === undefined || !timeSpentMinutes === undefined) {
        return res.status(400).json({
          success: false,
          error: 'standardId, score, and timeSpentMinutes are required'
        })
      }

      if (score < 0 || score > 1) {
        return res.status(400).json({
          success: false,
          error: 'Score must be between 0 and 1'
        })
      }

      const progress = await this.gradeLevelService.updateStudentProgress(
        parseInt(studentId),
        parseInt(standardId),
        parseFloat(score),
        parseInt(timeSpentMinutes)
      )

      res.json({
        success: true,
        data: progress,
        message: score >= 0.8 ? 'Standard mastered!' : 'Progress recorded'
      })
    } catch (error) {
      console.error('Error updating student progress:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to update student progress'
      })
    }
  }

  /**
   * GET /api/grade-levels/:code/stats
   * Get statistics for a grade level (admin/teacher use)
   */
  getGradeLevelStats = async (req: Request, res: Response) => {
    try {
      const { code } = req.params
      const stats = await this.gradeLevelService.getGradeLevelStats(code)
      
      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      console.error('Error fetching grade level stats:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch grade level statistics'
      })
    }
  }

  /**
   * GET /api/students/:studentId/access/:gradeCode
   * Check if student can access specific grade level content
   */
  checkGradeAccess = async (req: Request, res: Response) => {
    try {
      const { studentId, gradeCode } = req.params
      const canAccess = await this.gradeLevelService.canStudentAccessGrade(
        parseInt(studentId), 
        gradeCode
      )
      
      res.json({
        success: true,
        data: {
          canAccess,
          gradeCode,
          studentId: parseInt(studentId)
        }
      })
    } catch (error) {
      console.error('Error checking grade access:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to check grade access'
      })
    }
  }
}

export default GradeLevelController