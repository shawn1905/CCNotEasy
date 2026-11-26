# 技术架构（已确认）

```
确认时间：2026-11-26 Asia/Shanghai
原则：现代 · 丝滑 · 轻量
```

## 一句话

**Vite + TypeScript + React 做 Omarchy 聊天气泡壳；自研极薄 JSON 事件机推剧情；第一版不上 Ink / Twine / Monogatari / Rust。**

## 选型

| 层 | 选择 | 不选（及原因） |
|---|---|---|
| 应用壳 | Vite + React + TS + Tailwind | Next（切片无 SSR 需求，更重）；全 Rust UI（气泡/LLM 摩擦大） |
| 叙事运行时 | 自研 JSON 事件图（几百行） | inkjs（切片偏重，长线可再接）；Twine/Monogatari（默认 UI 不对） |
| 存档 | `localStorage`（单机） | 账号/云存（第一版不做） |
| LLM | 后置 HTTP API；离线写死战报降级 | 第一版切片可先 mock |
| 音效 BGM | 静态资源 + Web Audio / `<audio>` | 重型中间件 |

## 目录意向（脚手架时落地）

```text
src/
  ui/           # 气泡、选项、顶栏资源条（Omarchy）
  engine/       # 事件机：推进、选肢、资源结算、存档
  content/      # 赤壁前夜 scenes/*.json
  audio/        # UI 音效 + 一套古意 BGM
```

## 内容格式（草案）

单场景节点大致字段：

- `id` / `speaker` / `bubbles[]`（顺序推送）
- `choices[]`：`label`、`hint`（诱向史实可用）、`effects`（钱帛/粮草/兵力）、`next`
- `tags`：史实 / 拟写 / 演义（三色分离）
- 可选 `report`：战报结算页

手写 JSON；第一版不做可视化编辑器。

## 运行时循环

```text
读节点 → 逐条冒泡 → 等二选一 → 结算资源 → 跳转 next → …
资源归零/结局旗 → 结局页
```

可连点推进；**无强制现实时间等待**（对齐《生命线》交互但不锁 10–15 分钟一节）。

## 性能与流畅

- 首包只加载当前节内容；不做大图立绘
- 气泡动画用 CSS；避免大列表全量重绘（聊天窗虚拟化仅在日志很长时再加）
- 存档写入防抖；读档一次 hydrate

## 注释与资源（切片要做）

- 气泡支持 `{{gloss:id}}` → 点击小面板（白话一句）  
- 资源 delta 必须带 `reason` 字段，UI 结算复述；见 `annotations-and-resources.md`

## 后置（明确不进切片）

- Ink 内容层迁移  
- Rust/WASM 状态核  
- 科研/制造、ASCII 特效、跨纪传线  
- 联机 / 账号  

## 验收（架构层面）

- 手机浏览器可玩；切换节点无整页闪白  
- 改 JSON 即可改剧情，不必改引擎  
- 三资源与存档可测  
