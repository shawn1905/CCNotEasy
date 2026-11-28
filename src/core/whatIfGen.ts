/* ==========================================================================
   CCNotEasy Dynamic What-If Worldline Generator (5-Defense Framework)
   1. Historical Artifact & Anchor Injection (anti-blandness)
   2. Fact-Ledger Relay + Golden Few-Shot Style Bible (anti-drift)
   3. Character Persona Conflict Matrix (anti-narrator NPCs)
   4. Forced 3-Act Structure (Act1 CounterCase -> Act2 Climax -> Act3 Ending)
   5. Local Redline Sanitizer + One-Click Branch Patch Export (Hybrid Curation)
   ========================================================================== */

import type { ChapterBundle, Choice, Effect, SaveState, SceneNode } from './schema.ts'

export type WhatIfStyle = 'bold' | 'scheme' | 'twist'

export interface LlmConfig {
  baseUrl: string
  apiKey: string
  model: string
}

export const WHATIF_TOTAL_STEPS = 5 as const

export interface WhatIfStepMeta {
  sessionId: string
  originNodeId: string
  style: WhatIfStyle
  userIdea: string
  step: 1 | 2 | 3 | 4 | 5
  generatedNodeIds: string[]
}

const BANNED_JP_RE = /[\u3040-\u30ff]|幕府|大名|武士|忍者|天守|城下町|浪人|切腹/g
const LLM_CFG_KEY = 'ccnoteasy:whatif_llm_cfg'

export const BUILTIN_PROXY_URL = 'https://eleven-experiment-sphere-yang.trycloudflare.com/v1'

export const DEFAULT_LLM_CONFIG: LlmConfig = {
  baseUrl: BUILTIN_PROXY_URL,
  apiKey: '',
  model: 'glm-5.3-flash',
}

export function isKeylessProxyUrl(url: string): boolean {
  const u = url.trim()
  return u.startsWith('/') || u === BUILTIN_PROXY_URL || u.includes('.trycloudflare.com')
}

export function loadLlmConfig(): LlmConfig {
  try {
    const raw = localStorage.getItem(LLM_CFG_KEY)
    if (!raw) return { ...DEFAULT_LLM_CONFIG }
    const parsed = JSON.parse(raw) as Partial<LlmConfig>
    const key = parsed.apiKey?.trim() || ''
    // Auto-upgrade old unconfigured defaults to the built-in keyless proxy + fastest model
    const savedUrl = parsed.baseUrl?.trim() || ''
    const upgradedUrl =
      !key &&
      (!savedUrl ||
        savedUrl.includes('api.deepseek.com') ||
        savedUrl.includes('amr-link.open-design.ai'))
        ? BUILTIN_PROXY_URL
        : savedUrl || BUILTIN_PROXY_URL
    const savedModel = parsed.model?.trim() || ''
    const upgradedModel =
      !key && (!savedModel || savedModel === 'deepseek-chat' || savedModel === 'deepseek-v4.1-flash')
        ? DEFAULT_LLM_CONFIG.model
        : savedModel || DEFAULT_LLM_CONFIG.model
    return {
      baseUrl: upgradedUrl,
      apiKey: key,
      model: upgradedModel,
    }
  } catch {
    return { ...DEFAULT_LLM_CONFIG }
  }
}

export function saveLlmConfig(cfg: LlmConfig): void {
  try {
    localStorage.setItem(LLM_CFG_KEY, JSON.stringify(cfg))
  } catch {
    // ignore storage errors
  }
}

/* ---------- Defense 1: Chapter-specific Historical Artifact Anchors ---------- */
const CHAPTER_ANCHORS: Record<string, string[]> = {
  'ch01-red-cliffs': [
    '平底运粮旧船未装拍竿',
    '垫了半寸木底的假量斗',
    '江东松烟味密信印泥',
    '乌林活销铁链与桐油草船',
    '东营焚灰坑多出的一倍草席',
    '汉水枯水沙洲暗礁图',
    '荆州士族私藏的陈霉米',
    '江陵南门三船蜀布暗账',
  ],
  'ch02-guandu': [
    '督粮官王垕的小斛量斗',
    '埋入土中听地道凿声的陶瓮',
    '装满稻草诱射的借箭草人',
    '乌巢大仓官印麻袋',
    '审配狱中扣押的许攸家书',
    '旧车轴连夜改装的霹雳发石车',
    '许都荀彧手书楚汉荥阳旧事',
  ],
  'ch03-wancheng': [
    '刷了黑漆的假双铁戟木棍',
    '胡车儿袖口藏着的迷药纸包',
    '淯水南岸未燃尽的西凉马厩草垛',
    '于禁掘壕斩劫掠逃卒的军法旗',
    '刘表密使带着的空头南阳太守印',
  ],
  'ch04-baimenlou': [
    '沂泗二水决堤前的木闸门',
    '高顺陷阵营卸甲摆齐的七百面铁盾',
    '赤兔马槽里被克扣三成的西域黑豆',
    '袁绍密使缝在马鞍夹层里的招降帛书',
    '白门楼城垛上绑缚飞将的牛筋粗绳',
  ],
  'ch05-hanzhong': [
    '秦岭斜谷山道折断的运粮木轮',
    '赵云大开营门扬起虚土的树枝',
    '晚膳汤碗里冷掉的鸡肋骨',
    '司马门驰道旧案弹劾折子',
    '吕蒙白衣渡江藏在商船舱底的江东官印',
  ],
}

