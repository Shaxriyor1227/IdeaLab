import React from 'react'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import Footer from './components/Footer/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import AnalyzePage from './components/Analyzepage/Analyzepage'
import ResultsPage from './components/pages/Resultspage/Resultspage'
import DetailAnalysisPage from './components/pages/DetailAnalysisPage/DetailAnalysisPage'
import HistoryPage from './components/pages/HistoryPage/HistoryPage'
import FeaturesPage from './components/pages/FeaturesPage/FeaturesPage'

const App = () => {
  const location = useLocation();
  const hideHeaderFooter = ['/results', '/swot-detail'].includes(location.pathname);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/analyze" element={<AnalyzePage />} />
         <Route path="/results" element={<ResultsPage />} />
         <Route path="/swot-detail" element={<DetailAnalysisPage />} />
         <Route path="/history" element={<HistoryPage />} />
          <Route path="/features" element={<FeaturesPage />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  )
}

export default App