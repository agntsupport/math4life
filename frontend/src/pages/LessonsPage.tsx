import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Paper, CircularProgress, Grid, Card, CardContent, Chip, Avatar, Tooltip } from '@mui/material'
import { ArrowBack, School, AccessTime, Star, PlayArrow, Assignment } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { curriculumAPI } from '../services/curriculumAPI'

interface Lesson {
  id: number
  title: string
  description: string
  content: any
  difficultyLevel: number
  estimatedMinutes: number
  learningObjectives: string[]
  materialsNeeded: string[]
  lessonTypeCode: string
  lessonTypeName: string
  lessonTypeIcon: string
  lessonTypeColor: string
  standardCode: string
  standardTitle: string
}

const LessonsPage = () => {
  const { gradeCode, domainCode, standardId } = useParams<{ gradeCode: string; domainCode: string; standardId: string }>()
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackToDomain = () => {
    navigate(`/curriculum/grade/${gradeCode}/domain/${domainCode}`)
  }

  useEffect(() => {
    const loadLessons = async () => {
      if (!standardId) return
      
      setLoading(true)
      setError(null)
      
      try {
        const response = await curriculumAPI.getLessonsForStandard(parseInt(standardId))
        if (response.success && response.data) {
          setLessons(response.data)
        } else {
          setError(response.error || 'Error al cargar las lecciones')
        }
      } catch (err) {
        setError('Error al conectar con el servidor')
        console.error('Error loading lessons:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadLessons()
  }, [standardId])

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return '#4CAF50'  // Green - Easy
      case 2: return '#2196F3'  // Blue - Medium
      case 3: return '#FF9800'  // Orange - Hard
      case 4: return '#F44336'  // Red - Very Hard
      case 5: return '#9C27B0'  // Purple - Expert
      default: return '#757575'  // Grey - Unknown
    }
  }

  const getDifficultyLabel = (level: number) => {
    switch (level) {
      case 1: return 'Fácil'
      case 2: return 'Intermedio'
      case 3: return 'Avanzado'
      case 4: return 'Difícil'
      case 5: return 'Experto'
      default: return 'Desconocido'
    }
  }

  if (!gradeCode || !domainCode || !standardId) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Parámetros de navegación incompletos
        </Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button onClick={handleBackToDomain} variant="contained" sx={{ mt: 2 }}>
          Volver al Dominio
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToDomain}
          variant="outlined"
        >
          Volver al Dominio
        </Button>
        <Typography variant="h4" component="h1">
          Lecciones - Grado {gradeCode.toUpperCase()}
        </Typography>
      </Box>

      {/* Standard Info */}
      {lessons.length > 0 && (
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" gutterBottom>
            {lessons[0].standardCode}: {lessons[0].standardTitle}
          </Typography>
          <Chip 
            icon={<School />} 
            label={`${lessons.length} lecciones disponibles`} 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Paper>
      )}

      {/* Lessons Grid */}
      {lessons.length > 0 ? (
        <Grid container spacing={3}>
          {lessons.map((lesson, index) => (
            <Grid item xs={12} md={6} lg={4} key={lesson.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Lesson Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: lesson.lessonTypeColor || '#1976d2',
                        mr: 2,
                        width: 48,
                        height: 48
                      }}
                    >
                      <School />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {lesson.title}
                      </Typography>
                      <Chip 
                        label={lesson.lessonTypeName}
                        size="small"
                        sx={{ 
                          bgcolor: lesson.lessonTypeColor || '#1976d2',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {lesson.description}
                  </Typography>

                  {/* Lesson Stats */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      icon={<AccessTime />}
                      label={`${lesson.estimatedMinutes} min`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      icon={<Star />}
                      label={getDifficultyLabel(lesson.difficultyLevel)}
                      size="small"
                      sx={{
                        bgcolor: getDifficultyColor(lesson.difficultyLevel),
                        color: 'white'
                      }}
                    />
                  </Box>

                  {/* Learning Objectives */}
                  {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Objetivos de Aprendizaje:
                      </Typography>
                      <Box component="ul" sx={{ m: 0, pl: 3 }}>
                        {lesson.learningObjectives.slice(0, 2).map((objective, idx) => (
                          <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                            {objective}
                          </Typography>
                        ))}
                        {lesson.learningObjectives.length > 2 && (
                          <Typography variant="body2" color="text.secondary">
                            +{lesson.learningObjectives.length - 2} más...
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      fullWidth
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      sx={{ mb: 1 }}
                    >
                      Iniciar Lección
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Assignment />}
                      fullWidth
                      onClick={() => navigate(`/lesson/${lesson.id}/problems`)}
                    >
                      Ver Ejercicios
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No hay lecciones disponibles
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Las lecciones para este estándar están siendo desarrolladas.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Mientras tanto, puedes explorar otros estándares o volver al dominio.
          </Typography>
          <Button 
            onClick={handleBackToDomain} 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Volver al Dominio
          </Button>
        </Paper>
      )}

      {/* Quick Actions */}
      {lessons.length > 0 && (
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/curriculum/grade/${gradeCode}/domain/${domainCode}/standard/${standardId}/practice`)}
            >
              Ir a Ejercicios de Práctica
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/curriculum/grade/${gradeCode}`)}
            >
              Explorar Otros Dominios
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/curriculum')}
            >
              Cambiar de Grado
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default LessonsPage