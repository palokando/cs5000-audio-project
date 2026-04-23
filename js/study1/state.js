// Study 1 in-memory session state. No localStorage persistence — Study 1
// always starts at Page 1, has no Quit button, and skips no pages.

export function makeSession(prolificId) {
  return {
    prolificId,
    assignedSoundCue: null,  // sound_cue enum
    snippetUrls: [],         // string[3]
    staticAudio: {},         // { [key]: url }
  };
}
