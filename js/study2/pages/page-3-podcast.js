// Page 3 — Podcast Listening. Mandatory once-through, with heartbeat telemetry to update_study2_playback_stats.

import { createPodcastPlayer } from "../../audio-player.js";
import { updateStudy2PlaybackStats } from "../../supabase.js";
import { questionBlock } from "../../form-helpers.js";

const LOREM = "<h1>Page 2: Podcast Listening</h1><p>The podcast underpinning this study is accessible via the audio player below. Please listen attentively and freely use the Pause/Play and Backtrack buttons as needed. Note that the player will automatically pause if you switch focus to another window: after the full duration of the podcast has elapsed, the Continue button will become active.</p>";

let player = null;
let setReadyCb = null;
let prolificId = null;
let beforeUnloadHandler = null;

async function pushStats(stats) {
  try { await updateStudy2PlaybackStats(prolificId, stats); }
  catch (err) { console.warn("playback stats push failed", err); }
}

export default {
  id: 3,
  showQuit: true,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    prolificId = state.prolificId;
    setReadyCb(false);
    // setReadyCb(true);

    const podcastTitle = {
      ne: "Deep Dive: Nuclear Energy for Power Generation",
      cpr: "Deep Dive: Health Effects of Cell Phone Radiation",
      gmo: "Deep Dive: Applications and Safety of GMO Foods"
    };
    const wrap = questionBlock(container, podcastTitle[state.podcastTopic]);
    player = createPodcastPlayer(wrap, state.podcastUrl, {
      onListenedEnough: () => setReadyCb(true),
      // onListenedEnough: () => {},
      onStatsChanged: pushStats,
    });

    // Best-effort final flush on tab close.
    beforeUnloadHandler = () => {
      if (player) pushStats(player.getStats());
    };
    window.addEventListener("beforeunload", beforeUnloadHandler);
  },

  validate() {
    return { ok: !!player && player.isListenedEnough() };
    // return { ok: true };
  },

  async submit(state) {
    // Heartbeat already wrote the stats; final push to be safe.
    if (player) {
      const stats = player.getStats();
      state.page3Stats = stats;
      await pushStats(stats);
    }
  },

  teardown() {
    if (beforeUnloadHandler) window.removeEventListener("beforeunload", beforeUnloadHandler);
    beforeUnloadHandler = null;
    player?.destroy();
    player = null;
    setReadyCb = null;
    prolificId = null;
  },
};
