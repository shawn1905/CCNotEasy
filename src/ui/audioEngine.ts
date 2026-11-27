/* ==========================================================================
   CCNotEasy Singleton Audio & Haptics Engine (Strict TypeScript)
   - Gapless infinite BGM loop via Web Audio AudioBufferSourceNode
   - 1x -> 8x Easter egg speed-up revealing the original pre-Paulstretch track
   - Organic bamboo/quill Foley + guarded navigator.vibrate haptics
   ========================================================================== */

import type { ChapterTheme, Mood } from '../core/schema.ts'

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private bgmGain: GainNode | null = null
  private sfxGain: GainNode | null = null

  private bgmSrc = './themes/red-cliffs/bgm.mp3'
  private bgmOrigSrc = './themes/red-cliffs/bgm-orig.mp3'
  private moodRates: Partial<Record<Mood, number>> = { calm: 1.0, tense: 0.94, fire: 0.88 }

  private slowBuf: AudioBuffer | null = null
  private origBuf: AudioBuffer | null = null
  private slowLoading = false
  private origLoading = false
  private bgmNode: AudioBufferSourceNode | null = null
  private activeTrack: 'slow' | 'orig' = 'slow'
  private bgmEl: HTMLAudioElement | null = null

  private enabled = false
  private hapticsEnabled = true
  private mood: Mood = 'calm'
  private eggSpeed = 1
  private lastTickAt = 0

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) this.stopBgm()
        else if (this.enabled) this.startBgm()
      })
    }
  }

  configureTheme(theme: ChapterTheme): void {
    const nextSlow = `./themes/${theme.themeDir}/${theme.bgmFile}`
    const nextOrig = theme.bgmOrigFile ? `./themes/${theme.themeDir}/${theme.bgmOrigFile}` : ''
    if (nextSlow !== this.bgmSrc) {
      this.bgmSrc = nextSlow
      this.bgmOrigSrc = nextOrig
      this.slowBuf = null
      this.origBuf = null
      this.slowLoading = false
      this.origLoading = false
      this.eggSpeed = 1
      if (this.enabled) {
        this.stopBgm()
        this.startBgm()
      }
    }
    if (theme.moodRates) {
      this.moodRates = { ...theme.moodRates }
    }
  }

  isEnabled(): boolean {
    return this.enabled
  }

  setHapticsEnabled(flag: boolean): void {
    this.hapticsEnabled = flag
  }

  vibrate(pattern: number | number[]): void {
    if (!this.hapticsEnabled || typeof navigator === 'undefined') return
    try {
      const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
      if (ua && !ua.hasBeenActive) return
      if (typeof navigator.vibrate === 'function') navigator.vibrate(pattern)
    } catch {
      // Ignore unsupported vibrate
    }
  }

  private ensureContext(): boolean {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => undefined)
      }
      return true
    }
    const AC =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return false
    try {
      this.ctx = new AC()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = this.enabled ? 0.9 : 0
      this.masterGain.connect(this.ctx.destination)

      this.bgmGain = this.ctx.createGain()
      this.bgmGain.gain.value = 0.45
      this.bgmGain.connect(this.masterGain)

      this.sfxGain = this.ctx.createGain()
      this.sfxGain.gain.value = 0.72
      this.sfxGain.connect(this.masterGain)
      return true
    } catch {
      return false
    }
  }

  toggle(): boolean {
    this.enabled = !this.enabled
    if (this.enabled) {
      if (!this.ensureContext()) {
        this.enabled = false
        return false
      }
      this.masterGain?.gain.setTargetAtTime(0.9, this.ctx!.currentTime, 0.04)
      this.startBgm()
    } else {
      this.stopBgm()
      if (this.ctx && this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.04)
      }
    }
    return this.enabled
  }

  setMood(nextMood: Mood): void {
    this.mood = nextMood
    if (this.ctx && this.bgmNode && this.activeTrack === 'slow' && this.eggSpeed === 1) {
      const rate = this.moodRates[this.mood] ?? 1.0
      this.bgmNode.playbackRate.setTargetAtTime(rate, this.ctx.currentTime, 0.35)
    }
  }

  private startBuffer(which: 'slow' | 'orig'): void {
    if (!this.ctx || !this.bgmGain || !this.enabled) return
    const buf = which === 'orig' ? this.origBuf : this.slowBuf
    if (!buf) return
    this.stopBgm()
    const node = this.ctx.createBufferSource()
    node.buffer = buf
    node.loop = true
    const rate =
      which === 'orig'
        ? Math.max(0.75, Math.min(1.05, this.eggSpeed / 8))
        : this.eggSpeed > 1
          ? Math.min(2.8, 1 + (this.eggSpeed - 1) * 0.42)
          : (this.moodRates[this.mood] ?? 1.0)
    node.playbackRate.setValueAtTime(rate, this.ctx.currentTime)
    node.connect(this.bgmGain)
    node.start(0)
    this.bgmNode = node
    this.activeTrack = which
  }

  private startBgm(): void {
    if (!this.enabled || !this.ensureContext()) return
    if (this.eggSpeed >= 6 && this.origBuf) {
      this.startBuffer('orig')
      return
    }
    if (this.slowBuf) {
      this.startBuffer('slow')
      return
    }
    if (this.slowLoading) return

    if (window.location.protocol === 'file:' || typeof fetch !== 'function') {
      if (!this.bgmEl) {
        const el = new Audio(this.bgmSrc)
        el.loop = true
        el.volume = 0.44
        el.addEventListener('ended', () => {
          if (this.enabled) {
            el.currentTime = 0
            void el.play().catch(() => undefined)
          }
        })
        this.bgmEl = el
      }
      void this.bgmEl.play().catch(() => undefined)
      return
    }

    this.slowLoading = true
    const url = this.bgmSrc
    void fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.arrayBuffer()
      })
      .then((ab) => this.ctx!.decodeAudioData(ab))
      .then((decoded) => {
        this.slowLoading = false
        this.slowBuf = decoded
        if (this.enabled && !document.hidden) {
          this.startBuffer(this.eggSpeed >= 6 && this.origBuf ? 'orig' : 'slow')
        }
      })
      .catch(() => {
        this.slowLoading = false
      })
  }

  private stopBgm(): void {
    if (this.bgmNode) {
      try {
        this.bgmNode.stop()
        this.bgmNode.disconnect()
      } catch {
        // Ignore already stopped
      }
      this.bgmNode = null
    }
    if (this.bgmEl) {
      try {
        this.bgmEl.pause()
      } catch {
        // Ignore pause error
      }
    }
  }

  setEggSpeed(mult: number): void {
    this.eggSpeed = Math.max(1, Math.min(8, mult))
    if (!this.enabled) {
      this.toggle()
    }
    if (!this.ensureContext()) return

    if (this.eggSpeed >= 6 && this.bgmOrigSrc) {
      if (this.origBuf) {
        if (this.activeTrack === 'orig' && this.bgmNode) {
          this.bgmNode.playbackRate.setTargetAtTime(Math.max(0.75, this.eggSpeed / 8), this.ctx!.currentTime, 0.12)
        } else {
          this.startBuffer('orig')
        }
      } else if (!this.origLoading && window.location.protocol !== 'file:') {
        this.origLoading = true
        void fetch(this.bgmOrigSrc)
          .then((r) => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            return r.arrayBuffer()
          })
          .then((ab) => this.ctx!.decodeAudioData(ab))
          .then((decoded) => {
            this.origLoading = false
            this.origBuf = decoded
            if (this.enabled && this.eggSpeed >= 6) this.startBuffer('orig')
          })
          .catch(() => {
            this.origLoading = false
          })
      }
    } else {
      if (this.activeTrack === 'slow' && this.bgmNode) {
        const rate =
          this.eggSpeed > 1
            ? Math.min(2.8, 1 + (this.eggSpeed - 1) * 0.42)
            : (this.moodRates[this.mood] ?? 1.0)
        this.bgmNode.playbackRate.setTargetAtTime(rate, this.ctx!.currentTime, 0.12)
      } else if (this.slowBuf) {
        this.startBuffer('slow')
      } else {
        this.startBgm()
      }
    }
  }

  resetEggSpeed(): void {
    this.eggSpeed = 1
    if (this.enabled && this.slowBuf && this.activeTrack !== 'slow') {
      this.startBuffer('slow')
    } else if (this.ctx && this.bgmNode && this.activeTrack === 'slow') {
      this.bgmNode.playbackRate.setTargetAtTime(this.moodRates[this.mood] ?? 1.0, this.ctx.currentTime, 0.25)
    }
  }

  playCharPop(emph: boolean): void {
    if (!this.enabled || !this.ensureContext() || !this.sfxGain) return
    const nowMs = Date.now()
    if (!emph && nowMs - this.lastTickAt < 38) return
    this.lastTickAt = nowMs

    const now = this.ctx!.currentTime
    const osc = this.ctx!.createOscillator()
    const g = this.ctx!.createGain()
    osc.type = 'triangle'
    const f = emph ? 320 : 610 + Math.random() * 140
    osc.frequency.setValueAtTime(f, now)
    osc.frequency.exponentialRampToValueAtTime(f * 0.46, now + 0.02)

    g.gain.setValueAtTime(0.001, now)
    g.gain.linearRampToValueAtTime(emph ? 0.13 : 0.05, now + 0.002)
    g.gain.exponentialRampToValueAtTime(0.0005, now + 0.024)

    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(now)
    osc.stop(now + 0.028)
  }

  playExpose(): void {
    this.vibrate(10)
    if (!this.enabled || !this.ensureContext() || !this.sfxGain) return
    const now = this.ctx!.currentTime
    const osc = this.ctx!.createOscillator()
    const g = this.ctx!.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, now)
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)
    g.gain.setValueAtTime(0.001, now)
    g.gain.linearRampToValueAtTime(0.15, now + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.2)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(now)
    osc.stop(now + 0.22)
  }

  playStamp(isDirty: boolean): void {
    this.vibrate(isDirty ? [20, 26, 18] : 14)
    if (!this.enabled || !this.ensureContext() || !this.sfxGain) return
    const now = this.ctx!.currentTime
    const osc = this.ctx!.createOscillator()
    const g = this.ctx!.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(isDirty ? 160 : 225, now)
    osc.frequency.exponentialRampToValueAtTime(52, now + 0.16)
    g.gain.setValueAtTime(0.001, now)
    g.gain.linearRampToValueAtTime(0.36, now + 0.006)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(now)
    osc.stop(now + 0.22)
  }

  playAlert(): void {
    this.vibrate([18, 30, 24])
    if (!this.enabled || !this.ensureContext() || !this.sfxGain) return
    const now = this.ctx!.currentTime
    const osc = this.ctx!.createOscillator()
    const g = this.ctx!.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(112, now)
    osc.frequency.exponentialRampToValueAtTime(44, now + 0.35)
    g.gain.setValueAtTime(0.001, now)
    g.gain.linearRampToValueAtTime(0.4, now + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.42)
    osc.connect(g)
    g.connect(this.sfxGain)
    osc.start(now)
    osc.stop(now + 0.45)
  }
}

export const audioEngine = new AudioEngine()
