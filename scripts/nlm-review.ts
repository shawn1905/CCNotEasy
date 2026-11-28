/* ==========================================================================
   NotebookLM Single-Chapter Historical Red-Team Reviewer (npm run review:nlm)
   STRICT REDLINE: NEVER uploads script files as NotebookLM sources!
   Only sends a concise summary as a transient `notebooklm ask` prompt against
   the external primary-source notebook (de78b426).
   ========================================================================== */

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ChapterBundle } from '../src/core/schema.ts'

const NOTEBOOK_ID = 'de78b426-72fa-4367-bb1c-463ddc001ccf'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

function main(): void {
  const chapterId = process.argv[2]
  if (!chapterId) {
    console.error('Usage: npm run review:nlm -- <chapterId> (e.g. ch03-wancheng)')
    process.exit(1)
  }

  const bundlePath = path.resolve(__dirname, `../src/content/packs/${chapterId}/bundle.json`)
  if (!fs.existsSync(bundlePath)) {
    console.error(`[review:nlm] Bundle not found: ${bundlePath}`)
    process.exit(1)
  }

  const bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8')) as ChapterBundle
  const lines: string[] = [
    '你是严谨的汉末三国正史与军事后勤史专家。请严格依据本笔记本内外部一手史料（《三国志》裴松之注、《资治通鉴》及学术文献），对以下单章游戏剧本做红队考据评审，并给出明确结论（PASS / FAIL）：',
    '1.【史实硬伤/演义混入】时间线、爵制官职、地理尺度、人物关系偏差；',
    '2.【正史逻辑与后勤细节补强】可嵌入柜台假账的一手细节；',
    '3.【What-If 分支合理性】是否合乎建安政治军事逻辑。',
    '',
    `## ${bundle.subtitle}`,
    `三血条：${bundle.resources.map((r) => r.label).join('/')}；死线：${bundle.deadlines.map((d) => d.label).join('/')}`,
  ]

  for (const [nid, node] of Object.entries(bundle.nodes)) {
    if (nid.startsWith('E_collapse') || nid.startsWith('E_overflow')) continue
    if (node.kind === 'ending') {
      lines.push(`- 结局[${node.ending?.badge ?? ''}]: ${node.ending?.title ?? nid} — ${(node.ending?.verdict ?? '').slice(0, 70)}`)
    } else if (node.choices && node.choices.length > 0) {
      lines.push(`- ${node.act ?? nid}: ${node.choices.map((c) => c.label).join(' | ')}`)
    }
  }

  const prompt = lines.join('\n')
  console.log(`[review:nlm] Querying external notebook ${NOTEBOOK_ID} for ${chapterId} (${Buffer.byteLength(prompt, 'utf8')} bytes)...`)
  const out = execFileSync('notebooklm', ['ask', '-n', NOTEBOOK_ID, prompt], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  })
  console.log(out)
}

main()
