import { redCliffsEve } from './content/redCliffsEve'
import type {
  BubbleLine,
  Chapter,
  Choice,
  Effect,
  FlagName,
  Flags,
  PrepAction,
  SceneNode,
} from './types'

const STORAGE_KEY = 'ccne-red-cliffs-eve-v6'

export const DEFAULT_FLAGS: Flags = {
  haste: false,
  plague_honesty: false,
  loose_ships: false,
  suspect_defection: false,
}

export type SaveState = {
  nodeId: string
  lineIndex: number
  flags: Flags
  costs: string[]
  seenGloss: string[]
  ended: boolean
  endingId?: string
  /** 本节点已执行的 prep id */
  donePrep: string[]
  /** 走动/问策/翻卷追加进对话流的句子 */
  injectedLines: BubbleLine[]
  /** 是否已点「准备拍板」，露出 A/B */
  readyToDecide: boolean
  /** 翻卷后待弹出的史料 id */
  pendingRefIds: string[]
}

function clearDeskFields(partial: Partial<SaveState> = {}): Pick<
  SaveState,
  'donePrep' | 'injectedLines' | 'readyToDecide' | 'pendingRefIds'
> {
  return {
    donePrep: [],
    injectedLines: [],
    readyToDecide: false,
    pendingRefIds: [],
    ...partial,
  }
}

export function createInitialState(chapter: Chapter = redCliffsEve): SaveState {
  return {
    nodeId: chapter.start,
    lineIndex: 0,
    flags: { ...DEFAULT_FLAGS },
    costs: [],
    seenGloss: [],
    ended: false,
    ...clearDeskFields(),
  }
}

export function loadSave(): SaveState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SaveState
    return {
      ...createInitialState(),
      ...parsed,
      flags: { ...DEFAULT_FLAGS, ...parsed.flags },
      donePrep: parsed.donePrep ?? [],
      injectedLines: parsed.injectedLines ?? [],
      readyToDecide: parsed.readyToDecide ?? false,
      pendingRefIds: parsed.pendingRefIds ?? [],
    }
  } catch {
    return null
  }
}