/* ---------- Defense 3: Character Persona Conflict Lines ---------- */
const PERSONA_HINTS: Record<string, string> = {
  jiaxu: '贾诩：极度冷静自保，专出阴损止损奇计，厌恶无谓硬拼',
  chengyu: '程昱：铁腕狠辣，不在乎骂名，主张先下手为强',
  xunyu: '荀彧：坚守汉室大义与账目规矩，反对短视脏招',
  xunyou: '荀攸：务实善谋，擅长反间与拆解敌军死穴',
  guojia: '郭嘉：敢赌人心弱点，主张兵贵神速奇袭',
  simayi: '司马懿：隐忍老辣，擅长借刀杀人与拖字诀',
  yangxiu: '杨修：聪明过头，喜欢当众点破潜台词',
  dianwei: '典韦：粗豪死忠，只信手里铁戟与主公安危',
  caoang: '曹昂：仁厚稳重，看重长远军纪与民心',
  xuhuang: '徐晃：治军严整，重前线实打实的地形与粮道',
}

const STYLE_LABELS: Record<WhatIfStyle, { name: string; prompt: string }> = {
  bold: {
    name: '险中求胜',
    prompt: '风格偏「豪赌奇袭」：不按常理保守，敢拿稀缺兵力或粮草搏一条惊天反杀路线。',
  },
  scheme: {
    name: '阴谋离间',
    prompt: '风格偏「权谋假账」：善用假信、反间、借刀杀人、假账钓鱼，把敌我算计拉满。',
  },
  twist: {
    name: '反历史脑洞',
    prompt: '风格偏「彻底改写历史」：跳出正史思维惯性（如停战议和、易储、跨区大转向），推演震撼但合乎建安逻辑的平行走向。',
  },
}

export const WHATIF_STYLE_OPTIONS: { id: WhatIfStyle; label: string; desc: string }[] = [
  { id: 'bold', label: '险中求胜', desc: '孤注一掷奇袭反杀' },
  { id: 'scheme', label: '阴谋离间', desc: '假信反间借刀杀人' },
  { id: 'twist', label: '反历史脑洞', desc: '大转向改写三国格局' },
]

function pickRandomAnchors(chapterId: string, count = 3): string[] {
  const pool = CHAPTER_ANCHORS[chapterId] ?? CHAPTER_ANCHORS['ch01-red-cliffs']!
  const copy = [...pool]
  const out: string[] = []
  while (out.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length)
    out.push(copy.splice(idx, 1)[0]!)
  }
  return out
}

function summarizeLedger(bundle: ChapterBundle, save: SaveState): string {
  const resText = bundle.resources
    .map((r) => `${r.label}(${r.id})=${save.resources[r.id] ?? 0}/${r.max}`)
    .join('，')
  const dlText = bundle.deadlines
    .map((d) => `${d.label}(${d.id})=${save.deadlines[d.id] ?? 0}/${d.max}`)
    .join('，')
  const recentChoices = save.choiceLog
    .slice(-5)
    .map((c, i) => `${i + 1}.[${c.act}] ${c.label}`)
    .join('；')
  return `当前三血条：${resText}；死线：${dlText}。近期关键抉择：${recentChoices || '刚开局'}。`
}

