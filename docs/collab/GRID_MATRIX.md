# 建安十二格编年状态矩阵（GRID_MATRIX）

> 覆盖曹操核心军政生涯 30 年（190—220 年），共 **12 个高密度可考证编年格**。
> 状态约定：`done`（已上线） / `ready`（可认领） / `running`（编写中） / `review`（史料审校中） / `blocked`（待拍板）。

| 格号 | 年份 | 章节名 | 章节 ID（锁定） | 状态 | 负责人 | `allowed_paths` | 核心正史锚点（严禁演义混入） |
|---|---|---|---|---|---|---|---|
| G01 | 初平元年 (190) | 荥阳汴水 | `ch06-xingyang` | `ready` | — | `src/content/packs/ch06-xingyang/` | 诸侯观望、孤军追董卓败于徐荣、曹洪让马、扬州募兵兵变 |
| G02 | 兴平元年 (194) | 兖州孤城 | `ch07-yanzhou` | `ready` | — | `src/content/packs/ch07-yanzhou/` | 征陶谦屠徐州致后院起火、陈宫张邈迎吕布、荀彧程昱守鄄城范东阿三县、蝗灾断粮险投袁绍 |
| G03 | 建安元年 (196) | 迎帝许都 | `ch08-xudu` | `ready` | — | `src/content/packs/ch08-xudu/` | 洛阳饥馑残破、力排众议抢迎汉献帝定许都、枣祗韩浩推行许下屯田 |
| G04 | 建安二年 (197) | 宛城一夜 | `ch03-wancheng` | `done` | main | `src/content/packs/ch03-wancheng/` | 纳邹氏、私赐胡车儿黄金防刺、春季避湿移营合围、典韦大斧长戟、于禁弹压青州兵、丁夫人离异 |
| G05 | 建安三年 (198) | 下邳白门楼 | `ch04-baimenlou` | `done` | main | `src/content/packs/ch04-baimenlou/` | 壅沂泗二水灌城、侯成宋宪绑陈宫高顺、吕布自行出降、王必力谏、招抚臧霸泰山军 |
| G06 | 建安五年 (200) | 官渡断粮 | `ch02-guandu` | `done` | main | `src/content/packs/ch02-guandu/` | 许都颍汴粮道、汝南刘辟叛应、霹雳车长堑破地道、步骑五千乌巢诈称蒋奇漏洞、延津渡口 |
| G07 | 建安九年 (204) | 决水围邺 | `ch09-yecheng` | `ready` | — | `src/content/packs/ch09-yecheng/` | 袁谭袁尚内斗、筑长围决漳水围邺八月、审配死守、许攸居功自傲被杀、收拢河北世家 |
| G08 | 建安十二年 (207) | 白狼山孤军 | `ch10-bailang` | `ready` | — | `src/content/packs/ch10-bailang/` | 郭嘉力排众议北征乌桓、田畴向导绕卢龙塞、白狼山轻兵斩蹋顿、回师冻饿两百里郭嘉病逝 |
| G09 | 建安十三年 (208) | 赤壁前夜 | `ch01-red-cliffs` | `done` | main | `src/content/packs/ch01-red-cliffs/` | 急性血吸虫病 40 天潜伏期、缆绳木板浮垒、云梦泽湖陆风、蒋济零阳伪信解合肥围、贾诩劝止 |
| G10 | 建安十六年 (211) | 潼关渭水 | `ch11-tongguan` | `ready` | — | `src/content/packs/ch11-tongguan/` | 假道入汉中激反关中十部、渡渭水险丧命、沙土浇水冻冰城、贾诩抹书离间韩遂马超 |
| G11 | 建安十七年 (212) | 九锡裂痕 | `ch12-jiuxi` | `ready` | — | `src/content/packs/ch12-jiuxi/` | 董昭议进魏公加九锡、与二十年心腹荀彧的汉室名分决裂、濡须口对孙权 |
| G12 | 建安二十四年 (219) | 汉中鸡肋 | `ch05-hanzhong` | `done` | main | `src/content/packs/ch05-hanzhong/` | 褒斜道十耗七八、杜袭张既战略焦土内迁数万户及五万氐人、汉水暴涨五六丈、魏讽案、赵俨摩陂观虎 |

---

## 大帐值班生存模式地图池

| 编号 | 地图 | 文件路径 | 状态 | 规模 |
|---|---|---|---|---|
| D01 | 江陵十日（标准 · 顺风理烂账） | `src/content/desk/jiangling10d.ts` | `done` | 21 案卷 / 4 幕僚 / 4 手令 / 4 配方 |
| D02 | 官渡七日（高压 · 绝境熬乌巢） | `src/content/desk/guandu7d.ts` | `done` | 17 案卷 / 4 幕僚 / 4 手令 / 4 配方 |
| D03 | 兖州三县（极难 · 蝗灾断粮） | `src/content/desk/yanzhou.ts` | `ready` | 待认领 |
