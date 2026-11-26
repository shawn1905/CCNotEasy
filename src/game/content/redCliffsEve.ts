import type { Chapter } from '../types'

export const redCliffsEve: Chapter = {
  id: 'red-cliffs-eve',
  title: '赤壁前夜',
  subtitle: '曹操不容易 · Demo',
  start: 'N00',
  gloss: {
    连锁: {
      id: '连锁',
      title: '连锁',
      body: '把船用铁链、木板连成一片，减少风浪颠簸。利：北方士兵少晕船。弊：火一起，整排船走不掉。',
      source: '《三国志》裴注引《江表传》等记赤壁用火攻破连船。',
    },
    疾疫: {
      id: '疾疫',
      title: '疾疫',
      body: '军中流行的传染病。北方人到江南，水土不服，病亡可拖垮整支部队。',
      source: '《三国志·武帝纪》记赤壁前后「大疫，吏士多死者」。',
    },
    粮道: {
      id: '粮道',
      title: '粮道',
      body: '运粮的水路与中转仓。江上打仗，粮船晚一天，前线就可能饿一天。',
    },
    火攻: {
      id: '火攻',
      title: '火攻',
      body: '用火烧船、烧营。冬日东南风一起，火借风势，连船最怕这个。',
    },
    东南风: {
      id: '东南风',
      title: '东南风',
      body: '冬天长江一带偶发的东南风。火攻方若借上这阵风，风向对曹操不利。',
    },
    降将: {
      id: '降将',
      title: '降将',
      body: '刚投降过来的将领。有真降，也有诈降。你信不信，本身就是赌注。',
    },
    荆州水军: {
      id: '荆州水军',
      title: '荆州水军',
      body: '原属荆州的水上手。曹操得荆州后收编他们，但忠诚与编制都未稳。',
    },
    乌林: {
      id: '乌林',
      title: '乌林',
      body: '长江南岸一带地名，赤壁对岸。曹军屯驻处之一，火攻后溃退常从此起。',
    },
  },
  nodes: {
    N00: {
      id: 'N00',
      title: '开场',
      lines: [
        {
          speaker: 'system',
          text: '建安十三年冬。长江。你是曹操。',
        },
        {
          speaker: 'system',
          text: '北方八十万大军压境——帐下这么报；真能打的，你心里有数。',
        },
        {
          speaker: 'cao',
          text: '风往南刮的时候，连船像一座城。风要是转了……城会变成柴火。',
        },
        {
          speaker: 'cheng',
          text: '丞相，今晚三件事：船要不要再加链，病号报不报实数，还有——有人说要来降。',
        },
        {
          speaker: 'jia',
          text: '我只提醒一句：每件事你选快，后面都会催你更快。',
        },
      ],
      choices: [
        {
          id: 'N00_go',
          label: '先把船的事定了',
          hint: '进入第一难',
          next: 'N01',
        },
      ],
    },

    N01: {
      id: 'N01',
      title: '第一难 · 连锁',
      lines: [
        {
          speaker: 'cheng',
          text: '{{连锁}}已经铺了一半。北方兵终于不太吐了，粮草也省在舱里。',
        },
        {
          speaker: 'soldier',
          text: '报告：下游有人夜探，像是东吴的小船。要不要今晚把余下的链全焊死？',
        },
        {
          speaker: 'jia',
          text: '焊死，稳；留缝，活。稳的时候，火来了你跑不掉。活的时候，风浪来了你吐到明天。',
        },
        {
          speaker: 'cao',
          text: '说人话。',
        },
        {
          speaker: 'jia',
          text: '人话：你今晚省下的呕吐，可能变成明天的灰。',
        },
      ],
      choices: [
        {
          id: 'N01_A',
          label: 'A · 全部连锁，今晚焊死',
          hint: '稳，但怕火',
          effects: [{ set: 'loose_ships', value: false }],
          next: 'N01_A_out',
        },
        {
          id: 'N01_B',
          label: 'B · 留活口，分批连锁',
          hint: '活，但晃',
          effects: [{ set: 'loose_ships', value: true }],
          next: 'N01_B_out',
        },
      ],
    },

    N01_A_out: {
      id: 'N01_A_out',
      lines: [
        {
          speaker: 'cheng',
          text: '得令。铁链连夜加紧。士兵睡稳了，营里终于安静。',
        },
        {
          speaker: 'cao',
          text: '安静好。安静到对手听不见我们喘气。',
        },
        {
          speaker: 'jia',
          text: '也听不见我们拆链的声音——如果有必要拆的话。',
        },
      ],
      next: 'N02',
    },

    N01_B_out: {
      id: 'N01_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '得令。外圈留活扣，内圈照旧。有人又开始吐了。',
        },
        {
          speaker: 'cao',
          text: '吐就吐。吐完还能跑，比跑不了强。',
        },
        {
          speaker: 'jia',
          text: '希望你明天还记得今晚说的这句话。',
        },
      ],
      next: 'N02',
    },

    N02: {
      id: 'N02',
      title: '第二难 · 疾疫',
      lines: [
        {
          speaker: 'xun',
          text: '丞相，{{疾疫}}的名册……帐上写「偶有不适」。军医私下说：每十人里有两三个抬不动刀。',
        },
        {
          speaker: 'cheng',
          text: '若报实数，后方会催粮、催援，也有人会说丞相治军不严。若不报——前线按虚数派活，死人会更快。',
        },
        {
          speaker: 'jia',
          text: '诚实花钱，撒谎也花钱。差别只是：谁先发现账单是假的。',
        },
        {
          speaker: 'cao',
          text: '发现的人，是我，还是东吴？',
        },
        {
          speaker: 'jia',
          text: '最好是你。最坏是东南风。',
        },
      ],
      choices: [
        {
          id: 'N02_A',
          label: 'A · 报实数，减勤务、催药',
          hint: '账真，士气可能晃',
          effects: [
            { set: 'plague_honesty', value: true },
            { cost: '本旬药钱、运力上浮；部分将领私下嘀咕「丞相示弱」。' },
          ],
          next: 'N02_A_out',
        },
        {
          id: 'N02_B',
          label: 'B · 维持虚报，强撑编制',
          hint: '账假，派活照旧',
          effects: [
            { set: 'plague_honesty', value: false },
            { cost: '当面省了奏报麻烦；病号仍按满员派差。' },
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
          text: '名册改了。药船今夜起锚。有人骂你慌——更多人终于能躺下。',
        },
        {
          speaker: 'cao',
          text: '骂我的人明天还要吃饭。躺下的人，明天或许还能站起来。',
        },
      ],
      next: 'N03',
    },

    N02_B_out: {
      id: 'N02_B_out',
      lines: [
        {
          speaker: 'xun',
          text: '名册不动。巡营的人装没看见有人咳血。',
        },
        {
          speaker: 'cao',
          text: '装没看见，也是一种看见。',
        },
        {
          speaker: 'jia',
          text: '东吴那边若有细作，他们看见的比你多。',
        },
      ],
      next: 'N03',
    },

    N03: {
      id: 'N03',
      title: '过场 · 粮与风',
      lines: [
        {
          speaker: 'cheng',
          text: '{{粮道}}报：上游两艘粮船晚了半日。不是丢了，是风不对。',
        },
        {
          speaker: 'cao',
          text: '风不对，人就饿。人饿了，链再稳也没用。',
        },
        {
          speaker: 'jia',
          text: '观测说今夜可能转{{东南风}}。也可能只是观星的人喝多了。',
        },
        {
          speaker: 'system',
          text: '你没有更多情报。只有下一道选择题。',
        },
      ],
      next: 'N04',
    },

    N04: {
      id: 'N04',
      title: '第三难 · 降将',
      lines: [
        {
          speaker: 'soldier',
          text: '有人夜叩外营，自称东吴{{降将}}，带十艘小船、愿献火油与水路图。',
        },
        {
          speaker: 'cheng',
          text: '验过刀伤，像真的。但真伤也可以是戏。',
        },
        {
          speaker: 'jia',
          text: '你若全信，门开得太大；你若全疑，可能把真降推回去——而他手里的图，也许是假的，也许是要命的真。',
        },
        {
          speaker: 'cao',
          text: '我最烦的不是骗子。是半真半假的人。',
        },
        {
          speaker: 'jia',
          text: '半真半假，才配得上「不容易」。',
        },
      ],
      choices: [
        {
          id: 'N04_A',
          label: 'A · 收船、收人，速战速决',
          hint: '快，但门大',
          effects: [
            { set: 'suspect_defection', value: false },
            { set: 'haste', value: true },
            { cost: '外营今夜对「来船」放行一档；斥候班次压缩。' },
          ],
          next: 'N04_A_out',
        },
        {
          id: 'N04_B',
          label: 'B · 扣人验供，船泊外港',
          hint: '慢，但门窄',
          effects: [
            { set: 'suspect_defection', value: true },
            { set: 'haste', value: false },
            { cost: '今夜多耗一队精卒看守；进攻窗口可能错半日。' },
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
          text: '人收下了。他说东南风起时，可顺流点{{火攻}}。听着很甜。',
        },
        {
          speaker: 'cao',
          text: '甜的东西，我吃过。有的是蜜，有的是药。',
        },
        {
          speaker: 'jia',
          text: '药和蜜混在一碗里的时候，舌头最先说谎。',
        },
      ],
      next: 'N05',
    },

    N04_B_out: {
      id: 'N04_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '人扣在外港。供词前后有两处对不上——他说「记混了」。',
        },
        {
          speaker: 'cao',
          text: '记混了，也可以是怕。也可以是演。',
        },
        {
          speaker: 'jia',
          text: '你至少没把钥匙直接塞进陌生人手里。钥匙在你这儿，火来了，你还能选择锁哪扇门。',
        },
      ],
      next: 'N05',
    },

    N05: {
      id: 'N05',
      title: '第四难 · 何时出手',
      lines: [
        {
          speaker: 'cheng',
          text: '{{荆州水军}}编制未稳，有人请战，有人请守。{{乌林}}方向烟多，像有人在练火。',
        },
        {
          speaker: 'xun',
          text: '若今夜出击，可打乱对方节奏；若再等一日，粮到、病号喘息——可对方也可能等同一日。',
        },
        {
          speaker: 'jia',
          text: '你前面选的「快」或「稳」，会在这里结算。不是道德结算，是风向结算。',
        },
        {
          speaker: 'cao',
          text: '结算词呢？',
        },
        {
          speaker: 'jia',
          text: '两个字：撑住。或者：撤。',
        },
      ],
      choices: [
        {
          id: 'N05_A',
          label: 'A · 今夜进逼，抢窗口',
          hint: '加压，容错更小',
          effects: [
            { set: 'haste', value: true },
            { cost: '斥候与预备队提前消耗；若风向突变，回旋余地变薄。' },
          ],
          next: 'N05_A_out',
        },
        {
          id: 'N05_B',
          label: 'B · 再等一昼夜，固营观风',
          hint: '留气，也可能把气等没',
          effects: [
            { set: 'haste', value: false },
            { cost: '多耗一日粮与焦躁；进攻主动权可能易手。' },
          ],
          next: 'N05_B_out',
        },
      ],
    },

    N05_A_out: {
      id: 'N05_A_out',
      lines: [
        {
          speaker: 'system',
          text: '号角压低。船影朝南压过去。江面像一块被撕开的布。',
        },
        {
          speaker: 'cao',
          text: '快走。走慢了，火会先到。',
        },
      ],
      next: 'N06',
    },

    N05_B_out: {
      id: 'N05_B_out',
      lines: [
        {
          speaker: 'system',
          text: '营火压暗。江上只听见链环偶尔一响。',
        },
        {
          speaker: 'cao',
          text: '等。等不是认输，是把刀子握热。',
        },
      ],
      next: 'N06',
    },

    N06: {
      id: 'N06',
      title: '风向',
      lines: [
        {
          speaker: 'soldier',
          text: '报——东南风起！',
        },
        {
          speaker: 'cheng',
          text: '对岸火光连成一线。不是炊烟。',
        },
        {
          speaker: 'jia',
          text: '该结算了。',
        },
        {
          speaker: 'cao',
          text: '……把账拿来。',
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
          text: '【战报拼装中——依你今夜四次抉择】',
        },
      ],
      next: 'N08_route',
    },

    N08_route: {
      id: 'N08_route',
      lines: [
        {
          speaker: 'system',
          text: '江面还在烧。你得给自己一个说法。',
        },
      ],
      next: 'ENDING_PICK',
    },

    ENDING_PICK: {
      id: 'ENDING_PICK',
      lines: [
        {
          speaker: 'system',
          text: '（路由结局）',
        },
      ],
      next: 'E_ESCAPE',
    },

    E_ESCAPE: {
      id: 'E_ESCAPE',
      kind: 'ending',
      endingId: 'escape',
      title: '结局 · 跑得掉',
      lines: [
        {
          speaker: 'system',
          text: '火咬住外圈，内圈的活扣被砍开。人挤上小船，骂声、水声、铁链断裂声搅在一起。',
        },
        {
          speaker: 'cao',
          text: '丢脸。但丢脸的人还活着，能写下一道命令。',
        },
        {
          speaker: 'jia',
          text: '你留下了缝。缝很小，刚好够一条命侧身过去。',
        },
        {
          speaker: 'cheng',
          text: '清点：船损过半，人……还能整编。丞相，往哪里？',
        },
        {
          speaker: 'cao',
          text: '往还能喘气的地方。然后——再谈「不容易」。',
        },
        {
          speaker: 'system',
          text: '【结局：跑得掉】不是胜利。是还握得住下一局的资格。',
        },
      ],
    },

    E_HOLD: {
      id: 'E_HOLD',
      kind: 'ending',
      endingId: 'hold',
      title: '结局 · 撑住',
      lines: [
        {
          speaker: 'system',
          text: '火来了，但编制没先崩。病号名单是真的，预备队还在。有人诈降被扣在外港，火船没能贴到核心。',
        },
        {
          speaker: 'cao',
          text: '撑住。不是英雄，是账单勉强平。',
        },
        {
          speaker: 'jia',
          text: '平账单的人，很少被写成英雄。但明天军还在。',
        },
        {
          speaker: 'xun',
          text: '东吴退了半里。我们……也退了半里。江还是那条江。',
        },
        {
          speaker: 'cao',
          text: '那就够了。今晚够了。',
        },
        {
          speaker: 'system',
          text: '【结局：撑住】你没赢赤壁。你赢了一夜没把命赔光。',
        },
      ],
    },

    E_BURN: {
      id: 'E_BURN',
      kind: 'ending',
      endingId: 'burn',
      title: '结局 · 烧穿',
      lines: [
        {
          speaker: 'system',
          text: '链是死的，门是开的，名册是假的，脚步是急的。东南风只负责点火，其余是你亲自堆的柴。',
        },
        {
          speaker: 'cao',
          text: '……我听见自己的船在叫。',
        },
        {
          speaker: 'jia',
          text: '船不会叫。叫的是还没烧完的人。',
        },
        {
          speaker: 'cheng',
          text: '丞相！北岸——北岸还有路！',
        },
        {
          speaker: 'cao',
          text: '走。把今晚记住。记住「快」是怎么变成灰的。',
        },
        {
          speaker: 'system',
          text: '【结局：烧穿】史书会写火攻。你自己清楚：火只是最后一根火柴。',
        },
      ],
    },
  },
}
