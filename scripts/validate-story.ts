/* ==========================================================================
   CLI Story-Graph Validator (runs via: npm run validate:story)
   ========================================================================== */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ChapterBundle } from '../src/core/schema.ts'
import { validateChapterBundle } from '../src/core/validator.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packsDir = path.resolve(__dirname, '../src/content/packs')

function main(): void {
  if (!fs.existsSync(packsDir)) {
    console.error(`[validate:story] Packs directory not found: ${packsDir}`)
    process.exit(1)
  }

  const dirs = fs.readdirSync(packsDir, { withFileTypes: true }).filter((d) => d.isDirectory())
  if (dirs.length === 0) {
    console.error('[validate:story] No chapter packs found.')
    process.exit(1)
  }

  let hasErrors = false
  for (const dir of dirs) {
    const bundlePath = path.join(packsDir, dir.name, 'bundle.json')
    if (!fs.existsSync(bundlePath)) continue

    const raw = fs.readFileSync(bundlePath, 'utf8')
    const bundle = JSON.parse(raw) as ChapterBundle
    const report = validateChapterBundle(bundle)

    const status = report.ok ? 'PASS' : 'FAIL'
    console.log(
      `[validate:story] ${status} ${bundle.id} (nodes: ${report.stats.reachableNodes}/${report.stats.nodes}, endings: ${report.stats.endings}, gloss: ${report.stats.glossCount}, subtext: ${report.stats.subtextCount})`,
    )

    for (const w of report.warnings) {
      console.warn(`  WARN  [${w.code}] ${w.path}: ${w.message}`)
    }
    for (const e of report.errors) {
      console.error(`  ERROR [${e.code}] ${e.path}: ${e.message}`)
      hasErrors = true
    }
  }

  if (hasErrors) {
    process.exit(1)
  }
}

main()
