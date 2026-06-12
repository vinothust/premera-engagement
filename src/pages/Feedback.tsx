import { useState, type FormEvent } from 'react'
import { Star, Send, MessageSquareText } from 'lucide-react'

const AREAS = [
  'Application Support',
  'Application Development',
  'Claims Operations',
  'Provider Data Management',
  'Database Administration',
  'End‑to‑End Testing',
  'Enrollment & Billing',
  'Product Configuration',
  'Microsoft 365 Support',
  'Provider Appeals & Grievances (Appian)',
  'Provider Contact Center',
  'Service Desk / IT Operations Center',
]

interface Entry {
  rating: number
  area: string
  subject: string
  details: string
}



function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange?.(n)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star size={onChange ? 26 : 16} fill={n <= value ? '#f2b705' : 'none'} stroke={n <= value ? '#f2b705' : '#cbd5e1'} />
        </button>
      ))}
    </div>
  )
}

export default function Feedback() {
  const [rating, setRating] = useState(0)
  const [area, setArea] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [log, setLog] = useState<Entry[]>([])
  const [toast, setToast] = useState(false)

  const avg = log.length ? (log.reduce((s, e) => s + e.rating, 0) / log.length).toFixed(1) : null

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!subject.trim()) return
    setLog([{ rating, area, subject, details }, ...log])
    setSubject('')
    setDetails('')
    setArea('')
    setRating(0)
    setToast(true)
    setTimeout(() => setToast(false), 2600)
  }

  return (
    <div className="slide">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">Feedback to UST</h1>
        <p className="mt-1 text-slate-600">Premera stakeholders share what's working well and where UST should improve.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <form onSubmit={submit} className="card p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquareText size={18} style={{ color: '#0067b1' }} /> New Feedback
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Overall experience</label>
            <Stars value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
              required
            >
              <option value="" disabled>Select an area…</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
              placeholder="Brief summary of your feedback"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
              placeholder="Share what's working well or what UST should improve..."
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm"
            style={{ background: 'linear-gradient(150deg,#00a0df,#0067b1)' }}
          >
            <Send size={16} /> Send to UST
          </button>
        </form>

        {/* Log */}
        <aside className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Feedback Log</h3>
            <div className="text-sm text-slate-400">{log.length} submissions</div>
          </div>

          {avg && (
            <div className="rounded-lg p-4 mb-4 flex items-center gap-3" style={{ background: 'rgba(0,103,177,.06)' }}>
              <div className="text-3xl font-extrabold text-slate-800">{avg}</div>
              <div>
                <Stars value={Math.round(Number(avg))} />
                <div className="text-xs text-slate-500 mt-1">Average rating</div>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-[28rem] overflow-auto pr-1">
            {log.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No feedback submitted yet.</p>
            )}
            {log.map((e, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-800">{e.subject}</div>
                  <Stars value={e.rating} />
                </div>
                <div className="text-xs font-medium mt-1" style={{ color: '#0067b1' }}>
                  {e.area}
                </div>
                {e.details && <div className="text-sm text-slate-600 mt-1">{e.details}</div>}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {toast && (
        <div
          className="fixed bottom-6 right-6 text-white px-5 py-3 rounded-lg shadow-lg font-medium"
          style={{ background: '#1aa260' }}
        >
          Feedback sent to UST — thank you!
        </div>
      )}
    </div>
  )
}
