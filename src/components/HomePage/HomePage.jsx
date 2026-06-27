import React from 'react'
import Hero from '../Hero/Hero'
import Stats from '../Stats/Stats'
import IdeaAnalysis from '../IdeaAnalysis/IdeaAnalysis'
import HowItWorks from '../HowItWorks/HowItWorks'
import Features from '../Features/Features'
import Testimonials from '../Comments/Testimonials'
import CTA from '../CTA/CTA'

const HomePage = () => {
  return (
    <div>
        <Hero />
        <IdeaAnalysis />
        <Stats />
        <HowItWorks />
        <Features />
        <Testimonials />
        <CTA />
    </div>
  )
}

export default HomePage