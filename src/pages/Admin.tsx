import { useRef, useState } from 'react'
import {
  Plus, Trash2, Save, RotateCcw, Download, Upload, Check,
  ChevronDown, ChevronRight, Flag,
  Share2, UserCog, ArrowLeftRight, Truck, Building2, ShieldCheck, ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'
import { usePortalData } from '../context/PortalDataContext'
import { STATUS, LEGEND_ORDER, type StatusKey } from '../data/status'
import {
  uid,
  type PortalData,
  type MilestoneSection,
  type MilestoneRow,
  type IssueRow,
  type RiskAction,
  type ActionStatus,
  type Workstream,
  type WorkstreamIcon,
  type SeverityLevel,
} from '../data/portalData'

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<WorkstreamIcon, LucideIcon> = {
  share2: Share2,
  userCog: UserCog,
  arrowLeftRight: ArrowLeftRight,
  truck: Truck,
  building2: Building2,
  shieldCheck: ShieldCheck,
  clipboardCheck: ClipboardCheck,
}

const ICON_LABELS: Record<WorkstreamIcon, string> = {
  share2: 'Communications',
  userCog: 'HR / People',
  arrowLeftRight: 'Knowledge Transfer',
  truck: 'Delivery / Operations',
  building2: 'Infrastructure',
  shieldCheck: 'Security',
  clipboardCheck: 'Day One / Readiness',
}

const SEVERITY_LEVELS: SeverityLevel[] = ['critical', 'high', 'medium', 'low']

const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  critical: '#b91c1c',
  high: '#c2410c',
  medium: '#854d0e',
  low: '#475569',
}

const ACTION_STATUS_OPTIONS: ActionStatus[] = ['open', 'inProgress', 'closed']
const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  open: 'Open',
  inProgress: 'In Progress',
  closed: 'Closed',
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
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
      className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
    >
      {LEGEND_ORDER.map((k) => (
        <option key={k} value={k}>{STATUS[k].label}</option>
      ))}
    </select>
  )
}

function SeveritySelect({
  label, value, onChange,
}: {
  label: string; value?: SeverityLevel; onChange: (v: SeverityLevel | undefined) => void
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-slate-500 mb-1">{label}</span>
      <select
        value={value ?? ''}
        onChange={(e) => onChange((e.target.value as SeverityLevel) || undefined)}
        className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
      >
        <option value="">— Not Set —</option>
        {SEVERITY_LEVELS.map((k) => (
          <option key={k} value={k}>{SEVERITY_LABELS[k]}</option>
        ))}
      </select>
    </label>
  )
}

function StringListEditor({
  items, onChange, addLabel,
}: {
  items: string[]; onChange: (next: string[]) => void; addLabel: string
}) {
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={it}
            onChange={(e) => { const n = [...items]; n[i] = e.target.value; onChange(n) }}
            className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0067b1] hover:underline"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  title, description, count, onAdd, addLabel,
}: {
  title: string; description?: string; count: number; onAdd: () => void; addLabel: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-700">{title}</h2>
          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold">
            {count}
          </span>
        </div>
        {description && (
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
        style={{ background: 'linear-gradient(150deg,#00a0df,#0067b1)' }}
      >
        <Plus size={14} /> {addLabel}
      </button>
    </div>
  )
}

// ─── Status badge (read-only display) ────────────────────────────────────────

function StatusBadge({ status }: { status: StatusKey }) {
  const s = STATUS[status]
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
      style={{ background: s.color }}
    >
      {s.label}
    </span>
  )
}

// ─── Milestone row editor ─────────────────────────────────────────────────────

