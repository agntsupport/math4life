import { useDrag } from 'react-dnd'
import { Box } from '@mui/material'
import { InlineMath } from 'react-katex'

interface DraggableExpressionProps {
  expression: string
  id?: string
}

const DraggableExpression = ({ expression, id = expression }: DraggableExpressionProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'expression',
    item: { id, expression },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <Box
      ref={drag}
      sx={{
        display: 'inline-block',
        padding: '8px 12px',
        margin: '4px',
        backgroundColor: isDragging ? 'action.selected' : 'background.paper',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 1,
        cursor: 'move',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 2,
        },
      }}
    >
      <InlineMath math={expression} />
    </Box>
  )
}

export default DraggableExpression