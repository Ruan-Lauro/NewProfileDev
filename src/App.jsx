import Hero from './components/hero'
import About from './components/about'
import './App.css'
import Navbar from './components/navbar'
import Tecnologia from './components/tecnologia'
import Performance from './components/performance'
import Works from './components/work'
import Contact from './components/contact'
import Footer from './components/footer'
import MatrixBackground from './components/matrixBackground'

function App() {

  return (
   <main className="flex flex-col ">
      <MatrixBackground/>
      <Navbar/>
      <Hero/>
      <About/>
      <Tecnologia/>
      <Performance/>
      <Works/>
      <Contact/>
      <Footer/>
   </main>
  )
}

export default App
