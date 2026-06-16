import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { type IssueRow } from '../data/portalData'
import StatusDot from './StatusDot'
import RiskActionsModal from './RiskActionsModal'
import QuickFeedback from './QuickFeedback'

const isAtRisk = (s: string) => s === 'atRisk' || s === 'delayed'

export default function IssuesTable({ rows }: { rows: IssueRow[] }) {
  const [selected, setSelected] = useState<IssueRow | null>(null)
  const hasRisks = rows.some((r) => isAtRisk(r.status))

  return (
    <>
      <RiskActionsModal issue={selected} onClose={() => setSelected(null)} />

      <div>
        {/* ---- Desktop / tablet table ---- */}
        <table className="hidden sm:table w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: '#dfe3e6' }} className="text-slate-700">
              <th className="text-left font-bold px-3 py-2">Issue/Risks/Dependencies</th>
              <th className="text-left font-bold px-3 py-2">Mitigation Plan/Next Steps</th>
              <th className="text-left font-bold px-3 py-2 w-16">Date</th>
              <th className="text-center font-bold px-3 py-2 w-16">Status</th>
              <th className="text-center font-bold px-3 py-2 w-20">Feedback</th>
              {hasRisks && <th className="text-center font-bold px-3 py-2 w-24">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 ? 'bg-slate-50' : 'bg-white'}>
                <td className="px-3 py-3 align-top text-slate-700">{row.issue}</td>
                <td className="px-3 py-3 align-top">
                  <ul className="space-y-1">
                    {row.mitigations.map((m, j) => (
                      <li key={j} className="flex gap-2 text-[#0f7aa6]">
                        <span>•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-3 align-top text-[#0f7aa6] font-medium">{row.date}</td>
                <td className="px-3 py-3 align-top text-center">
                  <StatusDot status={row.status} />
                </td>
                <td className="px-3 py-3 align-top text-center">
                  <QuickFeedback itemId={row.id} itemLabel={row.issue} />
                </td>
                {hasRisks && (
                  <td className="px-3 py-3 align-top text-center">
                    {isAtRisk(row.status) && (
                      <button
                        onClick={() => setSelected(row)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition"
                        title="View risks & actions"
                      >
                        <AlertTriangle size={12} />
                        Actions
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* ---- Mobile stacked list ---- */}
        <div className="sm:hidden">
          <div style={{ background: '#dfe3e6' }} className="px-3 py-2 font-bold text-slate-700 text-sm">
            Issue / Risks / Dependencies
          </div>
          {rows.map((row, i) => (
            <div key={row.id} className={`px-3 py-3 border-b border-slate-100 ${i % 2 ? 'bg-slate-50' : 'bg-white'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm text-slate-700 min-w-0">{row.issue}</div>
                <div className="flex items-center gap-2 shrink-0">
                  {isAtRisk(row.status) && (
                    <button
                      onClick={() => setSelected(row)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 transition"
                      title="View risks & actions"
                    >
                      <AlertTriangle size={12} />
                    </button>
                  )}
                  <span className="text-xs text-[#0f7aa6] font-medium">{row.date}</span>
                  <StatusDot status={row.status} />
                  <QuickFeedback itemId={row.id} itemLabel={row.issue} />
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
    </>
  )
}
