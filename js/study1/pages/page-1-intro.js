// Page 1 — Introduction. No form, no Quit, no submit RPC.

const LOREM = "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br><br>Welcome to the study.<br>Click Continue when ready.</p>";

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
