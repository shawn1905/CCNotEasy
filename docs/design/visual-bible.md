# 视觉规范初稿（Art Bible）

```
确认：2026-11-26 Asia/Shanghai
默认：Omarchy Quattro 出厂套 — Tokyo Night 色表（先复用）
氛围：Quattro / Liftoff 暮色壁纸层（火烧云感来自背景，不是另换主题）
气质：暗色终端 · 方正锐利 · 聊天气泡 · 手机优先
章节换肤：同 CSS 变量契约；初版可只做东京夜
```

## 0. 已对齐

- 「奥迪四驱」= **Omarchy Quattro**；出厂默认主题是 **Tokyo Night**。  
- 火烧云观感主要来自默认壁纸（Liftoff 暮色 / Quattro 拉力车图），**UI chrome 仍是东京夜色表**。  
- 初版**先复用**这套：色用 Tokyo Night；可选加一层低对比度氛围底（暮色图或渐变近似），不另造 Ristretto/Retro82。

来源：[omarchy.gallery/tokyo-night](https://omarchy.gallery/themes/tokyo-night) · [Omarchy 4.5：Liftoff 为东京夜默认背景](https://omarchy.org/news/2026/11/omarchy-4-5/)

## 1. 设计原则

| 原则 | 做法 |
|------|------|
| 跟 Quattro 默认走 | 原样用 `themes/tokyo-night/colors.toml` |
| 火烧赤壁感 | 冷蓝 UI + 可选暮色氛围底；焰色用官方 `orange/yellow/red` 做战报/告急 |
| 方正 | 圆角 ≤ 4px；忌胶囊大圆角 |
| 轻 | 无立绘大地图；壁纸只作淡底或开场，不挡字 |
| 可换肤 | 组件只吃语义变量；换章 = 换 `[data-theme]`（后置） |

## 2. 默认主题 · Tokyo Night（锁定复用）

### 2.1 核心色（官方）

| Token | Hex | 游戏语义 |
|-------|-----|----------|
| `--bg` | `#1a1b26` | 主背景 |
| `--bg-dark` | `#13141c` | 顶栏 |
| `--bg-darker` | `#0e0e14` | 最深 |
| `--bg-light` | `#24283b` | 气泡/面板 |
| `--fg` | `#a9b1d6` | 正文 |
| `--fg-dim` | `#565f89` | 次要、时间戳 |
| `--fg-bright` | `#c0caf5` | 标题、选项强调 |
| `--accent` | `#7aa2f7` | 主 CTA、史实诱向 |
| `--selection` | `#292e42` | 悬停/己方气泡 |
| `--muted` | `#414868` | 边框 |

### 2.2 语义强调

| Token | Hex | 用途 |
|-------|-----|------|
| `--danger` | `#f7768e` | 败报、兵力告急 |
| `--warn` | `#e0af68` | 粮草紧张 |
| `--fire` | `#ff9e64` | 火攻、战报高光 |
| `--ok` | `#9ece6a` | 暂稳、回升 |
| `--info` | `#449dab` | 密信、情报 |
| `--special` | `#ad8ee6` | 拟写/演义标签（慎用） |
| `--earth` | `#75493d` | 钱帛 |

### 2.3 CSS 模板

```css
:root,
[data-theme="tokyo-night"] {
  --bg: #1a1b26;
  --bg-dark: #13141c;
  --bg-darker: #0e0e14;
  --bg-light: #24283b;
  --fg: #a9b1d6;
  --fg-dim: #565f89;
  --fg-bright: #c0caf5;
  --accent: #7aa2f7;
  --selection: #292e42;
  --muted: #414868;
  --danger: #f7768e;
  --warn: #e0af68;
  --fire: #ff9e64;
  --ok: #9ece6a;
  --info: #449dab;
  --special: #ad8ee6;
  --earth: #75493d;
  --radius: 2px;
  --border: 1px solid var(--muted);
  --font-ui: "JetBrains Mono", "Sarasa Mono SC", "Noto Sans Mono CJK SC", ui-monospace, monospace;
  --font-prose: "IBM Plex Sans", "Noto Sans SC", system-ui, sans-serif;
}
```

氛围底（可选）：全屏极淡 `Liftoff` 类暮色图，上叠 `bg` 约 85–92% 不透明，保证正文对比度；无授权图时用 `bg → fire` 极淡径向近似。

## 3. 布局与组件（手机优先）

```text
┌─────────────────────────┐
│ 钱帛  粮草  兵力   节名  │
├─────────────────────────┤
│  [军报] 气泡…           │
│  [谋士] 气泡…           │
├─────────────────────────┤
│  [ A 选项 ] [ B 选项 ]  │
└─────────────────────────┘
```

| 组件 | 规范 |
|------|------|
| 顶栏 | 44–52px；`bg-dark`；三资源等宽 |
| 对方气泡 | 左；`bg-light`；左 2px `accent`/`fire`/`info` 竖条 |
| 己方回执 | 右；`selection`；`fg-bright` |
| 选项 | 方钮；诱向项 `accent` 边 |
| 战报 | 等宽块；标题 `fire` |

**禁止：** 大圆角卡片墙、毛玻璃、多层阴影、紫粉渐变 hero。

## 4. 动效

1. 气泡入场 120–180ms  
2. 选项底栏 slide-up 150ms  
3. 换章主题色 250–300ms（有第二主题时）  

尊重 `prefers-reduced-motion`。

## 5. 章节换肤（后置管道）

初版只实现 `tokyo-night`。变量名固定，以后可挂：

| ID | 用途 | 源 |
|----|------|-----|
| `tokyo-night` | **默认 / 赤壁** | Quattro 默认 |
| `ristretto` 等 | 其他章新鲜感 | Omarchy 官方盘 |

场景 JSON 可带 `"theme": "tokyo-night"`。

## 6. 文案三色

史载 / 拟写 / 演义：小字 `fg-dim`；拟写可选 `info` 左边线；演义 `special` 默认可关。

## 7. 仍可后补（不挡脚手架）

1. 正文字体：等宽到底，还是顶栏等宽 + 气泡无衬线？  
2. 赤壁节要不要淡暮色氛围底？  
3. 第二套换肤主题何时加？

## 8. 参考

- 交互：`docs/design/interaction-lifeline.md`  
- 架构：`docs/design/architecture.md`
