import { STUDY_MODE } from "./config.js";
import * as router from "./router.js";

async function main() {
  const bootStatus = document.getElementById("boot-status");
  const bootError = document.getElementById("boot-error");
  const fail = (msg) => {
    if (bootStatus) bootStatus.remove();
    bootError.hidden = false;
    bootError.textContent = msg;
  };

  let bootstrap;
  try {
    if (STUDY_MODE === "study2") {
      bootstrap = await import("./study2/bootstrap.js");
    } else if (STUDY_MODE === "study1") {
      bootstrap = await import("./study1/bootstrap.js");
    } else {
      throw new Error(`Unknown STUDY_MODE: ${STUDY_MODE}`);
    }
  } catch (err) {
    return fail(`Failed to load study bundle: ${err.message}`);
  }

  let setup;
  try {
    setup = await bootstrap.start();
  } catch (err) {
    return fail(`Could not start study: ${err.message}`);
  }

  router.run(setup);
}

main();
