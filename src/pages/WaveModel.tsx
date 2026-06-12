const MONTHS = ['Jul 26', 'Aug 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27']

// Human-readable month range for the mobile card view (1-based inclusive columns).
const monthSpan = (start: number, end: number) =>
  start === end ? MONTHS[start - 1] : `${MONTHS[start - 1]} – ${MONTHS[end - 1]}`

interface Bar {
  start: number
  end: number // inclusive last month column (1-based)
  color: string
  label?: string
}
interface Seg {
  col: number
  color: string
  label: string
}
interface Pill {
  col: number
  text: string
}
interface WaveRow {
  name: string
  bar?: Bar
  segs?: Seg[]
  pill?: Pill
  line?: { start: number; end: number; color: string }
  desc?: string
}
interface Group {
  label: string
  band: string
  rowBg: string
  rows: WaveRow[]
  desc?: string[]
}

const GREEN = '#21b38f'
const BLUE = '#2aa3da'
const NAVY = '#0d2a43'
const KT = '#0e7c8c'

const GROUPS: Group[] = [
  {
    label: 'Business Events',
    band: NAVY,
    rowBg: '#f4f6f8',
    rows: [
      {
        name: 'Product Configuration & Group Setup',
        line: { start: 1, end: 7, color: NAVY },
        desc: 'High volume activity concentrated mid year through Q4 to build, finalize, and release products and group setups in preparation for 1/1 renewals and plan year readiness.',
      },
      {
        name: 'Enrollment',
        line: { start: 4, end: 7, color: NAVY },
        desc: 'Peak operational activity occurs Nov–Jan, driven by open enrollment with significant volume surges and downstream impacts such as effective dates and billing corrections.',
      },
      {
        name: 'Claims',
        line: { start: 6, end: 9, color: NAVY },
        desc: 'Claims volume and exception handling peak in Mar following plan year go live, driven by increased utilization and enrollment-related downstream effects.',
      },
      {
        name: 'Provider Credentialing',
        line: { start: 1, end: 3, color: NAVY },
        desc: 'Workload ramps gradually from late spring through early fall to prepare provider networks, directories, and payer enrollments for the upcoming plan year.',
      },
      {
        name: 'Provider Contact Center (Business Peak)',
        line: { start: 4, end: 7, color: NAVY },
        desc: 'Call volumes peak during open enrollment (Oct–Dec) and reach the highest levels in January due to enrollment, billing, and claims related inquiries.',
      },
    ],
  },
  {
    label: 'BPO · Wave 1',
    band: '#15a08a',
    rowBg: '#effbf7',
    desc: [
      'Completes transition before peak enrollment (Nov–Jan) and January surge',
      'Focuses first on operational, transaction-heavy functions that drive customer experience and compliance',
    ],
    rows: [
      { name: 'Provider Contact Center', bar: { start: 1, end: 5, color: GREEN, label: 'Staffing' }, pill: { col: 6, text: '12 weeks' } },
      { name: 'Provider Appeals & Grievances', bar: { start: 1, end: 5, color: GREEN, label: 'Staffing' }, pill: { col: 6, text: '12 weeks' } },
      { name: 'Provider Data Management', bar: { start: 1, end: 5, color: GREEN, label: 'Staffing' }, pill: { col: 6, text: '12 weeks' } },
      { name: 'Claims Operations (Facets)', bar: { start: 1, end: 5, color: GREEN, label: 'Staffing' }, pill: { col: 6, text: '12 weeks' } },
      { name: 'Enrollment & Billing', bar: { start: 1, end: 5, color: GREEN, label: 'Staffing' }, pill: { col: 6, text: '12 weeks' } },
    ],
  },
  {
    label: 'BPO · Wave 2',
    band: '#15a08a',
    rowBg: '#effbf7',
    desc: [
      'KT Advance team starts self-help KPI maturity (ESM flight risk)',
      'Deliberately scheduled after the most sensitive business event: Open Enrollment',
      'Moves complex, upstream system-driven functions to a relatively lower risk period',
    ],
    rows: [
      {
        name: 'Product Configuration',
        segs: [
          { col: 3, color: KT, label: 'KT Advance Team' },
          { col: 4, color: KT, label: 'KT Advance Team' },
          { col: 5, color: KT, label: 'KT Advance Team' },
        ],
        bar: { start: 6, end: 8, color: GREEN, label: 'Staffing' },
        pill: { col: 8, text: '12 weeks' },
      },
    ],
  },
  {
    label: 'ITO · Wave 1',
    band: '#1f86b8',
    rowBg: '#eef7fc',
    desc: [
      'Establishes foundational IT support capabilities first',
      'Creates stability layer for all subsequent transitions (BPO + ITO)',
    ],
    rows: [
      { name: 'Microsoft 365 Support', bar: { start: 2, end: 4, color: BLUE, label: 'Staffing' }, pill: { col: 4, text: '6 weeks' } },
      { name: 'Service Desk', bar: { start: 2, end: 4, color: BLUE, label: 'Staffing' }, pill: { col: 4, text: '8 weeks' } },
      { name: 'IT Operations Center', bar: { start: 2, end: 5, color: BLUE, label: 'Staffing' }, pill: { col: 5, text: '12 weeks' } },
    ],
  },
  {
    label: 'ITO · Wave 2',
    band: '#1f86b8',
    rowBg: '#eef7fc',
    desc: [
      'Overlaps partially with peak periods but focuses on stabilization of critical backend systems',
      'Ensures core platforms are fully supported before January surge',
    ],
    rows: [
      { name: 'Application Support', bar: { start: 2, end: 5, color: BLUE, label: 'Staffing' }, pill: { col: 6, text: '12 weeks' } },
      { name: 'Database Administration', bar: { start: 3, end: 5, color: BLUE, label: 'Staffing' }, pill: { col: 6, text: '8 weeks' } },
    ],
  },
  {
    label: 'ITO · Wave 3',
    band: '#1f86b8',
    rowBg: '#eef7fc',
    desc: [
      'Scheduled before major business peaks',
      'Focuses on change-heavy capabilities (dev + testing) during low-risk windows',
    ],
    rows: [
      { name: 'Application Development', bar: { start: 3, end: 6, color: BLUE, label: 'Staffing' }, pill: { col: 7, text: '12 weeks' } },
      { name: 'End-to-End Testing', bar: { start: 4, end: 6, color: BLUE, label: 'Staffing' }, pill: { col: 7, text: '6 weeks' } },
    ],
  },
]

