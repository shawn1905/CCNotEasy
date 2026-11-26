/* ==========================================================================
   《曹操不容易》 // Audio & Haptics Engine
   - BGM: 8x-slowed (Paulstretch) pastoral wheatfield pop ambient (./bgm.mp3)
          with seamless Web Audio warm pad fallback if offline/missing
   - SFX: Crisp organic Foley (bamboo-slip char pop, wood clack, parchment flip,
          low bronze war drum)
   - Haptics: Tactile mobile vibration via navigator.vibrate
   ========================================================================== */

(function (global) {
  "use strict";

  let ctx = null;
  let masterGain = null;
  let bgmGain = null;
  let sfxGain = null;
  let noiseBuffer = null;

  // HTML5 Audio element for the chapter BGM loop
  let bgmSrc = "./bgm-red-cliffs.mp3";
  let bgmMoodRates = { calm: 1.0, tense: 0.94, fire: 0.88 };
  let bgmAudioEl = null;
  let bgmMediaSource = null;
  let bgmFallbackNodes = null;
  let bgmUsingFallback = false;
  let bgmLoadAttempted = false;

  let enabled = false;      // Master audio state (starts off until user gesture / toggle)
  let bgmEnabled = true;    // Ambient BGM flag when master is enabled
  let hapticsEnabled = true;
  let currentMood = "calm";
  let lastCharTickAt = 0;

  /* ------------------------------------------------------------------------
     Haptics Helper (Mobile Tactile Feedback)
     ------------------------------------------------------------------------ */

  function vibrate(pattern) {
    if (!hapticsEnabled) return;
    try {
      if (global.navigator && typeof global.navigator.vibrate === "function") {
        global.navigator.vibrate(pattern);
      }
    } catch (e) {
      // Ignore unsupported or blocked vibrate calls
    }
  }

  function setHapticsEnabled(flag) {
    hapticsEnabled = Boolean(flag);
    return hapticsEnabled;
  }

  function isHapticsEnabled() {
    return hapticsEnabled;
  }

  /* ------------------------------------------------------------------------
     Web Audio Context & Shared Noise Buffer
     ------------------------------------------------------------------------ */

  function ensureContext() {
    if (ctx) {
      if (ctx.state === "suspended") {
        ctx.resume().catch(function () {});
      }
      return true;
    }
    const AudioCtx = global.AudioContext || global.webkitAudioContext;
    if (!AudioCtx) return false;

    try {
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = enabled ? 0.9 : 0.0;
      masterGain.connect(ctx.destination);

      bgmGain = ctx.createGain();
      bgmGain.gain.value = 0.42;
      bgmGain.connect(masterGain);

      sfxGain = ctx.createGain();
      sfxGain.gain.value = 0.72;
      sfxGain.connect(masterGain);

      // Short filtered white-noise buffer for organic tactile clicks
      const len = Math.floor(ctx.sampleRate * 0.12);
      noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  /* ------------------------------------------------------------------------
     BGM: 8x-Slowed Wheatfield Ambient (./bgm.mp3) + Warm Pad Fallback
     ------------------------------------------------------------------------ */

  function startFallbackPad() {
    if (!ctx || !bgmGain || bgmFallbackNodes) return;
    // Ultra-warm Dmaj7 slow-motion drone pad if bgm.mp3 cannot load
    const freqs = [146.83, 220.0, 277.18, 369.99]; // D3, A3, C#4, F#4
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 620;

    const padGain = ctx.createGain();
    padGain.gain.setValueAtTime(0.001, ctx.currentTime);
    padGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 2.0);

    filter.connect(padGain);
    padGain.connect(bgmGain);

    const oscs = freqs.map(function (f, i) {
      const osc = ctx.createOscillator();
      osc.type = i === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      osc.detune.value = (i - 1.5) * 4;
      osc.connect(filter);
      osc.start();
      return osc;
    });

    bgmFallbackNodes = { oscs: oscs, gain: padGain, filter: filter };
  }

  function stopFallbackPad() {
    if (!bgmFallbackNodes) return;
    try {
      const now = ctx ? ctx.currentTime : 0;
      bgmFallbackNodes.gain.gain.cancelScheduledValues(now);
      bgmFallbackNodes.gain.gain.setTargetAtTime(0.0001, now, 0.2);
      const old = bgmFallbackNodes;
      setTimeout(function () {
        old.oscs.forEach(function (o) {
          try { o.stop(); } catch (e) {}
        });
      }, 600);
    } catch (e) {}
    bgmFallbackNodes = null;
  }

  function setBgmConfig(cfg) {
    if (!cfg || typeof cfg !== "object") return;
    if (cfg.src && cfg.src !== bgmSrc) {
      bgmSrc = cfg.src;
      if (bgmAudioEl) {
        const wasPlaying = !bgmAudioEl.paused;
        bgmAudioEl.src = bgmSrc;
        bgmUsingFallback = false;
        if (wasPlaying && enabled && bgmEnabled) {
          bgmAudioEl.play().catch(function () {});
        }
      }
    }
    if (cfg.moodRates && typeof cfg.moodRates === "object") {
      bgmMoodRates = Object.assign({}, bgmMoodRates, cfg.moodRates);
      updateBgmMoodGain();
    }
  }

  function initBgmElement() {
    if (bgmAudioEl) return;
    bgmLoadAttempted = true;
    try {
      const el = new Audio(bgmSrc);
      el.loop = true;
      el.preload = "auto";
      el.volume = 0.42;
      el.addEventListener("error", function () {
        bgmUsingFallback = true;
        if (enabled && bgmEnabled && ensureContext()) {
          startFallbackPad();
        }
      });
      bgmAudioEl = el;

      // Route through Web Audio if same-origin allows it; otherwise play directly via <audio>
      if (ctx && !bgmMediaSource && global.location && global.location.protocol !== "file:") {
        try {
          bgmMediaSource = ctx.createMediaElementSource(el);
          bgmMediaSource.connect(bgmGain);
          el.volume = 1.0;
        } catch (e) {
          bgmMediaSource = null;
        }
      }
    } catch (e) {
      bgmUsingFallback = true;
    }
  }

  function startBgmLoop() {
    if (!enabled || !bgmEnabled) return;
    if (!bgmLoadAttempted) initBgmElement();

    if (bgmUsingFallback) {
      if (ensureContext()) startFallbackPad();
      return;
    }

    if (bgmAudioEl) {
      updateBgmMoodGain();
      const p = bgmAudioEl.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () {
          // If blocked or missing, fall back smoothly
          if (bgmAudioEl.error) {
            bgmUsingFallback = true;
            if (ensureContext()) startFallbackPad();
          }
        });
      }
    }
  }

  function stopBgmLoop() {
    if (bgmAudioEl) {
      try { bgmAudioEl.pause(); } catch (e) {}
    }
    stopFallbackPad();
  }

  function updateBgmMoodGain() {
    const targetRate = (bgmMoodRates && bgmMoodRates[currentMood]) || 1.0;
    const targetVol = currentMood === "fire" ? 0.36 : 0.44;
    if (bgmAudioEl) {
      try {
        bgmAudioEl.playbackRate = targetRate;
        if (!bgmMediaSource) bgmAudioEl.volume = targetVol;
      } catch (e) {}
    }
    if (ctx && bgmGain) {
      const now = ctx.currentTime;
      bgmGain.gain.setTargetAtTime(targetVol, now, 0.35);
    }
  }

  function setEnabled(nextState) {
    enabled = Boolean(nextState);
    if (enabled) {
      if (!ensureContext()) {
        enabled = false;
        return false;
      }
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(0.9, now, 0.04);
      if (bgmEnabled) startBgmLoop();
    } else {
      stopBgmLoop();
      if (ctx && masterGain) {
        const now = ctx.currentTime;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setTargetAtTime(0.0, now, 0.04);
      }
    }
    return enabled;
  }

  function toggle() {
    return setEnabled(!enabled);
  }

  function setBgmEnabled(flag) {
    bgmEnabled = Boolean(flag);
    if (enabled && bgmEnabled) {
      startBgmLoop();
    } else {
      stopBgmLoop();
    }
    return bgmEnabled;
  }

  function setMood(mood) {
    currentMood = mood || "calm";
    updateBgmMoodGain();
  }

  /* ------------------------------------------------------------------------
     SFX: Crisp Tactile Bamboo-Slip, Quill Pop & Bronze Drum
     ------------------------------------------------------------------------ */

  // Ultra-subtle mechanical-quill / bamboo-slip micro-tick during typewriter pop-in
  function playCharPop(isEmph) {
    if (!enabled || !ensureContext()) return;
    const nowMs = Date.now();
    if (!isEmph && nowMs - lastCharTickAt < 38) return;
    lastCharTickAt = nowMs;

    const now = ctx.currentTime;

    // 1. Short organic woody transient
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    const baseFreq = isEmph ? 310 : (620 + Math.random() * 140);
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.48, now + 0.018);

    const peak = isEmph ? 0.14 : 0.055;
    gain.gain.setValueAtTime(0.0005, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + (isEmph ? 0.032 : 0.02));

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.036);

    // 2. Tiny brushed-paper noise click
    if (noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(isEmph ? 1400 : 2400 + Math.random() * 500, now);
      bp.Q.value = 2.2;

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.0005, now);
      nGain.gain.linearRampToValueAtTime(isEmph ? 0.09 : 0.04, now + 0.0015);
      nGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.014);

      src.connect(bp);
      bp.connect(nGain);
      nGain.connect(sfxGain);
      src.start(now);
      src.stop(now + 0.018);
    }
  }

  function playTick() {
    vibrate(6);
    if (!enabled || !ensureContext()) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(480 + Math.random() * 55, now);
    osc.frequency.exponentialRampToValueAtTime(195, now + 0.03);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1050, now);
    filter.Q.value = 1.5;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.036);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(sfxGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  function playChoice() {
    vibrate(14);
    if (!enabled || !ensureContext()) return;
    const now = ctx.currentTime;

    // Crisp wooden seal stamp clack
    const clack = ctx.createOscillator();
    const clackGain = ctx.createGain();
    clack.type = "triangle";
    clack.frequency.setValueAtTime(240, now);
    clack.frequency.exponentialRampToValueAtTime(88, now + 0.065);

    clackGain.gain.setValueAtTime(0.001, now);
    clackGain.gain.linearRampToValueAtTime(0.28, now + 0.005);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);

    clack.connect(clackGain);
    clackGain.connect(sfxGain);
    clack.start(now);
    clack.stop(now + 0.09);

    // Warm resonant D3 tail
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    chime.type = "sine";
    chime.frequency.setValueAtTime(293.66, now + 0.012);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(860, now);

    chimeGain.gain.setValueAtTime(0.001, now + 0.012);
    chimeGain.gain.linearRampToValueAtTime(0.11, now + 0.028);
    chimeGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.3);

    chime.connect(filter);
    filter.connect(chimeGain);
    chimeGain.connect(sfxGain);
    chime.start(now + 0.012);
    chime.stop(now + 0.32);
  }

  function playGloss() {
    vibrate(8);
    if (!enabled || !ensureContext()) return;
    const now = ctx.currentTime;

    const freqs = [587.33, 739.99]; // D5, F#5 warm shimmer
    const freq = freqs[Math.floor(Math.random() * freqs.length)];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.22);

    osc.connect(gain);
    gain.connect(sfxGain);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  function playAlert() {
    vibrate([18, 28, 22]);
    if (!enabled || !ensureContext()) return;
    const now = ctx.currentTime;

    // Low bronze war drum thud
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "sine";
    body.frequency.setValueAtTime(115, now);
    body.frequency.exponentialRampToValueAtTime(44, now + 0.36);

    bodyGain.gain.setValueAtTime(0.001, now);
    bodyGain.gain.linearRampToValueAtTime(0.42, now + 0.01);
    bodyGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.46);

    body.connect(bodyGain);
    bodyGain.connect(sfxGain);
    body.start(now);
    body.stop(now + 0.48);

    // Warm metallic overtone
    const rim = ctx.createOscillator();
    const rimGain = ctx.createGain();
    const rimFilter = ctx.createBiquadFilter();
    rim.type = "triangle";
    rim.frequency.setValueAtTime(185, now);
    rim.frequency.exponentialRampToValueAtTime(146.83, now + 0.28);

    rimFilter.type = "lowpass";
    rimFilter.frequency.setValueAtTime(520, now);

    rimGain.gain.setValueAtTime(0.001, now);
    rimGain.gain.linearRampToValueAtTime(0.14, now + 0.015);
    rimGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.36);

    rim.connect(rimFilter);
    rimFilter.connect(rimGain);
    rimGain.connect(sfxGain);
    rim.start(now);
    rim.stop(now + 0.38);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      stopBgmLoop();
    } else if (enabled && bgmEnabled) {
      startBgmLoop();
    }
  });

  global.CC_AUDIO = {
    isEnabled: function () { return enabled; },
    isBgmEnabled: function () { return bgmEnabled; },
    isHapticsEnabled: isHapticsEnabled,
    setEnabled: setEnabled,
    toggle: toggle,
    setBgmEnabled: setBgmEnabled,
    setHapticsEnabled: setHapticsEnabled,
    setBgmConfig: setBgmConfig,
    setMood: setMood,
    vibrate: vibrate,
    playCharPop: playCharPop,
    playTick: playTick,
    playChoice: playChoice,
    playGloss: playGloss,
    playAlert: playAlert
  };
})(window);
