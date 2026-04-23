// Page 1 — Introduction. No form, no Quit, no submit RPC.

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Welcome to the study. Click Continue when ready.";

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
