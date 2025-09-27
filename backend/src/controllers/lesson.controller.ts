import { Request, Response } from 'express'
import { Pool } from 'pg'

export class LessonController {
  private pool: Pool

  constructor(pool: Pool) {
    this.pool = pool
  }

  /**
   * GET /api/standards/:standardId/lessons
   * Get all lessons for a specific standard
   */
  getLessonsForStandard = async (req: Request, res: Response) => {
    try {
      const { standardId } = req.params
      
      const query = `
        SELECT 
          l.id,
          l.title,
          l.description,
          l.content,
          l.difficulty_level as "difficultyLevel",
          l.estimated_minutes as "estimatedMinutes",
          l.learning_objectives as "learningObjectives",
          l.materials_needed as "materialsNeeded",
          l.is_published as "isPublished",
          l.created_at as "createdAt",
          l.updated_at as "updatedAt",
          lt.code as "lessonTypeCode",
          lt.name as "lessonTypeName",
          lt.icon as "lessonTypeIcon",
          lt.color as "lessonTypeColor",
          s.code as "standardCode",
          s.title as "standardTitle"
        FROM lessons l
        JOIN lesson_types lt ON l.lesson_type_id = lt.id
        JOIN standards s ON l.standard_id = s.id
        WHERE l.standard_id = $1 AND l.is_published = true
        ORDER BY l.difficulty_level, l.created_at
      `
      
      const result = await this.pool.query(query, [standardId])
      
      res.json({
        success: true,
        data: result.rows
      })
    } catch (error) {
      console.error('Error fetching lessons for standard:', error)
      res.status(500).json({
        success: false,
        error: 'Failed to fetch lessons'
      })
    }
  }

