import type { Chapter } from '../types'
import { dossiers } from './dossiers'
import { gloss } from './gloss'

/** 赤壁前夜 · 史料加厚版（对话+本议史料×10） */
export const redCliffsEve: Chapter = {
  id: 'red-cliffs-eve',
  title: '赤壁前夜',
  subtitle: '曹操不容易 · 史料库加厚 Demo',
  start: 'N00',
  gloss,
  refs: dossiers,
  nodes: {
    'N00': {
      id: 'N00',
      title: '开场 · 江陵夜',
      refs: ['R-timeline-spine', 'R-changban-cost', 'R-eighty-wan', 'R-method'],
      lines: [
        {
          speaker: 'system',
          text: '建安十三年。秋末冬初。{{长坂}}的灰还没冷透，{{江陵}}的灯已经亮得过分。',
        },
        {
          speaker: 'system',
          text: '帐外有人喝酒庆功，有人磨刀，有人咳得像要把肺吐出来。帐里三个人等你拍板——拍错，死的不是他们先死。',
        },
        {
          speaker: 'cheng',
          text: '差遣呈核：五千骑，一日一夜三百余里。人众辎重已入册。{{军实}}在手。{{更始}}令已下，{{侯者}}名籍——还缺一口气，缺的是日历。',
        },
        {
          speaker: 'cheng',
          text: '将校多请即日东下。他们说的不是莽：备新败，江东震恐，{{会猎}}书已出。窗口是真的。窗口若关，就变成相持——相持对北军不利。',
        },
        {
          speaker: 'xun',
          text: '春间{{玄武池}}{{肄舟师}}，练的是邺池静水。今夜要上的是荆州{{蒙冲斗舰}}。北军与降附水手，还没有同听一个鼓点。得舰，不等于得死战。',
        },
        {
          speaker: 'xun',
          text: '周瑜若主战，会陈{{四患}}：关西未安、北人不擅水、{{盛寒}}缺{{藁草}}、远来必病。你此刻越急，越像主动签字认领。认领可以——别装作没看见。',
        },
        {
          speaker: 'jia',
          text: '江东已见书：{{八十万}}。他们怕，就会乱；他们不信，就会按实数来杀我们。话术是刀，也会反刃。',
        },
        {
          speaker: 'jia',
          text: '绝对优势为什么会失效？优势在军实、势、船、口径。失效在疾疫、指挥、观降与火。今晚开始，四笔账一张张上台。',
        },
        {
          speaker: 'soldier',
          text: '帐外有人喊：威已成！不取更待何时！鼓声几乎要替你表决。角落里有人咳得停不住——没人愿意在这时候提。',
        },
        {
          speaker: 'cao',
          text: '胜利之后，最容易死的是「再快一点」。把日历摊开。东下买势；再抚买命与编制。势能吓人，命能打仗。',
        },
        {
          speaker: 'cheng',
          text: '丞相差遣：进入府议。第一难——江陵日历。东下与再抚，不能两件都做完。只能选哪一件先欠。',
        },
      ],
      choices: [
        {
          id: 'N00_go',
          label: '进入府议 · 第一难',
          hint: '江陵日历：东下 vs 再抚',
          next: 'N01',
        },
      ],
    },

    'N01': {
      id: 'N01',
      title: '第一难 · 江陵日历',
      refs: ['R-jiangling-more', 'R-water-fleet', 'R-four-woes', 'R-eighty-wan', 'R-changban-cost', 'R-wenping', 'R-liuzhang', 'R-y01', 'R-y02', 'R-y03', 'R-y04', 'R-y05', 'R-z01', 'R-z02', 'R-z03', 'R-z04', 'R-z05'],
      lines: [
        {
          speaker: 'system',
          text: '府议开。案上两卷：东下行程，与再抚清单。两者抢同一段日子。',
        },
        {
          speaker: 'cheng',
          text: '议案甲：即日部署东下。前锋按{{巴丘}}序次。理由很硬——备走{{夏口}}，江东尚未定谳，{{柴桑}}使者往来密。抢窗口，是抢「他们还在怕」的那几天。',
        },
        {
          speaker: 'cheng',
          text: '甲案的短利看得见：威压、会猎时效、先发。欠账也看得见：{{更始}}半做、{{条品}}未齐、{{舰籍}}未分、文聘{{统本兵}}如何接令、{{刘璋给军}}是否入账——全被日历咬薄。',
        },
        {
          speaker: 'xun',
          text: '议案乙：再留旬日。先完更始与舰籍。降人要安家，名士要接见，船要分可战、转运、未验三簿。再留，账更实——敌也更备。',
        },
        {
          speaker: 'xun',
          text: '{{文聘}}迟诣，你字谓忠臣，使统本兵——这是买水战能力，也买「旧部听谁」的风险。名籍未齐就动旗，日后战报上的兵力会比实营好看，也会比实营脆。',
        },
        {
          speaker: 'jia',
          text: '周瑜夜校会说：中国人不过十五六万且{{疲惫}}，表众极七八万且{{狐疑}}。你用势压过去，他们就更有理由把「冒行」写进主战檄文。',
        },
        {
          speaker: 'jia',
          text: '通鉴里有王威请奇兵徼你，{{刘琮}}不纳。降后瞬间存在「轻进可袭」的反事实——史实未发生，但说明轻进两侧都有牙。',
        },
        {
          speaker: 'soldier',
          text: '斥候：{{柴桑}}主战主和未定。{{鲁肃}}途中结备，{{诸葛亮}}说权拒操——他们也在抢日历。你慢一天，他们可能定战一天。',
        },
        {
          speaker: 'soldier',
          text: '帐外将校说：{{奉辞伐罪}}已出，不取更待何时。磨刀声大。咳嗽声也被压下去了。',
        },
        {
          speaker: 'cheng',
          text: '（补充）{{侯者}}十五人不是修辞，是一批要安置的本地利益。名籍未齐就开拔，等于欠下一笔政治债上船。',
        },
        {
          speaker: 'xun',
          text: '（补充）引用{{韩嵩}}、邓义等名士，是给荆州看：新政权要用人。用人需要接见、考核、安家——这就是日历。',
        },
        {
          speaker: 'jia',
          text: '两害：东下买势欠缝；再抚买缝欠势。禁止假装有第三条——「又快又稳」不在材料里。',
        },
        {
          speaker: 'cao',
          text: '东下买势。再抚买命与编制。选。选完，不许装没选过。',
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

    'N01_A_out': {
      id: 'N01_A_out',
      title: '回执 · 旗先动',
      refs: ['R-jiangling-more', 'R-water-fleet', 'R-y01'],
      lines: [
        {
          speaker: 'cheng',
          text: '得令。管粮吏当面记账：开拔须预支一旬{{漕运}}——粮草先挖一刀。前锋按{{巴丘}}序次，偏师另议{{合肥}}。',
        },
        {
          speaker: 'cheng',
          text: '更始令不撤，但接见与条品压缩。{{侯者}}名籍「随军呈核」——四个字，等于把政治债绑上船舷。',
        },
        {
          speaker: 'xun',
          text: '名籍未齐就动旗。日后战报上的「兵力」会比实营好看，也会比实营脆。{{蒙冲斗舰}}在册，水手是否同鼓点，今晚没人敢保证。',
        },
        {
          speaker: 'xun',
          text: '{{统本兵}}的文聘营，接到的是「跟进」而非「同训」。得水军，仍可能得一群尚怀{{狐疑}}的人。',
        },
        {
          speaker: 'jia',
          text: '你买到了日历。利息不会用钱付——会用咳、用火、用观降来付。周瑜若写四患，你此刻每一条都签了字。',
        },
        {
          speaker: 'jia',
          text: '帐外欢呼说明势还在。势是真的。势也最容易让人以为缝不重要。',
        },
        {
          speaker: 'soldier',
          text: '帐外欢呼。角落里有人咳得停不住。军医想上前，被同僚按住：现在不是提病的时候。',
        },
        {
          speaker: 'cao',
          text: '旗动了。下一卷：疾疫名册。别以为欢呼能盖住咳。',
        },
      ],
      next: 'N01b',
    },

    'N01_B_out': {
      id: 'N01_B_out',
      title: '回执 · 先买缝',
      refs: ['R-jiangling-more', 'R-wenping', 'R-y02', 'R-y03'],
      lines: [
        {
          speaker: 'cheng',
          text: '得令。府吏发赏：安家钱帛先抛一笔。{{侯者}}名籍限期呈核；{{舰籍}}分可战、转运、未验三簿。',
        },
        {
          speaker: 'cheng',
          text: '{{条品}}事交{{韩嵩}}等加紧。{{文聘}}营单独校阅接令鼓点——统本兵可以留，听令必须验。',
        },
        {
          speaker: 'soldier',
          text: '帐外有人低声说「怯」。磨刀声小了一点——像被这句话按住。也有人松口气：家眷终于有地方落脚。',
        },
        {
          speaker: 'jia',
          text: '你买到了编制的缝。江东若在这旬日定战，你送给他们的是准备时间。{{柴桑}}不会因为你安家而停议。',
        },
        {
          speaker: 'jia',
          text: '怯的名声可辩。带着虚缝赴敌，死后没有辩词。你选了更孤立的一边——府议里本来就该有人孤立。',
        },
        {
          speaker: 'xun',
          text: '缝很贵。但没有缝的东下，死起来会连名字都来不及改。{{刘璋给军}}若入账，也需要旬日核对，不是口号。',
        },
        {
          speaker: 'cao',
          text: '缝买到了。下一卷仍是疾疫——安家解决不了咳。',
        },
      ],
      next: 'N01b',
    },

    'N01b': {
      id: 'N01b',
      title: '过场 · 江陵余波',
      refs: ['R-timeline-spine', 'R-numbers-table'],
      lines: [
        {
          speaker: 'system',
          text: '汇合前夜。旗或赏已出，府议未散——疫报要上台了。',
        },
        {
          speaker: 'cheng',
          text: '（因为你东下已宣）行程表压在名册上。药船与前送争栈，争不过旗。',
          when: { haste: true },
        },
        {
          speaker: 'cheng',
          text: '（因为你留抚）赏已发，名籍在走。药与隔离营尚有腾挪——你仍可能选择不腾。',
          when: { haste: false },
        },
        {
          speaker: 'xun',
          text: '北军旧部{{疲惫}}，表众{{狐疑}}。两句不是敌方宣传那么简单——它们是你营里的气象。',
        },
        {
          speaker: 'jia',
          text: '下一难不讨论「有没有病」。讨论你敢不敢让名册说真话。',
        },
        {
          speaker: 'soldier',
          text: '军医在门外等了很久。手里一卷，比会猎书薄，比会猎书重。',
        },
      ],
      next: 'N02',
    },

    'N02': {
      id: 'N02',
      title: '第二难 · 疾疫名册',
      refs: ['R-plague-before', 'R-plague-must', 'R-plague-aftermath', 'R-eighty-wan', 'R-pibing', 'R-tongjian-yi', 'R-xianzhu-yi', 'R-isolation', 'R-false-roster', 'R-y06', 'R-y07', 'R-y08', 'R-y09', 'R-y10', 'R-z06', 'R-z07', 'R-z08', 'R-z09', 'R-z10'],
      lines: [
        {
          speaker: 'system',
          text: '汇合 · 疫报到案。欢呼退了，名册上台。',
        },
        {
          speaker: 'soldier',
          text: '军医密报：咳热、下痢已在数营。还够不上「{{大疫}}」二字——够不上，人已经死在路上了。轻病能走，重病抬不出营门。',
        },
        {
          speaker: 'soldier',
          text: '问隔离：有人说「一提隔离，士气先崩」。也有人说「不隔离，崩得更干净」。',
        },
        {
          speaker: 'xun',
          text: '周瑜早说过：远涉江湖，「不习水土，必生疾病」。遇敌时若「已有疾病」，那不是意外，是账单提前到了。',
        },
        {
          speaker: 'xun',
          text: '《武帝纪》战后写：战不利，于是大疫，吏士多死者，乃引军还。自辩可写「值有疾病，{{烧船自退}}」——那是政治句子，不能取消初战不利与已有疾病。',
        },
        {
          speaker: 'cheng',
          text: '摊牌：减勤务、{{隔离}}、催药——账面立刻难看，{{八十万}}自我拆穿。压报：日程与势都保住——病卒仍按健卒上橹。',
        },
        {
          speaker: 'cheng',
          text: '两害写死：假编制打真仗，死时才发现骗过的是自己的调度；实名册示弱，江东与许下都会笑——笑的时候人还在。',
        },
        {
          speaker: 'jia',
          text: '细作若在，他们看见的病号比你名册多。你输的第一仗，可能是情报仗。压报保的是自己人眼里的势，不是敌方眼里的实。',
        },
        {
          speaker: 'jia',
          text: '{{狐疑}}的人更难执行隔离与纪律。密泊时纪律成本更高——疾疫与降附互加，不是两件无关事。',
        },
        {
          speaker: 'cheng',
          text: '（因为你东下已宣）旗已动，药与留养的余地被日历咬薄。压报能保势；也会把咳送上船。前送与药船争栈，争不过旗。',
          when: { haste: true },
        },
        {
          speaker: 'cheng',
          text: '（因为你留抚）隔离营与药船尚可腾。你可以实报——也可以继续用势压死真相。缝给你选择权，不给你免死符。',
          when: { haste: false },
        },
        {
          speaker: 'xun',
          text: '医药优先级冲突：你若压报，军医只能「后置」。后置不是不治，是让传染链多跑几营。',
        },
        {
          speaker: 'soldier',
          text: '有将低声：丞相若实报，外面会说怕了。有吏低声：丞相若压报，船上会说欺了。两边都在听你选。',
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

    'N02_A_out': {
      id: 'N02_A_out',
      title: '回执 · 名册说谎',
      refs: ['R-false-roster', 'R-plague-before', 'R-y06'],
      lines: [
        {
          speaker: 'xun',
          text: '名册不动。巡营记「偶有不适」。能走路的，上橹。军医领到的指令是后置——药在，人不许离列。',
        },
        {
          speaker: 'xun',
          text: '传染链不会因为名册漂亮而停。它只会因为你不隔离，跑得更快。',
        },
        {
          speaker: 'jia',
          text: '细作若在，他们看见的病号比你名册多。周瑜校「以疲病之卒，御狐疑之众」——你正在把上半句坐实。',
        },
        {
          speaker: 'jia',
          text: '势保住了。势会带你走到对岸。对岸会用火问你：势里有多少是咳。',
        },
        {
          speaker: 'soldier',
          text: '夜里仍有人抬出营。登记写作「水土不服」。没有人敢写「疫」。',
        },
        {
          speaker: 'cao',
          text: '先把江走完。账，到对岸再算——如果还有岸。',
        },
      ],
      next: 'N02b',
    },

    'N02_B_out': {
      id: 'N02_B_out',
      title: '回执 · 名册说实话',
      refs: ['R-isolation', 'R-plague-must', 'R-y10'],
      lines: [
        {
          speaker: 'xun',
          text: '名册改实。重病出列，轻病减役，药船离栈。已有将领问：丞相是不是怕了。',
        },
        {
          speaker: 'xun',
          text: '{{隔离}}营立在下风。士气先抖了一下——抖完，至少健卒知道自己旁边睡的是谁。',
        },
        {
          speaker: 'cheng',
          text: '怕的名声可辩。带着虚数赴敌，死后没有辩词。账面下调的那一截，是你买回来的调度权。',
        },
        {
          speaker: 'jia',
          text: '江东可以笑你示弱。他们笑的时候，你的人还在。成年人的编制，往往像示弱一样难看。',
        },
        {
          speaker: 'soldier',
          text: '流言起了：怯战。也有老卒说：终于有人肯把死人从满员里抠出去。',
        },
        {
          speaker: 'cao',
          text: '让他们问。问的人至少还站得住——这就是实报买到的东西。',
        },
      ],
      next: 'N02b',
    },

    'N02b': {
      id: 'N02b',
      title: '过场 · 名册之后',
      refs: ['R-z06', 'R-z08', 'R-z09', 'R-eighty-wan', 'R-z10'],
      lines: [
        {
          speaker: 'system',
          text: '名册抉择已落墨。江面还没到，账已经开始计息。',
        },
        {
          speaker: 'xun',
          text: '瑜传写「已有疾病」，武帝纪写战后「大疫」。两句给你的不是吵架材料，是时序：病可以前在，火与不利会放大它。',
        },
        {
          speaker: 'xun',
          text: '（因为压报）你把「已有」藏进满员。敌方夜校若写成疲病之卒，你正在供句。',
          when: { plague_honesty: false },
        },
        {
          speaker: 'xun',
          text: '（因为实报）你把「已有」写成减员。示弱的笑会来；调度的数也来。',
          when: { plague_honesty: true },
        },
        {
          speaker: 'jia',
          text: '{{烧船自退}}是给外人的句子。给调度的句子只有一句：你船上到底有多少能战。',
        },
        {
          speaker: 'cheng',
          text: '（因为赶日历）药与前送仍在争栈。名册真假，都会在争栈里露出牙齿。',
          when: { haste: true },
        },
        {
          speaker: 'cheng',
          text: '（因为留抚）药船尚有位。你若实报，位会不够——不够也比没有诚实。',
          when: { haste: false },
        },
        {
          speaker: 'jia',
          text: '{{疲惫}}与{{狐疑}}在敌方嘴里是一句。你分两难决策，他们合成一刀。',
        },
        {
          speaker: 'soldier',
          text: '前锋已报：{{巴丘}}水势异于邺池。有人吐，有人骂，有人把「{{八十万}}」又说了一遍给自己听。',
        },
        {
          speaker: 'xun',
          text: '死者太半是通鉴的极端量级，不是精确审计。实报的意义，是避免用{{满员}}去赌「半」。',
        },
        {
          speaker: 'cao',
          text: '去巴丘。下一难在船上。',
        },
      ],
      next: 'N03',
    },

    'N03': {
      id: 'N03',
      title: '过场 · 巴丘江面',
      refs: ['R-yitong', 'R-aftershock', 'R-numbers-table'],
      lines: [
        {
          speaker: 'system',
          text: '军至{{巴丘}}。长江中游的风比邺池狠。船开始说话——用浪、用撞、用呕吐。',
        },
        {
          speaker: 'cheng',
          text: '{{合肥}}另遣{{偏师}}救围——长江仍是主攻，但刀已被掰走一截。孙盛{{异同评}}会争系年；你此刻只需知道：兵力已被拆。',
        },
        {
          speaker: 'cheng',
          text: '北岸泊区：浪颠、夜散、号令不齐。有人请密泊相衔，像陆地营寨一样「整」。北军上下省力——体验会绑架决策。',
        },
        {
          speaker: 'jia',
          text: '「整」很好看。火来的时候，好看会变成一种死法。黄盖若观阵，要的正是一句干净的话：{{首尾相接}}，可烧。',
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
        {
          speaker: 'xun',
          text: '（因为你赶日历）训练与混编被压缩。号令不齐不完全是浪的错——也是缝的错。',
          when: { haste: true },
        },
        {
          speaker: 'xun',
          text: '（因为你买过缝）混编多出几天。仍不够长江，但比「名册未齐就上橹」少一点崩法。',
          when: { haste: false },
        },
        {
          speaker: 'soldier',
          text: '对岸已有帆影。初战若不利，将{{引次江北}}。那时船阵会被人看清——看清就可以写进火攻的前提。',
        },
        {
          speaker: 'cao',
          text: '下一难：船阵。相接是别人眼里的结果。我要问值不值得用整泊区去换。',
        },
      ],
      next: 'N04',
    },

    'N04': {
      id: 'N04',
      title: '第三难 · 船阵',
      refs: ['R-ships-join', 'R-ships-tongjian', 'R-hard-persist', 'R-ships-motive-bound', 'R-fire-kit', 'R-south-bank', 'R-wind', 'R-y11', 'R-y12', 'R-y13', 'R-y14', 'R-y15', 'R-z11', 'R-z12', 'R-z13', 'R-z14', 'R-z15'],
      lines: [
        {
          speaker: 'system',
          text: '泊区府议。案上两图：密泊如营，疏泊留道。',
        },
        {
          speaker: 'cheng',
          text: '议案甲：舟舰{{首尾相接}}，如营。利：减散阵、便号令、北军上下省力。将校多赞成——像又赢了长坂那样整齐。',
        },
        {
          speaker: 'cheng',
          text: '甲案短利：体验、指挥、夜不散。欠账：火灾时难以分割；对岸观阵得到干净靶标——「可烧而走」的前提被你摆好。',
        },
        {
          speaker: 'jia',
          text: '议案乙：疏泊分屯，留{{防火道}}与{{砍缆}}。利：火难一网。弊：夜惊、浪损、指挥变慢。{{黄盖}}怕的正是「{{难与持久}}」——你防久了，可能正合他意。',
        },
        {
          speaker: 'jia',
          text: '乙案短利：活。欠账：难看、散、持久战的牙。旁支往往从难看开始。',
        },
        {
          speaker: 'xun',
          text: '史载观察是相接。动机「因晕船才连」属推演——本文不写成史实。你要决策的是结果：密还是疏，不是后人的心理戏。',
        },
        {
          speaker: 'xun',
          text: '火攻装具在敌方：薪草、{{膏油}}、帷幕、{{牙旗}}、{{走舸}}。他们计划发火后自撤——这是进攻战术，不是同归于尽。你的泊距，决定他们要不要冒险靠近。',
        },
        {
          speaker: 'soldier',
          text: '对岸已有帆影。初一交战若不利，将引次江北。那时密泊更像营，也更像柴堆。',
        },
        {
          speaker: 'soldier',
          text: '有什长说：密泊才能睡。有老卒说：密泊才能死得整齐。两种声音都真实。',
        },
        {
          speaker: 'cheng',
          text: '（因为疫报被压）密泊等于把咳关进同一阵风。你若相接，疾病与火共享通道。',
          when: { plague_honesty: false },
        },
        {
          speaker: 'cheng',
          text: '（因为名册从实）疏泊仍累——但至少不是拿满员假数去证明「我们很整」。',
          when: { plague_honesty: true },
        },
        {
          speaker: 'jia',
          text: '靶标清晰度：对岸看清才能写「观」。疏泊降低清晰度，也降低你自己的整齐自豪。自豪不是战力。',
        },
        {
          speaker: 'cao',
          text: '相接是别人眼里的结果。我要问：这个结果，值不值得用整泊区去换。选。',
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

    'N04_A_out': {
      id: 'N04_A_out',
      title: '回执 · 如营',
      refs: ['R-ships-join', 'R-y14', 'R-y15'],
      lines: [
        {
          speaker: 'cheng',
          text: '舟阵按相接部署。一夜号令，全泊区能听见。北军上下船顺利——将校终于露出「这才像丞相军」的脸。',
        },
        {
          speaker: 'cheng',
          text: '省力是真的。省力会让人爱上清点：船、缆、旗，像陆营一样成列。爱清点的人，最怕有人说「散开」。',
        },
        {
          speaker: 'jia',
          text: '对岸若有人观阵，会得到一句很干净的话：首尾相接，可烧而走。干净，往往致命。',
        },
        {
          speaker: 'jia',
          text: '你把靶标摆齐了。下一步若有人「来降」，观降会顺着你的整齐滑进来。',
        },
        {
          speaker: 'soldier',
          text: '夜里风小。有人说：这样才像打过长坂的军。有人咳醒，看见船帮贴着船帮，又睡过去。',
        },
        {
          speaker: 'cao',
          text: '整已成。下一难：有人来降。',
        },
      ],
      next: 'N04b',
    },

    'N04_B_out': {
      id: 'N04_B_out',
      title: '回执 · 留道',
      refs: ['R-ships-motive-bound', 'R-hard-persist', 'R-y15'],
      lines: [
        {
          speaker: 'cheng',
          text: '外圈疏泊，砍缆斧发到什长。有人抱怨：不像「整」。夜里已有两艘撞索，骂声盖过浪声。',
        },
        {
          speaker: 'cheng',
          text: '防火道在图上很好看。浪里执行，会变成夜警与损耗。你付的是难看，买的是分割。',
        },
        {
          speaker: 'jia',
          text: '整是为了打。散是为了不被一火打完。你选了难看的整——利息在后夜收。',
        },
        {
          speaker: 'jia',
          text: '黄盖怕持久。你防火，可能把战争拖进他更怕、也更擅长熬的节奏。两害仍在。',
        },
        {
          speaker: 'soldier',
          text: '有将问：丞相要熬到何时。没有人答。斧在，缆在，骂也在。',
        },
        {
          speaker: 'cao',
          text: '道留下了。下一难仍会来——降书不看你疏不疏泊。',
        },
      ],
      next: 'N04b',
    },

    'N04b': {
      id: 'N04b',
      title: '过场 · 初战不利',
      refs: ['R-first-defeat', 'R-south-bank'],
      lines: [
        {
          speaker: 'system',
          text: '初一交战，公军败退，引次江北。史句很短。短句背后是：势被戳穿了一截，人更累，更需要捷报。',
        },
        {
          speaker: 'cheng',
          text: '对岸压迫未减。有人开始盼「来降」——盼，是疲劳的一种形式。',
        },
        {
          speaker: 'jia',
          text: '诈降书专打这个心理：你刚不利，他们送钥匙。钥匙和引线长得很像。',
        },
        {
          speaker: 'xun',
          text: '（因为密泊）泊区仍整齐。整齐在不利之后更像安慰——也更像柴。',
          when: { loose_ships: false },
        },
        {
          speaker: 'xun',
          text: '（因为疏泊）夜损与骂名已起。再防诈，会被说成「又一层怯」。',
          when: { loose_ships: true },
        },
        {
          speaker: 'cao',
          text: '把降书呈上来。第四难。',
        },
      ],
      next: 'N05',
    },

    'N05': {
      id: 'N05',
      title: '第四难 · 来降',
      refs: ['R-false-surrender', 'R-fear-fraud', 'R-first-defeat', 'R-hard-persist', 'R-gai-letter', 'R-chuying', 'R-two-li', 'R-persist-trap', 'R-y16', 'R-y17', 'R-y18', 'R-y19', 'R-y20', 'R-z16', 'R-z17', 'R-z18', 'R-z19', 'R-z20'],
      lines: [
        {
          speaker: 'system',
          text: '初战不利。{{引次江北}}。对岸有人先书请降——像送来一把钥匙，也像送来一根引线。',
        },
        {
          speaker: 'soldier',
          text: '来书自称{{黄盖}}部曲：众寡不敌，愿为前部归命。船近时有{{膏油}}气。斥候说：像降船，也像火船。',
        },
        {
          speaker: 'soldier',
          text: '盖请为前部：把靠近合理化。许其靠近，等于许其进入发火距离。',
        },
        {
          speaker: 'cheng',
          text: '受降：拆敌、示强、速决。史路如此。将校已经开始伸脖子——初战之后，人更需要一场「不战而胜」。',
        },
        {
          speaker: 'cheng',
          text: '口敕若写「若信实，当授{{爵赏}}，超于前后」，赏格本身可能催生迎降松懈。短利很甜。',
        },
        {
          speaker: 'jia',
          text: '注里会有「但恐汝诈」。怕，却仍可能{{延颈观望}}、甚至{{出营立观}}。怕与松懈，能同时活在一个人身上——尤其是打累了的人。',
        },
        {
          speaker: 'jia',
          text: '「指言盖降」：众人指认那是来降。集体认知一旦形成，禁出营就会被骂扫兴——B的政治孤独从这里开始。',
        },
        {
          speaker: 'xun',
          text: '远泊、强弩、禁出营：火船难近。代价是「{{难与持久}}」。{{黄盖}}怕持久；你防诈，可能把战争拖进他更怕、也更擅长熬的节奏。',
        },
        {
          speaker: 'xun',
          text: 'B不必斩使屠船；最小是距离与出营纪律。这是可执行的旁支——也是会被骂的旁支。',
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
          text: '（因为名册曾说谎）满员观降，等于让病卒也来凑热闹。热闹最贵。',
          when: { plague_honesty: false },
        },
        {
          speaker: 'cao',
          text: '（因为名册从实）人少了，更经不起一次失距。疑降不是怯，是算术。',
          when: { plague_honesty: true },
        },
        {
          speaker: 'jia',
          text: '密问仍可能放行——史路证明「怕」不等于「防」。你要写的是条令，不是心情。',
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

    'N05_A_out': {
      id: 'N05_A_out',
      title: '回执 · 观降',
      refs: ['R-false-surrender', 'R-chuying', 'R-y16'],
      lines: [
        {
          speaker: 'cheng',
          text: '行人已见。口敕：若信实，赏格从优。泊区有人{{延颈观望}}——像在等一场属于自己的胜利。',
        },
        {
          speaker: 'cheng',
          text: '有人已{{出营立观}}。禁令若在这一刻出口，会被当成扫兴。短利正在变成纪律漏洞。',
        },
        {
          speaker: 'jia',
          text: '胜利若来自降幡，火也从同一方向来。你听见欢呼了吗？那是引线烧到一半的声音。',
        },
        {
          speaker: 'jia',
          text: '指言盖降。集体认知已成。接下来风一转，史书会写得很干净。',
        },
        {
          speaker: 'soldier',
          text: '膏油气更近了。有人说香。有人说呛。没有人后退。',
        },
        {
          speaker: 'cao',
          text: '取账。风要来了。',
        },
      ],
      next: 'N05c',
    },

    'N05_B_out': {
      id: 'N05_B_out',
      title: '回执 · 禁观',
      refs: ['R-fear-fraud', 'R-persist-trap', 'R-y20'],
      lines: [
        {
          speaker: 'cheng',
          text: '使扣外寨。供词两处不合。船停强弩界外，夜禁出营。有将问：丞相要熬到何时——熬死的是谁。',
        },
        {
          speaker: 'cheng',
          text: '精卒看守与延期已记账。进攻窗口变窄。黄盖怕的「难与持久」，开始反过来咬你。',
        },
        {
          speaker: 'jia',
          text: '熬，是防诈的利息。不熬，是火的利息。两笔都要人命作息。你只是选了哪一种死法更慢。',
        },
        {
          speaker: 'jia',
          text: '骂名会来。旁支的胜利通常先从骂名开始。',
        },
        {
          speaker: 'soldier',
          text: '营里有人骂扫兴。也有人把弩弦又绞紧了一格。',
        },
        {
          speaker: 'cao',
          text: '禁令在。风仍可能来——防火距不是免火符。',
        },
      ],
      next: 'N05c',
    },

    'N05c': {
      id: 'N05c',
      title: '过场 · 降书之后',
      refs: ['R-z16', 'R-z17', 'R-z18', 'R-z19', 'R-z20'],
      lines: [
        {
          speaker: 'system',
          text: '降书抉择已落墨。怕可以人人有；防必须写成条令——你已经写了其中一种。',
        },
        {
          speaker: 'cheng',
          text: '（因为受降）许赏→期待→观验→失距。链上每环都合理，合在一起可以致命。',
          when: { suspect_defection: false },
        },
        {
          speaker: 'cheng',
          text: '（因为禁观）{{强弩界}}停泊与夜禁出营已下。骂名开始计息；防火距也开始计息。',
          when: { suspect_defection: true },
        },
        {
          speaker: 'jia',
          text: '密问{{行人}}只证明你怕过。{{出营立观}}证明怕没有变成距。心情够了，条令仍可能缺——或已写成。',
        },
        {
          speaker: 'xun',
          text: '{{华容}}泥泞是火后的地理利息。{{观降}}失距是火时的纪律利息。两笔同属{{短利}}之后。',
        },
        {
          speaker: 'soldier',
          text: '风声紧了。有人仍在伸脖子，有人把弩弦绞紧。两种人都会进同一张战报。',
        },
        {
          speaker: 'jia',
          text: '取账之前，先听见风。风不负责替你选——它只负责最后一截。',
        },
        {
          speaker: 'cao',
          text: '准备战报。四难的{{利息}}，一张张摊开。',
        },
      ],
      next: 'N06',
    },

    'N06': {
      id: 'N06',
      title: '风起',
      refs: ['R-wind', 'R-fire-kit', 'R-burn-shore'],
      lines: [
        {
          speaker: 'soldier',
          text: '报——风转猛！对岸船队举帆前趋，有人高呼来降！{{东南风}}急。',
        },
        {
          speaker: 'soldier',
          text: '前船中有帷幕、牙旗——像正式舰队，也像盖降。火光先于人声。',
        },
        {
          speaker: 'cheng',
          text: '烟起了。不是炊烟。',
        },
        {
          speaker: 'cheng',
          text: '（因为受降放近）火从观降的方向进来。失距已经付过了。',
          when: { suspect_defection: false },
        },
        {
          speaker: 'cheng',
          text: '（因为禁出营）火船难近，仍有飞火与惊散。持久的牙与火的牙同时咬。',
          when: { suspect_defection: true },
        },
        {
          speaker: 'xun',
          text: '（因为密泊）连营处火势易片。号令还在，船已开始借风说话。',
          when: { loose_ships: false },
        },
        {
          speaker: 'xun',
          text: '（因为疏泊）砍缆声起。有的散开了，有的仍缠在骂声里。',
          when: { loose_ships: true },
        },
        {
          speaker: 'jia',
          text: '取账。把今夜以前的四次抉择，全部摊开。史书会挑干净的句子；我们要看脏的利息。',
        },
        {
          speaker: 'cao',
          text: '取账。',
        },
      ],
      next: 'N07_report',
    },

    'N07_report': {
      id: 'N07_report',
      kind: 'report',
      title: '战报',
      refs: ['R-plague-aftermath', 'R-huarong', 'R-aftershock', 'R-y21'],
      lines: [
        {
          speaker: 'system',
          text: '【战报拼装】',
        },
      ],
      next: 'N08_route',
    },

    'N08_route': {
      id: 'N08_route',
      title: '账齐',
      refs: ['R-method', 'R-y22', 'R-y23'],
      lines: [
        {
          speaker: 'system',
          text: '账已齐。结局不按愿望，按你签过字的四笔。',
        },
        {
          speaker: 'jia',
          text: '日历、名册、泊距、观降。每一笔都有短利，每一笔都有利息。母题只问一句：绝对优势为什么会失效？',
        },
        {
          speaker: 'cheng',
          text: '请丞相看结局卷。史实灰、苦持、摊牌余生——路由读 flag，不读你的自我开脱。',
        },
      ],
      next: 'ENDING_PICK',
    },

    'ENDING_PICK': {
      id: 'ENDING_PICK',
      lines: [
        {
          speaker: 'system',
          text: '（路由）',
        },
      ],
      next: 'E_BURN',
    },

    'E_BURN': {
      id: 'E_BURN',
      kind: 'ending',
      endingId: 'canon-ash',
      title: '结局 · 史实灰',
      refs: ['R-plague-aftermath', 'R-huarong', 'R-aftershock', 'R-y24', 'R-y25'],
      lines: [
        {
          speaker: 'system',
          text: '船阵相接。观降失距。风盛火猛，舟营俱焚。军中本已有疾病——火只是把账单烧穿。',
        },
        {
          speaker: 'system',
          text: '通鉴写死者太半。华容{{泥泞}}，{{羸兵}}负草填道，为人马所蹈藉。胜利叙事与填道并置——战报语气应冷。',
        },
        {
          speaker: 'cheng',
          text: '请留{{曹仁}}等守江陵，{{徐晃}}、{{乐进}}分守。主力北还。{{江南诸郡}}，将不在掌握。',
        },
        {
          speaker: 'cheng',
          text: '备遂有荆州江南诸郡。赤壁不是一夜定三分，但是转折。你的抉择影响的是如何输、如何苦持——这一卷里，你走了史书最熟悉的路。',
        },
        {
          speaker: 'xun',
          text: '疾疫与火同账。日后若需一书，可写：值有疾病，烧船自退，横使周瑜虚获此名。那是给外人看的句子。',
        },
        {
          speaker: 'cao',
          text: '给外人看的句子可以硬。给自己看的句子更短：日历、名册、泊距、观降。',
        },
        {
          speaker: 'jia',
          text: '你选了史书最熟悉的那一套——所以史书会写你。绝对优势在此失效。不是因为你不够聪明，是因为聪明选了短利。',
        },
        {
          speaker: 'jia',
          text: '载记里你会自喜备得计少晚。胜者叙事救不了填道的人。',
        },
        {
          speaker: 'soldier',
          text: '江面还在烧。有人还在喊来降。喊声停了。',
        },
        {
          speaker: 'system',
          text: '【结局：史实灰】母题答案：优势在势与船；失效在疾疫、密泊、观降与火。你签过字。',
        },
      ],
    },

    'E_ESCAPE': {
      id: 'E_ESCAPE',
      kind: 'ending',
      endingId: 'bitter-win',
      title: '结局 · 苦持',
      refs: ['R-persist-trap', 'R-ships-motive-bound', 'R-y23'],
      lines: [
        {
          speaker: 'system',
          text: '火未能一次吞尽。疏泊或远拒让火攻减效。江面转入更长的消耗——没有凯旋，只有还活着的编制。',
        },
        {
          speaker: 'system',
          text: '旁支不给你掌声。它给你骂名、夜损、持久战的牙——以及一截没被烧穿的舟骑。',
        },
        {
          speaker: 'cheng',
          text: '南岸仍在压迫。我们保下一截舟骑，也把「八十万」戳穿。许下会有人写难听的账。',
        },
        {
          speaker: 'cheng',
          text: '苦持意味着：你付过防火与疑降的利息。利息从来不给人鼓掌，只给人明天还能下的令。',
        },
        {
          speaker: 'xun',
          text: '疾疫仍在。实报或压报的后果不会因为躲过一火而清零——只会换一种咬法。',
        },
        {
          speaker: 'cao',
          text: '活着的编制，比完整的话术重要。但活着，不等于赢。',
        },
        {
          speaker: 'jia',
          text: '旁支的胜利通常难看。难看，是因为你拒绝了史路最甜的短利。',
        },
        {
          speaker: 'jia',
          text: '战争不会因此变仁慈。你只是让火攻史路偏转——偏转之后，咬你的可能是相持、是疫、是许下的笔。',
        },
        {
          speaker: 'soldier',
          text: '夜警还在。有人骂丞相扫兴。有人把没烧掉的缆绳盘好。',
        },
        {
          speaker: 'system',
          text: '【结局：苦持】你让火攻史路偏转。没有英雄，只有还在的编制。',
        },
      ],
    },

    'E_HOLD': {
      id: 'E_HOLD',
      kind: 'ending',
      endingId: 'honest-bleed',
      title: '结局 · 摊牌余生',
      refs: ['R-isolation', 'R-false-roster', 'R-y06'],
      lines: [
        {
          speaker: 'system',
          text: '名册从实，戒备从严，东下未全押在恐吓上。初战与疾疫仍在——崩溃没有一次烧穿。',
        },
        {
          speaker: 'system',
          text: '你丢掉的是势。你留下的是还可以计算的兵力。成年人的胜利，往往像失败一样安静。',
        },
        {
          speaker: 'xun',
          text: '能战之卒少于出发时的话术。江东可以笑你「示弱」。他们笑的时候，你的人还在。',
        },
        {
          speaker: 'xun',
          text: '隔离与药船不是仁慈，是算术。算术让你难堪，也让你还能发下一道军令。',
        },
        {
          speaker: 'cheng',
          text: '许下会有议论。会猎的时效淡了。编制的缝还在——缝很贵，但你买过。',
        },
        {
          speaker: 'cao',
          text: '丞相府不需要鼓掌。需要下一道还能发出去的军令。',
        },
        {
          speaker: 'jia',
          text: '你没有写成英雄。你写成了还能继续下命令的人。',
        },
        {
          speaker: 'jia',
          text: '母题在这里换了一种答法：优势失效可以不全灭——如果你肯先丢掉一部分优势的面子。',
        },
        {
          speaker: 'soldier',
          text: '营里人少了。鼓还能响。有人说怯。有人说活着。',
        },
        {
          speaker: 'system',
          text: '【结局：摊牌余生】示弱换可计算的明天。不是凯旋，是余生。',
        },
      ],
    },  },
}
