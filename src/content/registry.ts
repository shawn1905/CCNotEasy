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
  {
    id: 'ch03-wancheng',
    num: '第三章',
    title: '宛城一夜',
    subtitle: '建安二年春 · 典韦曹昂改命夜',
    estimatedMinutes: 12,
    themeName: '宛城玄墨 · 夜火',
    load: async () => {
      const mod = await import('./packs/ch03-wancheng/bundle.json')
      return mod.default as unknown as ChapterBundle
    },
  },
  {
    id: 'ch04-baimenlou',
    num: '第四章',
    title: '下邳白门楼',
    subtitle: '建安三年冬 · 吕布刘备生死局',
    estimatedMinutes: 12,
    themeName: '白门寒霜 · 孤城',
    load: async () => {
      const mod = await import('./packs/ch04-baimenlou/bundle.json')
      return mod.default as unknown as ChapterBundle
    },
  },
  {
    id: 'ch05-hanzhong',
    num: '第五章',
    title: '汉中鸡肋',
    subtitle: '建安二十四年 · 暮年魏王终局',
    estimatedMinutes: 12,
    themeName: '秦岭寒霜 · 暮年',
    load: async () => {
      const mod = await import('./packs/ch05-hanzhong/bundle.json')
      return mod.default as unknown as ChapterBundle
    },
  },
]
