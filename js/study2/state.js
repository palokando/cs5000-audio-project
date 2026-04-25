// Study 2 in-memory session state plus tiny localStorage persistence.

export function makeSession(prolificId) {
  return {
    prolificId,
    condition: null,           // study2_condition
    podcastUrl: null,          // string
    podcastTopic: null,        // string
    podcastName: null,         // string
    staticAudio: {},           // { [key]: url }
    page3Stats: { latestTimeReached: 0, totalPlaytime: 0, pauseClicks: 0, backtrackClicks: 0 },
    soundRecognized: null,     // boolean | null — set on Page 4 submit
  };
}

const PAGE_KEY = (pid) => `study2:${pid}:page`;

export function loadPage(prolificId) {
  const raw = localStorage.getItem(PAGE_KEY(prolificId));
  const n = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(n) ? n : 1;
}

export function savePage(prolificId) {
  return (pageId) => localStorage.setItem(PAGE_KEY(prolificId), String(pageId));
}

export function clearPage(prolificId) {
  return () => localStorage.removeItem(PAGE_KEY(prolificId));
}
