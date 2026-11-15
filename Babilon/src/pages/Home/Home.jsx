import React from 'react'
import Navebar from '../../components/Navbar/Navbar'
import Hero from '../../components/Sections/Hero/Hero'
import Statics from '../../components/Sections/Static/Statics'
import News from '../../components/Sections/News/News'
import Blog from '../../components/Sections/Blog/Blog'
import Opportunity from '../../components/Sections/Opportunity/Opportunity'

function Home() {
  return (
    <>
    <Navebar/>
    <Hero/>
    <Statics/>
    <Blog/>
    <News/>
    <Opportunity/>
    </>
  )
}

export default Home