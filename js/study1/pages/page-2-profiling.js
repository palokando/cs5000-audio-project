// Page 2 — Participant Profiling. Demographics + volume calibration.

import { createCalibrationPlayer } from "../../audio-player.js";
import { submitStudy1Page2 } from "../../supabase.js";
import { radioGroup, textInput, checkbox, questionBlock } from "../../form-helpers.js";

const LOREM = "<h1>Page 1: Participant Characteristics</h1><p>Please answer the following general questions, then complete the volume calibration before continuing.</p>";

const AGE_OPTIONS = [
  ["18-24", "18-24 years old"], ["25-34", "25-34 years old"],
  ["35-44", "35-44 years old"], ["45-54", "45-54 years old"],
  ["55-64", "55-64 years old"], ["65+", "65+ years old"],
  ["Unspecified", "Prefer not to say"],
];
const GENDER_OPTIONS = [
  ["Male", "Male"], ["Female", "Female"],
  ["Non-Binary", "Non-binary"], ["Unspecified", "Prefer not to say"],
];

let fields = null;
let calibrationPlayer = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };
  if (fields.age.getValue() === null) return { ok: false };
  if (fields.gender.getValue() === null) return { ok: false };
  if (!fields.nativeChk.isChecked() && fields.nativeText.getValue().trim() === "") {
    return { ok: false };
  }
  if (!calibrationPlayer || !calibrationPlayer.isListenedEnough()) return { ok: false };
  return { ok: true };
}

export default {
  id: 2,
  showQuit: false,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    fields = {};

    fields.age = radioGroup(container, "How old are you?", AGE_OPTIONS);
    fields.gender = radioGroup(container, "What is your gender?", GENDER_OPTIONS);

    fields.nativeText = textInput(container, "What is your native language?", { maxLength: 25 });
    fields.nativeChk = checkbox(fields.nativeText.element, "Prefer not to say");
    fields.nativeChk.onChange(() => {
      fields.nativeText.setDisabled(fields.nativeChk.isChecked());
      recheck();
    });
    fields.nativeText.onChange(recheck);

    [fields.age, fields.gender].forEach((r) => r.onChange(recheck));

    const calibWrap = questionBlock(container, "This audio sample is a short conversation excerpt. To proceed, please play the snippet and set your volume to a comfortable level such that both speakers are clearly audible.");
    calibrationPlayer = createCalibrationPlayer(calibWrap, state.staticAudio.volume_calibration, {
      onListenedEnough: recheck,
    });
  },

  validate,

  async submit(state) {
    await submitStudy1Page2(state.prolificId, {
      age: fields.age.getValue(),
      gender: fields.gender.getValue(),
      nativeTongue: fields.nativeChk.isChecked() ? null : fields.nativeText.getValue().trim(),
    });
  },

  teardown() {
    calibrationPlayer?.destroy();
    calibrationPlayer = null;
    fields = null;
    setReadyCb = null;
  },
};
