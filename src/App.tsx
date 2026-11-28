import { useEffect, useRef, useState } from 'react'
import { GUANDU_7D_PACK } from './content/desk/guandu7d.ts'
import { JIANGLING_10D_PACK } from './content/desk/jiangling10d.ts'
import { CHAPTER_REGISTRY } from './content/registry.ts'
import { loadDeskBest } from './core/deskEngine.ts'
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
import {
  clearWhatIfPrefetch,
  consumePrefetchedNode,
  deleteCuratedBranch,
  exportWhatIfPatch,
  generateWhatIfNode,
  loadCuratedBranches,
  loadLlmConfig,
  prefetchNextChoices,
  saveCuratedBranch,
} from './core/whatIfGen.ts'
import type { CuratedBranch, LlmConfig, WhatIfStepMeta, WhatIfStyle } from './core/whatIfGen.ts'
import { CounterCaseCard } from './ui/CounterCaseCard.tsx'
import { DeskMode } from './ui/DeskMode.tsx'
import { DualHud } from './ui/DualHud.tsx'
import { EndingCard } from './ui/EndingCard.tsx'
import { RichText } from './ui/RichText.tsx'
import { ThemeShell } from './ui/ThemeShell.tsx'
import { WhatIfDrawer } from './ui/WhatIfDrawer.tsx'
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

const DESK_PACKS = [JIANGLING_10D_PACK, GUANDU_7D_PACK]

