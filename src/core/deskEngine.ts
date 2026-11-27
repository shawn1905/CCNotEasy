/* ==========================================================================
   CCNotEasy Dynamic Desk Survival Engine (Pure State Machine + Validator)
   Zero React/DOM dependencies; deterministic PRNG seeded per run.
   ========================================================================== */

import type {
  DeskAdvisor,
  DeskBestRecord,
  DeskCaseCard,
  DeskCondition,
  DeskDelta,
  DeskEndingSummary,
  DeskLogEntry,
  DeskOrder,
  DeskPack,
  DeskResourceId,
  DeskState,
} from './deskSchema.ts'
import type { Mood } from './schema.ts'

const BANNED_JP_RE = /[\u3040-\u30ff]|幕府|大名|武士|忍者|天守|城下町|浪人|切腹/

function nextRand(seed: number): { value: number; nextSeed: number } {
  const nextSeed = (seed * 1664525 + 1013904223) >>> 0
  return { value: nextSeed / 4294967296, nextSeed }
}

function makeLogId(day: number, prefix: string, seq: number): string {
  return `d${day}_${prefix}_${seq}`
}

function computeMood(state: Pick<DeskState, 'resources' | 'deadline'>, pack: DeskPack): Mood {
  const minRes = Math.min(state.resources.grain, state.resources.troops, state.resources.morale)
  if (minRes <= 1 || state.deadline >= pack.deadline.max - 2) return 'fire'
  if (minRes <= 2 || state.deadline >= pack.deadline.warnAt) return 'tense'
  return 'calm'
}

export function evalDeskCondition(cond: DeskCondition | undefined, state: DeskState): boolean {
  if (!cond) return true
  if (cond.minDay !== undefined && state.day < cond.minDay) return false
  if (cond.maxDay !== undefined && state.day > cond.maxDay) return false
  if (cond.maxGrain !== undefined && state.resources.grain > cond.maxGrain) return false
  if (cond.minGrain !== undefined && state.resources.grain < cond.minGrain) return false
  if (cond.maxTroops !== undefined && state.resources.troops > cond.maxTroops) return false
  if (cond.minTroops !== undefined && state.resources.troops < cond.minTroops) return false
  if (cond.maxMorale !== undefined && state.resources.morale > cond.maxMorale) return false
  if (cond.minMorale !== undefined && state.resources.morale < cond.minMorale) return false
  if (cond.minDeadline !== undefined && state.deadline < cond.minDeadline) return false
  if (cond.hasTag && !state.tags.includes(cond.hasTag)) return false
  if (cond.hasDebt && state.pendingDebts.length === 0) return false
  return true
}

function formatDeltaBadges(delta: DeskDelta, pack: DeskPack): string {
  const parts: string[] = []
  const labelMap = new Map(pack.resources.map((r) => [r.id, r.label]))
  const keys: DeskResourceId[] = ['grain', 'troops', 'morale']
  for (const k of keys) {
    const v = delta[k]
    if (v) parts.push(`${labelMap.get(k) ?? k} ${v > 0 ? `+${v}` : v}`)
  }
  if (delta.deadline) {
    parts.push(`${pack.deadline.label} ${delta.deadline > 0 ? `+${delta.deadline}` : delta.deadline}`)
  }
  return parts.join(' · ') || '稳住大局'
}

function applyDelta(
  pack: DeskPack,
  state: DeskState,
  delta: DeskDelta,
  opts?: { safeFloor?: boolean },
): DeskState {
  const nextRes = { ...state.resources }
  for (const spec of pack.resources) {
    const d = delta[spec.id] ?? 0
    if (d !== 0) {
      const floor = opts?.safeFloor ? Math.max(1, spec.collapseAt) : 0
      nextRes[spec.id] = Math.max(floor, Math.min(spec.max, nextRes[spec.id] + d))
    }
  }
  const nextDeadline = Math.max(
    0,
    Math.min(pack.deadline.max, state.deadline + (delta.deadline ?? 0)),
  )
  return {
    ...state,
    resources: nextRes,
    deadline: nextDeadline,
    mood: computeMood({ resources: nextRes, deadline: nextDeadline }, pack),
  }
}

