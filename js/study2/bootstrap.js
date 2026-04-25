import {
  claimStudy2Assignment,
  getStaticAudioFiles,
  abortStudy2,
} from "../supabase.js";

import { makeSession, loadPage, savePage, clearPage } from "./state.js";

import page1 from "./pages/page-1-intro.js";
import page2 from "./pages/page-2-profiling.js";
import page3 from "./pages/page-3-podcast.js";
import page4 from "./pages/page-4-recall.js";
import page5 from "./pages/page-5-misinfo.js";
import page6 from "./pages/page-6-warning.js";
import page7 from "./pages/page-7-debrief.js";
import page8 from "./pages/page-8-completion.js";
import pageExit from "./pages/page-exit.js";


function getProlificId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("PROLIFIC_PID");
}

export async function start() {
  const prolificId = getProlificId();
  if (!prolificId) throw new Error("Missing PROLIFIC_PID URL parameter.");

  const state = makeSession(prolificId);

  const { assignedCondition, podcastFileUrl, podcastFileName, podcastTopic } = await claimStudy2Assignment(prolificId);
  state.condition = assignedCondition;
  state.podcastUrl = podcastFileUrl;
  state.podcastTopic = podcastTopic;
  state.podcastName = podcastFileName;

  const staticAudioKeys = [
    `${podcastTopic}_volume_calibration`,
    `${podcastTopic}_recognize_benign`,
    `${podcastTopic}_recognize_misinformative`,
  ];
  if (!podcastFileName.startsWith("without")) {
    staticAudioKeys.push(`${podcastFileName}_1`, `${podcastFileName}_2`, `${podcastFileName}_3`);
  }

  state.staticAudio = await getStaticAudioFiles(staticAudioKeys);

  const startIndex = loadPage(prolificId);

  return {
    pages: [page1, page2, page3, page4, page5, page6, page7, page8],
    exitPage: pageExit,
    state,
    startIndex,
    abortStudy: abortStudy2,
    persistPage: savePage(prolificId),
    clearPage: clearPage(prolificId),
  };
}
