import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Footer } from './components/Footer'

export function App() {
  return (
    <div className="app-grid">
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App