function buildEndingSummary(
  pack: DeskPack,
  state: DeskState,
  victory: boolean,
  causeTitle: string,
  causeDesc: string,
): DeskEndingSummary {
  const combos = state.combosTriggered.length
  let buildName = '中规中矩守成派'
  let buildQuote = '按章批文，步步为营，虽无奇谋却也没把账本烧穿。'

  if (!victory && state.day <= 3) {
    buildName = '江陵三日游'
    buildQuote = '帅印还没捂热，江陵大帐先从内部散了架。'
  } else if (state.debtsCancelled >= 2) {
    buildName = '借头拆弹大师'
    buildQuote = '前脚敢借高利贷续命，后脚敢借粮官项上人头平账。'
  } else if (combos >= 2) {
    buildName = '暗黑账房奇才'
    buildQuote = `一局打出 ${combos} 套脏招组合拳，把江东探子和自家主簿一块儿绕晕。`
  } else if (state.dirtyCount === 0 && victory) {
    buildName = '清流铁骨丞相'
    buildQuote = '十日之内一招脏活未沾，全凭眼力戳假账硬扛到冬至。'
  } else if (state.dirtyCount >= 4) {
    buildName = '八十万大忽悠'
    buildQuote = '只要嘴够硬、账够花、利息延得够久，江陵城就能多撑一天。'
  } else if (victory) {
    buildName = '老练算盘手'
    buildQuote = '该稳时稳，该狠时狠，在死线和红线之间走完了钢丝。'
  }

  return {
    victory,
    daysSurvived: victory ? pack.targetDays : state.day,
    title: causeTitle,
    subtitle: victory
      ? `硬撑满 ${pack.targetDays} 日 · 共批阅 ${state.casesHandled} 份案卷`
      : `止步第 ${state.day} 日 · 共批阅 ${state.casesHandled} 份案卷`,
    buildName,
    buildQuote,
    verdict: causeDesc,
  }
}

function checkCollapseOrOverflow(pack: DeskPack, state: DeskState): DeskState {
  if (state.phase === 'ended') return state
  for (const spec of pack.resources) {
    if (state.resources[spec.id] <= spec.collapseAt) {
      return {
        ...state,
        phase: 'ended',
        mood: 'fire',
        ending: buildEndingSummary(pack, state, false, spec.collapseTitle, spec.collapseDesc),
      }
    }
  }
  if (state.deadline >= pack.deadline.max) {
    return {
      ...state,
      phase: 'ended',
      mood: 'fire',
      ending: buildEndingSummary(
        pack,
        state,
        false,
        pack.deadline.overflowTitle,
        pack.deadline.overflowDesc,
      ),
    }
  }
  return state
}

function drawCasesForDay(pack: DeskPack, state: DeskState): { caseIds: string[]; nextSeed: number } {
  const picked: string[] = []
  let seed = state.seed

  for (let slot = 0; slot < pack.casesPerDay; slot++) {
    const eligible = pack.cases.filter(
      (c) => !picked.includes(c.id) && evalDeskCondition(c.when, state),
    )
    const freshEligible = eligible.filter((c) => !state.seenCaseIds.includes(c.id))
    const pool = freshEligible.length > 0 ? freshEligible : eligible
    if (pool.length === 0) break

    // Crisis & backlash cases get a priority weight boost when triggered
    const weights = pool.map((c) => {
      if (c.category === 'backlash') return c.weight * 2.2
      if (c.category === 'crisis') return c.weight * 1.6
      return c.weight
    })
    const total = weights.reduce((a, b) => a + b, 0)
    const r = nextRand(seed)
    seed = r.nextSeed
    let acc = r.value * total
    let chosen: DeskCaseCard = pool[0]!
    for (let i = 0; i < pool.length; i++) {
      acc -= weights[i]!
      if (acc <= 0) {
        chosen = pool[i]!
        break
      }
    }
    picked.push(chosen.id)
  }

  return { caseIds: picked, nextSeed: seed }
}

