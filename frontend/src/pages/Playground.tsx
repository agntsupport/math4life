import { useState } from 'react'
import { Box, Typography, Paper, Grid, Button, TextField, Divider, Chip } from '@mui/material'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import { BlockMath } from 'react-katex'
import DraggableExpression from '../components/DraggableExpression'
import { evaluate, simplify } from 'mathjs'
import axios from 'axios'

const isTouchDevice = 'ontouchstart' in window

const Playground = () => {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const commonExpressions = [
    'x', 'y', '2', '3', '4', '5',
    '+', '-', '*', '/', '=',
    '(', ')', '^2', 'sqrt()'
  ]

  const handleEvaluate = async () => {
    try {
      setError(null)
      const evaluated = evaluate(expression)
      setResult(evaluated.toString())
      setHistory([...history, `${expression} = ${evaluated}`])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSimplify = async () => {
    try {
      setError(null)
      const simplified = simplify(expression).toString()
      setResult(simplified)
      setHistory([...history, `Simplified: ${expression} → ${simplified}`])
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleValidate = async () => {
    try {
      const response = await axios.post('/api/math/validate', { expression })
      if (response.data.valid) {
        setError(null)
        setResult('✓ Expresión válida')
      } else {
        setError(response.data.error)
      }
    } catch (err: any) {
      setError('Error al validar la expresión')
    }
  }

  const handleClear = () => {
    setExpression('')
    setResult(null)
    setError(null)
  }

  const handleAddToExpression = (value: string) => {
    setExpression(expression + value)
  }

  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      <Box>
        <Typography variant="h4" gutterBottom>
          Playground Matemático
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Experimenta libremente con expresiones matemáticas. Arrastra, escribe y manipula.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Editor de Expresiones
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                placeholder="Escribe tu expresión matemática aquí..."
                variant="outlined"
                sx={{ mb: 2, fontFamily: 'monospace', fontSize: '1.2rem' }}
              />

              {expression && (
                <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Vista previa:
                  </Typography>
                  <BlockMath math={expression} />
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Button variant="contained" onClick={handleEvaluate} disabled={!expression}>
                  Evaluar
                </Button>
                <Button variant="contained" color="secondary" onClick={handleSimplify} disabled={!expression}>
                  Simplificar
                </Button>
                <Button variant="outlined" onClick={handleValidate} disabled={!expression}>
                  Validar
                </Button>
                <Button variant="outlined" color="error" onClick={handleClear}>
                  Limpiar
                </Button>
              </Box>

              {result && (
                <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'white' }}>
                  <Typography variant="h6">Resultado: {result}</Typography>
                </Paper>
              )}

              {error && (
                <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'white' }}>
                  <Typography>Error: {error}</Typography>
                </Paper>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Elementos Arrastrables
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonExpressions.map((expr) => (
                  <DraggableExpression key={expr} expression={expr} />
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Botones Rápidos
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonExpressions.map((expr) => (
                  <Chip
                    key={expr}
                    label={expr}
                    onClick={() => handleAddToExpression(expr)}
                    color="primary"
                    variant="outlined"
                    clickable
                  />
                ))}
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Historial
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {history.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No hay historial aún
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {history.map((item, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          bgcolor: 'grey.100',
                          p: 1,
                          borderRadius: 1
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DndProvider>
  )
}

export default Playground