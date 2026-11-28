import { useState } from 'react'
import type { ChapterBundle, Choice, CounterClaim, Effect } from '../core/schema.ts'
import { RichText } from './RichText.tsx'
import { audioEngine } from './audioEngine.ts'

interface CounterCaseCardProps {
  bundle: ChapterBundle
  title: string
  docTitle: string
  prompt: string
  minExpose: number
  claims: CounterClaim[]
  choices: Choice[]
  onApplyClaimEffects: (effects: Effect[]) => void
  onChoose: (choice: Choice) => void
  onOpenGloss: (id: string) => void
  onOpenSubtext: (id: string) => void
}

export function CounterCaseCard({
  bundle,
  title,
  docTitle,
  prompt,
  minExpose,
  claims,
  choices,
  onApplyClaimEffects,
  onChoose,
  onOpenGloss,
  onOpenSubtext,
}: CounterCaseCardProps) {
  const [exposedIds, setExposedIds] = useState<string[]>([])
  const [stampedChoice, setStampedChoice] = useState<Choice | null>(null)

  const unlocked = exposedIds.length >= minExpose

  function handleExpose(claim: CounterClaim) {
    if (stampedChoice || exposedIds.includes(claim.id)) return
    audioEngine.playExpose()
    setExposedIds((prev) => [...prev, claim.id])
    if (claim.effects && claim.effects.length > 0) {
      onApplyClaimEffects(claim.effects)
    }
  }

  function handleStamp(choice: Choice) {
    if (!unlocked || stampedChoice) return
    audioEngine.playStamp(choice.stampKind === 'dirty')
    setStampedChoice(choice)
    onChoose(choice)
  }

  return (
    <div className="cc-case">
      <div className="cc-case-head">
        <span className="cc-case-title">
          [{title}] {docTitle}
        </span>
        <span style={{ color: 'var(--fg-dim)' }}>
          已戳穿 {exposedIds.length}/{claims.length} 处矛盾
        </span>
      </div>

      {stampedChoice && (
        <div
          className={`cc-stamp-mark${
            stampedChoice.stampKind === 'dirty'
              ? ' is-dirty'
              : stampedChoice.stampKind === 'reject'
                ? ' is-reject'
                : ''
          }`}
        >
          {stampedChoice.stampText ?? '已批'}
        </div>
      )}

      <div className="cc-case-body">
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--fg-dim)' }}>
          {unlocked ? '矛盾已全部戳穿——请拿起丞相大印，拍板处置：' : prompt}
        </p>

        {claims.map((cl) => {
          const isExp = exposedIds.includes(cl.id)
          return (
            <div key={cl.id} className={`cc-claim${isExp ? ' is-exposed' : ''}`}>
              <button
                type="button"
                className="cc-claim-btn"
                onClick={() => handleExpose(cl)}
                disabled={Boolean(stampedChoice)}
              >
                <span>
                  <RichText
                    text={cl.surface}
                    bundle={bundle}
                    onOpenGloss={onOpenGloss}
                    onOpenSubtext={onOpenSubtext}
                  />
                </span>
                <span className="cc-claim-badge">{isExp ? '已打脸' : '核对证物'}</span>
              </button>
              {isExp && (
                <div className="cc-claim-proof">
                  <strong>【巡营打脸】</strong>
                  {cl.proof}
                </div>
              )}
            </div>
          )
        })}

        <div className={`cc-stamps${unlocked ? '' : ' is-locked'}`}>
          {choices.map((ch) => (
            <button
              key={ch.id}
              type="button"
              className={`cc-stamp-btn kind-${ch.stampKind ?? 'approve'}${ch.isBait ? ' is-bait' : ''}${ch.label.startsWith('【架空】') ? ' is-whatif' : ''}`}
              disabled={!unlocked || Boolean(stampedChoice)}
              onClick={() => handleStamp(ch)}
            >
              <div className="cc-stamp-top">
                <span className="cc-stamp-name">{ch.label}</span>
                {ch.hint && <span className="cc-stamp-cost">{ch.hint}</span>}
              </div>
              {ch.interestNote && <div className="cc-stamp-note">{ch.interestNote}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
