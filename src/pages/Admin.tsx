import { useRef, useState } from 'react'
import { Plus, Trash2, Save, RotateCcw, Download, Upload, Check } from 'lucide-react'
import { usePortalData } from '../context/PortalDataContext'
import { STATUS, LEGEND_ORDER, type StatusKey } from '../data/status'
import {
  uid,
  type PortalData,
  type MilestoneSection,
  type IssueRow,
  type Workstream,
  type TowerGoLive,
  type WorkstreamIcon,
} from '../data/portalData'

const ICON_OPTIONS: WorkstreamIcon[] = [
  'share2',
  'userCog',
  'arrowLeftRight',
  'truck',
  'building2',
  'shieldCheck',
  'clipboardCheck',
]

/* ---------- small reusable controls ---------- */

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 mb-1">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
      />
    </label>
  )
}

function StatusSelect({ value, onChange }: { value: StatusKey; onChange: (v: StatusKey) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as StatusKey)}
      className="border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
    >
      {LEGEND_ORDER.map((k) => (
        <option key={k} value={k}>
          {STATUS[k].label}
        </option>
      ))}
    </select>
  )
}

function IconButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} title={title} className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800">
      {children}
    </button>
  )
}

function StringListEditor({ items, onChange, addLabel }: { items: string[]; onChange: (next: string[]) => void; addLabel: string }) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={it}
            onChange={(e) => {
              const next = [...items]
              next[i] = e.target.value
              onChange(next)
            }}
            className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <IconButton title="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0067b1] hover:underline"
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  )
}

/* ---------- section editors ---------- */

