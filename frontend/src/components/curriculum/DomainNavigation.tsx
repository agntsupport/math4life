import React from 'react'
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
  IconButton,
  useTheme,
  alpha,
  Tooltip
} from '@mui/material'
import {
  Numbers as NumbersIcon,
  Add as AddIcon,
  Calculate as CalculateIcon,
  PieChart as FractionIcon,
  Straighten as MeasureIcon,
  Category as GeometryIcon,
  Percent as RatioIcon,
  Functions as FunctionIcon,
  BarChart as StatsIcon,
  ArrowBack as BackIcon,
  Star as StarIcon
} from '@mui/icons-material'
import { Domain, DomainProgress } from '../../types/curriculum'
import { useCurriculum } from '../../contexts/CurriculumContext'

interface DomainNavigationProps {
  domains: Domain[]
  domainProgress?: DomainProgress[]
  onDomainSelect: (domainCode: string) => void
  onBack?: () => void
  selectedDomainCode?: string
  showProgress?: boolean
}

const domainIcons: { [key: string]: React.ReactNode } = {
  'CC': <NumbersIcon />,      // Counting and Cardinality
  'OA': <AddIcon />,          // Operations & Algebraic Thinking
  'NBT': <CalculateIcon />,   // Number & Operations in Base Ten
  'NF': <FractionIcon />,     // Number & Operations—Fractions
  'MD': <MeasureIcon />,      // Measurement and Data
  'G': <GeometryIcon />,      // Geometry
  'RP': <RatioIcon />,        // Ratios and Proportional Relationships
  'NS': <NumbersIcon />,      // The Number System
  'EE': <FunctionIcon />,     // Expressions and Equations
  'F': <FunctionIcon />,      // Functions
  'SP': <StatsIcon />         // Statistics and Probability
}

const domainColors: { [key: string]: string } = {
  'CC': '#FF6B6B',  // Red - Counting
  'OA': '#4ECDC4',  // Teal - Operations
  'NBT': '#45B7D1', // Blue - Base Ten
  'NF': '#96CEB4',  // Green - Fractions
  'MD': '#FECA57',  // Yellow - Measurement
  'G': '#FF9FF3',   // Pink - Geometry
  'RP': '#54A0FF',  // Light Blue - Ratios
  'NS': '#5F27CD',  // Purple - Number System
  'EE': '#00D2D3',  // Cyan - Expressions & Equations
  'F': '#FF3838',   // Bright Red - Functions
  'SP': '#2ED573'   // Bright Green - Statistics
}

const domainDescriptions: { [key: string]: string } = {
  'CC': 'Learn to count, recognize numbers, and understand quantities',
  'OA': 'Add, subtract, multiply, divide, and solve word problems',
  'NBT': 'Understand place value and work with larger numbers',
  'NF': 'Explore fractions, decimals, and parts of a whole',
  'MD': 'Measure objects, tell time, and work with data',
  'G': 'Study shapes, angles, area, and spatial relationships',
  'RP': 'Work with ratios, rates, and proportional thinking',
  'NS': 'Expand number understanding including negative numbers',
  'EE': 'Learn algebraic expressions and solve equations',
  'F': 'Understand functions and mathematical relationships',
  'SP': 'Analyze data, probability, and statistical concepts'
}

