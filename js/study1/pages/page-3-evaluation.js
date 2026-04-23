// Page 3 — Subjective Sound Evaluation. Three mandatory snippets, then a
// conceptual-mapping prompt, an elicited-reaction prompt, four 5-point Likerts,
// and an optional task-feedback box.

import { createMandatorySnippetPlayer } from "../../audio-player.js";
import { submitStudy1Page3 } from "../../supabase.js";
import { likert, textArea, questionBlock } from "../../form-helpers.js";

const LOREM = "Lorem ipsum. Please listen to all three short excerpts before answering. Each player exposes only Pause/Play and a Back-10s control.";
const FIVE_PT = ["Not at all", "Slightly", "Moderately", "Very", "Extremely"];

let players = [];
let fields = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };
  if (players.length !== 3 || players.some((p) => !p?.isListenedEnough())) return { ok: false };
  if (!fields.conceptual.isFilled()) return { ok: false };
  if (!fields.elicited.isFilled()) return { ok: false };
  if ([fields.recognizability, fields.distraction, fields.abruptness, fields.interruption]
      .some((r) => r.getValue() === null)) return { ok: false };
  return { ok: true };
}

export default {
  id: 3,
  showQuit: false,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    players = [];
    fields = {};

    for (let i = 0; i < 3; i++) {
      const wrap = questionBlock(container, `Audio snippet ${i + 1}`);
      players.push(createMandatorySnippetPlayer(wrap, state.snippetUrls[i], {
        onListenedEnough: recheck,
      }));
    }

    fields.conceptual = textArea(container, "What does the sound remind you of – does it match any real-world object or situation? Please type in what associations you make (1-2 sentences), and feel free to replay the provided audio snippets if you need to hear the sound again.");
    fields.elicited   = textArea(container, "What was your reaction the first time you heard the sound while listening to the conversation excerpts? Please discuss the experience and your thoughts in the text box below (2-3 sentences).");

    fields.recognizability = likert(container, "Using the respective scale below, please indicate the extent to which:\n\n...The real-world entity you associate with the sound was easy to recognize upon hearing it.", 5, FIVE_PT);
    fields.distraction     = likert(container, "...You found the sound distracting while listening.", 5, FIVE_PT);
    fields.abruptness      = likert(container, "...The sound seemed out of place whenever it occurred.", 5, FIVE_PT);
    fields.interruption    = likert(container, "...The sound interrupted your overall listening experience.", 5, FIVE_PT);

    fields.taskFeedback = textArea(container, "Based on your experience completing this task, please (optionally) provide any feedback or suggestions for improvement you consider relevant in the text box below.", { required: false });

    [fields.recognizability, fields.distraction, fields.abruptness, fields.interruption]
      .forEach((r) => r.onChange(recheck));
    [fields.conceptual, fields.elicited].forEach((t) => t.onChange(recheck));
  },

  validate,

  async submit(state) {
    await submitStudy1Page3(state.prolificId, {
      conceptualMapping: fields.conceptual.getValue(),
      elicitedReaction:  fields.elicited.getValue(),
      recognizability: parseInt(fields.recognizability.getValue(), 10),
      distraction:     parseInt(fields.distraction.getValue(), 10),
      abruptness:      parseInt(fields.abruptness.getValue(), 10),
      interruption:    parseInt(fields.interruption.getValue(), 10),
      taskFeedback: fields.taskFeedback.isFilled() ? fields.taskFeedback.getValue() : null,
    });
  },

  teardown() {
    players.forEach((p) => p?.destroy());
    players = [];
    fields = null;
    setReadyCb = null;
  },
};
