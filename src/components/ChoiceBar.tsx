import type { Choice } from '../game/types'

type Props = {
  choices: Choice[]
  onPick: (choice: Choice) => void
  /** 有史料卡时显示入口 */
  hasRefs?: boolean
  onOpenRefs?: () => void
}

export function ChoiceBar({ choices, onPick, hasRefs, onOpenRefs }: Props) {
  return (
    <div className="choices-enter choice-dock flex flex-col gap-2 px-3 py-3">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div
          className="font-mono-ui text-[0.65rem] tracking-wider uppercase"
          style={{ color: 'var(--fg-dim)' }}
        >
          select —
        </div>
        {hasRefs && onOpenRefs ? (
          <button
            type="button"
            className="font-mono-ui text-[0.7rem] px-2 py-1"
            style={{
              color: 'var(--accent)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              background: 'rgba(122, 162, 247, 0.08)',
            }}
            onClick={(e) => {
              e.stopPropagation()
              onOpenRefs()
            }}
          >
            本议史料
          </button>
        ) : null}
      </div>
      {choices.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onPick(c)}
          className="choice-card w-full text-left px-3 py-2.5"
          style={{ color: 'var(--fg-bright)' }}
        >
          <div className="text-[0.95rem] font-medium">{c.label}</div>
          {c.hint ? (
            <div className="mt-0.5 text-[0.75rem]" style={{ color: 'var(--fg-dim)' }}>
              {c.hint}
            </div>
          ) : null}
        </button>
      ))}
    </div>
  )
}
