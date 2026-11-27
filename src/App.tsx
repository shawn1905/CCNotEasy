import { useEffect, useRef, useState } from 'react'
import { CHAPTER_REGISTRY } from './content/registry.ts'
import {
  createInitialSave,
  getVisibleChoices,
  getVisibleLines,
  reduceGame,
} from './core/reducer.ts'
import type { GameEvent } from './core/reducer.ts'
import type {
  BubbleLine,
  ChapterBundle,
  Choice,
  Effect,
  SaveState,
} from './core/schema.ts'
import { clearChapterState, loadChapterState, saveChapterState } from './core/storage.ts'
import { validateChapterBundle } from './core/validator.ts'
import { CounterCaseCard } from './ui/CounterCaseCard.tsx'
import { DualHud } from './ui/DualHud.tsx'
import { EndingCard } from './ui/EndingCard.tsx'
import { RichText } from './ui/RichText.tsx'
import { ThemeShell } from './ui/ThemeShell.tsx'
import { audioEngine } from './ui/audioEngine.ts'

type FeedItem =
  | { kind: 'divider'; id: string; text: string }
  | { kind: 'line'; id: string; line: BubbleLine }
  | { kind: 'reply'; id: string; text: string }
  | { kind: 'strip'; id: string; badge: string; text: string; warn?: boolean }

