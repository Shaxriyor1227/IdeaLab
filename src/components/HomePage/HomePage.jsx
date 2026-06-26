import React from 'react'
import Hero from '../Hero/Hero'
import Stats from '../Stats/Stats'
import IdeaAnalysis from '../IdeaAnalysis/IdeaAnalysis'
import HowItWorks from '../HowItWorks/HowItWorks'

const HomePage = () => {
  return (
    <div>
        <Hero />
        <IdeaAnalysis />
        <Stats />
        <HowItWorks />
    </div>
  )
}

export default HomePage