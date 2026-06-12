interface Props {
  title: string
  sampleLines: string[]
  asOf?: string
}

export default function SlideHeader({ title, sampleLines, asOf = 'DD/MM/YYYY' }: Props) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      <div className="flex items-start gap-4 md:gap-6 md:shrink-0">
        <div className="md:text-right">
          {sampleLines.map((l, i) => (
            <div key={i} className="font-bold text-slate-800 leading-snug text-sm sm:text-base">
              {l}
            </div>
          ))}
        </div>
        <div className="rounded-full bg-slate-100 px-4 sm:px-6 py-2 sm:py-3 text-right leading-tight shrink-0">
          <div className="text-[10px] tracking-widest text-slate-500 font-semibold">AS OF:</div>
          <div className="text-sm font-semibold text-slate-700">{asOf}</div>
        </div>
      </div>
    </header>
  )
}
