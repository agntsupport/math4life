// Type definitions for K-8 Curriculum System

export interface GradeLevel {
  id: number
  code: string
  name: string
  displayOrder: number
  ageRange: string
  createdAt: Date
  updatedAt: Date
}

export interface Domain {
  id: number
  code: string
  name: string
  description: string
  gradeStart: string
  gradeEnd: string
  isPrimary?: boolean
  createdAt: Date
}

export interface Cluster {
  id: number
  domainId: number
  gradeId: number
  code: string
  name: string
  description: string
  clusterType: 'major' | 'supporting' | 'additional'
  createdAt: Date
}

export interface Standard {
  id: number
  clusterId: number
  code: string
  title: string
  description: string
  examples?: string
  prerequisiteStandards: number[]
  complexityLevel: number
  createdAt: Date
}

export interface LessonType {
  id: number
  code: string
  name: string
  description: string
  icon: string
  color: string
}

export interface Lesson {
  id: number
  standardId: number
  lessonTypeId: number
  title: string
  description: string
  content: LessonContent
  difficultyLevel: number
  estimatedMinutes: number
  prerequisites: number[]
  learningObjectives: string[]
  materialsNeeded: string[]
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
}

export interface LessonContent {
  type: string
  [key: string]: any
}

export interface Problem {
  id: number
  lessonId: number
  problemType: 'multiple_choice' | 'drag_drop' | 'open_ended' | 'interactive'
  questionText: string
  questionData: any
  correctAnswer: any
  hints: string[]
  explanation: string
  difficulty: number
  points: number
  orderInLesson: number
  createdAt: Date
}

export interface StudentProgress {
  id: number
  studentId: number
  standardId: number
  masteryLevel: number
  attempts: number
  firstAttemptAt?: Date
  lastAttemptAt?: Date
  masteredAt?: Date
  timeSpentMinutes: number
  createdAt: Date
  updatedAt: Date
}

export interface LessonProgress {
  id: number
  studentId: number
  lessonId: number
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered'
  score?: number
  timeSpentMinutes: number
  startedAt?: Date
  completedAt?: Date
  attempts: number
  createdAt: Date
  updatedAt: Date
}

export interface ProblemAttempt {
  id: number
  studentId: number
  problemId: number
  lessonProgressId: number
  studentAnswer: any
  isCorrect: boolean
  pointsEarned: number
  timeSpentSeconds: number
  hintsUsed: number
  attemptNumber: number
  attemptedAt: Date
}

export interface DomainProgress {
  domainCode: string
  domainName: string
  totalStandards: number
  attemptedStandards: number
  masteredStandards: number
  averageMastery: number
  timeSpentMinutes: number
}

export interface GradeProgress {
  gradeCode: string
  gradeName: string
  totalStandards: number
  attemptedStandards: number
  masteredStandards: number
  averageMastery: number
  timeSpentMinutes: number
  domains: DomainProgress[]
}

export interface ProgressMetrics {
  standardId: number
  standardCode: string
  standardTitle: string
  masteryLevel: number
  attempts: number
  timeSpentMinutes: number
  lastAttemptAt?: Date
  masteredAt?: Date
  domainCode: string
  domainName: string
}

export interface LearningPath {
  studentId: number
  recommendedLessons: number[]
  reasoning: string
  currentLevel: string
  nextMilestones: string[]
}

export interface AdaptiveFeedback {
  needsReview: number[]
  readyForAdvancement: number[]
  strugglingAreas: string[]
  strengthAreas: string[]
  recommendations: string[]
}

export interface Assessment {
  id: number
  gradeId: number
  title: string
  description: string
  assessmentType: 'diagnostic' | 'formative' | 'summative' | 'placement'
  standardsCovered: number[]
  totalPoints: number
  passingScore: number
  timeLimitMinutes?: number
  isPublished: boolean
  createdAt: Date
}

export interface AssessmentResult {
  id: number
  assessmentId: number
  studentId: number
  score: number
  percentage: number
  timeSpentMinutes: number
  startedAt: Date
  completedAt: Date
  detailedResults: any
  createdAt: Date
}

