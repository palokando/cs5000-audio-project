// Page 7 — Post-Study Debrief. No Quit button per spec.

import { submitStudy2Page7 } from "../../supabase.js";
import { checkbox, textArea } from "../../form-helpers.js";

const LOREM = "Lorem ipsum. Below is the actual research objective. Please reaffirm your consent and reflect on the questions that follow.";

let fields = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };

  const consentGranted = fields.consent.isChecked();
  if (!consentGranted) return { ok: true };
  if (consentGranted && !fields.immediate.isFilled()) return { ok: false };
  if (consentGranted && !fields.downstream.isFilled()) return { ok: false };

  return { ok: true };
}

export default {
  id: 7,
  showQuit: false,
  showContinue: true,
  instructions: LOREM,

  mount(container, _state, ctx) {
    setReadyCb = ctx.setReady;
    fields = {};
    fields.consent = checkbox(container, "I acknowledge that I have read and understood the information presented above, am aware of the true research objectives, and approve the use and analysis of my submission.");
    fields.immediate  = textArea(container, "Now knowing the sound's meaning, how would you react if you heard it while listening to one of your regular podcasts? (1-2 sentences)");
    fields.downstream = textArea(container, "What would your follow-up actions be, if any, in response to hearing the misinformation warning? (1-2 sentences)");
    fields.feedback = textArea(container, "Based on your experience completing this task, please (optionally) provide any feedback or suggestions for improvement you consider relevant in the text box below.", { required: false });

    fields.consent.onChange(recheck);
    fields.immediate.onChange(recheck);
    fields.downstream.onChange(recheck);
  },

  validate,

  async submit(state) {
    await submitStudy2Page7(state.prolificId, {
      informedConsent: fields.consent.isChecked(),
      immediateReaction:  fields.immediate.getValue(),
      downstreamBehavior: fields.downstream.getValue(),
      taskFeedback: fields.feedback.isFilled() ? fields.feedback.getValue() : null,
    });
  },

  teardown() {
    fields = null;
    setReadyCb = null;
  },
};
