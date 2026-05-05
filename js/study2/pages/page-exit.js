// Premature Study Exit. No buttons.

import { questionBlock } from "../../form-helpers.js";

const LOREM = "<p>You have exited the study. Before closing the webpage, copy the code below to finalize your submission on Prolific.</p>";
const PREMATURE_CODE = "SAMPLE-CODE-PREMATURE";

export default {
  id: "exit",
  showQuit: false,
  showContinue: false,
  instructions: LOREM,

  mount(container) {
    const wrap = questionBlock(container, "Completion code");
    const codeBox = document.createElement("div");
    codeBox.className = "completion-code";
    codeBox.style.fontWeight = "bold";
    codeBox.textContent = PREMATURE_CODE;
    wrap.append(codeBox);
  },

  validate() { return { ok: true }; },
  async submit() {},
  teardown() {},
};
