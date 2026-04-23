// Page 5 — Misinformation Recognition. Two mandatory snippets, each with a binary judgment and a free-text rationale.

import { createMandatorySnippetPlayer } from "../../audio-player.js";
import { submitStudy2Page5 } from "../../supabase.js";
import { radioGroup, textArea, questionBlock } from "../../form-helpers.js";

const LOREM = "Lorem ipsum. Two short clips from the podcast are reproduced below. For each, indicate whether the information conveyed is factually accurate.";
const YES_NO = [["true", "Yes"], ["false", "No"]];

let players = [];
let judgments = [];
let rationales = [];
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (players.some((p) => !p?.isListenedEnough())) return { ok: false };
  if (judgments.some((r) => r.getValue() === null)) return { ok: false };
  if (rationales.some((t) => !t.isFilled())) return { ok: false };
  return { ok: true };
}

export default {
  id: 5,
  showQuit: true,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    players = [];
    judgments = [];
    rationales = [];

    for (let i = 1; i <= 2; i++) {
      const url = state.staticAudio[`misinfo_snippet_${i}`];
      const wrap = questionBlock(container, `Snippet ${i}`);
      players.push(createMandatorySnippetPlayer(wrap, url, { onListenedEnough: recheck }));

      judgments.push(radioGroup(container, "Is the information conveyed in the snippet factually accurate?", YES_NO));
      rationales.push(textArea(container, "What makes you think so? (1-2 sentences)"));
    }

    judgments.forEach((r) => r.onChange(recheck));
    rationales.forEach((t) => t.onChange(recheck));
  },

  validate,

  async submit(state) {
    await submitStudy2Page5(state.prolificId, {
      recognized1: judgments[0].getValue() === "true",
      recognized2: judgments[1].getValue() === "true",
      rationale1: rationales[0].getValue(),
      rationale2: rationales[1].getValue(),
    });
  },

  teardown() {
    players.forEach((p) => p?.destroy());
    players = [];
    judgments = [];
    rationales = [];
    setReadyCb = null;
  },
};
