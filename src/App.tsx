import './App.scss'
import { RouteController } from './router/routes'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <div className="app-container">
      <ScrollToTop />
      <RouteController />
    </div>
  )
}

export default App
