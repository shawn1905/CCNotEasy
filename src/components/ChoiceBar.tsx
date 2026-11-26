import type { Choice } from '../game/types'

type Props = {
  choices: Choice[]
  onPick: (choice: Choice) => void
}

export function ChoiceBar({ choices, onPick }: Props) {
  return (
    <div className="choices-enter flex flex-col gap-2 border-t px-3 py-3"
      style={{ borderColor: 'var(--muted)', background: 'var(--bg-dark)' }}
    >
      {choices.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onPick(c)}
          className="w-full text-left px-3 py-2.5 transition-colors"
          style={{
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--muted)',
            color: 'var(--fg-bright)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)'
            e.currentTarget.style.background = 'var(--selection)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--muted)'
            e.currentTarget.style.background = 'var(--bg-light)'
          }}
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
