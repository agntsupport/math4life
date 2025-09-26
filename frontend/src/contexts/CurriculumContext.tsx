import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { 
  GradeLevel, 
  Domain, 
  Standard, 
  GradeProgress, 
  CurriculumState,
  LearningPath,
  AdaptiveFeedback,
  UIConfig
} from '../types/curriculum'
import { curriculumAPI } from '../services/curriculumAPI'

// Action types
type CurriculumAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_GRADE'; payload: GradeLevel | null }
  | { type: 'SET_AVAILABLE_GRADES'; payload: GradeLevel[] }
  | { type: 'SET_SELECTED_DOMAIN'; payload: Domain | null }
  | { type: 'SET_AVAILABLE_DOMAINS'; payload: Domain[] }
  | { type: 'SET_CURRENT_STANDARDS'; payload: Standard[] }
  | { type: 'SET_STUDENT_PROGRESS'; payload: GradeProgress | null }
  | { type: 'UPDATE_PROGRESS'; payload: { standardId: number; newMastery: number } }

// Initial state
const initialState: CurriculumState = {
  currentGrade: null,
  availableGrades: [],
  selectedDomain: null,
  availableDomains: [],
  currentStandards: [],
  studentProgress: null,
  isLoading: false,
  error: null
}

// Reducer
function curriculumReducer(state: CurriculumState, action: CurriculumAction): CurriculumState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_CURRENT_GRADE':
      return { ...state, currentGrade: action.payload }
    case 'SET_AVAILABLE_GRADES':
      return { ...state, availableGrades: action.payload }
    case 'SET_SELECTED_DOMAIN':
      return { ...state, selectedDomain: action.payload }
    case 'SET_AVAILABLE_DOMAINS':
      return { ...state, availableDomains: action.payload }
    case 'SET_CURRENT_STANDARDS':
      return { ...state, currentStandards: action.payload }
    case 'SET_STUDENT_PROGRESS':
      return { ...state, studentProgress: action.payload }
    case 'UPDATE_PROGRESS':
      if (!state.studentProgress) return state
      // Update progress for specific standard
      const updatedDomains = state.studentProgress.domains.map(domain => ({
        ...domain,
        // This would need more complex logic to update the specific standard
        averageMastery: domain.averageMastery // Placeholder
      }))
      return {
        ...state,
        studentProgress: {
          ...state.studentProgress,
          domains: updatedDomains
        }
      }
    default:
      return state
  }
}

// Context type
interface CurriculumContextType {
  state: CurriculumState
  actions: {
    loadGradeLevels: () => Promise<void>
    setCurrentGrade: (gradeCode: string) => Promise<void>
    loadDomainsForGrade: (gradeCode: string) => Promise<void>
    selectDomain: (domainCode: string) => Promise<void>
    loadStudentProgress: (studentId: number) => Promise<void>
    updateStudentProgress: (studentId: number, standardId: number, score: number, timeSpent: number) => Promise<void>
    getLearningPath: (studentId: number) => Promise<LearningPath | null>
    getAdaptiveFeedback: (studentId: number) => Promise<AdaptiveFeedback | null>
    getUIConfig: (gradeCode: string) => UIConfig
  }
}

// Create context
const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined)