/* ---------- Defense 2 + 4: Build Strict Structured Prompt ---------- */
export function buildWhatIfPrompt(
  bundle: ChapterBundle,
  save: SaveState,
  meta: WhatIfStepMeta,
  lastChoiceLabel?: string,
): { system: string; user: string } {
  const anchors = pickRandomAnchors(bundle.id, 3)
  const castEntries = Object.values(bundle.cast)
    .filter((c) => c.id !== 'narrator')
    .slice(0, 6)
  const castGuide = castEntries
    .map((c) => `- ${c.id}（${c.name}/${c.role ?? ''}）：${PERSONA_HINTS[c.id] ?? '务实建安人物'}`)
    .join('\n')

  const resIds = bundle.resources.map((r) => r.id).join(', ')
  const dlIds = bundle.deadlines.map((d) => d.id).join(', ')

  const stepInstruction =
    meta.step === 1
      ? `【当前是第 1/5 幕（起 · 撕裂正史与首波假账）】
必须输出 kind="scene"，lines 必须写足 4 条（1段 50~70 字巡营场景描写 + 3句角色争执对白），必须包含 interaction.type="counter_case"（2 条 claims：表面官话 surface vs 巡营实查 proof）和 2 个 choices（有得必有失）。choices 的 next 填 "__NEXT__"`
      : meta.step === 2
        ? `【当前是第 2/5 幕（承 · 敌营反扑与谋士交锋）】
必须输出 kind="scene"（不带 interaction），lines 必须写足 5 条（1段巡营战报场景 + 4句两位立场相反的谋士激烈拆台与曹操冷峻回应），给出 2 个推进战局的 choices（有得必有失）。choices 的 next 填 "__NEXT__"`
        : meta.step === 3
          ? `【当前是第 3/5 幕（转 · 突发暗雷与二次核账）】
必须输出 kind="scene"，lines 必须写足 4 条（1段突发危机现场 + 3句角色对质），必须再次包含 interaction.type="counter_case"（2 条全新阴谋/假账破绽，最好呼应前两幕选择）和 2 个高张力 choices。choices 的 next 填 "__NEXT__"`
          : meta.step === 4
            ? `【当前是第 4/5 幕（危 · 终极决战前夜两难）】
必须输出 kind="scene"（不带 interaction），mood="fire"，lines 必须写足 5 条（把整条平行世界线的矛盾推向最高潮，双谋士与主将各执一词），给出 2 个一锤定音的终极 choices。choices 的 next 填 "__NEXT__"`
            : `【当前是第 5/5 幕（合 · 平行历史终局）】
必须输出 kind="ending"，lines 必须写足 2 段极具历史厚重感的结语（第1段写本战落幕与关键人物宿命，第2段写此战引发的十年三国格局蝴蝶效应，均设 isWalk: true），并给完整 ending 对象（badge="AI 推演 · WHAT-IF"，含 title、subtitle、tone("ok"|"warn")、verdict、buildName、buildQuote）。不要输出 choices。`

  const system = `你是《曹操不容易》建安历史策略游戏的资深主笔。严格输出合法 JSON（不要 markdown 代码块、不要多余解释）。

【五道硬性文风与机制防线】
1. 严禁空洞抽象套话（如"运筹帷幄/大军压境/军心大振/不仅而且/总而言之"），必须把指定的【建安器物锚点】自然写进现场描写或假账破绽。
2. 严禁任何日式词汇与假名（幕府/大名/武士/忍者/天守/城下町/浪人/切腹）。
3. 幽默克制（≤1/10），全靠「表面官话 vs 巡营实查」的反差制造冷峻实感；单条对白不超过 55 字。
4. 谋士立场必须对立冲突，严禁沦为报幕员；speaker 只能从以下可用角色 ID 中选：narrator, ${castEntries.map((c) => c.id).join(', ')}。
5. 所有 effects 里的 resource 只能用 [${resIds}]，deadline 只能用 [${dlIds}]，delta 必须在 [-2, 2] 且必须附非空中文 reason。

【可用角色人设】
${castGuide}

【黄金范本参考（仅学节奏与颗粒度，勿照抄内容）】
{"act":"架空·承 · 荆州暗使搅局","title":"刘表的连夜离间","kind":"scene","mood":"tense","lines":[{"speaker":"narrator","isWalk":true,"walkKicker":"建安二年 · 宛城西街","text":"夜巡刚过二更，驿馆后门却溜进两名带着松烟印泥味的荆州密使。"},{"speaker":"jiaxu","sourceTag":"推演","text":"司空不妨先验验这封急报——刘景升连两千援兵都没发，只拿空头官印哄人卖命。"}],"interaction":{"type":"counter_case","title":"架空柜台 · 密信查验","docTitle":"《襄阳急札》","prompt":"核对两处假情报后再拍板：","minExpose":2,"claims":[{"id":"cl1","surface":"密信称：刘表五万大军已在南阳境外接应。","proof":"巡营实查：襄阳城门紧闭，连运粮民夫都没征发。"},{"id":"cl2","surface":"密信称：许都正押送囚车来拿张绣。","proof":"调令底簿显示随军运来的全是锦帛与冬粮。"}]},"choices":[{"id":"ch1","label":"当众斩使立信","hint":"威望 +1","stampKind":"approve","stampText":"立信","replyText":"睁眼看看谁拿你当弃子！","effects":[{"kind":"resource","resource":"coin","delta":1,"reason":"当堂拆穿离间赢得降军归心"}],"next":"__NEXT__"},{"id":"ch2","label":"逼密使带假信回襄阳骗粮","hint":"军粮 +1","stampKind":"dirty","stampText":"反薅","replyText":"让他回去先借五千斛米来！","effects":[{"kind":"resource","resource":"grain","delta":1,"reason":"反手从刘表手里骗来急粮"}],"next":"__NEXT__"}]}`

  const user = `【当前章节】${bundle.subtitle}（${bundle.tagline}）
【硬事实账本】${summarizeLedger(bundle, save)}
【推演方向】${STYLE_LABELS[meta.style].name} — ${STYLE_LABELS[meta.style].prompt}
【玩家附加脑洞】${meta.userIdea.trim() || '无（由你结合当前账本发挥最出彩的平行历史转折）'}
【刚刚发生的选择】${lastChoiceLabel || '玩家在当前节点选择撕开一条全新平行世界线'}
【本幕强制嵌入的建安器物锚点（至少用 2 个）】${anchors.join('；')}

${stepInstruction}

请直接输出一个合法的 SceneNode JSON 对象。`

  return { system, user }
}

