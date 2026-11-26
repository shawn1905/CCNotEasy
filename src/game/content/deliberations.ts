import type { PrepAction } from '../types'

/** 四难拍板前互动：走动看营 / 问谋士 / 翻卷宗 */
export const prepN01: PrepAction[] = [
  {
    id: 'n01_walk_gengshi',
    kind: 'walk',
    label: '去更始署门口看看',
    hint: '安抚、封侯、接见名士在不在推进',
    lines: [
      {
        speaker: 'system',
        text: '你出帐，穿过庆功的酒气，走到更始署。灯还亮着，案上堆着名籍草卷——{{侯者}}十五人的食邑注还空着一半。',
      },
      {
        speaker: 'soldier',
        text: '小吏抬头看见你，慌忙起身：条品接见要排到后日。今夜若开拔，这些卷只能「随军呈核」。',
      },
      {
        speaker: 'system',
        text: '廊下坐着两名本地父老，像在等一句「家还在」。你若东下，这句话要欠着走。',
      },
    ],
  },
  {
    id: 'n01_walk_shipyard',
    kind: 'walk',
    label: '下到舰籍坞',
    hint: '蒙冲斗舰在，鼓点齐不齐',
    lines: [
      {
        speaker: 'system',
        text: '江边冷风扑面。{{蒙冲斗舰}}黑影成排，缆绳新旧混杂。北军水手在甲板上踉跄，荆州旧卒在船帮骂北方口音听不懂号令。',
      },
      {
        speaker: 'soldier',
        text: '管坞的说：可战、转运、未验三簿还没拆开。{{文聘}}营的人在下游另泊——{{统本兵}}是真的，同听一个鼓，还不是。',
      },
      {
        speaker: 'system',
        text: '远处有人练鼓，两套节奏拧着。得舰，和得死战，中间隔的就是你看见的这层缝。',
      },
    ],
  },
  {
    id: 'n01_walk_drums',
    kind: 'walk',
    label: '听帐外鼓噪',
    hint: '将校要的窗口与士气',
    lines: [
      {
        speaker: 'system',
        text: '帐外火把密。有人喊威已成，有人敲盾。磨刀声盖过角落里的咳。',
      },
      {
        speaker: 'soldier',
        text: '偏将拦住你：丞相，{{柴桑}}那边还在议。今晚不动，明日他们就不怕了。',
      },
      {
        speaker: 'system',
        text: '势是真的，窗口也是真的。势会替你表决——如果你愿意被表决。',
      },
    ],
  },
  {
    id: 'n01_ask_cheng',
    kind: 'ask',
    label: '问程昱：东下能不能等',
    hint: '主簿口径 · 偏窗口',
    lines: [
      {
        speaker: 'cheng',
        text: '不能两件都做完。东下买的是「他们还在怕」的几天；再抚买的是名籍与舰籍。我呈的甲案硬，是因为窗口硬——不是因为我爱快。',
      },
      {
        speaker: 'cheng',
        text: '欠账我也写在卷上：{{更始}}半做、{{条品}}未齐、{{刘璋给军}}来不及入账。你若选甲，日后别说没人提醒。',
      },
    ],
  },
  {
    id: 'n01_ask_xun',
    kind: 'ask',
    label: '问荀彧：编制缝有多深',
    hint: '偏留抚 · 四患',
    lines: [
      {
        speaker: 'xun',
        text: '春间{{玄武池}}练的是静水。今夜上的是荆州水军。北军与降附，还没有同鼓点——这不是文辞，是你刚可以走到坞上看见的东西。',
      },
      {
        speaker: 'xun',
        text: '周瑜若主战，会陈{{四患}}。你越急，越像签字认领。认领可以；装没看见，不行。',
      },
    ],
  },
  {
    id: 'n01_ask_jia',
    kind: 'ask',
    label: '问贾诩：势与实数',
    hint: '八十万与夜校',
    lines: [
      {
        speaker: 'jia',
        text: '江东已见{{八十万}}。怕则乱，不信则按实数杀我们。话术是刀，也会反刃。',
      },
      {
        speaker: 'jia',
        text: '我没有第三案。「又快又稳」不在材料里。你要的是哪一种死法更慢——或者哪一种活法更贵。',
      },
    ],
  },
  {
    id: 'n01_read_jiangling',
    kind: 'read',
    label: '翻卷：江陵在做什么',
    hint: '武帝纪 · 更始与用人',
    showRefs: ['R-jiangling-more', 'R-z01', 'R-wenping'],
    lines: [
      {
        speaker: 'system',
        text: '你打开江陵卷。吏民更始、侯者、文聘统本兵、引用名士——史书把安顿写得很满。满，说明这些不是礼仪，是工序。',
      },
      {
        speaker: 'cao',
        text: '工序被压缩，账面仍可好看。好看碎在江上的时候，没有人替你翻这卷。',
      },
    ],
  },
  {
    id: 'n01_read_eighty',
    kind: 'read',
    label: '翻卷：八十万与四患',
    hint: '江表传夜校 · 瑜传',
    showRefs: ['R-eighty-wan', 'R-four-woes', 'R-z03'],
    lines: [
      {
        speaker: 'system',
        text: '会猎书与四患对读：一边吓人，一边写你冒行。敌方主战檄文，用的就是你今夜可能签下的节奏。',
      },
    ],
  },
]

