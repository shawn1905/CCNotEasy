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

const STORAGE_KEY = 'ccne-red-cliffs-eve-v1'

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
      text: '【战报】建安十三年冬 · 长江赤壁一带',
    },
  ]

  if (flags.loose_ships) {
    lines.push({
      speaker: 'cheng',
      text: '船阵：外圈留活扣。火起时，一部分船还能砍链侧滑——代价是今夜吐得更凶，队形也散。',
    })
  } else {
    lines.push({
      speaker: 'cheng',
      text: '船阵：连锁焊死。风平浪静时像水上城寨；东南风一起，城寨就是干柴。',
    })
  }

  if (flags.plague_honesty) {
    lines.push({
      speaker: 'xun',
      text: '疾疫：实数上账，药船先行。编制缩了，但还能动的人是真的还能动。',
    })
  } else {
    lines.push({
      speaker: 'xun',
      text: '疾疫：虚报维持。纸面满员，江上却有人咳着被派去堵口——缺口会在最不该出现的时候出现。',
    })
  }

  if (flags.suspect_defection) {
    lines.push({
      speaker: 'jia',
      text: '降将：扣在外港。火船想贴核心，多过了一道门。门窄，你也慢了半拍。',
    })
  } else {
    lines.push({
      speaker: 'jia',
      text: '降将：收入营中。情报来得快，门也开得大——快与险，是同一枚铜板。',
    })
  }

  if (flags.haste) {
    lines.push({
      speaker: 'cao',
      text: '节奏：抢了窗口。刀出鞘了，回鞘的时间变短。',
    })
  } else {
    lines.push({
      speaker: 'cao',
      text: '节奏：留了一昼夜。气还在，主动权却可能已经易手。',
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
    text: '火与风不问动机。它们只问：你的链、你的门、你的名册、你的脚步——哪一环先断。',
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
