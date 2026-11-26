/* ==========================================================================
   CCNotEasy Core Schema (Pure Data, Zero React/DOM, Strict TypeScript)
   Shared across Vite UI, Node CLI validator, and Community StoryPacks.
   ========================================================================== */

export const SCHEMA_VERSION = 1 as const

export type Mood = 'calm' | 'tense' | 'cold' | 'fire'
export type Tone = 'neutral' | 'info' | 'warn' | 'danger' | 'ok' | 'fire'
export type BubbleSide = 'left' | 'right' | 'center'

export interface ChapterTheme {
  /** Curated theme preset key (applied via data-theme on ThemeShell, never raw :root mutation) */
  preset: 'red-cliffs' | 'tokyo-night' | 'guandu-frost' | (string & {})
  name: string
  /** Logical filename under public/themes/<themeDir>/ (validated, no arbitrary URL injection) */
  themeDir: string
  bgFile: string
  bgOpacity?: number
  bgmFile: string
  bgmOrigFile?: string
  bgmLabel: string
  moodRates?: Partial<Record<Mood, number>>
}

export interface VarSpec {
  type: 'number' | 'boolean' | 'string'
  initial: number | boolean | string
  min?: number
  max?: number
  description?: string
}

export interface ResourceSpec {
  id: string
  label: string
  initial: number
  max: number
  warnAt: number
  collapseAt: number
  collapseEndingId: string
  warnText: string
  redlineDesc: string
}

export interface DeadlineSpec {
  id: string
  label: string
  initial: number
  max: number
  warnAt: number
  overflowEndingId: string
  warnText: string
}

export interface CastMember {
  id: string
  name: string
  role?: string
  side: BubbleSide
  tone?: Tone
}

export type CompareOp = '==' | '!=' | '>=' | '<=' | '>' | '<'

export type Condition =
  | { var: string; op: CompareOp; value: number | boolean | string }
  | { resource: string; op: CompareOp; value: number }
  | { deadline: string; op: CompareOp; value: number }
  | { visited: string }
  | { hasClue: string }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }

export interface PendingDebt {
  id: string
  dueAt: string
  label: string
  text: string
  effects?: Effect[]
}

export type Effect =
  | { kind: 'var_set'; var: string; value: number | boolean | string }
  | { kind: 'var_add'; var: string; delta: number }
  | { kind: 'resource'; resource: string; delta: number; reason: string }
  | { kind: 'deadline'; deadline: string; delta: number; reason: string }
  | { kind: 'clue'; clueId: string; label?: string }
  | { kind: 'debt'; debt: PendingDebt }
  | { kind: 'dirty_trick'; id: string; label: string; interest: string }
  | { kind: 'fake_badge'; show: boolean; label?: string }

export interface BranchRule {
  when?: Condition
  next: string
}

export type NextSpec = string | BranchRule[]

export interface BubbleLine {
  speaker: string
  roleOverride?: string
  sideOverride?: BubbleSide
  tone?: Tone
  sourceTag?: '史载' | '拟写' | '推演' | '注' | '结语' | '暗忖'
  /** Frameless serif background typography for outdoor patrol / observation */
  isWalk?: boolean
  walkKicker?: string
  clues?: { id: string; label: string }[]
  text: string
  when?: Condition
  effects?: Effect[]
}

export interface Choice {
  id: string
  label: string
  hint?: string
  isBait?: boolean
  stampKind?: 'approve' | 'reject' | 'dirty'
  stampText?: string
  interestNote?: string
  replyText?: string
  when?: Condition
  effects?: Effect[]
  next: NextSpec
}

export interface WordsmithSlot {
  id: string
  label: string
  options: {
    id: string
    text: string
    reaction?: string
    effects?: Effect[]
  }[]
}

export interface CounterClaim {
  id: string
  surface: string
  proof: string
  requiredClueId?: string
  effects?: Effect[]
}

export interface PrepAction {
  id: string
  kind: 'walk' | 'ask' | 'read'
  label: string
  hint?: string
  when?: Condition
  lines: BubbleLine[]
  showRefs?: string[]
  effects?: Effect[]
}

