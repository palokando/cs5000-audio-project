// Page 1 — Introduction. No form, no Quit, no submit RPC.

const LOREM = "<h1>Opening Statement</h1><p>You have been invited to participate in this research study on the salience of non-verbal sound cues by Konstantin-Asen Yordanov (<a href='mailto:K.Y.Yordanov@student.tudelft.nl'>email</a>) from TU Delft's Electrical Engineering, Mathematics, and Computer Science faculty.<br><br>In this study, you will be asked to listen to short excerpts from a spoken conversation (e.g. a podcast) which contain one of the candidate sound cues we are investigating. Afterwards, you will provide your subjective impressions of the sound along different criteria using both judgment scales and free-form textual answers. Please take your participation seriously: responses that contain gibberish or are otherwise incoherent will be flagged during review.<br><br>The study will take <strong>approximately 8 minutes</strong> of your time. If possible, <strong>(i) connect and put on a pair of headphones</strong> for improved audio clarity and <strong>(ii) find a quiet environment where you will not be disturbed</strong> before proceeding with the study. From this point on, <strong>(iii) avoid closing the browser tab or refreshing the webpage</strong> as that would reset your progress and redirect you back to the start of the survey.<br><br>You will also be asked for personal data, specifically your age, gender, and native language. The reason for requesting these details is to verify how balanced and representative the sample of participants is: the data will be presented and discussed in an aggregated and anonymized form alongside the study's main findings in a final report, which will be available in the public domain via TU Delft's open repository. All personal data will be deleted from our database at the end of the research project. If you are uncomfortable sharing any of this information, you may indicate the provided 'Prefer not to say' option. To minimize the risk of re-identification, we are going to store personal research data securely (deleting them when they are no longer needed), and only the Principal Investigator will have access to them to maintain privacy and confidentiality throughout the course of the research.<br><br>Your participation in this study is entirely voluntary, and you can withdraw at any time without adverse consequences by closing the survey. Partial responses that are meaningful and clearly show evidence of effortful participation will be reimbursed proportionally to the time spent. If you have questions or concerns, please contact the Principal Investigator (Konstantin-Asen Yordanov).<br><br>By clicking 'Continue' below, you agree to the following: <strong>I acknowledge that I have read and understood the information presented above, am aware of the research objectives and the use of the data I submit, and consent to be a participant in this study.</strong></p>";

export default {
  id: 1,
  showQuit: false,
  showContinue: true,
  instructions: LOREM,

  mount(container, _state, ctx) {
    ctx.setReady(true);
  },

  validate() { return { ok: true }; },
  async submit() {},
  teardown() {},
};
