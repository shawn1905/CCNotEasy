import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createInitialDeskState,
  getCurrentDeskCase,
  loadDeskBest,
  recordDeskRun,
  reduceDesk,
} from '../core/deskEngine.ts'
import type { DeskBestRecord, DeskCaseCategory, DeskPack, DeskState } from '../core/deskSchema.ts'
import { ThemeShell } from './ThemeShell.tsx'
import { audioEngine } from './audioEngine.ts'

interface DeskModeProps {
  packs: DeskPack[]
  audioOn: boolean
  onToggleAudio: () => void
  onExit: () => void
}

const CAT_LABELS: Record<DeskCaseCategory, { text: string; tone: string }> = {
  routine: { text: '常规军务', tone: 'var(--teal)' },
  crisis: { text: '危机急报', tone: 'var(--danger)' },
  backlash: { text: '脏招反噬', tone: 'var(--warn)' },
  opportunity: { text: '奇遇破局', tone: 'var(--accent)' },
}

export function DeskMode({ packs, audioOn, onToggleAudio, onExit }: DeskModeProps) {
  const [packIdx, setPackIdx] = useState(0)
  const pack = packs[packIdx] ?? packs[0]!
  const [state, setState] = useState<DeskState>(() => createInitialDeskState(pack))
  const [best, setBest] = useState<DeskBestRecord>(() => loadDeskBest(pack.id))
  const [copied, setCopied] = useState(false)
  const recordedRef = useRef(false)
  const streamRef = useRef<HTMLElement | null>(null)

  function handleSwitchPack(nextIdx: number) {
    if (nextIdx === packIdx) return
    const nextPack = packs[nextIdx]
    if (!nextPack) return
    audioEngine.playExpose()
    recordedRef.current = false
    setCopied(false)
    setPackIdx(nextIdx)
    setState(createInitialDeskState(nextPack))
    setBest(loadDeskBest(nextPack.id))
  }

  useEffect(() => {
    audioEngine.configureTheme(pack.theme)
    document.title = `${pack.title} · 曹操不容易`
  }, [pack])

  useEffect(() => {
    audioEngine.setMood(state.mood)
  }, [state.mood])

  useEffect(() => {
    if (state.phase === 'ended' && !recordedRef.current) {
      recordedRef.current = true
      setBest(recordDeskRun(pack.id, state))
    }
  }, [pack.id, state])

  useEffect(() => {
    const el = streamRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollTop = 0
    })
  }, [state.day, state.phase, state.caseIndex])

  const curCase = useMemo(() => getCurrentDeskCase(pack, state), [pack, state])
  const curAdvisor = useMemo(
    () => pack.advisors.find((a) => a.id === state.advisorId) ?? null,
    [pack.advisors, state.advisorId],
  )

  const sortedDebts = useMemo(
    () => [...state.pendingDebts].sort((a, b) => a.dueDay - b.dueDay),
    [state.pendingDebts],
  )

  const recentLogs = useMemo(() => state.logs.slice(-6).reverse(), [state.logs])

  function handleReset() {
    audioEngine.playStamp(false)
    recordedRef.current = false
    setCopied(false)
    setState(createInitialDeskState(pack))
  }

  function handleCopyReport() {
    if (!state.ending) return
    const combosStr =
      state.combosTriggered.length > 0
        ? state.combosTriggered.map((c) => `【${c.name}】`).join('、')
        : '无'
    const text = [
      `《曹操不容易 · ${pack.title}》战报`,
      `结果：${state.ending.victory ? '满旬凯旋' : '大帐崩盘'}（撑过 ${state.ending.daysSurvived}/${pack.targetDays} 日）`,
      `执政流派：${state.ending.buildName}`,
      `批阅案卷：${state.casesHandled} 份 · 动用脏招：${state.dirtyCount} 次 · 借头拆弹：${state.debtsCancelled} 次`,
      `打出涌现配方：${combosStr}`,
      `评语：「${state.ending.buildQuote}」`,
    ].join('\n')
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const dlUrgent = state.deadline >= pack.deadline.warnAt

  return (
    <ThemeShell theme={pack.theme} mood={state.mood}>
      <header className="cc-hud">
        <div className="cc-hud-row1">
          <div className="cc-res-grid">
            {pack.resources.map((spec) => {
              const val = state.resources[spec.id]
              const isCrit = val <= spec.collapseAt
              const isWarn = !isCrit && val <= spec.warnAt
              return (
                <div
                  key={spec.id}
                  className={`cc-res-box${isCrit ? ' is-crit' : isWarn ? ' is-warn' : ''}`}
                >
                  <div className="cc-res-top">
                    <span className="cc-res-name">
                      {spec.label}
                      {isCrit ? (
                        <span className="cc-res-tag">红线</span>
                      ) : isWarn ? (
                        <span className="cc-res-tag">告急</span>
                      ) : null}
                    </span>
                    <span className="cc-res-val">{val}</span>
                  </div>
                  <div className="cc-res-bars" aria-hidden="true">
                    {Array.from({ length: spec.max }).map((_, idx) => (
                      <span key={idx} className={`cc-res-seg${idx < val ? ' on' : ''}`} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            className={`cc-hud-btn${audioOn ? ' is-on' : ''}`}
            onClick={onToggleAudio}
            aria-label={audioOn ? '关闭声音' : '开启声音'}
            title={pack.theme.bgmLabel}
          >
            {audioOn ? '音' : '静'}
          </button>
          <button
            type="button"
            className="cc-hud-btn"
            onClick={handleReset}
            aria-label="重开江陵十日"
            title="重开"
          >
            重
          </button>
          <button
            type="button"
            className="cc-hud-btn"
            onClick={() => {
              audioEngine.playExpose()
              onExit()
            }}
            aria-label="返回选章"
            title="返回选章"
          >
            章
          </button>
        </div>

        <div className={`cc-dl-row${dlUrgent ? ' is-urgent' : ''}`}>
          <span className="cc-dl-label">
            第 <strong>{state.day}{state.endless ? ' (无尽)' : `/${pack.targetDays}`}</strong> 日 ·{' '}
            <strong>{pack.deadline.label}</strong>
          </span>
          <div className="cc-dl-track" aria-hidden="true">
            {Array.from({ length: pack.deadline.max }).map((_, i) => (
              <span
                key={i}
                className={`cc-dl-pip${i < state.deadline ? (dlUrgent ? ' danger' : ' filled') : ''}`}
              />
            ))}
          </div>
          <span className="cc-dl-num">
            {state.deadline}/{pack.deadline.max}
          </span>
        </div>

        {packs.length > 1 && state.day === 1 && state.phase === 'pick_advisor' && (
          <div className="cc-ch-tabs" role="tablist" aria-label="切换值班地图" style={{ marginTop: 6 }}>
            {packs.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={idx === packIdx}
                className={`cc-ch-tab${idx === packIdx ? ' is-active' : ''}`}
                onClick={() => handleSwitchPack(idx)}
              >
                <strong>{p.title}</strong>
                <span>{p.difficultyLabel}</span>
              </button>
            ))}
          </div>
        )}

        {sortedDebts.length > 0 && (
          <div className="cc-desk-debts" aria-label="未结高利贷暗雷">
            {sortedDebts.slice(0, 3).map((d) => {
              const left = Math.max(0, d.dueDay - state.day)
              return (
                <span key={d.uid} className={`cc-desk-debt-chip${left <= 1 ? ' is-soon' : ''}`}>
                  雷·{d.label} ({left === 0 ? '明日爆' : `${left}日后`})
                </span>
              )
            })}
            {sortedDebts.length > 3 && (
              <span className="cc-desk-debt-chip">+{sortedDebts.length - 3}</span>
            )}
          </div>
        )}
      </header>

      <section className="cc-stream" ref={streamRef}>
        {state.phase === 'pick_advisor' && (
          <div className="cc-case">
            <div className="cc-case-head">
              <span className="cc-case-title">
                [第 {state.day} 日 · 辰时升帐] 点选今日当值幕僚
              </span>
              <span style={{ color: 'var(--fg-dim)' }}>
                日终房租：{state.day % 2 === 1 ? '江东备战 +1' : '军粮 -1'}
              </span>
            </div>
            <div className="cc-case-body">
              <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg-dim)', lineHeight: 1.55 }}>
                每日挑选一位幕僚随侍帅案，不可连值两日。善用幕僚特长配合「主动手令」，在死线与红线间周旋满 {pack.targetDays} 日。
              </p>
              <div className="cc-desk-grid">
                {pack.advisors.map((adv) => {
                  const locked = adv.id === state.lastAdvisorId
                  return (
                    <button
                      key={adv.id}
                      type="button"
                      disabled={locked}
                      className={`cc-desk-adv${locked ? ' is-locked' : ''}`}
                      onClick={() => {
                        audioEngine.playStamp(false)
                        setState((s) => reduceDesk(pack, s, { type: 'PICK_ADVISOR', advisorId: adv.id }))
                      }}
                    >
                      <div className="cc-desk-adv-top">
                        <strong>{adv.name}</strong>
                        <span>{locked ? '昨日已值 · 休沐' : adv.title}</span>
                      </div>
                      <div className="cc-desk-adv-perk">{adv.perkTitle}</div>
                      <div className="cc-desk-adv-desc">{adv.perkDesc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {state.phase === 'desk_case' && curCase && (
          <>
            {/* Active Orders Bar */}
            <div className="cc-desk-orders">
              <div className="cc-desk-orders-head">
                <span>
                  帅案手令（每日限发 1 枚 · {curAdvisor ? `当值：${curAdvisor.name}` : ''}）
                </span>
                <span style={{ color: state.orderUsedToday ? 'var(--fg-dim)' : 'var(--accent)' }}>
                  {state.orderUsedToday ? '今日已用' : '可配合案卷打组合拳'}
                </span>
              </div>
              <div className="cc-desk-order-row">
                {pack.orders.map((ord) => {
                  const cd = state.orderCooldowns[ord.id] ?? 0
                  const disabled = state.orderUsedToday || cd > 0
                  return (
                    <button
                      key={ord.id}
                      type="button"
                      disabled={disabled}
                      className={`cc-desk-order-btn${disabled ? ' is-disabled' : ''}`}
                      title={ord.subtitle}
                      onClick={() => {
                        audioEngine.playStamp(Boolean(ord.debt))
                        setState((s) => reduceDesk(pack, s, { type: 'USE_ORDER', orderId: ord.id }))
                      }}
                    >
                      <strong>{ord.name}</strong>
                      <span>{cd > 0 ? `冷却 ${cd} 日` : ord.stampText}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Current Case Card */}
            <div className="cc-case">
              <div className="cc-case-head">
                <span className="cc-case-title" style={{ color: CAT_LABELS[curCase.category].tone }}>
                  [{CAT_LABELS[curCase.category].text}] {curCase.title}
                </span>
                <span style={{ color: 'var(--fg-dim)' }}>
                  今日第 {state.caseIndex + 1}/{state.todayCaseIds.length} 份
                </span>
              </div>
              <div className="cc-case-body">
                <div className="cc-msg-head" style={{ marginBottom: 0 }}>
                  <span className="cc-msg-spk">{curCase.sender}</span>
                  <span className="cc-msg-role">{curCase.senderRole}</span>
                  <span className="cc-msg-tag">{curCase.docTitle}</span>
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--fg-bright)' }}>
                  {curCase.brief}
                </p>

                {curCase.claims.map((cl) => {
                  const isExp = state.exposedClaimIds.includes(cl.id)
                  return (
                    <div key={cl.id} className={`cc-claim${isExp ? ' is-exposed' : ''}`}>
                      <button
                        type="button"
                        className="cc-claim-btn"
                        onClick={() => {
                          if (!isExp) audioEngine.playExpose()
                          setState((s) => reduceDesk(pack, s, { type: 'EXPOSE_CLAIM', claimId: cl.id }))
                        }}
                      >
                        <span>{cl.surface}</span>
                        <span className="cc-claim-badge">{isExp ? '已打脸' : '刮纸背核对'}</span>
                      </button>
                      {isExp && (
                        <div className="cc-claim-proof">
                          <strong>【巡营实查】</strong>
                          {cl.proof}
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="cc-stamps">
                  {curCase.choices.map((ch) => {
                    const locked =
                      Boolean(ch.requiresExposed) &&
                      state.exposedClaimIds.length < curCase.claims.length
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        disabled={locked}
                        className={`cc-stamp-btn kind-${ch.stampKind}${locked ? ' is-locked-btn' : ''}`}
                        onClick={() => {
                          audioEngine.playStamp(ch.stampKind === 'dirty')
                          setState((s) =>
                            reduceDesk(pack, s, { type: 'RESOLVE_CASE', choiceId: ch.id }),
                          )
                        }}
                      >
                        <div className="cc-stamp-top">
                          <span className="cc-stamp-name">
                            [{ch.stampText}] {ch.label}
                          </span>
                          <span className="cc-stamp-cost">{ch.hint}</span>
                        </div>
                        {ch.interestNote && <div className="cc-stamp-note">{ch.interestNote}</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {state.phase === 'day_summary' && (
          <div className="cc-case">
            <div className="cc-case-head">
              <span className="cc-case-title">[第 {state.day} 日 · 戌时封笔] 今日大帐结算</span>
              <span style={{ color: 'var(--teal)' }}>
                距满旬还剩 {pack.targetDays - state.day} 日
              </span>
            </div>
            <div className="cc-case-body">
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: 'var(--fg)' }}>
                第 {state.day} 日案卷已批毕，日终房租已扣。
                {sortedDebts.some((d) => d.dueDay <= state.day + 1) ? (
                  <strong style={{ color: 'var(--warn)' }}>
                    {' '}
                    警告：明日辰时将有高利贷暗雷到期爆雷！
                  </strong>
                ) : (
                  ' 明日辰时继续升帐值班。'
                )}
              </p>
              <button
                type="button"
                className="cc-btn-primary"
                onClick={() => {
                  audioEngine.playStamp(false)
                  setState((s) => reduceDesk(pack, s, { type: 'NEXT_DAY' }))
                }}
              >
                进入第 {state.day + 1} 日 · 辰时升帐
              </button>
            </div>
          </div>
        )}

        {state.phase === 'ended' && state.ending && (
          <div className="cc-ending">
            <div className="cc-ending-hero">
              <span className="cc-ending-badge">
                {state.ending.victory ? '满旬凯旋 · VICTORY' : '大帐崩盘 · COLLAPSE'}
              </span>
              <h2 style={{ margin: '0 0 4px', fontSize: 20, color: 'var(--fg-bright)' }}>
                {state.ending.title}
              </h2>
              <div style={{ fontSize: 12.5, color: 'var(--fg-dim)' }}>{state.ending.subtitle}</div>
              <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.65 }}>
                {state.ending.verdict}
              </p>
            </div>

            <div className="cc-ending-sec">
              <div className="cc-sec-kicker">// 执政流派 · BUILD</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--accent)' }}>
                {state.ending.buildName}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg)', marginTop: 4, lineHeight: 1.6 }}>
                「{state.ending.buildQuote}」
              </div>
              <div className="cc-rules-grid" style={{ marginTop: 10 }}>
                <div className="cc-rule-pill">
                  <strong>批阅案卷</strong>
                  <span>{state.casesHandled} 份</span>
                </div>
                <div className="cc-rule-pill">
                  <strong>脏招 / 拆弹</strong>
                  <span>
                    {state.dirtyCount} 次 / 撕 {state.debtsCancelled} 雷
                  </span>
                </div>
                <div className="cc-rule-pill">
                  <strong>历史最佳</strong>
                  <span>
                    {best.bestDay}/{pack.targetDays} 日 · {best.victories} 胜
                  </span>
                </div>
              </div>
            </div>

            <div className="cc-ending-sec">
              <div className="cc-sec-kicker">
                // 涌现配方图鉴（已发现 {best.discoveredCombos.length}/{pack.combos.length}）
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pack.combos.map((cmb) => {
                  const hit = best.discoveredCombos.includes(cmb.id)
                  return (
                    <div
                      key={cmb.id}
                      style={{
                        padding: '7px 9px',
                        border: `1px solid ${hit ? 'var(--accent)' : 'var(--muted)'}`,
                        background: 'var(--bg-darker)',
                        fontSize: 12,
                      }}
                    >
                      <strong style={{ color: hit ? 'var(--accent)' : 'var(--fg-dim)' }}>
                        {hit ? `【${cmb.name}】` : '【未发现配方】'}
                      </strong>
                      <div style={{ color: 'var(--fg-dim)', marginTop: 2 }}>
                        {hit ? cmb.quote : '尝试在不同案卷或连日手令之间打组合拳解锁。'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="cc-ending-sec" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {state.ending.victory && !state.endless && (
                <button
                  type="button"
                  className="cc-btn-primary"
                  style={{ background: 'var(--teal)', color: 'var(--bg-darker)' }}
                  onClick={() => {
                    audioEngine.playStamp(false)
                    recordedRef.current = false
                    setState((s) => reduceDesk(pack, s, { type: 'CONTINUE_ENDLESS' }))
                  }}
                >
                  继续无尽镇守 · 冲击极限存活天数
                </button>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="cc-btn-primary" style={{ flex: 1 }} onClick={handleReset}>
                  再来一局
                </button>
                <button
                  type="button"
                  className="cc-btn-secondary"
                  style={{ flex: 1, marginTop: 0 }}
                  onClick={handleCopyReport}
                >
                  {copied ? '已复制战报 ✓' : '复制战报晒单'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Ledger Feed */}
        {recentLogs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="cc-act-divider">
              <span>大帐流水（近 {recentLogs.length} 条）</span>
            </div>
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className={`cc-strip${log.warn ? ' is-warn' : ''}${log.kind === 'combo' ? ' is-combo' : ''}`}
              >
                <span className="cc-strip-badge">{log.badge}</span>
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </ThemeShell>
  )
}
