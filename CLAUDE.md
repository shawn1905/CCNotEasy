# CLAUDE.md

本仓库完整规则见根目录 [`AGENTS.md`](./AGENTS.md)（规则唯一来源，接手必读）。

## 默认自驱开工（当用户只说「领一格开干 / 贡献一章」时）
1. 读 `AGENTS.md`、`docs/collab/GRID_MATRIX.md`、`docs/collab/THREADS.md`、`src/core/schema.ts`。
2. 从 `GRID_MATRIX.md` 挑一个 `ready` 格子，**在独立 git worktree** 中仅修改该格 `allowed_paths`（不碰 `src/core/` 与 `registry.ts`）。
3. 严格以《三国志》裴注与《资治通鉴》正史为骨（禁演义伪史、禁回望叙述、禁日式词与技术黑话、所有数值变动附非空中文 `reason`）。
4. 写完必跑 `npm run typecheck && npm run validate:story && npm run build`，全绿后提交 PR 并汇报。
