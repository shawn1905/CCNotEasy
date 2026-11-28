import { useState } from 'react'
import {
  DEFAULT_LLM_CONFIG,
  WHATIF_STYLE_OPTIONS,
  loadLlmConfig,
  saveLlmConfig,
} from '../core/whatIfGen.ts'
import type { LlmConfig, WhatIfStyle } from '../core/whatIfGen.ts'

interface WhatIfDrawerProps {
  busy: boolean
  error: string | null
  onClose: () => void
  onStart: (style: WhatIfStyle, userIdea: string, cfg: LlmConfig) => void
}

export function WhatIfDrawer({ busy, error, onClose, onStart }: WhatIfDrawerProps) {
  const [style, setStyle] = useState<WhatIfStyle>('twist')
  const [userIdea, setUserIdea] = useState('')
  const [cfg, setCfg] = useState<LlmConfig>(() => loadLlmConfig())
  const [showCfg, setShowCfg] = useState(false)

  const hasKey = Boolean(cfg.apiKey.trim())

  function handleSaveCfg(next: LlmConfig) {
    setCfg(next)
    saveLlmConfig(next)
  }

  return (
    <div
      className="cc-modal-bg"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onClose()
      }}
    >
      <div className="cc-modal-sheet">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-ui)',
            fontSize: 11,
            color: 'var(--teal)',
            marginBottom: 8,
          }}
        >
          <span>// WHAT-IF 动态推演引擎 · 5 防线框架</span>
          <button type="button" disabled={busy} onClick={onClose}>
            关闭
          </button>
        </div>

        <p style={{ margin: '0 0 10px', fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-dim)' }}>
          从当前历史节点撕开一条全新的 <strong style={{ color: 'var(--fg-bright)' }}>3 幕动态平行世界线</strong>（承·柜台假账 → 转·谋士对质 → 合·专属结局），终局可一键导出 JSON 沉淀入库。
        </p>

        <div className="cc-wi-styles">
          {WHATIF_STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={busy}
              className={`cc-wi-style-btn${style === opt.id ? ' is-on' : ''}`}
              onClick={() => setStyle(opt.id)}
            >
              <strong>{opt.label}</strong>
              <span>{opt.desc}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 10 }}>
          <label
            htmlFor="cc-wi-idea"
            style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--fg-dim)', marginBottom: 4 }}
          >
            可选脑洞指令（留空则由引擎按当前账本自由发挥）
          </label>
          <input
            id="cc-wi-idea"
            type="text"
            disabled={busy}
            value={userIdea}
            onChange={(e) => setUserIdea(e.target.value)}
            placeholder="例如：趁夜把天子送给袁绍 / 假装病危钓内鬼…"
            className="cc-wi-input"
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <button
            type="button"
            className="cc-back-link"
            style={{ width: '100%', textAlign: 'left', padding: '6px 8px', display: 'flex', justifyContent: 'space-between' }}
            onClick={() => setShowCfg((v) => !v)}
          >
            <span>
              引擎模式：{hasKey ? `真 LLM 直连 (${cfg.model})` : '离线演示模式（免 Key 即玩）'}
            </span>
            <span style={{ color: 'var(--teal)' }}>{showCfg ? '收起设置 ▲' : '配置 API Key ▼'}</span>
          </button>

          {showCfg && (
            <div className="cc-wi-cfg">
              <div style={{ fontSize: 11, color: 'var(--fg-dim)', marginBottom: 6 }}>
                兼容 OpenAI / DeepSeek / Gemini 接口，Key 仅保存在你的浏览器本地。留空即自动走离线演示通路。
              </div>
              <input
                type="text"
                value={cfg.baseUrl}
                onChange={(e) => handleSaveCfg({ ...cfg, baseUrl: e.target.value })}
                placeholder={DEFAULT_LLM_CONFIG.baseUrl}
                className="cc-wi-input"
                style={{ marginBottom: 6 }}
              />
              <input
                type="text"
                value={cfg.model}
                onChange={(e) => handleSaveCfg({ ...cfg, model: e.target.value })}
                placeholder={DEFAULT_LLM_CONFIG.model}
                className="cc-wi-input"
                style={{ marginBottom: 6 }}
              />
              <input
                type="password"
                value={cfg.apiKey}
                onChange={(e) => handleSaveCfg({ ...cfg, apiKey: e.target.value })}
                placeholder="sk-...（留空使用离线演示）"
                className="cc-wi-input"
              />
            </div>
          )}
        </div>

        {error && (
          <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--danger)', lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        <button
          type="button"
          className="cc-btn-primary"
          disabled={busy}
          style={{ marginTop: 12, background: 'var(--teal)', color: 'var(--bg-darker)' }}
          onClick={() => onStart(style, userIdea, cfg)}
        >
          {busy
            ? '正在按五道防线推演第 1 幕…'
            : hasKey
              ? '✨ 调用 LLM 撕开新世界线'
              : '✨ 启动 3 幕动态推演（离线演示）'}
        </button>
      </div>
    </div>
  )
}
