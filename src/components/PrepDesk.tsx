import { useMemo, useState } from 'react'
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
  const availableIds = useMemo(
    () => new Set(actions.map((a) => a.id)),
    [actions],
  )

  const kindsPresent = KIND_ORDER.filter((k) =>
    allActions.some((a) => a.kind === k),
  )
  const [tab, setTab] = useState<PrepKind>(kindsPresent[0] ?? 'walk')
  const list = allActions.filter((a) => a.kind === tab)

  return (
    <div
      className="choices-enter choice-dock flex flex-col gap-2 px-3 pt-2 pb-3"
      style={{ maxHeight: '42vh' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-2 px-0.5 shrink-0">
        <div
          className="font-mono-ui text-[0.65rem] tracking-wider uppercase"
          style={{ color: 'var(--fg-dim)' }}
        >
          desk — 拍板前
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono-ui text-[0.65rem]" style={{ color: 'var(--fg-dim)' }}>
            {doneIds.length}/{allActions.length}
          </span>
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
              onClick={onOpenRefs}
            >
              本议
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex gap-1.5 shrink-0">
        {kindsPresent.map((k) => {
          const total = allActions.filter((a) => a.kind === k).length
          const done = allActions.filter(
            (a) => a.kind === k && doneSet.has(a.id),
          ).length
          const active = tab === k
          return (
            <button
              key={k}
              type="button"
              className="font-mono-ui text-[0.7rem] px-2.5 py-1"
              style={{
                color: active ? 'var(--bg-darker)' : 'var(--fg)',
                background: active ? 'var(--accent)' : 'transparent',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius)',
              }}
              onClick={() => setTab(k)}
            >
              {KIND_LABEL[k]} · {done}/{total}
            </button>
          )
        })}
      </div>

      <div className="overflow-y-auto flex flex-col gap-1.5 min-h-0 flex-1">
        {list.map((a) => {
          const done = doneSet.has(a.id)
          const available = availableIds.has(a.id)
          return (
            <button
              key={a.id}
              type="button"
              disabled={done || !available}
              onClick={() => onPrep(a.id)}
              className="choice-card w-full text-left px-2.5 py-1.5"
              style={{
                color: done ? 'var(--muted)' : 'var(--fg-bright)',
                opacity: done ? 0.7 : 1,
              }}
            >
              <div className="text-[0.85rem] font-medium leading-snug">
                {done ? '〔已查〕' : ''}
                {a.label}
              </div>
              {a.hint && !done ? (
                <div
                  className="mt-0.5 text-[0.68rem] leading-snug"
                  style={{ color: 'var(--fg-dim)' }}
                >
                  {a.hint}
                </div>
              ) : null}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onDecide}
        className="w-full text-left px-3 py-2 shrink-0 font-mono-ui text-[0.85rem]"
        style={{
          background: 'var(--accent)',
          color: 'var(--bg-darker)',
          borderRadius: 'var(--radius)',
          boxShadow: '0 0 18px rgba(122, 162, 247, 0.2)',
        }}
      >
        准备拍板 → 露出 A / B
      </button>
    </div>
  )
}
