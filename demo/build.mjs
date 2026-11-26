#!/usr/bin/env node
/**
 * 《曹操不容易》// 赤壁前夜 Mobile Demo — Single-File Bundler
 * Inlines styles.css, story-data.js, audio.js, and engine.js into a single,
 * zero-dependency, offline-ready, file://-safe HTML file.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, "src");
const REPO_ROOT = path.resolve(__dirname, "..");

const INPUTS = {
  template: path.join(SRC_DIR, "template.html"),
  styles: path.join(SRC_DIR, "styles.css"),
  story: path.join(SRC_DIR, "story-data.js"),
  audio: path.join(SRC_DIR, "audio.js"),
  engine: path.join(SRC_DIR, "engine.js")
};

const OUTPUTS = [
  path.join(__dirname, "index.html"),
  path.join(REPO_ROOT, "red-cliffs-mobile-demo.html")
];

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required source file: ${filePath}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function escapeInlineScript(js) {
  return js.replace(/<\/script>/gi, "<\\/script>");
}

function escapeInlineStyle(css) {
  return css.replace(/<\/style>/gi, "<\\/style>");
}

function build() {
  const template = readRequired(INPUTS.template);
  const styles = escapeInlineStyle(readRequired(INPUTS.styles));
  const story = escapeInlineScript(readRequired(INPUTS.story));
  const audio = escapeInlineScript(readRequired(INPUTS.audio));
  const engine = escapeInlineScript(readRequired(INPUTS.engine));

  // Use function replacers to avoid special '$' replacement patterns in JS/CSS
  const html = template
    .replace("/*__INLINE_STYLES__*/", () => styles)
    .replace("/*__INLINE_STORY__*/", () => story)
    .replace("/*__INLINE_AUDIO__*/", () => audio)
    .replace("/*__INLINE_ENGINE__*/", () => engine);

  for (const outPath of OUTPUTS) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html, "utf8");
  }

  const bytes = Buffer.byteLength(html, "utf8");
  const kb = (bytes / 1024).toFixed(1);
  console.log(`[build] Bundled successfully (${kb} KB):`);
  for (const outPath of OUTPUTS) {
    console.log(`  - ${outPath}`);
  }
}

try {
  build();
} catch (err) {
  console.error(`[build] Error: ${err.message}`);
  process.exit(1);
}