type ModalState =
  | null
  | { kind: 'gloss'; id: string }
  | { kind: 'subtext'; id: string }
  | { kind: 'resource'; id: string }
  | { kind: 'archive' }

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export default function App() {
  const [selectedChapterId, setSelectedChapterId] = useState(CHAPTER_REGISTRY[0]?.id ?? 'ch01-red-cliffs')
  const [bundle, setBundle] = useState<ChapterBundle | null>(null)
  const [save, setSave] = useState<SaveState | null>(null)
  const [hasSavedRun, setHasSavedRun] = useState(false)
  const [started, setStarted] = useState(false)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [audioOn, setAudioOn] = useState(false)
  const [modal, setModal] = useState<ModalState>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [skipSignal, setSkipSignal] = useState(0)
  const [archiveTab, setArchiveTab] = useState<'notes' | 'import'>('notes')
  const [packText, setPackText] = useState('')
  const [packStatus, setPackStatus] = useState<string | null>(null)

  const streamRef = useRef<HTMLElement | null>(null)

  // 1. Lazy-load selected chapter whenever selectedChapterId changes
  useEffect(() => {
    let active = true
    const entry = CHAPTER_REGISTRY.find((c) => c.id === selectedChapterId) ?? CHAPTER_REGISTRY[0]
    if (!entry) return
    void entry.load().then((loaded) => {
      if (!active) return
      audioEngine.configureTheme(loaded.theme)
      const existing = loadChapterState(loaded)
      setBundle(loaded)
      if (existing && !existing.recovered) {
        setHasSavedRun(true)
        setSave(existing.state)
      } else {
        setHasSavedRun(false)
        setSave(createInitialSave(loaded))
      }
    })
    return () => {
      active = false
    }
  }, [selectedChapterId])

  // 2. Persist versioned save cleanly outside reducers
  useEffect(() => {
    if (started && save) {
      saveChapterState(save)
    }
  }, [started, save])

  // 3. Sync audio mood & browser document.title
  const currentMood = save?.mood
  useEffect(() => {
    if (currentMood) audioEngine.setMood(currentMood)
  }, [currentMood])

  useEffect(() => {
    if (bundle) {
      document.title = bundle.title
    }
  }, [bundle])

  // 4. Auto-scroll stream on new feed items or node transitions
  useEffect(() => {
    const el = streamRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
    })
  }, [feed.length, save?.nodeId, save?.finished])

  // 5. Escape closes any modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!bundle || !save) {
    return (
      <div className="cc-viewport" style={{ alignItems: 'center', color: 'var(--fg-dim)', fontFamily: 'var(--font-ui)', fontSize: 12 }}>
        正在展开建安十三年案卷…
      </div>
    )
  }

  const currentNode = bundle.nodes[save.nodeId] ?? bundle.nodes[bundle.startNode]!
  const visibleLines = getVisibleLines(currentNode, save)
  const visibleChoices = getVisibleChoices(currentNode, save)
  const allLinesShown = visibleLines.length === 0 || save.lineIndex >= visibleLines.length - 1
  const showCounterCase =
    !save.finished &&
    !isTyping &&
    allLinesShown &&
    currentNode.interaction?.type === 'counter_case' &&
    visibleChoices.length > 0
  const showPlainChoices =
    !save.finished &&
    !isTyping &&
    allLinesShown &&
    currentNode.interaction?.type !== 'counter_case' &&
    visibleChoices.length > 0

  function seedFeedForNode(b: ChapterBundle, s: SaveState): FeedItem[] {
    const node = b.nodes[s.nodeId]
    if (!node) return []
    const items: FeedItem[] = []
    if (node.act) items.push({ kind: 'divider', id: makeId('div'), text: node.act })
    const lines = getVisibleLines(node, s)
    for (let i = 0; i <= Math.min(s.lineIndex, lines.length - 1); i++) {
      const l = lines[i]
      if (l) items.push({ kind: 'line', id: makeId('ln'), line: l })
    }
    return items
  }

  function appendEventsToFeed(events: GameEvent[], prevFeed: FeedItem[]): FeedItem[] {
    const next = [...prevFeed]
    for (const ev of events) {
      if (ev.type === 'settlement') {
        next.push({
          kind: 'strip',
          id: makeId('st'),
          badge: ev.settlement.badges.join(' · ') || '已批示',
          text: ev.settlement.reasons.join('；'),
        })
      } else if (ev.type === 'warning') {
        audioEngine.playAlert()
        next.push({
          kind: 'strip',
          id: makeId('wn'),
          badge: `⚠ ${ev.warning.label}`,
          text: ev.warning.text,
          warn: true,
        })
      } else if (ev.type === 'debt_triggered') {
        audioEngine.playAlert()
        next.push({
          kind: 'strip',
          id: makeId('db'),
          badge: `利息兑现 · ${ev.label}`,
          text: ev.text,
          warn: true,
        })
      }
    }
    return next
  }

  function startFresh(targetBundle = bundle) {
    if (!targetBundle) return
    audioEngine.resetEggSpeed()
    audioEngine.playStamp(false)
    clearChapterState(targetBundle.id)
    const fresh = createInitialSave(targetBundle, {
      discoveredEndings: save?.discoveredEndings ?? [],
      unlockedGloss: save?.unlockedGloss ?? [],
      decodedSubtexts: save?.decodedSubtexts ?? [],
    })
    setSave(fresh)
    setFeed(seedFeedForNode(targetBundle, fresh))
    setStarted(true)
  }

  function resumeSaved() {
    if (!bundle || !save) return
    audioEngine.playStamp(false)
    setFeed(seedFeedForNode(bundle, save))
    setStarted(true)
  }

  function handleAdvance() {
    if (!bundle || !save || save.finished) return
    if (isTyping) {
      setSkipSignal((s) => s + 1)
      return
    }
    if (showCounterCase || showPlainChoices) return
    audioEngine.playCharPop(false)
    const prevNodeId = save.nodeId
    const { save: nextSave, events } = reduceGame(bundle, save, { type: 'ADVANCE_LINE' })
    setSave(nextSave)

    setFeed((prev) => {
      let next = appendEventsToFeed(events, prev)
      if (nextSave.nodeId !== prevNodeId) {
        const nextNode = bundle.nodes[nextSave.nodeId]
        if (nextNode?.act) next.push({ kind: 'divider', id: makeId('div'), text: nextNode.act })
        const firstLine = nextNode ? getVisibleLines(nextNode, nextSave)[0] : undefined
        if (firstLine) next.push({ kind: 'line', id: makeId('ln'), line: firstLine })
      } else if (nextSave.lineIndex > save.lineIndex) {
        const nextLine = getVisibleLines(currentNode, nextSave)[nextSave.lineIndex]
        if (nextLine) next.push({ kind: 'line', id: makeId('ln'), line: nextLine })
      }
      return next
    })
  }

  function handleWidgetEffects(effects: Effect[]) {
    if (!bundle || !save) return
    const { save: nextSave, events } = reduceGame(bundle, save, {
      type: 'APPLY_WIDGET_EFFECTS',
      effects,
    })
    setSave(nextSave)
    if (events.length > 0) setFeed((prev) => appendEventsToFeed(events, prev))
  }

  function handleChoose(choice: Choice) {
    if (!bundle || !save) return
    const prevNodeId = save.nodeId
    const { save: nextSave, events } = reduceGame(bundle, save, {
      type: 'CHOOSE',
      choiceId: choice.id,
    })
    setSave(nextSave)
    setFeed((prev) => {
      let next = [...prev]
      if (choice.replyText) {
        next.push({ kind: 'reply', id: makeId('rep'), text: choice.replyText })
      }
      next = appendEventsToFeed(events, next)
      if (nextSave.nodeId !== prevNodeId && !nextSave.finished) {
        const nextNode = bundle.nodes[nextSave.nodeId]
        if (nextNode?.act) next.push({ kind: 'divider', id: makeId('div'), text: nextNode.act })
        const firstLine = nextNode ? getVisibleLines(nextNode, nextSave)[0] : undefined
        if (firstLine) next.push({ kind: 'line', id: makeId('ln'), line: firstLine })
      }
      return next
    })
  }

  function handleOpenGloss(id: string) {
    if (!bundle || !save) return
    audioEngine.playExpose()
    const { save: nextSave } = reduceGame(bundle, save, { type: 'UNLOCK_GLOSS', glossId: id })
    setSave(nextSave)
    setModal({ kind: 'gloss', id })
  }

  function handleOpenSubtext(id: string) {
    if (!bundle || !save) return
    audioEngine.playExpose()
    const { save: nextSave } = reduceGame(bundle, save, { type: 'DECODE_SUBTEXT', subtextId: id })
    setSave(nextSave)
    setModal({ kind: 'subtext', id })
  }

  function handleJumpAct(actId: string) {
    if (!bundle || !save) return
    const { save: nextSave } = reduceGame(bundle, save, { type: 'JUMP_ACT', actId })
    setSave(nextSave)
    setFeed(seedFeedForNode(bundle, nextSave))
  }

  function handleImportPack() {
    try {
      const parsed = JSON.parse(packText) as ChapterBundle
      const report = validateChapterBundle(parsed)
      if (!report.ok) {
        setPackStatus(
          `校验未通过（${report.errors.length} 处错误）：\n` +
            report.errors.slice(0, 4).map((e) => `• [${e.code}] ${e.path}: ${e.message}`).join('\n'),
        )
        return
      }
      audioEngine.configureTheme(parsed.theme)
      setBundle(parsed)
      setPackStatus(`校验通过！已加载「${parsed.title}」（${report.stats.nodes} 节点）`)
      setModal(null)
      startFresh(parsed)
    } catch (e) {
      setPackStatus(`JSON 解析失败：${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const remainingLines = Math.max(0, visibleLines.length - 1 - save.lineIndex)

  return (
    <ThemeShell theme={bundle.theme} mood={save.mood}>
      {!started && (
        <section className="cc-splash" aria-label="开场界面">
          <div className="cc-splash-card">
            <div className="cc-splash-kicker">
              <span>CCNOTEASY // 章节选择</span>
              <span>{bundle.theme.name}</span>
            </div>
            <div className="cc-ch-tabs" role="tablist" aria-label="选择章节" style={{ marginTop: 10 }}>
              {CHAPTER_REGISTRY.map((ch) => (
                <button
                  key={ch.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedChapterId === ch.id}
                  className={`cc-ch-tab${selectedChapterId === ch.id ? ' is-active' : ''}`}
                  onClick={() => {
                    if (selectedChapterId !== ch.id) {
                      audioEngine.playExpose()
                      setSelectedChapterId(ch.id)
                    }
                  }}
                >
                  <strong>
                    {ch.num} · {ch.title}
                  </strong>
                  <span>{ch.themeName}</span>
                </button>
              ))}
            </div>
            <h1 className="cc-splash-title">{bundle.title}</h1>
            <div className="cc-splash-sub">{bundle.subtitle}</div>
            <p className="cc-splash-desc">{bundle.tagline}</p>
            <div className="cc-rules-grid">
              <div className="cc-rule-pill">
                <strong>三项血条</strong>
                <span>≤1 告急 · =0 崩盘</span>
              </div>
              <div className="cc-rule-pill">
                <strong>章节死线</strong>
                <span>满格抢先破局</span>
              </div>
              <div className="cc-rule-pill">
                <strong>柜台大印</strong>
                <span>取证 · 打脸 · 脏招</span>
              </div>
            </div>
            <button type="button" className="cc-btn-primary" onClick={() => startFresh()}>
              坐上帅案，开始批文
            </button>
            {hasSavedRun && (
              <button type="button" className="cc-btn-secondary" onClick={resumeSaved}>
                继续上次存档
              </button>
            )}
            <div className="cc-splash-foot">
              <span>共创友好 · 纯 JSON 引擎</span>
              <button
                type="button"
                className={`cc-audio-pill${audioOn ? ' is-on' : ''}`}
                onClick={() => setAudioOn(audioEngine.toggle())}
              >
                {bundle.theme.bgmLabel}：{audioOn ? '已开启' : '静音'}
              </button>
            </div>
          </div>
        </section>
      )}

      <DualHud
        bundle={bundle}
        save={save}
        audioOn={audioOn}
        onToggleAudio={() => setAudioOn(audioEngine.toggle())}
        onReset={() => startFresh()}
        onInspectResource={(id) => {
          audioEngine.playExpose()
          setModal({ kind: 'resource', id })
        }}
        onOpenArchive={() => {
          audioEngine.playExpose()
          setModal({ kind: 'archive' })
        }}
      />

      <section
        className="cc-stream"
        ref={streamRef}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.closest('button, details, summary, input, textarea, .cc-case, .cc-ending')) return
          handleAdvance()
        }}
      >
        {(() => {
          let lastLineIdx = -1
          for (let i = feed.length - 1; i >= 0; i--) {
            if (feed[i]?.kind === 'line') {
              lastLineIdx = i
              break
            }
          }
          return feed.map((item, idx) => {
          if (item.kind === 'divider') {
            return (
              <div key={item.id} className="cc-act-divider">
                <span>{item.text}</span>
              </div>
            )
          }
          if (item.kind === 'strip') {
            return (
              <div key={item.id} className={`cc-strip${item.warn ? ' is-warn' : ''}`}>
                <span className="cc-strip-badge">{item.badge}</span>
                <span>{item.text}</span>
              </div>
            )
          }
          if (item.kind === 'reply') {
            return (
              <div key={item.id} className="cc-msg-row right">
                <div className="cc-msg-box">
                  <div className="cc-msg-head">
                    <span className="cc-msg-spk">曹操</span>
                    <span className="cc-msg-role">拍板盖印</span>
                  </div>
                  <div>
                    <RichText
                      text={item.text}
                      bundle={bundle}
                      onOpenGloss={handleOpenGloss}
                      onOpenSubtext={handleOpenSubtext}
                    />
                  </div>
                </div>
              </div>
            )
          }

          const { line } = item
          const cast = bundle.cast[line.speaker]
          const side = line.sideOverride ?? cast?.side ?? 'left'
          const isNewest = idx === lastLineIdx && !save.finished

          if (line.isWalk || side === 'center') {
            return (
              <div key={item.id} className="cc-walk">
                <div className="cc-walk-kicker">— {line.walkKicker ?? cast?.name ?? '巡营所见'} —</div>
                <div>
                  <RichText
                    text={line.text}
                    bundle={bundle}
                    onOpenGloss={handleOpenGloss}
                    onOpenSubtext={handleOpenSubtext}
                    animate={isNewest}
                    skipSignal={skipSignal}
                    onTypingChange={isNewest ? setIsTyping : undefined}
                  />
                </div>
                {line.clues && line.clues.length > 0 && (!isNewest || !isTyping) && (
                  <div className="cc-clues">
                    {line.clues.map((c) => (
                      <span key={c.id} className="cc-clue-chip">
                        证物：{c.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <div key={item.id} className={`cc-msg-row ${side}`}>
              <div className="cc-msg-box">
                <div className="cc-msg-head">
                  <span className="cc-msg-spk">{cast?.name ?? line.speaker}</span>
                  {(line.roleOverride ?? cast?.role) && (
                    <span className="cc-msg-role">{line.roleOverride ?? cast?.role}</span>
                  )}
                  {line.sourceTag && <span className="cc-msg-tag">{line.sourceTag}</span>}
                </div>
                <div>
                  <RichText
                    text={line.text}
                    bundle={bundle}
                    onOpenGloss={handleOpenGloss}
                    onOpenSubtext={handleOpenSubtext}
                    animate={isNewest}
                    skipSignal={skipSignal}
                    onTypingChange={isNewest ? setIsTyping : undefined}
                  />
                </div>
              </div>
            </div>
          )
        })
        })()}

        {showCounterCase && currentNode.interaction?.type === 'counter_case' && (
          <CounterCaseCard
            key={currentNode.id}
            bundle={bundle}
            title={currentNode.interaction.title}
            docTitle={currentNode.interaction.docTitle}
            prompt={currentNode.interaction.prompt}
            minExpose={currentNode.interaction.minExpose ?? currentNode.interaction.claims.length}
            claims={currentNode.interaction.claims}
            choices={visibleChoices}
            onApplyClaimEffects={handleWidgetEffects}
            onChoose={handleChoose}
            onOpenGloss={handleOpenGloss}
            onOpenSubtext={handleOpenSubtext}
          />
        )}

        {showPlainChoices && (
          <div className="cc-stamps">
            {visibleChoices.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`cc-stamp-btn kind-${ch.stampKind ?? 'approve'}`}
                onClick={() => {
                  audioEngine.playStamp(ch.stampKind === 'dirty')
                  handleChoose(ch)
                }}
              >
                <div className="cc-stamp-top">
                  <span className="cc-stamp-name">{ch.label}</span>
                  {ch.hint && <span className="cc-stamp-cost">{ch.hint}</span>}
                </div>
              </button>
            ))}
          </div>
        )}

        {save.finished && (
          <EndingCard
            bundle={bundle}
            save={save}
            node={currentNode}
            onAudioSync={() => setAudioOn(audioEngine.isEnabled())}
            onReplay={() => startFresh()}
            onJumpAct={handleJumpAct}
          />
        )}
      </section>

      {!save.finished && !showCounterCase && !showPlainChoices && (
        <footer className="cc-bottom">
          <button type="button" className="cc-tap-btn" onClick={handleAdvance}>
            <span>{isTyping ? '轻触快显本句' : '点击继续'}</span>
            <span style={{ color: 'var(--accent)', fontSize: 11.5 }}>
              {isTyping ? '蹦字中…' : remainingLines > 0 ? `剩余 ${remainingLines} 条` : '进入案卷'}
            </span>
          </button>
        </footer>
      )}

      {modal && (
        <div
          className="cc-modal-bg"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null)
          }}
        >
          <div className="cc-modal-sheet">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-dim)', marginBottom: 8 }}>
              <span>
                {modal.kind === 'gloss'
                  ? '// 词条释义 · GLOSS'
                  : modal.kind === 'subtext'
                    ? '// 丞相内心翻译机 · SUBTEXT'
                    : modal.kind === 'resource'
                      ? '// 军政红线说明 · THRESHOLD'
                      : '// 案牍与共创包导入'}
              </span>
              <button type="button" onClick={() => setModal(null)}>
                关闭 [ESC]
              </button>
            </div>

            {modal.kind === 'gloss' && (() => {
              const g = bundle.gloss[modal.id]
              return (
                <>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-bright)', marginBottom: 6 }}>
                    {g?.term ?? modal.id}
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.65 }}>{g?.plain}</div>
                  {g?.source && <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--fg-dim)' }}>出处：{g.source}</div>}
                </>
              )
            })()}

            {modal.kind === 'subtext' && (() => {
              const s = bundle.subtexts[modal.id]
              return (
                <>
                  <div style={{ fontSize: 13, color: 'var(--fg-dim)', marginBottom: 6 }}>
                    【表面官话】「{s?.surface ?? modal.id}」
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--accent)', lineHeight: 1.65 }}>
                    <strong>【曹操听懂的实话】</strong>
                    {s?.decode}
                  </div>
                  {s?.note && <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--fg-dim)' }}>{s.note}</div>}
                </>
              )
            })()}

            {modal.kind === 'resource' && (() => {
              const r = bundle.resources.find((x) => x.id === modal.id)
              if (!r) return null
              const val = save.resources[r.id] ?? 0
              return (
                <>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-bright)', marginBottom: 6 }}>
                    {r.label} · 当前 {val} / {r.max}
                  </div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.65 }}>
                    警戒线：≤ {r.warnAt}（亮灯报警） · 红线：= {r.collapseAt}（直接崩盘）
                    <br />
                    <br />
                    {r.redlineDesc}
                  </div>
                </>
              )
            })()}

            {modal.kind === 'archive' && (
              <>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <button
                    type="button"
                    className={`cc-audio-pill${archiveTab === 'notes' ? ' is-on' : ''}`}
                    onClick={() => setArchiveTab('notes')}
                  >
                    已阅词条 ({save.unlockedGloss.length + save.decodedSubtexts.length})
                  </button>
                  <button
                    type="button"
                    className={`cc-audio-pill${archiveTab === 'import' ? ' is-on' : ''}`}
                    onClick={() => setArchiveTab('import')}
                  >
                    导入共创章节包 JSON
                  </button>
                </div>

                {archiveTab === 'notes' ? (
                  <div style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {save.unlockedGloss.length === 0 && save.decodedSubtexts.length === 0 && (
                      <div style={{ color: 'var(--fg-dim)' }}>点击对话中的虚线词条或官场潜台词即可收录于此。</div>
                    )}
                    {save.unlockedGloss.map((gid) => {
                      const g = bundle.gloss[gid]
                      return g ? (
                        <div key={gid} style={{ padding: 8, border: '1px solid var(--muted)', background: 'var(--bg)' }}>
                          <strong style={{ color: 'var(--teal)' }}>{g.term}</strong>：{g.plain}
                        </div>
                      ) : null
                    })}
                    {save.decodedSubtexts.map((sid) => {
                      const s = bundle.subtexts[sid]
                      return s ? (
                        <div key={sid} style={{ padding: 8, border: '1px solid var(--muted)', background: 'var(--bg)' }}>
                          <strong style={{ color: 'var(--warn)' }}>「{s.surface}」</strong>：{s.decode}
                        </div>
                      ) : null
                    })}
                  </div>
                ) : (
                  <div>
                    <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--fg-dim)' }}>
                      粘贴任意符合 `ChapterBundle` 协议的纯 JSON 章节包，点击校验并试玩：
                    </p>
                    <textarea
                      value={packText}
                      onChange={(e) => setPackText(e.target.value)}
                      rows={6}
                      placeholder='{"schemaVersion":1,"id":"ch02-..."}'
                      style={{
                        width: '100%',
                        background: 'var(--bg-darker)',
                        color: 'var(--fg)',
                        border: '1px solid var(--muted)',
                        padding: 8,
                        fontFamily: 'var(--font-ui)',
                        fontSize: 11,
                      }}
                    />
                    <button type="button" className="cc-btn-primary" style={{ marginTop: 8 }} onClick={handleImportPack}>
                      校验并加载共创章节包
                    </button>
                    {packStatus && (
                      <pre style={{ marginTop: 8, fontSize: 11, whiteSpace: 'pre-wrap', color: 'var(--warn)' }}>
                        {packStatus}
                      </pre>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </ThemeShell>
  )
}
