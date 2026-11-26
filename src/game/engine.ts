import { redCliffsEve } from './content/redCliffsEve'
import type {
  BubbleLine,
  Chapter,
  Choice,
  Effect,
  FlagName,
  Flags,
  SceneNode,
} from './types'

const STORAGE_KEY = 'ccne-red-cliffs-eve-v3'

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
}

export function createInitialState(chapter: Chapter = redCliffsEve): SaveState {
  return {
    nodeId: chapter.start,
    lineIndex: 0,
    flags: { ...DEFAULT_FLAGS },
    costs: [],
    seenGloss: [],
    ended: false,
  }
}

export function loadSave(): SaveState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SaveState
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
  ]

  if (flags.haste) {
    lines.push({
      speaker: 'cheng',
      text: '日历：江陵东下优先。更始与舰籍未齐即序次前送；胁降时效保住，降附整合与筛疫偏欠。',
    })
  } else {
    lines.push({
      speaker: 'cheng',
      text: '日历：江陵留抚优先。侯籍、舰籍、隔离尚有安排；会猎窗口让出一部分给敌方备战。',
    })
  }

  if (flags.plague_honesty) {
    lines.push({
      speaker: 'xun',
      text: '疾疫：实数入册，减役催药。可战卒少于话术；遇敌时「已有疾病」至少被己方承认过。',
    })
  } else {
    lines.push({
      speaker: 'xun',
      text: '疾疫：压报满员。编制好看；病卒仍上橹。对岸若有细作，其见闻将严于我名册。',
    })
  }

  if (flags.loose_ships) {
    lines.push({
      speaker: 'cheng',
      text: '船阵：疏泊分屯，留砍缆与防火道。火攻难以一网；夜惊、浪损、号令变慢已入账。',
    })
  } else {
    lines.push({
      speaker: 'cheng',
      text: '船阵：密泊相接，号令如营。北军上下便利；若被观察为「首尾相接」，可烧前提成立。',
    })
  }

  if (flags.suspect_defection) {
    lines.push({
      speaker: 'jia',
      text: '来降：扣使、外泊、禁出营。「但恐汝诈」落到了条令上；持久风险上升，火船贴心难度上升。',
    })
  } else {
    lines.push({
      speaker: 'jia',
      text: '来降：接洽、许赏、观验。短利是拆敌与速决；吏士延颈（乃至出营立观）使火入距离变短。',
    })
  }

  if (costs.length) {
    lines.push({
      speaker: 'system',
      text: `【已付代价】${costs.join(' / ')}`,
    })
  }

  lines.push({
    speaker: 'system',
    text: '结算句：疾疫在前，船阵与观降决定火是否一次烧穿。风只负责最后一截。',
  })

  return lines
}

/**
 * Ending router (from script annotations):
 * - burn: chained + hasty + (dishonest plague OR trusted defector)
 * - escape: loose ships + (suspect OR honest) — can cut and run
 * - hold: otherwise, especially honesty + suspect without full haste trap
 */
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
  }
  persistSave(next)
  return next
}

export function advanceLineOrNode(
  chapter: Chapter,
  state: SaveState,
): SaveState {
  const node = getNode(chapter, state.nodeId)
  const lines =
    node.kind === 'report'
      ? buildReportLines(state.flags, state.costs)
      : visibleLines(node, state.flags)

  if (state.lineIndex < lines.length - 1) {
    const next = { ...state, lineIndex: state.lineIndex + 1 }
    persistSave(next)
    return next
  }

  // finished lines
  if (node.kind === 'ending') {
    const next: SaveState = {
      ...state,
      ended: true,
      endingId: node.endingId,
      lineIndex: lines.length - 1,
    }
    persistSave(next)
    return next
  }

  if (node.choices?.length) {
    // stay; UI shows choices
    return state
  }

  const nextId = resolveNextNodeId(chapter, state, node)
  if (!nextId) return state

  const next: SaveState = {
    ...state,
    nodeId: nextId,
    lineIndex: 0,
  }
  persistSave(next)
  return next
}

export function currentLines(chapter: Chapter, state: SaveState): BubbleLine[] {
  const node = getNode(chapter, state.nodeId)
  if (node.kind === 'report') {
    return buildReportLines(state.flags, state.costs)
  }
  return visibleLines(node, state.flags)
}

export function canShowChoices(chapter: Chapter, state: SaveState): boolean {
  const node = getNode(chapter, state.nodeId)
  if (!node.choices?.length) return false
  if (node.kind === 'ending') return false
  const lines = currentLines(chapter, state)
  return state.lineIndex >= lines.length - 1
}

export { redCliffsEve }
