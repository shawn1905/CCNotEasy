import { useEffect, useRef, useState } from 'react'
import { Bubble } from './components/Bubble'
import { ChoiceBar } from './components/ChoiceBar'
import { GlossModal } from './components/GlossModal'
import {
  advanceAfterChoice,
  advanceLineOrNode,
  canShowChoices,
  clearSave,
  createInitialState,
  currentLines,
  getNode,
  loadSave,
  persistSave,
  redCliffsEve,
  type SaveState,
} from './game/engine'
import type { Choice, GlossEntry } from './game/types'

const chapter = redCliffsEve

export default function App() {
  const [state, setState] = useState<SaveState>(() => loadSave() ?? createInitialState())
  const [gloss, setGloss] = useState<GlossEntry | null>(null)
  const [started, setStarted] = useState(() => Boolean(loadSave()))
  const scroller = useRef<HTMLDivElement>(null)
  const [freshIndex, setFreshIndex] = useState<number | null>(null)

  const node = getNode(chapter, state.nodeId)
  const lines = currentLines(chapter, state)
  const revealed = lines.slice(0, state.lineIndex + 1)
  const showChoices = canShowChoices(chapter, state)
  const showTapHint =
    !showChoices && !state.ended && revealed.length > 0

  useEffect(() => {
    persistSave(state)
  }, [state])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [state.nodeId, state.lineIndex, showChoices])

  function openGloss(id: string) {
    const entry = chapter.gloss[id]
    if (!entry) return
    setGloss(entry)
    setState((s) => ({
      ...s,
      seenGloss: s.seenGloss.includes(id) ? s.seenGloss : [...s.seenGloss, id],
    }))
  }

  function onTapAdvance() {
    if (showChoices || state.ended) return
    setFreshIndex(state.lineIndex + 1)
    setState((s) => advanceLineOrNode(chapter, s))
  }

  function onPick(choice: Choice) {
    setFreshIndex(0)
    setState((s) => advanceAfterChoice(chapter, s, choice))
  }

  function restart() {
    clearSave()
    setFreshIndex(null)
    setState(createInitialState())
    setStarted(true)
  }

  if (!started) {
    return (
      <div
        className="min-h-full flex flex-col items-center justify-center px-6"
        data-theme="tokyo-night"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, #24283b 0%, transparent 55%),
            linear-gradient(180deg, var(--bg-darker) 0%, var(--bg) 40%, #1f2335 100%)
          `,
        }}
      >
        <p
          className="font-mono-ui text-[0.7rem] tracking-[0.25em] uppercase mb-4"
          style={{ color: 'var(--fg-dim)' }}
        >
          CCNotEasy
        </p>
        <h1
          className="text-4xl sm:text-5xl font-semibold tracking-tight text-center mb-3"
          style={{ color: 'var(--fg-bright)' }}
        >
          曹操不容易
        </h1>
        <p
          className="text-center max-w-sm text-[0.95rem] leading-relaxed mb-8"
          style={{ color: 'var(--fg)' }}
        >
          {chapter.title} · 双害选择题。点气泡推进，点蓝词看注释。
        </p>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="px-6 py-3 text-[0.95rem] font-medium"
          style={{
            background: 'var(--accent)',
            color: 'var(--bg-darker)',
            borderRadius: 'var(--radius)',
          }}
        >
          进入今夜
        </button>
        {loadSave() ? (
          <button
            type="button"
            onClick={restart}
            className="mt-3 text-sm"
            style={{ color: 'var(--fg-dim)' }}
          >
            清除存档重开
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className="h-full flex flex-col max-w-lg mx-auto"
      data-theme="tokyo-night"
      style={{
        background: `
          radial-gradient(ellipse 120% 40% at 50% 0%, #1f2335 0%, transparent 50%),
          var(--bg)
        `,
      }}
    >
      <header
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--muted)' }}
      >
        <div>
          <div className="font-mono-ui text-[0.65rem] tracking-wider" style={{ color: 'var(--fg-dim)' }}>
            曹操不容易
          </div>
          <div className="text-sm" style={{ color: 'var(--fg-bright)' }}>
            {node.title ?? chapter.title}
          </div>
        </div>
        <button
          type="button"
          onClick={restart}
          className="text-[0.75rem] px-2 py-1"
          style={{ color: 'var(--fg-dim)' }}
        >
          重开
        </button>
      </header>

      <div
        ref={scroller}
        className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 cursor-pointer"
        onClick={onTapAdvance}
        role="presentation"
      >
        {revealed.map((line, i) => (
          <Bubble
            key={`${state.nodeId}-${i}-${line.text.slice(0, 12)}`}
            speaker={line.speaker}
            text={line.text}
            onGloss={openGloss}
            fresh={freshIndex === i}
          />
        ))}
        {showTapHint ? (
          <p
            className="text-center text-[0.7rem] font-mono-ui pt-2 pb-4"
            style={{ color: 'var(--fg-dim)' }}
          >
            轻触继续
          </p>
        ) : null}
        {state.ended ? (
          <div className="px-4 pt-2 pb-6 flex flex-col gap-2">
            <p className="text-center text-sm" style={{ color: 'var(--fire)' }}>
              本章结束 · Demo
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                restart()
              }}
              className="mx-auto px-4 py-2 text-sm"
              style={{
                background: 'var(--bg-light)',
                border: '1px solid var(--muted)',
                borderRadius: 'var(--radius)',
                color: 'var(--fg-bright)',
              }}
            >
              再玩一局
            </button>
          </div>
        ) : null}
      </div>

      {showChoices && node.choices ? (
        <ChoiceBar choices={node.choices} onPick={onPick} />
      ) : null}

      <GlossModal entry={gloss} onClose={() => setGloss(null)} />
    </div>
  )
}
