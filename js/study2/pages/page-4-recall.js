// Page 4 — Recall Assessment.

import { submitStudy2Page4 } from "../../supabase.js";
import { radioGroup, textArea } from "./_helpers.js";

const LOREM = "Lorem ipsum. Please answer the following questions about the podcast you just listened to.";

const ABCD = [["A", "A. ANSWER-A"], ["B", "B. ANSWER-B"], ["C", "C. ANSWER-C"], ["D", "D. ANSWER-D"]];
const YES_NO = [["true", "Yes"], ["false", "No"]];
const FREQ_OPTS = [["1", "Once"], ["2", "Twice"], ["3", "Three times or more"]];
const DENSITY_OPTS = [
  ["1", "1 – Too sparse"], ["2", "2 – Sparse"], ["3", "3 – Moderate"],
  ["4", "4 – Cluttered"], ["5", "5 – Too cluttered"],
];
const PACE_OPTS = [
  ["1", "1 – Very slow"], ["2", "2 – Slow"], ["3", "3 – Moderate"],
  ["4", "4 – Fast"], ["5", "5 – Very fast"],
];

let fields = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };
  if (fields.recall.some((r) => r.getValue() === null)) return { ok: false };
  if (fields.recognized.getValue() === null) return { ok: false };

  const recognizedFlag = fields.recognized.getValue() === "true";
  if (recognizedFlag && fields.freq.getValue() === null) return { ok: false };
  if (recognizedFlag && !fields.purpose.isFilled()) return { ok: false };

  if (!fields.statsRationale.isFilled()) return { ok: false };
  if (fields.density.getValue() === null) return { ok: false };
  if (fields.pace.getValue() === null) return { ok: false };
  return { ok: true };
}

export default {
  id: 4,
  showQuit: true,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    fields = { recall: [] };

    for (let i = 1; i <= 15; i++) {
      fields.recall.push(radioGroup(container, `SAMPLE-QUESTION-OUT-OF-15 #${i}`, ABCD));
    }

    fields.recognized = radioGroup(
      container,
      "Can you recall hearing a distinctive non-verbal sound that might have occurred while the two hosts were talking?",
      YES_NO
    );
    fields.freq = radioGroup(
      container,
      "How many times can you recall hearing the sound throughout the podcast?",
      FREQ_OPTS
    );
    fields.purpose = textArea(container, "What do you think the purpose of the sound was? (1 sentence)");

    // Frequency and purpose are only relevant when Yes.
    fields.recognized.onChange(() => {
      const recogizedCheck = fields.recognized.getValue() === "true";
      fields.freq.setDisabled(!recogizedCheck);
      fields.purpose.setDisabled(!recogizedCheck);
      recheck();
    });

    const X = state.page3Stats.pauseClicks ?? 0;
    const Y = state.page3Stats.backtrackClicks ?? 0;
    fields.statsRationale = textArea(
      container,
      `While listening to the podcast, you paused ${X} times and backtracked ${Y} times – as far as you can recall, what urged you to occasionally pause/rewind the recording? (1 sentence)`
    );

    fields.density = radioGroup(container, "How dense did the podcast seem in terms of the amount of information it conveyed?", DENSITY_OPTS);
    fields.pace    = radioGroup(container, "Please rate the podcast's pace using the scale below.", PACE_OPTS);

    [...fields.recall, fields.freq, fields.density, fields.pace].forEach((r) => r.onChange(recheck));
    [fields.purpose, fields.statsRationale].forEach((t) => t.onChange(recheck));
  },

  validate,

  async submit(state) {
    const yes = fields.recognized.getValue() === "true";
    const v = {
      recall: fields.recall.map((r) => r.getValue()),
      soundRecognized: yes,
      recognitionFreq: yes ? parseInt(fields.freq.getValue(), 10) : null,
      presumedPurpose: yes ? fields.purpose.getValue() : null,
      statsRationale: fields.statsRationale.getValue(),
      podcastDensity: parseInt(fields.density.getValue(), 10),
      podcastPace:    parseInt(fields.pace.getValue(), 10),
    };
    await submitStudy2Page4(state.prolificId, v);
    state.soundRecognized = yes;
  },

  teardown() {
    fields = null;
    setReadyCb = null;
  },
};