  /**
   * GET /api/lessons/:lessonId
   * Get a specific lesson with its content
   */
  getLesson = async (req: Request, res: Response) => {
    try {
      const { lessonId } = req.params
      
      const query = `
        SELECT 
          l.id,
          l.title,
          l.description,
          l.content,
          l.difficulty_level as "difficultyLevel",
          l.estimated_minutes as "estimatedMinutes",
          l.learning_objectives as "learningObjectives",
          l.materials_needed as "materialsNeeded",
          l.is_published as "isPublished",
          l.created_at as "createdAt",
          l.updated_at as "updatedAt",
          lt.code as "lessonTypeCode",
          lt.name as "lessonTypeName",
          lt.icon as "lessonTypeIcon",
          lt.color as "lessonTypeColor",
          s.id as "standardId",
          s.code as "standardCode",
          s.title as "standardTitle",
          s.description as "standardDescription"
        FROM lessons l
        JOIN lesson_types lt ON l.lesson_type_id = lt.id
        JOIN standards s ON l.standard_id = s.id
        WHERE l.id = $1 AND l.is_published = true
      `
      
      const result = await this.pool.query(query, [lessonId])
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Lesson not found'
        })
      }
      
      return res.json({
        success: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error('Error fetching lesson:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch lesson'
      })
    }
  }

  /**
   * GET /api/lessons/:lessonId/problems
   * Get all problems for a specific lesson
   */
  getProblemsForLesson = async (req: Request, res: Response) => {
    try {
      const { lessonId } = req.params
      
      const query = `
        SELECT 
          p.id,
          p.problem_type as "problemType",
          p.question_text as "questionText",
          p.question_data as "questionData",
          p.correct_answer as "correctAnswer",
          p.hints,
          p.explanation,
          p.difficulty,
          p.points,
          p.order_in_lesson as "orderInLesson",
          p.created_at as "createdAt"
        FROM problems p
        WHERE p.lesson_id = $1
        ORDER BY p.order_in_lesson, p.id
      `
      
      const result = await this.pool.query(query, [lessonId])
      
      return res.json({
        success: true,
        data: result.rows
      })
    } catch (error) {
      console.error('Error fetching problems for lesson:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch problems'
      })
    }
  }

  /**
   * POST /api/problems/:problemId/submit
   * Submit an answer to a problem
   */
  submitProblemAnswer = async (req: Request, res: Response) => {
    try {
      const { problemId } = req.params
      const { studentId, answer, timeSpentSeconds, hintsUsed = 0 } = req.body

      if (!answer || timeSpentSeconds === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Answer and time spent are required'
        })
      }

      // Get problem details
      const problemQuery = `
        SELECT 
          p.correct_answer as "correctAnswer",
          p.points,
          p.explanation,
          p.problem_type as "problemType",
          p.lesson_id as "lessonId"
        FROM problems p
        WHERE p.id = $1
      `
      
      const problemResult = await this.pool.query(problemQuery, [problemId])
      
      if (problemResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Problem not found'
        })
      }
      
      const problem = problemResult.rows[0]
      
      // Check if answer is correct
      const isCorrect = this.checkAnswer(answer, problem.correctAnswer, problem.problemType)
      const pointsEarned = isCorrect ? problem.points : Math.floor(problem.points * 0.5) // Partial credit
      
      // Get current attempt number
      const attemptQuery = `
        SELECT COUNT(*) + 1 as attempt_number
        FROM problem_attempts
        WHERE student_id = $1 AND problem_id = $2
      `
      
      const attemptResult = await this.pool.query(attemptQuery, [studentId, problemId])
      const attemptNumber = parseInt(attemptResult.rows[0].attempt_number)
      
      // Record the attempt
      const insertQuery = `
        INSERT INTO problem_attempts (
          student_id, problem_id, student_answer, is_correct, 
          points_earned, time_spent_seconds, hints_used, attempt_number
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, attempted_at as "attemptedAt"
      `
      
      const insertResult = await this.pool.query(insertQuery, [
        studentId, problemId, JSON.stringify(answer), isCorrect,
        pointsEarned, timeSpentSeconds, hintsUsed, attemptNumber
      ])
      
      return res.json({
        success: true,
        data: {
          isCorrect,
          pointsEarned,
          explanation: problem.explanation,
          attemptNumber,
          attemptId: insertResult.rows[0].id,
          attemptedAt: insertResult.rows[0].attemptedAt
        }
      })
    } catch (error) {
      console.error('Error submitting problem answer:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to submit answer'
      })
    }
  }

  /**
   * GET /api/lessons/:lessonId/progress/:studentId
   * Get student's progress on a lesson
   */
  getLessonProgress = async (req: Request, res: Response) => {
    try {
      const { lessonId, studentId } = req.params
      
      const query = `
        SELECT 
          lp.status,
          lp.score,
          lp.time_spent_minutes as "timeSpentMinutes",
          lp.started_at as "startedAt",
          lp.completed_at as "completedAt",
          lp.attempts,
          lp.created_at as "createdAt",
          lp.updated_at as "updatedAt"
        FROM lesson_progress lp
        WHERE lp.lesson_id = $1 AND lp.student_id = $2
      `
      
      const result = await this.pool.query(query, [lessonId, studentId])
      
      if (result.rows.length === 0) {
        return res.json({
          success: true,
          data: {
            status: 'not_started',
            score: null,
            timeSpentMinutes: 0,
            attempts: 0
          }
        })
      }
      
      return res.json({
        success: true,
        data: result.rows[0]
      })
    } catch (error) {
      console.error('Error fetching lesson progress:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch lesson progress'
      })
    }
  }

  /**
   * POST /api/lessons/:lessonId/start
   * Start a lesson for a student
   */
  startLesson = async (req: Request, res: Response) => {
    try {
      const { lessonId } = req.params
      const { studentId } = req.body

      if (!studentId) {
        return res.status(400).json({
          success: false,
          error: 'Student ID is required'
        })
      }

      const query = `
        INSERT INTO lesson_progress (
          student_id, lesson_id, status, started_at
        ) VALUES ($1, $2, 'in_progress', CURRENT_TIMESTAMP)
        ON CONFLICT (student_id, lesson_id) DO UPDATE SET
          status = 'in_progress',
          attempts = lesson_progress.attempts + 1,
          updated_at = CURRENT_TIMESTAMP
        RETURNING 
          status,
          attempts,
          started_at as "startedAt",
          updated_at as "updatedAt"
      `
      
      const result = await this.pool.query(query, [studentId, lessonId])
      
      return res.json({
        success: true,
        data: result.rows[0],
        message: 'Lesson started successfully'
      })
    } catch (error) {
      console.error('Error starting lesson:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to start lesson'
      })
    }
  }

  /**
   * POST /api/lessons/:lessonId/complete
   * Complete a lesson for a student
   */
  completeLesson = async (req: Request, res: Response) => {
    try {
      const { lessonId } = req.params
      const { studentId, score, timeSpentMinutes } = req.body

      if (!studentId || score === undefined || timeSpentMinutes === undefined) {
        return res.status(400).json({
          success: false,
          error: 'Student ID, score, and time spent are required'
        })
      }

      const query = `
        UPDATE lesson_progress SET
          status = 'completed',
          score = $3,
          time_spent_minutes = time_spent_minutes + $4,
          completed_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE student_id = $1 AND lesson_id = $2
        RETURNING 
          status,
          score,
          time_spent_minutes as "timeSpentMinutes",
          completed_at as "completedAt",
          attempts
      `
      
      const result = await this.pool.query(query, [studentId, lessonId, score, timeSpentMinutes])
      
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Lesson progress not found. Please start the lesson first.'
        })
      }
      
      return res.json({
        success: true,
        data: result.rows[0],
        message: score >= 80 ? 'Lesson completed successfully!' : 'Lesson completed. Consider reviewing for better understanding.'
      })
    } catch (error) {
      console.error('Error completing lesson:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to complete lesson'
      })
    }
  }

  /**
   * Helper method to check if an answer is correct
   */
  private checkAnswer(studentAnswer: any, correctAnswer: any, problemType: string): boolean {
    try {
      const correct = typeof correctAnswer === 'string' ? JSON.parse(correctAnswer) : correctAnswer
      
      switch (problemType) {
        case 'multiple_choice':
          return studentAnswer.selected === correct.correct || studentAnswer === correct.correct
          
        case 'interactive':
          if (correct.sequence) {
            return JSON.stringify(studentAnswer.sequence) === JSON.stringify(correct.sequence)
          }
          if (correct.answer !== undefined) {
            return studentAnswer.answer === correct.answer || studentAnswer === correct.answer
          }
          return JSON.stringify(studentAnswer) === JSON.stringify(correct)
          
        case 'open_ended':
          if (correct.answer !== undefined) {
            return Math.abs(studentAnswer.answer - correct.answer) < 0.01 // Allow small floating point differences
          }
          return studentAnswer.answer === correct.answer
          
        default:
          return JSON.stringify(studentAnswer) === JSON.stringify(correct)
      }
    } catch (error) {
      console.error('Error checking answer:', error)
      return false
    }
  }
}

export default LessonController