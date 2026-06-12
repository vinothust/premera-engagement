import { STATUS, LEGEND_ORDER } from '../data/status'
import StatusDot from './StatusDot'

export default function Legend() {
  return (
    <div className="flex items-center gap-5 flex-wrap">
      <span className="px-3 py-1 rounded-full text-white text-sm font-semibold" style={{ background: '#1f9bb0' }}>
        Status
      </span>
      {LEGEND_ORDER.map((k) => (
        <span key={k} className="flex items-center gap-2 text-sm text-slate-600">
          <StatusDot status={k} />
          {STATUS[k].label}
        </span>
      ))}
    </div>
  )
}