// Outer template: [group band][capability name][9 months][description]
const OUTER = '34px 220px repeat(9, minmax(48px, 1fr)) 300px'

function Timeline({ row }: { row: WaveRow }) {
  return (
    <div className="relative grid h-9 items-center" style={{ gridTemplateColumns: 'repeat(9, minmax(48px, 1fr))' }}>
      {/* vertical month gridlines */}
      {MONTHS.map((_, i) => (
        <div key={i} className="h-full border-r border-slate-200" />
      ))}

      {row.line && (
        <div
          className="self-center flex items-center"
          style={{ gridColumn: `${row.line.start} / ${row.line.end + 1}`, gridRow: 1 }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: row.line.color }} />
          <span className="flex-1 h-[2px]" style={{ background: row.line.color }} />
          <span className="w-2 h-2 rounded-full" style={{ background: row.line.color }} />
        </div>
      )}

      {row.bar && (
        <div
          className="h-5 rounded-sm flex items-center px-2 text-white text-[11px] font-semibold self-center"
          style={{ gridColumn: `${row.bar.start} / ${row.bar.end + 1}`, gridRow: 1, background: row.bar.color }}
        >
          {row.bar.label}
        </div>
      )}

      {row.segs?.map((s, i) => (
        <div
          key={i}
          className="h-5 mx-[1px] rounded-sm flex items-center justify-center text-white text-[9px] font-semibold self-center text-center leading-none"
          style={{ gridColumn: `${s.col} / ${s.col + 1}`, gridRow: 1, background: s.color }}
        >
          {s.label}
        </div>
      ))}

      {row.pill && (
        <div
          className="justify-self-center self-center rounded-full bg-white border border-slate-300 text-slate-600 text-[10px] font-semibold px-2 py-0.5 whitespace-nowrap"
          style={{ gridColumn: `${row.pill.col} / ${row.pill.col + 1}`, gridRow: 1 }}
        >
          {row.pill.text}
        </div>
      )}
    </div>
  )
}

