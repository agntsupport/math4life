import { Router } from 'express'
import { Pool } from 'pg'
import LessonController from '../controllers/lesson.controller'

const createLessonRoutes = (pool: Pool): Router => {
  const router = Router()
  const lessonController = new LessonController(pool)

  // Lesson routes
  router.get('/standards/:standardId/lessons', lessonController.getLessonsForStandard)
  router.get('/lessons/:lessonId', lessonController.getLesson)
  router.get('/lessons/:lessonId/problems', lessonController.getProblemsForLesson)
  router.get('/lessons/:lessonId/progress/:studentId', lessonController.getLessonProgress)
  router.post('/lessons/:lessonId/start', lessonController.startLesson)
  router.post('/lessons/:lessonId/complete', lessonController.completeLesson)

  // Problem routes
  router.post('/problems/:problemId/submit', lessonController.submitProblemAnswer)

  return router
}

export default createLessonRoutes