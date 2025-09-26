import { Grid, Card, CardContent, CardActions, Typography, Button, Box, Paper } from '@mui/material'
import { Functions, Calculate, Explore } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const HomePage = () => {
  const navigate = useNavigate()

  const modules = [
    {
      title: 'Aritmética',
      description: 'Domina las operaciones básicas y propiedades numéricas',
      icon: <Calculate sx={{ fontSize: 40 }} />,
      path: '/module/arithmetic',
      color: '#4caf50',
      topics: ['Suma y Resta', 'Multiplicación', 'División', 'Fracciones']
    },
    {
      title: 'Álgebra',
      description: 'Resuelve ecuaciones y manipula expresiones algebraicas',
      icon: <Functions sx={{ fontSize: 40 }} />,
      path: '/module/algebra',
      color: '#2196f3',
      topics: ['Ecuaciones Lineales', 'Sistemas', 'Factorización', 'Polinomios']
    },
    {
      title: 'Playground',
      description: 'Experimenta libremente con expresiones matemáticas',
      icon: <Explore sx={{ fontSize: 40 }} />,
      path: '/playground',
      color: '#ff9800',
      topics: ['Práctica Libre', 'Exploración', 'Creatividad']
    }
  ]

  return (
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
        <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold">
          Bienvenido a Math4Life
        </Typography>
        <Typography variant="h6" align="center" sx={{ opacity: 0.9 }}>
          Aprende matemáticas de forma interactiva y gratuita
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {modules.map((module, index) => (
          <Grid item xs={12} md={4} key={module.path}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      color: module.color
                    }}
                  >
                    {module.icon}
                    <Typography variant="h5" component="h2" sx={{ ml: 2, color: 'text.primary' }}>
                      {module.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {module.description}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    {module.topics.map((topic) => (
                      <Typography 
                        key={topic} 
                        variant="caption" 
                        component="span"
                        sx={{ 
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          m: 0.5,
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                          fontSize: '0.75rem'
                        }}
                      >
                        {topic}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="large" 
                    fullWidth 
                    variant="contained"
                    onClick={() => navigate(module.path)}
                    sx={{ 
                      bgcolor: module.color,
                      '&:hover': {
                        bgcolor: module.color,
                        filter: 'brightness(0.9)'
                      }
                    }}
                  >
                    Comenzar
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 4, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          ¿Por qué Math4Life?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              ✓ 100% Gratuito y sin anuncios
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              ✓ Aprendizaje interactivo con drag & drop
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2">
              ✓ Disponible offline una vez cargado
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default HomePage