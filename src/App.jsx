import React from 'react'
import Header from './components/Header/Header'
import HomePage from './components/HomePage/HomePage'
import Footer from './components/Footer/Footer'
import { Route, Routes } from 'react-router-dom'
import AnalyzePage from './components/Analyzepage/Analyzepage'
import ResultsPage from './components/pages/Resultspage/Resultspage'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/analyze" element={<AnalyzePage />} />
         <Route path="/results" element={<ResultsPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App