export const prepN02: PrepAction[] = [
  {
    id: 'n02_walk_medic',
    kind: 'walk',
    label: '去军医帐',
    hint: '咳热、下痢、抬出营的人',
    lines: [
      {
        speaker: 'system',
        text: '军医帐气味先到：药苦、汗酸、再底下是腐。草席上躺着能走的与不能走的；门外还有人等着「偶有不适」四个字。',
      },
      {
        speaker: 'soldier',
        text: '军医压低声：够不上「大疫」的写法——够不上，人已经死在路上了。问隔离，同僚按住他：一提，士气先崩。',
      },
      {
        speaker: 'system',
        text: '帐角一只空药箱。你若压报，箱子还会空着跟你东下。',
      },
    ],
  },
  {
    id: 'n02_walk_roster',
    kind: 'walk',
    label: '核对巡营名册',
    hint: '账面满员与实营',
    lines: [
      {
        speaker: 'system',
        text: '巡营簿摊开。若干营「满员」旁有小字：不适、泻、热。小字不进总册——总册要好看。',
      },
      {
        speaker: 'soldier',
        text: '记簿吏手抖：丞相若改实，外面会说怕；若不改，船上会说欺。',
      },
    ],
  },
  {
    id: 'n02_walk_stack',
    kind: 'walk',
    label: '看栈桥争位',
    hint: '药船与前送',
    lines: [
      {
        speaker: 'system',
        text: '栈桥上吵。前送辎重要位，药船也要位。旗已宣的地方，药往往让路。',
        when: { haste: true },
      },
      {
        speaker: 'system',
        text: '栈桥尚有空档。药船可以先系——你若肯下令实报，位会立刻不够。',
        when: { haste: false },
      },
      {
        speaker: 'soldier',
        text: '管栈的不问病，只问旗。旗是日历；日历压过药，是制度，不是良心。',
      },
    ],
  },
  {
    id: 'n02_ask_xun',
    kind: 'ask',
    label: '问荀彧：名册说不说实话',
    hint: '已有疾病 / 必生疾病',
    lines: [
      {
        speaker: 'xun',
        text: '瑜传写相遇时「已有疾病」。四患写「必生疾病」。两句不是咒，是地理与季节。压报取消不了逻辑，只取消你看见逻辑的机会。',
      },
      {
        speaker: 'xun',
        text: '假编制打真仗，死时才发现骗过的是自己的调度。实名册示弱——笑会来，人还在。',
      },
    ],
  },
  {
    id: 'n02_ask_cheng',
    kind: 'ask',
    label: '问程昱：势还保不保',
    hint: '八十万口径',
    lines: [
      {
        speaker: 'cheng',
        text: '摊牌，{{八十万}}自我拆穿。压报，日程与势都保住——病卒仍按健卒上橹。我呈的是两害，不是正确答案。',
      },
      {
        speaker: 'cheng',
        text: '（因为旗已动）药与留养被日历咬薄。你仍可选实报，只是更贵。',
        when: { haste: true },
      },
      {
        speaker: 'cheng',
        text: '（因为留抚）隔离营尚可腾。你可以实报，也可以继续用势压死真相。',
        when: { haste: false },
      },
    ],
  },
  {
    id: 'n02_ask_jia',
    kind: 'ask',
    label: '问贾诩：细作看见什么',
    hint: '情报仗',
    lines: [
      {
        speaker: 'jia',
        text: '细作若在，他们看见的病号比你名册多。你输的第一仗，可能是情报仗——不是江面那一火。',
      },
      {
        speaker: 'jia',
        text: '疲病与狐疑在敌方嘴里是一句。你分两难决策，他们合成一刀。',
      },
    ],
  },
  {
    id: 'n02_read_plague',
    kind: 'read',
    label: '翻卷：已有疾病 / 大疫',
    hint: '瑜传 · 武帝纪',
    showRefs: ['R-plague-before', 'R-plague-aftermath', 'R-z06'],
    lines: [
      {
        speaker: 'system',
        text: '两句对读：已有，与战后大疫。自辩可写烧船自退——那是给外人的句子。给调度的句子在名册上。',
      },
    ],
  },
  {
    id: 'n02_read_fox',
    kind: 'read',
    label: '翻卷：疲病之卒与狐疑之众',
    hint: '江表传夜校',
    showRefs: ['R-eighty-wan', 'R-z08', 'R-false-roster'],
    lines: [
      {
        speaker: 'system',
        text: '夜校原句把疾疫与降附钉在一起。你若压报，是在给上半句供货。',
      },
    ],
  },
]

