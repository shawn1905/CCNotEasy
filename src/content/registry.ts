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
    title: '赤壁前夜 · 江陵柜台日',
    subtitle: '建安十三年冬 · 绝对优势是怎么一笔一笔亏光的',
    estimatedMinutes: 15,
    themeName: '赤壁玄墨 · 烬火',
    load: async () => {
      const mod = await import('./packs/ch01-red-cliffs/bundle.json')
      return mod.default as unknown as ChapterBundle
    },
  },
]
