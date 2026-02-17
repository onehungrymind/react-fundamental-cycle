import './App.css'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { MainContent } from './components/MainContent'
import { Footer } from './components/Footer'
import type { NavItem } from './types'

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '#dashboard' },
  { label: 'Projects',  path: '#projects'  },
  { label: 'Team',      path: '#team'      },
]

export function App() {
  return (
    <div className="app-grid">
      <Header title="TaskFlow" subtitle="Manage your work" />
      <Sidebar navItems={navItems} />
      <MainContent />
      <Footer />
    </div>
  )
}

export default App
