/* ==========================================================================
   CCNotEasy Pure State Machine Reducer (Zero localStorage / DOM Side Effects)
   ========================================================================== */

import { applyEffects, evalCondition, resolveNext } from './eval.ts'
import type { SettlementEvent, WarningEvent } from './eval.ts'
import { SCHEMA_VERSION } from './schema.ts'
import type { BubbleLine, ChapterBundle, Choice, Effect, SaveState, SceneNode } from './schema.ts'

export type GameEvent =
  | { type: 'settlement'; settlement: SettlementEvent }
  | { type: 'warning'; warning: WarningEvent }
  | { type: 'debt_triggered'; label: string; text: string }
  | { type: 'ending_entered'; endingNodeId: string }

export type GameAction =
  | { type: 'ADVANCE_LINE' }
  | { type: 'RUN_PREP'; actionId: string }
  | { type: 'APPLY_WIDGET_EFFECTS'; effects: Effect[] }
  | { type: 'CHOOSE'; choiceId: string }
  | { type: 'UNLOCK_GLOSS'; glossId: string }
  | { type: 'DECODE_SUBTEXT'; subtextId: string }
  | { type: 'JUMP_ACT'; actId: string }
  | { type: 'RESET' }

export function createInitialSave(bundle: ChapterBundle, preserveMeta?: Partial<Pick<SaveState, 'discoveredEndings' | 'unlockedGloss' | 'decodedSubtexts'>>): SaveState {
  const resources: Record<string, number> = {}
  for (const r of bundle.resources) resources[r.id] = r.initial

  const deadlines: Record<string, number> = {}
  for (const d of bundle.deadlines) deadlines[d.id] = d.initial

  const vars: Record<string, number | boolean | string> = {}
  for (const [k, spec] of Object.entries(bundle.varsSchema)) vars[k] = spec.initial

  const startNode = bundle.nodes[bundle.startNode]

  return {
    schemaVersion: SCHEMA_VERSION,
    chapterId: bundle.id,
    chapterVersion: bundle.version,
    nodeId: bundle.startNode,
    lineIndex: 0,
    mood: startNode?.mood ?? 'calm',
    resources,
    deadlines,
    vars,
    visitedNodes: [bundle.startNode],
    doneActions: [],
    clues: [],
    pendingDebts: [],
    dirtyTricks: [],
    choiceLog: [],
    warnedKeys: [],
    fakeBadge: { show: false, label: '号八十万' },
    unlockedGloss: preserveMeta?.unlockedGloss ? [...preserveMeta.unlockedGloss] : [],
    decodedSubtexts: preserveMeta?.decodedSubtexts ? [...preserveMeta.decodedSubtexts] : [],
    discoveredEndings: preserveMeta?.discoveredEndings ? [...preserveMeta.discoveredEndings] : [],
    snapshots: {},
    finished: startNode?.kind === 'ending',
    endingNodeId: startNode?.kind === 'ending' ? bundle.startNode : null,
    savedAt: Date.now(),
  }
}

export function getVisibleLines(node: SceneNode, state: SaveState): BubbleLine[] {
  return node.lines.filter((l) => evalCondition(l.when, state))
}

export function getVisibleChoices(node: SceneNode, state: SaveState): Choice[] {
  return (node.choices ?? []).filter((c) => evalCondition(c.when, state))
}

