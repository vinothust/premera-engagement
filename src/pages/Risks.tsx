import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import SlideHeader from '../components/SlideHeader'
import StatusDot from '../components/StatusDot'
import RiskActionsModal from '../components/RiskActionsModal'
import { usePortalData } from '../context/PortalDataContext'
import { type IssueRow } from '../data/portalData'

const isAtRisk = (s: string) => s === 'atRisk' || s === 'delayed'

function IssueGroup({
  title,
  rows,
  onSelect,
}: {
  title: string
  rows: IssueRow[]
  onSelect: (r: IssueRow) => void
}) {
  const visible = rows.filter((r) => isAtRisk(r.status))
  if (visible.length === 0) return null

  return (
    <div className="card overflow-hidden">
      <div style={{ background: '#dfe3e6' }} className="px-4 py-2 font-semibold text-slate-700 text-sm">
        {title}
      </div>

      {/* desktop */}
      <table className="hidden sm:table w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-xs text-slate-500">
            <th className="text-left font-semibold px-4 py-2">Issue / Risk / Dependency</th>
            <th className="text-left font-semibold px-4 py-2">Mitigation Plan</th>
            <th className="text-left font-semibold px-4 py-2 w-16">Date</th>
            <th className="text-center font-semibold px-4 py-2 w-16">Status</th>
            <th className="text-center font-semibold px-4 py-2 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((row, i) => (
            <tr key={row.id} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
              <td className="px-4 py-3 align-top text-slate-700">
                {row.needsPremeraAttention && (
                  <span className="inline-block mr-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                    Premera
                  </span>
                )}
                {row.issue}
              </td>
              <td className="px-4 py-3 align-top">
                <ul className="space-y-1">
                  {row.mitigations.map((m, j) => (
                    <li key={j} className="flex gap-2 text-[#0f7aa6]">
                      <span>•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-4 py-3 align-top text-[#0f7aa6] font-medium">{row.date}</td>
              <td className="px-4 py-3 align-top text-center">
                <StatusDot status={row.status} />
              </td>
              <td className="px-4 py-3 align-top text-center">
                <button
                  onClick={() => onSelect(row)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition"
                >
                  <AlertTriangle size={12} />
                  Actions
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* mobile */}
      <div className="sm:hidden divide-y divide-slate-100">
        {visible.map((row, i) => (
          <div key={row.id} className={`px-3 py-3 ${i % 2 ? 'bg-slate-50' : 'bg-white'}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm text-slate-700 min-w-0">
                {row.needsPremeraAttention && (
                  <span className="inline-block mr-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                    Premera
                  </span>
                )}
                {row.issue}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSelect(row)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition"
                >
                  <AlertTriangle size={12} />
                </button>
                <span className="text-xs text-[#0f7aa6] font-medium">{row.date}</span>
                <StatusDot status={row.status} />
              </div>
            </div>
            <ul className="mt-2 space-y-1">
              {row.mitigations.map((m, j) => (
                <li key={j} className="flex gap-2 text-[13px] text-[#0f7aa6]">
                  <span>•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Risks() {
  const { data } = usePortalData()
  const [selected, setSelected] = useState<IssueRow | null>(null)

  const allIssues = [
    ...data.program.ito.issues,
    ...data.program.bpo.issues,
    ...data.tower.issues,
  ]
  const totalAtRisk = allIssues.filter((r) => isAtRisk(r.status)).length
  const totalPremera = allIssues.filter((r) => r.needsPremeraAttention).length

  return (
    <div className="slide">
      <RiskActionsModal issue={selected} onClose={() => setSelected(null)} />

      <SlideHeader title="Consolidated Risks & Actions" sampleLines={[]} asOf={data.asOf} />

      {/* Summary pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200">
          <AlertTriangle size={15} className="text-amber-500" />
          <span className="text-sm font-semibold text-amber-800">
            Total Risks / Issues:{' '}
            <span className="text-amber-600">{totalAtRisk}</span>
          </span>
        </div>
        {totalPremera > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle size={15} className="text-red-500" />
            <span className="text-sm font-semibold text-red-800">
              Attention required from Premera:{' '}
              <span className="text-red-600">{totalPremera}</span>
            </span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <IssueGroup title="Program Level — ITO" rows={data.program.ito.issues} onSelect={setSelected} />
        <IssueGroup title="Program Level — BPO" rows={data.program.bpo.issues} onSelect={setSelected} />
        <IssueGroup title="Tower Level" rows={data.tower.issues} onSelect={setSelected} />
      </div>
    </div>
  )
}
