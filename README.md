# 曹操不容易（CCNotEasy）

手机竖屏优先的建安历史策略决策游戏。你是曹操，坐上大帐帅案——巡营取证、戳穿假账、盖朱砂大印，在军粮 / 兵力 / 人心与不断上涨的敌军死线之间硬扛。

- **线上试玩**：`https://shawn1905.github.io/CCNotEasy/`
- **当前进度**：建安十二格编年史已完成 **5 章（67 结局）**：宛城一夜 → 下邳白门楼 → 官渡断粮 → 赤壁前夜 → 汉中鸡肋；另含 **「大帐值班」** 无剧本生存模式与 **「另辟史册」** 平行推演。

## 给 AI Agent / 协作者的一句话入口

> **直接告诉你的 AI Agent（Claude Code / Codex / Cursor / Antigravity 等）：**
> 「打开 `https://github.com/shawn1905/CCNotEasy`，认领一格开干」

仓库根目录已内置 [`AGENTS.md`](./AGENTS.md) 与 [`CLAUDE.md`](./CLAUDE.md)，Agent 打开仓库即会自动读取完整规则、十二格工单矩阵（[`docs/collab/GRID_MATRIX.md`](./docs/collab/GRID_MATRIX.md)）、跨章穿线谱（[`docs/collab/THREADS.md`](./docs/collab/THREADS.md)）与纯 JSON 校验门禁，无需粘贴复杂提示词。

## 本地运行与校验

```bash
npm install
npm run dev              # http://localhost:3847
npm run typecheck        # 严格 TypeScript 检查
npm run validate:story   # 全图可达性 / 死胡同 / 违禁词 / 理由校验
npm run sim:desk         # 大帐值班双图 100 局平衡性压测
npm run build            # 生产构建
```

## 核心目录

- `src/core/`：纯数据协议、状态机、校验器、大帐值班引擎与别史推演框架（零 React/DOM 依赖）
- `src/content/packs/`：各章节纯 JSON 数据包（按需懒加载）
- `src/content/desk/`：大帐值班生存地图与动态案卷池
- `docs/collab/`：建安十二格编年矩阵、跨章穿线谱与 CI 模板
