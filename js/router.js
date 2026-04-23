// Generic unidirectional router. Walks a study's page registry, owns the
// Continue/Quit buttons, and persists progress so a refresh resumes in place.

const els = {
  shell: null,
  instruction: null,
  content: null,
  continueBtn: null,
  quitBtn: null,
};

let cfg = null;
let currentPage = null;
let currentIndex = 0;

export function run(config) {
  cfg = config;
  els.shell        = document.getElementById("shell");
  els.instruction  = document.getElementById("instructions");
  els.content      = document.getElementById("content");
  els.continueBtn  = document.getElementById("continue-btn");
  els.quitBtn      = document.getElementById("quit-btn");

  els.continueBtn.addEventListener("click", onContinue);
  els.quitBtn.addEventListener("click", onQuit);

  document.getElementById("boot-status")?.remove();
  els.shell.hidden = false;

  currentIndex = clampStart(cfg.startIndex);
  renderCurrent();
}

function clampStart(idx) {
  // idx is 1-based per page-id. Clamp to [1, pages.length].
  const i = Math.max(1, Math.min(cfg.pages.length, idx | 0));
  return i - 1;
}

function setReady(ok) {
  els.continueBtn.disabled = !ok;
}

function renderCurrent() {
  // Skip pages whose skipIf predicate matches.
  while (currentIndex < cfg.pages.length && cfg.pages[currentIndex].skipIf?.(cfg.state)) {
    currentIndex++;
  }
  if (currentIndex >= cfg.pages.length) {
    // Past the registry — nothing to render. Should not happen for Study 2,
    // since page 8 is terminal and handles its own end-of-flow display.
    return;
  }

  currentPage = cfg.pages[currentIndex];
  cfg.persistPage(currentPage.id);

  els.instruction.innerHTML = "";
  els.content.innerHTML = "";

  const instrP = document.createElement("p");
  instrP.className = "instruction-text";
  instrP.textContent = currentPage.instructions || "";
  els.instruction.append(instrP);

  els.quitBtn.hidden     = !currentPage.showQuit;
  els.continueBtn.hidden = !currentPage.showContinue;
  if (currentIndex === cfg.pages.length - 2) {
    els.continueBtn.innerHTML = "Finish";
  }
  els.continueBtn.disabled = true;

  currentPage.mount(els.content, cfg.state, {
    setReady,
    finish: finishTerminal,  // Page 8 calls this upon study completion
  });
}

async function onContinue() {
  if (!currentPage) return;
  const v = currentPage.validate?.();
  if (v && !v.ok) return;

  els.continueBtn.disabled = true;
  try {
    await currentPage.submit?.(cfg.state);
  } catch (err) {
    alert(`Submission failed: ${err.message}`);
    els.continueBtn.disabled = false;
    return;
  }
  currentPage.teardown?.();
  currentIndex++;
  renderCurrent();
}

async function onQuit() {
  if (!confirm("Are you sure you want to quit the study? You will not be able to resume.")) return;
  els.quitBtn.disabled = true;
  els.continueBtn.disabled = true;
  try {
    await cfg.abortStudy(cfg.state.prolificId);
  } catch (err) {
    alert(`Could not record exit: ${err.message}`);
    els.quitBtn.disabled = false;
    return;
  }
  cfg.clearPage();
  showExit();
}

function finishTerminal() {
  // Called by Page 8 on mount once finalization is dispatched.
  cfg.clearPage();
}

function showExit() {
  currentPage?.teardown?.();
  currentPage = cfg.exitPage;
  els.instruction.innerHTML = "";
  els.content.innerHTML = "";
  els.quitBtn.hidden = true;
  els.continueBtn.hidden = true;
  const instrP = document.createElement("p");
  instrP.className = "instruction-text";
  instrP.textContent = cfg.exitPage.instructions || "";
  els.instruction.append(instrP);
  cfg.exitPage.mount(els.content, cfg.state, { setReady, finish: () => {} });
}