export type InteractionBlock =
  | {
      type: 'wordsmith'
      title: string
      prompt: string
      template: string
      slots: WordsmithSlot[]
      confirmLabel?: string
    }
  | {
      type: 'counter_case'
      title: string
      docTitle: string
      prompt: string
      minExpose?: number
      claims: CounterClaim[]
      confirmLabel?: string
    }
  | {
      type: 'prep_desk'
      actions: PrepAction[]
    }

export interface GlossEntry {
  id: string
  term: string
  plain: string
  source?: string
}

export interface SubtextEntry {
  id: string
  surface: string
  decode: string
  note?: string
}

export interface ReferenceCard {
  id: string
  title: string
  plain: string
  quote: string
  source: string
  leans: 'A' | 'B' | 'both'
  layer: 'A' | 'B' | 'C'
  topic?: string
}

export interface ReportSection {
  id: string
  title: string
  cases: {
    when?: Condition
    text: string
    tone?: Tone
    effects?: Effect[]
  }[]
}

export interface DossierCheck {
  title: string
  when: Condition
  canonNote: string
  playerHit: string
  playerMiss: string
  source?: string
}

export interface SceneNode {
  id: string
  act?: string
  title?: string
  kind: 'scene' | 'report' | 'ending'
  mood?: Mood
  lines: BubbleLine[]
  interaction?: InteractionBlock
  choices?: Choice[]
  refs?: string[]
  next?: NextSpec
  /** For kind === 'report' */
  reportSections?: ReportSection[]
  /** For kind === 'ending' */
  ending?: {
    badge: string
    title: string
    subtitle: string
    tone: Tone
    isCollapse?: boolean
    isDeadlineOverflow?: boolean
    verdict: string
    careerSeed?: string
    buildName?: string
    buildQuote?: string
  }
}

export interface ChapterBundle {
  schemaVersion: typeof SCHEMA_VERSION
  id: string
  version: string
  title: string
  subtitle: string
  tagline: string
  estimatedMinutes: number
  theme: ChapterTheme
  cast: Record<string, CastMember>
  varsSchema: Record<string, VarSpec>
  resources: ResourceSpec[]
  multiCollapseEndingId?: string
  deadlines: DeadlineSpec[]
  startNode: string
  acts: { id: string; num: string; title: string; startNode: string }[]
  nodes: Record<string, SceneNode>
  gloss: Record<string, GlossEntry>
  subtexts: Record<string, SubtextEntry>
  refs: Record<string, ReferenceCard>
  historyDossier: DossierCheck[]
}

export interface ChoiceRecord {
  nodeId: string
  act: string
  choiceId: string
  label: string
  stampKind?: 'approve' | 'reject' | 'dirty'
  reasons: string[]
}

export interface ChapterSnapshot {
  actId: string
  nodeId: string
  resources: Record<string, number>
  deadlines: Record<string, number>
  vars: Record<string, number | boolean | string>
  clues: string[]
  choiceLog: ChoiceRecord[]
}

export interface SaveState {
  schemaVersion: typeof SCHEMA_VERSION
  chapterId: string
  chapterVersion: string
  nodeId: string
  lineIndex: number
  mood: Mood
  resources: Record<string, number>
  deadlines: Record<string, number>
  vars: Record<string, number | boolean | string>
  visitedNodes: string[]
  doneActions: string[]
  clues: string[]
  pendingDebts: PendingDebt[]
  dirtyTricks: { id: string; label: string; interest: string }[]
  choiceLog: ChoiceRecord[]
  warnedKeys: string[]
  fakeBadge: { show: boolean; label: string }
  unlockedGloss: string[]
  decodedSubtexts: string[]
  discoveredEndings: string[]
  snapshots: Record<string, ChapterSnapshot>
  finished: boolean
  endingNodeId: string | null
  savedAt: number
}

/** Portable cross-chapter continuation summary exported at chapter end */
export interface EndingCarryover {
  schemaVersion: typeof SCHEMA_VERSION
  chapterId: string
  chapterVersion: string
  endingNodeId: string
  resources: Record<string, number>
  vars: Record<string, number | boolean | string>
  dirtyTricks: string[]
  choiceLog: ChoiceRecord[]
  exportedAt: number
}