/* ---------- Defense 5: Local Redline Sanitizer & Safety Clamp ---------- */
function cleanText(s: unknown, fallback: string): string {
  if (typeof s !== 'string' || !s.trim()) return fallback
  return s.replace(BANNED_JP_RE, '').trim()
}

function sanitizeEffects(bundle: ChapterBundle, raw: unknown): Effect[] {
  if (!Array.isArray(raw)) return []
  const resIds = new Set(bundle.resources.map((r) => r.id))
  const dlIds = new Set(bundle.deadlines.map((d) => d.id))
  const safe: Effect[] = []

  for (const item of raw) {
    if (!item || typeof item !== 'object') continue
    const obj = item as Record<string, unknown>
    if (obj.kind === 'resource' && typeof obj.resource === 'string' && resIds.has(obj.resource)) {
      const delta = Math.max(-2, Math.min(2, Math.round(Number(obj.delta) || 0)))
      if (delta !== 0) {
        safe.push({
          kind: 'resource',
          resource: obj.resource,
          delta,
          reason: cleanText(obj.reason, '平行世界线军政变动'),
        })
      }
    } else if (
      obj.kind === 'deadline' &&
      typeof obj.deadline === 'string' &&
      dlIds.has(obj.deadline)
    ) {
      const delta = Math.max(-2, Math.min(2, Math.round(Number(obj.delta) || 0)))
      if (delta !== 0) {
        safe.push({
          kind: 'deadline',
          deadline: obj.deadline,
          delta,
          reason: cleanText(obj.reason, '敌我节奏变化'),
        })
      }
    }
  }
  return safe
}