export function persistSave(state: SaveState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearSave(): void {
  localStorage.removeItem(STORAGE_KEY)
}

function flagsMatch(flags: Flags, partial?: Partial<Flags>): boolean {
  if (!partial) return true
  return (Object.keys(partial) as FlagName[]).every(
    (k) => flags[k] === partial[k],
  )
}

function flagsClash(flags: Flags, partial?: Partial<Flags>): boolean {
  if (!partial) return false
  return (Object.keys(partial) as FlagName[]).some(
    (k) => flags[k] === partial[k],
  )
}

export function visibleLines(node: SceneNode, flags: Flags): BubbleLine[] {
  return node.lines.filter(
    (line) => flagsMatch(flags, line.when) && !flagsClash(flags, line.unless),
  )
}

export function filterLines(lines: BubbleLine[], flags: Flags): BubbleLine[] {
  return lines.filter(
    (line) => flagsMatch(flags, line.when) && !flagsClash(flags, line.unless),
  )
}

export function applyEffects(
  state: SaveState,
  effects: Effect[] | undefined,
): SaveState {
  if (!effects?.length) return state
  const flags = { ...state.flags }
  const costs = [...state.costs]
  for (const e of effects) {
    if ('set' in e) {
      flags[e.set] = e.value
    } else if ('cost' in e) {
      costs.push(e.cost)
    }
  }
  return { ...state, flags, costs }
}

/** Assemble battle-report paragraphs from flags (N07). */
export function buildReportLines(flags: Flags, costs: string[]): BubbleLine[] {
  const lines: BubbleLine[] = [
    {
      speaker: 'system',
      text: '【战报】建安十三年 · 赤壁—乌林对峙段（据抉择拼装，非单一史文照抄）',
    },
    {
      speaker: 'system',
      text: '读法：先日历，次名册，次泊距，次观降。短利与利息分行；风只接最后一截。',
    },
  ]

  if (flags.haste) {
    lines.push({
      speaker: 'cheng',
      text: '一、日历：你抢了窗口。旗先动，更始与舰籍后置——势在，缝不在。会猎时效被你买下；政治债与未验舰籍随舷。',
    })
    lines.push({
      speaker: 'jia',
      text: '（callback）江陵那夜的欢呼，利息从咳与观降来收。四患不是咒，是你签过的认领书。',
    })
  } else {
    lines.push({
      speaker: 'cheng',
      text: '一、日历：你买了缝。编制稍实，会猎的势淡了一截；敌方多出的准备，也记在你账上。',
    })
    lines.push({
      speaker: 'jia',
      text: '（callback）帐外「怯」字没有消失，它变成了编制里多出来的几天同鼓点——贵，且可能仍不够。',
    })
  }

  if (flags.plague_honesty) {
    lines.push({
      speaker: 'xun',
      text: '二、疾疫：你让名册说实话。可战者变少，调度却不再拿假人数去撞。示弱的笑会进江东营；活人留在你这边。',
    })
    lines.push({
      speaker: 'xun',
      text: '史句对照：已有疾病 / 大疫还军 / 烧船自退。你选了前半句进名册，而不是只留给事后书。',
    })
  } else {
    lines.push({
      speaker: 'xun',
      text: '二、疾疫：你让名册说谎。好看的编制上了江——咳也上了江。传染链与假满员同船。',
    })
    lines.push({
      speaker: 'xun',
      text: '史句对照：以疲病之卒，御狐疑之众。上半句你正在供货；下半句在降附里另计。',
    })
  }

  if (flags.loose_ships) {
    lines.push({
      speaker: 'cheng',
      text: '三、船阵：疏泊、砍缆、防火道。火难一网；指挥变难看，夜损与骂名已记账。',
    })
    lines.push({
      speaker: 'jia',
      text: '「难与持久」的双刃：你防火，也可能把战争拖进敌方更怕、更擅长熬的节奏。旁支从难看开始。',
    })
  } else {
    lines.push({
      speaker: 'cheng',
      text: '三、船阵：密泊相接，号令如营。别人眼里那句「可烧而走」，被你亲手摆好。省力是真的；靶标也是真的。',
    })
    lines.push({
      speaker: 'jia',
      text: '初战不利之后，整齐更像安慰，也更像柴堆。体验政治绑架过决策——战报照记。',
    })
  }

  if (flags.suspect_defection) {
    lines.push({
      speaker: 'jia',
      text: '四、来降：你把「恐诈」写成条令——射程外停泊、禁出营。火船难近；持久的牙与骂名同时咬。',
    })
    lines.push({
      speaker: 'cheng',
      text: '怕变成了距。密问只是心情；条令才是防。你付了扫兴的政治成本。',
    })
  } else {
    lines.push({
      speaker: 'jia',
      text: '四、来降：你把短利写成观降。许赏→期待→观验→失距。伸脖子的距离，就是火进来的距离。',
    })
    lines.push({
      speaker: 'cheng',
      text: '指言盖降。集体认知一旦形成，火与欢呼同向。史路很干净——干净往往致命。',
    })
  }

  if (!flags.loose_ships && !flags.suspect_defection) {
    lines.push({
      speaker: 'system',
      text: '【交叉】密泊 × 观降：失距烧的是整泊区。这是史实灰最常见的组合。',
    })
  }
  if (flags.loose_ships && flags.suspect_defection) {
    lines.push({
      speaker: 'system',
      text: '【交叉】疏泊 × 禁观：火攻期望下降，相持与骂名上升。苦持组合。',
    })
  }
  if (flags.plague_honesty && !flags.haste) {
    lines.push({
      speaker: 'system',
      text: '【交叉】实报 × 留抚：势最弱，数最真。摊牌余生的土壤。',
    })
  }
  if (!flags.plague_honesty && flags.haste) {
    lines.push({
      speaker: 'system',
      text: '【交叉】压报 × 赶日历：势最强，缝最薄。短利叠短利，利息叠利息。',
    })
  }

  if (costs.length) {
    lines.push({
      speaker: 'system',
      text: `【已付代价】${costs.join(' / ')}`,
    })
  }

  lines.push({
    speaker: 'soldier',
    text: '风盛。烟不是炊烟。后文见结局卷。',
  })

  lines.push({
    speaker: 'system',
    text: '结算：疾疫在前，泊距与观降决定火是否一次烧穿。风只负责最后一截——前面四笔是你签的。母题：绝对优势为什么会失效？',
  })

  return lines
}

export function pickEndingNodeId(flags: Flags): string {
  const chained = !flags.loose_ships
  const burnedTrap =
    chained &&
    flags.haste &&
    (!flags.plague_honesty || !flags.suspect_defection)

  if (burnedTrap) return 'E_BURN'

  if (flags.loose_ships && (flags.suspect_defection || flags.plague_honesty)) {
    return 'E_ESCAPE'
  }

  if (flags.plague_honesty && flags.suspect_defection && !flags.haste) {
    return 'E_HOLD'
  }

  if (!flags.loose_ships && !flags.haste && flags.suspect_defection) {
    return 'E_HOLD'
  }

  if (flags.loose_ships) return 'E_ESCAPE'

  return 'E_BURN'
}

export function resolveNextNodeId(
  _chapter: Chapter,
  state: SaveState,
  fromNode: SceneNode,
): string | null {
  if (fromNode.id === 'N07_report') return 'N08_route'
  if (fromNode.id === 'N08_route' || fromNode.id === 'ENDING_PICK') {
    return pickEndingNodeId(state.flags)
  }
  if (fromNode.next) return fromNode.next
  return null
}

export function getNode(chapter: Chapter, id: string): SceneNode {
  const node = chapter.nodes[id]
  if (!node) throw new Error(`Missing node: ${id}`)
  return node
}

export function currentLines(chapter: Chapter, state: SaveState): BubbleLine[] {
  const node = getNode(chapter, state.nodeId)
  if (node.kind === 'report') {
    return buildReportLines(state.flags, state.costs)
  }
  return [
    ...visibleLines(node, state.flags),
    ...filterLines(state.injectedLines, state.flags),
  ]
}

export function linesCaughtUp(chapter: Chapter, state: SaveState): boolean {
  const lines = currentLines(chapter, state)
  if (lines.length === 0) return true
  return state.lineIndex >= lines.length - 1
}

/** 决策台：有 prep，台词读完，尚未点拍板 */
export function canShowPrep(chapter: Chapter, state: SaveState): boolean {
  const node = getNode(chapter, state.nodeId)
  if (!node.prep?.length) return false
  if (state.readyToDecide) return false
  return linesCaughtUp(chapter, state)
}

export function canShowChoices(chapter: Chapter, state: SaveState): boolean {
  const node = getNode(chapter, state.nodeId)
  if (!node.choices?.length) return false
  if (node.kind === 'ending') return false
  if (node.prep?.length && !state.readyToDecide) return false
  return linesCaughtUp(chapter, state)
}

export function applyPrepAction(
  chapter: Chapter,
  state: SaveState,
  actionId: string,
): SaveState {
  const node = getNode(chapter, state.nodeId)
  const action = node.prep?.find((a) => a.id === actionId)
  if (!action) return state
  if (state.donePrep.includes(actionId)) return state

  const before = currentLines(chapter, state)
  const added = filterLines(action.lines, state.flags)
  if (added.length === 0) {
    const next: SaveState = {
      ...state,
      donePrep: [...state.donePrep, actionId],
      pendingRefIds: action.showRefs ?? [],
    }
    persistSave(next)
    return next
  }

  const next: SaveState = {
    ...state,
    donePrep: [...state.donePrep, actionId],
    injectedLines: [...state.injectedLines, ...action.lines],
    lineIndex: before.length,
    pendingRefIds: action.showRefs ?? [],
  }
  persistSave(next)
  return next
}

export function markReadyToDecide(state: SaveState): SaveState {
  const next: SaveState = { ...state, readyToDecide: true, pendingRefIds: [] }
  persistSave(next)
  return next
}

export function clearPendingRefs(state: SaveState): SaveState {
  if (!state.pendingRefIds.length) return state
  const next: SaveState = { ...state, pendingRefIds: [] }
  persistSave(next)
  return next
}

export function availablePrep(
  chapter: Chapter,
  state: SaveState,
): PrepAction[] {
  const node = getNode(chapter, state.nodeId)
  return (node.prep ?? []).filter((a) => !state.donePrep.includes(a.id))
}

export function advanceAfterChoice(
  _chapter: Chapter,
  state: SaveState,
  choice: Choice,
): SaveState {
  let next = applyEffects(state, choice.effects)
  next = {
    ...next,
    nodeId: choice.next,
    lineIndex: 0,
    ...clearDeskFields(),
  }
  persistSave(next)
  return next
}

export function advanceLineOrNode(
  chapter: Chapter,
  state: SaveState,
): SaveState {
  const node = getNode(chapter, state.nodeId)
  const lines = currentLines(chapter, state)

  if (state.lineIndex < lines.length - 1) {
    const next = { ...state, lineIndex: state.lineIndex + 1 }
    persistSave(next)
    return next
  }

  if (node.kind === 'ending') {
    const next: SaveState = {
      ...state,
      ended: true,
      endingId: node.endingId,
      lineIndex: Math.max(0, lines.length - 1),
    }
    persistSave(next)
    return next
  }

  if (node.prep?.length && !state.readyToDecide) {
    return state
  }

  if (node.choices?.length) {
    return state
  }

  const nextId = resolveNextNodeId(chapter, state, node)
  if (!nextId) return state

  const next: SaveState = {
    ...state,
    nodeId: nextId,
    lineIndex: 0,
    ...clearDeskFields(),
  }
  persistSave(next)
  return next
}

export { redCliffsEve }
