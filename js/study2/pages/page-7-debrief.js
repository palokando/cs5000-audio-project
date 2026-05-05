// Page 7 — Post-Study Debrief. No Quit button per spec.

import { submitStudy2Page7 } from "../../supabase.js";
import { checkbox, textArea } from "../../form-helpers.js";

const LOREM = "<h1>Final Page: Post-Study Debrief</h1><p>We appreciate your participation in our study and the time you spent contributing to this research. The purpose of this post-study debrief is to provide crucial information about the task you just completed.<br><br>You were originally told that the aim of this study was to identify and analyze patterns of content recall measured immediately after participants listen to a dialogue-style podcast. While the recall assessment was indeed a significant component of the task, the study's actual objectives were more involved than what we explained to you in the Opening Statement.<br><br>The true purpose of this research is to compare different implementations of non-verbal auditory cues, which indicate that an adjacent podcast segment contains misleading statements, in terms of salience, effectiveness, and listener-perceived appropriateness. Such auditory interventions are introduced with the aim of prompting critical engagement with the content as well as raising listeners' misinformation awareness in the increasingly popular medium of podcasts. Because the latter blend entertainment and information in a manner that enables the spread of falsehoods and prevents listeners from scrutinizing what is being said, this study informs the guidelines for integrating auditory warnings into podcasts (an unexplored domain application of such cues) by examining how listeners perceive and react to them.<br><br>The Opening Statement you were presented with specified none of these details: the true motivation behind this study, the research gap it seeks to address, the integration of sound cues into the podcast which the task was based on, and their function as misinformation warnings. Under partial disclosure, that introductory message instead emphasized “the interplay between attentive listening and memory” as the research focus, outlining the recall assessment procedure and highlighting the risk of potential exposure to misinformation. It was necessary to obscure the remaining features and keep participants unaware of the auditory cues' presence and purpose to ensure the reactions we capture are authentic. Going into the survey with the knowledge of and mental preparation for encountering warnings would have otherwise skewed the results and detracted from the study's realism, invalidating our conclusions.<br><br>The process of handling personal data (i.e. age, gender, native language) remains as it was described in the Opening Statement. All personal information you shared (if any) is only featured as descriptive statistics of the participant sample in the final published report (presented in an aggregated and anonymized form). For the duration of the project, it is stored securely and accessible solely to the Principal Investigator, afterwards being deleted to minimize any risks to privacy and confidentiality.<br><br>We apologize for not offering you accurate information about the motivation, objectives, and procedure for this study, but we hope you understand why this was necessary. Due to the use of partial disclosure, we ask that you once again indicate whether you agree to the use and analysis of your submitted work, or would instead like us to discard the findings from your submission, via the checkboxes below. For any additional concerns or questions, please contact the Principal Investigator via Prolific or <a href='mailto:K.Y.Yordanov@student.tudelft.nl'>email</a>.</p>";

let fields = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };
  if (!fields.readInfo.isChecked()) return { ok: false };
  if (!fields.immediate.isFilled()) return { ok: false };
  if (!fields.downstream.isFilled()) return { ok: false };

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
    fields.readInfo = checkbox(container, "I have read and understood the information presented above and am aware of the true research objectives.");
    fields.consent = checkbox(container, "I approve the use and analysis of my submission.");
    fields.immediate  = textArea(container, "Now knowing the sound's meaning, how would you react if you heard it while listening to one of your regular podcasts? (1-2 sentences)");
    fields.downstream = textArea(container, "What would your follow-up actions be, if any, in response to hearing the misinformation warning? (1-2 sentences)");
    fields.feedback = textArea(container, "Based on your experience completing this task, please (optionally) provide any feedback or suggestions for improvement you consider relevant in the text box below.", { required: false });

    fields.readInfo.onChange(recheck);
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