export function sanitizeGeneratedNode(
  bundle: ChapterBundle,
  raw: Record<string, unknown>,
  nodeId: string,
  meta: WhatIfStepMeta,
): SceneNode {
  const castIds = new Set(Object.keys(bundle.cast))
  const fallbackSpeaker = Object.keys(bundle.cast).find((k) => k !== 'narrator') ?? 'cao'

  const rawLines = Array.isArray(raw.lines) ? raw.lines : []
  const lines = rawLines
    .filter((l): l is Record<string, unknown> => Boolean(l && typeof l === 'object'))
    .slice(0, 5)
    .map((l) => {
      const spk = typeof l.speaker === 'string' && castIds.has(l.speaker) ? l.speaker : fallbackSpeaker
      return {
        speaker: spk,
        isWalk: Boolean(l.isWalk || spk === 'narrator'),
        walkKicker: typeof l.walkKicker === 'string' ? cleanText(l.walkKicker, '架空推演') : undefined,
        sourceTag: (spk === 'narrator' ? undefined : '推演') as '推演' | undefined,
        text: cleanText(l.text, '大帐内灯火明灭，新的变局已悄然展开。'),
      }
    })

  if (lines.length === 0) {
    lines.push({
      speaker: 'narrator',
      isWalk: true,
      walkKicker: 'AI 平行推演',
      sourceTag: undefined,
      text: '帅案烛火一晃，你亲手推开了正史之外的另一扇门。',
    })
  }

  const mood =
    raw.mood === 'calm' || raw.mood === 'tense' || raw.mood === 'cold' || raw.mood === 'fire'
      ? raw.mood
      : meta.step === 4
        ? 'fire'
        : 'tense'

  if (meta.step === WHATIF_TOTAL_STEPS) {
    const endRaw = (raw.ending && typeof raw.ending === 'object' ? raw.ending : {}) as Record<string, unknown>
    return {
      id: nodeId,
      act: cleanText(raw.act, '别史终局 · 平行世界'),
      title: cleanText(raw.title, '改写历史的终局'),
      kind: 'ending',
      mood,
      lines,
      ending: {
        badge: '别史终局 · WHAT-IF',
        title: cleanText(endRaw.title, '平行世界线落幕'),
        subtitle: cleanText(endRaw.subtitle, `${STYLE_LABELS[meta.style].name} · 别史新局`),
        tone: endRaw.tone === 'warn' ? 'warn' : 'ok',
        verdict: cleanText(
          endRaw.verdict,
          '你跳出了正史的既定轨道，用一套截然不同的账本逻辑走出了属于自己的建安终局。',
        ),
        buildName: cleanText(endRaw.buildName, '平行历史改写者'),
        buildQuote: cleanText(endRaw.buildQuote, '史书只写了一条路，孤偏要走通另一条。'),
      },
    }
  }

  // Build sanitized interaction if step 1 or step 3
  let interaction: SceneNode['interaction']
  if ((meta.step === 1 || meta.step === 3) && raw.interaction && typeof raw.interaction === 'object') {
    const ir = raw.interaction as Record<string, unknown>
    const rawClaims = Array.isArray(ir.claims) ? ir.claims : []
    const claims = rawClaims
      .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === 'object'))
      .slice(0, 2)
      .map((c, idx) => ({
        id: `${nodeId}_cl_${idx + 1}`,
        surface: cleanText(c.surface, '账面呈报一切如常，请司空照例签批。'),
        proof: cleanText(c.proof, '巡营实查发现账实不符，背后暗藏猫腻。'),
      }))
    if (claims.length >= 1) {
      interaction = {
        type: 'counter_case',
        title: cleanText(ir.title, '架空柜台 · 突发核验'),
        docTitle: cleanText(ir.docTitle, '《平行世界线密呈》'),
        prompt: cleanText(ir.prompt, '核对下方破绽，再决定落印方向：'),
        minExpose: claims.length,
        claims,
      }
    }
  }

  const rawChoices = Array.isArray(raw.choices) ? raw.choices : []
  const choices: Choice[] = rawChoices
    .filter((c): c is Record<string, unknown> => Boolean(c && typeof c === 'object'))
    .slice(0, 3)
    .map((c, idx) => {
      const sk =
        c.stampKind === 'approve' || c.stampKind === 'reject' || c.stampKind === 'dirty'
          ? c.stampKind
          : idx === 0
            ? 'approve'
            : 'dirty'
      return {
        id: `${nodeId}_ch_${idx + 1}`,
        label: cleanText(c.label, idx === 0 ? '顺势推进奇策' : '反手设局止损'),
        hint: typeof c.hint === 'string' ? cleanText(c.hint, '') : undefined,
        stampKind: sk,
        stampText: cleanText(c.stampText, sk === 'dirty' ? '奇招' : sk === 'reject' ? '驳回' : '拍板').slice(0, 2),
        replyText: cleanText(c.replyText, '就按此计行事，出了乱子孤一力担着！'),
        effects: sanitizeEffects(bundle, c.effects),
        next: `__AI_STEP_${meta.step + 1}__`,
      }
    })

  if (choices.length < 2) {
    const firstRes = bundle.resources[0]?.id ?? 'grain'
    choices.push(
      {
        id: `${nodeId}_fallback_1`,
        label: '稳住大营，顺势收网推进',
        hint: '稳健收官',
        stampKind: 'approve',
        stampText: '收网',
        replyText: '步步为营，把这一步的便宜先吃进肚子！',
        effects: [{ kind: 'resource', resource: firstRes, delta: 1, reason: '稳扎稳打稳住军政盘面' }],
        next: `__AI_STEP_${meta.step + 1}__`,
      },
      {
        id: `${nodeId}_fallback_2`,
        label: '加码豪赌，把对手逼入绝境',
        hint: '高风险推进',
        stampKind: 'dirty',
        stampText: '豪赌',
        replyText: '既然已经偏离正史，索性赌把更大的！',
        effects: [{ kind: 'resource', resource: firstRes, delta: -1, reason: '孤注一掷透支军资换取主动权' }],
        next: `__AI_STEP_${meta.step + 1}__`,
      },
    )
  }

  return {
    id: nodeId,
    act: cleanText(raw.act, meta.step === 1 ? '别史·起 · 突发变局' : '别史·转 · 大帐对质'),
    title: cleanText(raw.title, '平行世界线分叉'),
    kind: 'scene',
    mood,
    lines,
    interaction,
    choices,
  }
}

