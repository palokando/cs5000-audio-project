// Page 4 — Study Completion. Terminal: no router-owned Continue or Quit.
// Study 1 has no localStorage page index to clear, so ctx.finish() is not called.

import { finalizeStudy1 } from "../../supabase.js";
import { questionBlock } from "../../form-helpers.js";

const LOREM = "Lorem ipsum. Thank you for completing the study. Use the code below as your completion submission on Prolific.";
const COMPLETION_CODE = "SAMPLE-CODE-FINAL";

export default {
  id: 4,
  showQuit: false,
  showContinue: false,
  instructions: LOREM,

  mount(container, state) {
    const wrap = questionBlock(container, "Completion code");
    const codeBox = document.createElement("div");
    codeBox.className = "completion-code";
    codeBox.style.fontWeight = "bold";
    codeBox.textContent = COMPLETION_CODE;
    wrap.append(codeBox);

    finalizeStudy1(state.prolificId).catch(() => {});
  },

  validate() { return { ok: true }; },
  async submit() {},
  teardown() {},
};
