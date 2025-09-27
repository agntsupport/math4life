import { Routes, Route } from 'react-router-dom'
import { Container } from '@mui/material'
import HomePage from './pages/HomePage'
import CurriculumPage from './pages/CurriculumPage'
import DomainPage from './pages/DomainPage'
import ArithmeticModule from './pages/modules/ArithmeticModule'
import AlgebraModule from './pages/modules/AlgebraModule'
import Playground from './pages/Playground'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/curriculum/grade/:gradeCode" element={<CurriculumPage />} />
          <Route path="/curriculum/grade/:gradeCode/domain/:domainCode" element={<DomainPage />} />
          <Route path="/module/arithmetic" element={<ArithmeticModule />} />
          <Route path="/module/algebra" element={<AlgebraModule />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </Container>
    </Layout>
  )
}

export default App