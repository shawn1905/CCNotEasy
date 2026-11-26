import type { PrepAction, PrepKind } from '../game/types'

type Props = {
  actions: PrepAction[]
  doneIds: string[]
  allActions: PrepAction[]
  onPrep: (id: string) => void
  onDecide: () => void
  onOpenRefs?: () => void
  hasRefs?: boolean
}

const KIND_LABEL: Record<PrepKind, string> = {
  walk: '走动',
  ask: '问策',
  read: '翻卷',
}

const KIND_ORDER: PrepKind[] = ['walk', 'ask', 'read']

export function PrepDesk({
  actions,
  doneIds,
  allActions,
  onPrep,
  onDecide,
  onOpenRefs,
  hasRefs,
}: Props) {
  const doneSet = new Set(doneIds)
  const byKind = (kind: PrepKind) => allActions.filter((a) => a.kind === kind)

  return (
    <div className="choices-enter choice-dock flex flex-col gap-2.5 px-3 py-3">
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div
          className="font-mono-ui text-[0.65rem] tracking-wider uppercase"
          style={{ color: 'var(--fg-dim)' }}
        >
          desk — 走动 · 问策 · 翻卷
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

      <p className="text-[0.75rem] leading-relaxed px-0.5" style={{ color: 'var(--fg-dim)' }}>
        拍板前你可以先做几件事。不强制做完——但没看过的东西，不会替你说话。
      </p>

      {KIND_ORDER.map((kind) => {
        const list = byKind(kind)
        if (!list.length) return null
        return (
          <div key={kind} className="flex flex-col gap-1.5">
            <div
              className="font-mono-ui text-[0.65rem] tracking-wide px-0.5"
              style={{ color: 'var(--info)' }}
            >
              {KIND_LABEL[kind]}
            </div>
            <div className="flex flex-col gap-1.5">
              {list.map((a) => {
                const done = doneSet.has(a.id)
                const available = actions.some((x) => x.id === a.id)
                return (
                  <button
                    key={a.id}
                    type="button"
                    disabled={done || !available}
                    onClick={() => onPrep(a.id)}
                    className="choice-card w-full text-left px-3 py-2"
                    style={{
                      color: done ? 'var(--fg-dim)' : 'var(--fg-bright)',
                      opacity: done ? 0.55 : 1,
                    }}
                  >
                    <div className="text-[0.9rem] font-medium">
                      {done ? '✓ ' : ''}
                      {a.label}
                    </div>
                    {a.hint ? (
                      <div
                        className="mt-0.5 text-[0.72rem]"
                        style={{ color: 'var(--fg-dim)' }}
                      >
                        {a.hint}
                      </div>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <button
        type="button"
        onClick={onDecide}
        className="w-full text-left px-3 py-2.5 mt-1 font-mono-ui text-[0.9rem]"
        style={{
          background: 'var(--accent)',
          color: 'var(--bg-darker)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 0 18px rgba(122, 162, 247, 0.2)',
        }}
      >
        准备拍板 →
        <span className="block text-[0.7rem] mt-0.5 opacity-80">
          露出 A / B · 已查 {doneIds.length}/{allActions.length}
        </span>
      </button>
    </div>
  )
}