// UI configurations for different grade levels
const uiConfigs: { [gradeCode: string]: UIConfig } = {
  'K': {
    gradeLevel: 'K',
    theme: {
      primaryColor: '#FF6B6B',
      secondaryColor: '#4ECDC4',
      backgroundColor: '#FFF9C4',
      fontSize: '18px',
      buttonSize: 'large'
    },
    features: {
      showComplexityLevel: false,
      showTimeTracking: false,
      showDetailedProgress: false,
      allowSkipping: false,
      requireConfirmation: true
    },
    interactions: {
      hasAudio: true,
      hasAnimations: true,
      dragAndDrop: true,
      touchOptimized: true
    },
    navigation: {
      showBreadcrumbs: false,
      maxMenuDepth: 1,
      autoAdvance: true
    }
  },
  '1': {
    gradeLevel: '1',
    theme: {
      primaryColor: '#45B7D1',
      secondaryColor: '#96CEB4',
      backgroundColor: '#FFEAA7',
      fontSize: '17px',
      buttonSize: 'large'
    },
    features: {
      showComplexityLevel: false,
      showTimeTracking: false,
      showDetailedProgress: false,
      allowSkipping: false,
      requireConfirmation: true
    },
    interactions: {
      hasAudio: true,
      hasAnimations: true,
      dragAndDrop: true,
      touchOptimized: true
    },
    navigation: {
      showBreadcrumbs: false,
      maxMenuDepth: 2,
      autoAdvance: true
    }
  },
  '2': {
    gradeLevel: '2',
    theme: {
      primaryColor: '#6C5CE7',
      secondaryColor: '#A29BFE',
      backgroundColor: '#DDA0DD',
      fontSize: '16px',
      buttonSize: 'medium'
    },
    features: {
      showComplexityLevel: false,
      showTimeTracking: true,
      showDetailedProgress: false,
      allowSkipping: false,
      requireConfirmation: true
    },
    interactions: {
      hasAudio: true,
      hasAnimations: true,
      dragAndDrop: true,
      touchOptimized: true
    },
    navigation: {
      showBreadcrumbs: true,
      maxMenuDepth: 2,
      autoAdvance: false
    }
  },
  '3': {
    gradeLevel: '3',
    theme: {
      primaryColor: '#00B894',
      secondaryColor: '#55A3FF',
      backgroundColor: '#E8F4FD',
      fontSize: '16px',
      buttonSize: 'medium'
    },
    features: {
      showComplexityLevel: true,
      showTimeTracking: true,
      showDetailedProgress: true,
      allowSkipping: true,
      requireConfirmation: false
    },
    interactions: {
      hasAudio: false,
      hasAnimations: true,
      dragAndDrop: true,
      touchOptimized: false
    },
    navigation: {
      showBreadcrumbs: true,
      maxMenuDepth: 3,
      autoAdvance: false
    }
  },
  '4': {
    gradeLevel: '4',
    theme: {
      primaryColor: '#E17055',
      secondaryColor: '#FDCB6E',
      backgroundColor: '#F8F9FA',
      fontSize: '15px',
      buttonSize: 'medium'
    },
    features: {
      showComplexityLevel: true,
      showTimeTracking: true,
      showDetailedProgress: true,
      allowSkipping: true,
      requireConfirmation: false
    },
    interactions: {
      hasAudio: false,
      hasAnimations: true,
      dragAndDrop: true,
      touchOptimized: false
    },
    navigation: {
      showBreadcrumbs: true,
      maxMenuDepth: 3,
      autoAdvance: false
    }
  },
  '5': {
    gradeLevel: '5',
    theme: {
      primaryColor: '#0984E3',
      secondaryColor: '#74B9FF',
      backgroundColor: '#F1F3F4',
      fontSize: '15px',
      buttonSize: 'medium'
    },
    features: {
      showComplexityLevel: true,
      showTimeTracking: true,
      showDetailedProgress: true,
      allowSkipping: true,
      requireConfirmation: false
    },
    interactions: {
      hasAudio: false,
      hasAnimations: false,
      dragAndDrop: true,
      touchOptimized: false
    },
    navigation: {
      showBreadcrumbs: true,
      maxMenuDepth: 4,
      autoAdvance: false
    }
  },
  '6': {
    gradeLevel: '6',
    theme: {
      primaryColor: '#6C5CE7',
      secondaryColor: '#A29BFE',
      backgroundColor: '#FFFFFF',
      fontSize: '14px',
      buttonSize: 'medium'
    },
    features: {
      showComplexityLevel: true,
      showTimeTracking: true,
      showDetailedProgress: true,
      allowSkipping: true,
      requireConfirmation: false
    },
    interactions: {
      hasAudio: false,
      hasAnimations: false,
      dragAndDrop: true,
      touchOptimized: false
    },
    navigation: {
      showBreadcrumbs: true,
      maxMenuDepth: 4,
      autoAdvance: false
    }
  },
  '7': {
    gradeLevel: '7',
    theme: {
      primaryColor: '#00B894',
      secondaryColor: '#00CEC9',
      backgroundColor: '#FFFFFF',
      fontSize: '14px',
      buttonSize: 'small'
    },
    features: {
      showComplexityLevel: true,
      showTimeTracking: true,
      showDetailedProgress: true,
      allowSkipping: true,
      requireConfirmation: false
    },
    interactions: {
      hasAudio: false,
      hasAnimations: false,
      dragAndDrop: false,
      touchOptimized: false
    },
    navigation: {
      showBreadcrumbs: true,
      maxMenuDepth: 5,
      autoAdvance: false
    }
  },
  '8': {
    gradeLevel: '8',
    theme: {
      primaryColor: '#2D3436',
      secondaryColor: '#636E72',
      backgroundColor: '#FFFFFF',
      fontSize: '14px',
      buttonSize: 'small'
    },
    features: {
      showComplexityLevel: true,
      showTimeTracking: true,
      showDetailedProgress: true,
      allowSkipping: true,
      requireConfirmation: false
    },
    interactions: {
      hasAudio: false,
      hasAnimations: false,
      dragAndDrop: false,
      touchOptimized: false
    },
    navigation: {
      showBreadcrumbs: true,
      maxMenuDepth: 5,
      autoAdvance: false
    }
  }
}

