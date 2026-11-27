import { useState } from 'react'
import { evalCondition } from '../core/eval.ts'
import type { ChapterBundle, SaveState, SceneNode } from '../core/schema.ts'
import { exportEndingCarryover } from '../core/storage.ts'
import { audioEngine } from './audioEngine.ts'

interface EndingCardProps {
  bundle: ChapterBundle
  save: SaveState
  node: SceneNode
  onAudioSync: () => void
  onReplay: () => void
  onJumpAct: (actId: string) => void
}

function buildLocalDiagnosis(save: SaveState, isCollapse?: boolean): string {
  if (isCollapse) {
    return '【逻辑一致性】局部看似步步有理，却忽略了账本底线——把同一项核心资源透支到红线归零，属于「战术勤奋、账房失控」型崩盘。'
  }
  const modes = save.choiceLog.map((c) => c.stampKind).filter(Boolean)
  const uniq = new Set(modes)
  if (uniq.size === 1 && modes.length >= 3) {
    const only = modes[0]
    if (only === 'dirty') {
      return '【逻辑一致性 · 100% 枭雄闭环】三案连耍三手脏招，极度结果导向、毫无心理负担——能活下来，但组织信用已彻底清零。'
    }
    if (only === 'reject') {
      return '【逻辑一致性 · 100% 铁壁审计】每案全部掀桌查办，宁可顶着死线爆表也绝不妥协原则——强风控性格，但极易输给时间。'
    }
    return '【逻辑一致性 · 100% 赌势头】每案全选顺势体面，永远押注场面能盖过隐患——顺风无敌，逆风一波带走。'
  }
  return '【逻辑一致性 · 灵活变阵】你盯着血条与死线动态切换手腕（该查办时查办，该耍脏招时毫不手软）——典型的现实政治家操盘风格。'
}

function buildLlmPrompt(bundle: ChapterBundle, save: SaveState, node: SceneNode): string {
  const end = node.ending
  const logLines = save.choiceLog
    .map((c, i) => `${i + 1}. [${c.act}] ${c.label}${c.reasons.length ? `（${c.reasons.join('；')}）` : ''}`)
    .join('\n')

  const resStr = bundle.resources.map((r) => `${r.label} ${save.resources[r.id] ?? 0}`).join(' / ')
  const dlStr = bundle.deadlines.map((d) => `${d.label} ${save.deadlines[d.id] ?? 0}/${d.max}`).join(' / ')

  return [
    '你是一位毒舌、敏锐、懂《三国志》又懂组织政治的马伯庸风历史谋士。',
    `我刚通关互动历史游戏《${bundle.title} · ${bundle.subtitle}》，以下是我的完整决策流水，请点评我：`,
    '',
    `【终局】${end?.badge ?? ''} — ${end?.title ?? ''}`,
    `【余账】${resStr}${dlStr ? ` | ${dlStr}` : ''}`,
    `【曹氏脏招】${save.dirtyTricks.length ? save.dirtyTricks.map((t) => t.label).join('；') : '无'}`,
    '【逐拍选择流水】',
    logLines || '（无记录）',
    '',
    '请分三段犀利点评（300~450字，拒绝官腔鸡汤）：',
    '1. 前后选择逻辑一致性（是首尾一贯，还是看菜下碟、前冲后收？）',
    '2. 决策性格画像（如果我在现实里带团队或做业务会是什么风格？给一个三国人物类比）',
    '3. 最致命/最神来的一拍，以及如果我当时反其道行之（What-If）会演变成什么结局？',
  ].join('\n')
}

