# 曹操不容易（CCNotEasy）

手机优先的双害选择对话游戏。你是曹操，在赤壁前夜做一道道「两个坏选项」——稳或活、真或假、信或疑、快或等。

当前可玩章节：**赤壁前夜**（Demo）。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:3847`

## 怎么玩

- 轻触对话区推进气泡
- 点蓝色虚线词打开史实注释（gloss）
- A / B 二选一；选项会改旗帜并写入代价
- 终局战报与结局由四次抉择拼装（跑得掉 / 撑住 / 烧穿）
- 进度存在 `localStorage`；标题栏「重开」可清档

## 技术栈

Vite + React + TypeScript + Tailwind CSS v4。叙事内容在 `src/game/content/`，事件机在 `src/game/engine.ts`。视觉默认 Tokyo Night（Omarchy Quattro）。

## 文档

策划与编剧材料在 `docs/`、`PLAN.md`。剧本源稿：`docs/content/red-cliffs-eve/script.md`。