// Provider component
interface CurriculumProviderProps {
  children: ReactNode
  studentId?: number
}

export function CurriculumProvider({ children, studentId }: CurriculumProviderProps) {
  const [state, dispatch] = useReducer(curriculumReducer, initialState)

  // Load initial data
  useEffect(() => {
    loadGradeLevels()
    if (studentId) {
      loadStudentProgress(studentId)
    }
  }, [studentId])

  const actions = {
    loadGradeLevels: async (): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const response = await curriculumAPI.getGradeLevels()
        if (response.success && response.data) {
          dispatch({ type: 'SET_AVAILABLE_GRADES', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load grade levels' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load grade levels' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    setCurrentGrade: async (gradeCode: string): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const response = await curriculumAPI.getGradeLevel(gradeCode)
        if (response.success && response.data) {
          dispatch({ type: 'SET_CURRENT_GRADE', payload: response.data })
          await actions.loadDomainsForGrade(gradeCode)
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to set grade level' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to set grade level' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    loadDomainsForGrade: async (gradeCode: string): Promise<void> => {
      try {
        const response = await curriculumAPI.getDomainsForGrade(gradeCode)
        if (response.success && response.data) {
          dispatch({ type: 'SET_AVAILABLE_DOMAINS', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load domains' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load domains' })
      }
    },

    selectDomain: async (domainCode: string): Promise<void> => {
      if (!state.currentGrade) return
      
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const selectedDomain = state.availableDomains.find(d => d.code === domainCode)
        if (selectedDomain) {
          dispatch({ type: 'SET_SELECTED_DOMAIN', payload: selectedDomain })
        }

        const response = await curriculumAPI.getStandardsForGradeDomain(state.currentGrade.code, domainCode)
        if (response.success && response.data) {
          dispatch({ type: 'SET_CURRENT_STANDARDS', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load standards' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load standards' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    loadStudentProgress: async (studentId: number): Promise<void> => {
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        const response = await curriculumAPI.getStudentGradeProgress(studentId)
        if (response.success && response.data) {
          dispatch({ type: 'SET_STUDENT_PROGRESS', payload: response.data })
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load progress' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load progress' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },

    updateStudentProgress: async (
      studentId: number, 
      standardId: number, 
      score: number, 
      timeSpent: number
    ): Promise<void> => {
      try {
        const response = await curriculumAPI.updateStudentProgress(studentId, standardId, score, timeSpent)
        if (response.success) {
          dispatch({ type: 'UPDATE_PROGRESS', payload: { standardId, newMastery: score } })
          // Reload full progress to get updated statistics
          await actions.loadStudentProgress(studentId)
        } else {
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to update progress' })
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update progress' })
      }
    },

    getLearningPath: async (studentId: number): Promise<LearningPath | null> => {
      try {
        const response = await curriculumAPI.getRecommendedStandards(studentId)
        if (response.success && response.data) {
          return response.data
        }
        return null
      } catch (error) {
        console.error('Failed to get learning path:', error)
        return null
      }
    },

    getAdaptiveFeedback: async (studentId: number): Promise<AdaptiveFeedback | null> => {
      try {
        const response = await curriculumAPI.getAdaptiveFeedback(studentId)
        if (response.success && response.data) {
          return response.data
        }
        return null
      } catch (error) {
        console.error('Failed to get adaptive feedback:', error)
        return null
      }
    },

    getUIConfig: (gradeCode: string): UIConfig => {
      return uiConfigs[gradeCode] || uiConfigs['3'] // Default to Grade 3 config
    }
  }

  return (
    <CurriculumContext.Provider value={{ state, actions }}>
      {children}
    </CurriculumContext.Provider>
  )
}

// Hook to use curriculum context
export function useCurriculum() {
  const context = useContext(CurriculumContext)
  if (context === undefined) {
    throw new Error('useCurriculum must be used within a CurriculumProvider')
  }
  return context
}

export default CurriculumContext