import { useState, useEffect } from 'react'
import { ThumbsUp, ThumbsDown, X } from 'lucide-react'

type Vote = 'up' | 'down'

const STORAGE_KEY = 'ustpremera_quickfeedback_v1'

function readEntry(itemId: string): { vote?: Vote; comment?: string } {
  try {
    return (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, { vote: Vote; comment: string }>)[itemId] ?? {}
  } catch {
    return {}
  }
}

function writeEntry(itemId: string, vote: Vote, comment: string) {
  try {
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, unknown>
    store[itemId] = { vote, comment, timestamp: new Date().toISOString() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch { /* storage unavailable */ }
}

function deleteEntry(itemId: string) {
  try {
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, unknown>
    delete store[itemId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch { /* storage unavailable */ }
}

export default function QuickFeedback({ itemId, itemLabel }: { itemId: string; itemLabel: string }) {
  const [vote, setVote] = useState<Vote | undefined>(() => readEntry(itemId).vote)
  const [showComment, setShowComment] = useState(false)
  const [draft, setDraft] = useState('')
  const [popPos, setPopPos] = useState<{ top: number; right: number } | null>(null)

  useEffect(() => {
    if (!showComment) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowComment(false) }
    const onOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-qf-pop]')) setShowComment(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onOutside)
    }
  }, [showComment])

  function handleUp() {
    if (vote === 'up') {
      deleteEntry(itemId)
      setVote(undefined)
    } else {
      writeEntry(itemId, 'up', '')
      setVote('up')
      setShowComment(false)
    }
  }

  function handleDown(e: React.MouseEvent<HTMLButtonElement>) {
    if (vote === 'down') {
      deleteEntry(itemId)
      setVote(undefined)
      setShowComment(false)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    setPopPos({ top: rect.bottom + 6, right: rect.right })
    setDraft(readEntry(itemId).comment ?? '')
    writeEntry(itemId, 'down', readEntry(itemId).comment ?? '')
    setVote('down')
    setShowComment(true)
  }

  function submitComment() {
    writeEntry(itemId, 'down', draft)
    setShowComment(false)
  }

  return (
    <>
      <div className="inline-flex items-center gap-0.5" data-qf-pop>
        <button
          onClick={handleUp}
          title="Good"
          className={`p-1 rounded transition ${
            vote === 'up'
              ? 'text-emerald-600 bg-emerald-50'
              : 'text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'
          }`}
        >
          <ThumbsUp size={12} />
        </button>
        <button
          onClick={handleDown}
          title="Needs attention"
          className={`p-1 rounded transition ${
            vote === 'down'
              ? 'text-red-500 bg-red-50'
              : 'text-slate-300 hover:text-red-400 hover:bg-red-50'
          }`}
        >
          <ThumbsDown size={12} />
        </button>
      </div>

      {showComment && popPos && (
        <div
          data-qf-pop
          className="fixed z-50 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3"
          style={{ top: popPos.top, right: window.innerWidth - popPos.right }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">Quick feedback</span>
            <button onClick={() => setShowComment(false)} className="p-0.5 rounded hover:bg-slate-100 transition">
              <X size={12} className="text-slate-400" />
            </button>
          </div>
          <p className="text-xs text-slate-400 truncate mb-2">{itemLabel}</p>
          <textarea
            className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-[#0067b1] text-slate-700 placeholder:text-slate-300"
            rows={3}
            placeholder="What's the concern?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setShowComment(false)}
              className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 transition"
            >
              Skip
            </button>
            <button
              onClick={submitComment}
              className="px-3 py-1 text-xs font-semibold text-white rounded transition hover:opacity-90"
              style={{ background: '#0067b1' }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  )
}