const DomainNavigation: React.FC<DomainNavigationProps> = ({
  domains,
  domainProgress = [],
  onDomainSelect,
  onBack,
  selectedDomainCode,
  showProgress = true
}) => {
  const theme = useTheme()
  const { state } = useCurriculum()

  const getDomainProgress = (domainCode: string): DomainProgress | undefined => {
    return domainProgress.find(dp => dp.domainCode === domainCode)
  }

  const getProgressPercentage = (domainCode: string): number => {
    const progress = getDomainProgress(domainCode)
    if (!progress || progress.totalStandards === 0) return 0
    return Math.round((progress.masteredStandards / progress.totalStandards) * 100)
  }

  const isPrimaryDomain = (domain: Domain): boolean => {
    return domain.isPrimary || false
  }

  const getCardStyles = (domain: Domain, isSelected: boolean) => {
    const color = domainColors[domain.code] || theme.palette.primary.main
    
    const baseStyles = {
      height: '100%',
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
      position: 'relative' as const,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 25px ${alpha(color, 0.3)}`
      }
    }

    if (isSelected) {
      return {
        ...baseStyles,
        borderColor: color,
        borderWidth: 3,
        borderStyle: 'solid',
        boxShadow: `0 0 20px ${alpha(color, 0.4)}`,
        transform: 'translateY(-2px)'
      }
    }

    return baseStyles
  }

  const renderPrimaryBadge = (domain: Domain) => {
    if (!isPrimaryDomain(domain)) return null

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2
        }}
      >
        <Tooltip title="Primary focus area for this grade">
          <Chip
            icon={<StarIcon sx={{ fontSize: 16 }} />}
            label="Primary"
            size="small"
            sx={{
              backgroundColor: 'warning.main',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          />
        </Tooltip>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header with back button */}
      {onBack && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onBack} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h5">
            {state.currentGrade?.name} - Mathematical Domains
          </Typography>
        </Box>
      )}

      {/* Domain Grid */}
      <Grid container spacing={3}>
        {domains.map((domain) => {
          const isSelected = selectedDomainCode === domain.code
          const progress = getDomainProgress(domain.code)
          const progressPercentage = getProgressPercentage(domain.code)
          const color = domainColors[domain.code] || theme.palette.primary.main

          return (
            <Grid item xs={12} sm={6} md={4} key={domain.code}>
              <Card
                elevation={isSelected ? 8 : 3}
                sx={getCardStyles(domain, isSelected)}
              >
                <CardActionArea
                  onClick={() => onDomainSelect(domain.code)}
                  sx={{ height: '100%', position: 'relative' }}
                >
                  {renderPrimaryBadge(domain)}
                  
                  <CardContent sx={{ textAlign: 'center', p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Domain Icon */}
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: color,
                        color: 'white',
                        mx: 'auto',
                        mb: 2,
                        fontSize: '1.5rem'
                      }}
                    >
                      {domainIcons[domain.code] || <NumbersIcon />}
                    </Avatar>

                    {/* Domain Name */}
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ flexGrow: 1 }}>
                      {domain.name}
                    </Typography>

                    {/* Domain Code */}
                    <Chip
                      label={domain.code}
                      size="small"
                      sx={{
                        backgroundColor: alpha(color, 0.1),
                        color: color,
                        fontWeight: 'bold',
                        mb: 2,
                        fontFamily: 'monospace'
                      }}
                    />

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 2, flexGrow: 1, minHeight: 48 }}
                    >
                      {domainDescriptions[domain.code] || domain.description}
                    </Typography>

                    {/* Progress Information */}
                    {showProgress && progress && (
                      <Box sx={{ mt: 'auto' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Standards: {progress.masteredStandards}/{progress.totalStandards}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {progressPercentage}%
                          </Typography>
                        </Box>
                        
                        <LinearProgress
                          variant="determinate"
                          value={progressPercentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: alpha(color, 0.2),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: color,
                              borderRadius: 3
                            }
                          }}
                        />

                        {progress.timeSpentMinutes > 0 && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Time spent: {Math.round(progress.timeSpentMinutes / 60)}h {progress.timeSpentMinutes % 60}m
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* No Progress Available */}
                    {showProgress && !progress && (
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary">
                          Ready to start!
                        </Typography>
                      </Box>
                    )}

                    {/* Selected Indicator */}
                    {isSelected && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label="Selected"
                          size="small"
                          sx={{
                            backgroundColor: color,
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

      {/* Summary Information */}
      {showProgress && domainProgress.length > 0 && (
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Overall Progress Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Total Standards: {domainProgress.reduce((sum, dp) => sum + dp.totalStandards, 0)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Mastered: {domainProgress.reduce((sum, dp) => sum + dp.masteredStandards, 0)}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Overall: {Math.round(
                  (domainProgress.reduce((sum, dp) => sum + dp.masteredStandards, 0) / 
                   domainProgress.reduce((sum, dp) => sum + dp.totalStandards, 0)) * 100
                )}% Complete
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
}

export default DomainNavigation