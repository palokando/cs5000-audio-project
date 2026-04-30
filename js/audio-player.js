// Configurable audio player. Wraps a hidden <audio> with custom controls,
// or exposes the native controls when the page allows free-form interaction.

const DEFAULTS = {
  allowBacktrack10s: false,
  allowJumpForward: false,        // when true, native controls are used
  mandatoryThresholdFromEnd: 2,   // seconds; null = not mandatory
  pauseOnWindowBlur: false,
  trackHeartbeat: false,
  heartbeatIntervalMs: null,      // periodic onStatsChanged while playing
  onListenedEnough: () => {},
  onPlay: () => {},
  onPause: () => {},
  onBacktrack: () => {},
  onStatsChanged: () => {},
};

export function createAudioPlayer(container, url, options = {}) {
  const opts = { ...DEFAULTS, ...options };
  const useNative = opts.allowJumpForward;

  const audio = document.createElement("audio");
  audio.src = url;
  audio.preload = "metadata";

  let latestTimeReached = 0;
  let totalPlaytime = 0;
  let pauseClicks = 0;
  let backtrackClicks = 0;
  let listenedEnough = false;
  let lastTickAt = null;
  let isAuthorizedSeek = false;

  const wrap = document.createElement("div");
  wrap.className = "audio-player";

  const playBtn = document.createElement("button");
  playBtn.type = "button";
  playBtn.textContent = "Play";

  let backBtn = null;
  if (opts.allowBacktrack10s) {
    backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.textContent = "Back 10s";
  }

  const elapsedEl = document.createElement("span");
  elapsedEl.className = "audio-time elapsed";
  elapsedEl.textContent = "00:00";

  const totalEl = document.createElement("span");
  totalEl.className = "audio-time total";
  totalEl.textContent = "00:00";

  const bar = document.createElement("div");
  bar.className = "audio-bar";
  bar.setAttribute("aria-hidden", "true");
  const barFill = document.createElement("div");
  barFill.className = "audio-bar-fill";
  bar.append(barFill);

  if (useNative) {
    audio.controls = true;
    wrap.append(audio);
  } else {
    wrap.append(playBtn);
    if (backBtn) wrap.append(backBtn);
    wrap.append(elapsedEl, bar, totalEl);
    wrap.append(audio);
  }
  container.append(wrap);

  function mmss(t) {
    if (!Number.isFinite(t) || t < 0) return "00:00";
    const total = Math.floor(t);
    const m = Math.floor(total / 60).toString().padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
  function refreshStatus() {
    if (useNative) return;
    elapsedEl.textContent = mmss(audio.currentTime);
    totalEl.textContent = mmss(audio.duration);
    const pct = Number.isFinite(audio.duration) && audio.duration > 0
      ? Math.min(100, (audio.currentTime / audio.duration) * 100)
      : 0;
    barFill.style.width = `${pct}%`;
  }
  function checkListenedEnough() {
    if (listenedEnough) return;
    if (opts.mandatoryThresholdFromEnd === null) return;
    if (!Number.isFinite(audio.duration)) return;
    if (audio.duration - latestTimeReached <= opts.mandatoryThresholdFromEnd) {
      listenedEnough = true;
      opts.onListenedEnough();
    }
  }
  function emitStats() { if (opts.trackHeartbeat) opts.onStatsChanged(getStats()); }

  // Block forward seeking when not allowed.
  audio.addEventListener("seeking", () => {
    if (isAuthorizedSeek) { isAuthorizedSeek = false; return; }
    if (!opts.allowJumpForward && audio.currentTime > latestTimeReached + 0.5) {
      audio.currentTime = latestTimeReached;
    }
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.currentTime > latestTimeReached) latestTimeReached = audio.currentTime;
    refreshStatus();
    checkListenedEnough();
  });

  audio.addEventListener("loadedmetadata", () => {
    refreshStatus();
    checkListenedEnough();
  });

  function tickPlaytime() {
    const now = performance.now();
    if (lastTickAt !== null && !audio.paused) {
      totalPlaytime += (now - lastTickAt) / 1000;
    }
    lastTickAt = audio.paused ? null : now;
  }
  let playtimeInterval = null;
  let heartbeatInterval = null;

  audio.addEventListener("play", () => {
    lastTickAt = performance.now();
    playtimeInterval = setInterval(tickPlaytime, 250);
    if (opts.heartbeatIntervalMs && opts.trackHeartbeat) {
      heartbeatInterval = setInterval(emitStats, opts.heartbeatIntervalMs);
    }
    if (!useNative) playBtn.textContent = "Pause";
    opts.onPlay();
  });
  audio.addEventListener("pause", () => {
    tickPlaytime();
    if (playtimeInterval)  { clearInterval(playtimeInterval);  playtimeInterval = null; }
    if (heartbeatInterval) { clearInterval(heartbeatInterval); heartbeatInterval = null; }
    lastTickAt = null;
    if (!useNative) playBtn.textContent = "Play";
    emitStats();
  });
  audio.addEventListener("ended", () => {
    checkListenedEnough();
    emitStats();
  });

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      pauseClicks++;
      audio.pause();
      opts.onPause();
    }
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      backtrackClicks++;
      isAuthorizedSeek = true;
      audio.currentTime = Math.max(0, audio.currentTime - 10);
      opts.onBacktrack();
      emitStats();
    });
  }

  let onBlur = null;
  if (opts.pauseOnWindowBlur) {
    onBlur = () => { if (!audio.paused) audio.pause(); };
    window.addEventListener("blur", onBlur);
  }

  function getStats() {
    return {
      latestTimeReached: Math.floor(latestTimeReached),
      totalPlaytime: Math.floor(totalPlaytime),
      pauseClicks,
      backtrackClicks,
    };
  }

  function destroy() {
    try { audio.pause(); } catch {}
    if (playtimeInterval)  clearInterval(playtimeInterval);
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (onBlur) window.removeEventListener("blur", onBlur);
    audio.src = "";
    wrap.remove();
  }

  return {
    isListenedEnough: () => listenedEnough,
    getStats,
    destroy,
  };
}

// Convenience presets matching the spec's audio-player flavors.

export function createCalibrationPlayer(container, url, hooks = {}) {
  return createAudioPlayer(container, url, {
    allowBacktrack10s: false,
    allowJumpForward: false,
    mandatoryThresholdFromEnd: 2,
    ...hooks,
  });
}

export function createPodcastPlayer(container, url, hooks = {}) {
  return createAudioPlayer(container, url, {
    allowBacktrack10s: true,
    allowJumpForward: false,
    mandatoryThresholdFromEnd: 2,
    pauseOnWindowBlur: true,
    trackHeartbeat: true,
    heartbeatIntervalMs: 2000,
    ...hooks,
  });
}

export function createMandatorySnippetPlayer(container, url, hooks = {}) {
  return createAudioPlayer(container, url, {
    allowBacktrack10s: true,
    allowJumpForward: false,
    mandatoryThresholdFromEnd: 2,
    ...hooks,
  });
}

export function createFreeFormPlayer(container, url, hooks = {}) {
  return createAudioPlayer(container, url, {
    allowBacktrack10s: false,
    allowJumpForward: true,
    mandatoryThresholdFromEnd: null,
    ...hooks,
  });
}