export interface User {
  id: number
  email?: string
  username?: string
  roleId: number
  firstName: string
  lastName: string
  currentGradeId?: number
  birthDate?: Date
  parentEmail?: string
  schoolName?: string
  teacherId?: number
  preferences: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserRole {
  id: number
  name: string
  permissions: any
  createdAt: Date
}

// UI-specific types
export interface NavigationItem {
  code: string
  name: string
  path: string
  icon: string
  color: string
  ageRange: string
  isAvailable: boolean
  progress?: number
}

export interface CurriculumState {
  currentGrade: GradeLevel | null
  availableGrades: GradeLevel[]
  selectedDomain: Domain | null
  availableDomains: Domain[]
  currentStandards: Standard[]
  studentProgress: GradeProgress | null
  isLoading: boolean
  error: string | null
}

export interface LessonState {
  currentLesson: Lesson | null
  currentProblem: Problem | null
  problemIndex: number
  lessonProgress: LessonProgress | null
  answers: { [problemId: number]: any }
  timeStarted: Date | null
  isSubmitting: boolean
  feedback: string | null
}

export interface ProgressDashboard {
  overview: GradeProgress
  recentActivity: any[]
  recommendations: LearningPath
  adaptiveFeedback: AdaptiveFeedback
  achievements: any[]
  timeAnalytics: any
}

// Age-appropriate UI configurations
export interface UIConfig {
  gradeLevel: string
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    fontSize: string
    buttonSize: 'small' | 'medium' | 'large'
  }
  features: {
    showComplexityLevel: boolean
    showTimeTracking: boolean
    showDetailedProgress: boolean
    allowSkipping: boolean
    requireConfirmation: boolean
  }
  interactions: {
    hasAudio: boolean
    hasAnimations: boolean
    dragAndDrop: boolean
    touchOptimized: boolean
  }
  navigation: {
    showBreadcrumbs: boolean
    maxMenuDepth: number
    autoAdvance: boolean
  }
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form types for lesson creation/editing
export interface LessonForm {
  standardId: number
  lessonTypeId: number
  title: string
  description: string
  difficultyLevel: number
  estimatedMinutes: number
  learningObjectives: string[]
  materialsNeeded: string[]
  content: LessonContent
}

export interface ProblemForm {
  lessonId: number
  problemType: 'multiple_choice' | 'drag_drop' | 'open_ended' | 'interactive'
  questionText: string
  questionData: any
  correctAnswer: any
  hints: string[]
  explanation: string
  difficulty: number
  points: number
}

// Lesson content type definitions
export interface MultipleChoiceContent extends LessonContent {
  type: 'multiple_choice'
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface DragDropContent extends LessonContent {
  type: 'drag_drop'
  items: Array<{
    id: string
    content: string
    category: string
  }>
  dropZones: Array<{
    id: string
    label: string
    acceptsCategory: string
  }>
  correctMapping: { [itemId: string]: string }
}

export interface InteractiveContent extends LessonContent {
  type: 'interactive'
  tool: 'number_line' | 'fraction_bar' | 'geometry_canvas' | 'calculator'
  configuration: any
  tasks: Array<{
    instruction: string
    validation: any
    hints?: string[]
  }>
}

export interface TutorialContent extends LessonContent {
  type: 'tutorial'
  steps: Array<{
    title: string
    content: string
    media?: {
      type: 'image' | 'video' | 'animation'
      src: string
      alt?: string
    }
    interactive?: any
  }>
}

// Learning analytics types
export interface LearningAnalytics {
  sessionId: string
  studentId: number
  lessonId: number
  startTime: Date
  endTime?: Date
  events: LearningEvent[]
  summary: SessionSummary
}

export interface LearningEvent {
  timestamp: Date
  type: string
  data: any
}

export interface SessionSummary {
  totalTimeMinutes: number
  problemsAttempted: number
  problemsCorrect: number
  hintsUsed: number
  accuracy: number
  engagementScore: number
}