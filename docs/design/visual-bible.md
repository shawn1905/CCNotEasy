# 视觉规范初稿（Art Bible）

```
确认意向：2026-11-26 Asia/Shanghai（修订中）
默认皮肤：待定 — 火烧云向（非 Tokyo Night）
气质：暗色终端桌面 · 方正锐利 · 聊天气泡 · 手机优先
章节换肤：同一套 CSS 变量契约，整页换主题（结构不变）
```

## 0. 纠偏：不是 Tokyo Night

用户反馈要的气质更接近**火烧云**（暖橙/余烬），不是 Tokyo Night 的冷蓝。

| 主题 | 底 | 强调 | 观感 | 链接 |
|------|----|------|------|------|
| Tokyo Night | `#1a1b26` 蓝黑 | `#7aa2f7` 冷蓝 | 夜江、终端蓝 | [gallery](https://omarchy.gallery/themes/tokyo-night) |
| **Ristretto** | `#2c2525` 可可褐 | `#f38d70` 珊瑚橙 | **余烬、焦岸、暖炉** | [gallery](https://omarchy.gallery/themes/ristretto) |
| **Retro 82** | `#05182e` 深海蓝 | `#faa968` 暮橙 | **火烧云压江面** | [gallery](https://omarchy.gallery/themes/retro-82) |

**默认候选（二选一，待你点）：**

- **A · Ristretto** — 整页暖褐，更「烧过之后的岸」  
- **B · Retro 82** — 深蓝底 + 琥珀字/橙强调，更「天上火烧云、水上倒影」

Tokyo Night 可留作后期「北征/官渡」等冷色章节，**不当赤壁默认**。

## 1. 设计原则

| 原则 | 做法 |
|------|------|
| 跟 Omarchy 走 | 原样采用官方主题 `colors.toml`，不另造渐变皮 |
| 火烧赤壁感 | **暖强调（橙/珊瑚）压在深底上**；焰色是主角，不是冷蓝点缀 |
| 方正 | 圆角 ≤ 4px；忌胶囊大圆角 |
| 轻 | 无立绘、无大地图；氛围靠色表 + 细线 |
| 可换肤 | 组件只吃语义变量；换章 = 换 `[data-theme]` |

## 2. 默认主题（待锁定 A 或 B）

### 2.1A 候选 · Ristretto（余烬岸）

| Token | Hex | 语义 |
|-------|-----|------|
| `--bg` | `#2c2525` | 主背景 |
| `--bg-dark` | `#211b1b` | 顶栏 |
| `--bg-darker` | `#181414` | 最深 |
| `--bg-light` | `#3d2f2a` | 气泡底 |
| `--fg` | `#e6d9db` | 正文 |
| `--fg-dim` | `#72696a` | 次要 |
| `--fg-bright` | `#e6d9db` | 强调字 |
| `--accent` | `#f38d70` | 主 CTA / 诱向 |
| `--selection` | `#403e41` | 悬停 |
| `--muted` | `#72696a` | 边框 |
| `--danger` | `#fd6883` | 败报 |
| `--warn` / `--fire` | `#fb9a77` / `#f9cc6c` | 火攻、告警 |
| `--ok` | `#adda78` | 暂稳 |
| `--info` | `#85dacc` | 密信 |
| `--earth` | `#7d4d3b` | 钱帛 |

### 2.1B 候选 · Retro 82（火烧云）

| Token | Hex | 语义 |
|-------|-----|------|
| `--bg` | `#05182e` | 主背景（暮江） |
| `--bg-dark` | `#031222` | 顶栏 |
| `--bg-darker` | `#020c17` | 最深 |
| `--bg-light` | `#0a2540` | 气泡底 |
| `--fg` | `#f6dcac` | 正文（琥珀） |
| `--fg-dim` | `#3f8f8a` | 次要 |
| `--fg-bright` | `#f6dcac` | 强调字 |
| `--accent` | `#faa968` | 主 CTA / 火烧云 |
| `--selection` | `#134e5a` | 悬停 |
| `--muted` | `#2a6b78` | 边框 |
| `--danger` | `#f85525` | 败报 / 烈焰 |
| `--warn` / `--fire` | `#e97b3c` / `#faa968` | 火攻 |
| `--ok` | `#028391` | 暂稳（青） |
| `--info` | `#8cbfb8` | 密信 |
| `--earth` | `#743d1e` | 钱帛 |

### 2.2 CSS 契约（两套共用变量名）

```css
:root,
[data-theme="ristretto"],
[data-theme="retro-82"] {
  /* 具体 hex 见上表；只换数值，不换变量名 */
  --radius: 2px;
  --border: 1px solid var(--muted);
  --font-ui: "JetBrains Mono", "Sarasa Mono SC", "Noto Sans Mono CJK SC", ui-monospace, monospace;
  --font-prose: "IBM Plex Sans", "Noto Sans SC", system-ui, sans-serif;
}
```

字体意向：顶栏等宽；气泡可无衬线。最终字体包体积待脚手架时裁。

## 3. 布局与组件（手机优先）

```text
┌─────────────────────────┐
│ 钱帛  粮草  兵力   节名  │  ← 顶栏：bg-dark + 细底边
├─────────────────────────┤
│                         │
│  [军报] 气泡…           │  ← 对话流：可滚动
│  [谋士] 气泡…           │
│                         │
├─────────────────────────┤
│  [ A 选项 ] [ B 选项 ]  │  ← 底栏二选一：方钮，accent 描边
└─────────────────────────┘
```

| 组件 | 规范 |
|------|------|
| 顶栏 | 高 44–52px；三资源等宽数字；告急时对应色闪一下（非 glow） |
| 对方气泡 | 左对齐；`bg-light`；左边 2px `accent` 竖条（军报可用 `info`/`fire`） |
| 己方回执 | 右对齐；`selection` 底；字色 `fg-bright` |
| 选项钮 | 等高、全宽或对半；直角；默认 `border: muted`，主诱向项 `border/accent` |
| 战报 | 全宽等宽块；标题用 `fire`；正文 `fg` |
| 史实/拟写标签 | 极小字 `fg-dim`，不盖在图上（本来也无图） |

**禁止（初版）：** 大圆角卡片墙、毛玻璃、多层阴影、浮动徽章贴在主视觉上、紫粉渐变 hero。

## 4. 动效（少而准）

至少保留 2–3 个有意动作：

1. **气泡入场**：自下 8px + fade，120–180ms，错落入列  
2. **选项弹出**：底栏 slide-up 150ms  
3. **换章主题**：`background-color` / 边框色 250–300ms ease（整页变量过渡）  

可连点推进时缩短入场；尊重 `prefers-reduced-motion`。

## 5. 章节换肤（研究结论 → 方案）

### 5.1 做法

- 场景 JSON 可带 `"theme": "tokyo-night"`（或章级默认）  
- 根节点 `data-theme="…"`；只替换色表，**不换布局组件**  
- 变量名固定（上一节契约）；新主题 = 新一份同名字段  
- 切换时机：进入新「节/章」时一次；不在单次二选一里狂闪

### 5.2 初版主题库（借 Omarchy 官方盘，游戏内用中文代号）

| 游戏内 ID | 观感 | 建议挂载章节 | Omarchy 源 |
|-----------|------|--------------|------------|
| `ristretto` / `retro-82` | 余烬岸 / 火烧云（**赤壁默认，二选一**） | **赤壁前夜** | ristretto 或 retro-82 |
| `tokyo-night` | 夜蓝·冷江 | 官渡、北征等冷色章 | tokyo-night |
| `ash-camp` | 灰绿·疫雾 | 军中大疫、屯粮焦灼 | miasma |
| `grain-field` | 土黄·田亩 | 屯田、钱粮内政节 | gruvbox |
| `river-mist` | 雾青·墨色 | 江东密使、邦交 | kanagawa |

第一版**只实现锁定的默认那一套**；另备 1 个对照主题证明换肤管道即可。

### 5.3 换肤验收

- 换主题后气泡/顶栏/按钮仍可读（正文对比度目标 ≥ 4.5:1）  
- 资源告急色仍能从语义 token 映射出来  
- 不出现「半套旧色」闪烁

## 6. 与文案三色分离

| 标签 | 色 |
|------|-----|
| 史载 | `fg-dim` 前缀「史载」；不强行染色 |
| 拟写 | 可选 `info` 左边线 |
| 演义 | `special` 极淡标记，默认隐藏开关 |

## 7. 待你拍板

1. **赤壁默认：A Ristretto（余烬岸）还是 B Retro 82（火烧云）？**（可先打开 gallery 对比）  
2. 正文字体：偏等宽终稿，还是「顶栏等宽 + 气泡无衬线」？  
3. 章内火攻段要不要再换一档更烈的色，还是整节一色？

## 8. 参考

- Omarchy Tokyo Night 色表与截图：https://omarchy.gallery/themes/tokyo-night  
- 主题机制说明：https://omarchy.org/manual/themes/  
- 交互：`docs/design/interaction-lifeline.md`  
- 架构：`docs/design/architecture.md`
