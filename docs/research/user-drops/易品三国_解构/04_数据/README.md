# 数据结构说明

这些 JSON 从单文件 HTML 的主脚本中静态抽取，已去掉函数、图片、音频和 DOM 节点，只保留文字、数值与结构。

| 文件 | 源符号 | 说明 |
|---|---|---|
| `scenarios.json` | `SCENARIOS` | 5 个剧本：势力、城池归属、武将表 |
| `year_events.json` | `YEAR_EVENTS` | 191–220 年，每年一条史载参照 |
| `landmarks.json` | `LANDMARK_EVENTS` | 16 个条件触发的历史大事件 |
| `yellow_route.json` | `YELLOW_ROUTE309` | 183–200 年黄巾史线 28 个节点 |
| `jingzhou_route.json` | `JINGZHOU_ROUTE296` | 208–223 年荆州史线 7 个节点 |
| `studies.json` | `STUDIES278` | 7 篇三步式史事推演，含选择与数值变化 |
| `scroll_chains.json` | `SCROLL_CHAINS` | 18 条事件画卷链，含画格与史实/创作标签 |
| `history_chapters.json` | `HISTORY_CHAPTERS286` | 37 帧正史疆域，含据点与出处键 |
| `history_sources.json` | `HISTORY_SOURCES286` | 43 条书名/篇名与 URL |
| `random_events.json` | `EVENTS` | 6 个随机事件与选项 |

## 注意

- `studies.json` 里少数 `text` 标为 `[动态文本：依前项选择变化]`，原文是函数，会按前一步选择拼接不同句子；这里保留占位标记，不虚构展开。
- `scroll_chains.json` 的 `{{year}}`、`{{city}}`、`{{stock}}` 等是运行时占位符，由本局状态替换。
- 数值是游戏设计参数，不是史料中的统计值。
- 史实与推演的边界以每条记录的 `record` / `limits` / `source` / `kind` 字段为准。
