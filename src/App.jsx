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
import SignIn from './components/pages/SignIn/SignIn'
import Signup from './components/pages/Signup/Signup'
import ForgotPassword from './components/pages/ForgotPassword/ForgotPassword'
import ProtectedRoute from './components/pages/Route/ProtectedRoute'

const App = () => {
  const location = useLocation();
  const hideFooter = ['/results', '/swot-detail', '/signin', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
         <Route path="/analyze" element={<ProtectedRoute><AnalyzePage /></ProtectedRoute>} />
         <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
         <Route path="/swot-detail" element={<ProtectedRoute><DetailAnalysisPage /></ProtectedRoute>} />
         <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/features" element={<FeaturesPage />} />
         <Route path="/signin" element={<SignIn />} />
         <Route path="/signup" element={<Signup />} />
         <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App