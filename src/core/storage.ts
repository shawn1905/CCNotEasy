/* ==========================================================================
   CCNotEasy Versioned Storage & Cross-Chapter Continuation Carryover
   ========================================================================== */

import { createInitialSave } from './reducer.ts'
import { SCHEMA_VERSION } from './schema.ts'
import type { ChapterBundle, EndingCarryover, SaveState } from './schema.ts'

function storageKeyFor(chapterId: string): string {
  return `ccnoteasy:save:v${SCHEMA_VERSION}:${chapterId}`
}

export function saveChapterState(state: SaveState): void {
  try {
    localStorage.setItem(storageKeyFor(state.chapterId), JSON.stringify(state))
  } catch {
    // Ignore quota or private-mode errors
  }
}

export function clearChapterState(chapterId: string): void {
  try {
    localStorage.removeItem(storageKeyFor(chapterId))
  } catch {
    // Ignore storage errors
  }
}

export interface LoadResult {
  state: SaveState
  recovered: boolean
  notice?: string
}

/** Safely loads and migrates a saved run; never crashes on missing/renamed nodes or added vars */
export function loadChapterState(bundle: ChapterBundle): LoadResult | null {
  try {
    const raw = localStorage.getItem(storageKeyFor(bundle.id))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SaveState>
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || parsed.chapterId !== bundle.id) {
      return null
    }

    const fresh = createInitialSave(bundle, {
      discoveredEndings: Array.isArray(parsed.discoveredEndings) ? parsed.discoveredEndings : [],
      unlockedGloss: Array.isArray(parsed.unlockedGloss) ? parsed.unlockedGloss : [],
      decodedSubtexts: Array.isArray(parsed.decodedSubtexts) ? parsed.decodedSubtexts : [],
    })

    // Recover gracefully if the saved nodeId was removed/renamed in a newer chapter version
    if (!parsed.nodeId || !bundle.nodes[parsed.nodeId]) {
      return {
        state: fresh,
        recovered: true,
        notice: '章节剧情已更新，已为你保留已解锁结局与词条并重置至本章起点。',
      }
    }

    const merged: SaveState = {
      ...fresh,
      ...parsed,
      resources: { ...fresh.resources, ...(parsed.resources ?? {}) },
      deadlines: { ...fresh.deadlines, ...(parsed.deadlines ?? {}) },
      vars: { ...fresh.vars, ...(parsed.vars ?? {}) },
      chapterVersion: bundle.version,
    }

    return { state: merged, recovered: false }
  } catch {
    return null
  }
}

export function exportEndingCarryover(bundle: ChapterBundle, state: SaveState): EndingCarryover {
  return {
    schemaVersion: SCHEMA_VERSION,
    chapterId: bundle.id,
    chapterVersion: bundle.version,
    endingNodeId: state.endingNodeId ?? state.nodeId,
    resources: { ...state.resources },
    vars: { ...state.vars },
    dirtyTricks: state.dirtyTricks.map((t) => t.id),
    choiceLog: [...state.choiceLog],
    exportedAt: Date.now(),
  }
}