function MilestoneEditor({ sections, onChange }: { sections: MilestoneSection[]; onChange: (next: MilestoneSection[]) => void }) {
  const setSection = (idx: number, fn: (s: MilestoneSection) => MilestoneSection) =>
    onChange(sections.map((s, i) => (i === idx ? fn(s) : s)))

  return (
    <div className="space-y-5">
      {sections.map((section, si) => (
        <div key={section.id} className="rounded-lg border border-slate-200 p-3">
          <div className="flex items-center gap-2 mb-3">
            <input
              value={section.title}
              onChange={(e) => setSection(si, (s) => ({ ...s, title: e.target.value }))}
              className="flex-1 font-semibold text-sm border-b border-slate-200 pb-1 focus:outline-none focus:border-[#0067b1]"
            />
            <IconButton title="Remove section" onClick={() => onChange(sections.filter((_, i) => i !== si))}>
              <Trash2 size={16} />
            </IconButton>
          </div>

          <div className="space-y-2">
            {section.rows.map((row, ri) => (
              <div key={row.id} className="grid grid-cols-1 sm:grid-cols-[1fr_90px_90px_auto_auto] gap-2 items-center">
                <input
                  value={row.label}
                  placeholder="Milestone"
                  onChange={(e) => setSection(si, (s) => ({ ...s, rows: s.rows.map((r, i) => (i === ri ? { ...r, label: e.target.value } : r)) }))}
                  className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                />
                <input
                  value={row.due}
                  placeholder="Due"
                  onChange={(e) => setSection(si, (s) => ({ ...s, rows: s.rows.map((r, i) => (i === ri ? { ...r, due: e.target.value } : r)) }))}
                  className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                />
                <input
                  value={row.revised}
                  placeholder="Revised"
                  onChange={(e) => setSection(si, (s) => ({ ...s, rows: s.rows.map((r, i) => (i === ri ? { ...r, revised: e.target.value } : r)) }))}
                  className="border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                />
                <StatusSelect value={row.status} onChange={(v) => setSection(si, (s) => ({ ...s, rows: s.rows.map((r, i) => (i === ri ? { ...r, status: v } : r)) }))} />
                <IconButton title="Remove row" onClick={() => setSection(si, (s) => ({ ...s, rows: s.rows.filter((_, i) => i !== ri) }))}>
                  <Trash2 size={16} />
                </IconButton>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSection(si, (s) => ({ ...s, rows: [...s.rows, { id: uid(), label: '', due: '', revised: '', status: 'onTrack' }] }))}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0067b1] hover:underline"
            >
              <Plus size={14} /> Add row
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...sections, { id: uid(), title: 'New Section', rows: [] }])}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#0067b1] hover:underline"
      >
        <Plus size={15} /> Add section
      </button>
    </div>
  )
}

function IssuesEditor({ issues, onChange }: { issues: IssueRow[]; onChange: (next: IssueRow[]) => void }) {
  const setIssue = (idx: number, fn: (r: IssueRow) => IssueRow) => onChange(issues.map((r, i) => (i === idx ? fn(r) : r)))
  return (
    <div className="space-y-3">
      {issues.map((row, i) => (
        <div key={row.id} className="rounded-lg border border-slate-200 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={row.issue}
              placeholder="Issue / Risk / Dependency"
              onChange={(e) => setIssue(i, (r) => ({ ...r, issue: e.target.value }))}
              className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-sm"
            />
            <input
              value={row.date}
              placeholder="Date"
              onChange={(e) => setIssue(i, (r) => ({ ...r, date: e.target.value }))}
              className="w-24 border border-slate-300 rounded-md px-2 py-1.5 text-sm"
            />
            <StatusSelect value={row.status} onChange={(v) => setIssue(i, (r) => ({ ...r, status: v }))} />
            <IconButton title="Remove issue" onClick={() => onChange(issues.filter((_, j) => j !== i))}>
              <Trash2 size={16} />
            </IconButton>
          </div>
          <div className="pl-2">
            <div className="text-xs font-semibold text-slate-500 mb-1">Mitigation Plan / Next Steps</div>
            <StringListEditor items={row.mitigations} onChange={(next) => setIssue(i, (r) => ({ ...r, mitigations: next }))} addLabel="Add step" />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...issues, { id: uid(), issue: '', mitigations: [''], date: '', status: 'atRisk' }])}
        className="inline-flex items-center gap-1 text-sm font-semibold text-[#0067b1] hover:underline"
      >
        <Plus size={15} /> Add issue
      </button>
    </div>
  )
}

function TowersEditor({ towers, onChange }: { towers: TowerGoLive[]; onChange: (next: TowerGoLive[]) => void }) {
  const setT = (idx: number, fn: (t: TowerGoLive) => TowerGoLive) => onChange(towers.map((t, i) => (i === idx ? fn(t) : t)))
  return (
    <div className="space-y-2">
      {towers.map((t, i) => (
        <div key={t.id} className="flex gap-2 items-center">
          <input value={t.name} placeholder="Tower" onChange={(e) => setT(i, (x) => ({ ...x, name: e.target.value }))} className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-sm" />
          <input value={t.goLive} placeholder="Go live" onChange={(e) => setT(i, (x) => ({ ...x, goLive: e.target.value }))} className="w-28 border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
          <StatusSelect value={t.status} onChange={(v) => setT(i, (x) => ({ ...x, status: v }))} />
          <IconButton title="Remove" onClick={() => onChange(towers.filter((_, j) => j !== i))}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...towers, { id: uid(), name: '', goLive: '', status: 'onTrack' }])} className="inline-flex items-center gap-1 text-sm font-semibold text-[#0067b1] hover:underline">
        <Plus size={15} /> Add tower
      </button>
    </div>
  )
}

function WorkstreamsEditor({ items, onChange }: { items: Workstream[]; onChange: (next: Workstream[]) => void }) {
  const setW = (idx: number, fn: (w: Workstream) => Workstream) => onChange(items.map((w, i) => (i === idx ? fn(w) : w)))
  return (
    <div className="space-y-4">
      {items.map((w, i) => (
        <div key={w.id} className="rounded-lg border border-slate-200 p-3 space-y-3">
          <div className="flex gap-2 items-center">
            <select
              value={w.icon}
              onChange={(e) => setW(i, (x) => ({ ...x, icon: e.target.value as WorkstreamIcon }))}
              className="border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white"
            >
              {ICON_OPTIONS.map((ic) => (
                <option key={ic} value={ic}>
                  {ic}
                </option>
              ))}
            </select>
            <input value={w.name} placeholder="Workstream name" onChange={(e) => setW(i, (x) => ({ ...x, name: e.target.value }))} className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-sm" />
            <StatusSelect value={w.status} onChange={(v) => setW(i, (x) => ({ ...x, status: v }))} />
            <IconButton title="Remove workstream" onClick={() => onChange(items.filter((_, j) => j !== i))}>
              <Trash2 size={16} />
            </IconButton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">Key Accomplishments</div>
              <StringListEditor items={w.accomplishments} onChange={(next) => setW(i, (x) => ({ ...x, accomplishments: next }))} addLabel="Add accomplishment" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-1">Planned Activities</div>
              <StringListEditor items={w.activities} onChange={(next) => setW(i, (x) => ({ ...x, activities: next }))} addLabel="Add activity" />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, { id: uid(), icon: 'share2', name: '', status: 'onTrack', accomplishments: [''], activities: [''] }])} className="inline-flex items-center gap-1 text-sm font-semibold text-[#0067b1] hover:underline">
        <Plus size={15} /> Add workstream
      </button>
    </div>
  )
}

/* ---------- page ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-5">
      <h2 className="text-base font-bold text-slate-800 mb-4">{title}</h2>
      {children}
    </section>
  )
}

type Tab = 'global' | 'program' | 'tower'

export default function Admin() {
  const { data, save, reset } = usePortalData()
  const [draft, setDraft] = useState<PortalData>(() => structuredClone(data))
  const [tab, setTab] = useState<Tab>('global')
  const [programTab, setProgramTab] = useState<'ito' | 'bpo'>('ito')
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const edit = (fn: (d: PortalData) => void) =>
    setDraft((prev) => {
      const c = structuredClone(prev)
      fn(c)
      return c
    })

  const commit = () => {
    save(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  const restoreDefaults = () => {
    reset()
    // reset() updates context async; rebuild draft from defaults on next tick
    setTimeout(() => setDraft(structuredClone(data)), 0)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portal-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        setDraft(JSON.parse(String(reader.result)) as PortalData)
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="slide">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Admin · Push Data</h1>
          <p className="text-slate-500 text-sm mt-1">Edit every report field, then Save. Changes persist locally and mirror the API schema in API.md.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportJson} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50">
            <Download size={15} /> Export
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50">
            <Upload size={15} /> Import
          </button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
          <button onClick={restoreDefaults} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50">
            <RotateCcw size={15} /> Reset
          </button>
          <button onClick={commit} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm" style={{ background: 'linear-gradient(150deg,#00a0df,#0067b1)' }}>
            {saved ? <Check size={16} /> : <Save size={16} />} {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </header>

      {/* tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {([['global', 'Global'], ['program', 'Program Level'], ['tower', 'Tower Level']] as [Tab, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${tab === k ? 'border-[#0067b1] text-[#0067b1]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {tab === 'global' && (
          <Card title="Report Meta">
            <div className="max-w-xs">
              <Field label="As-of date (shown in slide header pill)" value={draft.asOf} onChange={(v) => edit((d) => { d.asOf = v })} placeholder="DD/MM/YYYY" />
            </div>
          </Card>
        )}

        {tab === 'program' && (
          <>
            <div className="flex gap-1 mb-2 border-b border-slate-200">
              {(['ito', 'bpo'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setProgramTab(k)}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
                    programTab === k ? 'border-[#0067b1] text-[#0067b1]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
            <Card title="Heading">
              <div className="max-w-md">
                <Field label="Level label" value={draft.program[programTab].levelLabel} onChange={(v) => edit((d) => { d.program[programTab].levelLabel = v })} placeholder="<<Program Level>>" />
              </div>
            </Card>
            <Card title="Workstreams">
              <WorkstreamsEditor items={draft.program[programTab].workstreams} onChange={(next) => edit((d) => { d.program[programTab].workstreams = next })} />
            </Card>
            <Card title="Tower Go-Live">
              <TowersEditor towers={draft.program[programTab].towers} onChange={(next) => edit((d) => { d.program[programTab].towers = next })} />
            </Card>
            <Card title="Key Milestones">
              <MilestoneEditor sections={draft.program[programTab].milestones} onChange={(next) => edit((d) => { d.program[programTab].milestones = next })} />
            </Card>
            <Card title="Issues / Risks / Dependencies">
              <IssuesEditor issues={draft.program[programTab].issues} onChange={(next) => edit((d) => { d.program[programTab].issues = next })} />
            </Card>
          </>
        )}

        {tab === 'tower' && (
          <>
            <Card title="Heading">
              <div className="max-w-md">
                <Field label="Level label" value={draft.tower.levelLabel} onChange={(v) => edit((d) => { d.tower.levelLabel = v })} placeholder="<<Tower Level>>" />
              </div>
            </Card>
            <Card title="Key Accomplishments">
              <StringListEditor items={draft.tower.accomplishments} onChange={(next) => edit((d) => { d.tower.accomplishments = next })} addLabel="Add accomplishment" />
            </Card>
            <Card title="Planned Activities">
              <StringListEditor items={draft.tower.activities} onChange={(next) => edit((d) => { d.tower.activities = next })} addLabel="Add activity" />
            </Card>
            <Card title="Key Milestones">
              <MilestoneEditor sections={draft.tower.milestones} onChange={(next) => edit((d) => { d.tower.milestones = next })} />
            </Card>
            <Card title="Key Activities">
              <MilestoneEditor sections={draft.tower.keyActivities} onChange={(next) => edit((d) => { d.tower.keyActivities = next })} />
            </Card>
            <Card title="Issues / Risks / Dependencies">
              <IssuesEditor issues={draft.tower.issues} onChange={(next) => edit((d) => { d.tower.issues = next })} />
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
