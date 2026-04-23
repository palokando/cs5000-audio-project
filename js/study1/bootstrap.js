import { claimStudy1Assignment, getStaticAudioFiles } from "../supabase.js";
import { makeSession } from "./state.js";

import page1 from "./pages/page-1-intro.js";
import page2 from "./pages/page-2-profiling.js";
import page3 from "./pages/page-3-evaluation.js";
import page4 from "./pages/page-4-completion.js";


function getProlificId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("PROLIFIC_PID");
}

export async function start() {
  const prolificId = getProlificId();
  if (!prolificId) throw new Error("Missing PROLIFIC_PID URL parameter.");

  const state = makeSession(prolificId);

  const { assignedSoundCue, snippetUrls } = await claimStudy1Assignment(prolificId);
  state.assignedSoundCue = assignedSoundCue;
  state.snippetUrls = snippetUrls;

  state.staticAudio = await getStaticAudioFiles(["volume_calibration"]);

  return {
    pages: [page1, page2, page3, page4],
    state,
    startIndex: 1,
    persistPage: () => {},
  };
}
