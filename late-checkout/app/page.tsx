import Header from './components/Header'
import Hero from './components/Hero'
import Trust from './components/Trust'
import Piliers from './components/Piliers'
import Experience from './components/Experience'
import Services from './components/Services'
import Formules from './components/Formules'
import Simulateur from './components/Simulateur'
import Proof from './components/Proof'
import CtaBand from './components/CtaBand'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Trust />
        <Piliers />
        <Experience />
        <Services />
        <Formules />
        <Simulateur />
        <Proof />
        <CtaBand />
      </main>
      <Footer />
    </>
  )
}
