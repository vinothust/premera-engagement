import { useState } from 'react'
import {
  Share2,
  UserCog,
  ArrowLeftRight,
  Truck,
  Building2,
  ShieldCheck,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'
import SlideHeader from '../components/SlideHeader'
import MilestoneTable from '../components/MilestoneTable'
import IssuesTable from '../components/IssuesTable'
import Legend from '../components/Legend'
import StatusDot from '../components/StatusDot'
import RiskSummaryBanner from '../components/RiskSummaryBanner'
import QuickFeedback from '../components/QuickFeedback'
import { usePortalData } from '../context/PortalDataContext'
import type { WorkstreamIcon, Workstream } from '../data/portalData'

const ICONS: Record<WorkstreamIcon, LucideIcon> = {
  share2: Share2,
  userCog: UserCog,
  arrowLeftRight: ArrowLeftRight,
  truck: Truck,
  building2: Building2,
  shieldCheck: ShieldCheck,
  clipboardCheck: ClipboardCheck,
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-sm text-slate-700">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-slate-400">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

function WorkstreamName({ w }: { w: Workstream }) {
  const Icon = ICONS[w.icon] ?? Share2
  return (
    <div className="flex items-center gap-2">
      <Icon size={20} className="text-slate-500 shrink-0" />
      <span className="font-semibold" style={{ color: '#0067b1' }}>
        {w.name}
      </span>
    </div>
  )
}

export default function ProgramLevel() {
  const { data } = usePortalData()
  const [tab, setTab] = useState<'ito' | 'bpo'>('ito')
  const p = data.program[tab]

  return (
    <div className="slide">
      <SlideHeader title={`${p.levelLabel} Highlights`} sampleLines={['Program Level Status Reporting Sample']} asOf={data.asOf} />

      <RiskSummaryBanner issues={p.issues} />

      <div className="flex gap-1 mb-6 border-b border-slate-200">
        {(['ito', 'bpo'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-5 py-2 text-sm font-semibold border-b-2 -mb-px transition ${
              tab === k ? 'border-[#0067b1] text-[#0067b1]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Workstreams — table on desktop, cards on mobile */}
          <div className="card overflow-hidden">
            <table className="hidden md:table w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: '#dfe3e6' }} className="text-slate-700">
                  <th className="text-left font-semibold px-3 py-2 w-[34%]">&nbsp;</th>
                  <th className="text-center font-semibold px-3 py-2 w-14">Status</th>
                  <th className="text-center font-semibold px-3 py-2 w-20">Feedback</th>
                  <th className="text-center font-semibold px-3 py-2">Key Accomplishments</th>
                  <th className="text-center font-semibold px-3 py-2">Planned Activities</th>
                </tr>
              </thead>
              <tbody>
                {p.workstreams.map((w) => (
                  <tr key={w.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-3">
                      <WorkstreamName w={w} />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <StatusDot status={w.status} />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <QuickFeedback itemId={w.id} itemLabel={w.name} />
                    </td>
                    <td className="px-3 py-3">
                      <Bullets items={w.accomplishments} />
                    </td>
                    <td className="px-3 py-3">
                      <Bullets items={w.activities} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="md:hidden divide-y divide-slate-100">
              {p.workstreams.map((w) => (
                <div key={w.id} className="p-3">
                  <div className="flex items-center justify-between gap-3">
                    <WorkstreamName w={w} />
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusDot status={w.status} />
                      <QuickFeedback itemId={w.id} itemLabel={w.name} />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-1">Key Accomplishments</div>
                      <Bullets items={w.accomplishments} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-1">Planned Activities</div>
                      <Bullets items={w.activities} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <IssuesTable rows={p.issues} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ background: '#1f9bb0' }} className="text-white">
                  <th className="text-left font-semibold px-3 py-2">Tower</th>
                  <th className="text-left font-semibold px-3 py-2 w-24">Go live</th>
                  <th className="text-center font-semibold px-3 py-2 w-16">Status</th>
                  <th className="text-center font-semibold px-3 py-2 w-20">Feedback</th>
                </tr>
              </thead>
              <tbody>
                {p.towers.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-semibold" style={{ color: '#0067b1' }}>
                      {t.name}
                    </td>
                    <td className="px-3 py-2 text-slate-600">{t.goLive}</td>
                    <td className="px-3 py-2 text-center">
                      <StatusDot status={t.status} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <QuickFeedback itemId={t.id} itemLabel={t.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card overflow-hidden">
            <MilestoneTable headLabel="Key Milestones" statusLabel="Status" sections={p.milestones} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center md:justify-end">
        <Legend />
      </div>
    </div>
  )
}
