/* ==========================================================================
   CCNotEasy Shared Story-Graph & Integrity Validator
   Runs in BOTH Node CLI (scripts/validate-story.ts) AND browser StoryPack import.
   ========================================================================== */

import { tokenizeRichText } from './richText.ts'
import type { ChapterBundle, Condition, Effect, NextSpec } from './schema.ts'

export interface ValidationIssue {
  severity: 'error' | 'warn'
  code: string
  path: string
  message: string
}

export interface ValidationReport {
  ok: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
  stats: {
    nodes: number
    reachableNodes: number
    endings: number
    glossCount: number
    subtextCount: number
    refCount: number
  }
}

const BANNED_JP_RE = /[\u3040-\u30ff]|幕府|大名|武士|忍者|天守|城下町|浪人|切腹/

export function validateChapterBundle(bundle: ChapterBundle): ValidationReport {
  const issues: ValidationIssue[] = []
  const err = (code: string, path: string, message: string) =>
    issues.push({ severity: 'error', code, path, message })
  const warn = (code: string, path: string, message: string) =>
    issues.push({ severity: 'warn', code, path, message })

  const nodeIds = new Set(Object.keys(bundle.nodes))
  const varIds = new Set(Object.keys(bundle.varsSchema))
  const resIds = new Set(bundle.resources.map((r) => r.id))
  const dlIds = new Set(bundle.deadlines.map((d) => d.id))
  const castIds = new Set(Object.keys(bundle.cast))
  const glossIds = new Set(Object.keys(bundle.gloss))
  const subtextIds = new Set(Object.keys(bundle.subtexts))
  const refIds = new Set(Object.keys(bundle.refs))

  // 1. Validate safe logical theme asset filenames (no http:// or .. traversal)
  const assetFields: [string, string | undefined][] = [
    ['theme.themeDir', bundle.theme.themeDir],
    ['theme.bgFile', bundle.theme.bgFile],
    ['theme.bgmFile', bundle.theme.bgmFile],
    ['theme.bgmOrigFile', bundle.theme.bgmOrigFile],
  ]
  for (const [p, val] of assetFields) {
    if (val && (/https?:|\.\.|[()"'\\]/.test(val))) {
      err('UNSAFE_ASSET_PATH', p, `Theme asset "${val}" must be a safe relative filename.`)
    }
  }

  // 2. Start node & special ending references
  if (!nodeIds.has(bundle.startNode)) {
    err('MISSING_START', 'startNode', `startNode "${bundle.startNode}" does not exist.`)
  }
  for (const r of bundle.resources) {
    if (!nodeIds.has(r.collapseEndingId)) {
      err('MISSING_COLLAPSE_END', `resources.${r.id}`, `collapseEndingId "${r.collapseEndingId}" not found.`)
    }
  }
  if (bundle.multiCollapseEndingId && !nodeIds.has(bundle.multiCollapseEndingId)) {
    err('MISSING_COLLAPSE_END', 'multiCollapseEndingId', `"${bundle.multiCollapseEndingId}" not found.`)
  }
  for (const d of bundle.deadlines) {
    if (!nodeIds.has(d.overflowEndingId)) {
      err('MISSING_OVERFLOW_END', `deadlines.${d.id}`, `overflowEndingId "${d.overflowEndingId}" not found.`)
    }
  }

  // Helper: validate Condition references
  function checkCond(cond: Condition | undefined, path: string): void {
    if (!cond) return
    if ('all' in cond) { cond.all.forEach((c, i) => checkCond(c, `${path}.all[${i}]`)); return }
    if ('any' in cond) { cond.any.forEach((c, i) => checkCond(c, `${path}.any[${i}]`)); return }
    if ('not' in cond) { checkCond(cond.not, `${path}.not`); return }
    if ('visited' in cond) {
      if (!nodeIds.has(cond.visited)) err('MISSING_NODE_REF', path, `visited node "${cond.visited}" not found.`)
      return
    }
    if ('var' in cond) {
      if (!varIds.has(cond.var)) err('UNDECLARED_VAR', path, `Condition references undeclared var "${cond.var}".`)
      return
    }
    if ('resource' in cond) {
      if (!resIds.has(cond.resource)) err('UNDECLARED_RES', path, `Condition references undeclared resource "${cond.resource}".`)
      return
    }
    if ('deadline' in cond) {
      if (!dlIds.has(cond.deadline)) err('UNDECLARED_DL', path, `Condition references undeclared deadline "${cond.deadline}".`)
    }
  }

  // Helper: validate Effect references + mandatory reason rule
  function checkEffects(effects: Effect[] | undefined, path: string): void {
    if (!effects) return
    effects.forEach((e, i) => {
      const ep = `${path}[${i}]`
      if (e.kind === 'var_set' || e.kind === 'var_add') {
        if (!varIds.has(e.var)) err('UNDECLARED_VAR', ep, `Effect mutates undeclared var "${e.var}".`)
      } else if (e.kind === 'resource') {
        if (!resIds.has(e.resource)) err('UNDECLARED_RES', ep, `Effect mutates undeclared resource "${e.resource}".`)
        if (!e.reason.trim()) err('MISSING_REASON', ep, `Resource delta on "${e.resource}" must include a non-empty reason.`)
      } else if (e.kind === 'deadline') {
        if (!dlIds.has(e.deadline)) err('UNDECLARED_DL', ep, `Effect mutates undeclared deadline "${e.deadline}".`)
        if (!e.reason.trim()) err('MISSING_REASON', ep, `Deadline delta on "${e.deadline}" must include a non-empty reason.`)
      } else if (e.kind === 'debt') {
        if (!nodeIds.has(e.debt.dueAt)) err('MISSING_NODE_REF', ep, `Debt dueAt "${e.debt.dueAt}" not found.`)
        checkEffects(e.debt.effects, `${ep}.debt.effects`)
      }
    })
  }

  // Helper: validate rich text tokens & banned Japanese lexicon
  function checkText(text: string, path: string): void {
    if (BANNED_JP_RE.test(text)) {
      err('BANNED_LEXICON', path, `Text contains banned Japanese-style term or kana: "${text.slice(0, 40)}..."`)
    }
    for (const tok of tokenizeRichText(text)) {
      if (tok.kind === 'gloss' && !glossIds.has(tok.id)) {
        err('MISSING_GLOSS', path, `Inline gloss "{{gloss:${tok.id}}}" not found in bundle.gloss.`)
      }
      if (tok.kind === 'subtext' && !subtextIds.has(tok.id)) {
        err('MISSING_SUBTEXT', path, `Inline subtext "{{subtext:${tok.id}}}" not found in bundle.subtexts.`)
      }
    }
  }

  // Helper: collect & validate NextSpec targets + shadowed BranchRule detection
  function collectNextTargets(nextSpec: NextSpec | undefined, path: string): string[] {
    if (!nextSpec) return []
    if (typeof nextSpec === 'string') {
      if (!nodeIds.has(nextSpec)) err('MISSING_NODE_REF', path, `Target node "${nextSpec}" not found.`)
      return [nextSpec]
    }
    const targets: string[] = []
    let seenUnconditional = false
    nextSpec.forEach((rule, i) => {
      const rp = `${path}[${i}]`
      if (seenUnconditional) {
        warn('SHADOWED_RULE', rp, `BranchRule is shadowed by an earlier unconditional rule.`)
      }
      if (!rule.when) seenUnconditional = true
      else checkCond(rule.when, `${rp}.when`)
      if (!nodeIds.has(rule.next)) err('MISSING_NODE_REF', rp, `Target node "${rule.next}" not found.`)
      targets.push(rule.next)
    })
    return targets
  }

  // 3. Per-node validation + adjacency list for reachability BFS
  const adj = new Map<string, string[]>()
  let endingCount = 0

  for (const [id, node] of Object.entries(bundle.nodes)) {
    const np = `nodes.${id}`
    if (node.kind === 'ending') endingCount++

    node.lines.forEach((line, i) => {
      const lp = `${np}.lines[${i}]`
      if (!castIds.has(line.speaker)) err('MISSING_CAST', lp, `Speaker "${line.speaker}" not found in bundle.cast.`)
      checkCond(line.when, `${lp}.when`)
      checkEffects(line.effects, `${lp}.effects`)
      checkText(line.text, lp)
    })

    for (const refId of node.refs ?? []) {
      if (!refIds.has(refId)) err('MISSING_REF_CARD', `${np}.refs`, `ReferenceCard "${refId}" not found.`)
    }

    if (node.interaction?.type === 'prep_desk') {
      node.interaction.actions.forEach((a, i) => {
        const ap = `${np}.prep[${i}]`
        checkCond(a.when, `${ap}.when`)
        checkEffects(a.effects, `${ap}.effects`)
        a.lines.forEach((l, li) => {
          if (!castIds.has(l.speaker)) err('MISSING_CAST', `${ap}.lines[${li}]`, `Speaker "${l.speaker}" not found.`)
          checkText(l.text, `${ap}.lines[${li}]`)
        })
        for (const r of a.showRefs ?? []) {
          if (!refIds.has(r)) err('MISSING_REF_CARD', `${ap}.showRefs`, `ReferenceCard "${r}" not found.`)
        }
      })
    } else if (node.interaction?.type === 'counter_case') {
      node.interaction.claims.forEach((cl, i) => {
        checkText(cl.surface, `${np}.claims[${i}].surface`)
        checkText(cl.proof, `${np}.claims[${i}].proof`)
        checkEffects(cl.effects, `${np}.claims[${i}].effects`)
      })
    } else if (node.interaction?.type === 'wordsmith') {
      node.interaction.slots.forEach((sl, si) => {
        sl.options.forEach((opt, oi) => {
          checkText(opt.text, `${np}.slots[${si}].options[${oi}].text`)
          if (opt.reaction) checkText(opt.reaction, `${np}.slots[${si}].options[${oi}].reaction`)
          checkEffects(opt.effects, `${np}.slots[${si}].options[${oi}].effects`)
        })
      })
    }

    const targets: string[] = []
    if (node.choices && node.choices.length > 0) {
      const allGuarded = node.choices.every((c) => Boolean(c.when))
      if (allGuarded && !node.next) {
        err('POTENTIAL_SOFTLOCK', `${np}.choices`, `All choices are conditional with no fallback node.next.`)
      }
      node.choices.forEach((ch, i) => {
        const cp = `${np}.choices[${i}]`
        checkCond(ch.when, `${cp}.when`)
        checkEffects(ch.effects, `${cp}.effects`)
        checkText(ch.label, `${cp}.label`)
        if (ch.replyText) checkText(ch.replyText, `${cp}.replyText`)
        targets.push(...collectNextTargets(ch.next, `${cp}.next`))
      })
    }

    targets.push(...collectNextTargets(node.next, `${np}.next`))

    if (node.kind !== 'ending' && targets.length === 0) {
      err('DEAD_END', np, `Non-ending node "${id}" has neither choices nor next target.`)
    }
    adj.set(id, targets)
  }

  // 4. BFS Reachability from startNode + system-triggered collapse/overflow endings
  const reachable = new Set<string>()
  const queue: string[] = []
  const seed = (nid: string | undefined) => {
    if (nid && nodeIds.has(nid) && !reachable.has(nid)) {
      reachable.add(nid)
      queue.push(nid)
    }
  }
  seed(bundle.startNode)
  for (const r of bundle.resources) seed(r.collapseEndingId)
  seed(bundle.multiCollapseEndingId)
  for (const d of bundle.deadlines) seed(d.overflowEndingId)

  while (queue.length > 0) {
    const cur = queue.shift()!
    for (const nxt of adj.get(cur) ?? []) {
      if (nodeIds.has(nxt) && !reachable.has(nxt)) {
        reachable.add(nxt)
        queue.push(nxt)
      }
    }
  }

  for (const id of nodeIds) {
    if (!reachable.has(id)) {
      err('ORPHAN_NODE', `nodes.${id}`, `Node "${id}" is unreachable from startNode or trigger rules.`)
    }
  }

  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warn')

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      nodes: nodeIds.size,
      reachableNodes: reachable.size,
      endings: endingCount,
      glossCount: glossIds.size,
      subtextCount: subtextIds.size,
      refCount: refIds.size,
    },
  }
}
