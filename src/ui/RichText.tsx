import { useEffect, useMemo, useRef, useState } from 'react'
import { tokenizeRichText } from '../core/richText.ts'
import type { ChapterBundle } from '../core/schema.ts'
import { audioEngine } from './audioEngine.ts'

interface RichTextProps {
  text: string
  bundle: ChapterBundle
  onOpenGloss: (id: string) => void
  onOpenSubtext: (id: string) => void
  animate?: boolean
  skipSignal?: number
  onTypingChange?: (typing: boolean) => void
}

type RevealUnit =
  | { kind: 'char'; ch: string; emph: boolean }
  | { kind: 'gloss'; id: string; label?: string }
  | { kind: 'subtext'; id: string; label?: string }

function flattenTokens(raw: string): RevealUnit[] {
  const tokens = tokenizeRichText(raw)
  const units: RevealUnit[] = []
  for (const tok of tokens) {
    if (tok.kind === 'text' || tok.kind === 'bold') {
      const emph = tok.kind === 'bold'
      for (const ch of Array.from(tok.text)) {
        units.push({ kind: 'char', ch, emph })
      }
    } else if (tok.kind === 'gloss') {
      units.push({ kind: 'gloss', id: tok.id, label: tok.label })
    } else {
      units.push({ kind: 'subtext', id: tok.id, label: tok.label })
    }
  }
  return units
}

function unitDelay(u: RevealUnit, prevCh: string): number {
  if (u.kind !== 'char') return 85
  let d = u.emph ? 34 : 22
  if ('，、；：'.includes(u.ch)) d += 95
  else if ('。！？'.includes(u.ch)) d += 155
  else if ((u.ch === '—' && prevCh === '—') || (u.ch === '…' && prevCh === '…')) d += 200
  else if ('」”』'.includes(u.ch)) d += 40
  return d
}

export function RichText({
  text,
  bundle,
  onOpenGloss,
  onOpenSubtext,
  animate = false,
  skipSignal = 0,
  onTypingChange,
}: RichTextProps) {
  const units = useMemo(() => flattenTokens(text), [text])
  const [shown, setShown] = useState<number>(() => (animate ? 0 : units.length))
  const initialSkipRef = useRef(skipSignal)
  const onTypingRef = useRef(onTypingChange)
  onTypingRef.current = onTypingChange

  // If skipSignal increments while animating, immediately finish this line
  useEffect(() => {
    if (animate && skipSignal !== initialSkipRef.current) {
      setShown(units.length)
    }
  }, [animate, skipSignal, units.length])

  // Notify parent when typing status transitions
  const isTyping = animate && shown < units.length
  useEffect(() => {
    if (!animate) return
    onTypingRef.current?.(isTyping)
    return () => {
      if (isTyping) onTypingRef.current?.(false)
    }
  }, [animate, isTyping])

  // Step-by-step springy character reveal with punctuation pauses + tactile Foley/haptics
  useEffect(() => {
    if (!animate || shown >= units.length) return
    const cur = units[shown]!
    const prev = shown > 0 ? units[shown - 1] : undefined
    const prevCh = prev?.kind === 'char' ? prev.ch : ''

    const timer = window.setTimeout(() => {
      if (cur.kind === 'char') {
        if (cur.emph) {
          audioEngine.playCharPop(true)
          if (shown % 2 === 0) audioEngine.vibrate(5)
        } else if (shown % 2 === 0 && !/\s/.test(cur.ch)) {
          audioEngine.playCharPop(false)
        }
        if (cur.ch === '！' || cur.ch === '？' || (cur.ch === '—' && prevCh === '—')) {
          audioEngine.vibrate(6)
        }
      } else {
        audioEngine.playCharPop(true)
        audioEngine.vibrate(5)
      }
      setShown((n) => n + 1)
    }, shown === 0 ? 18 : unitDelay(cur, prevCh))

    return () => window.clearTimeout(timer)
  }, [animate, shown, units])

  const slice = animate ? units.slice(0, shown) : units

  return (
    <>
      {slice.map((u, idx) => {
        if (u.kind === 'char') {
          if (animate) {
            return (
              <span key={idx} className={u.emph ? 'cc-char-pop is-emph' : 'cc-char-pop'}>
                {u.ch}
              </span>
            )
          }
          return u.emph ? (
            <strong key={idx} className="cc-bold">
              {u.ch}
            </strong>
          ) : (
            <span key={idx}>{u.ch}</span>
          )
        }
        if (u.kind === 'gloss') {
          const entry = bundle.gloss[u.id]
          const label = u.label ?? entry?.term ?? u.id
          return (
            <button
              key={idx}
              type="button"
              className={`cc-gloss-btn${animate ? ' cc-token-pop' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                onOpenGloss(u.id)
              }}
            >
              {label}
              <span className="cc-sup">注</span>
            </button>
          )
        }
        const entry = bundle.subtexts[u.id]
        const label = u.label ?? entry?.surface ?? u.id
        return (
          <button
            key={idx}
            type="button"
            className={`cc-subtext-btn${animate ? ' cc-token-pop' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              onOpenSubtext(u.id)
            }}
          >
            {label}
            <span className="cc-sup">译</span>
          </button>
        )
      })}
      {isTyping && <span className="cc-caret" aria-hidden="true" />}
    </>
  )
}
