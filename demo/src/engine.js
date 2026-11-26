/* ==========================================================================
   《曹操不容易》 // 赤壁前夜 Mobile Narrative Engine
   Zero-dependency, file://-safe, 60fps single-thumb Lifeline engine
   ========================================================================== */

(function (global) {
  "use strict";

  const STORAGE_KEY = "ccnoteasy_redcliffs_v1";

  const RES_META = [
    { key: "coin", label: "钱帛", aliases: ["coin", "money", "gold", "qian", "qianbo", "钱帛"] },
    { key: "grain", label: "粮草", aliases: ["grain", "food", "liang", "liangcao", "粮草"] },
    { key: "troops", label: "兵力", aliases: ["troops", "army", "bing", "bingli", "兵力"] }
  ];

  const ALIAS_TO_RES = {};
  RES_META.forEach(function (r) {
    r.aliases.forEach(function (a) { ALIAS_TO_RES[a] = r.key; });
  });

  function mapResourceKey(k) {
    return ALIAS_TO_RES[k] || null;
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function clone(obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      return {};
    }
  }

  function toMap(collection, idKey) {
    const out = {};
    if (!collection) return out;
    if (Array.isArray(collection)) {
      collection.forEach(function (item, idx) {
        if (!item) return;
        const k = item[idKey || "id"] || ("item_" + idx);
        out[k] = item;
      });
      return out;
    }
    return collection;
  }

  /* ========================================================================
     Ember & River-Mist Canvas Layer (Lightweight, Reduced-Motion Safe)
     ======================================================================== */

  function createAtmosphereCanvas(canvas) {
    if (!canvas || !canvas.getContext) {
      return { setMood: function () {}, start: function () {}, stop: function () {} };
    }
    const reduced = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      return { setMood: function () {}, start: function () {}, stop: function () {} };
    }

    const ctx = canvas.getContext("2d");
    let mood = "calm";
    let particles = [];
    let rafId = null;
    let width = 0;
    let height = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(global.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnParticle(randomY) {
      const isFire = mood === "fire";
      const isTense = mood === "tense";
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : (isFire || isTense ? height + 8 : Math.random() * height),
        vx: (Math.random() - 0.5) * (isFire ? 0.55 : 0.28),
        vy: isFire ? -(0.45 + Math.random() * 0.95) : (isTense ? -(0.22 + Math.random() * 0.45) : -(0.08 + Math.random() * 0.16)),
        size: isFire ? (1.5 + Math.random() * 2.0) : (1.2 + Math.random() * 1.4),
        alpha: 0.15 + Math.random() * (isFire ? 0.55 : 0.25),
        life: Math.random() * Math.PI * 2
      };
    }

    function syncCount() {
      const target = mood === "fire" ? 26 : (mood === "tense" ? 16 : 10);
      while (particles.length < target) particles.push(spawnParticle(true));
      if (particles.length > target) particles.length = target;
    }

    function tick() {
      if (document.hidden) {
        rafId = null;
        return;
      }
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.life += 0.025;
        p.x += p.vx + Math.sin(p.life) * 0.18;
        p.y += p.vy;

        if (p.y < -12 || p.x < -12 || p.x > width + 12) {
          particles[i] = spawnParticle(false);
          continue;
        }

        const flicker = 0.72 + 0.28 * Math.sin(p.life * 2.2);
        const a = Math.max(0, Math.min(1, p.alpha * flicker));

        if (mood === "fire") {
          ctx.fillStyle = (i % 3 === 0)
            ? ("rgba(247, 118, 142, " + a.toFixed(3) + ")")
            : ("rgba(255, 158, 100, " + a.toFixed(3) + ")");
        } else if (mood === "tense") {
          ctx.fillStyle = "rgba(224, 175, 104, " + (a * 0.7).toFixed(3) + ")";
        } else if (mood === "cold") {
          ctx.fillStyle = "rgba(68, 157, 171, " + (a * 0.55).toFixed(3) + ")";
        } else {
          ctx.fillStyle = "rgba(122, 162, 247, " + (a * 0.42).toFixed(3) + ")";
        }

        // Crisp 2px square ember/mist pixels (Omarchy geometric aesthetic)
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }

      rafId = global.requestAnimationFrame(tick);
    }

    resize();
    syncCount();
    global.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && !rafId) {
        rafId = global.requestAnimationFrame(tick);
      }
    });

    return {
      setMood: function (nextMood) {
        mood = nextMood || "calm";
        syncCount();
      },
      start: function () {
        if (!rafId) rafId = global.requestAnimationFrame(tick);
      },
      stop: function () {
        if (rafId) {
          global.cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }

  /* ========================================================================
     Main Engine
     ======================================================================== */

  function initEngine() {
    const STORY = global.CC_STORY;
    const AUDIO = global.CC_AUDIO || {
      isEnabled: function () { return false; },
      isBgmEnabled: function () { return false; },
      isHapticsEnabled: function () { return false; },
      setEnabled: function () { return false; },
      toggle: function () { return false; },
      setBgmEnabled: function () { return false; },
      setHapticsEnabled: function () { return false; },
      setMood: function () {},
      vibrate: function () {},
      playCharPop: function () {},
      playTick: function () {},
      playChoice: function () {},
      playGloss: function () {},
      playAlert: function () {}
    };

    if (!STORY) {
      const errEl = document.getElementById("chat-stream");
      if (errEl) {
        errEl.innerHTML = '<div class="settlement-strip is-neg"><span class="settlement-badge">ERR</span><span class="settlement-reason">未加载剧本数据 (window.CC_STORY)</span></div>';
      }
      return;
    }

    // Normalize story tables
    const glossMap = toMap(STORY.gloss, "id");
    const subtextMap = toMap(STORY.subtexts, "id");
    const nodesMap = toMap(STORY.nodes, "id");
    const endingsMap = toMap(STORY.endings, "id");
    const chapters = Array.isArray(STORY.chapters) ? STORY.chapters : [];

    // Parse initial resources
    function parseInitialResources() {
      const raw = STORY.initialResources || { coin: 6, grain: 6, troops: 6 };
      const res = { coin: 5, grain: 5, troops: 5 };
      const maxRes = { coin: 10, grain: 10, troops: 10 };

      Object.keys(raw).forEach(function (k) {
        const canon = mapResourceKey(k);
        if (!canon) return;
        const v = raw[k];
        if (typeof v === "number") {
          res[canon] = v;
          maxRes[canon] = Math.max(10, v);
        } else if (v && typeof v === "object") {
          res[canon] = typeof v.value === "number" ? v.value : (typeof v.initial === "number" ? v.initial : 5);
          maxRes[canon] = typeof v.max === "number" ? v.max : Math.max(10, res[canon]);
        }
      });
      return { values: res, max: maxRes };
    }

    const resConfig = parseInitialResources();

    // DOM references
    const elApp = document.getElementById("app-shell");
    const elSplash = document.getElementById("splash-screen");
    const elSplashTitle = document.getElementById("splash-title");
    const elSplashSubtitle = document.getElementById("splash-subtitle");
    const elSplashTagline = document.getElementById("splash-tagline");
    const elSplashEra = document.getElementById("splash-era");
    const elBtnStart = document.getElementById("btn-start");
    const elBtnResume = document.getElementById("btn-resume");
    const elSplashAudio = document.getElementById("btn-splash-audio");

    const elStream = document.getElementById("chat-stream");
    const elBottomDock = document.getElementById("bottom-dock");
    const elTapPrompt = document.getElementById("tap-prompt");
    const elTapRemaining = document.getElementById("tap-remaining");
    const elChoiceDeck = document.getElementById("choice-deck");

    const elChapterAct = document.getElementById("chapter-act");
    const elChapterTitle = document.getElementById("chapter-title");
    const elChapterStep = document.getElementById("chapter-step");
    const elChapterProgress = document.getElementById("chapter-progress-fill");

    const elBtnAudio = document.getElementById("btn-audio");
    const elBtnDrawer = document.getElementById("btn-drawer");

    const elModalBackdrop = document.getElementById("modal-backdrop");
    const elPopoverSheet = document.getElementById("popover-sheet");

    const elDrawerBackdrop = document.getElementById("drawer-backdrop");
    const elDrawerBody = document.getElementById("drawer-body");
    const elDrawerTabs = document.querySelectorAll(".drawer-tab");
    const elBtnDrawerClose = document.getElementById("btn-drawer-close");

    const atmosphere = createAtmosphereCanvas(document.getElementById("ember-canvas"));
    atmosphere.start();

    // Runtime state
    let state = createFreshState();
    let pendingQueue = [];     // Queued items to reveal on tap ({ kind: 'bubble' | 'war_section' | 'callback', data })
    let awaitingWidget = false;
    let awaitingChoice = false;
    let activeDrawerTab = "gloss";
    let autoTimer = null;
    let currentWarBody = null;
    let activeTypewriter = null;

    function createFreshState() {
      return {
        nodeId: STORY.startNode || Object.keys(nodesMap)[0] || "",
        chapterId: chapters[0] ? (chapters[0].id || 0) : null,
        mood: "calm",
        resources: clone(resConfig.values),
        vars: clone(STORY.initialVars || {}),
        fakeTroopBadge: false,
        unlockedGlosses: [],
        decodedSubtexts: [],
        discoveredEndings: loadDiscoveredEndings(),
        chapterSnapshots: {},
        settings: {
          showSourceTags: true,
          autoPace: false,
          typewriter: true,
          haptics: true
        },
        finished: false,
        endingId: null
      };
    }

    function loadDiscoveredEndings() {
      try {
        const saved = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || "null");
        return (saved && Array.isArray(saved.discoveredEndings)) ? saved.discoveredEndings : [];
      } catch (e) {
        return [];
      }
    }

    function saveState() {
      try {
        const payload = {
          nodeId: state.nodeId,
          chapterId: state.chapterId,
          mood: state.mood,
          resources: state.resources,
          vars: state.vars,
          fakeTroopBadge: state.fakeTroopBadge,
          unlockedGlosses: state.unlockedGlosses,
          decodedSubtexts: state.decodedSubtexts,
          discoveredEndings: state.discoveredEndings,
          chapterSnapshots: state.chapterSnapshots,
          settings: state.settings,
          finished: state.finished,
          endingId: state.endingId,
          savedAt: Date.now()
        };
        global.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        // Ignore storage quota / private mode errors
      }
    }

    function loadSavedState() {
      try {
        const raw = global.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || !parsed.nodeId) return null;
        return parsed;
      } catch (e) {
        return null;
      }
    }

    /* ======================================================================
       Condition Evaluator
       ====================================================================== */

    function getVarValue(name) {
      if (Object.prototype.hasOwnProperty.call(state.vars, name)) {
        return state.vars[name];
      }
      const resKey = mapResourceKey(name);
      if (resKey && Object.prototype.hasOwnProperty.call(state.resources, resKey)) {
        return state.resources[resKey];
      }
      return undefined;
    }

    function evalSingleCondition(c) {
      if (!c || typeof c !== "object") return true;
      const key = c.var || c.key || c.variable;
      if (!key) return true;
      const actual = getVarValue(key);
      const op = c.op || "==";
      const expected = Object.prototype.hasOwnProperty.call(c, "val") ? c.val : c.value;

      switch (op) {
        case "==":
        case "===":
          return actual == expected;
        case "!=":
        case "!==":
          return actual != expected;
        case ">=":
          return Number(actual) >= Number(expected);
        case "<=":
          return Number(actual) <= Number(expected);
        case ">":
          return Number(actual) > Number(expected);
        case "<":
          return Number(actual) < Number(expected);
        default:
          return actual == expected;
      }
    }

    function evalCondition(cond) {
      if (cond == null) return true;
      if (Array.isArray(cond)) {
        return cond.every(evalSingleCondition);
      }
      if (typeof cond === "object") {
        return evalSingleCondition(cond);
      }
      return Boolean(cond);
    }

    function resolveNext(nextSpec) {
      if (!nextSpec) return null;
      if (typeof nextSpec === "string") return nextSpec;
      if (Array.isArray(nextSpec)) {
        for (let i = 0; i < nextSpec.length; i++) {
          const r = nextSpec[i];
          if (evalCondition(r.when || r.condition || r.if)) {
            return r.next || r.ending || r.endingId || r.target || null;
          }
        }
      }
      return null;
    }

    /* ======================================================================
       HUD, Mood & Chapter Progress
       ====================================================================== */

    function setMood(mood) {
      if (!mood) return;
      state.mood = mood;
      elApp.setAttribute("data-mood", mood);
      atmosphere.setMood(mood);
      AUDIO.setMood(mood);
    }

    function renderHud(deltas) {
      RES_META.forEach(function (meta) {
        const gauge = document.querySelector('.res-gauge[data-res="' + meta.key + '"]');
        if (!gauge) return;
        const val = state.resources[meta.key];
        const max = resConfig.max[meta.key] || 10;

        const valEl = gauge.querySelector(".res-val");
        if (valEl) valEl.textContent = String(val);

        gauge.classList.toggle("is-low", val <= 2);
        gauge.classList.toggle("is-warn", val === 3);

        // Mini segment bar (8 crisp segments)
        const segsWrap = gauge.querySelector(".res-segs");
        if (segsWrap) {
          const totalSegs = 8;
          const filled = Math.max(0, Math.min(totalSegs, Math.round((val / max) * totalSegs)));
          let html = "";
          for (let i = 0; i < totalSegs; i++) {
            html += '<span class="res-seg' + (i < filled ? " filled" : "") + '"></span>';
          }
          segsWrap.innerHTML = html;
        }

        // Fake troop badge
        if (meta.key === "troops") {
          let badge = gauge.querySelector(".fake-troop-badge");
          if (state.fakeTroopBadge) {
            if (!badge) {
              badge = document.createElement("span");
              badge.className = "fake-troop-badge";
              badge.textContent = "号八十万";
              gauge.appendChild(badge);
            }
          } else if (badge && !badge.classList.contains("shattering")) {
            badge.remove();
          }
        }

        // Floating delta popup
        if (deltas && Object.prototype.hasOwnProperty.call(deltas, meta.key)) {
          const d = deltas[meta.key];
          const pop = document.createElement("span");
          let cls = "delta-pop ";
          let txt = "";
          if (typeof d === "string") {
            cls += "zero";
            txt = d;
          } else if (d < 0) {
            cls += "neg";
            txt = String(d);
          } else if (d > 0) {
            cls += "pos";
            txt = "+" + d;
          } else {
            cls += "zero";
            txt = "+0 虚数";
          }
          pop.className = cls;
          pop.textContent = txt;
          gauge.appendChild(pop);
          setTimeout(function () { pop.remove(); }, 1400);
        }
      });
    }

    function shatterFakeTroopBadge() {
      if (!state.fakeTroopBadge) return;
      state.fakeTroopBadge = false;
      const badge = document.querySelector('.res-gauge[data-res="troops"] .fake-troop-badge');
      if (badge) {
        badge.classList.add("shattering");
        setTimeout(function () { badge.remove(); }, 500);
      }
    }

    function updateChapterStrip(chapterRef, showDivider) {
      if (!chapters.length) return;
      const refStr = typeof chapterRef === "string" ? chapterRef : "";
      let idx = chapters.findIndex(function (c) {
        if (c.id === chapterRef || c.id === state.nodeId) return true;
        if (c.code === chapterRef || c.num === chapterRef || c.index === chapterRef) return true;
        if (refStr && c.num && refStr.indexOf(c.num) === 0) return true;
        if (refStr && c.title && refStr.indexOf(c.title) >= 0) return true;
        return false;
      });
      if (idx < 0) return;
      const ch = chapters[idx];
      const changed = state.chapterId !== ch.id;
      state.chapterId = ch.id;

      // Save chapter snapshot for 跳拍重选 (only on chapter entry)
      if (changed || !state.chapterSnapshots[ch.id]) {
        state.chapterSnapshots[ch.id] = {
          nodeId: ch.startNode || ch.nodeId || ch.id || state.nodeId,
          resources: clone(state.resources),
          vars: clone(state.vars),
          fakeTroopBadge: state.fakeTroopBadge
        };
      }

      const actLabel = ch.num || ch.act || ch.code || ("第" + (idx + 1) + "节");
      if (elChapterAct) elChapterAct.textContent = actLabel;
      if (elChapterTitle) elChapterTitle.textContent = ch.title || "";
      if (elChapterStep) elChapterStep.textContent = (idx + 1) + "/" + chapters.length;
      if (elChapterProgress) {
        const pct = Math.round(((idx + 1) / chapters.length) * 100);
        elChapterProgress.style.width = pct + "%";
      }

      if (ch.mood) setMood(ch.mood);

      if (showDivider && changed) {
        const div = document.createElement("div");
        div.className = "chapter-divider";
        div.innerHTML = "<span>" + escapeHtml(actLabel + (ch.title ? " · " + ch.title : "")) + "</span>";
        elStream.appendChild(div);
      }
    }

    function applyVars(varsObj) {
      if (!varsObj || typeof varsObj !== "object") return;
      Object.keys(varsObj).forEach(function (k) {
        const v = varsObj[k];
        if (typeof v === "string" && /^[+-]\d+$/.test(v.trim())) {
          const cur = Number(state.vars[k] || 0);
          state.vars[k] = cur + parseInt(v, 10);
        } else if (v && typeof v === "object" && typeof v.add === "number") {
          state.vars[k] = Number(state.vars[k] || 0) + v.add;
        } else if (typeof v === "number" && typeof state.vars[k] === "number") {
          // Story vars in initialVars are numeric counters (e.g. haste, clues_found, rhetoric_bluff)
          state.vars[k] = state.vars[k] + v;
        } else {
          state.vars[k] = v;
        }
      });

      if (
        state.vars.fakeTroopBadge === true ||
        state.vars.hid_plague === true ||
        state.vars.hide_plague === true ||
        state.vars.fake_troops === true
      ) {
        state.fakeTroopBadge = true;
      }
    }

    function applyEffects(effects, varsObj, reasonText, containerEl, fakeTroopBadgeLabel) {
      const deltas = {};
      let hasNonZeroDelta = false;
      const summaryParts = [];

      if (varsObj) applyVars(varsObj);

      const finalReason = reasonText || (effects && (effects.reason || effects.settlement)) || "";

      if (effects && typeof effects === "object") {
        if (effects.vars) applyVars(effects.vars);
        if (typeof effects.fakeTroopBadge === "boolean") {
          if (effects.fakeTroopBadge) state.fakeTroopBadge = true;
          else shatterFakeTroopBadge();
        }
        if (effects.shatterFakeTroop) shatterFakeTroopBadge();

        const resSource = effects.resources || effects.res || effects;
        Object.keys(resSource).forEach(function (k) {
          const canon = mapResourceKey(k);
          if (!canon) return;
          const delta = resSource[k];
          if (typeof delta !== "number" || delta === 0) return;

          const prev = state.resources[canon];
          const max = resConfig.max[canon] || 10;
          state.resources[canon] = Math.max(0, Math.min(max, prev + delta));
          deltas[canon] = delta;
          hasNonZeroDelta = true;

          const meta = RES_META.find(function (m) { return m.key === canon; });
          const sign = delta > 0 ? "+" + delta : String(delta);
          summaryParts.push((meta ? meta.label : canon) + " " + sign);
        });
      }

      // Detect illusory troop preservation (e.g. hiding plague to keep "八十万" on paper)
      const isFakeTroopMove = Boolean(
        fakeTroopBadgeLabel ||
        (finalReason && (finalReason.indexOf("压下疫报") >= 0 || finalReason.indexOf("虚保八十万") >= 0 || finalReason.indexOf("虚数") >= 0))
      );
      if (isFakeTroopMove) {
        state.fakeTroopBadge = true;
        if (!hasNonZeroDelta) {
          deltas.troops = "+0 虚数";
          summaryParts.push(typeof fakeTroopBadgeLabel === "string" ? ("兵力 " + fakeTroopBadgeLabel) : "兵力 +0 虚数");
        }
      }

      if (hasNonZeroDelta || isFakeTroopMove) {
        renderHud(deltas);
      } else {
        renderHud(null);
      }

      if (hasNonZeroDelta || finalReason) {
        renderSettlementStrip(summaryParts, finalReason, deltas, containerEl || elStream);
      }

      saveState();
    }

    function renderSettlementStrip(summaryParts, reason, deltas, parentEl) {
      const strip = document.createElement("div");
      let polarity = "";
      let sum = 0;
      let hasZero = false;
      Object.keys(deltas || {}).forEach(function (k) {
        if (deltas[k] === 0 || typeof deltas[k] === "string") hasZero = true;
        else sum += Number(deltas[k]) || 0;
      });
      if (sum < 0) polarity = "is-neg";
      else if (sum > 0) polarity = "is-pos";
      else if (hasZero) polarity = "is-zero";

      strip.className = "settlement-strip " + polarity;
      const badgeText = summaryParts.length ? summaryParts.join(" · ") : "结算";
      strip.innerHTML =
        '<span class="settlement-badge">' + escapeHtml(badgeText) + "</span>" +
        '<span class="settlement-reason">' + escapeHtml(reason || "") + "</span>";
      parentEl.appendChild(strip);
      scrollToBottom();
    }

    /* ======================================================================
       Inline Rich Text Renderer ({{gloss:id}} & {{subtext:id}})
       ====================================================================== */

    function formatPlainSegment(str) {
      return escapeHtml(str).replace(/\*\*([^*\n]+)\*\*/g, '<strong class="inline-bold">$1</strong>');
    }

    function renderRichText(rawText) {
      const text = String(rawText == null ? "" : rawText);
      const tokenRe = /\{\{(gloss|subtext):([^}|]+)(?:\|([^}]+))?\}\}/g;

      let result = "";
      let lastIndex = 0;
      let match;

      while ((match = tokenRe.exec(text)) !== null) {
        let before = text.slice(lastIndex, match.index);
        const kind = match[1];
        const id = match[2].trim();
        const explicitLabel = match[3] ? match[3].trim() : null;

        if (kind === "gloss") {
          const entry = glossMap[id];
          const term = explicitLabel || (entry && entry.term) || id;
          let wrapped = false;

          // Smart deduplication: if text right before {{gloss:id}} already ends with term or 「term」
          if (!explicitLabel && term) {
            const quoted1 = "「" + term + "」";
            const quoted2 = "“" + term + "”";
            if (before.endsWith(quoted1)) {
              before = before.slice(0, -quoted1.length);
              result += formatPlainSegment(before) +
                '「<button type="button" class="inline-gloss" data-gloss="' + escapeHtml(id) + '">' +
                escapeHtml(term) + '<span class="inline-sup">注</span></button>」';
              wrapped = true;
            } else if (before.endsWith(quoted2)) {
              before = before.slice(0, -quoted2.length);
              result += formatPlainSegment(before) +
                '“<button type="button" class="inline-gloss" data-gloss="' + escapeHtml(id) + '">' +
                escapeHtml(term) + '<span class="inline-sup">注</span></button>”';
              wrapped = true;
            } else if (before.endsWith(term)) {
              before = before.slice(0, -term.length);
              result += formatPlainSegment(before) +
                '<button type="button" class="inline-gloss" data-gloss="' + escapeHtml(id) + '">' +
                escapeHtml(term) + '<span class="inline-sup">注</span></button>';
              wrapped = true;
            }
          }

          if (!wrapped) {
            result += formatPlainSegment(before) +
              '<button type="button" class="inline-gloss" data-gloss="' + escapeHtml(id) + '">' +
              escapeHtml(term) + '<span class="inline-sup">注</span></button>';
          }
        } else {
          const entry = subtextMap[id];
          const surface = explicitLabel || (entry && (entry.surface || entry.phrase || entry.term || entry.text)) || id;
          const decoded = state.decodedSubtexts.indexOf(id) >= 0;
          const cls = "inline-subtext" + (decoded ? " is-decoded" : "");
          let wrapped = false;

          if (!explicitLabel && surface) {
            const quoted1 = "「" + surface + "」";
            const quoted2 = "“" + surface + "”";
            if (before.endsWith(quoted1)) {
              before = before.slice(0, -quoted1.length);
              result += formatPlainSegment(before) +
                '「<button type="button" class="' + cls + '" data-subtext="' + escapeHtml(id) + '">' +
                escapeHtml(surface) + '<span class="inline-sup">译</span></button>」';
              wrapped = true;
            } else if (before.endsWith(quoted2)) {
              before = before.slice(0, -quoted2.length);
              result += formatPlainSegment(before) +
                '“<button type="button" class="' + cls + '" data-subtext="' + escapeHtml(id) + '">' +
                escapeHtml(surface) + '<span class="inline-sup">译</span></button>”';
              wrapped = true;
            } else if (before.endsWith(surface)) {
              before = before.slice(0, -surface.length);
              result += formatPlainSegment(before) +
                '<button type="button" class="' + cls + '" data-subtext="' + escapeHtml(id) + '">' +
                escapeHtml(surface) + '<span class="inline-sup">译</span></button>';
              wrapped = true;
            }
          }

          if (!wrapped) {
            result += formatPlainSegment(before) +
              '<button type="button" class="' + cls + '" data-subtext="' + escapeHtml(id) + '">' +
              escapeHtml(surface) + '<span class="inline-sup">译</span></button>';
          }
        }

        lastIndex = tokenRe.lastIndex;
      }

      result += formatPlainSegment(text.slice(lastIndex));
      return result;
    }

    /* ======================================================================
       Popovers: Gloss & Subtext Decoder
       ====================================================================== */

    function openGlossPopover(id) {
      const entry = glossMap[id];
      if (!entry) return;
      AUDIO.playGloss();

      if (state.unlockedGlosses.indexOf(id) < 0) {
        state.unlockedGlosses.push(id);
        saveState();
      }

      elPopoverSheet.classList.remove("is-subtext");
      elPopoverSheet.innerHTML =
        '<div class="popover-head">' +
          '<span class="popover-kicker">// 词条释义 · GLOSS</span>' +
          '<button type="button" class="popover-close" id="btn-pop-close">关闭 [ESC]</button>' +
        "</div>" +
        '<div class="popover-term">' + escapeHtml(entry.term || id) + "</div>" +
        '<div class="popover-plain">' + escapeHtml(entry.plain || "") + "</div>" +
        (entry.source ? '<div class="popover-source">出处：' + escapeHtml(entry.source) + "</div>" : "");

      elModalBackdrop.classList.remove("hidden");
      const closeBtn = document.getElementById("btn-pop-close");
      if (closeBtn) closeBtn.addEventListener("click", closePopover);
    }

    function openSubtextPopover(id) {
      const entry = subtextMap[id];
      if (!entry) return;
      AUDIO.playGloss();

      if (state.decodedSubtexts.indexOf(id) < 0) {
        state.decodedSubtexts.push(id);
        saveState();
      }

      // Mark all matching inline buttons as decoded
      document.querySelectorAll('.inline-subtext[data-subtext="' + id + '"]').forEach(function (btn) {
        btn.classList.add("is-decoded");
      });

      const surface = entry.surface || entry.phrase || entry.term || id;
      const decode = entry.cao_decode || entry.decode || entry.translation || "";
      const note = entry.note || entry.comment || "";

      elPopoverSheet.classList.add("is-subtext");
      elPopoverSheet.innerHTML =
        '<div class="popover-head">' +
          '<span class="popover-kicker">// 丞相内心翻译机 · SUBTEXT</span>' +
          '<button type="button" class="popover-close" id="btn-pop-close">收起 [ESC]</button>' +
        "</div>" +
        '<div class="subtext-surface"><strong>【表面官话】</strong>「' + escapeHtml(surface) + "」</div>" +
        '<div class="subtext-decode"><strong>【曹操听懂的实话】</strong>' + escapeHtml(decode) + "</div>" +
        (note ? '<div class="popover-source">' + escapeHtml(note) + "</div>" : "");

      elModalBackdrop.classList.remove("hidden");
      const closeBtn = document.getElementById("btn-pop-close");
      if (closeBtn) closeBtn.addEventListener("click", closePopover);
    }

    function closePopover() {
      elModalBackdrop.classList.add("hidden");
    }

    /* ======================================================================
       Bubble Rendering
       ====================================================================== */

    function inferSide(b) {
      if (b.side) return b.side;
      if (b.isPlayer || b.speaker === "曹操" || b.speaker === "丞相") return "right";
      if (b.type === "system" || b.type === "narrator" || !b.speaker) return "center";
      return "left";
    }

    function finishActiveTypewriter() {
      if (activeTypewriter) {
        const tw = activeTypewriter;
        activeTypewriter = null;
        tw.finishNow();
        return true;
      }
      return false;
    }

    function cancelActiveTypewriter() {
      if (activeTypewriter) {
        activeTypewriter.cancel();
        activeTypewriter = null;
      }
    }

    function startTypewriter(bodyEl, finalHtml, isAlertLine, onDone) {
      finishActiveTypewriter();

      // Build ordered reveal steps from the rendered rich HTML
      const tmp = document.createElement("div");
      tmp.innerHTML = finalHtml;
      const steps = [];

      function collectNodes(node, parentSpec, isEmph) {
        if (node.nodeType === 3) {
          const text = node.nodeValue || "";
          const chars = Array.from(text);
          for (let i = 0; i < chars.length; i++) {
            steps.push({ kind: "char", ch: chars[i], emph: isEmph, target: parentSpec });
          }
        } else if (node.nodeType === 1) {
          if (node.tagName === "BUTTON") {
            steps.push({ kind: "el", el: node.cloneNode(true), target: parentSpec });
          } else if (node.tagName === "STRONG") {
            const strongEl = document.createElement("strong");
            strongEl.className = node.className || "inline-bold";
            steps.push({ kind: "open", el: strongEl, target: parentSpec });
            for (let c = 0; c < node.childNodes.length; c++) {
              collectNodes(node.childNodes[c], strongEl, true);
            }
          } else {
            const cloneEl = node.cloneNode(false);
            steps.push({ kind: "open", el: cloneEl, target: parentSpec });
            for (let c = 0; c < node.childNodes.length; c++) {
              collectNodes(node.childNodes[c], cloneEl, isEmph);
            }
          }
        }
      }

      for (let i = 0; i < tmp.childNodes.length; i++) {
        collectNodes(tmp.childNodes[i], bodyEl, false);
      }

      if (steps.length === 0) {
        bodyEl.innerHTML = finalHtml;
        if (onDone) onDone();
        return;
      }

      const caret = document.createElement("span");
      caret.className = "typing-caret";
      caret.setAttribute("aria-hidden", "true");
      bodyEl.innerHTML = "";
      bodyEl.appendChild(caret);

      let idx = 0;
      let timerId = null;
      let finished = false;
      let prevCh = "";
      let charCounter = 0;

      function complete(instant) {
        if (finished) return;
        finished = true;
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        if (activeTypewriter && activeTypewriter.id === twId) {
          activeTypewriter = null;
        }
        if (instant) {
          bodyEl.innerHTML = finalHtml;
        } else if (caret.parentNode) {
          caret.parentNode.removeChild(caret);
        }
        scrollToBottom();
        if (onDone) onDone();
      }

      function computeDelay(step) {
        if (step.kind === "open") return 0;
        if (step.kind === "el") return 95;
        const ch = step.ch;
        let d = step.emph ? 38 : 24;
        if (ch === "，" || ch === "、" || ch === "；" || ch === "：") d += 105;
        else if (ch === "。" || ch === "！" || ch === "？") d += 170;
        else if ((ch === "—" && prevCh === "—") || (ch === "…" && prevCh === "…")) d += 220;
        else if (ch === "」" || ch === "”" || ch === "』") d += 45;
        return d;
      }

      function pump() {
        if (finished) return;
        if (idx >= steps.length) {
          complete(false);
          return;
        }

        const step = steps[idx++];
        const mount = step.target || bodyEl;

        if (step.kind === "open") {
          if (mount === bodyEl) bodyEl.insertBefore(step.el, caret);
          else mount.appendChild(step.el);
          pump();
          return;
        }

        if (step.kind === "el") {
          step.el.classList.add("token-pop");
          if (mount === bodyEl) bodyEl.insertBefore(step.el, caret);
          else mount.appendChild(step.el);
          AUDIO.playCharPop(true);
          if (state.settings.haptics) AUDIO.vibrate(5);
        } else {
          const sp = document.createElement("span");
          sp.className = step.emph ? "char-pop is-emph" : "char-pop";
          sp.textContent = step.ch;
          if (mount === bodyEl) bodyEl.insertBefore(sp, caret);
          else mount.appendChild(sp);

          charCounter++;
          if (step.emph) {
            AUDIO.playCharPop(true);
            if (state.settings.haptics && charCounter % 2 === 1) AUDIO.vibrate(5);
          } else if (charCounter % 2 === 0 && !/\s/.test(step.ch)) {
            AUDIO.playCharPop(false);
          }
          if (state.settings.haptics && (step.ch === "！" || step.ch === "？" || (step.ch === "—" && prevCh === "—"))) {
            AUDIO.vibrate(isAlertLine ? 12 : 6);
          }
          prevCh = step.ch;
        }

        if (charCounter % 8 === 0) scrollToBottom();
        timerId = setTimeout(pump, computeDelay(step));
      }

      const twId = Date.now() + Math.random();
      activeTypewriter = {
        id: twId,
        finishNow: function () {
          complete(true);
        },
        cancel: function () {
          finished = true;
          if (timerId) {
            clearTimeout(timerId);
            timerId = null;
          }
          if (caret.parentNode) caret.parentNode.removeChild(caret);
        }
      };

      pump();
    }

    function appendBubble(b, containerEl, onRevealComplete) {
      const parent = containerEl || elStream;
      const side = inferSide(b);
      const row = document.createElement("div");
      row.className = "bubble-row side-" + side;

      const bubble = document.createElement("div");
      bubble.className = "bubble";
      if (b.tone) bubble.setAttribute("data-tone", b.tone);
      if (b.speaker === "巡营所见" || b.type === "walk") {
        bubble.classList.add("is-walk");
      }

      const speaker = b.speaker || "";
      const role = b.roleTag || b.role || "";
      const tag = b.sourceTag || b.tag || b.histTag || "";

      if (speaker || role || tag) {
        const head = document.createElement("div");
        head.className = "bubble-head";
        if (speaker) {
          const sp = document.createElement("span");
          sp.className = "bubble-speaker";
          sp.textContent = speaker;
          head.appendChild(sp);
        }
        if (role) {
          const rl = document.createElement("span");
          rl.className = "bubble-role";
          rl.textContent = role;
          head.appendChild(rl);
        }
        if (tag) {
          const tg = document.createElement("span");
          let tagCls = "source-tag";
          if (tag.indexOf("拟") >= 0) tagCls += " tag-ni";
          else if (tag.indexOf("演") >= 0) tagCls += " tag-yanyi";
          tg.className = tagCls;
          tg.textContent = tag;
          head.appendChild(tg);
        }
        bubble.appendChild(head);
      }

      const body = document.createElement("div");
      body.className = "bubble-body";
      const richHtml = renderRichText(b.text || "");
      bubble.appendChild(body);

      row.appendChild(bubble);
      parent.appendChild(row);

      const isAlertLine = Boolean(b.sfx === "alert" || b.tone === "danger" || b.tone === "fire");
      if (isAlertLine) {
        AUDIO.playAlert();
      } else {
        AUDIO.playTick();
      }

      function afterTextShown() {
        if (b.effects || b.vars || b.reason || b.settlement) {
          applyEffects(b.effects, b.vars, b.reason || b.settlement, parent);
        }
        scrollToBottom();
        if (onRevealComplete) onRevealComplete();
      }

      const reducedMotion = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (state.settings.typewriter !== false && !reducedMotion && !b.instant) {
        scrollToBottom();
        startTypewriter(body, richHtml, isAlertLine, afterTextShown);
      } else {
        body.innerHTML = richHtml;
        afterTextShown();
      }
    }

    function scrollToBottom() {
      global.requestAnimationFrame(function () {
        elStream.scrollTop = elStream.scrollHeight;
      });
    }

    /* ======================================================================
       Queue & Tap-to-Advance Engine
       ====================================================================== */

    function clearAutoTimer() {
      if (autoTimer) {
        clearTimeout(autoTimer);
        autoTimer = null;
      }
    }

    function updateBottomDock() {
      clearAutoTimer();

      if (awaitingWidget || awaitingChoice || state.finished) {
        elTapPrompt.classList.add("hidden");
        if (!awaitingChoice) elChoiceDeck.classList.add("hidden");
        return;
      }

      if (activeTypewriter) {
        elChoiceDeck.classList.add("hidden");
        elTapPrompt.classList.remove("hidden");
        elTapRemaining.textContent = "轻触快显";
        return;
      }

      if (pendingQueue.length > 0) {
        elChoiceDeck.classList.add("hidden");
        elTapPrompt.classList.remove("hidden");
        const remainingBubbles = pendingQueue.filter(function (item) {
          return item.kind === "bubble" || item.kind === "war_section";
        }).length;
        elTapRemaining.textContent = remainingBubbles > 0 ? ("剩余 " + remainingBubbles + " 条") : "继续";

        if (state.settings.autoPace) {
          const nextItem = pendingQueue[0];
          const delay = (nextItem && nextItem.data && nextItem.data.delay) || 950;
          autoTimer = setTimeout(advanceQueue, delay);
        }
      } else {
        elTapPrompt.classList.add("hidden");
      }
    }

    function advanceQueue() {
      if (awaitingWidget || awaitingChoice || state.finished) return;
      clearAutoTimer();

      // If a bubble is currently typing out, finish it immediately on tap
      if (finishActiveTypewriter()) {
        return;
      }

      if (pendingQueue.length === 0) {
        updateBottomDock();
        return;
      }

      const item = pendingQueue.shift();
      if (item.kind === "bubble") {
        appendBubble(item.data, item.container, function () {
          // Run trailing callback only after the bubble finishes typing out
          if (pendingQueue.length > 0 && pendingQueue[0].kind === "callback") {
            const cb = pendingQueue.shift();
            cb.fn();
            return;
          }
          updateBottomDock();
        });
        updateBottomDock();
        return;
      } else if (item.kind === "war_section") {
        renderWarSection(item.data, item.container);
      } else if (item.kind === "callback") {
        item.fn();
        return;
      }

      // Immediately run trailing callbacks if no more visible items precede them
      if (pendingQueue.length > 0 && pendingQueue[0].kind === "callback") {
        const cb = pendingQueue.shift();
        cb.fn();
        return;
      }

      updateBottomDock();
    }

    /* ======================================================================
       Interactive Language-Game Widgets (wordsmith / inspect / quip)
       ====================================================================== */

    function renderWidget(widget, onComplete) {
      awaitingWidget = true;
      updateBottomDock();

      if (widget.type === "wordsmith") {
        renderWordsmithWidget(widget, onComplete);
      } else if (widget.type === "inspect") {
        renderInspectWidget(widget, onComplete);
      } else if (widget.type === "quip") {
        renderQuipWidget(widget, onComplete);
      } else {
        awaitingWidget = false;
        onComplete();
      }
    }

    /* 1. Wordsmith Widget */
    function renderWordsmithWidget(w, onComplete) {
      const card = document.createElement("div");
      card.className = "widget-card type-wordsmith";

      // Normalize slots (supports both { s1: [...] } array-valued and { s1: { label, options: [...] } })
      const slotsMap = {};
      const slotOrder = [];
      if (Array.isArray(w.slots)) {
        w.slots.forEach(function (s, idx) {
          const id = s.id || ("slot_" + idx);
          slotsMap[id] = Array.isArray(s) ? { label: id, options: s } : s;
          slotOrder.push(id);
        });
      } else if (w.slots && typeof w.slots === "object") {
        Object.keys(w.slots).forEach(function (id) {
          const val = w.slots[id];
          slotsMap[id] = Array.isArray(val) ? { label: "措辞 " + id, options: val } : val;
          slotOrder.push(id);
        });
      }

      const selectedIdx = {};
      slotOrder.forEach(function (id) { selectedIdx[id] = 0; });
      let openSlotId = null;

      function getOption(slotId) {
        const s = slotsMap[slotId];
        if (!s || !Array.isArray(s.options) || !s.options.length) return { text: "..." };
        return s.options[selectedIdx[slotId] || 0] || s.options[0];
      }

      function buildTemplateParts() {
        if (Array.isArray(w.template)) return w.template;
        if (Array.isArray(w.segments)) return w.segments;
        const tpl = String(w.template || "");
        const parts = [];
        const re = /\{\{(?:slot:)?([^}]+)\}\}|\{([^}]+)\}/g;
        let last = 0;
        let m;
        while ((m = re.exec(tpl)) !== null) {
          if (m.index > last) parts.push(tpl.slice(last, m.index));
          parts.push({ slot: (m[1] || m[2]).trim() });
          last = re.lastIndex;
        }
        if (last < tpl.length) parts.push(tpl.slice(last));
        return parts;
      }

      const templateParts = buildTemplateParts();

      function renderInner() {
        let letterHtml = "";
        templateParts.forEach(function (part) {
          if (typeof part === "string") {
            letterHtml += escapeHtml(part);
          } else if (part && (part.slot || part.slotId)) {
            const sid = part.slot || part.slotId;
            const opt = getOption(sid);
            const txt = opt.text || opt.label || "";
            const isOpen = openSlotId === sid;
            letterHtml +=
              '<button type="button" class="ws-slot-chip' + (isOpen ? " is-open" : "") + '" data-slot="' + escapeHtml(sid) + '">' +
                "<span>" + escapeHtml(txt) + "</span>" +
                '<span class="caret">▾</span>' +
              "</button>";
          }
        });

        let drawerHtml = "";
        if (openSlotId && slotsMap[openSlotId]) {
          const slotDef = slotsMap[openSlotId];
          drawerHtml += '<div class="ws-options-drawer">';
          drawerHtml += '<div class="ws-options-title">// 选词：' + escapeHtml(slotDef.label || openSlotId) + "</div>";
          (slotDef.options || []).forEach(function (opt, i) {
            const isSel = selectedIdx[openSlotId] === i;
            drawerHtml +=
              '<button type="button" class="ws-opt-btn' + (isSel ? " is-selected" : "") + '" data-opt-idx="' + i + '">' +
                escapeHtml(opt.text || opt.label || "") +
              "</button>";
          });
          drawerHtml += "</div>";
        }

        // Gather live reaction preview
        const reactions = [];
        slotOrder.forEach(function (sid) {
          const opt = getOption(sid);
          const r = opt.reaction || opt.comment || opt.preview;
          if (r) reactions.push(r);
        });
        const previewText = reactions.length ? reactions.join(" ") : (w.defaultReaction || "点击高亮词槽可切换措辞，观察众将与江东反应。");

        card.innerHTML =
          '<div class="widget-header">' +
            '<span class="widget-tag">[' + escapeHtml(w.title || "起草军书") + "]</span>" +
            '<span class="widget-progress">点词改稿</span>' +
          "</div>" +
          '<div class="widget-body">' +
            (w.prompt || w.subtitle ? '<p class="widget-prompt">' + escapeHtml(w.prompt || w.subtitle) + "</p>" : "") +
            '<div class="ws-letter">' + letterHtml + "</div>" +
            drawerHtml +
            '<div class="ws-preview-bar">' +
              '<span class="ws-preview-label">// ' + escapeHtml(w.previewLabel || "幕僚 / 江东反应") + "</span>" +
              "<span>" + escapeHtml(previewText) + "</span>" +
            "</div>" +
            '<div class="widget-footer">' +
              '<button type="button" class="widget-confirm-btn" id="ws-confirm">' + escapeHtml(w.confirmLabel || "用印发出") + "</button>" +
            "</div>" +
          "</div>";

        card.querySelectorAll(".ws-slot-chip").forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const sid = btn.getAttribute("data-slot");
            AUDIO.playTick();
            openSlotId = (openSlotId === sid) ? null : sid;
            renderInner();
          });
        });

        card.querySelectorAll(".ws-opt-btn").forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute("data-opt-idx"), 10);
            if (openSlotId) {
              selectedIdx[openSlotId] = idx;
              openSlotId = null;
              AUDIO.playGloss();
              renderInner();
            }
          });
        });

        const confirmBtn = card.querySelector("#ws-confirm");
        if (confirmBtn) {
          confirmBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            AUDIO.playChoice();

            // Render committed despatch card
            let finalHtml = "";
            templateParts.forEach(function (part) {
              if (typeof part === "string") {
                finalHtml += escapeHtml(part);
              } else if (part && (part.slot || part.slotId)) {
                const sid = part.slot || part.slotId;
                const opt = getOption(sid);
                finalHtml += "<mark>" + escapeHtml(opt.text || opt.label || "") + "</mark>";
              }
            });

            card.innerHTML =
              '<div class="widget-header">' +
                '<span class="widget-tag">[' + escapeHtml(w.title || "军书已发") + " · 已用印]</span>" +
                '<span class="widget-progress">' + escapeHtml(w.resultSpeaker || "定稿") + "</span>" +
              "</div>" +
              '<div class="widget-body">' +
                '<div class="ws-committed">' + finalHtml + "</div>" +
              "</div>";

            // Apply vars & effects from each chosen slot + widget level
            slotOrder.forEach(function (sid) {
              const opt = getOption(sid);
              if (opt.vars || opt.effects || opt.reason) {
                applyEffects(opt.effects, opt.vars, opt.reason);
              }
            });
            if (w.vars || w.effects || w.reason) {
              applyEffects(w.effects, w.vars, w.reason);
            }

            awaitingWidget = false;
            saveState();
            scrollToBottom();
            onComplete(w.next || null);
          });
        }
      }

      renderInner();
      elStream.appendChild(card);
      scrollToBottom();
    }

    /* 2. Inspect Widget */
    function renderInspectWidget(w, onComplete) {
      const items = w.items || w.clauses || w.clues || [];
      const minInspect = typeof w.minInspect === "number" ? w.minInspect : Math.min(1, items.length);
      const checkedSet = {};
      let checkedCount = 0;

      const card = document.createElement("div");
      card.className = "widget-card type-inspect";

      function renderInner() {
        let listHtml = "";
        items.forEach(function (item, idx) {
          const isChecked = Boolean(checkedSet[idx]);
          const clauseText = item.text || item.clause || item.quote || "";
          const deduction = item.deduction || item.analysis || item.note || "";
          const spk = item.clueTitle || item.speaker || "丞相批注";

          listHtml +=
            '<div class="inspect-clause' + (isChecked ? " is-checked" : "") + '">' +
              '<button type="button" class="inspect-clause-btn" data-idx="' + idx + '">' +
                "<span>" + renderRichText(clauseText) + "</span>" +
                '<span class="inspect-mark">' + (isChecked ? "已勘" : "核查") + "</span>" +
              "</button>" +
              (isChecked && deduction
                ? '<div class="inspect-deduction"><span class="inspect-deduction-speaker">[' + escapeHtml(spk) + "]</span>" + renderRichText(deduction) + "</div>"
                : "") +
            "</div>";
        });

        const canProceed = checkedCount >= minInspect;
        card.innerHTML =
          '<div class="widget-header">' +
            '<span class="widget-tag">[' + escapeHtml(w.title || "勘验密函") + "]</span>" +
            '<span class="widget-progress">已查 ' + checkedCount + "/" + items.length + " 处破绽</span>" +
          "</div>" +
          '<div class="widget-body">' +
            (w.docHeader ? '<div class="ws-preview-label" style="margin-bottom:6px;">// ' + escapeHtml(w.docHeader) + "</div>" : "") +
            (w.prompt || w.subtitle || w.intro ? '<p class="widget-prompt">' + escapeHtml(w.prompt || w.subtitle || w.intro) + "</p>" : "") +
            '<div class="inspect-list">' + listHtml + "</div>" +
            '<div class="widget-footer">' +
              '<button type="button" class="widget-confirm-btn" id="inspect-proceed"' + (canProceed ? "" : " disabled") + ">" +
                escapeHtml(canProceed ? (w.doneLabel || w.proceedLabel || w.confirmLabel || "收起密函，继续") : ("请至少核查 " + minInspect + " 处可疑句")) +
              "</button>" +
            "</div>" +
          "</div>";

        card.querySelectorAll(".inspect-clause-btn").forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            if (e.target.closest(".inline-gloss, .inline-subtext")) return;
            e.stopPropagation();
            const idx = parseInt(btn.getAttribute("data-idx"), 10);
            if (!checkedSet[idx]) {
              checkedSet[idx] = true;
              checkedCount++;
              const it = items[idx];
              if (it && (it.vars || it.effects)) {
                applyEffects(it.effects, it.vars, it.reason);
              } else {
                state.vars.clues_found = Number(state.vars.clues_found || 0) + 1;
                saveState();
              }
              AUDIO.playGloss();
              renderInner();
              scrollToBottom();
            }
          });
        });

        const proceedBtn = card.querySelector("#inspect-proceed");
        if (proceedBtn && canProceed) {
          proceedBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            AUDIO.playChoice();
            proceedBtn.disabled = true;
            proceedBtn.textContent = "已勘验完毕 (" + checkedCount + "/" + items.length + ")";
            if (w.vars || w.effects) {
              applyEffects(w.effects, w.vars, w.reason);
            }
            awaitingWidget = false;
            saveState();
            onComplete(w.next || null);
          });
        }
      }

      renderInner();
      elStream.appendChild(card);
      scrollToBottom();
    }

    /* 3. Quip Widget */
    function renderQuipWidget(w, onComplete) {
      const options = w.options || w.choices || [];
      const card = document.createElement("div");
      card.className = "widget-card type-quip";

      let optsHtml = "";
      options.forEach(function (opt, idx) {
        optsHtml +=
          '<button type="button" class="quip-btn" data-idx="' + idx + '">' +
            '<span class="quip-idx">[' + (idx + 1) + "]</span>" +
            "<span>" + escapeHtml(opt.label || opt.text || "") + "</span>" +
          "</button>";
      });

      card.innerHTML =
        '<div class="widget-header">' +
          '<span class="widget-tag">[' + escapeHtml(w.title || "帐中应对") + "]</span>" +
          '<span class="widget-progress">择一言以对</span>' +
        "</div>" +
        '<div class="widget-body">' +
          (w.prompt ? '<p class="widget-prompt">' + escapeHtml(w.prompt) + "</p>" : "") +
          '<div class="quip-options">' + optsHtml + "</div>" +
        "</div>";

      card.querySelectorAll(".quip-btn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          const idx = parseInt(btn.getAttribute("data-idx"), 10);
          const opt = options[idx];
          if (!opt) return;

          AUDIO.playChoice();
          card.remove();

          // Post Cao Cao's retort bubble
          appendBubble({
            speaker: "曹操",
            side: "right",
            text: opt.replyText || opt.reply || opt.caoText || opt.text || opt.label || ""
          });

          // Post advisor's tailored reaction bubble
          const reactionText = opt.responseText || opt.reaction || opt.advisorText;
          if (reactionText) {
            appendBubble({
              speaker: opt.responseSpeaker || opt.advisorSpeaker || w.advisorSpeaker || "幕僚",
              roleTag: opt.responseRole || opt.advisorRole || w.advisorRole || "",
              tone: opt.responseTone || opt.advisorTone || w.advisorTone || "info",
              side: "left",
              text: reactionText
            });
          }

          if (opt.vars || opt.effects || opt.reason) {
            applyEffects(opt.effects, opt.vars, opt.reason);
          }

          awaitingWidget = false;
          saveState();
          onComplete(opt.next || w.next || null);
        });
      });

      elStream.appendChild(card);
      scrollToBottom();
    }

    /* ======================================================================
       Two-Evils Choice Deck
       ====================================================================== */

    function renderChoiceDeck(node) {
      const choices = (node.choices || []).filter(function (c) {
        return evalCondition(c.when || c.condition || c.if);
      });

      if (!choices.length) {
        const nextId = resolveNext(node.next);
        if (nextId) enterNode(nextId);
        return;
      }

      awaitingChoice = true;
      elTapPrompt.classList.add("hidden");
      elChoiceDeck.innerHTML = "";
      elChoiceDeck.classList.remove("hidden");

      const hint = document.createElement("div");
      hint.className = "choice-deck-hint";
      hint.innerHTML = "<span>// 丞相拍板</span><span>两害相权</span>";
      elChoiceDeck.appendChild(hint);

      choices.forEach(function (ch) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn" + (ch.isBait ? " is-bait" : "");

        const baitText = ch.bait || ch.hint || ch.sublabel || "";
        btn.innerHTML =
          '<span class="choice-label">' + escapeHtml(ch.label || "") + "</span>" +
          (baitText ? '<span class="choice-bait">' + escapeHtml(baitText) + "</span>" : "");

        btn.addEventListener("click", function () {
          AUDIO.playChoice();
          awaitingChoice = false;
          elChoiceDeck.classList.add("hidden");

          // Post Cao Cao's decision reply bubble
          const reply = ch.replyText || ch.reply || ch.caoReply || ch.playerBubble;
          if (reply) {
            if (typeof reply === "string") {
              appendBubble({ speaker: "曹操", side: "right", instant: true, text: reply });
            } else {
              appendBubble(Object.assign({ speaker: "曹操", side: "right", instant: true }, reply));
            }
          } else {
            appendBubble({ speaker: "曹操", side: "right", instant: true, text: ch.label || "" });
          }

          // Apply effects + settlement strip
          applyEffects(ch.effects, ch.vars, ch.reason || ch.settlement, null, ch.fakeTroopBadge);

          const nextId = resolveNext(ch.next) || resolveNext(node.next);
          if (nextId) {
            enterNode(nextId);
          }
        });

        elChoiceDeck.appendChild(btn);
      });

      scrollToBottom();
    }

    /* ======================================================================
       Dynamic War Report (N08_battle_report)
       ====================================================================== */

    function renderWarSection(sec, container) {
      const box = document.createElement("div");
      box.className = "war-section";
      if (sec.tone) box.setAttribute("data-tone", sec.tone);

      const rightHead = sec.headline || (sec.speaker ? sec.speaker + (sec.tag ? " · " + sec.tag : "") : "");
      box.innerHTML =
        '<div class="war-section-head">' +
          "<span>" + escapeHtml(sec.title || sec.label || "战况") + "</span>" +
          (rightHead ? "<span>" + escapeHtml(rightHead) + "</span>" : "") +
        "</div>" +
        '<div class="war-section-text">' + renderRichText(sec.text || sec.body || sec.summary || "") + "</div>";

      container.appendChild(box);
      AUDIO.playAlert();

      if (sec.shatterFakeTroop || (sec.effects && (sec.effects.troops < 0 || sec.effects.shatterFakeTroop))) {
        shatterFakeTroopBadge();
      }
      if (sec.effects || sec.vars || sec.reason || sec.settlement) {
        applyEffects(sec.effects, sec.vars, sec.reason || sec.settlement, container);
      }
      scrollToBottom();
    }

    function enterBattleReport(node) {
      const br = STORY.battleReport || node || {};
      setMood("fire");
      AUDIO.playAlert();

      if (node && node.chapter != null) {
        updateChapterStrip(node.chapter, true);
      } else if (chapters.length >= 2) {
        updateChapterStrip(chapters[chapters.length - 1].id, true);
      }

      const card = document.createElement("div");
      card.className = "war-report-card";
      card.innerHTML =
        '<div class="war-report-head">' +
          '<div class="war-report-kicker">// 急报 · RED CLIFFS BATTLE DOSSIER</div>' +
          '<h2 class="war-report-title">' + escapeHtml(br.header || br.title || "赤壁战报") + "</h2>" +
        "</div>" +
        '<div class="war-report-body" id="war-report-body"></div>';

      elStream.appendChild(card);
      currentWarBody = card.querySelector("#war-report-body");

      // Opening text (supports openingByHaste map OR opening / intro)
      if (br.openingByHaste && typeof br.openingByHaste === "object") {
        const h = Math.max(0, Math.min(2, Number(state.vars.haste || 0)));
        const openObj = br.openingByHaste[String(h)] || br.openingByHaste["1"] || br.openingByHaste["0"];
        if (openObj) {
          const openingEl = document.createElement("div");
          openingEl.className = "war-report-opening";
          openingEl.innerHTML =
            (openObj.tag ? '<span class="settlement-badge" style="margin-right:6px;">' + escapeHtml(openObj.tag) + "</span>" : "") +
            renderRichText(openObj.text || "");
          currentWarBody.appendChild(openingEl);
        }
      } else if (br.opening || br.intro) {
        const openingArr = Array.isArray(br.opening || br.intro) ? (br.opening || br.intro) : [br.opening || br.intro];
        const openingEl = document.createElement("div");
        openingEl.className = "war-report-opening";
        openingEl.innerHTML = openingArr.map(function (line) {
          return renderRichText(typeof line === "string" ? line : (line.text || ""));
        }).join("<br>");
        currentWarBody.appendChild(openingEl);
      }

      // Evaluate sections
      const rawSections = br.sections || [];
      const evaluated = [];
      rawSections.forEach(function (sec) {
        if (Array.isArray(sec.branches) || Array.isArray(sec.cases) || Array.isArray(sec.variants)) {
          const list = sec.branches || sec.cases || sec.variants;
          for (let i = 0; i < list.length; i++) {
            const branch = list[i];
            if (evalCondition(branch.when || branch.condition || branch.if)) {
              evaluated.push(Object.assign({ title: sec.title || sec.label }, branch));
              break;
            }
          }
        } else if (evalCondition(sec.when || sec.condition || sec.if)) {
          evaluated.push(sec);
        }
      });

      pendingQueue = [];
      evaluated.forEach(function (sec) {
        pendingQueue.push({ kind: "war_section", data: sec, container: currentWarBody });
      });

      pendingQueue.push({
        kind: "callback",
        fn: function () {
          shatterFakeTroopBadge();
          if (br.excuseWidget) {
            renderWidget(br.excuseWidget, function () {
              routeToEnding(br);
            });
          } else {
            routeToEnding(br);
          }
        }
      });

      scrollToBottom();
      // Reveal first section right away
      advanceQueue();
    }

    function routeToEnding(br) {
      let endingId = resolveNext(br.endingRoutes || br.routes || br.next);

      if (!endingId) {
        // Fallback: check conditions on endingsMap directly
        const keys = Object.keys(endingsMap);
        for (let i = 0; i < keys.length; i++) {
          const end = endingsMap[keys[i]];
          if (end && evalCondition(end.when || end.condition || end.if)) {
            endingId = keys[i];
            break;
          }
        }
        if (!endingId && keys.length) endingId = keys[0];
      }

      if (endingId && endingsMap[endingId]) {
        enterEnding(endingId);
      } else if (endingId && nodesMap[endingId]) {
        enterNode(endingId);
      }
    }

    /* ======================================================================
       Ending & Historical Dossier Screen
       ====================================================================== */

    function computePersona() {
      const clues = Number(state.vars.clues_found || 0);
      const subtexts = state.decodedSubtexts.length;
      const totalRes = state.resources.coin + state.resources.grain + state.resources.troops;

      if (state.resources.troops >= 5 && totalRes >= 14) {
        return {
          name: "《留得青山的精算丞相》",
          desc: "在所有人都在赌一口气时，你先把退路和家底算清了。"
        };
      }
      if (clues >= 3 || subtexts >= 4) {
        return {
          name: "《听弦外音的多疑明主》",
          desc: "官场话术与密函破绽全没逃过你的眼睛——只是看穿未必能立刻逆转大势。"
        };
      }
      if (state.resources.grain <= 2) {
        return {
          name: "《漕运告急的豪赌统帅》",
          desc: "兵马未动，粮草先见底。你亲身验证了后勤比豪言壮语更冷酷。"
        };
      }
      return {
        name: "《横槊赋诗的逆风丞相》",
        desc: "在信息不全、疫病与江风交织的赌桌上，你做出了极像建安十三年那位丞相的抉择。"
      };
    }

    function enterEnding(endingId) {
      const end = endingsMap[endingId];
      if (!end) return;

      state.finished = true;
      state.endingId = endingId;
      state.nodeId = endingId;
      if (state.discoveredEndings.indexOf(endingId) < 0) {
        state.discoveredEndings.push(endingId);
      }
      const toneToMood = { fire: "fire", danger: "fire", warn: "tense", ok: "calm", info: "cold" };
      if (end.mood) setMood(end.mood);
      else if (end.tone && toneToMood[end.tone]) setMood(toneToMood[end.tone]);
      saveState();

      // Render any final bubbles first
      if (Array.isArray(end.bubbles)) {
        end.bubbles.forEach(function (b) {
          if (evalCondition(b.when || b.condition)) {
            appendBubble(b);
          }
        });
      }

      const persona = end.persona
        ? (typeof end.persona === "string" ? { name: end.persona, desc: "" } : end.persona)
        : computePersona();

      // Build Historical Dossier items
      const dossierRaw = Array.isArray(STORY.historyDossier)
        ? STORY.historyDossier
        : (STORY.historyDossier && STORY.historyDossier.items ? STORY.historyDossier.items : []);

      let dossierHtml = "";
      dossierRaw.forEach(function (item) {
        let matched = false;
        const varKey = item.varName || item.var || item.varKey;
        if (item.when || item.condition) {
          matched = evalCondition(item.when || item.condition);
        } else if (varKey) {
          const val = getVarValue(varKey);
          const expected = Object.prototype.hasOwnProperty.call(item, "canonVal")
            ? item.canonVal
            : (Object.prototype.hasOwnProperty.call(item, "historyVal") ? item.historyVal : item.matchVal);
          matched = val == expected;
        }

        const tagHtml = matched
          ? '<span class="dossier-tag match">[合史]</span>'
          : '<span class="dossier-tag diverge">[旁支]</span>';

        const playerText = matched
          ? (item.playerHit || item.playerMatchText || item.history || item.historical || item.note || "")
          : (item.playerMiss || item.playerDivergeText || item.history || item.historical || item.note || "");

        const canonNote = item.canonNote || "";
        const srcText = (item.quote ? "「" + item.quote + "」 " : "") + (item.source || "");

        dossierHtml +=
          '<div class="dossier-item">' +
            '<div class="dossier-item-head">' +
              '<span class="dossier-item-title">' + escapeHtml(item.title || item.decision || "") + "</span>" +
              tagHtml +
            "</div>" +
            '<div class="dossier-item-text">' + renderRichText(playerText) + "</div>" +
            (canonNote ? '<div class="dossier-item-src" style="color:var(--fg-dim);margin-top:6px;">史载：' + renderRichText(canonNote) + "</div>" : "") +
            (srcText ? '<div class="dossier-item-src">' + escapeHtml(srcText) + "</div>" : "") +
          "</div>";
      });

      // Build chapter jump buttons
      let jumpHtml = "";
      chapters.forEach(function (ch, idx) {
        const targetNode = ch.startNode || ch.nodeId || ch.id;
        if (!targetNode || targetNode === "N08_battle_report") return;
        const actLabel = ch.num || ch.act || ch.code || ("第" + (idx + 1) + "节");
        jumpHtml +=
          '<button type="button" class="jump-btn" data-jump-chapter="' + escapeHtml(String(ch.id)) + '" data-jump-node="' + escapeHtml(targetNode) + '">' +
            "<strong>" + escapeHtml(actLabel) + "</strong>" +
            "<span>" + escapeHtml(ch.title || "") + "</span>" +
          "</button>";
      });

      const card = document.createElement("div");
      card.className = "ending-card";
      if (end.tone) card.setAttribute("data-tone", end.tone);
      card.innerHTML =
        '<div class="ending-hero">' +
          '<span class="ending-badge">' + escapeHtml(end.badge || end.code || "终局") + "</span>" +
          '<h2 class="ending-title">' + escapeHtml(end.title || "") + "</h2>" +
          (end.subtitle ? '<div class="ending-subtitle">' + escapeHtml(end.subtitle) + "</div>" : "") +
        "</div>" +
        '<div class="ending-section">' +
          '<div class="ending-sec-title">// 史论判词</div>' +
          '<p class="ending-verdict">' + renderRichText(end.verdict || "") + "</p>" +
          (end.careerSeed ? '<div class="ending-seed">' + renderRichText(end.careerSeed) + "</div>" : "") +
        "</div>" +
        '<div class="ending-section">' +
          '<div class="ending-sec-title">// 本局账本 & 丞相称号</div>' +
          '<div class="persona-box">' +
            '<div class="persona-kicker">本局评定</div>' +
            '<div class="persona-name">' + escapeHtml(persona.name) + "</div>" +
            (persona.desc ? '<div class="persona-desc">' + escapeHtml(persona.desc) + "</div>" : "") +
          "</div>" +
          '<div class="stats-grid">' +
            '<div class="stat-cell"><span class="stat-k">余钱帛</span><span class="stat-v">' + state.resources.coin + "</span></div>" +
            '<div class="stat-cell"><span class="stat-k">余粮草</span><span class="stat-v">' + state.resources.grain + "</span></div>" +
            '<div class="stat-cell"><span class="stat-k">余兵力</span><span class="stat-v">' + state.resources.troops + "</span></div>" +
            '<div class="stat-cell"><span class="stat-k">已读释义</span><span class="stat-v">' + state.unlockedGlosses.length + "</span></div>" +
            '<div class="stat-cell"><span class="stat-k">破译潜台词</span><span class="stat-v">' + state.decodedSubtexts.length + "</span></div>" +
            '<div class="stat-cell"><span class="stat-k">查出破绽</span><span class="stat-v">' + Number(state.vars.clues_found || 0) + "</span></div>" +
          "</div>" +
        "</div>" +
        (dossierHtml
          ? '<div class="ending-section">' +
              '<div class="ending-sec-title">// 《三国志》史实对照卷宗</div>' +
              '<div class="dossier-list">' + dossierHtml + "</div>" +
            "</div>"
          : "") +
        '<div class="ending-section">' +
          '<div class="ending-sec-title">// 再探赤壁</div>' +
          '<div class="ending-actions">' +
            '<button type="button" class="btn-primary" id="btn-end-restart">重开一局</button>' +
          "</div>" +
          (jumpHtml ? '<div class="ending-sec-title" style="margin-top:14px;">// 跳拍重选（直达章节）</div><div class="jump-grid">' + jumpHtml + "</div>" : "") +
        "</div>";

      elStream.appendChild(card);
      elTapPrompt.classList.add("hidden");
      elChoiceDeck.classList.add("hidden");

      const restartBtn = card.querySelector("#btn-end-restart");
      if (restartBtn) {
        restartBtn.addEventListener("click", function () {
          AUDIO.playChoice();
          startNewGame();
        });
      }

      card.querySelectorAll(".jump-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          AUDIO.playChoice();
          const chId = btn.getAttribute("data-jump-chapter");
          const targetNode = btn.getAttribute("data-jump-node");
          jumpToChapter(chId, targetNode);
        });
      });

      scrollToBottom();
    }

    function jumpToChapter(chapterId, targetNodeId) {
      const snap = state.chapterSnapshots[chapterId];
      const preservedGlosses = state.unlockedGlosses.slice();
      const preservedSubtexts = state.decodedSubtexts.slice();
      const preservedEndings = state.discoveredEndings.slice();
      const preservedSettings = clone(state.settings);
      const preservedSnaps = clone(state.chapterSnapshots);

      state = createFreshState();
      state.unlockedGlosses = preservedGlosses;
      state.decodedSubtexts = preservedSubtexts;
      state.discoveredEndings = preservedEndings;
      state.settings = preservedSettings;
      state.chapterSnapshots = preservedSnaps;

      if (snap) {
        state.resources = clone(snap.resources);
        state.vars = clone(snap.vars);
        state.fakeTroopBadge = Boolean(snap.fakeTroopBadge);
      }

      cancelActiveTypewriter();
      elStream.innerHTML = "";
      pendingQueue = [];
      awaitingWidget = false;
      awaitingChoice = false;
      renderHud(null);
      enterNode(targetNodeId);
    }

    /* ======================================================================
       Node Execution Flow
       ====================================================================== */

    function enterNode(nodeId) {
      if (!nodeId) return;

      // Special routing for battle report or direct ending
      if (nodeId === "N08_battle_report" || (nodesMap[nodeId] && nodesMap[nodeId].type === "battle_report")) {
        state.nodeId = nodeId;
        saveState();
        enterBattleReport(nodesMap[nodeId]);
        return;
      }

      if (endingsMap[nodeId]) {
        enterEnding(nodeId);
        return;
      }

      const node = nodesMap[nodeId];
      if (!node) return;

      state.nodeId = nodeId;
      state.finished = false;
      if (node.chapter != null) updateChapterStrip(node.chapter, true);
      if (node.mood) setMood(node.mood);
      if (node.onEnterEffects || node.effects) {
        applyEffects(node.onEnterEffects || node.effects, node.vars, node.reason);
      }
      saveState();

      pendingQueue = [];
      const bubbles = Array.isArray(node.bubbles) ? node.bubbles : [];
      bubbles.forEach(function (b) {
        if (evalCondition(b.when || b.condition || b.if)) {
          pendingQueue.push({ kind: "bubble", data: b });
        }
      });

      // After all bubbles finish: widget -> choices -> next
      pendingQueue.push({
        kind: "callback",
        fn: function () {
          function afterWidget(widgetNext) {
            if (Array.isArray(node.choices) && node.choices.length > 0) {
              renderChoiceDeck(node);
            } else {
              const nextId = resolveNext(widgetNext) || resolveNext(node.next);
              if (nextId) enterNode(nextId);
            }
          }

          if (node.widget && evalCondition(node.widget.when || node.widget.condition)) {
            renderWidget(node.widget, afterWidget);
          } else {
            afterWidget(null);
          }
        }
      });

      // Immediately pop first item so there's zero dead air
      finishActiveTypewriter();
      advanceQueue();
    }

    /* ======================================================================
       Drawer (案牍 / 词典 / 设置)
       ====================================================================== */

    function renderDrawerContent() {
      elDrawerTabs.forEach(function (t) {
        t.classList.toggle("is-active", t.getAttribute("data-tab") === activeDrawerTab);
      });

      if (activeDrawerTab === "gloss") {
        if (!state.unlockedGlosses.length) {
          elDrawerBody.innerHTML = '<div class="drawer-empty">尚未翻阅词条释义。<br>点击对话中带虚线的词句即可查阅。</div>';
          return;
        }
        elDrawerBody.innerHTML = state.unlockedGlosses.map(function (id) {
          const g = glossMap[id];
          if (!g) return "";
          return '<div class="drawer-item">' +
            '<div class="drawer-item-title">' + escapeHtml(g.term || id) + "</div>" +
            '<div class="drawer-item-text">' + escapeHtml(g.plain || "") + "</div>" +
            (g.source ? '<div class="drawer-item-meta">' + escapeHtml(g.source) + "</div>" : "") +
          "</div>";
        }).join("");
      } else if (activeDrawerTab === "subtext") {
        if (!state.decodedSubtexts.length) {
          elDrawerBody.innerHTML = '<div class="drawer-empty">尚未破译官场潜台词。<br>点击带橙色虚线「译」字的句子，启动丞相内心翻译机。</div>';
          return;
        }
        elDrawerBody.innerHTML = state.decodedSubtexts.map(function (id) {
          const s = subtextMap[id];
          if (!s) return "";
          return '<div class="drawer-item">' +
            '<div class="drawer-item-title">「' + escapeHtml(s.surface || s.phrase || id) + "」</div>" +
            '<div class="drawer-item-text" style="color:var(--fire);">译：' + escapeHtml(s.cao_decode || s.decode || "") + "</div>" +
            (s.note ? '<div class="drawer-item-meta">' + escapeHtml(s.note) + "</div>" : "") +
          "</div>";
        }).join("");
      } else {
        // Settings & Progress
        const totalEndings = Object.keys(endingsMap).length;
        elDrawerBody.innerHTML =
          '<div class="drawer-item">' +
            '<div class="drawer-item-title">本局进度</div>' +
            '<div class="drawer-item-text">已解锁结局：' + state.discoveredEndings.length + " / " + Math.max(1, totalEndings) + " · 查出破绽：" + Number(state.vars.clues_found || 0) + "</div>" +
          "</div>" +
          '<div class="setting-row">' +
            '<div class="setting-info"><strong>史载 / 拟写微标</strong><span>在气泡右上角标注史料出处属性</span></div>' +
            '<button type="button" class="toggle-pill' + (state.settings.showSourceTags ? " is-on" : "") + '" id="set-tags">' + (state.settings.showSourceTags ? "开启" : "关闭") + "</button>" +
          "</div>" +
          '<div class="setting-row">' +
            '<div class="setting-info"><strong>自动推进节奏</strong><span>自动逐条弹出气泡（仍可随时点击快进）</span></div>' +
            '<button type="button" class="toggle-pill' + (state.settings.autoPace ? " is-on" : "") + '" id="set-auto">' + (state.settings.autoPace ? "自动" : "手动") + "</button>" +
          "</div>" +
          '<div class="setting-row">' +
            '<div class="setting-info"><strong>逐字跳出节奏</strong><span>字符逐一弹跳显现，轻触屏幕可随时快显</span></div>' +
            '<button type="button" class="toggle-pill' + (state.settings.typewriter !== false ? " is-on" : "") + '" id="set-typewriter">' + (state.settings.typewriter !== false ? "开启" : "关闭") + "</button>" +
          "</div>" +
          '<div class="setting-row">' +
            '<div class="setting-info"><strong>触觉震动反馈</strong><span>重音、拍板与军报时触发手机微震</span></div>' +
            '<button type="button" class="toggle-pill' + (state.settings.haptics !== false ? " is-on" : "") + '" id="set-haptics">' + (state.settings.haptics !== false ? "开启" : "关闭") + "</button>" +
          "</div>" +
          '<div class="setting-row">' +
            '<div class="setting-info"><strong>麦田 8x 慢放氛围音</strong><span>开启声音时播放 8 倍慢放田园流行环境音</span></div>' +
            '<button type="button" class="toggle-pill' + (AUDIO.isBgmEnabled() ? " is-on" : "") + '" id="set-bgm">' + (AUDIO.isBgmEnabled() ? "开启" : "关闭") + "</button>" +
          "</div>" +
          '<button type="button" class="btn-danger" id="btn-drawer-restart">重开本局（清空当前进度）</button>';

        const btnTypewriter = document.getElementById("set-typewriter");
        if (btnTypewriter) {
          btnTypewriter.addEventListener("click", function () {
            state.settings.typewriter = state.settings.typewriter === false;
            if (!state.settings.typewriter) finishActiveTypewriter();
            saveState();
            renderDrawerContent();
          });
        }
        const btnHaptics = document.getElementById("set-haptics");
        if (btnHaptics) {
          btnHaptics.addEventListener("click", function () {
            state.settings.haptics = state.settings.haptics === false;
            AUDIO.setHapticsEnabled(state.settings.haptics);
            if (state.settings.haptics) AUDIO.vibrate(10);
            saveState();
            renderDrawerContent();
          });
        }

        const btnTags = document.getElementById("set-tags");
        if (btnTags) {
          btnTags.addEventListener("click", function () {
            state.settings.showSourceTags = !state.settings.showSourceTags;
            document.body.classList.toggle("hide-source-tags", !state.settings.showSourceTags);
            saveState();
            renderDrawerContent();
          });
        }
        const btnAuto = document.getElementById("set-auto");
        if (btnAuto) {
          btnAuto.addEventListener("click", function () {
            state.settings.autoPace = !state.settings.autoPace;
            saveState();
            updateBottomDock();
            renderDrawerContent();
          });
        }
        const btnBgm = document.getElementById("set-bgm");
        if (btnBgm) {
          btnBgm.addEventListener("click", function () {
            AUDIO.setBgmEnabled(!AUDIO.isBgmEnabled());
            renderDrawerContent();
          });
        }
        const btnRestart = document.getElementById("btn-drawer-restart");
        if (btnRestart) {
          btnRestart.addEventListener("click", function () {
            closeDrawer();
            startNewGame();
          });
        }
      }
    }

    function openDrawer() {
      AUDIO.playTick();
      renderDrawerContent();
      elDrawerBackdrop.classList.remove("hidden");
    }

    function closeDrawer() {
      elDrawerBackdrop.classList.add("hidden");
    }

    /* ======================================================================
       Audio UI Sync
       ====================================================================== */

    function syncAudioButtons() {
      const on = AUDIO.isEnabled();
      if (elBtnAudio) {
        elBtnAudio.classList.toggle("is-active", on);
        elBtnAudio.setAttribute("aria-label", on ? "关闭声音" : "开启声音");
        elBtnAudio.innerHTML = on
          ? '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/><path d="M19 5a10 10 0 010 14"/></svg>'
          : '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
      }
      if (elSplashAudio) {
        elSplashAudio.classList.toggle("is-on", on);
        elSplashAudio.textContent = on ? "麦田8x氛围音：已开启" : "麦田8x氛围音：静音";
      }
    }

    /* ======================================================================
       Game Lifecycle (Start / Resume)
       ====================================================================== */

    function startNewGame() {
      const preservedEndings = state.discoveredEndings.slice();
      const preservedSettings = clone(state.settings);
      state = createFreshState();
      state.discoveredEndings = preservedEndings;
      state.settings = preservedSettings;

      cancelActiveTypewriter();
      AUDIO.setHapticsEnabled(state.settings.haptics !== false);
      document.body.classList.toggle("hide-source-tags", !state.settings.showSourceTags);
      elSplash.classList.add("hidden");
      elStream.innerHTML = "";
      pendingQueue = [];
      awaitingWidget = false;
      awaitingChoice = false;

      setMood("calm");
      renderHud(null);
      if (chapters.length) updateChapterStrip(chapters[0].id, false);
      enterNode(STORY.startNode || Object.keys(nodesMap)[0]);
    }

    function resumeGame(saved) {
      cancelActiveTypewriter();
      state = Object.assign(createFreshState(), saved);
      state.settings = Object.assign({ showSourceTags: true, autoPace: false, typewriter: true, haptics: true }, state.settings || {});
      AUDIO.setHapticsEnabled(state.settings.haptics !== false);
      document.body.classList.toggle("hide-source-tags", !state.settings.showSourceTags);
      elSplash.classList.add("hidden");
      elStream.innerHTML = "";
      pendingQueue = [];
      awaitingWidget = false;
      awaitingChoice = false;

      setMood(state.mood || "calm");
      renderHud(null);
      if (state.chapterId != null) updateChapterStrip(state.chapterId, false);

      if (state.finished && state.endingId && endingsMap[state.endingId]) {
        enterEnding(state.endingId);
      } else {
        enterNode(state.nodeId || STORY.startNode);
      }
    }

    /* ======================================================================
       Event Wiring
       ====================================================================== */

    // Populate splash metadata
    const meta = STORY.meta || {};
    if (elSplashTitle && meta.title) elSplashTitle.textContent = meta.title;
    if (elSplashSubtitle && meta.subtitle) elSplashSubtitle.textContent = meta.subtitle;
    if (elSplashTagline && meta.tagline) elSplashTagline.textContent = meta.tagline;
    if (elSplashEra && meta.era) elSplashEra.textContent = meta.era;

    const existingSave = loadSavedState();
    if (existingSave && elBtnResume) {
      elBtnResume.classList.remove("hidden");
      elBtnResume.addEventListener("click", function () {
        AUDIO.playChoice();
        resumeGame(existingSave);
      });
    }

    if (elBtnStart) {
      elBtnStart.addEventListener("click", function () {
        // Enable audio smoothly on first user gesture if user toggled it or keep preference
        AUDIO.playChoice();
        startNewGame();
      });
    }

    if (elSplashAudio) {
      elSplashAudio.addEventListener("click", function () {
        AUDIO.toggle();
        syncAudioButtons();
        if (AUDIO.isEnabled()) AUDIO.playGloss();
      });
    }

    if (elBtnAudio) {
      elBtnAudio.addEventListener("click", function () {
        AUDIO.toggle();
        syncAudioButtons();
        if (AUDIO.isEnabled()) AUDIO.playGloss();
      });
    }

    if (elBtnDrawer) elBtnDrawer.addEventListener("click", openDrawer);
    if (elBtnDrawerClose) elBtnDrawerClose.addEventListener("click", closeDrawer);

    elDrawerBackdrop.addEventListener("click", function (e) {
      if (e.target === elDrawerBackdrop) closeDrawer();
    });

    elDrawerTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeDrawerTab = tab.getAttribute("data-tab") || "gloss";
        AUDIO.playTick();
        renderDrawerContent();
      });
    });

    elModalBackdrop.addEventListener("click", function (e) {
      if (e.target === elModalBackdrop) closePopover();
    });

    // Event delegation on chat stream: Gloss / Subtext / Tap-to-Advance
    elStream.addEventListener("click", function (e) {
      const glossBtn = e.target.closest(".inline-gloss");
      if (glossBtn) {
        e.stopPropagation();
        openGlossPopover(glossBtn.getAttribute("data-gloss"));
        return;
      }

      const subtextBtn = e.target.closest(".inline-subtext");
      if (subtextBtn) {
        e.stopPropagation();
        openSubtextPopover(subtextBtn.getAttribute("data-subtext"));
        return;
      }

      // Ignore taps inside interactive widgets or ending cards
      if (e.target.closest(".widget-card, .ending-card, button")) {
        return;
      }

      if ((activeTypewriter || pendingQueue.length > 0) && !awaitingWidget && !awaitingChoice && !state.finished) {
        advanceQueue();
      }
    });

    elTapPrompt.addEventListener("click", function () {
      advanceQueue();
    });

    // Desktop keyboard convenience (Space/Enter to advance, Escape to close overlays)
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (!elModalBackdrop.classList.contains("hidden")) closePopover();
        if (!elDrawerBackdrop.classList.contains("hidden")) closeDrawer();
        return;
      }

      if (
        (e.key === " " || e.key === "Enter") &&
        elSplash.classList.contains("hidden") &&
        elModalBackdrop.classList.contains("hidden") &&
        elDrawerBackdrop.classList.contains("hidden") &&
        !awaitingWidget &&
        !awaitingChoice &&
        !state.finished &&
        (activeTypewriter || pendingQueue.length > 0)
      ) {
        if (document.activeElement && document.activeElement.tagName === "BUTTON") return;
        e.preventDefault();
        advanceQueue();
      }
    });

    syncAudioButtons();
    renderHud(null);
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initEngine);
    } else {
      initEngine();
    }
  }
})(typeof window !== "undefined" ? window : globalThis);
