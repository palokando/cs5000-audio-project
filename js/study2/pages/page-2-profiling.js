// Page 2 — Participant Profiling. The big demographics + scales page.

import { createCalibrationPlayer } from "../../audio-player.js";
import { submitStudy2Page2 } from "../../supabase.js";
import {
  radioGroup, likert, textInput, numberInput, checkbox, questionBlock,
} from "../../form-helpers.js";

const LOREM = "Lorem ipsum dolor sit amet. Please answer the following questions about yourself, then complete the volume calibration before continuing.";

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
const FREQ_OPTIONS = [
  ["1", "Daily"], ["2", "Weekly"], ["3", "Monthly"], ["4", "Less than monthly"],
];

let fields = null;
let calibrationPlayer = null;
let setReadyCb = null;

function recheck() {
  setReadyCb?.(validate().ok);
}

function validate() {
  if (!fields) return { ok: false };
  const allRadios = [
    fields.age, fields.gender, fields.frequency,
    fields.topicFamiliarity, fields.priorStance,
    fields.attitudeImportance, fields.attitudeElaboration, fields.attitudeMoralization,
    ...fields.nfc, ...fields.ihs,
  ];
  if (allRadios.some((r) => r.getValue() === null)) return { ok: false };

  // Native tongue: either checkbox checked, or text non-empty
  if (!fields.nativeChk.isChecked() && fields.nativeText.getValue().trim() === "") {
    return { ok: false };
  }

  if (!fields.years.isFilled() || !fields.hrw.isFilled() || !fields.pcm.isFilled()) {
    return { ok: false };
  }

  if (!calibrationPlayer || !calibrationPlayer.isListenedEnough()) return { ok: false };

  return { ok: true };
}

function collect() {
  return {
    age: fields.age.getValue(),
    gender: fields.gender.getValue(),
    nativeTongue: fields.nativeChk.isChecked() ? null : fields.nativeText.getValue().trim(),
    listeningFrequency: parseInt(fields.frequency.getValue(), 10),
    listeningAmountYrs: fields.years.getValue(),
    listeningAmountHrw: fields.hrw.getValue(),
    listeningAmountPcm: fields.pcm.getValue(),
    topicFamiliarity: parseInt(fields.topicFamiliarity.getValue(), 10),
    priorStance: parseInt(fields.priorStance.getValue(), 10),
    attitudeImportance: parseInt(fields.attitudeImportance.getValue(), 10),
    attitudeElaboration: parseInt(fields.attitudeElaboration.getValue(), 10),
    attitudeMoralization: parseInt(fields.attitudeMoralization.getValue(), 10),
    nfc: fields.nfc.map((r) => parseInt(r.getValue(), 10)),
    ihs: fields.ihs.map((r) => parseInt(r.getValue(), 10)),
  };
}

export default {
  id: 2,
  showQuit: true,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    fields = {};

    fields.age = radioGroup(container, "How old are you?", AGE_OPTIONS);
    fields.gender = radioGroup(container, "What is your gender?", GENDER_OPTIONS);

    // Native tongue with toggling text input
    fields.nativeText = textInput(container, "What is your native language?", { maxLength: 25 });
    fields.nativeChk = checkbox(fields.nativeText.element, "Prefer not to say");
    fields.nativeChk.onChange(() => {
      fields.nativeText.setDisabled(fields.nativeChk.isChecked());
      recheck();
    });
    fields.nativeText.onChange(recheck);

    fields.frequency = radioGroup(container, "How often do you listen to podcasts?", FREQ_OPTIONS);

    fields.years = numberInput(container, "How many years have you been listening to podcasts?", { suffix: "years" });
    fields.hrw   = numberInput(container, "How many hours per week do you spend listening to podcasts?", { suffix: "hours per week" });
    fields.pcm   = numberInput(container, "How many different podcasts do you listen to in a typical month?", { suffix: "podcasts per month" });

    fields.topicFamiliarity = likert(container, "How would you describe your current knowledge on the topic?", 7, ["Non-existent","Very poor","Below average","Average","Above average","Very good","Excellent"]);
    fields.priorStance = likert(container, "What is your stance on the following claim? 'SAMPLE-CLAIM'", 7, ["Strongly disagree","Disagree","Somewhat disagree","Neither agree nor disagree","Somewhat agree","Agree","Strongly agree"]);
    fields.attitudeImportance = likert(container, "How important is your attitude on this topic to you?", 7, ["Not important at all","Largely unimportant","Somewhat unimportant","Neutral","Moderately important","Very important","Extremely important"]);
    fields.attitudeElaboration = likert(container, "To what extent do you agree with the following statement? 'Your attitude on this topic is a result of careful thinking about relevant information.'", 7, ["Strongly disagree","Disagree","Somewhat disagree","Neither agree nor disagree","Somewhat agree","Agree","Strongly agree"]);
    fields.attitudeMoralization = likert(container, "To what extent do you agree with the following statement? 'Your attitude on this topic is connected to your core moral values.'", 7, ["Strongly disagree","Disagree","Somewhat disagree","Neither agree nor disagree","Somewhat agree","Agree","Strongly agree"]);

    const NFC_LABELS = ["Extremely uncharacteristic of me","Somewhat uncharacteristic of me","Neither","Somewhat characteristic of me","Extremely characteristic of me"];
    fields.nfc = [];
    for (let i = 1; i <= 6; i++) {
      fields.nfc.push(likert(container, `SAMPLE-QUESTION-OUT-OF-6 #${i}`, 5, NFC_LABELS));
    }

    const IHS_LABELS = ["Strongly disagree","Disagree","Mostly disagree","Slightly disagree","Neither agree nor disagree","Slightly agree","Mostly agree","Agree","Strongly agree"];
    fields.ihs = [];
    for (let i = 1; i <= 12; i++) {
      fields.ihs.push(likert(container, `SAMPLE-QUESTION-OUT-OF-12 #${i}`, 9, IHS_LABELS));
    }

    // Wire change handlers
    [fields.age, fields.gender, fields.frequency,
     fields.topicFamiliarity, fields.priorStance,
     fields.attitudeImportance, fields.attitudeElaboration, fields.attitudeMoralization,
     ...fields.nfc, ...fields.ihs].forEach((r) => r.onChange(recheck));
    [fields.years, fields.hrw, fields.pcm].forEach((n) => n.onChange(recheck));

    // Volume calibration player
    const calibWrap = questionBlock(container, "Volume calibration — please listen all the way through to enable Continue.");
    calibrationPlayer = createCalibrationPlayer(calibWrap, state.staticAudio.volume_calibration, {
      onListenedEnough: recheck,
    });
  },

  validate,

  async submit(state) {
    await submitStudy2Page2(state.prolificId, collect());
  },

  teardown() {
    calibrationPlayer?.destroy();
    calibrationPlayer = null;
    fields = null;
    setReadyCb = null;
  },
};
