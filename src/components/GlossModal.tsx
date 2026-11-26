import type { GlossEntry } from '../game/types'

type Props = {
  entry: GlossEntry | null
  onClose: () => void
}

export function GlossModal({ entry, onClose }: Props) {
  if (!entry) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(14, 14, 20, 0.72)' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md px-4 py-4 choices-enter"
        style={{
          background: 'var(--bg-light)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--muted)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gloss-title"
      >
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h2
            id="gloss-title"
            className="text-lg font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            {entry.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-2 py-1"
            style={{ color: 'var(--fg-dim)' }}
          >
            关闭
          </button>
        </div>
        <p className="text-[0.95rem] leading-relaxed" style={{ color: 'var(--fg-bright)' }}>
          {entry.body}
        </p>
        {entry.source ? (
          <p className="mt-3 text-[0.75rem] font-mono-ui" style={{ color: 'var(--fg-dim)' }}>
            {entry.source}
          </p>
        ) : null}
      </div>
    </div>
  )
}
