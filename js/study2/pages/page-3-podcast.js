// Page 3 — Podcast Listening. Mandatory once-through, with heartbeat telemetry to update_study2_playback_stats.

import { createPodcastPlayer } from "../../audio-player.js";
import { updateStudy2PlaybackStats } from "../../supabase.js";
import { questionBlock } from "../../form-helpers.js";

const LOREM = "Lorem ipsum. Please listen to the podcast all the way through. The Continue button unlocks 2 seconds before the end. The audio will pause if you switch focus to another window.";

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

    const podcastTitle = {
      ne: "Deep Dive: Nuclear Energy for Power Generation",
      cpr: "Deep Dive: Health Effects of Cell Phone Radiation",
      gmo: "Deep Dive: Applications and Safety of GMO Foods"
    };
    const wrap = questionBlock(container, podcastTitle[state.podcastTopic]);
    player = createPodcastPlayer(wrap, state.podcastUrl, {
      onListenedEnough: () => setReadyCb(true),
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
