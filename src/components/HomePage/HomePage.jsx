import { Suspense, lazy } from 'react'

const Hero = lazy(() => import('../Hero/Hero'))
const Stats = lazy(() => import('../Stats/Stats'))
const IdeaAnalysis = lazy(() => import('../IdeaAnalysis/IdeaAnalysis'))
const HowItWorks = lazy(() => import('../HowItWorks/HowItWorks'))
const Features = lazy(() => import('../Features/Features'))
const Testimonials = lazy(() => import('../Comments/Testimonials'))
const CTA = lazy(() => import('../CTA/CTA'))

const HomePage = () => {
  const fallback = <div style={{ minHeight: '200px' }} />;

  return (
    <div>
      <Suspense fallback={fallback}><Hero /></Suspense>
      <Suspense fallback={fallback}><IdeaAnalysis /></Suspense>
      <Suspense fallback={fallback}><Stats /></Suspense>
      <Suspense fallback={fallback}><HowItWorks /></Suspense>
      {/* <Suspense fallback={fallback}><Features /></Suspense> */}
      <Suspense fallback={fallback}><Testimonials /></Suspense>
      <Suspense fallback={fallback}><CTA /></Suspense>
    </div>
  )
}

export default HomePage