/* ---------- Offline Demo Generator (Zero API Key, Instant Preview) ---------- */
function generateOfflineDemoNode(
  bundle: ChapterBundle,
  meta: WhatIfStepMeta,
  nodeId: string,
  lastChoiceLabel?: string,
): SceneNode {
  const anchors = pickRandomAnchors(bundle.id, 2)
  const castList = Object.values(bundle.cast).filter((c) => c.id !== 'narrator' && c.id !== 'cao')
  const adv1 = castList[0]?.id ?? 'cao'
  const adv2 = castList[1]?.id ?? adv1
  const res0 = bundle.resources[0]
  const res1 = bundle.resources[1] ?? res0
  const dl0 = bundle.deadlines[0]
  const ideaTag = meta.userIdea.trim() ? `（围绕「${meta.userIdea.trim().slice(0, 18)}」）` : ''

  if (meta.step === 1 || meta.step === 3) {
    return sanitizeGeneratedNode(
      bundle,
      {
        act: `推演·承 · ${STYLE_LABELS[meta.style].name}`,
        title: `变局初现${ideaTag}`,
        mood: 'tense',
        lines: [
          {
            speaker: 'narrator',
            isWalk: true,
            walkKicker: `离线推演演示 · ${STYLE_LABELS[meta.style].name}`,
            text: `你拍案推开正史轨道${ideaTag}。夜巡刚过二更，暗哨便在营外截获了与「${anchors[0]}」有关的异常账簿——有人正趁大帐转向之际浑水摸鱼。`,
          },
          {
            speaker: adv1,
            text: `大局骤变，军中人心未定！眼下这桩涉及「${anchors[1]}」的急呈漏洞百出，不可轻信。`,
          },
        ],
        interaction: {
          type: 'counter_case',
          title: '推演柜台 · 突发假账核验',
          docTitle: '《变局急呈清册》',
          prompt: '戳穿两处与建安器物锚点矛盾的破绽后再落印：',
          claims: [
            {
              surface: `呈文报称：围绕「${anchors[0]}」的调拨已全数核实无误，请即刻盖印放行。`,
              proof: `巡营实查：底簿墨迹未干且少了关键核验印记，实为下吏趁大帐转向夹带私货！`,
            },
            {
              surface: `暗哨急报：敌军已看穿我军动向，唯有按旧例退守方可自保。`,
              proof: `现场核对「${anchors[1]}」实情：敌营反倒因我军反常举动陷入迟疑，此时正是反客为主的窗口！`,
            },
          ],
        },
        choices: [
          {
            label: `顺势拿住「${anchors[0]}」把柄，借势稳住大帐`,
            hint: `${res0?.label ?? '军资'} +1`,
            stampKind: 'approve',
            stampText: '顺势',
            replyText: '把这本假账拍在案上！谁敢在变局里动歪心思，先拿他祭旗！',
            effects: res0
              ? [{ kind: 'resource', resource: res0.id, delta: 1, reason: '借假账立威并追回克扣军资' }]
              : [],
          },
          {
            label: `将计就计，故意放「${anchors[1]}」假消息诱敌入瓮`,
            hint: `${dl0?.label ?? '死线'} -1 · ${res1?.label ?? '兵力'} -1`,
            stampKind: 'dirty',
            stampText: '反钓',
            replyText: '假账别撕，顺手改两笔喂给对面探子，教他们猜到天亮！',
            effects: [
              ...(dl0 ? [{ kind: 'deadline', deadline: dl0.id, delta: -1, reason: '假情报成功拖慢敌军节奏' }] : []),
              ...(res1 ? [{ kind: 'resource', resource: res1.id, delta: -1, reason: '抽调偏师配合布设假阵' }] : []),
            ],
          },
        ],
      },
      nodeId,
      meta,
    )
  }

  if (meta.step === 2 || meta.step === 4) {
    return sanitizeGeneratedNode(
      bundle,
      {
        act: `推演·转 · 终局对质`,
        title: '双谋士当堂交锋',
        mood: 'fire',
        lines: [
          {
            speaker: 'narrator',
            isWalk: true,
            walkKicker: '离线推演演示 · 关键转折',
            text: `你方才拍板「${lastChoiceLabel ?? '奇策'}」立刻引爆连锁反应，前后方急报雪片般飞进大帐，连「${anchors[0]}」也成了压垮天平的最后砝码。`,
          },
          {
            speaker: adv1,
            text: `此时势头正猛，理当趁敌营未及反应全线压上，一战改写建安大局！`,
          },
          {
            speaker: adv2,
            text: `万万不可轻进！我军账面已紧，若孤注一掷反受其害，不如见好就收、落袋为安！`,
          },
        ],
        choices: [
          {
            label: '采纳激进奇策，压上全部筹码一战定乾坤',
            hint: `${res0?.label ?? '资源'} -1 · 冲击史诗翻盘结局`,
            stampKind: 'dirty',
            stampText: '决胜',
            replyText: '历史从来不是算盘珠子拨出来的——全军压上，今夜改写史书！',
            effects: res0
              ? [{ kind: 'resource', resource: res0.id, delta: -1, reason: '倾力一搏消耗最后机动筹码' }]
              : [],
          },
          {
            label: '采纳稳健收束，锁死眼前战果徐图天下',
            hint: `${res1?.label ?? '资源'} +1 · 锁定稳健改命结局`,
            stampKind: 'approve',
            stampText: '落袋',
            replyText: '先把到手的城池与人心攥紧，剩下的账，咱们慢慢跟天下算！',
            effects: res1
              ? [{ kind: 'resource', resource: res1.id, delta: 1, reason: '稳步收拢战果充实大营家底' }]
              : [],
          },
        ],
      },
      nodeId,
      meta,
    )
  }

  return sanitizeGeneratedNode(
    bundle,
    {
      act: 'AI 推演结局 · WHAT-IF',
      title: `改道建安：${STYLE_LABELS[meta.style].name}`,
      mood: 'calm',
      lines: [
        {
          speaker: 'narrator',
          isWalk: true,
          walkKicker: '平行世界线 · 终局结语',
          text: `沿着你亲手撕开的这条「${STYLE_LABELS[meta.style].name}」世界线${ideaTag}，从「${anchors[0]}」的破绽一路走到终局拍板，原本写死在《三国志》里的命运齿轮彻底错位。你可以点击下方一键导出本条支线 JSON，将其沉淀为永久剧本！（填入真实 LLM Key 后即可解锁无限实时生成）`,
        },
      ],
      ending: {
        badge: 'AI 推演 · WHAT-IF',
        title: `${bundle.subtitle.split('·').pop()?.trim() ?? '建安'} · 平行改命终局`,
        subtitle: `风格：${STYLE_LABELS[meta.style].name} · 演示通路已跑通`,
        tone: 'ok',
        verdict: `你完成了完整的 3 幕动态 What-If 推演闭环（起 → 柜台打脸 → 谋士对质 → 专属结局）。配置 API Key 后，同一入口将调用真实大模型按五道防线实时生成独一无二的平行剧本。`,
        buildName: `${STYLE_LABELS[meta.style].name}破局者`,
        buildQuote: '正史只是千万种可能里最无奈的那一条。',
      },
    },
    nodeId,
    meta,
  )
}

