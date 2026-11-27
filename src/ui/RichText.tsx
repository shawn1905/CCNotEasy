import { tokenizeRichText } from '../core/richText.ts'
import type { ChapterBundle } from '../core/schema.ts'

interface RichTextProps {
  text: string
  bundle: ChapterBundle
  onOpenGloss: (id: string) => void
  onOpenSubtext: (id: string) => void
}

export function RichText({ text, bundle, onOpenGloss, onOpenSubtext }: RichTextProps) {
  const tokens = tokenizeRichText(text)
  return (
    <>
      {tokens.map((tok, idx) => {
        if (tok.kind === 'text') return <span key={idx}>{tok.text}</span>
        if (tok.kind === 'bold') {
          return (
            <strong key={idx} className="cc-bold">
              {tok.text}
            </strong>
          )
        }
        if (tok.kind === 'gloss') {
          const entry = bundle.gloss[tok.id]
          const label = tok.label ?? entry?.term ?? tok.id
          return (
            <button
              key={idx}
              type="button"
              className="cc-gloss-btn"
              onClick={(e) => {
                e.stopPropagation()
                onOpenGloss(tok.id)
              }}
            >
              {label}
              <span className="cc-sup">注</span>
            </button>
          )
        }
        const entry = bundle.subtexts[tok.id]
        const label = tok.label ?? entry?.surface ?? tok.id
        return (
          <button
            key={idx}
            type="button"
            className="cc-subtext-btn"
            onClick={(e) => {
              e.stopPropagation()
              onOpenSubtext(tok.id)
            }}
          >
            {label}
            <span className="cc-sup">译</span>
          </button>
        )
      })}
    </>
  )
}
