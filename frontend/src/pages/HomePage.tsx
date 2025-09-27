import { Box, Paper, Typography, Button } from '@mui/material'
import { School as SchoolIcon } from '@mui/icons-material'
import { CurriculumProvider } from '../contexts/CurriculumContext'
import GradeLevelNavigation from '../components/curriculum/GradeLevelNavigation'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

  const handleGradeSelect = (gradeCode: string) => {
    navigate(`/curriculum/grade/${gradeCode}`)
  }

  return (
    <CurriculumProvider>
      <Box>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 48, mr: 2 }} />
            <Typography variant="h3" component="h1" fontWeight="bold">
              Math4Life
            </Typography>
          </Box>
          <Typography variant="h5" align="center" sx={{ mb: 2 }}>
            Curriculum Matemático K-8
          </Typography>
          <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
            Aprende matemáticas siguiendo los estándares Common Core
          </Typography>
        </Paper>

        <GradeLevelNavigation 
          onGradeSelect={handleGradeSelect}
          showProgress={false}
          allowLocked={true}
        />

        <Paper sx={{ p: 3, mt: 4, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" gutterBottom align="center">
            Sistema de Aprendizaje Adaptativo
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" align="center">
              ✓ Progresión K-8 estructurada
            </Typography>
            <Typography variant="body2" align="center">
              ✓ Estándares Common Core
            </Typography>
            <Typography variant="body2" align="center">
              ✓ Tracking de progreso individual
            </Typography>
            <Typography variant="body2" align="center">
              ✓ UI adaptativa por edad
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
            <Button 
              variant="outlined" 
              sx={{ color: 'white', borderColor: 'white' }}
              onClick={() => navigate('/module/arithmetic')}
            >
              Módulo Aritmética
            </Button>
            <Button 
              variant="outlined" 
              sx={{ color: 'white', borderColor: 'white' }}
              onClick={() => navigate('/module/algebra')}
            >
              Módulo Álgebra
            </Button>
            <Button 
              variant="outlined" 
              sx={{ color: 'white', borderColor: 'white' }}
              onClick={() => navigate('/playground')}
            >
              Playground
            </Button>
          </Box>
        </Paper>
      </Box>
    </CurriculumProvider>
  )
}

export default HomePage