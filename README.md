# 曹操不容易（CCNotEasy）

手机优先的双害选择对话游戏。你是曹操，在赤壁前夜做一道道「两个坏选项」——快或等、真或假、密或疏、信或疑。

当前可玩章节：**赤壁前夜**（史料库加厚 Demo）。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:3847`

线上：`https://shawn1905.github.io/CCNotEasy/`

## 怎么玩

- 轻触对话区推进气泡
- 点蓝色虚线词打开词条（gloss）
- 标题栏「史料库」随时翻阅全档；抉择时「本议史料」只看本段相关原文
- A / B 二选一；选项改旗帜并写入代价；战报按四难拼装
- 进度存在 `localStorage`（v5）；boot 可重开

## 内容结构

| 路径 | 内容 |
|------|------|
| `src/game/content/redCliffsEve.ts` | 章节对话与抉择 |
| `src/game/content/gloss.ts` | 蓝词词条 |
| `src/game/content/dossiers/all.ts` | 史料卡（白话 + 原文 + 出处） |
| `docs/research/red-cliffs/timeline-sourced.md` | 考据时间线 |

## 技术栈

Vite + React + TypeScript + Tailwind CSS v4。视觉：Tokyo Night / Omarchy glass。

## 文档

策划与编剧材料在 `docs/`、`PLAN.md`。剧本源稿：`docs/content/red-cliffs-eve/script.md`。
