import type { Choice } from '../game/types'

type Props = {
  choices: Choice[]
  onPick: (choice: Choice) => void
}

export function ChoiceBar({ choices, onPick }: Props) {
  return (
    <div className="choices-enter choice-dock flex flex-col gap-2 px-3 py-3">
      <div
        className="font-mono-ui text-[0.65rem] tracking-wider uppercase px-0.5"
        style={{ color: 'var(--fg-dim)' }}
      >
        select —
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
