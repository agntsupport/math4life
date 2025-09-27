import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Paper } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { CurriculumProvider, useCurriculum } from '../contexts/CurriculumContext'
import { useEffect, useState } from 'react'
import { Domain } from '../types/curriculum'

const CurriculumPageContent = () => {
  const { gradeCode } = useParams<{ gradeCode: string }>()
  const navigate = useNavigate()
  const { state, actions } = useCurriculum()
  const [domains, setDomains] = useState<Domain[]>([])

  useEffect(() => {
    if (gradeCode) {
      actions.loadDomainsForGrade(gradeCode).then(() => {
        setDomains(state.availableDomains)
      })
    }
  }, [gradeCode, actions])

  useEffect(() => {
    setDomains(state.availableDomains)
  }, [state.availableDomains])

  const handleDomainSelect = (domainCode: string) => {
    navigate(`/curriculum/grade/${gradeCode}/domain/${domainCode}`)
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  if (!gradeCode) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Grado no especificado
        </Typography>
        <Button onClick={handleBackToHome} sx={{ mt: 2 }}>
          Volver al inicio
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBackToHome}
          variant="outlined"
        >
          Volver a Grados
        </Button>
        <Typography variant="h4" component="h1">
          Grado {gradeCode.toUpperCase()}
        </Typography>
      </Box>

      {state.isLoading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Cargando dominios...</Typography>
        </Paper>
      ) : domains.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Dominios para Grado {gradeCode.toUpperCase()}
          </Typography>
          <Typography color="text.secondary" paragraph>
            Los dominios específicos estarán disponibles una vez que la base de datos esté inicializada.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phase 1 incluye la estructura básica. Los dominios se cargarán automáticamente cuando el backend esté completamente configurado.
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            Selecciona un Dominio Matemático
          </Typography>
          {/* Aquí iría el componente DomainNavigation una vez que tengamos datos */}
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography>Dominios disponibles: {domains.length}</Typography>
            {domains.map(domain => (
              <Button 
                key={domain.code}
                variant="outlined" 
                sx={{ m: 1 }}
                onClick={() => handleDomainSelect(domain.code)}
              >
                {domain.name}
              </Button>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  )
}

const CurriculumPage = () => {
  return (
    <CurriculumProvider>
      <CurriculumPageContent />
    </CurriculumProvider>
  )
}

export default CurriculumPage