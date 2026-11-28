# AGENTS.md —《曹操不容易》多 Agent 协作宪法（规则唯一来源）

> 本仓（`shawn1905/CCNotEasy`）采用源自 `generation-ship` 与 `generation-ship-foundry` 的**多 Agent 协作范式**：
> **正史为骨架，规则即一切，产物是规则下的纯数据插件，门禁脚本与一手史料库裁决合法性。**

---

## 0. 新 Agent 上手必读顺序

1. **本文件**（`AGENTS.md`，宪法与红线）
2. **`docs/collab/GRID_MATRIX.md`**（建安十二格编年状态矩阵与工单认领表）
3. **`docs/collab/THREADS.md`**（跨章因果穿线谱，避免各写各的断层）
4. **核心协议**：`src/core/schema.ts`（主线纯 JSON 协议）与 `src/core/deskSchema.ts`（大帐值班动态案卷协议）
5. **最新史料红队标尺**：`docs/design/nlm-historical-review-5ch.md`

---

## 1. 核心原则（文体与机制四铁律）

1. **正史为骨，逻辑补肉**：一切章节以《三国志》裴松之注、《资治通鉴》为骨架，围绕真实地理、粮道、水文、官制与派系利益展开两难，绝不照搬《三国演义》虚构桥段（如铁索活销、胡车儿盗戟、前线斩杨修等）。
2. **视角共时性（禁回望叙述）**：正文是「当时人在大帐里看到的急报、账簿与争执」，**严禁**「多年以后人们才知道……」「历史证明……」等上帝视角回望。
3. **去元层词与日式词**：正文中严禁出现任何技术/框架词（AI、LLM、五防线、JSON、坐标系等）及日式词/假名（`幕府/大名/武士/忍者/天守/城下町/浪人/切腹`）。
4. **账本硬约束**：
   - 所有资源与死线变动必须附非空中文 `reason`；
   - 引导权重偏向史实顺势项（`isBait: true`），不给脏招加「真香」诱导；
   - 幽默克制（≤ 1/10），全靠「表面官话 vs 巡营实查」的反差立住冷峻实感；
   - 紧凑单节可清：巡营背景字 ≤ 65 字、单句对白 ≤ 55 字，不注水。

---

## 2. 多 Agent 三角色协作制度

### 2.1 角色分工
- **执行者（Author Agent）**：
  - 从 `docs/collab/GRID_MATRIX.md` 认领 1 个 `ready` 状态的编年格（或 1 组大帐值班连环案卷）；
  - **必须在独立 git worktree 中工作**（禁止在同一工作目录直接切分支并发写）；
  - 严格遵守工单 `allowed_paths`（通常仅限 `src/content/packs/<chapter>/` 或 `incoming/`），**禁止擅自修改 `src/core/` 共享引擎或 `src/content/registry.ts`**；
  - 提交前本地必跑 `npm run typecheck && npm run validate:story && npm run build`。
- **史料审校者（Reviewer Agent，只读）**：
  - 针对执行者的 commit SHA 进行独立考据与逻辑评审；
  - 调用 `npm run review:nlm -- <chapterId>` 借助 NotebookLM 外部一手史料库（`de78b426`）逐项核查时间线、官职爵制、地理尺度、后勤与演义混入；
  - 输出结论：`PASS` / `FAIL`（附具体返修清单）/ `NEEDS_DECISION`。
- **主集成者（Integrator）**：
  - 审核通过后合并分支、将新章注册进 `src/content/registry.ts`、回填 `docs/collab/GRID_MATRIX.md` 与 `docs/collab/THREADS.md`；
  - 跑全量门禁 `npm run typecheck && npm run validate:story && npm run sim:desk && npm run build`；
  - 部署 `gh-pages`（**严禁删除 `/red-cliffs/` 与 `/red-cliffs-v2/` 目录**，仅覆盖根目录 `index.html`、`assets/`、`themes/`）。

### 2.2 同坐标学派条款（What-If 沉淀防膨胀）
- 每个主线节点最多常驻 3~4 个选项按钮。
- 同一历史节点沉淀多条 What-If 支线时，不无脑堆按钮，而是按 `school` 分类（如 `canon` / `whatif-diplomacy` / `whatif-logistics` / `whatif-gambit`）挂 `when` 条件或走轮换池/别史馆收录。

---

## 3. 绝对红线（不可逾越）

1. ❌ **NotebookLM 防循环引用红线**：`de78b426`（《建安曹操十二卷正史全集考据库》）**只能入库外部一手来源**（正史原文、学术论文、NotebookLM Deep Research 外部网页）；**严禁将本仓自产剧本、复盘、AI 总结上传为 NotebookLM Source**，评审时仅允许作为 `notebooklm ask` 的临时提问上下文。
2. ❌ **凭证永不落盘**：任何 API Key（含 OpenDesign / LLM Key）只允许存本机 `.env.local`（已被 `.gitignore` 忽略）或云机私有 `.env`，绝不提交进仓库、脚本或提交信息。
3. ❌ **不破坏旧存档与遗留切片**：调整章节排序时绝不修改已有章节的 `id` 字段；发布 `gh-pages` 必须完整保留 `/red-cliffs/` 与 `/red-cliffs-v2/`。
4. ❌ **校验不过绝不合入**：`npm run typecheck && npm run validate:story && npm run build` 必须 0 错误 0 警告。
