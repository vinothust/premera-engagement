import { type ReactNode } from 'react'

// Dark chevron banner with an overlapping circular icon badge (Tower slide).
export default function ChevronBanner({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="relative flex items-center" style={{ height: 56 }}>
      <div
        className="absolute z-10 flex items-center justify-center rounded-full bg-white"
        style={{ width: 56, height: 56, boxShadow: '0 2px 10px rgba(11,36,64,.18)', border: '3px solid #d7e6f2' }}
      >
        <span style={{ color: '#0067b1' }}>{icon}</span>
      </div>
      <div
        className="flex items-center text-white font-bold text-lg pl-16 pr-10"
        style={{
          height: 44,
          marginLeft: 28,
          background: 'linear-gradient(150deg,#1d2733,#0b1622)',
          clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%)',
        }}
      >
        {label}
      </div>
    </div>
  )
}