/* ---------- Main Entry: Generate Next What-If SceneNode ---------- */
export async function generateWhatIfNode(
  bundle: ChapterBundle,
  save: SaveState,
  meta: WhatIfStepMeta,
  cfg: LlmConfig,
  lastChoiceLabel?: string,
): Promise<{ node: SceneNode; usedLiveLlm: boolean }> {
  const nodeId = `${meta.sessionId}_s${meta.step}`
  const isProxy = isKeylessProxyUrl(cfg.baseUrl)

  if (!cfg.apiKey.trim() && !isProxy) {
    return {
      node: generateOfflineDemoNode(bundle, meta, nodeId, lastChoiceLabel),
      usedLiveLlm: false,
    }
  }

  const { system, user } = buildWhatIfPrompt(bundle, save, meta, lastChoiceLabel)
  const endpoint = `${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (cfg.apiKey.trim()) {
    headers.Authorization = `Bearer ${cfg.apiKey.trim()}`
  }

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: cfg.model.trim() || DEFAULT_LLM_CONFIG.model,
      temperature: 0.82,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '')
    throw new Error(`LLM 接口返回 ${resp.status}：${errText.slice(0, 120)}`)
  }

  const data = (await resp.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const content = data.choices?.[0]?.message?.content ?? ''
  const cleaned = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
  const parsed = JSON.parse(cleaned) as Record<string, unknown>
  return {
    node: sanitizeGeneratedNode(bundle, parsed, nodeId, meta),
    usedLiveLlm: true,
  }
}

/* ---------- Speculative Prefetch Cache (0ms Act 2 & Act 3 Transitions) ---------- */
const prefetchMap = new Map<string, Promise<{ node: SceneNode; usedLiveLlm: boolean }>>()

export function clearWhatIfPrefetch(): void {
  prefetchMap.clear()
}

export function getPrefetchKey(sessionId: string, step: number, choiceId: string): string {
  return `${sessionId}:s${step}:${choiceId}`
}

export function prefetchNextChoices(
  bundle: ChapterBundle,
  save: SaveState,
  meta: WhatIfStepMeta,
  currentNode: SceneNode,
  cfg: LlmConfig,
): void {
  if (meta.step >= WHATIF_TOTAL_STEPS || !currentNode.choices || currentNode.choices.length === 0) return
  const nextStep = (meta.step + 1) as 2 | 3 | 4 | 5
  for (const ch of currentNode.choices.slice(0, 2)) {
    const key = getPrefetchKey(meta.sessionId, nextStep, ch.id)
    if (prefetchMap.has(key)) continue
    const nextMeta: WhatIfStepMeta = { ...meta, step: nextStep }
    const promise = generateWhatIfNode(bundle, save, nextMeta, cfg, ch.label)
    // Suppress unhandled rejection if player picks the other branch
    promise.catch(() => {})
    prefetchMap.set(key, promise)
  }
}

export function consumePrefetchedNode(
  sessionId: string,
  step: number,
  choiceId: string,
): Promise<{ node: SceneNode; usedLiveLlm: boolean }> | null {
  const key = getPrefetchKey(sessionId, step, choiceId)
  const hit = prefetchMap.get(key) ?? null
  if (hit) prefetchMap.delete(key)
  return hit
}

/* ---------- Hybrid Curation: Local "别史馆" Storage + Export ---------- */
export interface CuratedBranch {
  id: string
  chapterId: string
  chapterSubtitle: string
  originNodeId: string
  style: WhatIfStyle
  userIdea: string
  title: string
  buildName: string
  savedAt: number
  startNodeId: string
  nodes: Record<string, SceneNode>
}

const CURATED_KEY = 'ccnoteasy:curated_branches_v1'

export function loadCuratedBranches(): CuratedBranch[] {
  try {
    const raw = localStorage.getItem(CURATED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as CuratedBranch[]) : []
  } catch {
    return []
  }
}

export function saveCuratedBranch(bundle: ChapterBundle, meta: WhatIfStepMeta): CuratedBranch {
  const nodes: Record<string, SceneNode> = {}
  for (const id of meta.generatedNodeIds) {
    const n = bundle.nodes[id]
    if (n) nodes[id] = n
  }
  const lastId = meta.generatedNodeIds[meta.generatedNodeIds.length - 1]
  const endNode = lastId ? nodes[lastId] : undefined
  const entry: CuratedBranch = {
    id: meta.sessionId,
    chapterId: bundle.id,
    chapterSubtitle: bundle.subtitle,
    originNodeId: meta.originNodeId,
    style: meta.style,
    userIdea: meta.userIdea,
    title: endNode?.ending?.title ?? endNode?.title ?? '别史残卷',
    buildName: endNode?.ending?.buildName ?? STYLE_LABELS[meta.style].name,
    savedAt: Date.now(),
    startNodeId: meta.generatedNodeIds[0] ?? '',
    nodes,
  }
  const prev = loadCuratedBranches().filter((b) => b.id !== entry.id)
  const next = [entry, ...prev].slice(0, 30)
  try {
    localStorage.setItem(CURATED_KEY, JSON.stringify(next))
  } catch {
    // ignore quota errors
  }
  return entry
}

export function deleteCuratedBranch(id: string): CuratedBranch[] {
  const next = loadCuratedBranches().filter((b) => b.id !== id)
  try {
    localStorage.setItem(CURATED_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
  return next
}

export function exportWhatIfPatch(bundle: ChapterBundle, meta: WhatIfStepMeta): string {
  const nodes: Record<string, SceneNode> = {}
  for (const id of meta.generatedNodeIds) {
    const n = bundle.nodes[id]
    if (n) nodes[id] = n
  }
  return JSON.stringify(
    {
      patchType: 'ccnoteasy-whatif-branch-v1',
      chapterId: bundle.id,
      mountAtNodeId: meta.originNodeId,
      style: meta.style,
      userIdea: meta.userIdea,
      exportedAt: new Date().toISOString(),
      nodes,
    },
    null,
    2,
  )
}
