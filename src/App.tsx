import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Settings, Menu, X } from 'lucide-react'
import './index.css'
import ProgramLevel from './pages/ProgramLevel'
import Feedback from './pages/Feedback'
import Admin from './pages/Admin'
import Risks from './pages/Risks'

const NAV = [
  { to: '/program', label: 'Program Level' },
  { to: '/risks', label: 'Risks & Issues' },
  { to: '/feedback', label: 'Feedback to UST' },
]

function LiveClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const date = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      <div className="leading-tight text-right">
        <div className="font-semibold text-slate-700 tabular-nums">{time}</div>
        <div className="text-[11px] text-slate-400">{date}</div>
      </div>
    </div>
  )
}

function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* co-brand */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-9 px-3 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(150deg,#16263b,#0b2440)' }}>
            <img src="/logo-main-white.svg" alt="UST" className="h-5 w-auto max-w-[72px] object-contain" />
          </div>
          <span className="text-slate-300">×</span>
          <div className="h-9 px-2 flex items-center justify-center">
            <img src="/pbc_logo.svg" alt="Premera Blue Cross" className="h-6 w-auto max-w-[110px] object-contain" />
          </div>
          <div className="ml-1 leading-tight hidden lg:block">
            <div className="text-sm font-bold text-slate-800">Engagement Portal</div>
            <div className="text-[11px] text-slate-400">UST · Premera Blue Cross</div>
          </div>
        </div>

        {/* desktop nav */}
        <div className="hidden sm:flex gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive ? 'bg-[#e7f1fa] text-[#0067b1]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:block">
            <LiveClock />
          </div>
          <NavLink
            to="/admin"
            title="Admin · Push Data"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive ? 'bg-[#e7f1fa] text-[#0067b1]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`
            }
          >
            <Settings size={16} />
            <span className="hidden md:inline">Admin</span>
          </NavLink>
          {/* mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* mobile dropdown nav */}
      {menuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 flex flex-col gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-md text-sm font-medium transition ${
                  isActive ? 'bg-[#e7f1fa] text-[#0067b1]' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="max-w-[1400px] mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/program" replace />} />
          <Route path="/program" element={<ProgramLevel />} />
          <Route path="/risks" element={<Risks />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/program" replace />} />
        </Routes>
      </main>
    </div>
  )
}
