import type { Speaker } from '../game/types'
import { GlossText } from './GlossText'

const SPEAKER_META: Record<
  Speaker,
  { name: string; side: 'left' | 'right' | 'center'; color: string }
> = {
  system: { name: '系统', side: 'center', color: 'var(--fg-dim)' },
  cao: { name: '曹操', side: 'right', color: 'var(--accent)' },
  cheng: { name: '程昱', side: 'left', color: 'var(--ok)' },
  jia: { name: '贾诩', side: 'left', color: 'var(--special)' },
  xun: { name: '荀彧', side: 'left', color: 'var(--info)' },
  soldier: { name: '军士', side: 'left', color: 'var(--warn)' },
}

type Props = {
  speaker: Speaker
  text: string
  onGloss: (id: string) => void
  fresh?: boolean
}

export function Bubble({ speaker, text, onGloss, fresh }: Props) {
  const meta = SPEAKER_META[speaker]
  if (meta.side === 'center') {
    return (
      <div
        className={`flex justify-center px-3 ${fresh ? 'bubble-enter' : ''}`}
      >
        <p
          className="max-w-[22rem] text-center text-[0.8rem] leading-relaxed font-mono-ui"
          style={{ color: meta.color }}
        >
          <GlossText text={text} onGloss={onGloss} />
        </p>
      </div>
    )
  }

  const isRight = meta.side === 'right'
  return (
    <div
      className={`flex px-3 ${isRight ? 'justify-end' : 'justify-start'} ${fresh ? 'bubble-enter' : ''}`}
    >
      <div className={`max-w-[85%] ${isRight ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <span
          className="text-[0.65rem] font-mono-ui tracking-wide uppercase"
          style={{ color: meta.color }}
        >
          {meta.name}
        </span>
        <div
          className="px-3 py-2 text-[0.95rem] leading-relaxed"
          style={{
            background: 'var(--bg-light)',
            borderRadius: 'var(--radius)',
            borderLeft: isRight ? undefined : `2px solid ${meta.color}`,
            borderRight: isRight ? `2px solid ${meta.color}` : undefined,
            color: 'var(--fg-bright)',
          }}
        >
          <GlossText text={text} onGloss={onGloss} />
        </div>
      </div>
    </div>
  )
}
