import { useState } from 'react'
import {
  DEFAULT_LLM_CONFIG,
  WHATIF_STYLE_OPTIONS,
  isKeylessProxyUrl,
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

  const isProxy = isKeylessProxyUrl(cfg.baseUrl)
  const hasKey = Boolean(cfg.apiKey.trim()) || isProxy

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
          <span>// 别史推演 · 另辟新局</span>
          <button type="button" disabled={busy} onClick={onClose}>
            关闭
          </button>
        </div>

        <p style={{ margin: '0 0 10px', fontSize: 12.5, lineHeight: 1.55, color: 'var(--fg-dim)' }}>
          从当前变局另起一行史书，择一谋略走向，展开 <strong style={{ color: 'var(--fg-bright)' }}>五幕全新平行世界线</strong>；若遇神展开，终局可一键收入「别史馆」永久珍藏。
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
            你的念头（可留空，由大帐顺势推演）
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
            <span>{hasKey ? '云端别史已就绪' : '离线演示模式'}</span>
            <span style={{ color: 'var(--teal)' }}>{showCfg ? '收起 ▲' : '高级设置 ▼'}</span>
          </button>

          {showCfg && (
            <div className="cc-wi-cfg">
              <div style={{ fontSize: 11, color: 'var(--fg-dim)', marginBottom: 6 }}>
                默认已接好免配置通道；如需切换自备接口或模型可在此修改（仅存本地）。
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
                placeholder="自备 Key（默认通道无需填写）"
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
          {busy ? '正在研墨起草新局…' : '✦ 执笔另辟新局'}
        </button>
      </div>
    </div>
  )
}