export const prepN04: PrepAction[] = [
  {
    id: 'n04_walk_deck',
    kind: 'walk',
    label: '走上旗舰甲板',
    hint: '浪、吐、号令',
    lines: [
      {
        speaker: 'system',
        text: '{{巴丘}}江面比邺池狠。甲板倾斜时，北军有人跪着吐，有人抓住舷墙骂天。荆州水手赤脚稳得像在平地。',
      },
      {
        speaker: 'soldier',
        text: '什长喊靠拢——两船一撞，骂声盖过浪。有人说：密泊才能睡。有人说：密泊才能死得整齐。',
      },
    ],
  },
  {
    id: 'n04_walk_gap',
    kind: 'walk',
    label: '量一量船距',
    hint: '相接与防火道',
    lines: [
      {
        speaker: 'system',
        text: '你让人抛绳量距。密了，像陆营巷道，走起来省力；疏了，浪里像一群失散的牲口。',
      },
      {
        speaker: 'soldier',
        text: '对岸帆影隐约。有人伸手指：若相接，他们一眼就能写「可烧」。',
      },
      {
        speaker: 'system',
        text: '靶标清晰度是敌方战术的一部分。你的整齐，也可能是给他们的句子。',
      },
    ],
  },
  {
    id: 'n04_walk_axe',
    kind: 'walk',
    label: '看砍缆斧在不在',
    hint: '疏泊配套',
    lines: [
      {
        speaker: 'system',
        text: '下层舱里，斧与锯有的磨亮，有的生锈。没有人发过「紧急砍缆」的操典——因为密泊提案里不需要。',
      },
      {
        speaker: 'soldier',
        text: '老卒摸斧刃：有斧，不等于有人敢砍。夜里一乱，先砍的是绳子还是人，说不准。',
      },
    ],
  },
  {
    id: 'n04_ask_cheng',
    kind: 'ask',
    label: '问程昱：密泊利在哪',
    hint: '号令如营',
    lines: [
      {
        speaker: 'cheng',
        text: '甲案：{{首尾相接}}如营。减散阵、便号令、北军上下省力。将校多赞成——像又赢了长坂那样整。',
      },
      {
        speaker: 'cheng',
        text: '短利是体验与指挥。欠账是火灾难分割。我把两边都写下了。',
      },
    ],
  },
  {
    id: 'n04_ask_jia',
    kind: 'ask',
    label: '问贾诩：疏泊怕什么',
    hint: '难与持久',
    lines: [
      {
        speaker: 'jia',
        text: '乙案：疏泊留防火道与砍缆。火难一网。弊：夜惊、浪损、指挥慢。{{黄盖}}怕「{{难与持久}}」——你防久了，可能正合他意。',
      },
      {
        speaker: 'jia',
        text: '旁支往往从难看开始。难看不是失败，是利息的另一种收法。',
      },
    ],
  },
  {
    id: 'n04_ask_xun',
    kind: 'ask',
    label: '问荀彧：病与泊',
    hint: '密泊加舱',
    lines: [
      {
        speaker: 'xun',
        text: '（因为名册是假的）密泊把病人和健卒锁进同一阵风。相接等于给疾病加舱。',
        when: { plague_honesty: false },
      },
      {
        speaker: 'xun',
        text: '（因为名册是真的）重病已出列——密泊仍危险，至少不是拿假人数去赌。',
        when: { plague_honesty: true },
      },
      {
        speaker: 'xun',
        text: '史载观察是相接。动机「因晕船」属推演——你决策的是结果：密还是疏。',
      },
    ],
  },
  {
    id: 'n04_read_ships',
    kind: 'read',
    label: '翻卷：首尾相接与火攻',
    hint: '周瑜传',
    showRefs: ['R-ships-join', 'R-z11', 'R-fire-kit'],
    lines: [
      {
        speaker: 'system',
        text: '黄盖的判断建立在观察：船舰相接。油柴、帷幕、牙旗、走舸是组合技。密泊提高组合技的期望。',
      },
    ],
  },
  {
    id: 'n04_read_persist',
    kind: 'read',
    label: '翻卷：难与持久',
    hint: '催火攻的理由',
    showRefs: ['R-hard-persist', 'R-z14'],
    lines: [
      {
        speaker: 'system',
        text: '「寇众我寡，难与持久」——敌方催速决的句子。你防火拖时间，可能中其焦虑，也可能逼其改计划。双刃。',
      },
    ],
  },
]

