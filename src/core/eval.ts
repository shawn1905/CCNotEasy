/* ==========================================================================
   CCNotEasy Pure Evaluator & Effect Applier (Strict Equality, Zero Side Effects)
   ========================================================================== */

import type {
  ChapterBundle,
  CompareOp,
  Condition,
  Effect,
  NextSpec,
  SaveState,
} from './schema.ts'

function compare(actual: number | boolean | string | undefined, op: CompareOp, expected: number | boolean | string): boolean {
  if (actual === undefined) return false
  switch (op) {
    case '==':
      return actual === expected
    case '!=':
      return actual !== expected
    case '>=':
      return typeof actual === 'number' && typeof expected === 'number' && actual >= expected
    case '<=':
      return typeof actual === 'number' && typeof expected === 'number' && actual <= expected
    case '>':
      return typeof actual === 'number' && typeof expected === 'number' && actual > expected
    case '<':
      return typeof actual === 'number' && typeof expected === 'number' && actual < expected
  }
}

export function evalCondition(cond: Condition | undefined, state: SaveState): boolean {
  if (!cond) return true
  if ('all' in cond) return cond.all.every((c) => evalCondition(c, state))
  if ('any' in cond) return cond.any.some((c) => evalCondition(c, state))
  if ('not' in cond) return !evalCondition(cond.not, state)
  if ('visited' in cond) return state.visitedNodes.includes(cond.visited)
  if ('hasClue' in cond) return state.clues.includes(cond.hasClue)
  if ('var' in cond) return compare(state.vars[cond.var], cond.op, cond.value)
  if ('resource' in cond) return compare(state.resources[cond.resource], cond.op, cond.value)
  if ('deadline' in cond) return compare(state.deadlines[cond.deadline], cond.op, cond.value)
  return false
}

export function resolveNext(nextSpec: NextSpec | undefined, state: SaveState): string | null {
  if (!nextSpec) return null
  if (typeof nextSpec === 'string') return nextSpec
  for (const rule of nextSpec) {
    if (evalCondition(rule.when, state)) {
      return rule.next
    }
  }
  return null
}

export interface SettlementEvent {
  badges: string[]
  reasons: string[]
  deltas: Record<string, number>
}

export interface WarningEvent {
  kind: 'resource' | 'deadline'
  id: string
  label: string
  text: string
}

export interface ApplyEffectsResult {
  state: SaveState
  settlement: SettlementEvent | null
  warnings: WarningEvent[]
  collapseEndingId: string | null
  overflowEndingId: string | null
}