function enterNode(bundle: ChapterBundle, prev: SaveState, targetNodeId: string): { save: SaveState; events: GameEvent[] } {
  const node = bundle.nodes[targetNodeId]
  if (!node) return { save: prev, events: [] }

  const events: GameEvent[] = []
  let save: SaveState = {
    ...prev,
    nodeId: targetNodeId,
    lineIndex: 0,
    mood: node.mood ?? prev.mood,
    visitedNodes: prev.visitedNodes.includes(targetNodeId) ? prev.visitedNodes : [...prev.visitedNodes, targetNodeId],
    savedAt: Date.now(),
  }

  // Record act snapshot if entering an act startNode
  const matchingAct = bundle.acts.find((a) => a.startNode === targetNodeId)
  if (matchingAct && !save.snapshots[matchingAct.id]) {
    save = {
      ...save,
      snapshots: {
        ...save.snapshots,
        [matchingAct.id]: {
          actId: matchingAct.id,
          nodeId: targetNodeId,
          resources: { ...save.resources },
          deadlines: { ...save.deadlines },
          vars: { ...save.vars },
          clues: [...save.clues],
          choiceLog: [...save.choiceLog],
        },
      },
    }
  }

  // Settle any checkpoint debts due at this node (with safeFloor = true so transitions never silently kill!)
  const dueDebts = save.pendingDebts.filter((d) => d.dueAt === targetNodeId)
  if (dueDebts.length > 0) {
    save = { ...save, pendingDebts: save.pendingDebts.filter((d) => d.dueAt !== targetNodeId) }
    for (const debt of dueDebts) {
      events.push({ type: 'debt_triggered', label: debt.label, text: debt.text })
      if (debt.effects && debt.effects.length > 0) {
        const res = applyEffects(bundle, save, debt.effects, { safeFloor: true })
        save = res.state
        if (res.settlement) events.push({ type: 'settlement', settlement: res.settlement })
        for (const w of res.warnings) events.push({ type: 'warning', warning: w })
      }
    }
  }

  if (node.kind === 'ending') {
    const discovered = save.discoveredEndings.includes(targetNodeId)
      ? save.discoveredEndings
      : [...save.discoveredEndings, targetNodeId]
    save = {
      ...save,
      finished: true,
      endingNodeId: targetNodeId,
      discoveredEndings: discovered,
    }
    events.push({ type: 'ending_entered', endingNodeId: targetNodeId })
  }

  return { save, events }
}

