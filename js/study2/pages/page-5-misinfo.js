// Page 5 — Misinformation Recognition. Two mandatory snippets, each with a binary judgment and a free-text rationale.

import { createMandatorySnippetPlayer } from "../../audio-player.js";
import { submitStudy2Page5 } from "../../supabase.js";
import { radioGroup, textArea, questionBlock } from "../../form-helpers.js";

const LOREM = "<h1>Page 4: Veracity Assessment</h1><p>Two short excerpts from the podcast are reproduced below. For each snippet, first listen to it all the way through and then indicate whether the discussion within is factually correct or contains misinformation.</p>";
const YES_NO = [["true", "Yes"], ["false", "No"]];

let players = {};
let judgments = {};
let rationales = {};
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (Object.values(players).some((p) => !p?.isListenedEnough())) return { ok: false };
  if (Object.values(judgments).some((r) => r.getValue() === null)) return { ok: false };
  if (Object.values(rationales).some((t) => !t.isFilled())) return { ok: false };
  return { ok: true };
}

export default {
  id: 5,
  showQuit: true,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;

    const orderList = Math.random() < 0.5 ? ["benign", "misinformative"] : ["misinformative", "benign"];
    for (let i = 0; i <= 1; i++) {
      const wrap = questionBlock(container, `Podcast Snippet ${i + 1}`);
      players[orderList[i]] = createMandatorySnippetPlayer(wrap, state.staticAudio[`${state.podcastTopic}_recognize_${orderList[i]}`], { onListenedEnough: recheck });

      judgments[orderList[i]] = radioGroup(container, "Is the information conveyed in the snippet factually accurate?", YES_NO);
      rationales[orderList[i]] = textArea(container, "What makes you think so? (min. 1 sentence)");
    }

    Object.values(judgments).forEach((r) => r.onChange(recheck));
    Object.values(rationales).forEach((t) => t.onChange(recheck));
  },

  validate,

  async submit(state) {
    await submitStudy2Page5(state.prolificId, {
      recognizedB: judgments.benign.getValue() === "true",
      recognizedM: judgments.misinformative.getValue() === "true",
      rationaleB: rationales.benign.getValue(),
      rationaleM: rationales.misinformative.getValue(),
    });
  },

  teardown() {
    Object.values(players).forEach((p) => p?.destroy());
    players = {};
    judgments = {};
    rationales = {};
    setReadyCb = null;
  },
};
