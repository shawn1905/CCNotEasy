import { useEffect, useMemo, useState } from 'react'
import type { ReferenceCard } from '../game/types'

type Mode = '本议' | '全库'

type Props = {
  open: boolean
  onClose: () => void
  allCards: ReferenceCard[]
  /** 本议（当前节点）史料 id */
  focusIds: string[]
  sceneTitle: string
  initialMode?: Mode
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

export function ArchivePanel({
  open,
  onClose,
  allCards,
  focusIds,
  sceneTitle,
  initialMode = '本议',
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [topic, setTopic] = useState<string>('全部')
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setTopic('全部')
      setQuery('')
    }
  }, [open, initialMode])

  const topics = useMemo(() => {
    const set = new Set<string>()
    for (const c of allCards) {
      if (c.topic) set.add(c.topic)
    }
    return ['全部', ...Array.from(set).sort()]
  }, [allCards])

  const focusSet = useMemo(() => new Set(focusIds), [focusIds])

  const cards = useMemo(() => {
    let list =
      mode === '本议'
        ? allCards.filter((c) => focusSet.has(c.id))
        : allCards

    if (mode === '本议' && list.length === 0) {
      list = allCards
    }

    if (topic !== '全部') {
      list = list.filter((c) => c.topic === topic)
    }

    const q = query.trim()
    if (q) {
      list = list.filter(
        (c) =>
          c.title.includes(q) ||
          c.plain.includes(q) ||
          c.quote.includes(q) ||
          c.source.includes(q) ||
          (c.topic ?? '').includes(q),
      )
    }

    return list
  }, [allCards, focusSet, mode, topic, query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(8, 8, 14, 0.55)' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="glass-modal choices-enter w-full max-w-lg max-h-[85vh] flex flex-col"
        style={{ borderRadius: '4px 4px 0 0' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-title"
      >
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <div className="min-w-0">
            <div
              id="archive-title"
              className="font-mono-ui text-[0.7rem] tracking-wide"
              style={{ color: 'var(--accent)' }}
            >
              史料库
            </div>
            <div className="text-sm truncate" style={{ color: 'var(--fg-bright)' }}>
              {mode === '本议' ? sceneTitle : '全档翻阅'}
            </div>
          </div>
          <button type="button" className="console-btn shrink-0" onClick={onClose}>
            收起
          </button>
        </div>

        <div
          className="px-4 py-2 flex flex-col gap-2 shrink-0"
          style={{ borderBottom: '1px solid var(--glass-border)' }}
        >
          <div className="flex gap-2">
            {(['本议', '全库'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                className="font-mono-ui text-[0.7rem] px-2.5 py-1"
                style={{
                  color: mode === m ? 'var(--bg-darker)' : 'var(--fg)',
                  background: mode === m ? 'var(--accent)' : 'transparent',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius)',
                }}
                onClick={() => setMode(m)}
              >
                {m}
                {m === '本议' ? ` · ${focusIds.length}` : ` · ${allCards.length}`}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索标题 / 白话 / 原文 / 出处"
            className="w-full px-2.5 py-1.5 text-[0.85rem] font-mono-ui"
            style={{
              background: 'rgba(26, 27, 38, 0.7)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius)',
              color: 'var(--fg-bright)',
            }}
          />
          <div className="flex flex-wrap gap-1.5">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                className="font-mono-ui text-[0.65rem] px-2 py-0.5"
                style={{
                  color: topic === t ? 'var(--accent)' : 'var(--fg-dim)',
                  border: `1px solid ${topic === t ? 'var(--accent)' : 'var(--glass-border)'}`,
                  borderRadius: 'var(--radius)',
                  background:
                    topic === t ? 'rgba(122, 162, 247, 0.12)' : 'transparent',
                }}
                onClick={() => setTopic(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto px-4 py-3 flex flex-col gap-3">
          <p className="text-[0.75rem] leading-relaxed" style={{ color: 'var(--fg-dim)' }}>
            先读白话，再看原文。本议筛选眼前 A/B；全库按题翻阅。C
            层为推演边界，勿当成陈寿原句。
          </p>
          {cards.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--fg-dim)' }}>
              无匹配条目。试试全库或清空搜索。
            </p>
          ) : null}
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
                {card.topic ? (
                  <span className="font-mono-ui text-[0.65rem]" style={{ color: 'var(--muted)' }}>
                    {card.topic}
                  </span>
                ) : null}
                <span className="font-mono-ui text-[0.65rem]" style={{ color: 'var(--info)' }}>
                  {LAYER_LABEL[card.layer]}
                </span>
                <span className="font-mono-ui text-[0.65rem]" style={{ color: 'var(--warn)' }}>
                  {LEAN_LABEL[card.leans]}
                </span>
                {focusSet.has(card.id) ? (
                  <span className="font-mono-ui text-[0.65rem]" style={{ color: 'var(--accent)' }}>
                    本议
                  </span>
                ) : null}
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
