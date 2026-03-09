import { useEffect } from 'react'
import Lenis from 'lenis'
import { motion, AnimatePresence, frame } from 'framer-motion'
import './App.scss'
import { RouteController } from './router/routes'

// Reusable page transition wrapper — import and use in any page component
export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {children}
  </motion.div>
)

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    })

    // Tick Lenis via Framer Motion's unified RAF engine
    // Keeps both libraries on a single animation frame — no double RAF
    frame.read((data: { timestamp: number }) => {
      lenis.raf(data.timestamp)
    }, true)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      <div className="app-container">
        <RouteController />
      </div>
    </AnimatePresence>
  )
}

export default App
