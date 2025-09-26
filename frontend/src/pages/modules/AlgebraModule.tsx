import { useState } from 'react'
import { Box, Typography, Paper, Button, Grid, TextField, Alert, Stepper, Step, StepLabel } from '@mui/material'
import { InlineMath, BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import DraggableExpression from '../../components/DraggableExpression'

const AlgebraModule = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info' | null, message: string }>({ type: null, message: '' })

  const lessons = [
    {
      title: 'Variables y Expresiones',
      content: 'Una variable es un símbolo que representa un valor desconocido.',
      example: 'x + 5 = 10',
      practice: 'Encuentra el valor de x en: x + 3 = 8',
      solution: '5'
    },
    {
      title: 'Ecuaciones Lineales',
      content: 'Una ecuación lineal es una ecuación de primer grado.',
      example: '2x + 3 = 11',
      practice: 'Resuelve: 3x - 2 = 13',
      solution: '5'
    },
    {
      title: 'Sistemas de Ecuaciones',
      content: 'Un sistema de ecuaciones tiene múltiples ecuaciones con múltiples variables.',
      example: 'x + y = 5; x - y = 1',
      practice: 'Resuelve: x + y = 7; x - y = 3',
      solution: 'x=5, y=2'
    }
  ]

  const currentLesson = lessons[activeStep]

  const handleCheckAnswer = () => {
    if (userInput.trim().toLowerCase() === currentLesson.solution.toLowerCase()) {
      setFeedback({ type: 'success', message: '¡Correcto! Excelente trabajo.' })
      setTimeout(() => {
        if (activeStep < lessons.length - 1) {
          handleNext()
        }
      }, 1500)
    } else {
      setFeedback({ type: 'error', message: `Intenta de nuevo. Pista: Revisa tu procedimiento.` })
    }
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1)
    setUserInput('')
    setFeedback({ type: null, message: '' })
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
    setUserInput('')
    setFeedback({ type: null, message: '' })
  }

  const handleReset = () => {
    setActiveStep(0)
    setUserInput('')
    setFeedback({ type: null, message: '' })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Módulo de Álgebra
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {lessons.map((lesson, index) => (
          <Step key={index}>
            <StepLabel>{lesson.title}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              {currentLesson.title}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {currentLesson.content}
            </Typography>

            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Ejemplo:
              </Typography>
              <BlockMath math={currentLesson.example} />
            </Box>

            <Typography variant="h6" gutterBottom>
              Práctica:
            </Typography>
            <Box sx={{ fontSize: '1.5rem', mb: 3, textAlign: 'center' }}>
              <InlineMath math={currentLesson.practice} />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <TextField
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tu respuesta"
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCheckAnswer()
                }}
                sx={{ width: 300 }}
              />
              <Button 
                variant="contained" 
                onClick={handleCheckAnswer}
                disabled={!userInput}
              >
                Verificar
              </Button>
            </Box>

            {feedback.type && (
              <Alert severity={feedback.type} sx={{ mt: 2 }}>
                {feedback.message}
              </Alert>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                onClick={handleBack} 
                disabled={activeStep === 0}
              >
                Anterior
              </Button>
              <Button 
                onClick={handleReset}
                variant="outlined"
              >
                Reiniciar
              </Button>
              <Button
                onClick={handleNext}
                disabled={activeStep === lessons.length - 1}
              >
                Siguiente
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Área de Manipulación
            </Typography>
            <Box sx={{ minHeight: 200, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <DraggableExpression expression="2x" />
              <DraggableExpression expression="+ 3" />
              <DraggableExpression expression="= 11" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Progreso de la Lección
            </Typography>
            <Typography variant="h4" color="primary">
              {activeStep + 1} / {lessons.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lecciones completadas
            </Typography>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recordatorios de Álgebra
            </Typography>
            <Typography variant="body2" paragraph>
              • Para despejar x, realiza la operación inversa
            </Typography>
            <Typography variant="body2" paragraph>
              • Si sumas en un lado, suma en el otro
            </Typography>
            <Typography variant="body2" paragraph>
              • Si multiplicas en un lado, multiplica en el otro
            </Typography>
            <Typography variant="body2" paragraph>
              • Simplifica combinando términos semejantes
            </Typography>
            <Typography variant="body2">
              • Verifica tu respuesta sustituyendo
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AlgebraModule