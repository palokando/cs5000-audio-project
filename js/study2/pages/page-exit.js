// Premature Study Exit. No buttons, just the completion code marker.

import { questionBlock } from "../../form-helpers.js";

const LOREM = "You have exited the study. Use the code below as your completion submission on Prolific.";
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
