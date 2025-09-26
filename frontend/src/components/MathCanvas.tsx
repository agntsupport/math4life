import { useRef, useState, useEffect } from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Undo, Redo, Clear, Help } from '@mui/icons-material'
import { evaluate } from 'mathjs'

interface MathCanvasProps {
  expression: string
  onExpressionChange?: (expr: string) => void
}

const MathCanvas = ({ expression }: MathCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [history, setHistory] = useState<string[]>([expression])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [currentExpression, setCurrentExpression] = useState(expression)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    drawExpression()
  }, [currentExpression])

  const drawExpression = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '24px "Courier New", monospace'
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    const parts = currentExpression.split(/([+\-*/()])/g).filter(p => p.trim())
    let x = 50
    const y = canvas.height / 2

    parts.forEach((part) => {
      const isOperator = ['+', '-', '*', '/', '(', ')'].includes(part)
      
      ctx.fillStyle = isOperator ? '#1976d2' : '#333'
      ctx.fillText(part, x, y)
      
      const metrics = ctx.measureText(part)
      x += metrics.width + 10
    })

    try {
      const result = evaluate(currentExpression.replace('?', ''))
      ctx.fillStyle = '#4caf50'
      ctx.font = '20px Arial'
      ctx.fillText(`= ${result}`, canvas.width - 100, y)
    } catch (e) {
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCurrentExpression(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentExpression(history[newIndex])
    }
  }

  const handleClear = () => {
    setCurrentExpression('')
    setHistory([''])
    setHistoryIndex(0)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    console.log(`Clicked at (${x}, ${y})`)
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Tooltip title="Deshacer">
          <IconButton onClick={handleUndo} disabled={historyIndex === 0}>
            <Undo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Rehacer">
          <IconButton onClick={handleRedo} disabled={historyIndex === history.length - 1}>
            <Redo />
          </IconButton>
        </Tooltip>
        <Tooltip title="Limpiar">
          <IconButton onClick={handleClear}>
            <Clear />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ayuda">
          <IconButton onClick={() => setShowHint(!showHint)}>
            <Help />
          </IconButton>
        </Tooltip>
      </Box>
      
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '200px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          backgroundColor: 'white',
          cursor: 'pointer'
        }}
      />
      
      {showHint && (
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: 'info.light',
          borderRadius: 1,
          color: 'white'
        }}>
          <Typography variant="body2">
            Pista: Intenta resolver las operaciones paso a paso, empezando por los paréntesis.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default MathCanvas