import { Suspense, lazy, useEffect } from 'react'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/pages/Route/ProtectedRoute'

const HomePage = lazy(() => import('./components/HomePage/HomePage'))
const AnalyzePage = lazy(() => import('./components/Analyzepage/Analyzepage'))
const ResultsPage = lazy(() => import('./components/pages/Resultspage/Resultspage'))
const DetailAnalysisPage = lazy(() => import('./components/pages/DetailAnalysisPage/DetailAnalysisPage'))
const HistoryPage = lazy(() => import('./components/pages/HistoryPage/HistoryPage'))
const FeaturesPage = lazy(() => import('./components/pages/FeaturesPage/FeaturesPage'))
const BlogPage = lazy(() => import('./components/pages/BlogPage/BlogPage'))
const SignIn = lazy(() => import('./components/pages/SignIn/SignIn'))
const Signup = lazy(() => import('./components/pages/Signup/Signup'))
const ForgotPassword = lazy(() => import('./components/pages/ForgotPassword/ForgotPassword'))
const BlogPostPage = lazy(() => import('./components/pages/BlogPage/BlogPostPage'))
const SettingsPage = lazy(() => import('./components/pages/SettingsPage/SettingsPage'))

const App = () => {
  const location = useLocation();
  const hideFooter = ['/results', '/swot-detail', '/signin', '/signup', '/forgot-password'].includes(location.pathname);
  const hideHeader = ['/signin', '/signup', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  const pageFallback = (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      Loading page...
    </div>
  );

  return (
    <div>
      {!hideHeader && <Header />}
      <div className={hideHeader ? "" : "page-content-with-header"}>
        <Suspense fallback={pageFallback}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analyze" element={<ProtectedRoute><AnalyzePage /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
            <Route path="/swot-detail" element={<ProtectedRoute><DetailAnalysisPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>404 - Page Not Found</div>} />
          </Routes>
        </Suspense>
      </div>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App