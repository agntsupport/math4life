import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Chip,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton,
  Badge,
  useTheme,
  alpha
} from '@mui/material'
import {
  School as SchoolIcon,
  Stars as StarsIcon,
  Psychology as BrainIcon,
  Functions as FunctionsIcon,
  Calculate as CalculateIcon,
  AutoStories as BookIcon,
  EmojiEvents as TrophyIcon,
  Lock as LockIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material'
import { useCurriculum } from '../../contexts/CurriculumContext'
import { NavigationItem } from '../../types/curriculum'

interface GradeLevelNavigationProps {
  studentId?: number
  onGradeSelect: (gradeCode: string) => void
  showProgress?: boolean
  allowLocked?: boolean
}

const gradeIcons: { [key: string]: React.ReactNode } = {
  'K': <SchoolIcon />,
  '1': <StarsIcon />,
  '2': <BrainIcon />,
  '3': <BookIcon />,
  '4': <CalculateIcon />,
  '5': <FunctionsIcon />,
  '6': <FunctionsIcon />,
  '7': <FunctionsIcon />,
  '8': <TrophyIcon />
}

const gradeColors: { [key: string]: string } = {
  'K': '#FF6B6B',  // Red
  '1': '#4ECDC4',  // Teal
  '2': '#45B7D1',  // Blue
  '3': '#96CEB4',  // Green
  '4': '#FECA57',  // Yellow
  '5': '#FF9FF3',  // Pink
  '6': '#54A0FF',  // Light Blue
  '7': '#5F27CD',  // Purple
  '8': '#00D2D3'   // Cyan
}

const gradeDescriptions: { [key: string]: string } = {
  'K': 'Numbers, shapes, and basic counting',
  '1': 'Addition, subtraction, and place value',
  '2': 'Two-digit math and measurement',
  '3': 'Multiplication, division, and fractions',
  '4': 'Multi-digit operations and decimals',
  '5': 'Fractions, decimals, and volume',
  '6': 'Ratios, percentages, and negative numbers',
  '7': 'Algebra basics and proportional thinking',
  '8': 'Functions, equations, and geometry proofs'
}

const GradeLevelNavigation: React.FC<GradeLevelNavigationProps> = ({
  studentId,
  onGradeSelect,
  showProgress = true,
  allowLocked = false
}) => {
  const theme = useTheme()
  const { state, actions } = useCurriculum()
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([])

  useEffect(() => {
    if (state.availableGrades.length > 0) {
      createNavigationItems()
    }
  }, [state.availableGrades, state.studentProgress])

  const createNavigationItems = async () => {
    const items: NavigationItem[] = []
    
    for (const grade of state.availableGrades) {
      let isAvailable = true
      let progress = 0

      // Check if student can access this grade
      if (studentId && !allowLocked) {
        try {
          await actions.getLearningPath(studentId)
          // Implementation would check actual access logic
          isAvailable = true // Simplified for now
        } catch (error) {
          console.error('Error checking grade access:', error)
          isAvailable = false
        }
      }

      // Calculate progress if available
      if (showProgress && state.studentProgress && state.studentProgress.gradeCode === grade.code) {
        progress = (state.studentProgress.masteredStandards / state.studentProgress.totalStandards) * 100
      }

      items.push({
        code: grade.code,
        name: grade.name,
        path: `/grade/${grade.code}`,
        icon: grade.code, // Store just the code, icon will be rendered from gradeIcons mapping
        color: gradeColors[grade.code] || theme.palette.primary.main,
        ageRange: grade.ageRange,
        isAvailable,
        progress: Math.round(progress)
      })
    }

    setNavigationItems(items)
  }

  const handleGradeClick = (gradeCode: string, isAvailable: boolean) => {
    if (!isAvailable && !allowLocked) {
      return // Don't allow access to locked grades
    }
    onGradeSelect(gradeCode)
  }

  const getCardElevation = (item: NavigationItem, isSelected: boolean): number => {
    if (!item.isAvailable && !allowLocked) return 1
    if (isSelected) return 8
    return 3
  }

  const getCardStyles = (item: NavigationItem, isSelected: boolean) => {
    const baseStyles = {
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      cursor: item.isAvailable || allowLocked ? 'pointer' : 'not-allowed',
      opacity: item.isAvailable || allowLocked ? 1 : 0.6,
      position: 'relative' as const,
      overflow: 'visible' as const
    }

    if (isSelected) {
      return {
        ...baseStyles,
        borderColor: item.color,
        borderWidth: 3,
        borderStyle: 'solid',
        boxShadow: `0 0 20px ${alpha(item.color, 0.4)}`
      }
    }

    return baseStyles
  }

  const renderProgressBadge = (item: NavigationItem) => {
    if (!showProgress || !item.progress || item.progress === 0) return null

    return (
      <Badge
        badgeContent={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {item.progress === 100 ? (
              <CheckIcon sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                {item.progress}%
              </Typography>
            )}
          </Box>
        }
        sx={{
          '& .MuiBadge-badge': {
            backgroundColor: item.progress === 100 ? 'success.main' : item.color,
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            padding: '0 6px',
            minWidth: 'auto'
          }
        }}
      >
        <Box />
      </Badge>
    )
  }

  const renderLockOverlay = (item: NavigationItem) => {
    if (item.isAvailable || allowLocked) return null

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2
        }}
      >
        <Tooltip title="Complete previous grades to unlock">
          <IconButton size="small" sx={{ backgroundColor: 'warning.main', color: 'white' }}>
            <LockIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  if (state.isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Loading Grade Levels...
        </Typography>
        <LinearProgress />
      </Box>
    )
  }

  if (state.error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Grade Levels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {state.error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        Choose Your Grade Level
      </Typography>
      
      <Grid container spacing={3}>
        {navigationItems.map((item) => {
          const isSelected = state.currentGrade?.code === item.code
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.code}>
              <Card
                elevation={getCardElevation(item, isSelected)}
                sx={getCardStyles(item, isSelected)}
              >
                <CardActionArea
                  onClick={() => handleGradeClick(item.code, item.isAvailable)}
                  disabled={!item.isAvailable && !allowLocked}
                  sx={{ height: '100%', position: 'relative' }}
                >
                  {renderLockOverlay(item)}
                  {renderProgressBadge(item)}
                  
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    {/* Grade Icon */}
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        backgroundColor: item.color,
                        color: 'white',
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem'
                      }}
                    >
                      {gradeIcons[item.icon] || <SchoolIcon />}
                    </Avatar>

                    {/* Grade Name */}
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {item.name}
                    </Typography>

                    {/* Age Range */}
                    <Chip
                      label={`Ages ${item.ageRange}`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(item.color, 0.1),
                        color: item.color,
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    />

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 2, minHeight: 40 }}
                    >
                      {gradeDescriptions[item.code]}
                    </Typography>

                    {/* Progress Bar */}
                    {showProgress && item.progress && item.progress > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.progress}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(item.color, 0.2),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: item.color,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                    )}

                    {/* Selected Indicator */}
                    {isSelected && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          icon={<CheckIcon />}
                          label="Current Grade"
                          size="small"
                          sx={{
                            backgroundColor: 'success.main',
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Help Text */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {allowLocked 
            ? 'Select any grade level to explore the curriculum'
            : 'Complete grade levels in order to unlock advanced content'
          }
        </Typography>
      </Box>
    </Box>
  )
}

export default GradeLevelNavigation