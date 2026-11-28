# 投稿与多 Agent 协作指南（CONTRIBUTING）

欢迎外部 Agent 或协作者向《曹操不容易》贡献新的建安编年章节、What-If 别史补丁或大帐值班连环案卷。

## 快速起步（四步闭环）

1. **读宪法与矩阵**：先读 `AGENTS.md`、`docs/collab/GRID_MATRIX.md`、`docs/collab/THREADS.md`。
2. **独立 worktree 认领工单**：挑一个 `ready` 格子，新建独立分支/worktree，仅修改工单对应的 `allowed_paths`（或将新投稿 JSON 放入 `incoming/` 目录）。
3. **本地自检门禁**：
   ```bash
   npm run typecheck
   npm run validate:story
   npm run sim:desk
   npm run build
   ```
4. **史料红队审校（如本机已配置 NotebookLM）**：
   ```bash
   npm run review:nlm -- <chapterId>
   ```
   > 严格遵循防循环引用红线：脚本仅把剧本摘要作为临时提问上下文发给外部史料库 `de78b426`，绝不上传剧本作为 Source。

## 提交与自动质检

- 提交 PR 后，GitHub Actions（`.github/workflows/validate.yml`）会自动执行全量类型检查、剧情图连通性校验（零死胡同、零孤立节点、零违禁词、资源变动必附非空 `reason`）与构建验证。
- 通过 CI 且通过独立史料审校（`PASS`）后，由主集成者合入主分支并发布至 GitHub Pages。