export function EndingCard({ bundle, save, node, onAudioSync, onReplay, onJumpAct }: EndingCardProps) {
  const end = node.ending
  const [eggSpeed, setEggSpeed] = useState(1)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedCarry, setCopiedCarry] = useState(false)

  const diag = buildLocalDiagnosis(save, end?.isCollapse)
  const llmPrompt = buildLlmPrompt(bundle, save, node)

  function handleEgg(spd: number) {
    setEggSpeed(spd)
    audioEngine.setEggSpeed(spd)
    onAudioSync()
  }

  function handleCopyPrompt() {
    audioEngine.playStamp(false)
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(llmPrompt).then(() => {
        setCopiedPrompt(true)
        setTimeout(() => setCopiedPrompt(false), 2400)
      })
    }
  }

  function handleExportCarryover() {
    audioEngine.playExpose()
    const payload = JSON.stringify(exportEndingCarryover(bundle, save), null, 2)
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(payload).then(() => {
        setCopiedCarry(true)
        setTimeout(() => setCopiedCarry(false), 2400)
      })
    }
  }

  return (
    <div className="cc-ending">
      <div className="cc-ending-hero">
        <span className="cc-ending-badge">{end?.badge ?? '终局'}</span>
        <h2 style={{ margin: 0, fontSize: 19, color: 'var(--fg-bright)' }}>{end?.title ?? node.id}</h2>
        {end?.subtitle && <div style={{ marginTop: 4, fontSize: 12.5, color: 'var(--fg-dim)' }}>{end.subtitle}</div>}
      </div>

      {end?.buildName && (
        <div className="cc-ending-sec">
          <div className="cc-sec-kicker">// 本局可吹流派</div>
          <div style={{ padding: '10px 12px', border: '1px solid var(--accent)', background: 'var(--selection)' }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--fg-bright)' }}>{end.buildName}</div>
            {end.buildQuote && (
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>
                {end.buildQuote}
              </div>
            )}
          </div>
        </div>
      )}

      {save.dirtyTricks.length > 0 && (
        <div className="cc-ending-sec">
          <div className="cc-sec-kicker">// 入夜高利贷利息结算</div>
          {save.dirtyTricks.map((t) => (
            <div
              key={t.id}
              style={{
                padding: '8px 10px',
                marginBottom: 6,
                borderLeft: '2px solid var(--danger)',
                background: 'var(--bg)',
                fontSize: 12.5,
              }}
            >
              <strong>【{t.label}】</strong>
              {t.interest}
            </div>
          ))}
        </div>
      )}

      {bundle.historyDossier.length > 0 && (
        <div className="cc-ending-sec">
          <div className="cc-sec-kicker">// 《三国志》史实对照卷宗</div>
          {bundle.historyDossier.map((d, idx) => {
            const hit = evalCondition(d.when, save)
            return (
              <div
                key={idx}
                style={{
                  padding: '8px 10px',
                  marginBottom: 6,
                  border: '1px solid var(--muted)',
                  background: 'var(--bg)',
                  fontSize: 12.5,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ color: 'var(--fg-bright)' }}>{d.title}</strong>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: 10, color: hit ? 'var(--ok)' : 'var(--accent)' }}>
                    {hit ? '[合史]' : '[旁支]'}
                  </span>
                </div>
                <div>{hit ? d.playerHit : d.playerMiss}</div>
                <div style={{ marginTop: 4, fontSize: 11.5, color: 'var(--fg-dim)' }}>史载：{d.canonNote}</div>
              </div>
            )
          })}
        </div>
      )}

      <div className="cc-ending-sec">
        <div className="cc-sec-kicker">// AI 谋士复盘 & What-If 推演提示词</div>
        <div
          style={{
            padding: '9px 11px',
            border: '1px solid var(--muted)',
            borderLeft: '3px solid var(--teal)',
            background: 'var(--bg)',
            fontSize: 13,
            lineHeight: 1.65,
            marginBottom: 8,
          }}
        >
          {diag}
        </div>
        <details style={{ border: '1px solid var(--muted)', background: 'var(--bg-darker)', marginBottom: 8 }}>
          <summary style={{ padding: '7px 10px', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-dim)', cursor: 'pointer' }}>
            展开专属 LLM 深度点评 & What-If 提示词
          </summary>
          <pre style={{ margin: 0, padding: 9, fontSize: 11, whiteSpace: 'pre-wrap', maxHeight: 190, overflowY: 'auto', userSelect: 'text' }}>
            {llmPrompt}
          </pre>
        </details>
        <button
          type="button"
          className="cc-btn-secondary"
          style={{ marginTop: 0, borderColor: copiedPrompt ? 'var(--ok)' : 'var(--teal)', color: copiedPrompt ? 'var(--ok)' : 'var(--fg-bright)' }}
          onClick={handleCopyPrompt}
        >
          {copiedPrompt ? '已复制！粘贴给任意 AI 即可深度点评' : '一键复制专属 LLM 点评提示词'}
        </button>
      </div>

      {bundle.theme.bgmOrigFile && (
        <div className="cc-ending-sec">
          <div className="cc-sec-kicker">// 🎧 结局彩蛋 · 拨快时光听原曲</div>
          <div className="cc-egg-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 11.5, marginBottom: 8 }}>
              <span>背景音乐变速滑杆</span>
              <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                {eggSpeed >= 8 ? '8x（已还原原速！）' : `${eggSpeed}x`}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={eggSpeed}
              onChange={(e) => handleEgg(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
            <div className="cc-egg-presets">
              {[1, 2, 4, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`cc-egg-btn${eggSpeed === s ? ' is-on' : ''}`}
                  onClick={() => {
                    audioEngine.playExpose()
                    handleEgg(s)
                  }}
                >
                  {s === 1 ? '1x 慢放' : s === 8 ? '8x 原曲' : `${s}x`}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg)' }}>
              {eggSpeed >= 8
                ? '彩蛋揭晓：刚才陪你在赤壁熬夜的玄墨氛围音，其实是把这段田园流行旋律放慢 8 倍做的！'
                : '拖动滑杆或点「8x 原曲」，听听刚才伴你熬过赤壁寒夜的背景音原本是什么旋律。'}
            </div>
          </div>
        </div>
      )}

      <div className="cc-ending-sec">
        <button
          type="button"
          className="cc-btn-primary"
          onClick={() => {
            audioEngine.resetEggSpeed()
            audioEngine.playStamp(false)
            onReplay()
          }}
        >
          再来一局（换套打法 / 脏招试试）
        </button>

        {bundle.acts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
            {bundle.acts.map((act) => (
              <button
                key={act.id}
                type="button"
                className="cc-btn-secondary"
                style={{ marginTop: 0, padding: '7px 6px', fontSize: 11.5 }}
                onClick={() => {
                  audioEngine.resetEggSpeed()
                  audioEngine.playStamp(false)
                  onJumpAct(act.id)
                }}
              >
                跳回{act.num}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          className="cc-btn-secondary"
          onClick={handleExportCarryover}
        >
          {copiedCarry ? '已复制跨章继承 JSON（EndingCarryover）' : '导出本局跨章继承包 JSON（续写接口）'}
        </button>
      </div>
    </div>
  )
}
