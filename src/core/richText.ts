/* ==========================================================================
   CCNotEasy Unified Rich-Text Tokenizer
   Supports: **bold**, {{gloss:id|label}}, {{subtext:id|label}}, {{词条}} shorthand
   ========================================================================== */

export type RichToken =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'gloss'; id: string; label?: string }
  | { kind: 'subtext'; id: string; label?: string }

const TOKEN_RE = /(\*\*[^*\n]+\*\*|\{\{(?:gloss|subtext):[^}|]+(?:\|[^}]+)?\}\}|\{\{[^}:|]+\}\})/g

export function tokenizeRichText(raw: string): RichToken[] {
  const tokens: RichToken[] = []
  let lastIdx = 0
  let match: RegExpExecArray | null

  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(raw)) !== null) {
    if (match.index > lastIdx) {
      tokens.push({ kind: 'text', text: raw.slice(lastIdx, match.index) })
    }
    const seg = match[0]
    if (seg.startsWith('**') && seg.endsWith('**')) {
      tokens.push({ kind: 'bold', text: seg.slice(2, -2) })
    } else if (seg.startsWith('{{gloss:')) {
      const inner = seg.slice(8, -2)
      const [id, label] = inner.split('|')
      tokens.push({ kind: 'gloss', id: id!.trim(), label: label?.trim() })
    } else if (seg.startsWith('{{subtext:')) {
      const inner = seg.slice(10, -2)
      const [id, label] = inner.split('|')
      tokens.push({ kind: 'subtext', id: id!.trim(), label: label?.trim() })
    } else if (seg.startsWith('{{') && seg.endsWith('}}')) {
      const term = seg.slice(2, -2).trim()
      tokens.push({ kind: 'gloss', id: term, label: term })
    }
    lastIdx = TOKEN_RE.lastIndex
  }

  if (lastIdx < raw.length) {
    tokens.push({ kind: 'text', text: raw.slice(lastIdx) })
  }
  return tokens
}
