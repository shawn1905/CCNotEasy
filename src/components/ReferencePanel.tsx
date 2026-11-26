import type { ReferenceCard } from '../game/types'

type Props = {
  open: boolean
  title: string
  cards: ReferenceCard[]
  onClose: () => void
}

const LEAN_LABEL = {
  A: '偏支撑 A',
  B: '偏支撑 B',
  both: '两边都要看',
} as const

const LAYER_LABEL = {
  A: '正史本文',
  B: '注 / 通鉴',
  C: '推演边界',
} as const

export function ReferencePanel({ open, title, cards, onClose }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(8, 8, 14, 0.55)' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-modal choices-enter w-full max-w-lg max-h-[78vh] flex flex-col"
        style={{ borderRadius: '4px 4px 0 0' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ref-panel-title"
      >
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <div className="min-w-0">
            <div
              id="ref-panel-title"
              className="font-mono-ui text-[0.7rem] tracking-wide"
              style={{ color: 'var(--accent)' }}
            >
              本议史料
            </div>
            <div className="text-sm truncate" style={{ color: 'var(--fg-bright)' }}>
              {title}
            </div>
          </div>
          <button type="button" className="console-btn shrink-0" onClick={onClose}>
            收起
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-3 flex flex-col gap-3">
          <p className="text-[0.75rem] leading-relaxed" style={{ color: 'var(--fg-dim)' }}>
            先读白话，再看原文。这些材料用来撑住眼前的 A/B，不代替你拍板。
          </p>
          {cards.map((card) => (
            <article
              key={card.id}
              className="px-3 py-3"
              style={{
                background: 'rgba(26, 27, 38, 0.55)',
                border: '1px solid rgba(65, 72, 104, 0.7)',
                borderRadius: 'var(--radius)',
              }}
            >
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-2">
                <h3 className="text-[0.95rem] font-medium" style={{ color: 'var(--fg-bright)' }}>
                  {card.title}
                </h3>
                <span className="font-mono-ui text-[0.65rem]" style={{ color: 'var(--info)' }}>
                  {LAYER_LABEL[card.layer]}
                </span>
                <span className="font-mono-ui text-[0.65rem]" style={{ color: 'var(--warn)' }}>
                  {LEAN_LABEL[card.leans]}
                </span>
              </div>
              <p className="text-[0.9rem] leading-relaxed mb-2" style={{ color: 'var(--fg)' }}>
                {card.plain}
              </p>
              <blockquote
                className="text-[0.8rem] leading-relaxed font-mono-ui pl-2 mb-2"
                style={{
                  color: 'var(--fg-dim)',
                  borderLeft: '2px solid var(--muted)',
                }}
              >
                {card.quote}
              </blockquote>
              <p className="font-mono-ui text-[0.7rem]" style={{ color: 'var(--fg-dim)' }}>
                src · {card.source}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
