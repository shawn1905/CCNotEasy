import type { Chapter } from '../types'

/** 赤壁前夜 Demo v2 — 史料锚定，幽默≤1/10 */
export const redCliffsEve: Chapter = {
  id: 'red-cliffs-eve',
  title: '赤壁前夜',
  subtitle: '曹操不容易 · 史料版 Demo',
  start: 'N00',
  gloss: {
    八十万: {
      id: '八十万',
      title: '水军八十万',
      body: '遗孙权书中的胁降口径（《江表传》/《通鉴》）。周瑜夜校：中国人不过十五六万且疲，表众极七八万且狐疑。不可当作审计实数。',
      source: '《周瑜传》注引《江表传》',
    },
    军实: {
      id: '军实',
      title: '江陵军实',
      body: '江陵所藏粮械船资。《先主传》明写曹操「以江陵有军实，恐先主据之」，故释辎重轻军急追。细目史默。',
      source: '《三国志·先主传》',
    },
    更始: {
      id: '更始',
      title: '与之更始',
      body: '进江陵后下令荆州吏民「与之更始」，并论服从之功、封侯、用荆州将吏。安抚与东下争夺同一段日历。',
      source: '《三国志·武帝纪》',
    },
    疾疫: {
      id: '疾疫',
      title: '疾疫',
      body: '《周瑜传》：遇于赤壁时「军众已有疾病」。疫在初战前已存在，不是火攻后才出现。《武帝纪》亦书大疫、吏士多死。',
      source: '《周瑜传》《武帝纪》',
    },
    四患: {
      id: '四患',
      title: '周瑜所陈四患',
      body: '关西马超韩遂为后患；舍鞍马仗舟楫非中国所长；盛寒马无藁草；远涉不习水土必生疾病。操「皆冒行之」。',
      source: '《三国志·周瑜传》',
    },
    首尾相接: {
      id: '首尾相接',
      title: '船舰首尾相接',
      body: '黄盖观察操军船阵「首尾相接」，以为可烧。《通鉴》作「方连船舰」。史载是结果，不是「因晕船而连环」的动机句——动机属推演。',
      source: '《周瑜传》；《通鉴》卷65',
    },
    诈降: {
      id: '诈降',
      title: '黄盖诈降',
      body: '先书报欺以欲降；注载操「但恐汝诈」，仍许重赏。吏士延颈观望，通鉴更写「出营立观」，火船得近。',
      source: '《周瑜传》及注引《江表传》',
    },
    玄武池: {
      id: '玄武池',
      title: '玄武池肄舟师',
      body: '建安十三年春，曹操还邺，作玄武池练水军。解决的是静水基础，不等于长江盛寒、疾疫、降附混编下的会战能力。',
      source: '《三国志·武帝纪》',
    },
    长坂: {
      id: '长坂',
      title: '长坂急追',
      body: '精骑五千，一日一夜三百余里，及于当阳长坂，大获人众辎重。破竹与人马过用是同一条链。',
      source: '《三国志·先主传》',
    },
    统本兵: {
      id: '统本兵',
      title: '文聘统本兵',
      body: '以刘表大将文聘为江夏太守，「使统本兵」——保留荆州将领对旧部的指挥权，换水战能力，也留下狐疑风险。',
      source: '《三国志·武帝纪》',
    },
  },
  nodes: {
    N00: {
      id: 'N00',
      title: '开场 · 江陵',
      lines: [
        {
          speaker: 'system',
          text: '建安十三年。刘琮已降。你在江陵。',
        },
        {
          speaker: 'system',
          text: '本节据《武帝纪》《周瑜传》《先主传》及裴注缺口推演。点蓝词看出处。',
        },
        {
          speaker: 'cheng',
          text: '丞相差遣已核：{{长坂}}所获人众辎重尚在清点；江陵{{军实}}已入册；荆州吏民{{更始}}令已下，侯者名籍未齐。',
        },
        {
          speaker: 'xun',
          text: '春间{{玄武池}}肄舟师，是邺城静水。今日要驾的是荆州降附的蒙冲斗舰，与北军步骑同江——两套编制，尚未合成一令。',
        },
        {
          speaker: 'jia',
          text: '江东已见恐吓口径：书称{{八十万}}。他们若信，或迎或战；他们若不信，会按实数来打我们。',
        },
        {
          speaker: 'cao',
          text: '把日历摊开。东下与安抚，哪一件先做完。',
        },
        {
          speaker: 'cheng',
          text: '不能两件都「做完」。只能选哪一件先欠着。',
        },
      ],
      choices: [
        {
          id: 'N00_go',
          label: '议东下与再抚',
          hint: '进入第一难 · 锚定 TL-06',
          next: 'N01',
        },
      ],
    },

    N01: {
      id: 'N01',
      title: '第一难 · 江陵日历',
      lines: [
        {
          speaker: 'cheng',
          text: '诸将请顺江会猎：备新败，江东震恐，书已出，窗口短。',
        },
        {
          speaker: 'xun',
          text: '未完之事：降人条品、舰籍归谁指挥、文聘{{统本兵}}与北军水督如何接令、刘璋给军是否入账。再留旬月，账更实，敌也更备。',
        },
        {
          speaker: 'jia',
          text: '周瑜若主战，会陈{{四患}}：关西、水战、盛寒马草、水土疾病。我们若此刻东下，等于四患都认领。',
        },
        {
          speaker: 'soldier',
          text: '斥候报：柴桑方向使者往来频繁。江东是迎是战，尚无定谳。',
        },
        {
          speaker: 'cao',
          text: '东下：抢时间、养「八十万」之势。再抚：养编制、养粮、养降人——可能把会猎写成相持。',
        },
      ],
      choices: [
        {
          id: 'N01_A',
          label: 'A · 即日部署东下',
          hint: '短利：威压与时间差；欠账：更始与筛疫',
          effects: [
            { set: 'haste', value: true },
            {
              cost: '江陵安抚与舰籍清点压缩；粮械随军前送，后方留屯减员。',
            },
          ],
          next: 'N01_A_out',
        },
        {
          id: 'N01_B',
          label: 'B · 再留旬日，先完更始与舰籍',
          hint: '短利：降附与指挥栈；欠账：敌方备战窗口',
          effects: [
            { set: 'haste', value: false },
            {
              cost: '多耗江陵仓廪与时日；会猎胁降时效下降。',
            },
          ],
          next: 'N01_B_out',
        },
      ],
    },

    N01_A_out: {
      id: 'N01_A_out',
      lines: [
        {
          speaker: 'cheng',
          text: '得令。前锋舟骑按巴丘方向序次；文聘部随水军建制，条品未完者暂挂原将名下。',
        },
        {
          speaker: 'xun',
          text: '名籍未齐就开拔，日后战报上的「兵力」会比实营好看——也会比实营脆弱。',
        },
        {
          speaker: 'jia',
          text: '你买到了日历。日历的利息，后面用疾疫和船阵来付。',
        },
      ],
      next: 'N02',
    },

    N01_B_out: {
      id: 'N01_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '得令。侯者名籍限期呈核；舰籍分「可战」「转运」「未验」三簿；北军不得擅征荆州水手，须经军府。',
        },
        {
          speaker: 'xun',
          text: '仓廪会明显下降。降人安定一分，东下的「势」就淡一分。',
        },
        {
          speaker: 'jia',
          text: '江东若在这旬日内定战，我们送给他们的不是粮，是准备时间。',
        },
      ],
      next: 'N02',
    },

    N02: {
      id: 'N02',
      title: '第二难 · 疾疫名册',
      lines: [
        {
          speaker: 'system',
          text: '汇合 · 疫报到案（不论东下急缓，名册问题都会来）',
        },
        {
          speaker: 'soldier',
          text: '军医密报：咳热、下痢已在数营出现。尚不足定「大疫」之名，但按满员派差，已有人死于途。',
        },
        {
          speaker: 'xun',
          text: '《后书》未到。若按周瑜逻辑，远涉江湖「必生疾病」。我们若在遇敌前装作无事，编制是假的。',
        },
        {
          speaker: 'cheng',
          text: '若摊牌：须减勤务、隔离、催药——账面兵力立刻难看，恐吓江东的{{八十万}}也会自我拆穿。',
        },
        {
          speaker: 'jia',
          text: '若隐瞒：短期能维持出征政治；代价是病卒仍按健卒使用，传染链更难截断。',
        },
        {
          speaker: 'cao',
          text: '遇敌时若已有疾病——那不是事后才发生的事。现在就要定：名册从真，还是从势。',
        },
        {
          speaker: 'cheng',
          text: '（callback）因江陵已抢日历，医药与留养的余地更薄。压报能保日程，也会把病卒继续送上橹。',
          when: { haste: true },
        },
        {
          speaker: 'cheng',
          text: '（callback）江陵既已留抚，隔离营与药船尚可调度——但仍要你定：实报还是压报。',
          when: { haste: false },
        },
      ],
      choices: [
        {
          id: 'N02_A',
          label: 'A · 压报，维持满员出征编制',
          hint: '短利：势与日程；欠账：真实战力',
          effects: [
            { set: 'plague_honesty', value: false },
            { cost: '病卒仍按满员派差；药与隔离后置。' },
          ],
          next: 'N02_A_out',
        },
        {
          id: 'N02_B',
          label: 'B · 实报减员，隔离并催药',
          hint: '短利：可战者更实；欠账：势与流言',
          effects: [
            { set: 'plague_honesty', value: true },
            { cost: '账面兵力下调；药船与运力上浮；「示弱」流言起。' },
          ],
          next: 'N02_B_out',
        },
      ],
    },

    N02_A_out: {
      id: 'N02_A_out',
      lines: [
        {
          speaker: 'xun',
          text: '名册不动。巡营记「偶有不适」。能走路的，仍上橹。',
        },
        {
          speaker: 'jia',
          text: '江东细作若在，他们看见的病号会比名册多。',
        },
        {
          speaker: 'cao',
          text: '先把江走完。账，到对岸再算。',
        },
      ],
      next: 'N03',
    },

    N02_B_out: {
      id: 'N02_B_out',
      lines: [
        {
          speaker: 'xun',
          text: '名册改实。重病出列，轻病减役，药船今夜离栈。有将领已问：丞相是否怯战。',
        },
        {
          speaker: 'cheng',
          text: '怯战之名可辩。虚数赴敌，死后无法辩。',
        },
        {
          speaker: 'cao',
          text: '让他们问。问的人，至少还站得住。',
        },
      ],
      next: 'N03',
    },

    N03: {
      id: 'N03',
      title: '过场 · 巴丘至江面',
      lines: [
        {
          speaker: 'system',
          text: '军至巴丘一线。合肥方向另遣偏师——两线分兵已成事实，主攻仍在长江。',
        },
        {
          speaker: 'cheng',
          text: '北岸泊区报：浪颠、夜散、号令不齐。有人请将船舰密泊，首尾相衔，便于统一指挥。',
        },
        {
          speaker: 'jia',
          text: '密泊的收益是稳与令。风险是火。史书日后若只写「首尾相接」，不会替我们解释动机——动机要我们自己承担。',
        },
        {
          speaker: 'xun',
          text: '（callback）疾疫名册若是假的，密泊会把病人与健卒锁在同一风口里。',
          when: { plague_honesty: false },
        },
        {
          speaker: 'xun',
          text: '名册既已改实，密泊至少不会把重病者硬锁进核心舟阵——但仍须定防火间距。',
          when: { plague_honesty: true },
        },
      ],
      next: 'N04',
    },

    N04: {
      id: 'N04',
      title: '第三难 · 船阵',
      lines: [
        {
          speaker: 'cheng',
          text: '议案甲：舟舰{{首尾相接}}，如营寨。利：减散阵、便号令、利北军上下。',
        },
        {
          speaker: 'jia',
          text: '议案乙：分屯疏泊，预留防火道与砍缆预案。利：火攻难以一网。弊：浪颠、夜惊、指挥变慢——黄盖所惧「难与持久」，可能朝我们反噬。',
        },
        {
          speaker: 'soldier',
          text: '对岸已有敌帆。初战若不利，将引次江北对峙——船阵会在对峙里被看清。',
        },
        {
          speaker: 'cao',
          text: '相接是结果。我要的是：这个结果值不值得用火灾风险去换。',
        },
      ],
      choices: [
        {
          id: 'N04_A',
          label: 'A · 密泊相接，统一号令',
          hint: '史实观察向；稳，怕火',
          effects: [
            { set: 'loose_ships', value: false },
            { cost: '泊阵如营；火灾时分割困难。' },
          ],
          next: 'N04_A_out',
        },
        {
          id: 'N04_B',
          label: 'B · 疏泊分屯，留砍缆与防火道',
          hint: '旁支；活，怕散与持久',
          effects: [
            { set: 'loose_ships', value: true },
            { cost: '指挥变慢；夜警与浪损上升；防火分割可行。' },
          ],
          next: 'N04_B_out',
        },
      ],
    },

    N04_A_out: {
      id: 'N04_A_out',
      lines: [
        {
          speaker: 'cheng',
          text: '舟阵按相接部署。夜号一次可传全泊区。北军上下船明显顺利。',
        },
        {
          speaker: 'jia',
          text: '对岸若有人「观操军船舰」，他们会得到一句很干净的话：首尾相接，可烧而走。',
        },
      ],
      next: 'N05',
    },

    N04_B_out: {
      id: 'N04_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '外圈疏泊，内圈要地仍近卫。砍缆斧已发到什长。有人抱怨：这不像丞相平日的「整」。',
        },
        {
          speaker: 'jia',
          text: '整，是为了打。散，是为了不被一火打完。两者都姓「整」，只是整的对象不同。',
        },
      ],
      next: 'N05',
    },

    N05: {
      id: 'N05',
      title: '第四难 · 来降',
      lines: [
        {
          speaker: 'system',
          text: '初战不利的消息与江北屯驻令相继抵达。对岸有人先书请降。',
        },
        {
          speaker: 'soldier',
          text: '来书自称黄盖部曲，言江东众寡不敌，愿为前部归命。船数、膏油味、牙旗——斥候描摹与「降船」相近，也与「火船」相近。',
        },
        {
          speaker: 'cheng',
          text: '受降：可拆敌、可示强、可速决。史路如此。',
        },
        {
          speaker: 'jia',
          text: '注里会有一句「但恐汝诈」。怕，却仍可能让吏士{{诈降}}观望、甚至出营立观——怕与松懈可以同时存在。',
        },
        {
          speaker: 'xun',
          text: '远泊戒备、强弩外拒、不许出营：火船难近。代价是持久。黄盖正怕持久；我们若防诈，可能把战争拖进他们更擅长的节奏。',
        },
        {
          speaker: 'cao',
          text: '（callback）船阵既已相接，观降一旦失距，烧的是整泊区。',
          when: { loose_ships: false },
        },
        {
          speaker: 'cao',
          text: '（callback）疏泊尚在，仍不可把「观降」当成阅兵。',
          when: { loose_ships: true },
        },
      ],
      choices: [
        {
          id: 'N05_A',
          label: 'A · 受降接洽，许以爵赏，放近观验',
          hint: '短利：速决与拆敌；史实诱向',
          effects: [
            { set: 'suspect_defection', value: false },
            { set: 'haste', value: true },
            { cost: '外泊警戒降档；吏士得出营观望。' },
          ],
          next: 'N05_A_out',
        },
        {
          id: 'N05_B',
          label: 'B · 扣使验供，船泊射程外，禁出营',
          hint: '短利：防火距；欠账：持久与时效',
          effects: [
            { set: 'suspect_defection', value: true },
            { cost: '精卒看守与延期；进攻窗口变窄。' },
          ],
          next: 'N05_B_out',
        },
      ],
    },

    N05_A_out: {
      id: 'N05_A_out',
      lines: [
        {
          speaker: 'cheng',
          text: '行人已见。口敕备下：若信实，赏格从优。泊区有人延颈——像在等一场自己的胜利。',
        },
        {
          speaker: 'jia',
          text: '胜利若来自降幡，火也从同一方向来。',
        },
      ],
      next: 'N06',
    },

    N05_B_out: {
      id: 'N05_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '使扣外寨。供词两处不合。船令停于强弩界外，夜禁出营。有将问：丞相要与江东熬到何时。',
        },
        {
          speaker: 'jia',
          text: '熬，是防诈的利息。不熬，是火的利息。两笔都是利息。',
        },
      ],
      next: 'N06',
    },

    N06: {
      id: 'N06',
      title: '风向与火',
      lines: [
        {
          speaker: 'soldier',
          text: '报——风转猛！对岸船队举帆前趋，有人呼降。',
        },
        {
          speaker: 'cheng',
          text: '烟已起。请丞相阅战报拼装——按今夜之前四次抉择入账。',
        },
        {
          speaker: 'cao',
          text: '取账。',
        },
      ],
      next: 'N07_report',
    },

    N07_report: {
      id: 'N07_report',
      kind: 'report',
      title: '战报',
      lines: [
        {
          speaker: 'system',
          text: '【战报拼装】',
        },
      ],
      next: 'N08_route',
    },

    N08_route: {
      id: 'N08_route',
      lines: [
        {
          speaker: 'system',
          text: '账已齐。结局按摘要变量裁定。',
        },
      ],
      next: 'ENDING_PICK',
    },

    ENDING_PICK: {
      id: 'ENDING_PICK',
      lines: [{ speaker: 'system', text: '（路由）' }],
      next: 'E_BURN',
    },

    E_BURN: {
      id: 'E_BURN',
      kind: 'ending',
      endingId: 'canon-ash',
      title: '结局 · 史实灰',
      lines: [
        {
          speaker: 'system',
          text: '船阵相接，警戒因受降而松。风盛火猛，舟营俱焚。军中本已有疾病，溃后饥疫并书，吏士多死。',
        },
        {
          speaker: 'cheng',
          text: '请留曹仁等守江陵，主力北还。江南诸郡将不在掌握。',
        },
        {
          speaker: 'cao',
          text: '日后若需一书，可写：值有疾病，烧船自退。那是给外人看的句子。',
        },
        {
          speaker: 'jia',
          text: '给自己看的句子更短：日历、名册、泊距、观降——四笔里，你选了史书最熟悉的组合。',
        },
        {
          speaker: 'system',
          text: '【结局：史实灰】绝对优势在此失效：疾疫在前，火攻在后，自辩在最后。',
        },
      ],
    },

    E_ESCAPE: {
      id: 'E_ESCAPE',
      kind: 'ending',
      endingId: 'bitter-win',
      title: '结局 · 苦持',
      lines: [
        {
          speaker: 'system',
          text: '火未能尽吞泊区。疏泊或远拒使火攻减效；江面转入更长的对峙与消耗。',
        },
        {
          speaker: 'cheng',
          text: '南岸仍在压迫。我们保下了一部分舟骑，也把「八十万」的神话穿了孔。许下会有人写别的账。',
        },
        {
          speaker: 'cao',
          text: '活着的编制，比完整的话术重要。但活着的编制，不够写成一场漂亮的胜。',
        },
        {
          speaker: 'jia',
          text: '旁支的胜利通常难看。难看，是你付过防火与疑降的利息。',
        },
        {
          speaker: 'system',
          text: '【结局：苦持】火攻史路偏转；战争不会因此变仁慈。',
        },
      ],
    },

    E_HOLD: {
      id: 'E_HOLD',
      kind: 'ending',
      endingId: 'honest-bleed',
      title: '结局 · 摊牌余生',
      lines: [
        {
          speaker: 'system',
          text: '名册从实，戒备从严，东下未全押在恐吓上。初战与疾疫仍在，但崩溃没有一次烧穿。',
        },
        {
          speaker: 'xun',
          text: '能战之卒少于出发时的话术。江东可以笑话我们「示弱」；他们笑话的时候，我们的人还在。',
        },
        {
          speaker: 'cao',
          text: '丞相府不需要鼓掌。需要下一道还能发出的军令。',
        },
        {
          speaker: 'jia',
          text: '你丢掉的是势。你留下的是还可以计算的兵力。',
        },
        {
          speaker: 'system',
          text: '【结局：摊牌余生】像正确的成年人——帐里未必有人恭喜。',
        },
      ],
    },
  },
}
