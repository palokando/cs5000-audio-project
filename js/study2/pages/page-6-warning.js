// Page 6 — Subjective Warning Evaluation. Skipped for control-group ('without')
// participants and for those who answered No to the sound-recognition question.

import { createFreeFormPlayer } from "../../audio-player.js";
import { submitStudy2Page6 } from "../../supabase.js";
import { radioGroup, likert, textArea, questionBlock } from "../../form-helpers.js";

const LOREM = "Lorem ipsum. Below are three excerpts containing the warning sound. Listen to them as needed (all controls are available) before answering.";
const ACCLIMATE_OPTS = [
  ["1", "Became less pronounced"],
  ["2", "Remained stable throughout"],
  ["3", "Became more pronounced"],
];
const FIVE_PT = ["Not at all", "Slightly", "Moderately", "Very", "Extremely"];

let players = [];
let fields = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };
  if (!fields.conceptual.isFilled()) return { ok: false };
  if (!fields.elicited.isFilled()) return { ok: false };
  if (fields.acclimateTrend.getValue() === null) return { ok: false };
  if (!fields.acclimateRationale.isFilled()) return { ok: false };
  if ([fields.recognizability, fields.distraction, fields.abruptness, fields.interruption]
      .some((r) => r.getValue() === null)) return { ok: false };
  return { ok: true };
}

export default {
  id: 6,
  showQuit: true,
  showContinue: true,
  instructions: LOREM,

  skipIf(state) {
    return state.condition === "without" || state.soundRecognized === false;
  },

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    players = [];
    fields = {};

    for (let i = 1; i <= 3; i++) {
      const url = state.staticAudio[`warning_snippet_${i}`];
      const wrap = questionBlock(container, `Warning snippet ${i}`);
      players.push(createFreeFormPlayer(wrap, url));
    }

    fields.conceptual = textArea(container, "What does the sound remind you of – does it match any real-world object or situation? Please type in what associations you make (1-2 sentences), and feel free to replay the provided audio snippets if you need to hear the sound again.");
    fields.elicited   = textArea(container, "What was your reaction the first time you heard the sound while listening to the podcast? Please discuss the experience and your thoughts in the text box below (2-3 sentences).");

    fields.acclimateTrend     = radioGroup(container, "Did your initial perceptions of the sound change as it re-occurred throughout the podcast? Please select an option...", ACCLIMATE_OPTS);
    fields.acclimateRationale = textArea(container, "...and elaborate in the text box below (1-2 sentences).");

    fields.recognizability = likert(container, "Using the respective scales below, please indicate the extent to which:\n\n...The real-world entity you associate with the sound was easy to recognize upon hearing it.", 5, FIVE_PT);
    fields.distraction     = likert(container, "...You found the sound distracting while listening.", 5, FIVE_PT);
    fields.abruptness      = likert(container, "...The sound seemed out of place whenever it occurred.", 5, FIVE_PT);
    fields.interruption    = likert(container, "...The sound interrupted your overall listening experience.", 5, FIVE_PT);

    [fields.acclimateTrend, fields.recognizability, fields.distraction, fields.abruptness, fields.interruption]
      .forEach((r) => r.onChange(recheck));
    [fields.conceptual, fields.elicited, fields.acclimateRationale]
      .forEach((t) => t.onChange(recheck));
  },

  validate,

  async submit(state) {
    await submitStudy2Page6(state.prolificId, {
      conceptualMapping: fields.conceptual.getValue(),
      elicitedReaction:  fields.elicited.getValue(),
      acclimateTrend:    parseInt(fields.acclimateTrend.getValue(), 10),
      acclimateRationale: fields.acclimateRationale.getValue(),
      recognizability: parseInt(fields.recognizability.getValue(), 10),
      distraction:     parseInt(fields.distraction.getValue(), 10),
      abruptness:      parseInt(fields.abruptness.getValue(), 10),
      interruption:    parseInt(fields.interruption.getValue(), 10),
    });
  },

  teardown() {
    players.forEach((p) => p?.destroy());
    players = [];
    fields = null;
    setReadyCb = null;
  },
};
