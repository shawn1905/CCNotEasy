/* ==========================================================================
   CCNotEasy Lazy Chapter Registry (Mobile Startup Budget Friendly)
   ========================================================================== */

import type { ChapterBundle } from '../core/schema.ts'

export interface ChapterManifest {
  id: string
  num: string
  title: string
  subtitle: string
  estimatedMinutes: number
  themeName: string
  load: () => Promise<ChapterBundle>
}

export const CHAPTER_REGISTRY: ChapterManifest[] = [
  {
    id: 'ch01-red-cliffs',
    num: '第一章',
    title: '赤壁前夜',
    subtitle: '建安十三年冬 · 顺风局怎么亏光',
    estimatedMinutes: 15,
    themeName: '赤壁玄墨 · 烬火',
    load: async () => {
      const mod = await import('./packs/ch01-red-cliffs/bundle.json')
      return mod.default as unknown as ChapterBundle
    },
  },
  {
    id: 'ch02-guandu',
    num: '第二章',
    title: '官渡断粮',
    subtitle: '建安五年秋 · 绝境熬出乌巢火',
    estimatedMinutes: 15,
    themeName: '官渡寒霜 · 孤垒',
    load: async () => {
      const mod = await import('./packs/ch02-guandu/bundle.json')
      return mod.default as unknown as ChapterBundle
    },
  },
]
