import { Fragment, type ReactNode } from 'react'

const GLOSS_RE = /\{\{([^}]+)\}\}/g

type Props = {
  text: string
  onGloss: (id: string) => void
}

export function GlossText({ text, onGloss }: Props) {
  const parts: ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null
  const re = new RegExp(GLOSS_RE)
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index))
    }
    const id = m[1]
    parts.push(
      <button
        key={`${id}-${m.index}`}
        type="button"
        className="gloss-term bg-transparent border-0 p-0"
        style={{ font: 'inherit' }}
        onClick={(e) => {
          e.stopPropagation()
          onGloss(id)
        }}
      >
        {id}
      </button>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <Fragment>{parts}</Fragment>
}