export const prepN05: PrepAction[] = [
  {
    id: 'n05_walk_shore',
    kind: 'walk',
    label: '到外泊岸边',
    hint: '降船方向与气味',
    lines: [
      {
        speaker: 'system',
        text: '初战不利之后，北岸更静，也更躁。有人盼捷报，像盼水。对岸隐约有帆，风里偶尔带一丝{{膏油}}气——像降船，也像火船。',
      },
      {
        speaker: 'soldier',
        text: '斥候：来书自称{{黄盖}}部曲，愿为前部归命。前部，就是靠近的合法说法。',
      },
    ],
  },
  {
    id: 'n05_walk_camp',
    kind: 'walk',
    label: '巡一圈营门纪律',
    hint: '出营立观会不会发生',
    lines: [
      {
        speaker: 'system',
        text: '营门岗哨松着。有人已经把脖子探出寨外练「看热闹」的姿势——还没有热闹，姿势先有了。',
      },
      {
        speaker: 'soldier',
        text: '什长说：若真来降，丞相不让看，弟兄们会骂扫兴。打累了的人，最需要一场不战而胜。',
      },
      {
        speaker: 'system',
        text: '（因为密泊）失距烧的是整泊区，不是一艘船。',
        when: { loose_ships: false },
      },
      {
        speaker: 'system',
        text: '（因为疏泊）仍不可把观降当阅兵。疏泊只给你第二次机会，不是豁免。',
        when: { loose_ships: true },
      },
    ],
  },
  {
    id: 'n05_walk_letter',
    kind: 'walk',
    label: '看降书原件',
    hint: '语法与距离',
    lines: [
      {
        speaker: 'system',
        text: '降书墨未干。众寡不敌、愿归命、请为前部——语法无懈可击。战术上，它把发火距离写成忠诚。',
      },
      {
        speaker: 'soldier',
        text: '行人还在外寨等。有人已拟口敕草稿：若信实，赏格从优。',
      },
    ],
  },
  {
    id: 'n05_ask_cheng',
    kind: 'ask',
    label: '问程昱：受降链',
    hint: '许赏→观验→失距',
    lines: [
      {
        speaker: 'cheng',
        text: '受降：拆敌、示强、速决。史路如此。将校已经开始伸脖子——初战之后，人更需要「不战而胜」。',
      },
      {
        speaker: 'cheng',
        text: '链是：许赏→期待→观验→失距。每环合理，合在一起可以致命。我呈甲案，也呈这条链。',
      },
    ],
  },
  {
    id: 'n05_ask_jia',
    kind: 'ask',
    label: '问贾诩：恐诈够不够',
    hint: '心情 vs 条令',
    lines: [
      {
        speaker: 'jia',
        text: '注里会有「但恐汝诈」。怕，却仍可能{{延颈观望}}、甚至{{出营立观}}。怕与松懈能同时活在一个人身上。',
      },
      {
        speaker: 'jia',
        text: '密问只证明你怕过。禁出营、射程外停泊，才是距。心情够了，条令仍可能缺。',
      },
    ],
  },
  {
    id: 'n05_ask_xun',
    kind: 'ask',
    label: '问荀彧：防诈的利息',
    hint: '难与持久',
    lines: [
      {
        speaker: 'xun',
        text: '远泊、强弩、禁出营：火船难近。代价是「{{难与持久}}」。黄盖怕持久；你防诈，可能把战争拖进他更怕、也更擅长熬的节奏。',
      },
      {
        speaker: 'xun',
        text: 'B不必斩使屠船；最小是距离与出营纪律。可执行，也会被骂。',
      },
    ],
  },
  {
    id: 'n05_read_false',
    kind: 'read',
    label: '翻卷：诈降与观降',
    hint: '周瑜传 · 江表传',
    showRefs: ['R-false-surrender', 'R-fear-fraud', 'R-z18'],
    lines: [
      {
        speaker: 'system',
        text: '史路：指言盖降，延颈，出营立观。材料提醒：恐惧是心情，防距是条令。',
      },
    ],
  },
  {
    id: 'n05_read_award',
    kind: 'read',
    label: '翻卷：爵赏与密问',
    hint: '短利链',
    showRefs: ['R-z19', 'R-z17', 'R-gai-letter'],
    lines: [
      {
        speaker: 'system',
        text: '超于前后的爵赏许诺，服务招降，也服务松懈。短利链上每环都「合理」。',
      },
    ],
  },
]