type AppScreen = 'home' | 'story_select' | 'story_play' | 'desk_select' | 'desk_play'

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('home')
  const [selectedChapterId, setSelectedChapterId] = useState(CHAPTER_REGISTRY[0]?.id ?? 'ch01-red-cliffs')
  const [selectedDeskId, setSelectedDeskId] = useState(DESK_PACKS[0]!.id)
  const [bundle, setBundle] = useState<ChapterBundle | null>(null)
  const [save, setSave] = useState<SaveState | null>(null)
  const [hasSavedRun, setHasSavedRun] = useState(false)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [audioOn, setAudioOn] = useState(false)
  const [modal, setModal] = useState<ModalState>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [skipSignal, setSkipSignal] = useState(0)
  const [archiveTab, setArchiveTab] = useState<'notes' | 'curated' | 'import'>('notes')
  const [curatedList, setCuratedList] = useState<CuratedBranch[]>(() => loadCuratedBranches())
  const [packText, setPackText] = useState('')
  const [packStatus, setPackStatus] = useState<string | null>(null)
  const [whatIfOpen, setWhatIfOpen] = useState(false)
  const [whatIfMeta, setWhatIfMeta] = useState<WhatIfStepMeta | null>(null)
  const [whatIfBusy, setWhatIfBusy] = useState(false)
  const [whatIfErr, setWhatIfErr] = useState<string | null>(null)
  const [whatIfSaved, setWhatIfSaved] = useState(false)
  const [whatIfExported, setWhatIfExported] = useState(false)

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
    if (screen === 'story_play' && save) {
      saveChapterState(save)
    }
  }, [screen, save])

  // 3. Sync audio mood & browser document.title
  const currentMood = save?.mood
  useEffect(() => {
    if (currentMood) audioEngine.setMood(currentMood)
  }, [currentMood])

  const selectedDeskPack = DESK_PACKS.find((p) => p.id === selectedDeskId) ?? DESK_PACKS[0]!

  useEffect(() => {
    if (screen === 'desk_select') {
      audioEngine.configureTheme(selectedDeskPack.theme)
      document.title = '曹操不容易'
    } else if (screen === 'home') {
      document.title = '曹操不容易'
    } else if (bundle) {
      audioEngine.configureTheme(bundle.theme)
      document.title = bundle.title
    }
  }, [screen, bundle, selectedDeskPack])

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

  if (screen === 'desk_play') {
    return (
      <DeskMode
        key={selectedDeskPack.id}
        pack={selectedDeskPack}
        audioOn={audioOn}
        onToggleAudio={() => setAudioOn(audioEngine.toggle())}
        onExit={() => {
          setScreen('desk_select')
        }}
      />
    )
  }

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
    setWhatIfMeta(null)
    setWhatIfErr(null)
    setWhatIfExported(false)
    clearWhatIfPrefetch()
    setScreen('story_play')
  }

  function resumeSaved() {
    if (!bundle || !save) return
    audioEngine.playStamp(false)
    setFeed(seedFeedForNode(bundle, save))
    setScreen('story_play')
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

  function enterDynamicNode(targetBundle: ChapterBundle, baseSave: SaveState, node: ChapterBundle['nodes'][string], extraEvents: GameEvent[] = [], replyText?: string) {
    const nextBundle: ChapterBundle = {
      ...targetBundle,
      nodes: { ...targetBundle.nodes, [node.id]: node },
    }
    const isEnd = node.kind === 'ending'
    const nextSave: SaveState = {
      ...baseSave,
      nodeId: node.id,
      lineIndex: 0,
      mood: node.mood ?? baseSave.mood,
      visitedNodes: baseSave.visitedNodes.includes(node.id)
        ? baseSave.visitedNodes
        : [...baseSave.visitedNodes, node.id],
      finished: isEnd,
      endingNodeId: isEnd ? node.id : null,
      savedAt: Date.now(),
    }
    setBundle(nextBundle)
    setSave(nextSave)
    setFeed((prev) => {
      let next = [...prev]
      if (replyText) next.push({ kind: 'reply', id: makeId('rep'), text: replyText })
      next = appendEventsToFeed(extraEvents, next)
      if (node.act) next.push({ kind: 'divider', id: makeId('div'), text: node.act })
      const firstLine = getVisibleLines(node, nextSave)[0]
      if (firstLine) next.push({ kind: 'line', id: makeId('ln'), line: firstLine })
      return next
    })
  }

  async function handleStartWhatIf(style: WhatIfStyle, userIdea: string, cfg: LlmConfig) {
    if (!bundle || !save) return
    setWhatIfBusy(true)
    setWhatIfErr(null)
    const sessionId = `N_AI_${Date.now().toString(36)}`
    const meta: WhatIfStepMeta = {
      sessionId,
      originNodeId: save.nodeId,
      style,
      userIdea,
      step: 1,
      generatedNodeIds: [],
    }
    try {
      const { node } = await generateWhatIfNode(bundle, save, meta, cfg)
      const nextMeta: WhatIfStepMeta = { ...meta, generatedNodeIds: [node.id] }
      setWhatIfMeta(nextMeta)
      setWhatIfOpen(false)
      setWhatIfSaved(false)
      setWhatIfExported(false)
      audioEngine.playStamp(true)
      enterDynamicNode(bundle, save, node, [
        {
          type: 'settlement',
          settlement: {
            badges: ['别史启卷'],
            reasons: ['已从当前变局另辟一条五幕平行世界线'],
            deltas: {},
          },
        },
      ])
      // Speculatively prefetch both Act 2 branches while player reads Act 1
      prefetchNextChoices(bundle, save, nextMeta, node, cfg)
    } catch (e) {
      setWhatIfErr(e instanceof Error ? e.message : String(e))
    } finally {
      setWhatIfBusy(false)
    }
  }

  function handleChoose(choice: Choice) {
    if (!bundle || !save) return
    const prevNodeId = save.nodeId

    // Dynamic 5-act What-If continuation
    if (typeof choice.next === 'string' && choice.next.startsWith('__AI_STEP_') && whatIfMeta) {
      const m = choice.next.match(/__AI_STEP_(\d+)__/)
      const stepNum = Math.min(5, Math.max(2, Number(m?.[1] ?? 5))) as 2 | 3 | 4 | 5
      const { save: settledSave, events } = reduceGame(bundle, save, {
        type: 'APPLY_WIDGET_EFFECTS',
        effects: choice.effects ?? [],
      })
      if (settledSave.finished) {
        setSave(settledSave)
        setFeed((prev) => {
          let next = [...prev]
          if (choice.replyText) next.push({ kind: 'reply', id: makeId('rep'), text: choice.replyText })
          return appendEventsToFeed(events, next)
        })
        return
      }
      setWhatIfBusy(true)
      const nextMeta: WhatIfStepMeta = { ...whatIfMeta, step: stepNum }
      const cfg = loadLlmConfig()
      const prefetched = consumePrefetchedNode(whatIfMeta.sessionId, stepNum, choice.id)
      const req = prefetched ?? generateWhatIfNode(bundle, settledSave, nextMeta, cfg, choice.label)
      void req
        .then(({ node }) => {
          const updatedMeta: WhatIfStepMeta = {
            ...nextMeta,
            generatedNodeIds: [...nextMeta.generatedNodeIds, node.id],
          }
          setWhatIfMeta(updatedMeta)
          enterDynamicNode(bundle, settledSave, node, events, choice.replyText)
          if (stepNum < 5) {
            prefetchNextChoices(bundle, settledSave, updatedMeta, node, cfg)
          }
        })
        .catch((e) => {
          setFeed((prev) => [
            ...prev,
            {
              kind: 'strip',
              id: makeId('err'),
              badge: '推演中断',
              text: e instanceof Error ? e.message : String(e),
              warn: true,
            },
          ])
        })
        .finally(() => {
          setWhatIfBusy(false)
        })
      return
    }

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

  const activeTheme = screen === 'desk_select' ? selectedDeskPack.theme : bundle.theme
  const deskBest = screen === 'desk_select' ? loadDeskBest(selectedDeskPack.id) : null

  return (
    <ThemeShell theme={activeTheme} mood={save.mood}>
      {screen === 'home' && (
        <section className="cc-splash" aria-label="主菜单">
          <div className="cc-splash-card">
            <div className="cc-splash-kicker">
              <span>CCNOTEASY // 主菜单</span>
              <span>建安军政案牍</span>
            </div>
            <h1 className="cc-splash-title" style={{ marginTop: 10 }}>
              曹操不容易
            </h1>
            <div className="cc-splash-sub">坐上大帐帅案，先选你要玩的模式</div>

            <div className="cc-mode-list">
              <button
                type="button"
                className="cc-mode-card"
                onClick={() => {
                  audioEngine.playStamp(false)
                  setScreen('story_select')
                }}
              >
                <div className="cc-mode-head">
                  <strong>What-If 平行三国 · 多线剧情</strong>
                  <span className="cc-mode-badge">五章 · 67 结局</span>
                </div>
                <div className="cc-mode-desc">
                  在赤壁、官渡、宛城、白门楼与汉中的史实骨架上，每幕都能撕开改写历史的架空世界线，重玩每局都有新走向。
                </div>
                <div className="cc-mode-meta">赤壁 · 官渡 · 宛城 · 白门楼 · 汉中 · 含 34 条架空结局</div>
              </button>

              <button
                type="button"
                className="cc-mode-card is-desk"
                onClick={() => {
                  audioEngine.playStamp(false)
                  setScreen('desk_select')
                }}
              >
                <div className="cc-mode-head">
                  <strong>大帐值班 · 无剧本生存</strong>
                  <span className="cc-mode-badge">双图 · 涌现配方</span>
                </div>
                <div className="cc-mode-desc">
                  脱离固定剧情：每日挑幕僚轮值、审动态案卷池、拍主动手令打组合拳，在房租死线与高利贷暗雷间硬撑。
                </div>
                <div className="cc-mode-meta">江陵十日（标准） · 官渡七日（高压） · 支持无尽镇守</div>
              </button>
            </div>

            <div className="cc-splash-foot">
              <span>单手竖屏</span>
              <button
                type="button"
                className={`cc-audio-pill${audioOn ? ' is-on' : ''}`}
                onClick={() => setAudioOn(audioEngine.toggle())}
              >
                音效：{audioOn ? '开' : '关'}
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === 'story_select' && (
        <section className="cc-splash" aria-label="史实主线选章">
          <div className="cc-splash-card">
            <div className="cc-splash-kicker">
              <button
                type="button"
                className="cc-back-link"
                onClick={() => {
                  audioEngine.playExpose()
                  setScreen('home')
                }}
              >
                ← 主菜单
              </button>
              <span>史实主线 · {bundle.theme.name}</span>
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
                <strong>世界线结局</strong>
                <span>
                  已收 {save.discoveredEndings.length} /{' '}
                  {Object.values(bundle.nodes).filter((n) => n.kind === 'ending').length}
                </span>
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
              <span>史实分支</span>
              <button
                type="button"
                className={`cc-audio-pill${audioOn ? ' is-on' : ''}`}
                onClick={() => setAudioOn(audioEngine.toggle())}
              >
                音效：{audioOn ? '开' : '关'}
              </button>
            </div>
          </div>
        </section>
      )}

      {screen === 'desk_select' && (
        <section className="cc-splash" aria-label="大帐值班选图">
          <div className="cc-splash-card">
            <div className="cc-splash-kicker">
              <button
                type="button"
                className="cc-back-link"
                onClick={() => {
                  audioEngine.playExpose()
                  setScreen('home')
                }}
              >
                ← 主菜单
              </button>
              <span>大帐值班 · {selectedDeskPack.theme.name}</span>
            </div>
            <div className="cc-ch-tabs" role="tablist" aria-label="选择值班地图" style={{ marginTop: 10 }}>
              {DESK_PACKS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedDeskId === p.id}
                  className={`cc-ch-tab${selectedDeskId === p.id ? ' is-active' : ''}`}
                  onClick={() => {
                    if (selectedDeskId !== p.id) {
                      audioEngine.playExpose()
                      setSelectedDeskId(p.id)
                    }
                  }}
                >
                  <strong>{p.title}</strong>
                  <span>{p.difficultyLabel}</span>
                </button>
              ))}
            </div>
            <h1 className="cc-splash-title">{selectedDeskPack.title}</h1>
            <div className="cc-splash-sub">{selectedDeskPack.subtitle}</div>
            <p className="cc-splash-desc">{selectedDeskPack.tagline}</p>
            <div className="cc-rules-grid">
              <div className="cc-rule-pill">
                <strong>目标天数</strong>
                <span>满 {selectedDeskPack.targetDays} 日可续无尽</span>
              </div>
              <div className="cc-rule-pill">
                <strong>案卷 / 配方</strong>
                <span>
                  {selectedDeskPack.cases.length} 卷 · {deskBest?.discoveredCombos.length ?? 0}/
                  {selectedDeskPack.combos.length} 配方
                </span>
              </div>
              <div className="cc-rule-pill">
                <strong>历史最佳</strong>
                <span>
                  {deskBest && deskBest.bestDay > 0
                    ? `${deskBest.bestDay} 日 · ${deskBest.victories} 胜`
                    : '尚未开局'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="cc-btn-primary"
              onClick={() => {
                audioEngine.playStamp(false)
                setScreen('desk_play')
              }}
            >
              辰时升帐，开始值班
            </button>
            <div className="cc-splash-foot">
              <span>动态案卷</span>
              <button
                type="button"
                className={`cc-audio-pill${audioOn ? ' is-on' : ''}`}
                onClick={() => setAudioOn(audioEngine.toggle())}
              >
                音效：{audioOn ? '开' : '关'}
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
        onExit={() => {
          audioEngine.playExpose()
          setScreen('story_select')
        }}
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
                className={`cc-stamp-btn kind-${ch.stampKind ?? 'approve'}${ch.label.startsWith('【架空】') ? ' is-whatif' : ''}`}
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

        {(showCounterCase || showPlainChoices) && !whatIfMeta && !whatIfBusy && (
          <button
            type="button"
            className="cc-wi-trigger"
            onClick={() => {
              audioEngine.playExpose()
              setWhatIfErr(null)
              setWhatIfOpen(true)
            }}
          >
            ✦ 另辟史册（推演五幕平行世界线）
          </button>
        )}

        {whatIfBusy && (
          <div className="cc-strip is-combo">
            <span className="cc-strip-badge">快马急报</span>
            <span>前线暗哨正传回后续军情变局…</span>
          </div>
        )}

        {save.finished && whatIfMeta && (
          <div className="cc-wi-export-bar">
            <span>觉得这段别史精彩？可收入别史馆</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                className="cc-audio-pill is-on"
                onClick={() => {
                  saveCuratedBranch(bundle, whatIfMeta)
                  setCuratedList(loadCuratedBranches())
                  setWhatIfSaved(true)
                  audioEngine.playStamp(false)
                }}
              >
                {whatIfSaved ? '已入别史馆 ✓' : '★ 收入别史馆'}
              </button>
              <button
                type="button"
                className="cc-audio-pill"
                onClick={() => {
                  const patch = exportWhatIfPatch(bundle, whatIfMeta)
                  void navigator.clipboard?.writeText(patch).then(() => {
                    setWhatIfExported(true)
                    setTimeout(() => setWhatIfExported(false), 2500)
                  })
                }}
              >
                {whatIfExported ? '已复制 ✓' : '复制案卷'}
              </button>
            </div>
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

      {whatIfOpen && (
        <WhatIfDrawer
          busy={whatIfBusy}
          error={whatIfErr}
          onClose={() => setWhatIfOpen(false)}
          onStart={(style, idea, cfg) => void handleStartWhatIf(style, idea, cfg)}
        />
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
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`cc-audio-pill${archiveTab === 'notes' ? ' is-on' : ''}`}
                    onClick={() => setArchiveTab('notes')}
                  >
                    已阅词条 ({save.unlockedGloss.length + save.decodedSubtexts.length})
                  </button>
                  <button
                    type="button"
                    className={`cc-audio-pill${archiveTab === 'curated' ? ' is-on' : ''}`}
                    onClick={() => {
                      setCuratedList(loadCuratedBranches())
                      setArchiveTab('curated')
                    }}
                  >
                    别史馆 ({curatedList.length})
                  </button>
                  <button
                    type="button"
                    className={`cc-audio-pill${archiveTab === 'import' ? ' is-on' : ''}`}
                    onClick={() => setArchiveTab('import')}
                  >
                    导入共创包
                  </button>
                </div>

                {archiveTab === 'curated' ? (
                  <div style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {curatedList.length === 0 ? (
                      <div style={{ color: 'var(--fg-dim)', lineHeight: 1.6 }}>
                        尚未收录别史。在「另辟史册」推演结束后点击「★ 收入别史馆」，即可将精彩世界线永久珍藏于此，随时重读或复制发给作者沉淀进正式版。
                      </div>
                    ) : (
                      curatedList.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            padding: 9,
                            border: '1px solid var(--muted)',
                            borderLeft: '3px solid var(--teal)',
                            background: 'var(--bg)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 5,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                            <strong style={{ color: 'var(--fg-bright)' }}>{item.title}</strong>
                            <span style={{ fontSize: 10.5, color: 'var(--teal)' }}>{item.buildName}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--fg-dim)' }}>
                            {item.chapterSubtitle}
                            {item.userIdea ? ` · 念头：「${item.userIdea}」` : ''}
                          </div>
                          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                            {item.chapterId === bundle.id && item.nodes[item.startNodeId] && (
                              <button
                                type="button"
                                className="cc-audio-pill is-on"
                                onClick={() => {
                                  const nextBundle: ChapterBundle = {
                                    ...bundle,
                                    nodes: { ...bundle.nodes, ...item.nodes },
                                  }
                                  const replayNode = item.nodes[item.startNodeId]!
                                  setWhatIfMeta({
                                    sessionId: item.id,
                                    originNodeId: item.originNodeId,
                                    style: item.style,
                                    userIdea: item.userIdea,
                                    step: 1,
                                    generatedNodeIds: Object.keys(item.nodes),
                                  })
                                  setModal(null)
                                  enterDynamicNode(nextBundle, save, replayNode, [
                                    {
                                      type: 'settlement',
                                      settlement: {
                                        badges: ['别史重读'],
                                        reasons: [`已展开珍藏别史《${item.title}》`],
                                        deltas: {},
                                      },
                                    },
                                  ])
                                }}
                              >
                                重读此卷
                              </button>
                            )}
                            <button
                              type="button"
                              className="cc-audio-pill"
                              onClick={() => {
                                void navigator.clipboard?.writeText(JSON.stringify(item, null, 2))
                              }}
                            >
                              复制案卷
                            </button>
                            <button
                              type="button"
                              className="cc-audio-pill"
                              onClick={() => setCuratedList(deleteCuratedBranch(item.id))}
                            >
                              删
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : archiveTab === 'notes' ? (
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