export function createInitialDeskState(pack: DeskPack, seed = Date.now() >>> 0): DeskState {
  const resources: Record<DeskResourceId, number> = { grain: 4, troops: 4, morale: 4 }
  for (const r of pack.resources) resources[r.id] = r.initial

  const initial: DeskState = {
    packId: pack.id,
    day: 1,
    phase: 'pick_advisor',
    mood: 'calm',
    resources,
    deadline: pack.deadline.initial,
    advisorId: null,
    lastAdvisorId: null,
    todayCaseIds: [],
    caseIndex: 0,
    exposedClaimIds: [],
    orderUsedToday: false,
    orderCooldowns: {},
    pendingDebts: [],
    tags: [],
    recentOrderTags: [],
    seenCaseIds: [],
    combosTriggered: [],
    dirtyCount: 0,
    casesHandled: 0,
    debtsCancelled: 0,
    debtsPaid: 0,
    logs: [
      {
        id: 'd1_start_0',
        day: 1,
        kind: 'day',
        badge: `第 1 日 · 辰时升帐`,
        text: `${pack.title}值班开启：稳住三项血条不触红线，压住「${pack.deadline.label}」，先点一位今日当值幕僚。`,
      },
    ],
    ending: null,
    endless: false,
    seed: seed || 1337,
  }
  return initial
}

export type DeskAction =
  | { type: 'PICK_ADVISOR'; advisorId: DeskAdvisor['id'] }
  | { type: 'EXPOSE_CLAIM'; claimId: string }
  | { type: 'RESOLVE_CASE'; choiceId: string }
  | { type: 'USE_ORDER'; orderId: DeskOrder['id'] }
  | { type: 'NEXT_DAY' }
  | { type: 'CONTINUE_ENDLESS' }
  | { type: 'RESET'; seed?: number }

export function getCurrentDeskCase(pack: DeskPack, state: DeskState): DeskCaseCard | null {
  if (state.phase !== 'desk_case') return null
  const cid = state.todayCaseIds[state.caseIndex]
  if (!cid) return null
  return pack.cases.find((c) => c.id === cid) ?? null
}

