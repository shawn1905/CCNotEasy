import { useEffect } from 'react'
import type { GlossEntry } from '../game/types'

type Props = {
  entry: GlossEntry | null
  onClose: () => void
}

export function GlossModal({ entry, onClose }: Props) {
  useEffect(() => {
    if (!entry) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entry, onClose])

  if (!entry) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(8, 8, 14, 0.55)' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-modal w-full max-w-md px-4 py-4 choices-enter"
        style={{ borderRadius: '4px' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gloss-title"
      >
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2
            id="gloss-title"
            className="text-lg font-semibold font-mono-ui"
            style={{ color: 'var(--accent)' }}
          >
            {entry.title}
          </h2>
          <button type="button" onClick={onClose} className="console-btn">
            esc
          </button>
        </div>
        <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--fg-bright)' }}>
          {entry.body}
        </p>
        {entry.source ? (
          <p className="mt-3 text-[0.75rem] font-mono-ui" style={{ color: 'var(--fg-dim)' }}>
            src · {entry.source}
          </p>
        ) : null}
      </div>
    </div>
  )
}
