export type FlagName =
  | 'haste'
  | 'plague_honesty'
  | 'loose_ships'
  | 'suspect_defection'

export type Flags = Record<FlagName, boolean>

export type Speaker = 'system' | 'cao' | 'cheng' | 'jia' | 'xun' | 'soldier'

export type Effect =
  | { set: FlagName; value: boolean }
  | { cost: string }

export type BubbleLine = {
  speaker: Speaker
  text: string
  /** show only when all listed flags match */
  when?: Partial<Flags>
  /** hide when any listed flag matches these values */
  unless?: Partial<Flags>
}

export type Choice = {
  id: string
  label: string
  hint?: string
  effects?: Effect[]
  next: string
}

export type SceneNode = {
  id: string
  title?: string
  lines: BubbleLine[]
  choices?: Choice[]
  /** auto-advance after last line */
  next?: string
  /** special: assemble battle report then route ending */
  kind?: 'normal' | 'report' | 'ending'
  endingId?: string
}

export type GlossEntry = {
  id: string
  title: string
  body: string
  source?: string
}

export type Chapter = {
  id: string
  title: string
  subtitle: string
  start: string
  nodes: Record<string, SceneNode>
  gloss: Record<string, GlossEntry>
}
