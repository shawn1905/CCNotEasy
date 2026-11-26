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
  when?: Partial<Flags>
  unless?: Partial<Flags>
}

export type Choice = {
  id: string
  label: string
  hint?: string
  effects?: Effect[]
  next: string
}

/** 抉择旁可读史料卡：白话先，原文次，出处必有 */
export type ReferenceCard = {
  id: string
  title: string
  /** 白话：决策可读 */
  plain: string
  /** 原文短引 */
  quote: string
  /** 出处 */
  source: string
  /** 对哪一边更有参考价值 */
  leans: 'A' | 'B' | 'both'
  /** 一层标签：史载 / 注 / 推演边界 */
  layer: 'A' | 'B' | 'C'
  /** 史料库分题 */
  topic?: string
}

export type SceneNode = {
  id: string
  title?: string
  lines: BubbleLine[]
  choices?: Choice[]
  /** 本节点可打开的史料卡 id */
  refs?: string[]
  next?: string
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
  refs: Record<string, ReferenceCard>
}
