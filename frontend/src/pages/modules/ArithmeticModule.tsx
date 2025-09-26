import { useState } from 'react'
import { Box, Typography, Paper, Button, Grid, TextField, Alert } from '@mui/material'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import MathCanvas from '../../components/MathCanvas'
import { evaluate } from 'mathjs'

const ArithmeticModule = () => {
  const [currentProblem, setCurrentProblem] = useState('2 + 3 = ?')
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info' | null, message: string }>({ type: null, message: '' })
  const [score, setScore] = useState(0)

  const problems = [
    { question: '2 + 3', answer: 5, latex: '2 + 3 = ?' },
    { question: '7 - 4', answer: 3, latex: '7 - 4 = ?' },
    { question: '6 * 8', answer: 48, latex: '6 \\times 8 = ?' },
    { question: '15 / 3', answer: 5, latex: '15 \\div 3 = ?' },
    { question: '(4 + 5) * 2', answer: 18, latex: '(4 + 5) \\times 2 = ?' },
    { question: '20 - (3 * 4)', answer: 8, latex: '20 - (3 \\times 4) = ?' },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleCheckAnswer = () => {
    try {
      const userValue = evaluate(userAnswer)
      const correctAnswer = problems[currentIndex].answer
      
      if (Math.abs(userValue - correctAnswer) < 0.001) {
        setFeedback({ type: 'success', message: '¡Correcto! Excelente trabajo.' })
        setScore(score + 1)
        setTimeout(() => handleNextProblem(), 1500)
      } else {
        setFeedback({ type: 'error', message: `Incorrecto. La respuesta es ${correctAnswer}` })
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Por favor ingresa una respuesta válida' })
    }
  }

  const handleNextProblem = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer('')
      setFeedback({ type: null, message: '' })
    } else {
      setFeedback({ type: 'info', message: `¡Has completado todos los problemas! Tu puntuación: ${score + 1}/${problems.length}` })
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setScore(0)
    setUserAnswer('')
    setFeedback({ type: null, message: '' })
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Módulo de Aritmética
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Problema {currentIndex + 1} de {problems.length}
            </Typography>
            <Box sx={{ my: 4, textAlign: 'center', fontSize: '2rem' }}>
              <InlineMath math={problems[currentIndex].latex} />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
              <TextField
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Tu respuesta"
                variant="outlined"
                type="text"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleCheckAnswer()
                }}
                sx={{ width: 200 }}
              />
              <Button 
                variant="contained" 
                onClick={handleCheckAnswer}
                disabled={!userAnswer}
              >
                Verificar
              </Button>
            </Box>

            {feedback.type && (
              <Alert severity={feedback.type} sx={{ mt: 2 }}>
                {feedback.message}
              </Alert>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Área de Trabajo Interactiva
            </Typography>
            <MathCanvas expression={problems[currentIndex].question} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tu Progreso
            </Typography>
            <Typography variant="h4" color="primary">
              {score} / {problems.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Problemas resueltos correctamente
            </Typography>
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={handleReset}
            >
              Reiniciar
            </Button>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Consejos
            </Typography>
            <Typography variant="body2" paragraph>
              • Recuerda el orden de las operaciones (PEMDAS)
            </Typography>
            <Typography variant="body2" paragraph>
              • Resuelve primero lo que está dentro de los paréntesis
            </Typography>
            <Typography variant="body2" paragraph>
              • Multiplicación y división antes que suma y resta
            </Typography>
            <Typography variant="body2">
              • Tómate tu tiempo para pensar cada paso
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ArithmeticModule