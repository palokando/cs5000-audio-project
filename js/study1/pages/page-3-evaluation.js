// Page 3 — Subjective Sound Evaluation. Three mandatory snippets, then a
// conceptual-mapping prompt, an elicited-reaction prompt, four 5-point Likerts,
// and an optional task-feedback box.

import { createMandatorySnippetPlayer } from "../../audio-player.js";
import { submitStudy1Page3 } from "../../supabase.js";
import { likertMatrix, textArea, questionBlock } from "../../form-helpers.js";

const LOREM = "<h1>Page 2: Sound Evaluation</h1><p>Listen to all three conversation snippets below at least once. Afterwards, answer the questions based on your subjective impressions of the sound cue.</p>";

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
      const wrap = questionBlock(container, `Audio Sample ${i + 1}`);
      players.push(createMandatorySnippetPlayer(wrap, state.snippetUrls[i], {
        onListenedEnough: recheck,
      }));
    }

    fields.conceptual = textArea(container, "What does the sound remind you of — does it match any real-world object or situation? Please type in what associations you make (1-2 sentences), and feel free to replay the provided audio snippets if you need to hear the sound again.");
    fields.elicited   = textArea(container, "What was your reaction the first time you heard the sound while listening to the conversation excerpts? Please discuss the experience and your thoughts in the text box below (2-3 sentences).");

    const matrix = likertMatrix(container, {
      promptHTML: "Using the respective scale below, please indicate the extent to which:",
      scaleLabelsHTML: "<i>(1 – Not at all, 2 – Slightly, 3 – Moderately, 4 – Very, 5 – Extremely)</i>",
      n: 5,
      questions: [
        { key: "recognizability", label: "The real-world entity you associate with the sound was easy to recognize upon hearing it." },
        { key: "distraction",     label: "You found the sound distracting while listening." },
        { key: "abruptness",      label: "The sound seemed out of place whenever it occurred." },
        { key: "interruption",    label: "The sound interrupted your overall listening experience." },
      ],
    });
    fields.recognizability = matrix.recognizability;
    fields.distraction     = matrix.distraction;
    fields.abruptness      = matrix.abruptness;
    fields.interruption    = matrix.interruption;

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
