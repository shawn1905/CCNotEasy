import { useEffect, useMemo, useRef, useState } from 'react'
import { ArchivePanel } from './components/ArchivePanel'
import { Bubble } from './components/Bubble'
import { ChoiceBar } from './components/ChoiceBar'
import { DesktopShell } from './components/DesktopShell'
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
import type { Choice, GlossEntry, ReferenceCard } from './game/types'

const chapter = redCliffsEve

export default function App() {
  const [state, setState] = useState<SaveState>(() => loadSave() ?? createInitialState())
  const [gloss, setGloss] = useState<GlossEntry | null>(null)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archiveModeHint, setArchiveModeHint] = useState<'本议' | '全库'>('本议')
  /** 刷新始终先回 boot；有存档用「继续」进入 */
  const [started, setStarted] = useState(false)
  const hasSave = Boolean(loadSave())
  const scroller = useRef<HTMLDivElement>(null)
  const [freshIndex, setFreshIndex] = useState<number | null>(null)

  const node = getNode(chapter, state.nodeId)
  const lines = currentLines(chapter, state)
  const revealed = lines.slice(0, state.lineIndex + 1)
  const showChoices = canShowChoices(chapter, state)
  const showTapHint = !showChoices && !state.ended && revealed.length > 0
  const focusIds = node.refs ?? []
  const allCards: ReferenceCard[] = useMemo(
    () => Object.values(chapter.refs),
    [],
  )

  useEffect(() => {
    if (!started) return
    persistSave(state)
  }, [state, started])

  useEffect(() => {
    setArchiveOpen(false)
  }, [state.nodeId])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [state.nodeId, state.lineIndex, showChoices])

  function openGloss(id: string) {
    const entry = chapter.gloss[id] ?? {
      id,
      title: id,
      body: '词条尚未收录。请打开「史料库」查看本段相关原文。',
    }
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

  function goBoot() {
    setArchiveOpen(false)
    setFreshIndex(null)
    setStarted(false)
  }

  function newGame() {
    clearSave()
    setFreshIndex(null)
    setState(createInitialState())
    setStarted(true)
  }

  function continueGame() {
    setState(loadSave() ?? createInitialState())
    setStarted(true)
  }

  function openArchive(mode: '本议' | '全库') {
    setArchiveModeHint(mode)
    setArchiveOpen(true)
  }

  if (!started) {
    return (
      <DesktopShell title="ccnoteasy://boot" subtitle="omarchy · tokyo-night" compact>
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <p
            className="font-mono-ui text-[0.65rem] tracking-[0.28em] uppercase mb-5"
            style={{ color: 'var(--fg-dim)' }}
          >
            SESSION · RED-CLIFFS-EVE
          </p>
          <h1
            className="text-4xl sm:text-[2.75rem] font-semibold tracking-tight mb-3"
            style={{ color: 'var(--fg-bright)' }}
          >
            曹操不容易
          </h1>
          <p className="max-w-sm text-[0.95rem] leading-relaxed mb-8" style={{ color: 'var(--fg)' }}>
            {chapter.title} · 史料库加厚版。点蓝词看词条；随时翻「史料库」；抉择时看「本议」。
          </p>
          {hasSave ? (
            <>
              <button
                type="button"
                onClick={continueGame}
                className="px-6 py-3 text-[0.95rem] font-medium font-mono-ui"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg-darker)',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 0 24px rgba(122, 162, 247, 0.25)',
                }}
              >
                ./continue
              </button>
              <button type="button" onClick={newGame} className="console-btn mt-4">
                ./new_game
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={newGame}
              className="px-6 py-3 text-[0.95rem] font-medium font-mono-ui"
              style={{
                background: 'var(--accent)',
                color: 'var(--bg-darker)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 0 24px rgba(122, 162, 247, 0.25)',
              }}
            >
              ./enter_tonight
            </button>
          )}
        </div>
      </DesktopShell>
    )
  }

  return (
    <DesktopShell
      title="ccnoteasy://dialogue"
      subtitle={node.title ?? chapter.title}
      trailing={
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="console-btn"
            onClick={() => openArchive('全库')}
          >
            史料库
          </button>
          <button type="button" className="console-btn" onClick={goBoot}>
            boot
          </button>
        </div>
      }
    >
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
            tap to continue _
          </p>
        ) : null}
        {state.ended ? (
          <div className="px-4 pt-2 pb-6 flex flex-col gap-2 items-center">
            <p className="text-center text-sm font-mono-ui" style={{ color: 'var(--fire)' }}>
              EOF · chapter demo
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                openArchive('全库')
              }}
              className="console-btn"
            >
              ./archive
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                newGame()
              }}
              className="px-4 py-2 text-sm font-mono-ui choice-card"
              style={{ color: 'var(--fg-bright)' }}
            >
              ./replay
            </button>
          </div>
        ) : null}
      </div>

      {showChoices && node.choices ? (
        <ChoiceBar
          choices={node.choices}
          onPick={onPick}
          hasRefs={focusIds.length > 0}
          onOpenRefs={() => openArchive('本议')}
        />
      ) : null}

      <GlossModal entry={gloss} onClose={() => setGloss(null)} />
      <ArchivePanel
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        allCards={allCards}
        focusIds={focusIds}
        sceneTitle={node.title ?? chapter.title}
        initialMode={archiveModeHint}
      />
    </DesktopShell>
  )
}