export function applyEffects(
  bundle: ChapterBundle,
  prev: SaveState,
  effects: Effect[] | undefined,
  opts?: { safeFloor?: boolean },
): ApplyEffectsResult {
  if (!effects || effects.length === 0) {
    return { state: prev, settlement: null, warnings: [], collapseEndingId: null, overflowEndingId: null }
  }

  const next: SaveState = {
    ...prev,
    resources: { ...prev.resources },
    deadlines: { ...prev.deadlines },
    vars: { ...prev.vars },
    clues: [...prev.clues],
    pendingDebts: [...prev.pendingDebts],
    dirtyTricks: [...prev.dirtyTricks],
    warnedKeys: [...prev.warnedKeys],
    fakeBadge: { ...prev.fakeBadge },
  }

  const badges: string[] = []
  const reasons: string[] = []
  const deltas: Record<string, number> = {}
  const warnings: WarningEvent[] = []

  const resMap = new Map(bundle.resources.map((r) => [r.id, r]))
  const dlMap = new Map(bundle.deadlines.map((d) => [d.id, d]))

  for (const eff of effects) {
    switch (eff.kind) {
      case 'var_set': {
        next.vars[eff.var] = eff.value
        break
      }
      case 'var_add': {
        const cur = next.vars[eff.var]
        const base = typeof cur === 'number' ? cur : 0
        const spec = bundle.varsSchema[eff.var]
        let val = base + eff.delta
        if (spec?.min !== undefined) val = Math.max(spec.min, val)
        if (spec?.max !== undefined) val = Math.min(spec.max, val)
        next.vars[eff.var] = val
        break
      }
      case 'resource': {
        const spec = resMap.get(eff.resource)
        const cur = next.resources[eff.resource] ?? 0
        const floor = opts?.safeFloor ? Math.max(1, spec?.collapseAt ?? 0) : 0
        const max = spec?.max ?? 10
        next.resources[eff.resource] = Math.max(floor, Math.min(max, cur + eff.delta))
        deltas[eff.resource] = (deltas[eff.resource] ?? 0) + eff.delta
        const sign = eff.delta > 0 ? `+${eff.delta}` : String(eff.delta)
        badges.push(`${spec?.label ?? eff.resource} ${sign}`)
        if (eff.reason && !reasons.includes(eff.reason)) reasons.push(eff.reason)
        break
      }
      case 'deadline': {
        const spec = dlMap.get(eff.deadline)
        const cur = next.deadlines[eff.deadline] ?? 0
        const max = spec?.max ?? 6
        next.deadlines[eff.deadline] = Math.max(0, Math.min(max, cur + eff.delta))
        const sign = eff.delta > 0 ? `+${eff.delta}` : String(eff.delta)
        badges.push(`${spec?.label ?? eff.deadline} ${sign}`)
        if (eff.reason && !reasons.includes(eff.reason)) reasons.push(eff.reason)
        break
      }
      case 'clue': {
        if (!next.clues.includes(eff.clueId)) next.clues.push(eff.clueId)
        break
      }
      case 'debt': {
        if (!next.pendingDebts.some((d) => d.id === eff.debt.id)) {
          next.pendingDebts.push(eff.debt)
        }
        break
      }
      case 'dirty_trick': {
        if (!next.dirtyTricks.some((t) => t.id === eff.id)) {
          next.dirtyTricks.push({ id: eff.id, label: eff.label, interest: eff.interest })
        }
        break
      }
      case 'fake_badge': {
        next.fakeBadge = { show: eff.show, label: eff.label ?? next.fakeBadge.label }
        break
      }
    }
  }

  // Evaluate resource thresholds & collapse
  const collapsedIds: string[] = []
  for (const spec of bundle.resources) {
    const val = next.resources[spec.id] ?? 0
    const warnKey = `res:${spec.id}`
    if (val <= spec.collapseAt) {
      collapsedIds.push(spec.id)
    } else if (val <= spec.warnAt && !next.warnedKeys.includes(warnKey)) {
      next.warnedKeys.push(warnKey)
      warnings.push({ kind: 'resource', id: spec.id, label: `${spec.label}告急 (余 ${val})`, text: spec.warnText })
    } else if (val > spec.warnAt && next.warnedKeys.includes(warnKey)) {
      next.warnedKeys = next.warnedKeys.filter((k) => k !== warnKey)
    }
  }

  let collapseEndingId: string | null = null
  if (!next.finished && collapsedIds.length > 0) {
    if (collapsedIds.length > 1 && bundle.multiCollapseEndingId) {
      collapseEndingId = bundle.multiCollapseEndingId
    } else {
      const firstSpec = resMap.get(collapsedIds[0]!)
      collapseEndingId = firstSpec?.collapseEndingId ?? bundle.multiCollapseEndingId ?? null
    }
  }

  // Evaluate deadline warnings & overflow
  let overflowEndingId: string | null = null
  for (const spec of bundle.deadlines) {
    const val = next.deadlines[spec.id] ?? 0
    const warnKey = `dl:${spec.id}`
    if (!next.finished && val >= spec.max) {
      overflowEndingId = spec.overflowEndingId
    } else if (val >= spec.warnAt && !next.warnedKeys.includes(warnKey)) {
      next.warnedKeys.push(warnKey)
      warnings.push({ kind: 'deadline', id: spec.id, label: `${spec.label}逼近 (${val}/${spec.max})`, text: spec.warnText })
    }
  }

  const settlement = badges.length > 0 || reasons.length > 0 ? { badges, reasons, deltas } : null

  return { state: next, settlement, warnings, collapseEndingId, overflowEndingId }
}
