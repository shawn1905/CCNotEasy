import type { Chapter } from '../types'
import { dossiers } from './dossiers'

/** 赤壁前夜 Demo v4 — 史料锚定 + 两害张力；幽默≤1/10 */
export const redCliffsEve: Chapter = {
  id: 'red-cliffs-eve',
  title: '赤壁前夜',
  subtitle: '曹操不容易 · 史料版 Demo',
  start: 'N00',
  gloss: {
    八十万: {
      id: '八十万',
      title: '水军八十万',
      body: '写给孙权看的数字，用来吓人，不是清点后的实数。周瑜私下估：北方旧部约十五六万且疲，荆州新附约七八万且不稳。',
      source: '《周瑜传》注引《江表传》',
    },
    军实: {
      id: '军实',
      title: '江陵军实',
      body: '江陵城里的军用物资（粮、械、船资等）。曹操怕刘备先占，才丢掉辎重、轻军急追。具体清单史书没写细。',
      source: '《三国志·先主传》',
    },
    更始: {
      id: '更始',
      title: '与之更始',
      body: '字面是「重新开始」：进江陵后安抚吏民、既往清算与封赏并行。这是安顿降地的政治动作，要花时间。',
      source: '《三国志·武帝纪》',
    },
    疾疫: {
      id: '疾疫',
      title: '疾疫',
      body: '军队里的流行疫病。赤壁相遇时曹军「已有疾病」，说明病在火攻前就存在；战后又记大疫多死。',
      source: '《周瑜传》《武帝纪》',
    },
    四患: {
      id: '四患',
      title: '周瑜所陈四患',
      body: '关西未安、北人不擅水战、盛寒缺马草、远来易病。周瑜认为曹操四条都踩了。',
      source: '《三国志·周瑜传》',
    },
    首尾相接: {
      id: '首尾相接',
      title: '船舰首尾相接',
      body: '船头船尾连成一片（或靠得很密）。黄盖看见这一点才说「可烧」。史书没写「因晕船才连船」——那是后人推想。',
      source: '《周瑜传》；《通鉴》卷65',
    },
    诈降: {
      id: '诈降',
      title: '黄盖诈降',
      body: '假装投降以接近对方。黄盖先送信，再开油柴船靠近；曹军有人伸颈观望，甚至出营立看。',
      source: '《周瑜传》及注引《江表传》',
    },
    玄武池: {
      id: '玄武池',
      title: '玄武池肄舟师',
      body: '邺城北郊的练水池。「肄舟师」=练习水军。练的是静水基础，不等于长江会战。',
      source: '《三国志·武帝纪》',
    },
    长坂: {
      id: '长坂',
      title: '长坂急追',
      body: '五千精骑一日一夜追三百多里，在当阳长坂打散刘备随行大队并缴获辎重。快，也很耗人马。',
      source: '《三国志·先主传》',
    },
    统本兵: {
      id: '统本兵',
      title: '文聘统本兵',
      body: '让文聘继续带领自己原来的部队。等于买荆州旧将的水战能力，也留下「旧部听谁的」问题。',
      source: '《三国志·武帝纪》',
    },
    蒙冲斗舰: {
      id: '蒙冲斗舰',
      title: '蒙冲斗舰',
      body: '荆州水军里的大型战船类型。江东议者说刘表此类船「乃以千数」，曹操接手后可以沿江浮行。',
      source: '《三国志·周瑜传》',
    },
    条品: {
      id: '条品',
      title: '条品',
      body: '逐条品评人物高下、能否任用。《通鉴》记曹操使韩嵩「条品州人优劣，皆擢而用之」。',
      source: '《资治通鉴》卷65',
    },
    舰籍: {
      id: '舰籍',
      title: '舰籍',
      body: '本游戏用语：船只要登记清楚——谁指挥、能否作战、只做运输还是未验收。史书无此簿名，属编制推演。',
      source: '推演用语；对照「得其水军」见《周瑜传》',
    },
    会猎: {
      id: '会猎',
      title: '会猎于吴',
      body: '遗书里的外交辞令：说要带水军到江东「一起打猎」，实际是威逼恐吓。',
      source: '《江表传》/《通鉴》所载遗权书',
    },
    柴桑: {
      id: '柴桑',
      title: '柴桑',
      body: '孙权当时议事、诸葛亮见权的地点（今江西九江一带）。江东主战/主和在此拍板。',
      source: '《通鉴》等据《亮传》系统',
    },
    巴丘: {
      id: '巴丘',
      title: '巴丘',
      body: '长江中游江防要地（今湖南岳阳一带）。《武帝纪》：曹操自江陵征刘备，先至巴丘。',
      source: '《三国志·武帝纪》',
    },
    合肥: {
      id: '合肥',
      title: '合肥',
      body: '淮南重镇。孙权曾攻合肥，曹操遣将救援。与赤壁谁先谁后，史书有异说。',
      source: '《武帝纪》；裴注引孙盛《异同评》',
    },
    偏师: {
      id: '偏师',
      title: '偏师',
      body: '非主力的一路部队。救合肥用偏师，说明长江仍是主攻，但兵力已被拆走一截。',
      source: '兵语；事见《武帝纪》遣张憙救合肥',
    },
    黄盖: {
      id: '黄盖',
      title: '黄盖',
      body: '周瑜部将。提出看准曹军船阵相接、用火船并假装投降接近。',
      source: '《三国志·周瑜传》',
    },
    难与持久: {
      id: '难与持久',
      title: '难与持久',
      body: '黄盖原话：敌众我寡，很难打持久战，所以要火攻速决。你若防诈拖时间，可能正合这句——也可能躲过一火。',
      source: '《三国志·周瑜传》',
    },
    引次江北: {
      id: '引次江北',
      title: '引次江北',
      body: '初战不利后，把部队退到长江北岸驻扎，与南岸吴军对峙。',
      source: '《三国志·周瑜传》',
    },
    延颈观望: {
      id: '延颈观望',
      title: '延颈观望',
      body: '伸长脖子看。曹军吏士以为黄盖来降，聚观看热闹——防火距离因此变近。',
      source: '《三国志·周瑜传》',
    },
    出营立观: {
      id: '出营立观',
      title: '出营立观',
      body: '走出营寨站着看。《江表传》/《通鉴》写法，比「延颈」更松懈。',
      source: '《周瑜传》注；《通鉴》卷65',
    },
    刘璋给军: {
      id: '刘璋给军',
      title: '刘璋遣兵给军',
      body: '益州牧刘璋开始向曹操提供兵力支援。远方输血能缓一口气，也带来「远援是否可靠」的问题。',
      source: '《三国志·武帝纪》',
    },
    侯者: {
      id: '侯者',
      title: '侯者十五人',
      body: '因归附有功被封侯的共十五人。封赏是「更始」政策的一部分，要名籍、要食邑安排。',
      source: '《三国志·武帝纪》',
    },
    肄舟师: {
      id: '肄舟师',
      title: '肄舟师',
      body: '肄＝练习；舟师＝水军。在玄武池练水军。',
      source: '《武帝纪》及裴注',
    },
  },
  refs: dossiers,
  nodes: {
    N00: {
      id: 'N00',
      title: '开场 · 江陵夜',
      lines: [
        {
          speaker: 'system',
          text: '建安十三年。长坂的灰还没冷透。你在江陵。',
        },
        {
          speaker: 'system',
          text: '帐外有人喝酒庆功。帐里三个人等你拍板——拍错，死的不是他们先死。',
        },
        {
          speaker: 'cheng',
          text: '{{长坂}}：五千骑，一日一夜三百余里。人众辎重已入册。江陵{{军实}}在手。{{更始}}令已下，{{侯者}}名籍——还缺一口气。',
        },
        {
          speaker: 'xun',
          text: '春间{{玄武池}}{{肄舟师}}，练的是邺池。今夜要上的是荆州{{蒙冲斗舰}}。北军与降附水手，还没有同听一个鼓点。',
        },
        {
          speaker: 'jia',
          text: '江东已见书：{{八十万}}。他们怕，就会乱；他们不信，就会按实数来杀我们。',
        },
        {
          speaker: 'cao',
          text: '胜利之后，最容易死的是「再快一点」。把日历摊开。',
        },
        {
          speaker: 'cheng',
          text: '东下，与再抚。不能两件都做完。只能选哪一件先欠。',
        },
      ],
      choices: [
        {
          id: 'N00_go',
          label: '进入府议',
          hint: '第一难：江陵日历',
          next: 'N01',
        },
      ],
    },

    N01: {
      id: 'N01',
      title: '第一难 · 江陵日历',
      refs: ['R-jiangling-more', 'R-water-fleet', 'R-four-woes', 'R-eighty-wan'],
      lines: [
        {
          speaker: 'cheng',
          text: '将校多请即日东下。理由很硬：备新败，江东震恐，{{会猎}}书已出——窗口短，错过就变成相持。',
        },
        {
          speaker: 'soldier',
          text: '帐外有人喊：威已成，不取更待何时！鼓声几乎要替你表决。',
        },
        {
          speaker: 'xun',
          text: '未完之事也硬：降人{{条品}}、{{舰籍}}、文聘{{统本兵}}如何接令、{{刘璋给军}}是否入账。再留旬日，账更实——敌也更备。',
        },
        {
          speaker: 'jia',
          text: '周瑜若主战，会陈{{四患}}。你此刻东下，等于四患都签字认领。认领可以；别装作没看见。',
        },
        {
          speaker: 'soldier',
          text: '斥候：{{柴桑}}使者往来密。迎或战，尚未定谳——所以他们也在抢日历。',
        },
        {
          speaker: 'cao',
          text: '东下买势。再抚买命与编制。势能吓人；命能打仗。选。',
        },
      ],
      choices: [
        {
          id: 'N01_A',
          label: 'A · 即日部署东下',
          hint: '短利：窗口与威压；欠账：更始、舰籍、筛疫',
          effects: [
            { set: 'haste', value: true },
            { cost: '预支一旬漕运（粮草）；安抚与舰籍清点压缩。' },
          ],
          next: 'N01_A_out',
        },
        {
          id: 'N01_B',
          label: 'B · 再留旬日，先完更始与舰籍',
          hint: '短利：降附真听令；欠账：怯名与敌方准备时间',
          effects: [
            { set: 'haste', value: false },
            { cost: '抛出赏钱酒肉安家（钱帛）；会猎时效下降。' },
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
          text: '得令。管粮吏当面记账：开拔须预支一旬漕运——粮草先挖一刀。前锋按{{巴丘}}序次。',
        },
        {
          speaker: 'xun',
          text: '名籍未齐就动旗。日后战报上的「兵力」会比实营好看，也会比实营脆。',
        },
        {
          speaker: 'jia',
          text: '你买到了日历。利息不会用钱付——会用咳、用火、用观降来付。',
        },
        {
          speaker: 'system',
          text: '帐外欢呼。角落里有人咳得停不住。没人愿意在这时候提。',
        },
      ],
      next: 'N02',
    },

    N01_B_out: {
      id: 'N01_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '得令。府吏发赏：安家钱帛先抛一笔。{{侯者}}名籍限期呈核；{{舰籍}}分可战、转运、未验三簿。',
        },
        {
          speaker: 'soldier',
          text: '帐外有人低声说「怯」。磨刀声小了一点——像被这句话按住。',
        },
        {
          speaker: 'jia',
          text: '你买到了编制的缝。江东若在这旬日定战，你送给他们的是准备时间。',
        },
        {
          speaker: 'xun',
          text: '缝很贵。但没有缝的东下，死起来会连名字都来不及改。',
        },
      ],
      next: 'N02',
    },

    N02: {
      id: 'N02',
      title: '第二难 · 疾疫名册',
      refs: ['R-plague-before', 'R-plague-must', 'R-plague-aftermath', 'R-eighty-wan'],
      lines: [
        {
          speaker: 'system',
          text: '汇合 · 疫报到案。欢呼退了，名册上台。',
        },
        {
          speaker: 'soldier',
          text: '军医密报：咳热、下痢已在数营。还够不上「大疫」二字——够不上，人已经死在路上了。',
        },
        {
          speaker: 'xun',
          text: '周瑜早说过：远涉江湖，「必生疾病」。遇敌时若「已有疾病」，那不是意外，是账单提前到了。',
        },
        {
          speaker: 'cheng',
          text: '摊牌：减勤务、隔离、催药——账面立刻难看，{{八十万}}自我拆穿。压报：日程与势都保住——病卒仍按健卒上橹。',
        },
        {
          speaker: 'jia',
          text: '假编制打真仗，死的时候才会发现：你骗过的不只是江东，还有你自己的调度。',
        },
        {
          speaker: 'cheng',
          text: '（因为你东下已宣）旗已动，药与留养的余地被日历咬薄。压报能保势；也会把咳送上船。',
          when: { haste: true },
        },
        {
          speaker: 'cheng',
          text: '（因为你留抚）隔离营与药船尚可腾。你可以实报——也可以继续用势压死真相。',
          when: { haste: false },
        },
        {
          speaker: 'cao',
          text: '名册从真，还是从势。选完，不许装没选过。',
        },
      ],
      choices: [
        {
          id: 'N02_A',
          label: 'A · 压报，维持满员出征',
          hint: '短利：势与日程；欠账：真战力与传染链',
          effects: [
            { set: 'plague_honesty', value: false },
            { cost: '病卒按满员派差；医药后置。' },
          ],
          next: 'N02_A_out',
        },
        {
          id: 'N02_B',
          label: 'B · 实报减员，隔离催药',
          hint: '短利：可战者更实；欠账：示弱与流言',
          effects: [
            { set: 'plague_honesty', value: true },
            { cost: '账面兵力下调；药船运力上浮；「怯战」流言起。' },
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
          text: '名册不动。巡营记「偶有不适」。能走路的，上橹。',
        },
        {
          speaker: 'jia',
          text: '细作若在，他们看见的病号比你名册多。你输的第一仗，可能是情报仗。',
        },
        {
          speaker: 'cao',
          text: '先把江走完。账，到对岸再算——如果还有岸。',
        },
      ],
      next: 'N03',
    },

    N02_B_out: {
      id: 'N02_B_out',
      lines: [
        {
          speaker: 'xun',
          text: '名册改实。重病出列，轻病减役，药船离栈。已有将领问：丞相是不是怕了。',
        },
        {
          speaker: 'cheng',
          text: '怕的名声可辩。带着虚数赴敌，死后没有辩词。',
        },
        {
          speaker: 'cao',
          text: '让他们问。问的人至少还站得住——这就是实报买到的东西。',
        },
      ],
      next: 'N03',
    },

    N03: {
      id: 'N03',
      title: '过场 · 巴丘江面',
      lines: [
        {
          speaker: 'system',
          text: '军至{{巴丘}}。{{合肥}}另遣{{偏师}}——长江仍是主攻，但刀已被掰走一截。',
        },
        {
          speaker: 'cheng',
          text: '北岸泊区：浪颠、夜散、号令不齐。有人请密泊相衔，像陆地营寨一样「整」。',
        },
        {
          speaker: 'jia',
          text: '「整」很好看。火来的时候，好看会变成一种死法。',
        },
        {
          speaker: 'xun',
          text: '（因为名册是假的）密泊会把病人和健卒锁进同一阵风里。你若相接，等于给疾病加舱。',
          when: { plague_honesty: false },
        },
        {
          speaker: 'xun',
          text: '（因为名册是真的）重病已出列——密泊仍危险，至少不是拿假人数去赌。',
          when: { plague_honesty: true },
        },
      ],
      next: 'N04',
    },

    N04: {
      id: 'N04',
      title: '第三难 · 船阵',
      refs: ['R-ships-join', 'R-hard-persist', 'R-ships-motive-bound'],
      lines: [
        {
          speaker: 'cheng',
          text: '议案甲：舟舰{{首尾相接}}，如营。利：减散阵、便号令、北军上下省力。将校多赞成——像又赢了长坂那样整齐。',
        },
        {
          speaker: 'jia',
          text: '议案乙：疏泊分屯，留防火道与砍缆。利：火难一网。弊：夜惊、浪损、指挥变慢。{{黄盖}}怕的正是「{{难与持久}}」——你防久了，可能正合他意。',
        },
        {
          speaker: 'soldier',
          text: '对岸已有帆影。初战若不利，将{{引次江北}}。那时船阵会被人看清——看清就可以写进火攻的前提。',
        },
        {
          speaker: 'cao',
          text: '相接是别人眼里的结果。我要问的是：这个结果，值不值得用整泊区去换。',
        },
      ],
      choices: [
        {
          id: 'N04_A',
          label: 'A · 密泊相接，统一号令',
          hint: '史实观察向；稳，怕火',
          effects: [
            { set: 'loose_ships', value: false },
            { cost: '泊阵如营；火灾时难以分割。' },
          ],
          next: 'N04_A_out',
        },
        {
          id: 'N04_B',
          label: 'B · 疏泊分屯，留砍缆防火',
          hint: '旁支；活，怕散与持久',
          effects: [
            { set: 'loose_ships', value: true },
            { cost: '号令变慢；夜警浪损上升；防火分割可行。' },
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
          text: '舟阵按相接部署。一夜号令，全泊区能听见。北军上下船顺利——将校终于露出「这才像丞相军」的脸。',
        },
        {
          speaker: 'jia',
          text: '对岸若有人观阵，会得到一句很干净的话：首尾相接，可烧而走。干净，往往致命。',
        },
      ],
      next: 'N05',
    },

    N04_B_out: {
      id: 'N04_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '外圈疏泊，砍缆斧发到什长。有人抱怨：不像「整」。夜里已有两艘撞索，骂声盖过浪声。',
        },
        {
          speaker: 'jia',
          text: '整是为了打。散是为了不被一火打完。你选了难看的整——利息在后夜收。',
        },
      ],
      next: 'N05',
    },

    N05: {
      id: 'N05',
      title: '第四难 · 来降',
      refs: ['R-false-surrender', 'R-fear-fraud', 'R-first-defeat', 'R-hard-persist'],
      lines: [
        {
          speaker: 'system',
          text: '初战不利。{{引次江北}}。对岸有人先书请降——像送来一把钥匙，也像送来一根引线。',
        },
        {
          speaker: 'soldier',
          text: '来书自称{{黄盖}}部曲：众寡不敌，愿为前部归命。船近时有膏油气。斥候说：像降船，也像火船。',
        },
        {
          speaker: 'cheng',
          text: '受降：拆敌、示强、速决。史路如此。将校已经开始伸脖子。',
        },
        {
          speaker: 'jia',
          text: '注里会有「但恐汝诈」。怕，却仍可能{{延颈观望}}、甚至{{出营立观}}。怕与松懈，能同时活在一个人身上——尤其是打累了的人。',
        },
        {
          speaker: 'xun',
          text: '远泊、强弩、禁出营：火船难近。代价是「{{难与持久}}」。{{黄盖}}怕持久；你防诈，可能把战争拖进他更怕、也更擅长熬的节奏。',
        },
        {
          speaker: 'cao',
          text: '（因为船阵相接）观降一旦失距，烧的是整泊区——不是一艘船。',
          when: { loose_ships: false },
        },
        {
          speaker: 'cao',
          text: '（因为疏泊尚在）仍不可把观降当阅兵。疏泊只给你第二次机会，不是豁免。',
          when: { loose_ships: true },
        },
        {
          speaker: 'cao',
          text: '钥匙还是引线。选。',
        },
      ],
      choices: [
        {
          id: 'N05_A',
          label: 'A · 受降接洽，许赏，放近观验',
          hint: '短利：速决拆敌；史实诱向',
          effects: [
            { set: 'suspect_defection', value: false },
            { set: 'haste', value: true },
            { cost: '外泊警戒降档；吏士得出营观望。' },
          ],
          next: 'N05_A_out',
        },
        {
          id: 'N05_B',
          label: 'B · 扣使验供，射程外停泊，禁出营',
          hint: '短利：防火距；欠账：持久与骂名',
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
          text: '行人已见。口敕：若信实，赏格从优。泊区有人{{延颈观望}}——像在等一场属于自己的胜利。',
        },
        {
          speaker: 'jia',
          text: '胜利若来自降幡，火也从同一方向来。你听见欢呼了吗？那是引线烧到一半的声音。',
        },
      ],
      next: 'N06',
    },

    N05_B_out: {
      id: 'N05_B_out',
      lines: [
        {
          speaker: 'cheng',
          text: '使扣外寨。供词两处不合。船停强弩界外，夜禁出营。有将问：丞相要熬到何时——熬死的是谁。',
        },
        {
          speaker: 'jia',
          text: '熬，是防诈的利息。不熬，是火的利息。两笔都要人命作息。你只是选了哪一种死法更慢。',
        },
      ],
      next: 'N06',
    },

    N06: {
      id: 'N06',
      title: '风起',
      lines: [
        {
          speaker: 'soldier',
          text: '报——风转猛！对岸船队举帆前趋，有人高呼来降！',
        },
        {
          speaker: 'cheng',
          text: '烟起了。不是炊烟。',
        },
        {
          speaker: 'cao',
          text: '取账。把今夜以前的四次抉择，全部摊开。',
        },
      ],
      next: 'N07_report',
    },

    N07_report: {
      id: 'N07_report',
      kind: 'report',
      title: '战报',
      lines: [{ speaker: 'system', text: '【战报拼装】' }],
      next: 'N08_route',
    },

    N08_route: {
      id: 'N08_route',
      lines: [
        {
          speaker: 'system',
          text: '账已齐。结局不按愿望，按你签过字的四笔。',
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
          text: '船阵相接。观降失距。风盛火猛，舟营俱焚。军中本已有疾病——火只是把账单烧穿。',
        },
        {
          speaker: 'cheng',
          text: '请留曹仁等守江陵，主力北还。江南诸郡，将不在掌握。',
        },
        {
          speaker: 'cao',
          text: '日后若需一书，可写：值有疾病，烧船自退。那是给外人看的句子。',
        },
        {
          speaker: 'jia',
          text: '给自己看的句子更短：日历、名册、泊距、观降。你选了史书最熟悉的那一套——所以史书会写你。',
        },
        {
          speaker: 'system',
          text: '【结局：史实灰】绝对优势在此失效。不是因为你不够聪明，是因为聪明选了短利。',
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
          text: '火未能一次吞尽。疏泊或远拒让火攻减效。江面转入更长的消耗——没有凯旋，只有还活着的编制。',
        },
        {
          speaker: 'cheng',
          text: '南岸仍在压迫。我们保下一截舟骑，也把「八十万」戳穿。许下会有人写难听的账。',
        },
        {
          speaker: 'cao',
          text: '活着的编制，比完整的话术重要。但活着，不等于赢。',
        },
        {
          speaker: 'jia',
          text: '旁支的胜利通常难看。难看，是因为你付过防火与疑降的利息——利息从来不给人鼓掌。',
        },
        {
          speaker: 'system',
          text: '【结局：苦持】你让火攻史路偏转。战争不会因此变仁慈，只会换一种咬法。',
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
          text: '名册从实，戒备从严，东下未全押在恐吓上。初战与疾疫仍在——崩溃没有一次烧穿。',
        },
        {
          speaker: 'xun',
          text: '能战之卒少于出发时的话术。江东可以笑你「示弱」。他们笑的时候，你的人还在。',
        },
        {
          speaker: 'cao',
          text: '丞相府不需要鼓掌。需要下一道还能发出去的军令。',
        },
        {
          speaker: 'jia',
          text: '你丢掉的是势。你留下的是还可以计算的兵力。成年人的胜利，往往像失败一样安静。',
        },
        {
          speaker: 'system',
          text: '【结局：摊牌余生】你没有写成英雄。你写成了还能继续下命令的人。',
        },
      ],
    },
  },
}

