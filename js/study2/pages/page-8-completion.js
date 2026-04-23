// Page 8 — Study Completion. Terminal: no router-owned Continue or Quit.

import { finalizeStudy2 } from "../../supabase.js";
import { questionBlock } from "./_helpers.js";

const LOREM = "Lorem ipsum. Thank you for completing the study. Optionally provide feedback below, then submit to receive your completion code.";
const COMPLETION_CODE = "SAMPLE-CODE-FINAL";

export default {
  id: 8,
  showQuit: false,
  showContinue: false,
  instructions: LOREM,

  mount(container, state, ctx) {
    const wrap = questionBlock(container, "Completion code");
    const codeBox = document.createElement("div");
    codeBox.className = "completion-code";
    codeBox.style.fontWeight = "bold";
    codeBox.textContent = COMPLETION_CODE;
    wrap.append(codeBox);

    finalizeStudy2(state.prolificId).catch(() => {});
    ctx.finish();
  },

  validate() { return { ok: true }; },
  async submit() {},
  teardown() {},
};
