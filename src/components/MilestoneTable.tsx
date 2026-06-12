import { Fragment } from 'react'
import { type MilestoneSection } from '../data/portalData'
import StatusDot from './StatusDot'

interface Props {
  headLabel: string
  statusLabel?: string // "Rag" (Tower) or "Status" (Program)
  sections: MilestoneSection[]
  headColor?: string // header band color
}

export default function MilestoneTable({
  headLabel,
  statusLabel = 'Status',
  sections,
  headColor = '#1f9bb0',
}: Props) {
  return (
    <div>
      {/* ---- Desktop / tablet table ---- */}
      <table className="hidden sm:table w-full text-sm border-collapse">
        <thead>
          <tr style={{ background: headColor }} className="text-white">
            <th className="text-left font-semibold px-3 py-2">{headLabel}</th>
            <th className="text-left font-semibold px-3 py-2 w-24">Due Date</th>
            <th className="text-left font-semibold px-3 py-2 w-24">Revised Date</th>
            <th className="text-center font-semibold px-3 py-2 w-14">{statusLabel}</th>
          </tr>
        </thead>
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.id}>
              <tr style={{ background: '#eceadb' }}>
                <td colSpan={4} className="px-3 py-1.5 font-semibold text-slate-700 text-[13px]">
                  {section.title}
                </td>
              </tr>
              {section.rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-1.5 text-slate-700">{row.label}</td>
                  <td className="px-3 py-1.5 text-slate-600">{row.due}</td>
                  <td className="px-3 py-1.5 text-slate-600">{row.revised}</td>
                  <td className="px-3 py-1.5 text-center">
                    <StatusDot status={row.status} />
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>

      {/* ---- Mobile stacked list ---- */}
      <div className="sm:hidden">
        <div style={{ background: headColor }} className="text-white font-semibold px-3 py-2 text-sm">
          {headLabel}
        </div>
        {sections.map((section) => (
          <div key={section.id}>
            <div style={{ background: '#eceadb' }} className="px-3 py-1.5 font-semibold text-slate-700 text-[13px]">
              {section.title}
            </div>
            {section.rows.map((row) => (
              <div key={row.id} className="flex items-start justify-between gap-3 px-3 py-2 border-b border-slate-100">
                <div className="min-w-0">
                  <div className="text-sm text-slate-700">{row.label}</div>
                  {(row.due || row.revised) && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {row.due && <>Due {row.due}</>}
                      {row.revised && <> · Revised {row.revised}</>}
                    </div>
                  )}
                </div>
                <div className="pt-0.5 shrink-0">
                  <StatusDot status={row.status} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
