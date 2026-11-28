/* ==========================================================================
   CLI Desk Balance & Chain-Case Monte Carlo Simulator (npm run sim:desk)
   Validates DeskPacks and runs 100-run balance simulations per map.
   ========================================================================== */

import { GUANDU_7D_PACK } from '../src/content/desk/guandu7d.ts'
import { JIANGLING_10D_PACK } from '../src/content/desk/jiangling10d.ts'
import {
  createInitialDeskState,
  getCurrentDeskCase,
  reduceDesk,
  validateDeskPack,
} from '../src/core/deskEngine.ts'
import type { DeskPack } from '../src/core/deskSchema.ts'

const PACKS: DeskPack[] = [JIANGLING_10D_PACK, GUANDU_7D_PACK]
const RUNS = 100

function simulatePack(pack: DeskPack): void {
  const report = validateDeskPack(pack)
  if (!report.ok) {
    console.error(`[sim:desk] FAIL ${pack.id}:`, report.errors)
    process.exit(1)
  }

  let wins = 0
  let totalDays = 0
  let combos = 0
  let cancels = 0
  let chainFinals = 0

  for (let s = 1; s <= RUNS; s++) {
    let st = createInitialDeskState(pack, s * 1009 + 17)
    let guard = 0
    while (st.phase !== 'ended' && guard++ < 240) {
      if (st.phase === 'pick_advisor') {
        const advs = pack.advisors.filter((a) => a.id !== st.lastAdvisorId)
        const adv = advs[(s + st.day) % advs.length]!
        st = reduceDesk(pack, st, { type: 'PICK_ADVISOR', advisorId: adv.id })
      } else if (st.phase === 'desk_case') {
        const cur = getCurrentDeskCase(pack, st)
        if (!cur) break
        for (const cl of cur.claims) {
          st = reduceDesk(pack, st, { type: 'EXPOSE_CLAIM', claimId: cl.id })
        }
        if (!st.orderUsedToday && st.day % 2 === 1) {
          const ords = pack.orders.filter((o) => (st.orderCooldowns[o.id] ?? 0) === 0)
          if (ords.length > 0) {
            const ord = ords[(s + st.day) % ords.length]!
            st = reduceDesk(pack, st, { type: 'USE_ORDER', orderId: ord.id })
          }
        }
        if (st.phase === 'desk_case') {
          const ch = cur.choices[(s + st.day) % cur.choices.length]!
          st = reduceDesk(pack, st, { type: 'RESOLVE_CASE', choiceId: ch.id })
        }
      } else if (st.phase === 'day_summary') {
        st = reduceDesk(pack, st, { type: 'NEXT_DAY' })
      }
    }

    if (st.ending?.victory) wins++
    totalDays += st.ending?.daysSurvived ?? st.day
    combos += st.combosTriggered.length
    cancels += st.debtsCancelled
    if (st.seenCaseIds.includes('case_chain_spy_3') || st.seenCaseIds.includes('gd_chain_smuggle_3')) {
      chainFinals++
    }
  }

  console.log(
    `[sim:desk] PASS ${pack.id} (${pack.cases.length} cases, ${RUNS} runs) -> winRate: ${Math.round((wins / RUNS) * 100)}%, avgDays: ${(totalDays / RUNS).toFixed(1)}/${pack.targetDays}, combos: ${combos}, cancels: ${cancels}, chainFinals: ${chainFinals}`,
  )
}

for (const p of PACKS) {
  simulatePack(p)
}