export function reduceDesk(pack: DeskPack, prev: DeskState, action: DeskAction): DeskState {
  switch (action.type) {
    case 'RESET':
      return createInitialDeskState(pack, action.seed ?? (Date.now() >>> 0))

    case 'PICK_ADVISOR': {
      if (prev.phase !== 'pick_advisor') return prev
      if (action.advisorId === prev.lastAdvisorId) return prev
      const adv = pack.advisors.find((a) => a.id === action.advisorId)
      if (!adv) return prev

      let next: DeskState = {
        ...prev,
        advisorId: adv.id,
        phase: 'desk_case',
        caseIndex: 0,
        exposedClaimIds: [],
      }
      const logs: DeskLogEntry[] = [...prev.logs]

      if (adv.onDutyDelta) {
        next = applyDelta(pack, next, adv.onDutyDelta)
        logs.push({
          id: makeLogId(next.day, 'adv', logs.length),
          day: next.day,
          kind: 'advisor',
          badge: `${adv.name}当值 · ${formatDeltaBadges(adv.onDutyDelta, pack)}`,
          text: `${adv.perkTitle}：${adv.onDutyDelta.reason}`,
        })
      } else {
        logs.push({
          id: makeLogId(next.day, 'adv', logs.length),
          day: next.day,
          kind: 'advisor',
          badge: `${adv.name}当值`,
          text: `${adv.perkTitle}：${adv.perkDesc}`,
        })
      }

      if (adv.delayDebtsBy && next.pendingDebts.length > 0) {
        next = {
          ...next,
          pendingDebts: next.pendingDebts.map((d) => ({ ...d, dueDay: d.dueDay + adv.delayDebtsBy! })),
        }
        logs.push({
          id: makeLogId(next.day, 'adv_delay', logs.length),
          day: next.day,
          kind: 'advisor',
          badge: `${adv.name}缓局`,
          text: `已将账上 ${next.pendingDebts.length} 笔待爆暗雷顺延 ${adv.delayDebtsBy} 日。`,
        })
      }

      const drawn = drawCasesForDay(pack, next)
      const firstCase = pack.cases.find((c) => c.id === drawn.caseIds[0])
      const autoExposed =
        adv.autoExposeFirst && firstCase && firstCase.claims[0] ? [firstCase.claims[0].id] : []

      next = {
        ...next,
        todayCaseIds: drawn.caseIds,
        seed: drawn.nextSeed,
        exposedClaimIds: autoExposed,
        logs,
      }
      return checkCollapseOrOverflow(pack, next)
    }

    case 'EXPOSE_CLAIM': {
      const curCase = getCurrentDeskCase(pack, prev)
      if (!curCase || prev.exposedClaimIds.includes(action.claimId)) return prev
      const claim = curCase.claims.find((c) => c.id === action.claimId)
      if (!claim) return prev

      let next: DeskState = {
        ...prev,
        exposedClaimIds: [...prev.exposedClaimIds, claim.id],
      }
      if (claim.exposeDelta) {
        next = applyDelta(pack, next, claim.exposeDelta)
        next = {
          ...next,
          logs: [
            ...next.logs,
            {
              id: makeLogId(next.day, 'exp', next.logs.length),
              day: next.day,
              kind: 'case',
              badge: `戳破假账 · ${formatDeltaBadges(claim.exposeDelta, pack)}`,
              text: claim.exposeDelta.reason,
            },
          ],
        }
      }
      return checkCollapseOrOverflow(pack, next)
    }

    case 'USE_ORDER': {
      if (prev.phase !== 'desk_case' || prev.orderUsedToday) return prev
      if ((prev.orderCooldowns[action.orderId] ?? 0) > 0) return prev
      const order = pack.orders.find((o) => o.id === action.orderId)
      if (!order) return prev

      const curCase = getCurrentDeskCase(pack, prev)
      let next: DeskState = applyDelta(pack, prev, order.delta)
      const logs: DeskLogEntry[] = [
        ...next.logs,
        {
          id: makeLogId(next.day, 'ord', next.logs.length),
          day: next.day,
          kind: 'order',
          badge: `手令《${order.name}》 · ${formatDeltaBadges(order.delta, pack)}`,
          text: order.delta.reason,
        },
      ]

      let pendingDebts = [...next.pendingDebts]
      let debtsCancelled = next.debtsCancelled
      const hadActiveDebtBefore = pendingDebts.length > 0

      if (order.cancelEarliestDebt && pendingDebts.length > 0) {
        pendingDebts.sort((a, b) => a.dueDay - b.dueDay)
        const removed = pendingDebts.shift()!
        debtsCancelled += 1
        logs.push({
          id: makeLogId(next.day, 'cancel', logs.length),
          day: next.day,
          kind: 'combo',
          badge: `暗雷已拆 · 撕毁「${removed.label}」`,
          text: `借人头压下旧账，原定第 ${removed.dueDay} 日爆发的暗雷一笔勾销。`,
        })
      }

      if (order.debt) {
        pendingDebts.push({
          uid: `${order.debt.id}_d${next.day}_${pendingDebts.length}`,
          specId: order.debt.id,
          label: order.debt.label,
          dueDay: next.day + order.debt.delayDays,
          triggerText: order.debt.triggerText,
          delta: order.debt.delta,
        })
      }

      // Check emergent combos
      const combosTriggered = [...next.combosTriggered]
      for (const combo of pack.combos) {
        if (combo.triggerOrderId !== order.id) continue
        const tagOk =
          !combo.requiresRecentTag ||
          next.recentOrderTags.some(
            (t) => t.tag === combo.requiresRecentTag && next.day - t.day <= 2,
          )
        const debtOk = !combo.requiresActiveDebt || hadActiveDebtBefore
        const catOk = !combo.requiresCaseCategory || curCase?.category === combo.requiresCaseCategory
        if (tagOk && debtOk && catOk) {
          next = applyDelta(pack, next, combo.bonusDelta)
          combosTriggered.push({ id: combo.id, name: combo.name, day: next.day })
          logs.push({
            id: makeLogId(next.day, 'cmb', logs.length),
            day: next.day,
            kind: 'combo',
            badge: `涌现配方【${combo.name}】 · ${formatDeltaBadges(combo.bonusDelta, pack)}`,
            text: `${combo.quote}（${combo.bonusDelta.reason}）`,
          })
          if (combo.extraDebt) {
            pendingDebts.push({
              uid: `${combo.extraDebt.id}_d${next.day}_${pendingDebts.length}`,
              specId: combo.extraDebt.id,
              label: combo.extraDebt.label,
              dueDay: next.day + combo.extraDebt.delayDays,
              triggerText: combo.extraDebt.triggerText,
              delta: combo.extraDebt.delta,
            })
          }
        }
      }

      next = {
        ...next,
        orderUsedToday: true,
        orderCooldowns: { ...next.orderCooldowns, [order.id]: order.cooldownDays },
        pendingDebts,
        debtsCancelled,
        combosTriggered,
        tags: next.tags.includes(order.tag) ? next.tags : [...next.tags, order.tag],
        recentOrderTags: [...next.recentOrderTags, { tag: order.tag, day: next.day }],
        dirtyCount: order.debt ? next.dirtyCount + 1 : next.dirtyCount,
        logs,
      }
      return checkCollapseOrOverflow(pack, next)
    }

    case 'RESOLVE_CASE': {
      const curCase = getCurrentDeskCase(pack, prev)
      if (!curCase) return prev
      const choice = curCase.choices.find((c) => c.id === action.choiceId)
      if (!choice) return prev
      if (choice.requiresExposed && prev.exposedClaimIds.length < curCase.claims.length) return prev

      const advisor = pack.advisors.find((a) => a.id === prev.advisorId)
      let next = applyDelta(pack, prev, choice.delta)
      const logs: DeskLogEntry[] = [
        ...next.logs,
        {
          id: makeLogId(next.day, 'case', next.logs.length),
          day: next.day,
          kind: 'case',
          badge: `${curCase.title} · ${choice.stampText} · ${formatDeltaBadges(choice.delta, pack)}`,
          text: `${choice.replyText}（${choice.delta.reason}）`,
        },
      ]

      // Advisor passive synergy on stamp kind
      if (choice.stampKind === 'dirty' && advisor?.dirtyBonusDelta) {
        next = applyDelta(pack, next, advisor.dirtyBonusDelta)
        logs.push({
          id: makeLogId(next.day, 'adv_b', logs.length),
          day: next.day,
          kind: 'advisor',
          badge: `${advisor.name}补刀 · ${formatDeltaBadges(advisor.dirtyBonusDelta, pack)}`,
          text: advisor.dirtyBonusDelta.reason,
        })
      } else if (choice.stampKind === 'reject' && advisor?.rejectBonusDelta) {
        next = applyDelta(pack, next, advisor.rejectBonusDelta)
        logs.push({
          id: makeLogId(next.day, 'adv_r', logs.length),
          day: next.day,
          kind: 'advisor',
          badge: `${advisor.name}理账 · ${formatDeltaBadges(advisor.rejectBonusDelta, pack)}`,
          text: advisor.rejectBonusDelta.reason,
        })
      } else if (choice.stampKind === 'approve' && advisor?.approveBonusDelta) {
        next = applyDelta(pack, next, advisor.approveBonusDelta)
        logs.push({
          id: makeLogId(next.day, 'adv_a', logs.length),
          day: next.day,
          kind: 'advisor',
          badge: `${advisor.name}参赞 · ${formatDeltaBadges(advisor.approveBonusDelta, pack)}`,
          text: advisor.approveBonusDelta.reason,
        })
      }

      const pendingDebts = [...next.pendingDebts]
      if (choice.debt) {
        pendingDebts.push({
          uid: `${choice.debt.id}_d${next.day}_${pendingDebts.length}`,
          specId: choice.debt.id,
          label: choice.debt.label,
          dueDay: next.day + choice.debt.delayDays,
          triggerText: choice.debt.triggerText,
          delta: choice.debt.delta,
        })
      }

      const seenCaseIds = next.seenCaseIds.includes(curCase.id)
        ? next.seenCaseIds
        : [...next.seenCaseIds, curCase.id]
      const tags =
        choice.addTag && !next.tags.includes(choice.addTag)
          ? [...next.tags, choice.addTag]
          : next.tags

      next = {
        ...next,
        pendingDebts,
        seenCaseIds,
        tags,
        dirtyCount: choice.stampKind === 'dirty' ? next.dirtyCount + 1 : next.dirtyCount,
        casesHandled: next.casesHandled + 1,
        logs,
      }

      next = checkCollapseOrOverflow(pack, next)
      if (next.phase === 'ended') return next

      // Advance to next case today or day_summary
      if (next.caseIndex + 1 < next.todayCaseIds.length) {
        const nextCaseId = next.todayCaseIds[next.caseIndex + 1]
        const nextCase = pack.cases.find((c) => c.id === nextCaseId)
        const autoExposed =
          advisor?.autoExposeFirst && nextCase && nextCase.claims[0] ? [nextCase.claims[0].id] : []
        return {
          ...next,
          caseIndex: next.caseIndex + 1,
          exposedClaimIds: autoExposed,
        }
      }

      // End-of-day rent (daily upkeep, escalates in late game)
      const escalated = pack.escalateDay !== undefined && next.day >= pack.escalateDay
      const rentDelta: DeskDelta = escalated
        ? next.day % 2 === 0
          ? { grain: -1, deadline: 1, reason: `第 ${next.day} 日暮（决战前夕）：坐食耗粮且敌势逼近` }
          : { deadline: 1, reason: `第 ${next.day} 日暮（决战前夕）：敌军整备又进一格` }
        : next.day % 2 === 1
          ? { deadline: 1, reason: `第 ${next.day} 日暮：敌营整备又多一日` }
          : { grain: -1, reason: `第 ${next.day} 日暮：大军坐食，日耗一格军粮` }

      next = applyDelta(pack, next, rentDelta)
      const rentLogs: DeskLogEntry[] = [
        ...next.logs,
        {
          id: makeLogId(next.day, 'rent', next.logs.length),
          day: next.day,
          kind: 'rent',
          badge: `日终房租 · ${formatDeltaBadges(rentDelta, pack)}`,
          text: rentDelta.reason,
          warn: true,
        },
      ]

      // Low-morale night desertion penalty
      if (next.resources.morale <= 1 && next.resources.troops > 0) {
        const desertDelta: DeskDelta = { troops: -1, reason: '军心跌入告急线，昨夜营中潜逃减员' }
        next = applyDelta(pack, next, desertDelta)
        rentLogs.push({
          id: makeLogId(next.day, 'desert', rentLogs.length),
          day: next.day,
          kind: 'warn',
          badge: `低气夜逃 · ${formatDeltaBadges(desertDelta, pack)}`,
          text: desertDelta.reason,
          warn: true,
        })
      }

      next = {
        ...next,
        phase: 'day_summary',
        logs: rentLogs,
      }

      next = checkCollapseOrOverflow(pack, next)
      if (next.phase === 'ended') return next

      // Victory check after surviving targetDays (unless already in endless mode)
      if (!next.endless && next.day >= pack.targetDays) {
        return {
          ...next,
          phase: 'ended',
          mood: 'calm',
          ending: buildEndingSummary(
            pack,
            next,
            true,
            `稳坐帅案满 ${pack.targetDays} 日`,
            `三项血条无一崩盘，敌军未及抢先破局。你把大帐里一团烂账硬生生盘活了过来。`,
          ),
        }
      }

      return next
    }

    case 'CONTINUE_ENDLESS': {
      if (prev.phase !== 'ended' || !prev.ending?.victory) return prev
      return {
        ...prev,
        phase: 'day_summary',
        endless: true,
        ending: null,
        logs: [
          ...prev.logs,
          {
            id: makeLogId(prev.day, 'endless', prev.logs.length),
            day: prev.day,
            kind: 'day',
            badge: '无尽镇守开启',
            text: `已突破 ${pack.targetDays} 日大关，继续坐镇大帐冲击极限存活天数！`,
          },
        ],
      }
    }

    case 'NEXT_DAY': {
      if (prev.phase !== 'day_summary') return prev
      const nextDay = prev.day + 1

      // Decrement cooldowns
      const nextCooldowns: Record<string, number> = {}
      for (const [k, v] of Object.entries(prev.orderCooldowns)) {
        if (v > 1) nextCooldowns[k] = v - 1
      }

      let next: DeskState = {
        ...prev,
        day: nextDay,
        phase: 'pick_advisor',
        lastAdvisorId: prev.advisorId,
        advisorId: null,
        todayCaseIds: [],
        caseIndex: 0,
        exposedClaimIds: [],
        orderUsedToday: false,
        orderCooldowns: nextCooldowns,
        logs: [
          ...prev.logs,
          {
            id: makeLogId(nextDay, 'day', prev.logs.length),
            day: nextDay,
            kind: 'day',
            badge: `第 ${nextDay} 日 · 辰时升帐`,
            text: prev.endless
              ? `无尽镇守第 ${nextDay} 日，日终房租已全面加压。`
              : `距满期还剩 ${Math.max(0, pack.targetDays - nextDay + 1)} 日。`,
          },
        ],
      }

      // Trigger due debts at start of day (real bite: no safeFloor, must defuse or prepare!)
      const dueDebts = next.pendingDebts.filter((d) => d.dueDay <= nextDay)
      if (dueDebts.length > 0) {
        const remaining = next.pendingDebts.filter((d) => d.dueDay > nextDay)
        let paid = next.debtsPaid
        const logs = [...next.logs]
        for (const d of dueDebts) {
          paid += 1
          next = applyDelta(pack, next, d.delta)
          logs.push({
            id: makeLogId(nextDay, 'debt', logs.length),
            day: nextDay,
            kind: 'debt',
            badge: `暗雷爆雷 · ${d.label} · ${formatDeltaBadges(d.delta, pack)}`,
            text: `${d.triggerText}（${d.delta.reason}）`,
            warn: true,
          })
        }
        next = { ...next, pendingDebts: remaining, debtsPaid: paid, logs }
      }

      return checkCollapseOrOverflow(pack, next)
    }
  }
}

