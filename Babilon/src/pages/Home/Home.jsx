import React from 'react'
import Hero from '../../components/Sections/Hero/Hero'
import Statics from '../../components/Sections/Static/Statics'
// import Library from '../../components/Sections/Library/Library'
import Blog from '../../components/Sections/Blog/Blog'
import News from '../../components/Sections/News/News'
import Opportunity from '../../components/Sections/Opportunity/Opportunity'
import Share from '../../components/Sections/share/Share'

function Home() {
  return (
    <>
      <Hero />
      <Statics />
      {/* <Library /> */}
      <Blog />
      <News />
      <Opportunity />
      <Share />
    </>
  )
}

export default Home;