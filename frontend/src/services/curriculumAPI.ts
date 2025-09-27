import axios from 'axios'
import { 
  ApiResponse, 
  GradeLevel, 
  Domain, 
  Standard, 
  GradeProgress, 
  LearningPath, 
  AdaptiveFeedback, 
  Lesson,
  LessonProgress,
  Problem,
  Assessment,
  AssessmentResult
} from '../types/curriculum'

// Base API configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const curriculumAPI = {
  // Grade Level endpoints
  async getGradeLevels(): Promise<ApiResponse<GradeLevel[]>> {
    try {
      const response = await api.get('/grade-levels')
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch grade levels'
      }
    }
  },

  async getGradeLevel(code: string): Promise<ApiResponse<GradeLevel>> {
    try {
      const response = await api.get(`/grade-levels/${code}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch grade level'
      }
    }
  },

  async getDomainsForGrade(gradeCode: string): Promise<ApiResponse<Domain[]>> {
    try {
      const response = await api.get(`/grade-levels/${gradeCode}/domains`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch domains'
      }
    }
  },

  async getStandardsForGradeDomain(gradeCode: string, domainCode: string): Promise<ApiResponse<Standard[]>> {
    try {
      const response = await api.get(`/grade-levels/${gradeCode}/domains/${domainCode}/standards`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch standards'
      }
    }
  },

  async getGradeLevelStats(gradeCode: string): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/grade-levels/${gradeCode}/stats`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch grade level stats'
      }
    }
  },

  // Student Progress endpoints
  async getStudentGradeLevel(studentId: number): Promise<ApiResponse<GradeLevel>> {
    try {
      const response = await api.get(`/grade-levels/students/${studentId}/grade-level`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch student grade level'
      }
    }
  },

  async updateStudentGradeLevel(studentId: number, gradeCode: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.put(`/grade-levels/students/${studentId}/grade-level`, { gradeCode })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update student grade level'
      }
    }
  },

  async getStudentGradeProgress(studentId: number): Promise<ApiResponse<GradeProgress>> {
    try {
      const response = await api.get(`/grade-levels/students/${studentId}/progress/grade`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch student progress'
      }
    }
  },

  async getRecommendedStandards(studentId: number, limit?: number): Promise<ApiResponse<LearningPath>> {
    try {
      const params = limit ? { limit } : {}
      const response = await api.get(`/grade-levels/students/${studentId}/recommendations`, { params })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch recommendations'
      }
    }
  },

  async updateStudentProgress(
    studentId: number, 
    standardId: number, 
    score: number, 
    timeSpentMinutes: number
  ): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(`/grade-levels/students/${studentId}/progress`, {
        standardId,
        score,
        timeSpentMinutes
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update student progress'
      }
    }
  },

  async checkGradeAccess(studentId: number, gradeCode: string): Promise<ApiResponse<{ canAccess: boolean }>> {
    try {
      const response = await api.get(`/grade-levels/students/${studentId}/access/${gradeCode}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to check grade access'
      }
    }
  },

  // Lesson endpoints
  async getLessonsForStandard(standardId: number): Promise<ApiResponse<Lesson[]>> {
    try {
      const response = await api.get(`/standards/${standardId}/lessons`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch lessons'
      }
    }
  },

  async getLesson(lessonId: number): Promise<ApiResponse<Lesson>> {
    try {
      const response = await api.get(`/lessons/${lessonId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch lesson'
      }
    }
  },

  async getLessonProgress(studentId: number, lessonId: number): Promise<ApiResponse<LessonProgress>> {
    try {
      const response = await api.get(`/lessons/${lessonId}/progress/${studentId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch lesson progress'
      }
    }
  },

  async startLesson(studentId: number, lessonId: number): Promise<ApiResponse<LessonProgress>> {
    try {
      const response = await api.post(`/lessons/${lessonId}/start`, { studentId })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to start lesson'
      }
    }
  },

  async completeLesson(
    studentId: number, 
    lessonId: number, 
    score: number, 
    timeSpentMinutes: number
  ): Promise<ApiResponse<LessonProgress>> {
    try {
      const response = await api.post(`/lessons/${lessonId}/complete`, {
        studentId,
        score,
        timeSpentMinutes
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to complete lesson'
      }
    }
  },

  // Problem endpoints
  async getProblemsForLesson(lessonId: number): Promise<ApiResponse<Problem[]>> {
    try {
      const response = await api.get(`/lessons/${lessonId}/problems`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch problems'
      }
    }
  },

  async submitProblemAnswer(
    studentId: number,
    problemId: number,
    answer: any,
    timeSpentSeconds: number,
    hintsUsed: number = 0
  ): Promise<ApiResponse<{ isCorrect: boolean; pointsEarned: number; explanation?: string }>> {
    try {
      const response = await api.post(`/problems/${problemId}/submit`, {
        studentId,
        answer,
        timeSpentSeconds,
        hintsUsed
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to submit answer'
      }
    }
  },

  // Assessment endpoints
  async getAssessmentsForGrade(gradeCode: string): Promise<ApiResponse<Assessment[]>> {
    try {
      const response = await api.get(`/assessments/grade/${gradeCode}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assessments'
      }
    }
  },

  async getAssessment(assessmentId: number): Promise<ApiResponse<Assessment>> {
    try {
      const response = await api.get(`/assessments/${assessmentId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assessment'
      }
    }
  },

  async startAssessment(studentId: number, assessmentId: number): Promise<ApiResponse<{ sessionId: string }>> {
    try {
      const response = await api.post(`/assessments/${assessmentId}/start`, { studentId })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to start assessment'
      }
    }
  },

  async submitAssessment(
    studentId: number,
    assessmentId: number,
    answers: any[],
    timeSpentMinutes: number
  ): Promise<ApiResponse<AssessmentResult>> {
    try {
      const response = await api.post(`/assessments/${assessmentId}/submit`, {
        studentId,
        answers,
        timeSpentMinutes
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to submit assessment'
      }
    }
  },

  async getAssessmentResults(studentId: number, assessmentId: number): Promise<ApiResponse<AssessmentResult>> {
    try {
      const response = await api.get(`/assessments/${assessmentId}/results/${studentId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch assessment results'
      }
    }
  },

  // Analytics and reporting endpoints
  async getAdaptiveFeedback(studentId: number): Promise<ApiResponse<AdaptiveFeedback>> {
    try {
      const response = await api.get(`/analytics/students/${studentId}/adaptive-feedback`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch adaptive feedback'
      }
    }
  },

  async getEngagementAnalytics(studentId: number, days: number = 30): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/analytics/students/${studentId}/engagement`, {
        params: { days }
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch engagement analytics'
      }
    }
  },

  async getLearningPathHistory(studentId: number): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(`/analytics/students/${studentId}/learning-path-history`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch learning path history'
      }
    }
  },

  // Teacher/Parent dashboard endpoints
  async getClassroomOverview(teacherId: number): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/dashboard/teacher/${teacherId}/overview`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch classroom overview'
      }
    }
  },

  async getStudentReports(studentId: number, reportType: string = 'comprehensive'): Promise<ApiResponse<any>> {
    try {
      const response = await api.get(`/reports/students/${studentId}`, {
        params: { type: reportType }
      })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch student reports'
      }
    }
  },

  // Content management endpoints (for teachers/admins)
  async createLesson(lessonData: any): Promise<ApiResponse<Lesson>> {
    try {
      const response = await api.post('/lessons', lessonData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create lesson'
      }
    }
  },

  async updateLesson(lessonId: number, lessonData: any): Promise<ApiResponse<Lesson>> {
    try {
      const response = await api.put(`/lessons/${lessonId}`, lessonData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update lesson'
      }
    }
  },

  async deleteLesson(lessonId: number): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/lessons/${lessonId}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to delete lesson'
      }
    }
  }
}

export default curriculumAPI