export default function WaveModel() {
  return (
    <div className="slide">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
        Wave Based Transition Model – Speed to Value While Minimizing Business Disruption
      </h1>
      <p className="mt-2 text-slate-600 max-w-5xl text-sm sm:text-base">
        This wave-based transition sequences capability cutovers around known business peaks and builds operational
        stability rapidly — reducing disruption risk while shifting services to UST.
      </p>

      {/* ---- Desktop Gantt (lg+) ---- */}
      <div className="mt-6 card overflow-x-auto hidden lg:block">
        <div className="min-w-[980px]">
        {/* Header row */}
        <div className="grid items-center text-[12px] font-semibold text-slate-600 bg-slate-100" style={{ gridTemplateColumns: OUTER }}>
          <div />
          <div className="px-3 py-2">Event / Capability Transition</div>
          {MONTHS.map((m) => (
            <div key={m} className="px-1 py-2 text-center">
              {m}
            </div>
          ))}
          <div className="px-3 py-2">Description / Wave Logic</div>
        </div>

        {/* Groups — single grid per group so band/name/timeline/description share row heights */}
        {GROUPS.map((group) => {
          const n = group.rows.length
          return (
            <div
              key={group.label}
              className="grid border-t border-slate-200"
              style={{ gridTemplateColumns: OUTER, gridTemplateRows: `repeat(${n}, auto)` }}
            >
              {/* vertical band label spanning all rows */}
              <div
                className="flex items-center justify-center text-white text-[11px] font-bold"
                style={{
                  gridColumn: 1,
                  gridRow: `1 / ${n + 1}`,
                  background: group.band,
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  letterSpacing: '.03em',
                }}
              >
                {group.label}
              </div>

              {group.rows.map((row, i) => (
                <div key={row.name + i} style={{ display: 'contents' }}>
                  <div
                    className="px-3 py-1.5 text-[13px] text-slate-700 border-b border-slate-200 flex items-center"
                    style={{ gridColumn: 2, gridRow: i + 1, background: i % 2 ? group.rowBg : '#ffffff' }}
                  >
                    {row.name}
                  </div>
                  <div
                    className="border-b border-slate-200 flex items-center"
                    style={{ gridColumn: '3 / 12', gridRow: i + 1, background: i % 2 ? group.rowBg : '#ffffff' }}
                  >
                    <Timeline row={row} />
                  </div>
                  {/* per-row description (Business Events) */}
                  {!group.desc && (
                    <div
                      className="border-b border-l border-slate-200 px-3 py-1.5 text-[12px] text-slate-600 leading-snug flex items-center"
                      style={{ gridColumn: 12, gridRow: i + 1, background: '#fff' }}
                    >
                      {row.desc}
                    </div>
                  )}
                </div>
              ))}

              {/* group-level description spanning all rows (Waves) */}
              {group.desc && (
                <div
                  className="border-l border-b border-slate-200 px-3 py-2 text-[12px] text-slate-600 flex flex-col justify-center"
                  style={{ gridColumn: 12, gridRow: `1 / ${n + 1}`, background: '#fff' }}
                >
                  <ul className="space-y-1.5">
                    {group.desc.map((d, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-slate-400">▪</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
        </div>
      </div>

      {/* ---- Mobile / tablet stacked cards (< lg) ---- */}
      <div className="mt-6 space-y-5 lg:hidden">
        {GROUPS.map((group) => (
          <div key={group.label} className="card overflow-hidden">
            <div className="px-3 py-2 text-white text-sm font-bold" style={{ background: group.band }}>
              {group.label}
            </div>
            <div className="divide-y divide-slate-100">
              {group.rows.map((row, i) => (
                <div key={row.name + i} className="p-3">
                  <div className="font-semibold text-slate-800 text-sm">{row.name}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {row.line && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: row.line.color }}>
                        {monthSpan(row.line.start, row.line.end)}
                      </span>
                    )}
                    {row.segs && row.segs.length > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: row.segs[0].color }}>
                        KT Advance Team · {monthSpan(row.segs[0].col, row.segs[row.segs.length - 1].col)}
                      </span>
                    )}
                    {row.bar && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full text-white" style={{ background: row.bar.color }}>
                        {row.bar.label} · {monthSpan(row.bar.start, row.bar.end)}
                      </span>
                    )}
                    {row.pill && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-600">
                        {row.pill.text}
                      </span>
                    )}
                  </div>
                  {row.desc && <p className="mt-2 text-[12px] text-slate-600 leading-snug">{row.desc}</p>}
                </div>
              ))}
            </div>
            {group.desc && (
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100">
                <ul className="space-y-1 text-[12px] text-slate-600">
                  {group.desc.map((d, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-slate-400">▪</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
