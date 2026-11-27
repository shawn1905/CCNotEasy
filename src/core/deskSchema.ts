/* ==========================================================================
   CCNotEasy Dynamic Desk Survival Mode Schema (Pure Data, Zero React/DOM)
   Supports: Daily Advisor Duty, Conditional Case Deck, Active Orders,
   Emergent Combos, and Timed High-Interest Debts.
   ========================================================================== */

import type { ChapterTheme, Mood } from './schema.ts'

export type DeskResourceId = 'grain' | 'troops' | 'morale'

export interface DeskResourceSpec {
  id: DeskResourceId
  label: string
  initial: number
  max: number
  warnAt: number
  collapseAt: number
  collapseTitle: string
  collapseDesc: string
}

export interface DeskDeadlineSpec {
  id: string
  label: string
  initial: number
  max: number
  warnAt: number
  overflowTitle: string
  overflowDesc: string
}

export interface DeskDelta {
  grain?: number
  troops?: number
  morale?: number
  deadline?: number
  reason: string
}

export interface DeskDebtSpec {
  id: string
  label: string
  delayDays: number
  triggerText: string
  delta: DeskDelta
}

export interface DeskActiveDebt {
  uid: string
  specId: string
  label: string
  dueDay: number
  triggerText: string
  delta: DeskDelta
}

export interface DeskCondition {
  minDay?: number
  maxDay?: number
  maxGrain?: number
  minGrain?: number
  maxTroops?: number
  minTroops?: number
  maxMorale?: number
  minMorale?: number
  minDeadline?: number
  hasTag?: string
  hasDebt?: boolean
}

export interface DeskAdvisor {
  id: string
  name: string
  title: string
  perkTitle: string
  perkDesc: string
  costNote: string
  /** Immediate daily effect when put on duty */
  onDutyDelta?: DeskDelta
  /** Auto-expose first claim on every case today */
  autoExposeFirst?: boolean
  /** Extra bonus when using dirty stamp today */
  dirtyBonusDelta?: DeskDelta
  /** Extra bonus when using reject stamp today */
  rejectBonusDelta?: DeskDelta
  /** Extra bonus when using approve stamp today */
  approveBonusDelta?: DeskDelta
  /** Delays all currently pending debts by N days */
  delayDebtsBy?: number
}

export interface DeskOrder {
  id: string
  name: string
  subtitle: string
  cooldownDays: number
  stampText: string
  delta: DeskDelta
  debt?: DeskDebtSpec
  /** If true, removes the earliest pending debt instead of adding one */
  cancelEarliestDebt?: boolean
  tag: string
}

export interface DeskCombo {
  id: string
  name: string
  quote: string
  triggerOrderId: DeskOrder['id']
  requiresRecentTag?: string
  requiresActiveDebt?: boolean
  requiresCaseCategory?: DeskCaseCategory
  bonusDelta: DeskDelta
  extraDebt?: DeskDebtSpec
}

export type DeskCaseCategory = 'routine' | 'crisis' | 'backlash' | 'opportunity'

export interface DeskCaseClaim {
  id: string
  surface: string
  proof: string
  /** Optional small reward for exposing this contradiction */
  exposeDelta?: DeskDelta
}

export interface DeskCaseChoice {
  id: string
  label: string
  stampKind: 'approve' | 'reject' | 'dirty'
  stampText: string
  hint: string
  interestNote?: string
  replyText: string
  /** Requires all claims exposed before unlocking */
  requiresExposed?: boolean
  delta: DeskDelta
  debt?: DeskDebtSpec
  addTag?: string
}

export interface DeskCaseCard {
  id: string
  category: DeskCaseCategory
  title: string
  sender: string
  senderRole: string
  docTitle: string
  brief: string
  weight: number
  when?: DeskCondition
  claims: DeskCaseClaim[]
  choices: DeskCaseChoice[]
}

export interface DeskPack {
  id: string
  title: string
  subtitle: string
  tagline: string
  difficultyLabel: string
  targetDays: number
  casesPerDay: number
  /** Day from which daily rent escalates (both deadline +1 and even-day grain -1) */
  escalateDay?: number
  theme: ChapterTheme
  resources: DeskResourceSpec[]
  deadline: DeskDeadlineSpec
  advisors: DeskAdvisor[]
  orders: DeskOrder[]
  combos: DeskCombo[]
  cases: DeskCaseCard[]
}

export interface DeskLogEntry {
  id: string
  day: number
  kind: 'day' | 'advisor' | 'case' | 'order' | 'combo' | 'debt' | 'rent' | 'warn'
  badge: string
  text: string
  warn?: boolean
}

export type DeskPhase = 'pick_advisor' | 'desk_case' | 'day_summary' | 'ended'

export interface DeskEndingSummary {
  victory: boolean
  daysSurvived: number
  title: string
  subtitle: string
  buildName: string
  buildQuote: string
  verdict: string
}

export interface DeskState {
  packId: string
  day: number
  phase: DeskPhase
  mood: Mood
  resources: Record<DeskResourceId, number>
  deadline: number
  advisorId: DeskAdvisor['id'] | null
  lastAdvisorId: DeskAdvisor['id'] | null
  todayCaseIds: string[]
  caseIndex: number
  exposedClaimIds: string[]
  orderUsedToday: boolean
  orderCooldowns: Record<string, number>
  pendingDebts: DeskActiveDebt[]
  tags: string[]
  recentOrderTags: { tag: string; day: number }[]
  seenCaseIds: string[]
  combosTriggered: { id: string; name: string; day: number }[]
  dirtyCount: number
  casesHandled: number
  debtsCancelled: number
  debtsPaid: number
  logs: DeskLogEntry[]
  ending: DeskEndingSummary | null
  endless: boolean
  seed: number
}

export interface DeskBestRecord {
  bestDay: number
  victories: number
  runs: number
  discoveredCombos: string[]
}
