import { KeyRound, CalendarDays } from 'lucide-react'
import SlideHeader from '../components/SlideHeader'
import ChevronBanner from '../components/ChevronBanner'
import MilestoneTable from '../components/MilestoneTable'
import IssuesTable from '../components/IssuesTable'
import Legend from '../components/Legend'
import { usePortalData } from '../context/PortalDataContext'

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-slate-700">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-slate-400">•</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TowerLevel() {
  const { data } = usePortalData()
  const t = data.tower

  return (
    <div className="slide">
      <SlideHeader
        title={`${t.levelLabel} Highlights`}
        sampleLines={['Status Reporting Sample', 'One report for ITO and one for BPO']}
        asOf={data.asOf}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div>
              <ChevronBanner icon={<KeyRound size={24} />} label="Key accomplishments" />
              <div className="mt-4 pl-2">
                <BulletList items={t.accomplishments} />
              </div>
            </div>
            <div>
              <ChevronBanner icon={<CalendarDays size={24} />} label="Planned activities" />
              <div className="mt-4 pl-2">
                <BulletList items={t.activities} />
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <IssuesTable rows={t.issues} />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <MilestoneTable headLabel="Key Milestones" statusLabel="Rag" sections={t.milestones} />
          </div>
          <div className="card overflow-hidden">
            <MilestoneTable headLabel="Key Activities" statusLabel="Rag" sections={t.keyActivities} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center md:justify-end">
        <Legend />
      </div>
    </div>
  )
}
