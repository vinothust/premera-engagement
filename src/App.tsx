import { useEffect, useState } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Settings } from 'lucide-react'
import './index.css'
import ProgramLevel from './pages/ProgramLevel'
import TowerLevel from './pages/TowerLevel'
import Feedback from './pages/Feedback'
import Admin from './pages/Admin'

const NAV = [
  { to: '/program', label: 'Program Level' },
  { to: '/tower', label: 'Tower Level' },
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
  return (
    <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          {/* co-brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-9 px-3 rounded-md flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(150deg,#16263b,#0b2440)' }}>
              UST
            </div>
            <span className="text-slate-300">×</span>
            <div className="h-9 w-9 rounded-md flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(150deg,#00a0df,#0067b1)' }}>
              P
            </div>
            <div className="ml-2 leading-tight hidden lg:block">
              <div className="text-sm font-bold text-slate-800">Engagement Portal</div>
              <div className="text-[11px] text-slate-400">UST · Premera Blue Cross</div>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto no-scrollbar">
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
        </div>
      </div>
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
          <Route path="/tower" element={<TowerLevel />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/program" replace />} />
        </Routes>
      </main>
    </div>
  )
}
