import { useParams, useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Paper, CircularProgress, Grid, Card, CardContent, Chip, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { ArrowBack, ExpandMore, School, Assignment, Timeline } from '@mui/icons-material'
import { CurriculumProvider } from '../contexts/CurriculumContext'
import { useState, useEffect } from 'react'
import { curriculumAPI } from '../services/curriculumAPI'
import { Domain, Standard } from '../types/curriculum'

const DomainPage = () => {
  const { gradeCode, domainCode } = useParams<{ gradeCode: string; domainCode: string }>()
  const navigate = useNavigate()
  const [domain, setDomain] = useState<Domain | null>(null)
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackToDomains = () => {
    navigate(`/curriculum/grade/${gradeCode}`)
  }

  useEffect(() => {
    const loadDomainData = async () => {
      if (!gradeCode || !domainCode) return
      
      setLoading(true)
      setError(null)
      
      try {
        // Get domains for the grade to find current domain info
        const domainsResponse = await curriculumAPI.getDomainsForGrade(gradeCode)
        if (domainsResponse.success && domainsResponse.data) {
          const currentDomain = domainsResponse.data.find(d => d.code === domainCode.toUpperCase())
          setDomain(currentDomain || null)
        }
        
        // Get standards for this domain and grade
        const standardsResponse = await curriculumAPI.getStandardsForGradeDomain(gradeCode, domainCode)
        if (standardsResponse.success && standardsResponse.data) {
          setStandards(standardsResponse.data)
        }
      } catch (err) {
        setError('Error al cargar el contenido del dominio')
        console.error('Error loading domain data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadDomainData()
  }, [gradeCode, domainCode])

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
        <Button onClick={handleBackToDomains} variant="contained" sx={{ mt: 2 }}>
          Volver a Dominios
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
            Grado {gradeCode.toUpperCase()} - {domain?.name || domainCode.toUpperCase()}
          </Typography>
        </Box>

        {/* Domain Header */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {domain?.name || domainCode.toUpperCase()}
              </Typography>
              {domain?.description && (
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {domain.description}
                </Typography>
              )}
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<School />} 
                  label={`Grado ${gradeCode.toUpperCase()}`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<Assignment />} 
                  label={`${standards.length} Estándares`} 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                {domain?.grade_start && domain?.grade_end && (
                  <Chip 
                    icon={<Timeline />} 
                    label={`Grados ${domain.grade_start}-${domain.grade_end}`} 
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Standards Section */}
        {standards.length > 0 ? (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Estándares Common Core
            </Typography>
            <Grid container spacing={3}>
              {standards.map((standard) => (
                <Grid item xs={12} key={standard.id}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" color="primary">
                          {standard.code}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                          {standard.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <Chip 
                            size="small" 
                            label={`Nivel ${standard.complexity_level || 1}`}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box>
                        <Typography variant="body1" paragraph>
                          {standard.description}
                        </Typography>
                        {standard.examples && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="subtitle2" gutterBottom color="primary">
                              Ejemplos:
                            </Typography>
                            <Typography variant="body2">
                              {standard.examples}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => navigate(`/curriculum/grade/${gradeCode}/domain/${domainCode}/standard/${standard.id}/lessons`)}
                          >
                            Ver Lecciones
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => navigate(`/curriculum/grade/${gradeCode}/domain/${domainCode}/standard/${standard.id}/practice`)}
                          >
                            Ejercicios
                          </Button>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No hay estándares disponibles
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Los estándares para este dominio están siendo desarrollados.
            </Typography>
          </Paper>
        )}
      </Box>
    </CurriculumProvider>
  )
}

export default DomainPage