/* ---------- Local Best Record Persistence ---------- */
const BEST_KEY_PREFIX = 'ccnoteasy:desk_best:'

export function loadDeskBest(packId: string): DeskBestRecord {
  try {
    const raw = localStorage.getItem(BEST_KEY_PREFIX + packId)
    if (!raw) return { bestDay: 0, victories: 0, runs: 0, discoveredCombos: [] }
    return JSON.parse(raw) as DeskBestRecord
  } catch {
    return { bestDay: 0, victories: 0, runs: 0, discoveredCombos: [] }
  }
}

export function recordDeskRun(packId: string, state: DeskState): DeskBestRecord {
  const prev = loadDeskBest(packId)
  const combos = new Set(prev.discoveredCombos)
  for (const c of state.combosTriggered) combos.add(c.id)
  const next: DeskBestRecord = {
    bestDay: Math.max(prev.bestDay, state.ending?.daysSurvived ?? state.day),
    victories: prev.victories + (state.ending?.victory ? 1 : 0),
    runs: prev.runs + 1,
    discoveredCombos: [...combos],
  }
  try {
    localStorage.setItem(BEST_KEY_PREFIX + packId, JSON.stringify(next))
  } catch {
    // ignore storage quota errors
  }
  return next
}

/* ---------- Integrity & Redline Validator (used by scripts/validate-story.ts) ---------- */
export function validateDeskPack(pack: DeskPack): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  const checkStr = (s: string | undefined, path: string) => {
    if (!s) return
    if (BANNED_JP_RE.test(s)) errors.push(`[BANNED_LEXICON] ${path}: "${s.slice(0, 30)}"`)
  }
  const checkDelta = (d: DeskDelta | undefined, path: string) => {
    if (!d) return
    if (!d.reason.trim()) errors.push(`[MISSING_REASON] ${path}: delta must have non-empty reason`)
    checkStr(d.reason, path)
  }

  checkStr(pack.title, 'title')
  checkStr(pack.subtitle, 'subtitle')
  checkStr(pack.tagline, 'tagline')

  const caseIds = new Set<string>()
  for (const c of pack.cases) {
    if (caseIds.has(c.id)) errors.push(`[DUPLICATE_CASE] ${c.id}`)
    caseIds.add(c.id)
    checkStr(c.title, `cases.${c.id}.title`)
    checkStr(c.brief, `cases.${c.id}.brief`)
    if (c.choices.length < 2) errors.push(`[TOO_FEW_CHOICES] cases.${c.id}`)
    for (const cl of c.claims) {
      checkStr(cl.surface, `cases.${c.id}.claims.${cl.id}.surface`)
      checkStr(cl.proof, `cases.${c.id}.claims.${cl.id}.proof`)
      checkDelta(cl.exposeDelta, `cases.${c.id}.claims.${cl.id}.exposeDelta`)
    }
    for (const ch of c.choices) {
      checkStr(ch.label, `cases.${c.id}.choices.${ch.id}.label`)
      checkStr(ch.replyText, `cases.${c.id}.choices.${ch.id}.replyText`)
      checkDelta(ch.delta, `cases.${c.id}.choices.${ch.id}.delta`)
      if (ch.debt) {
        checkStr(ch.debt.triggerText, `cases.${c.id}.choices.${ch.id}.debt`)
        checkDelta(ch.debt.delta, `cases.${c.id}.choices.${ch.id}.debt.delta`)
      }
    }
  }

  for (const a of pack.advisors) {
    checkStr(a.perkDesc, `advisors.${a.id}`)
    checkDelta(a.onDutyDelta, `advisors.${a.id}.onDutyDelta`)
    checkDelta(a.dirtyBonusDelta, `advisors.${a.id}.dirtyBonusDelta`)
    checkDelta(a.rejectBonusDelta, `advisors.${a.id}.rejectBonusDelta`)
  }

  for (const o of pack.orders) {
    checkStr(o.name, `orders.${o.id}`)
    checkDelta(o.delta, `orders.${o.id}.delta`)
    if (o.debt) checkDelta(o.debt.delta, `orders.${o.id}.debt.delta`)
  }

  for (const cmb of pack.combos) {
    checkStr(cmb.name, `combos.${cmb.id}`)
    checkStr(cmb.quote, `combos.${cmb.id}.quote`)
    checkDelta(cmb.bonusDelta, `combos.${cmb.id}.bonusDelta`)
    if (cmb.extraDebt) checkDelta(cmb.extraDebt.delta, `combos.${cmb.id}.extraDebt.delta`)
  }

  return { ok: errors.length === 0, errors }
}
