window.CC_STORY = {
  meta: {
    title: "曹操不容易",
    subtitle: "建安十三年 · 赤壁前夜",
    tagline: "坐拥荆州仓廒、水军号称八十万——看绝对优势是怎么一笔一笔亏光的。",
    version: "0.4.0-demo",
    estimatedMinutes: 15
  },

  initialResources: {
    money: 6,
    grain: 6,
    troops: 8
  },

  initialVars: {
    haste: 0,
    plague_honesty: 0,
    loose_ships: 0,
    suspect_defection: 0,
    hefei_aid: 0,
    jingzhou_trust: 0,
    rhetoric_bluff: 0,
    wit_sharp: 0,
    clues_found: 0
  },

  gloss: {
    eighty_wan: {
      term: "水军八十万",
      plain: "写给江东看的夸张军号，用来吓人，不是点兵实数；时人多估曹军实众约二十余万。",
      source: "《资治通鉴》卷65 载遗孙权书"
    },
    huiliie: {
      term: "会猎",
      plain: "表面客气约着打猎，实则是「我要提兵打你了」的外交辞令。",
      source: "《资治通鉴》卷65「欲与将军会猎于吴」"
    },
    hou_fifteen: {
      term: "侯者十五人",
      plain: "给肯投降配合的荆州官吏封列侯，用爵位买下地方稳定。",
      source: "《三国志·武帝纪》「论服从之功，侯者十五人」"
    },
    chaisang: {
      term: "柴桑",
      plain: "孙权的前线重镇（今江西九江一带），江东主战主和风声多从此出。",
      source: "建安十三年江东核心地名"
    },
    gaocao: {
      term: "马无藁草",
      plain: "深冬寒天战马缺乏干草料，骑兵难驰，后勤转运也跟着绷断。",
      source: "《三国志·周瑜传》「盛寒，马无藁草」"
    },
    shuitu: {
      term: "不服水土",
      plain: "惯走旱道的北方兵一进湿冷长江水网，极易腹泻高热、成片减员。",
      source: "《三国志·周瑜传》「不习水土，必生疾病」"
    },
    wulin: {
      term: "乌林",
      plain: "长江北岸地名（今湖北洪湖东北），与赤壁隔江相望，曹军初战不利后退扎于此。",
      source: "《三国志·周瑜传》《资治通鉴》卷65"
    },
    xuanwuchi: {
      term: "玄武池",
      plain: "建安十三年春曹操在邺城开凿的练水军人工湖，让旱鸭子北兵提前学操舟。",
      source: "《三国志·武帝纪》「作玄武池以肄舟师」"
    },
    mengchong_doujian: {
      term: "蒙冲斗舰",
      plain: "汉末主力江战舰：蒙冲蒙生牛皮防弓火、突击快；斗舰高如楼台、架重弩。",
      source: "《三国志·周瑜传》注引《江表传》"
    },
    zouge: {
      term: "走舸",
      plain: "吃水浅、桨手多的轻快战艇，适合巡江警戒、急报传递与贴身缠斗。",
      source: "《三国志·吴书》水战轻艇"
    },
    jingzhou_jiangnan: {
      term: "荆州江南诸郡",
      plain: "长江以南的武陵、长沙、桂阳、零陵四郡；曹军北撤后被刘备陆续收去。",
      source: "《三国志·武帝纪》「备遂有荆州江南诸郡」"
    },
    shaochuan_zitui: {
      term: "烧船自退",
      plain: "曹操事后致孙权信里找的台阶：硬说遇疾疫才自己烧船退兵，白让周瑜得名。",
      source: "《三国志·周瑜传》注引《江表传》"
    },
    hefei: {
      term: "合肥",
      plain: "淮南咽喉重镇；建安十三年十二月孙权亲围合肥牵制东线，迫使曹操分兵驰援。",
      source: "《三国志·武帝纪》建安十三年十二月"
    },
    chengxiang: {
      term: "丞相",
      plain: "建安十三年六月汉罢三公官、置丞相，曹操自任丞相，军政尽归相府。",
      source: "《三国志·武帝纪》建安十三年六月"
    },
    changban: {
      term: "当阳长坂",
      plain: "今湖北当阳东北；曹操轻骑急追刘备，一日一夜行三百里在此大破之。",
      source: "《三国志·武帝纪》《先主传》"
    },
    xiakou: {
      term: "夏口",
      plain: "汉水入江口（今武汉汉口一带）；刘备长坂败走后在此会合关羽水军。",
      source: "《三国志·先主传》《通鉴》卷65"
    },
    wenpin: {
      term: "文聘",
      plain: "刘表旧将，初不迎降、见曹操乃涕泣请罪；曹操赏其忠，即授江夏太守。",
      source: "《三国志·文聘传》《武帝纪》"
    },
    kuaiyue: {
      term: "蒯越",
      plain: "荆州大族名士，劝刘琮举州归降；曹操赞其才，封列侯。",
      source: "《三国志·刘表传》注引《傅子》"
    },
    hansong: {
      term: "韩嵩",
      plain: "荆州名士，曾任刘表别驾并因劝降下狱；曹操入荆州后破格引用。",
      source: "《三国志·武帝纪》《刘表传》"
    },
    liuzhang: {
      term: "刘璋",
      plain: "益州牧，见曹操平荆州威震天下，始受征役遣兵给军并派张松出使。",
      source: "《三国志·武帝纪》「遣兵给军」"
    },
    baqiu: {
      term: "巴丘",
      plain: "洞庭湖口长江重镇（今湖南岳阳一带），曹操自江陵东征至此分兵救合肥。",
      source: "《三国志·武帝纪》「至巴丘」"
    },
    huainan: {
      term: "淮南",
      plain: "江淮核心防区，合肥为其门户；此地若失，东吴兵锋可直指徐豫。",
      source: "《三国志·武帝纪》《张辽传》"
    },
    huarong: {
      term: "华容道",
      plain: "乌林北撤所经的云梦泽泥泞低道（今湖北监利一带），军士负草填路方过。",
      source: "《三国志·武帝纪》注引《山阳公载记》"
    },
    jiangbiaozhuan: {
      term: "《江表传》",
      plain: "西晋虞溥所撰吴史，载黄盖诈降、烧船及曹操「烧船自退」书信等细节。",
      source: "裴松之《三国志注》徵引"
    },
    zhangxi: {
      term: "张熹",
      plain: "曹军将领，十二月孙权围合肥时自巴丘奉命率偏师赴援，权闻熹至乃走。",
      source: "《三国志·武帝纪》「遣张熹救合肥」"
    }
  },

  subtexts: {
    yuzhi_gengshi: {
      surface: "与之更始",
      cao_decode: "过去谁站错过队先不翻旧账——但账本我锁在内箱最底层，日后谁敢不老实，随时拿出来加倍算。",
      note: "招降铁律：嘴上发免死牌，手里攥记账本。"
    },
    fengci_fazui: {
      surface: "奉辞伐罪",
      cao_decode: "顶着天子诏书揍人，赢了算丞相威德；砸了锅也能推给朝廷公议，不能由我一个人挨板子。",
      note: "汉末出征公文标准免责声明。"
    },
    suxin_buyi: {
      surface: "素无大志",
      cao_decode: "意思是：『明公别多心，从前全是刘表逼着干活——只要不抄家，让我看大门都行。』",
      note: "归降名士递名帖的标准求生起手式。"
    },
    yuanxiao_quanma: {
      surface: "愿效犬马",
      cao_decode: "『旧东家倒得快，新东家先给个编制和俸禄；真上场拼命？看给多少钱再决定跑多快。』",
      note: "听降将表忠心时，切记盯紧他的船缆。"
    },
    konghan_jiangshi: {
      surface: "恐寒将士之心",
      cao_decode: "『要是不依着我们这帮老班底的意思来，明天冲锋我们就当众出工不出力。』",
      note: "军官逼宫主帅时的万能挡箭牌。"
    },
    wuluan_junxin: {
      surface: "勿乱军心",
      cao_decode: "『把难看的数据锁进袖子里，谁照实念数谁就是破坏团结』——纸上不写，病死的就不算减员。",
      note: "大败前夕的标准公关动作。"
    },
    jibukeshi: {
      surface: "机不可失",
      cao_decode: "『满帐人都押你今晚吞下江东，谁也不肯先承认其实没备妥；等账算清再走，赏赐全黄了。』",
      note: "草率开拔前，总有人喊这一嗓子。"
    },
    zanwei_shuxi: {
      surface: "暂未熟习",
      cao_decode: "文雅叫『尚在磨合』，白话叫『昨天玄武池划得挺美，今天一上长江全扶着船帮吐胆汁』。",
      note: "军报润色词典：把崩溃写成适应。"
    },
    tianming_suogui: {
      surface: "天命所归",
      cao_decode: "江陵点满粮仓时人人都夸天命在你；半夜要是起大火，连老天爷吹东南风都叫天命翻脸。",
      note: "顺风局专用词，逆风局自动失效。"
    },
    suyou_suyuan: {
      surface: "素有宿怨",
      cao_decode: "江东但凡有个老头挨了几板子、写了封信骂周瑜，这边求功的人连他家祖坟都替他圆好了。",
      note: "最致命的假情报：正好长在幻想上。"
    },
    shen_gan_rende: {
      surface: "深感明公仁德",
      cao_decode: "投降三天就把你夸成尧舜的人，抽屉里多半也备好了写给下一任赢家的欢迎辞。",
      note: "世族文官的嘴，信三成嫌多。"
    },
    pianshi_zuyi: {
      surface: "偏师足矣",
      cao_decode: "『兵其实不够用，可许昌门阀天天催救淮南；只好让张熹带一营去撑场子，祈祷孙权眼神不好。』",
      note: "两线吃紧时的标准自我安慰。"
    },
    chizhong_daiji: {
      surface: "持重待机",
      cao_decode: "好听叫老成谋国，难听叫前头打不动、后头没台阶退，只能排排坐江北吹冷风。",
      note: "僵持局里的体面代名词。"
    },
    shizu_weilao: {
      surface: "士卒微劳",
      cao_decode: "真话是：北方兵吐了半个月、脚底烂疮、高热说胡话，再不退兵就要劈军旗煮姜汤了。",
      note: "班师诏书里绝不能照直写的实况。"
    },
    quanheng_quanju: {
      surface: "权衡全局",
      cao_decode: "『两头都想要、两头全踩雷，挑了个最丑但亏得起的那边认栽』——官话一向把割肉叫统筹。",
      note: "丞相府深夜批文第一高频词。"
    },
    biezuo_houtu: {
      surface: "别作后图",
      cao_decode: "『面子虽然赔光了，好在人没死在泥塘里、家底也还剩些——回许昌先捂住清流的嘴再说。』",
      note: "曹氏黑色乐观：活着回去就算没输透。"
    }
  },

  chapters: [
    { id: "N00_prologue", num: "序", title: "江陵大帐" },
    { id: "N01_letter_game", num: "壹", title: "会猎笔锋" },
    { id: "N02_jingzhou_court", num: "贰", title: "降将名册" },
    { id: "N03_plague_crisis", num: "叁", title: "袖中疫报" },
    { id: "N04_hefei_alarm", num: "肆", title: "合肥急报" },
    { id: "N05_iron_chains", num: "伍", title: "铁索连舟" },
    { id: "N06_huanggai_letter", num: "陆", title: "东南风信" },
    { id: "N08_battle_report", num: "柒", title: "乌林战报" }
  ],

  startNode: "N00_prologue",

  nodes: {
    N00_prologue: {
      id: "N00_prologue",
      chapter: "序 · 江陵大帐",
      mood: "calm",
      bubbles: [
        { type: "divider", text: "建安十三年秋末 · 江陵中军大帐" },
        {
          type: "msg",
          speaker: "军报",
          roleTag: "驿骑",
          tone: "accent",
          tag: "史载",
          text: "六月刚拜{{gloss:chengxiang}}，九月进新野便收了刘琮的印；{{gloss:changban}}一夜狂追三百里，刘备逃往{{gloss:xiakou}}连行囊都甩在泥道上。如今江陵大仓的铜钥匙，总算**挂上您桌角了**。"
        },
        {
          type: "msg",
          speaker: "管粮吏",
          roleTag: "仓曹",
          tone: "warn",
          tag: "拟写",
          text: "（把算筹啪地拍上案）先别急着温酒。钱帛六分、粮草六分、可战精锐八营——看着满仓满囤，**里头有一半是荆州刚充数的空米架**。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "info",
          tag: "拟写",
          text: "仓曹就会泼凉水！江面上刚接管几百条大船，茶馆里都在喊咱们「{{gloss:eighty_wan}}」——**这数谁先吹出来的没人认领，可嘴上早拿去吓人了**，{{gloss:chaisang}}那头怕是抖成筛子！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "default",
          tag: "史载",
          text: "如今咱们顶着{{subtext:fengci_fazui}}的虎皮南下，外头排队递降表的把门槛都踩平了；只剩南岸孙权，还在拿乔赌风向。"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "江陵檐下",
          tag: "巡营",
          tone: "info",
          text: "你起身跨出闷热的帅帐，站上江陵府阴湿的石阶。廊柱下新降的荆州掾吏正捏着官凭比划体面；拐角药箱后头，一个军医偷偷把**半声咳嗽**憋进袖口——帐里谁也没回头数过药席。"
        },
        {
          type: "msg",
          speaker: "曹操",
          roleTag: "心中",
          tag: "暗忖",
          tone: "accent",
          text: "满帐人都觉得大局已定，只有仓房和药棚不敢大声喘气。偏厅笔墨已经铺好，先瞧瞧那帮文官打算怎么给孙仲谋**虚空开价**。"
        }
      ],
      next: "N01_letter_game"
    },

    N01_letter_game: {
      id: "N01_letter_game",
      chapter: "壹 · 会猎笔锋",
      mood: "calm",
      bubbles: [
        { type: "divider", text: "壹 · 偏厅拟《遗孙权书》" },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "accent",
          tag: "史载",
          text: "孙权刚打发鲁肃过江去夏口摸刘备的底。趁他俩还没把酒斟进同一只壶里，咱们这封官书今晚就得**八百里砸进柴桑**。"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "default",
          tag: "拟写",
          text: "宣纸摊平了，紫毫也蘸饱墨了。水军虚数怎么报、地盘怎么圈、收尾留不留台阶——明公亲自定个价码。"
        }
      ],
      widget: {
        type: "wordsmith",
        title: "拟《遗孙权书》",
        subtitle: "点击高亮词句切换措辞，看看账房与诸将怎么接茬",
        template: [
          "孤近奉辞伐罪，旌麾南指，刘琮束手。今",
          { slot: "s1" },
          "，",
          { slot: "s2" },
          "，",
          { slot: "s3" },
          "。"
        ],
        slots: {
          s1: [
            {
              text: "治水军八十万众",
              comment: "管粮吏手一抖，算筹滚了一地：「明公……名册上水陆凑一块才二十来万，剩下五十五万是从长江里按鳜鱼脑袋点的吗？」",
              vars: { rhetoric_bluff: 1 }
            },
            {
              text: "统步骑舟师三十余万",
              comment: "参谋一把按住笔杆：「明公，跟江东隔岸打嘴仗还报实底，等于当街自掀家底——真不怕柴桑算明白？」",
              vars: {}
            },
            {
              text: "合荆襄舟楫之师，蔽江而下",
              comment: "主簿连连点头：「老辣！听着遮天蔽日，将来御史台翻旧账也挑不出半句虚报军籍。」",
              vars: { wit_sharp: 1 }
            }
          ],
          s2: [
            {
              text: "方欲与将军会猎于吴",
              comment: "参谋替周瑜先气笑了：「把人家江东六郡当自家猎场！这信送到柴桑，孙权今晚就得抄家伙拼命。」",
              vars: { rhetoric_bluff: 1 }
            },
            {
              text: "愿将军早遣质子，以安江表",
              comment: "府吏缩了缩脖子：「这是当年挤兑袁绍的旧词——孙仲谋才二十七岁，最听不得『遣子』俩字。」",
              vars: {}
            },
            {
              text: "若能各守封疆，共尊汉室，孤亦息兵",
              comment: "北方将急得直搓铁甲：「明公！咱们刚在长坂奔袭三百里，怎么信纸一铺软成劝架乡绅了？」",
              vars: {}
            }
          ],
          s3: [
            {
              text: "吉凶之决，将军其自审之",
              comment: "军候嘶了一声：「墨里都飘火药味！江东主战派今晚连架都省得吵，直接抬战鼓出来敲。」",
              vars: { rhetoric_bluff: 1 }
            },
            {
              text: "幸勿自误，致如荆州之覆辙",
              comment: "廊外几个刚降的荆州小吏脖子一缩，脸色比墙灰还白：「拿咱们当反面典型……明公扎心真挑地方。」",
              vars: { wit_sharp: 1 }
            },
            {
              text: "书不尽言，孤在江陵候将军驿报",
              comment: "参谋皱起眉：「收尾像衙门公文回执，倒叫柴桑猜一宿——咱们到底是真发兵还是虚晃一枪。」",
              vars: {}
            }
          ]
        },
        confirmLabel: "用印发出",
        resultSpeaker: "曹操（书成）"
      },
      next: "N01_T01_choice"
    },

    N01_T01_choice: {
      id: "N01_T01_choice",
      chapter: "壹 · 会猎笔锋",
      mood: "tense",
      bubbles: [
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "info",
          tag: "推演",
          condition: { var: "rhetoric_bluff", op: ">=", val: 2 },
          text: "墨干得比火药还快！这封信一进柴桑，江东君臣今晚别想睡整觉——只是话喊满了，**自家靴子也得跟着迈出账门**。"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "default",
          tag: "推演",
          condition: { var: "rhetoric_bluff", op: "<=", val: 1 },
          text: "信虽然递出去了，口气倒没把话说死。可江东盯的不是修辞漂亮不漂亮，是**江陵码头的船缆到底解不解**。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "accent",
          tag: "拟写",
          text: "文书刚把江东画成咱们的猎场，还不趁早拔锚？再拖到刘备在夏口把草鞋穿回去，咱们这封{{gloss:huiliie}}信可就成笑话了——{{subtext:jibukeshi}}！"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "议事堂前",
          tag: "所见",
          tone: "default",
          text: "半屋子将校一只脚已经踏在船板上，唯有仓曹与主簿钉在门框旁没挪步——**两种走法，都得当场从账本里撕掉一页**。"
        },
        {
          type: "msg",
          speaker: "管粮吏",
          roleTag: "仓曹",
          tone: "warn",
          tag: "拟写",
          text: "（把算筹敲在案角）先把账说在前头，这不是怯：立刻开拔东下，光沿江铺开漕运接应，就得先支出一旬**粮草**，船队才吃得动。"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "default",
          tag: "拟写",
          text: "若再留旬月消化江陵——发安家赏钱、置办酒肉、买新降诸将夜里少摸刀把，就得先从府库掏出一笔**钱帛**。"
        }
      ],
      choices: [
        {
          id: "A",
          label: "顺江东下，趁势压境会猎",
          bait: "诸将校目光发亮，信使已经把战马牵到堂外台阶下",
          isBait: true,
          replyText: "趁江东君臣还在互相扯皮，先把帅旗插到巴丘江面！至于粮道——打穿柴桑，孙家的仓便是咱们的仓！",
          effects: { money: 0, grain: -1, troops: 0, vars: { haste: 1 } },
          reason: "顺江开拔，预支一旬漕运口粮",
          next: "N01a"
        },
        {
          id: "B",
          label: "再抚旬月，先稳江陵后方",
          bait: "帐内一瞬冷了半截，几名新立战功的校尉把牙咬得咯吱响",
          isBait: false,
          replyText: "刚进荆州两天就往前莽冲，后院起火谁救？先留下来发赏、查仓、按住这帮降将的刀鞘！",
          effects: { money: -1, grain: 0, troops: 0, vars: { haste: 0 } },
          reason: "留驻抚安，支钱帛赏赐降将与安家",
          next: "N01b"
        }
      ]
    },

    N01a: {
      id: "N01a",
      chapter: "壹 · 会猎笔锋",
      mood: "tense",
      bubbles: [
        {
          type: "msg",
          speaker: "管粮吏",
          roleTag: "仓曹",
          tone: "warn",
          tag: "结算",
          text: "……诺。江陵漕运先挖一旬口粮。船得先吃饱，外头才吹得动「八十万」。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "ok",
          tag: "拟写",
          text: "痛快！明公这一嗓子下去，柴桑今晚别想有一只干枕头！"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "江陵湿阶",
          tag: "巡营",
          tone: "info",
          text: "你走出闷热的偏厅，踏上**江陵府被潮气浸滑的石阶**。阶下几个新受官凭的荆州文吏正忙着扯正**崭新的紫绶衣带**；墙角一名书佐瞥见你的靴影，飞快把**一卷洇了水渍的竹简**缩回袖管。"
        },
        {
          type: "msg",
          speaker: "曹操",
          roleTag: "心中",
          tag: "暗忖",
          tone: "accent",
          text: "侧门边有人弯腰闷咳，见你转头立刻硬生生憋了回去。东进的旗先挂上了船桅——**只是没人敢报病号的名字**。"
        }
      ],
      next: "N02_jingzhou_court"
    },

    N01b: {
      id: "N01b",
      chapter: "壹 · 会猎笔锋",
      mood: "calm",
      bubbles: [
        {
          type: "msg",
          speaker: "管粮吏",
          roleTag: "仓曹",
          tone: "ok",
          tag: "拟写",
          text: "……谢明公肯坐下来听扫兴的实账。"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "default",
          tag: "结算",
          text: "赏钱今晚就发下去。降将院里灯笼一亮，营后头的磨刀声总算轻了些——也就轻了一点点。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "danger",
          tag: "拟写",
          text: "（笑意没进眼底）明公图稳是好。只是明早**「怯」**这个字，多半先写进柴桑的酒席里了。"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "江陵湿阶",
          tag: "巡营",
          tone: "info",
          text: "你步出大帐走上**雨气未散的石阶**。檐灯下，刚换上新紫绶的荆州官吏正互相拱手扯平衣褶；廊柱暗处，一名书佐见你走近，慌忙把**一册潮湿的点兵名录**掩进胸前。"
        }
      ],
      next: "N02_jingzhou_court"
    },

    N02_jingzhou_court: {
      id: "N02_jingzhou_court",
      chapter: "贰 · 降将名册",
      mood: "calm",
      bubbles: [
        { type: "divider", text: "贰 · 廊下翻看《荆州降将名册》" },
        {
          type: "msg",
          speaker: "议曹",
          roleTag: "掾属",
          tone: "accent",
          tag: "拟写",
          condition: { var: "haste", op: ">=", val: 1 },
          text: "前营急着装船开拔，这群荆州大族却堵在阶下不肯散——**不在这本名册上蘸红笔，水营钥匙谁也不肯撒手**。"
        },
        {
          type: "msg",
          speaker: "议曹",
          roleTag: "掾属",
          tone: "default",
          tag: "拟写",
          condition: { var: "haste", op: "==", val: 0 },
          text: "咱们既在江陵多留几日清账，柴桑听见「曹军顿兵」倒松了口气。眼下正好把这本《荆州降将名册》过遍细筛，**免得把空壳当宝贝接了**。"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "info",
          tag: "史载",
          text: "头几页全是{{gloss:wenpin}}、{{gloss:kuaiyue}}、{{gloss:hansong}}，末页还夹着益州牧{{gloss:liuzhang}}送来的表文。字句个个赛过赋颂，明公不妨**拿指甲刮刮纸背**。"
        }
      ],
      widget: {
        type: "inspect",
        title: "批阅《荆州降将名册》",
        subtitle: "点击名册上的三条冠冕履历，戳破背后的真实算盘",
        docHeader: "建安十三年秋 · 荆州归附文武官佐及外援表册",
        items: [
          {
            id: "c1",
            quote: "襄阳旧将文聘，初闻王师临境闭门不见刘琮，及见明公乃涕泣顿首，言「不能保全州境，无颜早见」。",
            clueTitle: "哭得越惨，身价越高？",
            analysis: "曹操（心中算账）：「卖旧主比翻书还快的贼精到处都有，反倒是这种闭门不见、见面涕泣请罪的死心眼最值钱。把文聘捧成忠义样板、授江夏太守，荆州还在观望的官佐今晚全能踏实睡了。」",
            tone: "ok",
            vars: { clues_found: 1 }
          },
          {
            id: "c2",
            quote: "章陵太守蒯越等十余人率先奉表劝降，皆称「素无大志，深感明公仁德」，并附宗族田宅及水军旧籍请照旧例安置。",
            clueTitle: "「素无大志」的免税红线",
            analysis: "议曹（压低嗓子）：「嘴上写满{{subtext:suxin_buyi}}、{{subtext:shen_gan_rende}}，翻到附件第三页——门阀田宅一亩不动、水营旧编制一寸不拆。降表越漂亮，讨价越狠。」",
            tone: "warn",
            vars: { clues_found: 1 }
          },
          {
            id: "c3",
            quote: "益州牧刘璋闻天威南临，遥遣别驾张松表敬，并调蜀卒数千东下「助丞相荡平江东，愿效犬马」。",
            clueTitle: "万里送兵图什么？",
            analysis: "军候（冷笑）：「益州往年连颗花椒都没往许昌缴过，这会儿忽然赶着{{subtext:yuanxiao_quanma}}？一半借张松来摸咱们的虚实，一半把蜀中刺头兵送来借刀消耗。」",
            tone: "info",
            vars: { clues_found: 1 }
          }
        ],
        doneLabel: "合上名册，议定整编章程"
      },
      next: "N02_T02_choice"
    },

    N02_T02_choice: {
      id: "N02_T02_choice",
      chapter: "贰 · 降将名册",
      mood: "tense",
      bubbles: [
        {
          type: "msg",
          speaker: "议曹",
          roleTag: "掾属",
          tone: "info",
          tag: "推演",
          condition: { var: "clues_found", op: ">=", val: 2 },
          text: "明公把这本名册翻了个透，谁护田产、谁探虚实全摸清了里子。可难题在这儿——**看穿每个人的价码，不等于不用付钱**。"
        },
        {
          type: "msg",
          speaker: "议曹",
          roleTag: "掾属",
          tone: "default",
          tag: "史载",
          text: "按相府老规矩，先拿大印盖一张{{subtext:yuzhi_gengshi}}的顺情贴，再撒{{gloss:hou_fifteen}}金印，把荆州水军连人带船一口吞进名册！"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "warn",
          tag: "拟写",
          text: "铸金印、发封侯赐帛得先支一笔**钱帛**；可换来荆州水军连船带人成建制入籍，前线立刻实增一营可用**兵力**。"
        },
        {
          type: "msg",
          speaker: "军候",
          roleTag: "亲卫",
          tone: "danger",
          tag: "拟写",
          text: "（压低嗓子）敢整锅端着吃？不如拆散混编、北营抽老兵逐船盯梢！只是筛掉刺头加抽人看管，能上阵砍人的**兵力**当场得少一营，荆州士族今晚也得把门闩死。"
        }
      ],
      choices: [
        {
          id: "A",
          label: "与之更始，照单封侯整编水师",
          bait: "阶下荆州官吏齐齐叩首，水营点卯名册立刻厚了一截",
          isBait: true,
          replyText: "十五枚金印换一支现成水军，比在邺城挖十年池塘划算多了！封侯、授印、水营整编入账，文聘领江夏！",
          effects: { money: -1, grain: 0, troops: 1, vars: { jingzhou_trust: 1 } },
          reason: "封侯赐帛安抚降众，整编荆州水军实增一营",
          next: "N02a"
        },
        {
          id: "B",
          label: "拆散降营，北兵抽调逐船监押",
          bait: "韩嵩悄悄把拟好的谢恩表塞回袖底，阶下十几个降将脸如土灰",
          isBait: false,
          replyText: "爵位赏钱照发，船舵不能留原班底！水营全拆混编，北卒上船盯紧——宁可账面少一营，不留整串隐患！",
          effects: { money: 0, grain: 0, troops: -1, vars: { jingzhou_trust: 0 } },
          reason: "拆散降营汰除可疑，北兵抽调监军少一营",
          next: "N02b"
        }
      ]
    },

    N02a: {
      id: "N02a",
      chapter: "贰 · 降将名册",
      mood: "calm",
      bubbles: [
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "ok",
          tag: "结算",
          text: "十五枚列侯金印连夜铸发，荆州水营欢天喜地换上曹字帅旗，前军立刻多出一整营水兵。"
        },
        {
          type: "msg",
          speaker: "军候",
          roleTag: "亲卫",
          tone: "warn",
          tag: "拟写",
          text: "（冷眼看着廊外）金印还没焐热，蒯家管家已经回去核对免税田契了。只望江上真动起刀来，这帮顺风兄弟**别先摸刀砍缆绳**。"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "黄昏后营",
          tag: "巡营",
          tone: "cold",
          text: "散议时暮色压下来，你拐过**后营低矮的医棚**。一阵**苦艾草混着陈醋的闷味**扑鼻而来；掀开的草帘缝里，一个北方新兵正弯腰**捂着袖口咳个不停**，外头杂役抬着没点数的竹床默默绕过。"
        },
        {
          type: "msg",
          speaker: "曹操",
          roleTag: "心中",
          tag: "暗忖",
          tone: "accent",
          text: "拿艾草和陈醋硬压热病汗臭——看来袖子里藏不住的那卷竹简，今晚要拍上桌了。"
        }
      ],
      next: "N03_plague_crisis"
    },

    N02b: {
      id: "N02b",
      chapter: "贰 · 降将名册",
      mood: "cold",
      bubbles: [
        {
          type: "msg",
          speaker: "军候",
          roleTag: "亲卫",
          tone: "ok",
          tag: "结算",
          text: "……末将这就逐营拆编。北营抽去盯梢的弟兄虽少了一营战力，至少船舱底下**没人敢偷偷藏火油**。"
        },
        {
          type: "msg",
          speaker: "议曹",
          roleTag: "掾属",
          tone: "danger",
          tag: "拟写",
          text: "（长叹一口气）晌午江陵街头还热闹得像元宵，这一道令拍下去，半城世族的大门今晚全上了铁栓。"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "黄昏后营",
          tag: "巡营",
          tone: "cold",
          text: "走出冷冰冰的府门已近黄昏，你贴着**后营医棚**边走过。浓重的**苦艾草与陈醋气**从帐底漫出来；帘内河北卒子咳得胸膛发响，外头记数的小吏听见靴声，手忙脚乱合上了木匣。"
        }
      ],
      next: "N03_plague_crisis"
    },

    N03_plague_crisis: {
      id: "N03_plague_crisis",
      chapter: "叁 · 袖中疫报",
      mood: "cold",
      bubbles: [
        { type: "divider", text: "叁 · 建安十三年冬 · 疾疫到案" },
        {
          type: "msg",
          speaker: "医曹",
          roleTag: "军医",
          tone: "danger",
          tag: "史载",
          text: "（把一捆沾潮气的竹简按在案角）明公，艾草跟陈醋熏不住了！眼下入冬盛寒，{{gloss:gaocao}}，北军又{{gloss:shuitu}}，今早又抬出去二十多个高热说胡话的——**没人敢替您报总数**！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "warn",
          tag: "史载",
          text: "细作刚递回柴桑的消息：周瑜在孙权堂上押上身家主战，算准的就是咱们**「远涉江湖，必生疾病」**。"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "accent",
          tag: "拟写",
          condition: { var: "haste", op: ">=", val: 1 },
          text: "可「八十万」战书已经递出门，东下大旗也竖起来了！这时候自报染疫减员，**柴桑拿到简报得笑出眼泪**！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "default",
          tag: "拟写",
          condition: { var: "haste", op: "==", val: 0 },
          text: "明公在江陵已经多顿了一旬，外头早传咱们迟疑不敢过江。这时候再把病籍摊在明面上，前锋怕是连桨都懒得摇了。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "info",
          tag: "拟写",
          text: "哪回冬天行军不打几个喷嚏？把那捆发潮的竹简塞回袖筒，{{subtext:wuluan_junxin}}——只要江东还听得见「八十万」三字，账面**一兵不用扣**，孙权夜里照样发抖！"
        },
        {
          type: "msg",
          speaker: "医曹",
          roleTag: "军医",
          tone: "warn",
          tag: "拟写",
          text: "（声音发干）报喜不报忧，名册我一笔不动，大伙继续挤在潮舱里拿命硬扛；若要真救人，立刻把病卒移上北岸隔离除名，可战**兵力**立少两营！"
        },
        {
          type: "msg",
          speaker: "管粮吏",
          roleTag: "仓曹",
          tone: "default",
          tag: "拟写",
          text: "（拨开算筹补一刀）病营不能再跟大营吃大锅饭。另起药灶单煮热米汤、配姜汤柴薪，还得从江陵仓单拨一笔**粮草**。"
        }
      ],
      choices: [
        {
          id: "A",
          label: "压下疫报，名册一字不改",
          bait: "帐里众人齐齐长舒一口气，连夜把「大军鼎盛」的文书往各营发",
          isBait: true,
          replyText: "仗还没过江，先拿一份病号单子替周瑜壮胆？病籍锁进药箱底，外头谁敢私报病数，按动摇军心论处！",
          effects: { money: 0, grain: 0, troops: 0, vars: { haste: 1, plague_honesty: 0 } },
          fakeTroopBadge: "+0（仍号八十万 · 未计病卒）",
          reason: "压下疫报不改名册，虚保八十万声势",
          next: "N03a"
        },
        {
          id: "B",
          label: "当众摊牌，移岸隔离单开药灶",
          bait: "帐中瞬间冷成冰窖，几名北方将把脸别向门外冷哼了一声",
          isBait: false,
          replyText: "死人难道能替孤摇桨？按医曹说的办：病卒全移北岸隔离除名，药灶单支米粮——这本难看的账，孤自己兜着！",
          effects: { money: 0, grain: -1, troops: -2, vars: { haste: 0, plague_honesty: 1 } },
          reason: "病卒移岸除名减两营，另起药灶单支粮草",
          next: "N03b"
        }
      ]
    },

    N03a: {
      id: "N03a",
      chapter: "叁 · 袖中疫报",
      mood: "tense",
      bubbles: [
        {
          type: "msg",
          speaker: "医曹",
          roleTag: "军医",
          tone: "warn",
          tag: "结算",
          text: "（默默把竹简塞回袖袋）……诺。账面上**一兵不缺**，营里都是铁打的好汉。"
        },
        {
          type: "msg",
          speaker: "军报",
          roleTag: "前锋驿",
          tone: "danger",
          tag: "史载",
          text: "大军过{{gloss:baqiu}}压至赤壁，与周瑜、刘备碰了第一回头——前锋拉弓直打摆子，初战不利，退扎江北{{gloss:wulin}}！"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "乌林湿码头",
          tag: "巡营",
          tone: "cold",
          text: "败退回乌林时正落冷雨，码头栈道湿滑得站不住脚。几名河北骑兵**脸绿地扒着船帮干呕**，旁边两个荆州水手互看一眼，**默不作声地往浑江里啐了口唾沫**；苇塘边新抬下的草席，一卷比一卷沉。"
        }
      ],
      next: "N04_hefei_alarm"
    },

    N03b: {
      id: "N03b",
      chapter: "叁 · 袖中疫报",
      mood: "cold",
      bubbles: [
        {
          type: "msg",
          speaker: "医曹",
          roleTag: "军医",
          tone: "ok",
          tag: "结算",
          text: "……谢明公肯看真账。臣连夜划出北岸隔离营，先保住没倒下的弟兄。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "danger",
          tag: "拟写",
          text: "（憋红了脸）没见周瑜船影先自砍两营、赔进去一笔军粮——传到江东，人家真当咱们是**来长江办养病庄子的**！"
        },
        {
          type: "msg",
          speaker: "军报",
          roleTag: "前锋驿",
          tone: "warn",
          tag: "史载",
          text: "大军抵{{gloss:baqiu}}、赤壁初交锋仍吃了个闷亏，退守江北{{gloss:wulin}}；好在病营早留在了上游北岸，前线咳嗽声少了一半。"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "乌林湿码头",
          tag: "巡营",
          tone: "cold",
          text: "你踩着打滑的木板走过乌林码头。曾在官渡、长坂冲阵的河北壮汉**扶着船帮吐得脸色发青**，岸边荆州老水卒见了，转过头**悄悄往江水里吐了口口水**。"
        }
      ],
      next: "N04_hefei_alarm"
    },

    N04_hefei_alarm: {
      id: "N04_hefei_alarm",
      chapter: "肆 · 合肥急报",
      mood: "tense",
      bubbles: [
        { type: "divider", text: "肆 · 建安十三年十二月 · 合肥急报" },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "乌林中军门外",
          tag: "衔接",
          tone: "fire",
          text: "鞋底还粘着码头的江泥，帐外忽然一阵乱蹄崩响——一匹口吐白沫的驿马栽倒在鹿砦前，信使糊着一脑门雪泥滚进了帅帐。"
        },
        {
          type: "msg",
          speaker: "驿使",
          roleTag: "淮南急递",
          tone: "fire",
          tag: "史载",
          text: "八百里急报！！孙权亲自统兵围攻{{gloss:hefei}}！{{gloss:huainan}}守军快把牙咬碎了，再无援兵，东线门户就要被端了！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "warn",
          tag: "拟写",
          text: "好毒的孙仲谋！正面叫周瑜在乌林泥潭里跟咱们耗着，背面亲自跑去撬咱们的淮南后门！"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "default",
          tag: "拟写",
          text: "慌什么！长坂一天一夜跑三百里咱们都没喘过气，合肥城墙厚实，孙权那小子啃不动的——多半是地方官吓破胆夸张！"
        },
        {
          type: "msg",
          speaker: "曹操",
          roleTag: "心中",
          tag: "暗忖",
          tone: "accent",
          text: "前门陷在烂江泥里，后门让人拿攻城锤砸得山响——偏偏帐里还有人拿长坂追逃兵当顺风标。"
        }
      ],
      widget: {
        type: "quip",
        prompt: "帐内嗡嗡吵成一锅粥，你打算拿哪句话先摁住这屋子的噪杂？",
        options: [
          {
            label: "冷笑压场：他越拿合肥当饵，孤越不让他见我皱半寸眉头",
            style: "霸气威压",
            replyText: "孙仲谋虚晃一枪想逼孤回头！越是这时候，越不能叫南岸瞧出咱们鞋底发虚！",
            responseSpeaker: "参谋",
            responseTone: "accent",
            responseText: "（精神一振）明公这话够硬气！东线虽悬，军心倒先摁住七分。",
            vars: { wit_sharp: 1 }
          },
          {
            label: "毒舌拆台：长坂是追逃兵，合肥城头可没刘琮出来递印",
            style: "毒舌拆台",
            replyText: "长坂跑得欢，那是因为前头是刘备抱头鼠窜；合肥外头是孙权拿真家伙砸门，少拿老黄历替人家挡箭！",
            responseSpeaker: "北方将",
            responseTone: "warn",
            responseText: "（脖子一缩，灰溜溜退回班列）……末将失言，不敢轻忽东线。",
            vars: { wit_sharp: 1 }
          },
          {
            label: "冷面算账：别背兵书，淮南丢了许昌的粮车走哪条水路？",
            style: "冷面算账",
            replyText: "都闭嘴！算一笔实在账：淮南若破，汴水粮道一断，咱们拿什么熬过这个腊月？",
            responseSpeaker: "管粮吏",
            responseTone: "info",
            responseText: "（猛拍大腿）终于有人问到命根子上了！明公，汴水若阻，明年春运全得瘫在半道！",
            vars: { wit_sharp: 1 }
          }
        ]
      },
      next: "N04_T07_choice"
    },

    N04_T07_choice: {
      id: "N04_T07_choice",
      chapter: "肆 · 合肥急报",
      mood: "tense",
      bubbles: [
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "accent",
          tag: "史载",
          text: "老臣有个折中法子：主力一步不退，派{{gloss:zhangxi}}率偏师星夜驰援合肥！{{subtext:pianshi_zuyi}}，孙权闻风多半自己犯嘀咕。"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "default",
          tag: "拟写",
          text: "（压低嗓子）只是话说回来——万一长江没咬下、合肥又没顶住，**许昌门阀的弹劾折子连夜就能把相府门槛压塌**。"
        },
        {
          type: "msg",
          speaker: "管粮吏",
          roleTag: "仓曹",
          tone: "warn",
          tag: "拟写",
          text: "派张熹东去，乌林前线立刻抽掉一营可用**兵力**，还得单拨一车急行**粮草**，账面可就更瘦了。"
        },
        {
          type: "msg",
          speaker: "老成军候",
          roleTag: "资深斥候",
          tone: "danger",
          tag: "拟写",
          text: "不如一兵不抽死压长江！只从府库支一笔**钱帛**重赏急递、买合肥死士死守——只要南岸砸穿周瑜，孙权自己就得滚回江东！"
        }
      ],
      choices: [
        {
          id: "A",
          label: "遣张熹偏师赴援，主力死压长江",
          bait: "众将官松了口气，直夸「两头皆顾，不失王师气象」",
          isBait: true,
          replyText: "令张熹即刻领一营精骑带足行粮星夜救合肥！主力一步不退，孤要叫孙权两头扑空！",
          effects: { money: 0, grain: -1, troops: -1, vars: { hefei_aid: 1 } },
          reason: "遣张熹偏师赴援合肥，抽调一营兵力并拨行粮",
          next: "N04a"
        },
        {
          id: "B",
          label: "一兵不抽，支钱帛买合肥死守",
          bait: "几个淮南籍的偏将脸色瞬间发白，咬紧牙关低头看靴尖",
          isBait: false,
          replyText: "分兵两头救，两头都不牢！开库支钱帛重赏合肥死士顶住一月，乌林前线一兵一卒不准动！",
          effects: { money: -1, grain: 0, troops: 0, vars: { hefei_aid: 0 } },
          reason: "孤注赌长江不抽兵，支钱帛重赏合肥死守",
          next: "N04b"
        }
      ]
    },

    N04a: {
      id: "N04a",
      chapter: "肆 · 合肥急报",
      mood: "cold",
      bubbles: [
        {
          type: "msg",
          speaker: "军候",
          roleTag: "驿骑",
          tone: "default",
          tag: "结算",
          text: "张熹领着偏师并一队快马粮车连夜扎进东边风雪。晨起大营点卯，左翼校场明晃晃**空出一大块**。"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "乌林北岸",
          tag: "巡营",
          tone: "cold",
          text: "送走援军，你迎着风沙走回江岸。岸上头盔瘦了一圈，江面的白浪却又高出一头。"
        }
      ],
      next: "N05_iron_chains"
    },

    N04b: {
      id: "N04b",
      chapter: "肆 · 合肥急报",
      mood: "cold",
      bubbles: [
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "warn",
          tag: "结算",
          text: "死守密令连同一箱**钱帛**八百里砸向淮南。大营兵马一根汗毛没少——只是夜里谁也不敢往东边看。"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "乌林北岸",
          tag: "巡营",
          tone: "cold",
          text: "你把全副家底都押在了面前这条寒江上。从今晚起，乌林这一局**只准硬扛，不许砸锅**。"
        }
      ],
      next: "N05_iron_chains"
    },

    N05_iron_chains: {
      id: "N05_iron_chains",
      chapter: "伍 · 铁索连舟",
      mood: "tense",
      bubbles: [
        { type: "divider", text: "伍 · 乌林水寨 · 北兵要稳船" },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "乌林栈桥",
          tag: "巡营",
          tone: "default",
          text: "走回乌林水寨的湿滑栈桥，北风刮得人脸生疼。桥头几个河北骑兵**抓着船缆吐得面如菜色**；两个荆州水兵斜眼瞟着，**默默往黑浪里啐了口唾沫**。"
        },
        {
          type: "msg",
          speaker: "军候",
          roleTag: "水寨巡夜",
          tone: "default",
          tag: "史载",
          text: "隔江{{subtext:chizhong_daiji}}耗到如今。年初在邺城{{gloss:xuanwuchi}}好歹练了半年水军，谁料死池塘跟长江寒浪根本两码事——北兵上船腿就打颤，文书偏只敢写成{{subtext:shizu_weilao}}。"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "warn",
          tag: "拟写",
          condition: { var: "plague_honesty", op: "==", val: 0 },
          text: "更麻烦的是底舱好些弟兄脸青得发灰——嘴上说是江浪晃的，实则**袖子里那卷没入账的病册正在悄悄兑账**。"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "ok",
          tag: "拟写",
          condition: { var: "plague_honesty", op: ">=", val: 1 },
          text: "好在病号早挪去北岸隔离了，船上没成片躺倒；只是剩下来的健卒照样{{subtext:zanwei_shuxi}}，**扶着船舷把隔夜饭都吐干净了**。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "accent",
          tag: "史载",
          text: "明公快把{{gloss:mengchong_doujian}}首尾用大铁索锁死、铺厚木板当陆营使！踩得稳才拉得开强弩，今晚再不连稳，天亮前准有旱鸭子**跳船游回江陵**！"
        },
        {
          type: "msg",
          speaker: "荆州降将",
          roleTag: "水营校尉",
          tone: "danger",
          tag: "史载",
          condition: { var: "jingzhou_trust", op: ">=", val: 1 },
          text: "（念着先前封赏旧情，硬着头皮压低嗓子）明公三思！南人打水仗最爱放火。船一旦首尾咬死，起了顺风火谁也解不开缆绳！该分屯散泊、多撒{{gloss:zouge}}巡江防火！"
        },
        {
          type: "msg",
          speaker: "荆州降将",
          roleTag: "水营校尉",
          tone: "default",
          tag: "史载",
          condition: { var: "jingzhou_trust", op: "==", val: 0 },
          text: "（隔着监军北兵冷笑半声）顺嘴提醒一句：南军顶爱放火。船锁成一块正好省得挑靶子——老规矩本该分屯散泊、留{{gloss:zouge}}巡哨，听不听随贵军。"
        },
        {
          type: "msg",
          speaker: "水军吏",
          roleTag: "工坊",
          tone: "warn",
          tag: "拟写",
          text: "（摊开工坊簿）若依北将钉死连舟，熟铁链、松木栈板与工匠赶工赏钱，得先从江陵工坊支一笔**钱帛**。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "danger",
          tag: "拟写",
          text: "（拍案冷笑）分屯？船散在黑浪里各自颠簸，北兵全趴甲板吐胆汁！列不成阵，前锋等于实打实少掉一营可用**兵力**！{{subtext:konghan_jiangshi}}，您自己挑！"
        }
      ],
      choices: [
        {
          id: "A",
          label: "首尾连舟，铁索钉成水上大营",
          bait: "北方诸将齐声欢呼，连扶着门框呕吐的校尉都挺直了腰",
          isBait: true,
          replyText: "船上都站不直还谈什么射箭！支钱帛催江陵工坊连夜打铁索、铺木板，把水寨锁成一块铁板！",
          effects: { money: -1, grain: 0, troops: 0, vars: { loose_ships: 0 } },
          reason: "江陵工坊连夜打造铁索木板，支钱帛赶工",
          next: "N05a"
        },
        {
          id: "B",
          label: "分屯散泊，严禁连环留出水道",
          bait: "北营将校把铁盔往地上狠狠一摔，帐外一片怨骂",
          isBait: false,
          replyText: "水战到底不是跑马！宁可让北兵吐着打，也不能把几百条船绑成一座水上柴垛！散泊分屯，留足救火水道！",
          effects: { money: 0, grain: 0, troops: -1, vars: { loose_ships: 1 } },
          reason: "分屯散泊江浪晃荡，北兵晕船不能列阵减一营",
          next: "N05b"
        }
      ]
    },

    N05a: {
      id: "N05a",
      chapter: "伍 · 铁索连舟",
      mood: "tense",
      bubbles: [
        {
          type: "msg",
          speaker: "水军吏",
          roleTag: "工坊",
          tone: "warn",
          tag: "结算",
          text: "……诺，连夜发**钱帛**催工匠打铁索、钉松木跳板。"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "ok",
          tag: "拟写",
          text: "（重重跺了两脚甲板）纹丝不动！跟踩在**许昌大青砖**上似的，明早总算能练强弩齐射！"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "连舟甲板",
          tag: "夜巡",
          tone: "info",
          text: "夜深后你提灯**走上新连好的甲板**。厚木板在靴底稳得像许昌官砖，铁匠砸铁环的叮当声响了一整夜，听着像在长江上打地基。拐到背风船舷时，一丝极淡的**松油味**擦着转身飘来——巡夜伙夫吸了吸鼻子，只当是修船桐油，打个哈欠钻回舱里。"
        }
      ],
      next: "N06_huanggai_letter"
    },

    N05b: {
      id: "N05b",
      chapter: "伍 · 铁索连舟",
      mood: "cold",
      bubbles: [
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "danger",
          tag: "结算",
          text: "（把点卯竹简啪地拍在案上）船散成这样，吐趴下的兄弟枪都攥不住，明早点卯直接少一营人——这水仗明公自己找水鬼打去吧！"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "散泊水寨",
          tag: "夜巡",
          tone: "cold",
          text: "入夜后你踩着摇晃的跳板走过几条散泊战舰。黑浪里几十点孤灯各自起伏，甲板上呕吐声混着水声响了一宿；船尾一个老水手却一声不吭，默默**又往救火木桶里舀满两瓢江水**。"
        }
      ],
      next: "N06_huanggai_letter"
    },

    N06_huanggai_letter: {
      id: "N06_huanggai_letter",
      chapter: "陆 · 东南风信",
      mood: "fire",
      bubbles: [
        { type: "divider", text: "陆 · 建安十三年冬夜 · 黄盖密信" },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "江岸巡哨",
          tag: "夜巡",
          tone: "fire",
          text: "半夜你沿江岸巡哨，吹了半个月、冻裂耳朵的北风**突然齐刷刷断了档**；紧接着，一股带着水腥气的温软**东南风**，直扑扑贴着你的脸吹了过来。"
        },
        {
          type: "msg",
          speaker: "密信吏",
          roleTag: "暗桩",
          tone: "info",
          tag: "史载",
          text: "（急步掀帘）机密急报！江东三世老臣黄盖托心腹摸黑送来密书，称愿携粮船十余艘与部曲趁夜来降！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "accent",
          tag: "拟写",
          condition: { var: "loose_ships", op: "==", val: 0 },
          text: "明公瞧！咱们的铁索水寨刚连成铜墙铁壁，江心一座黑压压的水上大城——黄盖隔江一眼瞧凉了半截，**连夜送投名状来了**！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "default",
          tag: "拟写",
          condition: { var: "loose_ships", op: ">=", val: 1 },
          text: "咱们分屯死熬总算稳住了阵脚！连孙家三世老将都看出江东扛不过这个冬天，偷偷递降书来了！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "ok",
          tag: "拟写",
          condition: { var: "plague_honesty", op: "==", val: 0 },
          text: "这信来得简直像老天递枕头！营里那些杂病正愁瞒不住，不战而收黄盖一营，连「八十万」的台面都一并赚回来了！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "info",
          tag: "拟写",
          condition: { var: "plague_honesty", op: ">=", val: 1 },
          text: "前阵子当众减员，大伙心里正憋着火——趁夜收了黄盖一营，这口恶气也就顺出来了！"
        },
        {
          type: "msg",
          speaker: "曹操",
          roleTag: "心中",
          tag: "暗忖",
          tone: "accent",
          text: "北风半夜刚转东南，江东老将偏巧就在今晚运粮投诚？纸面写得再动情，先捏开封泥查查成色。"
        }
      ],
      widget: {
        type: "inspect",
        title: "细验《黄盖密信》",
        subtitle: "东南风已起，点击信中三处可疑细节，查一查里头有没有炸药味",
        docHeader: "建安十三年冬 · 江东折冲将军黄盖血书顿首",
        items: [
          {
            id: "c4",
            quote: "盖今已备蒙冲斗舰十余艘，尽载军粮军械趁夜来附，望明公速开水寨纳之。",
            clueTitle: "满船粳米，吃水怎会高出两尺？",
            analysis: "老成参谋（压低声音）：「斥候借月色贴近瞟过——十来艘号称装满军粮的蒙冲，吃水却比空船还轻一截！里头塞的不是大米，八成是枯芦苇浇满猛火油！」曹操（眯眼）：「莫非江东今年改种空壳轻稻了？」",
            tone: "warn",
            vars: { clues_found: 1 }
          },
          {
            id: "c5",
            quote: "惟大江水急，必俟东南风起、顺水疾行，始克于今夜子时前直抵大营前寨。",
            clueTitle: "逃命投降还要先看风向黄历？",
            analysis: "老成参谋：「逃命投降哪有专挑东南急风夜出发的？顺风顺水直往咱们寨门里扎，勒缆都勒不住！」曹操（摸着短须）：「周瑜帐下这看风先生，掐点掐得比打更的还准。」",
            tone: "fire",
            vars: { clues_found: 1 }
          },
          {
            id: "c6",
            quote: "盖受孙氏厚恩，然与周瑜素有宿怨，耻居其下；今唯率部曲死士赴义，愿效犬马。",
            clueTitle: "全族老幼全留柴桑人质堆里？",
            analysis: "曹操（指节叩案）：「黄公覆一大家子百十口全在柴桑！真要反水投曹，通篇半个字不提怎么接应家眷，光领着一群壮丁往我怀里冲？这哪是降表，分明是自带火折子的死士卖身契。」",
            tone: "danger",
            vars: { clues_found: 1 }
          }
        ],
        doneLabel: "收起密信，听诸将争辩"
      },
      next: "N06_T06_choice"
    },

    N06_T06_choice: {
      id: "N06_T06_choice",
      chapter: "陆 · 东南风信",
      mood: "fire",
      bubbles: [
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "info",
          tag: "推演",
          condition: { var: "clues_found", op: ">=", val: 4 },
          text: "（冷汗渗出额角）明公把那信戳得像筛子了……可满帐将吏眼睛都亮着，**真打算当众泼这盆冷水**、把「天大喜事」摁回去？"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "accent",
          tag: "拟写",
          text: "黄盖跟周瑜{{subtext:suyou_suyuan}}，江东茶馆都在传！眼下{{subtext:tianming_suogui}}，明公只要准他靠岸、亲出大帐立观受降——**江南半壁今晚就能签进账本**！"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "ok",
          tag: "拟写",
          text: "（抱着砚台笑成一朵花）受降露布的标题臣都拟好了！况且既要受降，今晚连加派巡船的火油、弩士夜岗赏钱全免——**府库一文钱帛不动**！"
        },
        {
          type: "msg",
          speaker: "老成参谋",
          roleTag: "参军",
          tone: "danger",
          tag: "拟写",
          text: "（死盯着灯盏里被吹歪的火舌）诸位闻不到风向已经反了吗？！依老朽笨法子：不准靠岸！令其远泊江心，调强弩营沿江加双岗、隔水点名验船！"
        },
        {
          type: "msg",
          speaker: "老成参谋",
          roleTag: "参军",
          tone: "warn",
          tag: "拟写",
          text: "只是这般兴师动众，夜巡快艇的火油、箭矢与强弩加岗赏钱，得立刻先支一笔**钱帛**；而且明早全营都会骂您疑神疑鬼，把降人的心全寒透。"
        }
      ],
      choices: [
        {
          id: "A",
          label: "准其来降，出营高台立观受降",
          bait: "诸将校跪了一排催着写受降捷报，鼓乐手都扛起大鼓往岸边跑",
          isBait: true,
          replyText: "黄公覆连身家老小都押过来投诚了，咱们连江面都不敢开，往后谁还敢降？传鼓乐登台、灯笼挑高三尺，孤亲自出去收下这份大礼！",
          effects: { money: 0, grain: 0, troops: 0, vars: { suspect_defection: 0 } },
          reason: "准降迎船立观，省下夜巡火油与弩士赏钱",
          next: "N06a"
        },
        {
          id: "B",
          label: "令其远泊江心，强弩列岸验船",
          bait: "帐内瞬间冻成冰窖，几名荆州降将把脑袋埋得快贴上靴面",
          isBait: false,
          replyText: "宁可今晚背一世「刻薄多疑」的恶名，不能拿十万条脖子去赌几艘顺风来船！强弩上弦，敢越界半步直接放箭！",
          effects: { money: -1, grain: 0, troops: 0, vars: { suspect_defection: 1 } },
          reason: "令远泊戒备，支钱帛添夜巡火油与强弩赏钱",
          next: "N06b"
        }
      ]
    },

    N06a: {
      id: "N06a",
      chapter: "陆 · 东南风信",
      mood: "fire",
      bubbles: [
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "accent",
          tag: "结算",
          text: "（喀哒锁紧钱箱）**一文不花办成受降大典**！灯笼再挑高三尺，让江心来船一眼认清丞相帅旗！"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "ok",
          tag: "拟写",
          text: "成了！过完今夜，江南六郡直接在砚台边签字入库！"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "望江哨台",
          tag: "史载",
          tone: "fire",
          text: "你大步登上**江岸望江哨台**。湿热的东南风迎面刮得袍袖猎猎作响；漆黑江面上，黄盖那十几艘浅吃水蒙冲顺风**快得根本不像装了粮食**。离水寨只剩二里地，前头船上同时掀开了黑油布。"
        }
      ],
      next: "N08_battle_report"
    },

    N06b: {
      id: "N06b",
      chapter: "陆 · 东南风信",
      mood: "fire",
      bubbles: [
        {
          type: "msg",
          speaker: "老成参谋",
          roleTag: "参军",
          tone: "ok",
          tag: "结算",
          text: "……谢明公肯把「刻薄多疑」四个字扛自己肩上。强弩营，支油挑灯，全员上弦！"
        },
        {
          type: "msg",
          speaker: "北方将",
          roleTag: "前营校尉",
          tone: "danger",
          tag: "拟写",
          text: "（冷哼一声）降书都拍在案上了还拿强弩顶人家脑门——明公今夜要真逼走了黄盖，明儿谁还敢替您卖命！"
        },
        {
          type: "narrator",
          speaker: "巡营所见",
          roleTag: "望江哨台",
          tag: "推演",
          tone: "fire",
          text: "你立在**望江哨台**边盯着暗水。东南风卷着黑浪，把黄盖那十几艘浅吃水快船**推得像离弦黑箭般扑近**——却被密密麻麻的强弩射程卡死在暗水外头。岸边骂声刚起，**江心那十几条船轰然自爆，自己烧成了一片白昼**。"
        }
      ],
      next: "N08_battle_report"
    }
  },

  battleReport: {
    header: "乌林之夜 · 军府战报结算",
    openingByHaste: {
      "2": {
        tag: "满弦赌命",
        text: "从江陵一口气催出来的「八十万」鼓点，今晚终于踩到了乌林江边。全军士气拉到满弦、谁也没留退路——**一路顺风时欠下的所有赊账，今夜排着队一起来拍门**。"
      },
      "1": {
        tag: "半途纠结",
        text: "步子曾在江陵或疫报前踩过半脚刹车，又急着抢回气势。大军押在乌林江畔，既够不上奇兵突袭，也够不上从容兜底，全看袖子里还留了几张真牌。"
      },
      "0": {
        tag: "主动收缩",
        text: "江陵先抚、病营先报，你一路把风头让给了算账。「水军八十万」的金字招牌早就亲手摘下来塞进包袱，孙刘联军在南岸把阵布得整整齐齐，只等今夜合算总账。"
      }
    },

    sections: [
      {
        title: "一、疾疫账",
        cases: [
          {
            when: [{ var: "plague_honesty", op: "==", val: 0 }],
            speaker: "医曹",
            tone: "danger",
            tag: "史载",
            text: "（声音哑得几乎听不见）当初捂在袖子里的那卷醋味病籍，**今晚全炸在大营里了**！寒雨加江湿，高热大疫一夜放倒了三成青壮，连抬担架的人都站不起来。",
            effects: { money: 0, grain: 0, troops: -3 },
            reason: "袖中隐瞒的病营溃散，盛寒大疫减员三营"
          },
          {
            when: [{ var: "plague_honesty", op: ">=", val: 1 }],
            speaker: "医曹",
            tone: "ok",
            tag: "推演",
            text: "多亏当初在江陵咬牙摊牌、早早把染病弟兄挪去北岸单灶隔离；江风再冷，总算没在决战夜**串烧成全军大疫**，前线人手虽少却个个站得住。",
            effects: { money: 0, grain: 0, troops: 0 },
            reason: "病营早移北岸隔离，未致全营连疫"
          }
        ]
      },

      {
        title: "二、东线合肥账",
        cases: [
          {
            when: [{ var: "hefei_aid", op: ">=", val: 1 }],
            speaker: "军报",
            tone: "ok",
            tag: "史载",
            text: "十二月东线急报穿夜而至：张熹偏师星夜赶至合肥外围，孙权闻我救兵已到，当即烧营退保江东——淮南门户稳住了，算是不幸里硬啃下来的一块砖。",
            effects: { money: 0, grain: 0, troops: 0 },
            reason: "张熹偏师吓退孙权，合肥解围东线未动"
          },
          {
            when: [
              { var: "hefei_aid", op: "==", val: 0 },
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: "==", val: 0 }
            ],
            speaker: "驿使",
            tone: "danger",
            tag: "推演",
            text: "（滚下台阶哭喊）乌林火起同一夜，合肥血书拍到案头！一兵未救之下合肥外廓被孙权砸破大半，淮南震动——只得拆东墙补西墙，急调后方府库重金募溃卒、抢运军粮填防线！",
            effects: { money: -1, grain: -1, troops: 0 },
            reason: "合肥危急两线齐裂，急支钱帛军粮抢救淮南"
          },
          {
            when: [
              { var: "hefei_aid", op: "==", val: 0 },
              { var: "loose_ships", op: ">=", val: 1 }
            ],
            speaker: "驿使",
            tone: "warn",
            tag: "推演",
            text: "长江虽然没被烧穿，可一兵不救的合肥城头硬挨了孙权一通死磕，守军死伤狼藉、淮南世族骂声炸翻许昌——只能从库里再剜一笔钱帛军粮火速补防善后。",
            effects: { money: -1, grain: -1, troops: 0 },
            reason: "合肥死守残破，急调钱帛军粮安抚补防淮南"
          },
          {
            when: [
              { var: "hefei_aid", op: "==", val: 0 },
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: ">=", val: 1 }
            ],
            speaker: "驿使",
            tone: "warn",
            tag: "推演",
            text: "长江用强弩顶住了黄盖，可东线的合肥被孙权硬围月余、城中粮矢殆尽！许昌门阀联名急催，不得不割出一笔钱帛与救荒军粮火速稳住淮南。",
            effects: { money: -1, grain: -1, troops: 0 },
            reason: "合肥孤守耗尽积蓄，急支钱帛军粮善后"
          }
        ]
      },

      {
        title: "三、乌林火船账",
        cases: [
          {
            when: [
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: "==", val: 0 }
            ],
            speaker: "军报",
            tone: "fire",
            tag: "史载",
            text: "黄盖十余艘火船乘东南烈风直撞进铁索水寨！当初花钱打下的熟铁链与松木栈板**此刻全成了助燃柴薪**，冲天烈焰吞掉大半战船，一路延烧进乌林岸边的屯粮大垛！",
            effects: { money: 0, grain: -1, troops: -2 },
            reason: "铁索连营遭火船焚毁，火势延烧乌林岸粮垛"
          },
          {
            when: [
              { var: "loose_ships", op: ">=", val: 1 },
              { var: "suspect_defection", op: "==", val: 0 }
            ],
            speaker: "军报",
            tone: "warn",
            tag: "推演",
            text: "迎降鼓乐吹到一半，火船还是撞进了前哨！靠前几艘走舸与浮栈当场化作火炬；幸亏当时顶着骂声坚持分屯散泊、留出防火水道，后阵主力及时斩缆荡开，大营与岸粮保住了！",
            effects: { money: 0, grain: 0, troops: -1 },
            reason: "迎降前哨数舟被焚，分屯水道及时隔断大火"
          },
          {
            when: [
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: ">=", val: 1 }
            ],
            speaker: "军报",
            tone: "info",
            tag: "推演",
            text: "强弩营隔水箭雨拦停了黄盖头船，火油提前在江心炸开，只舔焦了外围两艘哨船；只是铁索锁死的战船进退极笨，全军像铁墩子卡在江岸拉锯一整夜，平白耗掉一笔冬夜军粮。",
            effects: { money: 0, grain: -1, troops: 0 },
            reason: "强弩截停火船仅灼外舟，连舟笨重僵持耗粮"
          },
          {
            when: [
              { var: "loose_ships", op: ">=", val: 1 },
              { var: "suspect_defection", op: ">=", val: 1 }
            ],
            speaker: "军报",
            tone: "warn",
            tag: "推演",
            text: "黄盖的火油全在射程外**烧成了江东自己的烟花**！我军一船未连、也未迎降，两家在刺骨东南风里实打实对拼了一夜水上硬仗，折了一营前锋、耗去一笔寒夜战粮。",
            effects: { money: 0, grain: -1, troops: -1 },
            reason: "火攻流产转为江心硬仗，水战折兵且耗军粮"
          }
        ]
      },

      {
        title: "四、荆州降众账",
        cases: [
          {
            when: [
              { var: "jingzhou_trust", op: ">=", val: 1 },
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: "==", val: 0 }
            ],
            speaker: "管粮吏",
            tone: "danger",
            tag: "推演",
            text: "火光刚照亮半边江天，刚封赏整编的荆州降卒哗啦啦散了一大半，顺手还把乌林外仓几车军粮裹走逃命；唯有文聘带着少数旧部死撑着替主力收拢残卒。",
            effects: { money: 0, grain: -1, troops: -1 },
            reason: "火起时整编降卒惊溃散逃，并裹掠随军粮秣"
          },
          {
            when: [
              { var: "jingzhou_trust", op: ">=", val: 1 },
              { var: "loose_ships", op: ">=", val: 1 }
            ],
            speaker: "军候",
            tone: "ok",
            tag: "推演",
            text: "水寨没被大火烧穿，文聘、蒯越旧部一看阵脚还在，乖乖领着水营替北兵拉回几条失控斗舰——**那十五枚列侯金印，今晚总算没打水漂**。",
            effects: { money: 0, grain: 0, troops: 0 },
            reason: "文聘等荆州旧部助守水寨，降营未溃"
          },
          {
            when: [
              { var: "jingzhou_trust", op: ">=", val: 1 },
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: ">=", val: 1 }
            ],
            speaker: "军候",
            tone: "ok",
            tag: "推演",
            text: "强弩射停火船之后，文聘领着荆州水军赶来协防江岸，总算帮笨重的连舟水寨稳住了侧翼，没让降营趁乱炸锅。",
            effects: { money: 0, grain: 0, troops: 0 },
            reason: "文聘等荆州水营协防未乱，稳住水寨侧翼"
          },
          {
            when: [
              { var: "jingzhou_trust", op: "==", val: 0 },
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: "==", val: 0 }
            ],
            speaker: "府吏",
            tone: "warn",
            tag: "推演",
            text: "当初拆散了降营、北兵盯着没敢哗变；可火一起，被寒透了心的荆襄世族连夜锁死各地私仓拒不供粮，撤退路上米价飞涨，军粮顿时空了一截。",
            effects: { money: 0, grain: -1, troops: 0 },
            reason: "荆襄大族离心锁仓断供，后路粮草骤紧"
          },
          {
            when: [
              { var: "jingzhou_trust", op: "==", val: 0 },
              { var: "loose_ships", op: ">=", val: 1 }
            ],
            speaker: "府吏",
            tone: "warn",
            tag: "推演",
            text: "降营被北兵刀架着脖子没敢乱动；只是荆州士族个个冷眼看笑话，沿江征发粮秣处处推三阻四，大营补给白白被卡掉一截。",
            effects: { money: 0, grain: -1, troops: 0 },
            reason: "荆州士族冷眼阻运，沿江粮秣补给吃紧"
          },
          {
            when: [
              { var: "jingzhou_trust", op: "==", val: 0 },
              { var: "loose_ships", op: "==", val: 0 },
              { var: "suspect_defection", op: ">=", val: 1 }
            ],
            speaker: "府吏",
            tone: "warn",
            tag: "推演",
            text: "虽然水寨没着大火、降卒也被监军按在甲板上没敢动弹，可江陵大族心里记着那笔账，往后每运一车军粮都得先挨一道软钉子。",
            effects: { money: 0, grain: -1, troops: 0 },
            reason: "降众虽稳而荆州地方暗阻粮道，减损军粮"
          }
        ]
      }
    ],

    excuseWidget: {
      type: "wordsmith",
      title: "亲拟《致孙权退兵书 / 许昌奏报》",
      subtitle: "账算到这份上，临北撤前亲手拼一句不掉价的台阶吧",
      template: [
        "（致孙权并告朝野书）",
        { slot: "e1" },
        "，",
        { slot: "e2" },
        "，",
        { slot: "e3" },
        "。"
      ],
      slots: {
        e1: [
          {
            text: "赤壁之役，天降盛寒，营中值有疾病",
            comment: "参谋击节赞叹：「高！把大败全推给老天爷和瘟疫联合办案，连御史台都找不出您的错！」",
            vars: { rhetoric_bluff: 1 }
          },
          {
            text: "今岁南征，既定荆襄，士卒劳顿思归",
            comment: "主簿小心翼翼提醒：「明公，前脚刚发完八十万战书，后脚改口说兵想家……许昌清流怕要背地笑三天。」",
            vars: {}
          },
          {
            text: "淮右警急，江上久持无益，孤姑且收兵",
            comment: "北方将抹了把脸点头：「听着像咱们主动赏他个面子退兵，比提火烧体面多啦。」",
            vars: { wit_sharp: 1 }
          }
        ],
        e2: [
          {
            text: "故孤亲命烧船自退，以全军士性命",
            comment: "议曹笔尖直抖：「明公……您把这把火认作自己点的？那江心冲过来的十几艘带油布蒙冲，算给您提前送火把么？」",
            vars: { rhetoric_bluff: 1 }
          },
          {
            text: "遂整旅北还，固守襄阳、江陵要津",
            comment: "军候实诚点头：「能写得这么四平八稳还不怎么脸红，已是幕僚笔杆子的极限。」",
            vars: {}
          },
          {
            text: "姑留舟楫资敌，聊示中原宽宏之度",
            comment: "管粮吏眼皮狂跳：「连船带米全丢江里了还叫『宽宏之度』？这账臣可不敢往库簿里抄！」",
            vars: { wit_sharp: 1 }
          }
        ],
        e3: [
          {
            text: "横使周瑜小儿虚获此名，天下其笑之",
            comment: "传令官憋笑憋得直抖：「周公瑾要是收到这封信，多半得把茶碗砸了，再把信裱起来挂堂屋！」",
            vars: { rhetoric_bluff: 1 }
          },
          {
            text: "俟来春草青马肥，再与将军决于江表",
            comment: "北方将挺起腰板：「狠话放足先溜，这才叫咱们中原男儿体面退场！」",
            vars: {}
          },
          {
            text: "此间得失，孤自知之，不必为外人道也",
            comment: "老成参谋长叹一声：「肯关起门自己认这本账，这一趟总算没白亏。」",
            vars: { wit_sharp: 1 }
          }
        ]
      },
      confirmLabel: "用印落款，定格此战结局",
      resultSpeaker: "曹操（书成掷笔）"
    },

    routes: [
      {
        when: [
          { var: "hefei_aid", op: "==", val: 0 },
          { var: "plague_honesty", op: "==", val: 0 }
        ],
        ending: "E-two-front-fracture"
      },
      {
        when: [
          { var: "hefei_aid", op: "==", val: 0 },
          { var: "loose_ships", op: "==", val: 0 },
          { var: "suspect_defection", op: "==", val: 0 }
        ],
        ending: "E-two-front-fracture"
      },
      {
        when: [
          { var: "hefei_aid", op: ">=", val: 1 },
          { var: "loose_ships", op: "==", val: 0 },
          { var: "suspect_defection", op: "==", val: 0 },
          { var: "plague_honesty", op: "==", val: 0 }
        ],
        ending: "E-canon-ash"
      },
      {
        when: [
          { var: "plague_honesty", op: ">=", val: 1 },
          { var: "haste", op: "==", val: 0 }
        ],
        ending: "E-honest-bleed"
      },
      {
        when: [
          { var: "plague_honesty", op: ">=", val: 1 },
          { var: "loose_ships", op: "==", val: 0 },
          { var: "suspect_defection", op: "==", val: 0 }
        ],
        ending: "E-honest-bleed"
      },
      {
        when: [],
        ending: "E-bitter-win"
      }
    ]
  },

  endings: {
    "E-canon-ash": {
      id: "E-canon-ash",
      badge: "结局一 · 史实灰",
      title: "烈火、大疫与一封找台阶的信",
      subtitle: "你几乎每一步都听了最热烈的劝——然后发现，史书就爱写这种人。",
      tone: "fire",
      bubbles: [
        {
          type: "msg",
          speaker: "军报",
          roleTag: "断后驿",
          tone: "fire",
          tag: "史载",
          text: "残军由{{gloss:huarong}}泥淖负草填路北撤，赤壁火退之后又逢盛寒大疫，**吏士死者大半**；刘备顺势尽取{{gloss:jingzhou_jiangnan}}，江汉再难轻下。"
        },
        {
          type: "msg",
          speaker: "谋士",
          roleTag: "议曹",
          tone: "ok",
          tag: "史载",
          text: "唯一能摆上朝堂撑门面的喜讯来自东线：合肥被张熹偏师吓退孙权，淮南到底没丢，荆北襄阳也还捏在手里。"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "文书",
          tone: "info",
          tag: "史载",
          text: "（吹干你拟好的书信）{{gloss:jiangbiaozhuan}}准会把这句「{{gloss:shaochuan_zitui}}」抄进注里。只要写得够理直气壮，后人真有一半会信您是自己放的火。"
        },
        {
          type: "narrator",
          speaker: "",
          tag: "结语",
          tone: "fire",
          text: "墨干了。账本合上时，把江陵那句「水军八十万」捂成一团潮黑渍——**还有那本没拆封的受降捷报，一起烧成了灰**。"
        }
      ],
      careerSeed: "生涯伏笔：许昌朝堂的清议与门阀怨言正等着翻账——东南既定不下，先修内政、还是用重爵镇住北朝？",
      verdict: "踩中正史经典败退线：水军吹大、疫病捂住、铁索连船、轻信诈降，靠合肥偏师与一张硬嘴体面退场。"
    },

    "E-bitter-win": {
      id: "E-bitter-win",
      badge: "结局二 · 旁支苦赢",
      title: "破了他的火，丢了自己的脸",
      subtitle: "江东没能烧穿乌林，可你的大帐里也没有一个人笑得出来。",
      tone: "warn",
      bubbles: [
        {
          type: "msg",
          speaker: "军报",
          roleTag: "水营",
          tone: "ok",
          tag: "推演",
          condition: { var: "suspect_defection", op: ">=", val: 1 },
          text: "黄盖那套苦肉诈降彻底破了功。周瑜一计不成只得稳守南岸；两家在寒江啃了一冬冷硬仗，谁也没吞掉谁。"
        },
        {
          type: "msg",
          speaker: "军报",
          roleTag: "水营",
          tone: "warn",
          tag: "推演",
          condition: { var: "suspect_defection", op: "==", val: 0 },
          text: "虽一时迎进了黄盖火船，亏得当时死硬不肯连船，大火没烧穿大营——剩下一半战船勉强摁住了江北渡口。"
        },
        {
          type: "msg",
          speaker: "医曹",
          roleTag: "军医",
          tone: "danger",
          tag: "推演",
          condition: { var: "plague_honesty", op: "==", val: 0 },
          text: "江东的火挡住了，可袖子里捂着的大疫到底炸了；活着撤出乌林的人里，**一半是架着木拐走出泥塘的**。"
        },
        {
          type: "msg",
          speaker: "驿使",
          roleTag: "淮南",
          tone: "warn",
          tag: "推演",
          condition: { var: "hefei_aid", op: "==", val: 0 },
          text: "江北渡口虽没丢，可没派救兵的合肥硬生生被打成一片焦土——淮南士族的弹劾折子，比咱们的班师表早三天拍进许昌。"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "default",
          tag: "拟写",
          text: "（压低嗓子）北营诸将骂您「刻薄多疑」，荆州降吏笑您「外强中干」。「水军八十万」往后没人敢提——赢了一阵难看的硬仗，赔掉三分威望。"
        },
        {
          type: "narrator",
          speaker: "",
          tag: "结语",
          tone: "warn",
          text: "真内容往往如此：**活着，但难听**。你没给周瑜留下一战封神的机会，顺手也亲手撕掉了「席卷天下」的招牌。"
        }
      ],
      careerSeed: "生涯伏笔：功高疑重之后，许昌里议论「忠汉」还是「自王」的声气更尖了。",
      verdict: "走出历史旁支：靠冷血反制或死扛分屯保住长江渡口，却在疫病、军心与舆论里赔进大把声望。"
    },

    "E-honest-bleed": {
      id: "E-honest-bleed",
      badge: "结局三 · 摊牌余生",
      title: "做对了所有算术题的孤家寡人",
      subtitle: "没人站起来替你鼓掌，但大半个北岸隔离营的人自己走出了寒冬。",
      tone: "ok",
      bubbles: [
        {
          type: "msg",
          speaker: "医曹",
          roleTag: "军医",
          tone: "ok",
          tag: "推演",
          text: "北岸隔离营拆棚那天，大半病卒靠那口单煮的热米汤熬过盛寒，**拄着枪杆自己排着队往北走**——没成片埋进乌林泥淖。"
        },
        {
          type: "msg",
          speaker: "军报",
          roleTag: "水营",
          tone: "info",
          tag: "推演",
          condition: { var: "loose_ships", op: ">=", val: 1 },
          text: "连船没连、降书没信，江东那把火根本没点着。咱们像一队算清脚程的商旅，稳当又憋屈地收住了兵。"
        },
        {
          type: "msg",
          speaker: "府吏",
          roleTag: "主簿",
          tone: "warn",
          tag: "拟写",
          text: "只是江陵人骂您「顿兵怯战」，柴桑笑您「虚张八十万，连江都没全过去」，许昌清流也全在参您赔掉的钱粮。"
        },
        {
          type: "msg",
          speaker: "驿使",
          roleTag: "淮南",
          tone: "danger",
          tag: "推演",
          condition: { var: "hefei_aid", op: "==", val: 0 },
          text: "偏偏您当时死压长江没救合肥，淮南老营平白挨了一顿重锤，这笔烂账回许昌还得重算。"
        },
        {
          type: "narrator",
          speaker: "",
          tag: "结语",
          tone: "ok",
          text: "你止住了最大失血，带回了真正喘气的人；代价是摘下「横扫六合」招牌塞进包袱。就像一个做对所有算术题的成年人——**满帐无一人鼓掌**。"
        }
      ],
      careerSeed: "生涯伏笔：带回来的是活兵不是幽灵；许昌权柄需重洗，来年尚可{{subtext:biezuo_houtu}}。",
      verdict: "清醒止损的旁支线：撕破「八十万」虚胖招牌、除名隔离保命，以难看名声换回活人本钱。"
    },

    "E-two-front-fracture": {
      id: "E-two-front-fracture",
      badge: "结局四 · 两线崩裂",
      title: "赌穿江心，后院起火",
      subtitle: "一兵不抽去赌长江，偏偏长江也没赌赢——这是最冷的北归路。",
      tone: "danger",
      bubbles: [
        {
          type: "msg",
          speaker: "军报",
          roleTag: "断后驿",
          tone: "danger",
          tag: "推演",
          text: "乌林败退经华容道北还之际，淮南急使哭进中军——一兵未援的合肥几乎被孙权破了外廓，**两线败报同一夜拍碎在案头**！"
        },
        {
          type: "msg",
          speaker: "管粮吏",
          roleTag: "仓曹",
          tone: "warn",
          tag: "推演",
          text: "为了抢救东线、抚恤溃军，后方库府几乎见底。{{subtext:quanheng_quanju}}？外头只看见明公两手抓、两头漏。"
        },
        {
          type: "msg",
          speaker: "参谋",
          roleTag: "议曹",
          tone: "info",
          tag: "拟写",
          text: "（声音发颤）淮南与豫州世族的问责奏疏堆满许昌丞相府。这一趟回去得先应付大半年弹劾，才有余力{{subtext:biezuo_houtu}}。"
        },
        {
          type: "narrator",
          speaker: "",
          tag: "结语",
          tone: "danger",
          text: "所有资源本是同一张饼。你想省出东线兵力压死长江，结果长江自己先塌一角——残旗北卷，一路算不平的冷账。"
        }
      ],
      careerSeed: "生涯伏笔：北归问责已成定局——相府威信裂出大缝，下一步是铁腕清洗，还是向世族让步？",
      verdict: "最惨烈的战略崩盘：拒救合肥以豪赌长江，却未守住疫病或火攻防线，致淮南与江汉两线同溃。"
    }
  },

  historyDossier: [
    {
      title: "一、江陵进止：乘势东下 vs 稳步蓄势",
      varName: "haste",
      canonVal: 2,
      canonNote: "正史曹操九月入江陵，遗书孙权「水军八十万、会猎于吴」，并带病急进赤壁，拉满声势。",
      playerHit: "你顺着「机不可失」把发条拧到最紧，和曹公一样把虚胖声势推上了赌桌。",
      playerMiss: "你在江陵或疫报前踩过一脚刹车——挨了「怯战」白眼，却拆掉了几根导火索。"
    },
    {
      title: "二、荆州降众：「与之更始」封侯 vs 拆散监军",
      varName: "jingzhou_trust",
      canonVal: 1,
      canonNote: "《武帝纪》载曹操下令荆州「与之更始」，论功「侯者十五人」，重用文聘、蒯越、韩嵩。",
      playerHit: "你大笔封侯十五人、整编荆州水营——和平来得最快，火起时散得也最快。",
      playerMiss: "你宁可减兵也要拆散降营、北兵监押——内部没乱，却把荆襄士族冷得够呛。"
    },
    {
      title: "三、盛寒疾疫：袖中隐瞒 vs 当众隔离",
      varName: "plague_honesty",
      canonVal: 0,
      canonNote: "《周瑜传》载初战已「有疾病」，《武帝纪》载败后「于是大疫，吏士多死者」。",
      playerHit: "你选择「勿乱军心」把病籍捂在袖里；纸面兵力漂亮，决战夜一并总算账。",
      playerMiss: "你当众自曝家丑、砍两营兵力隔离保命——全帐骂灭威风，北岸那片营活了下来。"
    },
    {
      title: "四、两线牵制：遣张熹救合肥 vs 孤注不救",
      varName: "hefei_aid",
      canonVal: 1,
      canonNote: "《武帝纪》十二月载：「孙权为备攻合肥。公至巴丘，遣张熹救合肥。权闻熹至，乃走。」",
      playerHit: "你按史书派张熹偏师救合肥，前线瘦了一圈，好歹稳住了淮南门户。",
      playerMiss: "你赌了一把险招拒救合肥——东线被打得血肉模糊，全靠长江能不能兜住。"
    },
    {
      title: "五、乌林水寨：铁索连舟 vs 分屯防火",
      varName: "loose_ships",
      canonVal: 0,
      canonNote: "《周瑜传》与《通鉴》载北人不习水战，「以舟船首尾相接」，正中火攻下怀。",
      playerHit: "为让旱鸭子北兵踩稳甲板，你花钱打铁索钉成水上寨——稳是稳，烧起来也透彻。",
      playerMiss: "你顶着北将摔头盔的怒骂坚持分屯散泊——呕声一片，却留住了救命水道。"
    },
    {
      title: "六、黄盖诈降：出营立观 vs 远泊验船",
      varName: "suspect_defection",
      canonVal: 0,
      canonNote: "《江表传》载黄盖乘东南风以蒙冲十艘灌油诈降，操军皆出营立观，卒遭焚败。",
      playerHit: "你没顶住「不战而降」诱惑，省了夜巡钱帛立观迎船——十艘火船顺风撞进了门。",
      playerMiss: "你架起强弩、背着多疑恶名把来船卡在射程外——黄盖的戏台自己烧了个寂寞。"
    }
  ]
};