function MilestoneRowEditor({
  rows, onChange,
}: {
  rows: MilestoneRow[]; onChange: (next: MilestoneRow[]) => void
}) {
  const setRow = (i: number, fn: (r: MilestoneRow) => MilestoneRow) =>
    onChange(rows.map((r, j) => (j === i ? fn(r) : r)))

  return (
    <div className="space-y-2">
      {rows.length > 0 && (
        <div className="hidden sm:grid grid-cols-[1fr_90px_90px_130px_auto] gap-1.5 px-1">
          {['Milestone', 'Due', 'Revised', 'Status', ''].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>
      )}
      {rows.map((row, i) => (
        <div key={row.id} className="grid grid-cols-1 sm:grid-cols-[1fr_90px_90px_130px_auto] gap-2 items-center">
          <input
            value={row.label}
            placeholder="Milestone name"
            onChange={(e) => setRow(i, r => ({ ...r, label: e.target.value }))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <input
            value={row.due}
            placeholder="Due"
            onChange={(e) => setRow(i, r => ({ ...r, due: e.target.value }))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <input
            value={row.revised}
            placeholder="Revised"
            onChange={(e) => setRow(i, r => ({ ...r, revised: e.target.value }))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <StatusSelect value={row.status} onChange={(v) => setRow(i, r => ({ ...r, status: v }))} />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { id: uid(), label: '', due: '', revised: '', status: 'onTrack' }])}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0067b1] hover:underline"
      >
        <Plus size={13} /> Add row
      </button>
    </div>
  )
}

// ─── Risk action editor ───────────────────────────────────────────────────────

function RiskActionEditor({
  actions, onChange,
}: {
  actions: RiskAction[]; onChange: (next: RiskAction[]) => void
}) {
  const setAction = (i: number, fn: (a: RiskAction) => RiskAction) =>
    onChange(actions.map((a, j) => (j === i ? fn(a) : a)))

  return (
    <div className="space-y-2">
      {actions.length > 0 && (
        <div className="hidden sm:grid grid-cols-[1fr_110px_90px_120px_auto] gap-1.5 px-1">
          {['Action', 'Owner', 'Due Date', 'Status', ''].map((h) => (
            <span key={h} className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>
      )}
      {actions.map((a, i) => (
        <div key={a.id} className="grid grid-cols-1 sm:grid-cols-[1fr_110px_90px_120px_auto] gap-2 items-center">
          <input
            value={a.action}
            placeholder="Action description"
            onChange={(e) => setAction(i, x => ({ ...x, action: e.target.value }))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <input
            value={a.owner}
            placeholder="Owner"
            onChange={(e) => setAction(i, x => ({ ...x, owner: e.target.value }))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <input
            value={a.dueDate}
            placeholder="Due date"
            onChange={(e) => setAction(i, x => ({ ...x, dueDate: e.target.value }))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          />
          <select
            value={a.actionStatus}
            onChange={(e) => setAction(i, x => ({ ...x, actionStatus: e.target.value as ActionStatus }))}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
          >
            {ACTION_STATUS_OPTIONS.map((k) => (
              <option key={k} value={k}>{ACTION_STATUS_LABELS[k]}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onChange(actions.filter((_, j) => j !== i))}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...actions, { id: uid(), action: '', owner: '', dueDate: '', actionStatus: 'open' }])}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0067b1] hover:underline"
      >
        <Plus size={13} /> Add action
      </button>
    </div>
  )
}

// ─── Workstream card ──────────────────────────────────────────────────────────

function WorkstreamCard({
  w, isExpanded, onToggle, onUpdate, onDelete,
}: {
  w: Workstream
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (next: Workstream) => void
  onDelete: () => void
}) {
  const Icon = ICON_MAP[w.icon] ?? Share2
  const set = (fn: (x: Workstream) => Workstream) => onUpdate(fn(w))

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      {/* collapsed header */}
      <div
        className="flex items-center gap-3 px-5 py-3.5 bg-white cursor-pointer hover:bg-slate-50 transition select-none"
        onClick={onToggle}
      >
        <span className="shrink-0 text-slate-400">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <Icon size={17} className="text-slate-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm text-slate-800">
              {w.name || <span className="italic text-slate-400">Unnamed workstream</span>}
            </span>
            <StatusBadge status={w.status} />
            {w.needsPremeraAttention && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                <Flag size={9} /> Premera
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {w.accomplishments.filter(Boolean).length} accomplishments ·{' '}
            {w.activities.filter(Boolean).length} activities
            {w.milestones?.length ? ` · ${w.milestones.length} milestone group${w.milestones.length > 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          title="Remove workstream"
          className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* expanded editor */}
      {isExpanded && (
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-5 space-y-5">

          {/* icon / name / status */}
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr_150px] gap-3">
            <label className="block">
              <span className="block text-xs font-semibold text-slate-500 mb-1">Icon</span>
              <div className="flex items-center gap-2">
                {(() => { const Ic = ICON_MAP[w.icon] ?? Share2; return <Ic size={15} className="text-slate-500 shrink-0" /> })()}
                <select
                  value={w.icon}
                  onChange={(e) => set(x => ({ ...x, icon: e.target.value as WorkstreamIcon }))}
                  className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
                >
                  {(Object.keys(ICON_MAP) as WorkstreamIcon[]).map((k) => (
                    <option key={k} value={k}>{ICON_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </label>
            <Field
              label="Workstream Name"
              value={w.name}
              onChange={(v) => set(x => ({ ...x, name: v }))}
              placeholder="e.g. HR Conversion"
            />
            <label className="block">
              <span className="block text-xs font-semibold text-slate-500 mb-1">Status</span>
              <StatusSelect value={w.status} onChange={(v) => set(x => ({ ...x, status: v }))} />
            </label>
          </div>

          {/* status message */}
          <label className="block">
            <span className="block text-xs font-semibold text-slate-500 mb-1">
              Status Note <span className="font-normal text-slate-400">(shown as tooltip on status dot in grid)</span>
            </span>
            <input
              value={w.statusMessage ?? ''}
              onChange={(e) => set(x => ({ ...x, statusMessage: e.target.value || undefined }))}
              placeholder="Brief narrative about the current status..."
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
            />
          </label>

          {/* premera flag */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!w.needsPremeraAttention}
              onChange={(e) => set(x => ({ ...x, needsPremeraAttention: e.target.checked || undefined }))}
              className="h-4 w-4 rounded border-slate-300 accent-[#0067b1]"
            />
            <span className="text-sm font-medium text-slate-700">Requires Premera Attention</span>
            <span className="text-xs text-slate-400">— flags this workstream with a red badge in Program Level</span>
          </label>

          {/* accomplishments / activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Key Accomplishments</div>
              <StringListEditor
                items={w.accomplishments}
                onChange={(next) => set(x => ({ ...x, accomplishments: next }))}
                addLabel="Add accomplishment"
              />
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Planned Activities</div>
              <StringListEditor
                items={w.activities}
                onChange={(next) => set(x => ({ ...x, activities: next }))}
                addLabel="Add activity"
              />
            </div>
          </div>

          {/* per-workstream milestones */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
              Key Milestones <span className="font-normal text-slate-400 normal-case">(expand-in-grid view)</span>
            </div>
            <WorkstreamMilestonesEditor
              sections={w.milestones ?? []}
              onChange={(next) => set(x => ({ ...x, milestones: next }))}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Workstream milestones (nested inside workstream card) ────────────────────

function WorkstreamMilestonesEditor({
  sections, onChange,
}: {
  sections: MilestoneSection[]; onChange: (next: MilestoneSection[]) => void
}) {
  const [open, setOpen] = useState<Set<string>>(new Set())
  const toggle = (id: string) => setOpen(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  return (
    <div className="space-y-2">
      {sections.map((sec, si) => (
        <div key={sec.id} className="rounded border border-slate-200 overflow-hidden">
          <div
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 cursor-pointer hover:bg-slate-100 transition"
            onClick={() => toggle(sec.id)}
          >
            <span className="text-slate-400">
              {open.has(sec.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
            <input
              value={sec.title}
              onChange={(e) => { e.stopPropagation(); onChange(sections.map((s, i) => i === si ? { ...s, title: e.target.value } : s)) }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Phase / group name"
              className="flex-1 text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-0 min-w-0"
            />
            <span className="text-xs text-slate-400 shrink-0">{sec.rows.length} rows</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(sections.filter((_, i) => i !== si)) }}
              className="p-1 rounded text-slate-400 hover:text-red-500"
            >
              <Trash2 size={13} />
            </button>
          </div>
          {open.has(sec.id) && (
            <div className="px-3 py-3 border-t border-slate-200">
              <MilestoneRowEditor
                rows={sec.rows}
                onChange={(next) => onChange(sections.map((s, i) => i === si ? { ...s, rows: next } : s))}
              />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          const id = uid()
          onChange([...sections, { id, title: 'New Phase', rows: [] }])
          setOpen(p => new Set([...p, id]))
        }}
        className="inline-flex items-center gap-1 text-xs font-semibold text-[#0067b1] hover:underline"
      >
        <Plus size={13} /> Add milestone group
      </button>
    </div>
  )
}

// ─── Issue card ───────────────────────────────────────────────────────────────

function IssueCard({
  issue, isExpanded, onToggle, onUpdate, onDelete,
}: {
  issue: IssueRow
  isExpanded: boolean
  onToggle: () => void
  onUpdate: (next: IssueRow) => void
  onDelete: () => void
}) {
  const set = (fn: (r: IssueRow) => IssueRow) => onUpdate(fn(issue))

  return (
    <div className="border-b border-slate-100 last:border-b-0">
      {/* collapsed header */}
      <div
        className="flex items-start gap-3 px-5 py-3.5 bg-white cursor-pointer hover:bg-slate-50 transition select-none"
        onClick={onToggle}
      >
        <span className="shrink-0 text-slate-400 mt-0.5">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            {issue.needsPremeraAttention && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wide">
                <Flag size={9} /> Premera
              </span>
            )}
            <StatusBadge status={issue.status} />
            {issue.severity && (
              <span className="text-[10px] font-bold uppercase" style={{ color: SEVERITY_COLORS[issue.severity] }}>
                Sev: {SEVERITY_LABELS[issue.severity]}
              </span>
            )}
            {issue.priority && (
              <span className="text-[10px] font-bold uppercase" style={{ color: SEVERITY_COLORS[issue.priority] }}>
                Pri: {SEVERITY_LABELS[issue.priority]}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-800 leading-snug">
            {issue.issue || <span className="italic text-slate-400">No description yet</span>}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {issue.date ? `Due: ${issue.date} · ` : ''}
            {issue.mitigations.filter(Boolean).length} mitigation{issue.mitigations.filter(Boolean).length !== 1 ? 's' : ''}
            {(issue.riskActions?.length ?? 0) > 0 && ` · ${issue.riskActions!.length} action${issue.riskActions!.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          title="Remove issue"
          className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition mt-0.5"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* expanded editor */}
      {isExpanded && (
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-5 space-y-5">

          {/* issue text */}
          <label className="block">
            <span className="block text-xs font-semibold text-slate-500 mb-1">Issue / Risk / Dependency</span>
            <textarea
              value={issue.issue}
              onChange={(e) => set(r => ({ ...r, issue: e.target.value }))}
              placeholder="Describe the risk, issue, or dependency..."
              rows={2}
              className="w-full border border-slate-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40 resize-none"
            />
          </label>

          {/* meta: date / status / severity / priority */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field
              label="Due Date"
              value={issue.date}
              onChange={(v) => set(r => ({ ...r, date: v }))}
              placeholder="e.g. 3/26"
            />
            <label className="block">
              <span className="block text-xs font-semibold text-slate-500 mb-1">Status</span>
              <StatusSelect value={issue.status} onChange={(v) => set(r => ({ ...r, status: v }))} />
            </label>
            <SeveritySelect
              label="Severity"
              value={issue.severity}
              onChange={(v) => set(r => ({ ...r, severity: v }))}
            />
            <SeveritySelect
              label="Priority"
              value={issue.priority}
              onChange={(v) => set(r => ({ ...r, priority: v }))}
            />
          </div>

          {/* premera flag */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!issue.needsPremeraAttention}
              onChange={(e) => set(r => ({ ...r, needsPremeraAttention: e.target.checked || undefined }))}
              className="h-4 w-4 rounded border-slate-300 accent-[#0067b1]"
            />
            <span className="text-sm font-medium text-slate-700">Requires Premera Attention</span>
            <span className="text-xs text-slate-400">— surfaces this issue in the client attention banner</span>
          </label>

          {/* mitigations */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Mitigation Plan / Next Steps</div>
            <StringListEditor
              items={issue.mitigations}
              onChange={(next) => set(r => ({ ...r, mitigations: next }))}
              addLabel="Add step"
            />
          </div>

          {/* risk actions */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Risk Actions &amp; Ownership</div>
            <RiskActionEditor
              actions={issue.riskActions ?? []}
              onChange={(next) => set(r => ({ ...r, riskActions: next }))}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Section wrappers ─────────────────────────────────────────────────────────

function WorkstreamsSection({
  workstreams, onChange,
}: {
  workstreams: Workstream[]; onChange: (next: Workstream[]) => void
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setExpandedIds(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  const handleAdd = () => {
    const id = uid()
    onChange([...workstreams, { id, icon: 'share2', name: '', status: 'onTrack', accomplishments: [''], activities: [''] }])
    setExpandedIds(p => new Set([...p, id]))
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <SectionHeader
          title="Operational Areas (Workstreams)"
          description="Each workstream appears as a row in the Program Level grid. Expand a card to edit its status, accomplishments, activities, milestones, and Premera attention flag."
          count={workstreams.length}
          onAdd={handleAdd}
          addLabel="Add Workstream"
        />
      </div>
      {workstreams.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-10">
          No workstreams yet — click "Add Workstream" above to begin.
        </p>
      ) : (
        workstreams.map((w, i) => (
          <WorkstreamCard
            key={w.id}
            w={w}
            isExpanded={expandedIds.has(w.id)}
            onToggle={() => toggle(w.id)}
            onUpdate={(next) => onChange(workstreams.map((x, j) => (j === i ? next : x)))}
            onDelete={() => onChange(workstreams.filter((_, j) => j !== i))}
          />
        ))
      )}
    </div>
  )
}

function ProgramMilestonesSection({
  sections, onChange,
}: {
  sections: MilestoneSection[]; onChange: (next: MilestoneSection[]) => void
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setExpandedIds(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  const handleAdd = () => {
    const id = uid()
    onChange([...sections, { id, title: 'New Phase', rows: [] }])
    setExpandedIds(p => new Set([...p, id]))
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <SectionHeader
          title="Program-Level Key Milestones"
          description="These appear in the milestone table at the bottom of the Program Level page."
          count={sections.length}
          onAdd={handleAdd}
          addLabel="Add Milestone Group"
        />
      </div>
      {sections.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-10">
          No milestone groups yet — click "Add Milestone Group" above.
        </p>
      ) : (
        sections.map((sec, si) => (
          <div key={sec.id} className="border-b border-slate-100 last:border-b-0">
            <div
              className="flex items-center gap-3 px-5 py-3.5 bg-white cursor-pointer hover:bg-slate-50 transition select-none"
              onClick={() => toggle(sec.id)}
            >
              <span className="shrink-0 text-slate-400">
                {expandedIds.has(sec.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-sm text-slate-800">
                  {sec.title || <span className="italic text-slate-400">Untitled group</span>}
                </span>
                <span className="ml-2 text-xs text-slate-400">
                  {sec.rows.length} row{sec.rows.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(sections.filter((_, j) => j !== si)) }}
                className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50"
              >
                <Trash2 size={15} />
              </button>
            </div>
            {expandedIds.has(sec.id) && (
              <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 space-y-3">
                <input
                  value={sec.title}
                  onChange={(e) => onChange(sections.map((s, j) => j === si ? { ...s, title: e.target.value } : s))}
                  placeholder="Group / phase name"
                  className="w-full font-semibold text-sm border border-slate-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0067b1]/40"
                />
                <MilestoneRowEditor
                  rows={sec.rows}
                  onChange={(next) => onChange(sections.map((s, j) => j === si ? { ...s, rows: next } : s))}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

function IssuesSection({
  issues, onChange,
}: {
  issues: IssueRow[]; onChange: (next: IssueRow[]) => void
}) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setExpandedIds(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  const handleAdd = () => {
    const id = uid()
    onChange([...issues, { id, issue: '', mitigations: [''], date: '', status: 'atRisk', riskActions: [] }])
    setExpandedIds(p => new Set([...p, id]))
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <SectionHeader
          title="Risks &amp; Issues"
          description="These appear in the Risks & Issues page. Set Severity, Priority, and flag items requiring Premera Attention to surface them in the client banner."
          count={issues.length}
          onAdd={handleAdd}
          addLabel="Add Issue"
        />
      </div>
      {issues.length === 0 ? (
        <p className="text-sm text-slate-400 italic text-center py-10">
          No issues recorded — click "Add Issue" above to begin.
        </p>
      ) : (
        issues.map((issue, i) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            isExpanded={expandedIds.has(issue.id)}
            onToggle={() => toggle(issue.id)}
            onUpdate={(next) => onChange(issues.map((x, j) => (j === i ? next : x)))}
            onDelete={() => onChange(issues.filter((_, j) => j !== i))}
          />
        ))
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = 'global' | 'program' | 'risks'

export default function Admin() {
  const { data, save, reset } = usePortalData()
  const [draft, setDraft] = useState<PortalData>(() => structuredClone(data))
  const [tab, setTab] = useState<Tab>('global')
  const [programTab, setProgramTab] = useState<'ito' | 'bpo'>('ito')
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const edit = (fn: (d: PortalData) => void) =>
    setDraft((prev) => { const c = structuredClone(prev); fn(c); return c })

  const commit = () => {
    save(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2400)
  }

  const restoreDefaults = () => {
    if (!window.confirm('Reset all data to defaults? This cannot be undone.')) return
    reset()
    setTimeout(() => setDraft(structuredClone(data)), 0)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'portal-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try { setDraft(JSON.parse(String(reader.result)) as PortalData) }
      catch { alert('Invalid JSON file') }
    }
    reader.readAsText(file)
  }

  const TABS: [Tab, string][] = [
    ['global', 'Global Settings'],
    ['program', 'Program Level'],
    ['risks', 'Risks & Issues'],
  ]

  const ITO_BPO_TABS = (
    <div className="flex gap-1 border-b border-slate-200 mb-4">
      {(['ito', 'bpo'] as const).map((k) => (
        <button
          key={k}
          onClick={() => setProgramTab(k)}
          className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
            programTab === k
              ? 'border-[#0067b1] text-[#0067b1]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {k.toUpperCase()}
        </button>
      ))}
    </div>
  )

  return (
    <div className="slide">

      {/* Page header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Admin · Data Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage all portal content across Program Level and Risks &amp; Issues.
            Save locally — API integration can be wired in later.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={exportJson}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download size={15} /> Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Upload size={15} /> Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
          />
          <button
            onClick={restoreDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw size={15} /> Reset
          </button>
          <button
            onClick={commit}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
            style={{ background: 'linear-gradient(150deg,#00a0df,#0067b1)' }}
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? 'Saved' : 'Save Changes'}
          </button>
        </div>
      </header>

      {/* Main tabs */}
      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === k
                ? 'border-[#0067b1] text-[#0067b1]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6">

        {/* ── Global Settings ── */}
        {tab === 'global' && (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold text-slate-700 mb-4">Report Settings</h2>
            <div className="max-w-xs">
              <Field
                label="As-of Date (shown in slide header pill)"
                value={draft.asOf}
                onChange={(v) => edit((d) => { d.asOf = v })}
                placeholder="e.g. 22/06/2026"
              />
            </div>
          </div>
        )}

        {/* ── Program Level ── */}
        {tab === 'program' && (
          <>
            {ITO_BPO_TABS}

            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
              <h2 className="text-sm font-bold text-slate-700 mb-3">Page Heading</h2>
              <div className="max-w-md">
                <Field
                  label="Level Label (displayed in page title)"
                  value={draft.program[programTab].levelLabel}
                  onChange={(v) => edit((d) => { d.program[programTab].levelLabel = v })}
                  placeholder="e.g. ITO Program Level"
                />
              </div>
            </div>

            <WorkstreamsSection
              workstreams={draft.program[programTab].workstreams}
              onChange={(next) => edit((d) => { d.program[programTab].workstreams = next })}
            />

            <ProgramMilestonesSection
              sections={draft.program[programTab].milestones}
              onChange={(next) => edit((d) => { d.program[programTab].milestones = next })}
            />
          </>
        )}

        {/* ── Risks & Issues ── */}
        {tab === 'risks' && (
          <>
            {ITO_BPO_TABS}

            <IssuesSection
              issues={draft.program[programTab].issues}
              onChange={(next) => edit((d) => { d.program[programTab].issues = next })}
            />
          </>
        )}

      </div>
    </div>
  )
}
