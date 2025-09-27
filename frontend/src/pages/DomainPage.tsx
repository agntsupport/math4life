import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Paper } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { CurriculumProvider } from '../contexts/CurriculumContext'

const DomainPage = () => {
  const { gradeCode, domainCode } = useParams<{ gradeCode: string; domainCode: string }>()
  const navigate = useNavigate()

  const handleBackToDomains = () => {
    navigate(`/curriculum/grade/${gradeCode}`)
  }

  if (!gradeCode || !domainCode) {
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

  return (
    <CurriculumProvider>
      <Box>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToDomains}
            variant="outlined"
          >
            Volver a Dominios
          </Button>
          <Typography variant="h4" component="h1">
            Grado {gradeCode.toUpperCase()} - {domainCode.toUpperCase()}
          </Typography>
        </Box>

        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Dominio: {domainCode.toUpperCase()}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Los estándares y lecciones para este dominio estarán disponibles en Phase 2.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phase 1 incluye la navegación básica. Phase 2 agregará:
          </Typography>
          <Box sx={{ mt: 2, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
            <Typography variant="body2">• Estándares específicos del dominio</Typography>
            <Typography variant="body2">• Lecciones interactivas</Typography>
            <Typography variant="body2">• Ejercicios adaptativos</Typography>
            <Typography variant="body2">• Sistema de evaluación</Typography>
            <Typography variant="body2">• Tracking de progreso detallado</Typography>
          </Box>
        </Paper>
      </Box>
    </CurriculumProvider>
  )
}

export default DomainPage