export function reduceGame(bundle: ChapterBundle, prev: SaveState, action: GameAction): { save: SaveState; events: GameEvent[] } {
  switch (action.type) {
    case 'RESET':
      return {
        save: createInitialSave(bundle, {
          discoveredEndings: prev.discoveredEndings,
          unlockedGloss: prev.unlockedGloss,
          decodedSubtexts: prev.decodedSubtexts,
        }),
        events: [],
      }

    case 'UNLOCK_GLOSS': {
      if (prev.unlockedGloss.includes(action.glossId)) return { save: prev, events: [] }
      return { save: { ...prev, unlockedGloss: [...prev.unlockedGloss, action.glossId], savedAt: Date.now() }, events: [] }
    }

    case 'DECODE_SUBTEXT': {
      if (prev.decodedSubtexts.includes(action.subtextId)) return { save: prev, events: [] }
      return { save: { ...prev, decodedSubtexts: [...prev.decodedSubtexts, action.subtextId], savedAt: Date.now() }, events: [] }
    }

    case 'JUMP_ACT': {
      const snap = prev.snapshots[action.actId]
      const act = bundle.acts.find((a) => a.id === action.actId)
      if (!act) return { save: prev, events: [] }
      const base = createInitialSave(bundle, {
        discoveredEndings: prev.discoveredEndings,
        unlockedGloss: prev.unlockedGloss,
        decodedSubtexts: prev.decodedSubtexts,
      })
      const restored: SaveState = snap
        ? {
            ...base,
            resources: { ...snap.resources },
            deadlines: { ...snap.deadlines },
            vars: { ...snap.vars },
            clues: [...snap.clues],
            choiceLog: [...snap.choiceLog],
            snapshots: { ...prev.snapshots },
          }
        : { ...base, snapshots: { ...prev.snapshots } }
      return enterNode(bundle, restored, act.startNode)
    }

    case 'APPLY_WIDGET_EFFECTS': {
      const res = applyEffects(bundle, prev, action.effects)
      const events: GameEvent[] = []
      if (res.settlement) events.push({ type: 'settlement', settlement: res.settlement })
      for (const w of res.warnings) events.push({ type: 'warning', warning: w })
      if (res.collapseEndingId) {
        const end = enterNode(bundle, res.state, res.collapseEndingId)
        return { save: end.save, events: [...events, ...end.events] }
      }
      if (res.overflowEndingId) {
        const end = enterNode(bundle, res.state, res.overflowEndingId)
        return { save: end.save, events: [...events, ...end.events] }
      }
      return { save: { ...res.state, savedAt: Date.now() }, events }
    }

    case 'RUN_PREP': {
      const node = bundle.nodes[prev.nodeId]
      if (!node || node.interaction?.type !== 'prep_desk') return { save: prev, events: [] }
      const prepAct = node.interaction.actions.find((a) => a.id === action.actionId)
      if (!prepAct || prev.doneActions.includes(prepAct.id)) return { save: prev, events: [] }

      let save: SaveState = { ...prev, doneActions: [...prev.doneActions, prepAct.id], savedAt: Date.now() }
      const events: GameEvent[] = []
      if (prepAct.effects && prepAct.effects.length > 0) {
        const res = applyEffects(bundle, save, prepAct.effects)
        save = res.state
        if (res.settlement) events.push({ type: 'settlement', settlement: res.settlement })
        for (const w of res.warnings) events.push({ type: 'warning', warning: w })
        if (res.collapseEndingId) {
          const end = enterNode(bundle, save, res.collapseEndingId)
          return { save: end.save, events: [...events, ...end.events] }
        }
        if (res.overflowEndingId) {
          const end = enterNode(bundle, save, res.overflowEndingId)
          return { save: end.save, events: [...events, ...end.events] }
        }
      }
      return { save, events }
    }

    case 'ADVANCE_LINE': {
      const node = bundle.nodes[prev.nodeId]
      if (!node || prev.finished) return { save: prev, events: [] }
      const visible = getVisibleLines(node, prev)
      const events: GameEvent[] = []
      let save = prev

      // Unlock any clues attached to the current line
      const curLine = visible[save.lineIndex]
      if (curLine?.clues && curLine.clues.length > 0) {
        const nextClues = [...save.clues]
        for (const c of curLine.clues) {
          if (!nextClues.includes(c.id)) nextClues.push(c.id)
        }
        save = { ...save, clues: nextClues }
      }
      if (curLine?.effects && curLine.effects.length > 0) {
        const res = applyEffects(bundle, save, curLine.effects)
        save = res.state
        if (res.settlement) events.push({ type: 'settlement', settlement: res.settlement })
        for (const w of res.warnings) events.push({ type: 'warning', warning: w })
      }

      if (save.lineIndex + 1 < visible.length) {
        return { save: { ...save, lineIndex: save.lineIndex + 1, savedAt: Date.now() }, events }
      }

      // If no choices on this node, advance via node.next
      const visibleChoices = getVisibleChoices(node, save)
      if (visibleChoices.length === 0) {
        const nextId = resolveNext(node.next, save)
        if (nextId) {
          const entered = enterNode(bundle, save, nextId)
          return { save: entered.save, events: [...events, ...entered.events] }
        }
      }
      return { save, events }
    }

    case 'CHOOSE': {
      const node = bundle.nodes[prev.nodeId]
      if (!node || prev.finished) return { save: prev, events: [] }
      const choice = getVisibleChoices(node, prev).find((c) => c.id === action.choiceId)
      if (!choice) return { save: prev, events: [] }

      const events: GameEvent[] = []
      const res = applyEffects(bundle, prev, choice.effects)
      let save = res.state
      if (res.settlement) events.push({ type: 'settlement', settlement: res.settlement })
      for (const w of res.warnings) events.push({ type: 'warning', warning: w })

      save = {
        ...save,
        choiceLog: [
          ...save.choiceLog,
          {
            nodeId: node.id,
            act: node.act ?? node.title ?? node.id,
            choiceId: choice.id,
            label: choice.label,
            stampKind: choice.stampKind,
            reasons: res.settlement?.reasons ?? [],
          },
        ],
      }

      // Immediate red-line collapse or deadline overflow interrupts normal routing
      if (res.collapseEndingId) {
        const end = enterNode(bundle, save, res.collapseEndingId)
        return { save: end.save, events: [...events, ...end.events] }
      }
      if (res.overflowEndingId) {
        const end = enterNode(bundle, save, res.overflowEndingId)
        return { save: end.save, events: [...events, ...end.events] }
      }

      const nextId = resolveNext(choice.next, save) ?? resolveNext(node.next, save)
      if (nextId) {
        const entered = enterNode(bundle, save, nextId)
        return { save: entered.save, events: [...events, ...entered.events] }
      }

      return { save, events }
    }
  }
}
