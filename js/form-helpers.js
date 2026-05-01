// Shared form helpers used across both studies' pages.

let uid = 0;
const nextName = () => `f${++uid}`;

export function emphasizeWords(text) {
  return `<strong>${text}</strong>`;
}

// Renders a labelled question wrapper. Returns the inner div for content.
// The label is rendered as innerHTML (after auto-bolding),
// so callers may also include inline markup if needed.
export function questionBlock(parent, label) {
  const wrap = document.createElement("div");
  wrap.className = "question";
  const lbl = document.createElement("p");
  lbl.className = "question-label";
  lbl.innerHTML = emphasizeWords(label);
  wrap.append(lbl);
  parent.append(wrap);
  return wrap;
}

// `options` is an array of [value, displayLabel].
// Returns { element, getValue, onChange(cb) }.
export function radioGroup(parent, label, options) {
  const wrap = questionBlock(parent, label);
  const name = nextName();
  const inputs = [];
  for (const [value, display] of options) {
    const id = `${name}_${inputs.length}`;
    const lbl = document.createElement("label");
    lbl.htmlFor = id;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.id = id;
    input.value = String(value);
    lbl.append(input, document.createTextNode(" " + display));
    wrap.append(lbl);
    inputs.push(input);
  }
  const subscribers = [];
  const onChange = (cb) => subscribers.push(cb);
  for (const inp of inputs) {
    inp.addEventListener("change", () => subscribers.forEach((cb) => cb()));
  }
  return {
    element: wrap,
    getValue() {
      const sel = inputs.find((i) => i.checked);
      return sel ? sel.value : null;
    },
    onChange,
    setDisabled(d) { inputs.forEach((i) => (i.disabled = d)); inputs.forEach((i) => { if (d) i.checked = false; }); },
  };
}

// 1..N integer Likert. Renders as a horizontal scale: each option is a column
// with the radio on top, the number below, and (optionally) the text descriptor
// centered and wrapping below that. Column widths are tailored to the 9-option
// case so labels never overlap; shorter scales (5, 7) keep the same column
// treatment with more breathing room.
export function likert(parent, label, n, displayLabels) {
  const wrap = questionBlock(parent, label);
  const scale = document.createElement("div");
  scale.className = "likert-scale";
  const name = nextName();
  const inputs = [];
  for (let i = 1; i <= n; i++) {
    const opt = document.createElement("label");
    opt.className = "likert-scale-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = name;
    input.value = String(i);
    const num = document.createElement("span");
    num.className = "likert-scale-num";
    num.textContent = String(i);
    opt.append(input, num);
    if (displayLabels) {
      const text = document.createElement("span");
      text.className = "likert-scale-text";
      text.innerHTML = displayLabels[i - 1];
      opt.append(text);
    }
    scale.append(opt);
    inputs.push(input);
  }
  wrap.append(scale);
  const subscribers = [];
  for (const inp of inputs) {
    inp.addEventListener("change", () => subscribers.forEach((cb) => cb()));
  }
  return {
    element: wrap,
    getValue() {
      const sel = inputs.find((i) => i.checked);
      return sel ? sel.value : null;
    },
    onChange(cb) { subscribers.push(cb); },
    setDisabled(d) {
      inputs.forEach((i) => (i.disabled = d));
      if (d) inputs.forEach((i) => (i.checked = false));
    },
  };
}

export function textArea(parent, label, { required = true } = {}) {
  const wrap = questionBlock(parent, label);
  const ta = document.createElement("textarea");
  ta.rows = 3;
  ta.placeholder = " ";
  wrap.append(ta);
  const subs = [];
  ta.addEventListener("input", () => subs.forEach((cb) => cb()));
  return {
    element: wrap,
    getValue() { return ta.value.trim(); },
    isFilled() { return !required || ta.value.trim().length > 0; },
    onChange(cb) { subs.push(cb); },
    setDisabled(d) { ta.disabled = d; if (d) ta.value = ""; },
  };
}

export function textInput(parent, label, { maxLength = null } = {}) {
  const wrap = questionBlock(parent, label);
  const inp = document.createElement("input");
  inp.type = "text";
  inp.placeholder = " ";
  if (maxLength) inp.maxLength = maxLength;
  wrap.append(inp);
  const subs = [];
  inp.addEventListener("input", () => subs.forEach((cb) => cb()));
  return {
    element: wrap,
    input: inp,
    getValue() { return inp.value; },
    onChange(cb) { subs.push(cb); },
    setDisabled(d) { inp.disabled = d; if (d) inp.value = ""; },
  };
}

export function numberInput(parent, label, { min = 0, suffix = "" } = {}) {
  const wrap = questionBlock(parent, label);
  const inp = document.createElement("input");
  inp.type = "number";
  inp.min = String(min);
  inp.step = "1";
  inp.placeholder = " ";
  wrap.append(inp);
  if (suffix) {
    const s = document.createElement("span");
    s.textContent = " " + suffix;
    wrap.append(s);
  }
  const subs = [];
  inp.addEventListener("input", () => subs.forEach((cb) => cb()));
  return {
    element: wrap,
    getValue() {
      const n = inp.valueAsNumber;
      if (!Number.isFinite(n)) return null;   // empty or non-numerical
      if (!Number.isInteger(n)) return null;  // reject decimals (no silent truncation)
      if (n < min) return null;               // reject below-min (e.g. negatives when min=0)
      return n;
    },
    isFilled() { return this.getValue() !== null; },
    onChange(cb) { subs.push(cb); },
  };
}

export function checkbox(parent, label) {
  const wrap = document.createElement("div");
  wrap.className = "question";
  const lbl = document.createElement("label");
  const inp = document.createElement("input");
  inp.type = "checkbox";
  lbl.append(inp, document.createTextNode(" " + label));
  wrap.append(lbl);
  parent.append(wrap);
  const subs = [];
  inp.addEventListener("change", () => subs.forEach((cb) => cb()));
  return {
    element: wrap,
    input: inp,
    isChecked() { return inp.checked; },
    onChange(cb) { subs.push(cb); },
  };
}

// 5x2 grid combining an overarching prompt, shared scale labels, and four
// question rows. Returns a map keyed by question.key, where each entry exposes
// the same getValue/onChange interface as radioGroup so existing call-site
// validation/wiring keeps working.
export function likertMatrix(parent, { promptHTML, scaleLabelsHTML, n = 5, questions }) {
  const table = document.createElement("table");
  table.className = "likert-matrix";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  const headCell = document.createElement("th");
  headCell.colSpan = 2;
  const promptP = document.createElement("p");
  promptP.className = "likert-prompt";
  promptP.innerHTML = emphasizeWords(promptHTML);
  const scaleP = document.createElement("p");
  scaleP.className = "likert-scale-labels";
  scaleP.innerHTML = scaleLabelsHTML;
  headCell.append(promptP, scaleP);
  headRow.append(headCell);
  thead.append(headRow);
  table.append(thead);

  const tbody = document.createElement("tbody");
  const result = {};

  for (const q of questions) {
    const row = document.createElement("tr");

    const qCell = document.createElement("td");
    qCell.className = "likert-question";
    qCell.innerHTML = q.label;
    row.append(qCell);

    const rCell = document.createElement("td");
    rCell.className = "likert-radios";
    const radiosRow = document.createElement("div");
    radiosRow.className = "likert-radios-row";

    const name = nextName();
    const inputs = [];
    for (let i = 1; i <= n; i++) {
      const wrap = document.createElement("label");
      wrap.className = "likert-radio";
      const numSpan = document.createElement("span");
      numSpan.textContent = String(i);
      const input = document.createElement("input");
      input.type = "radio";
      input.name = name;
      input.value = String(i);
      wrap.append(numSpan, input);
      radiosRow.append(wrap);
      inputs.push(input);
    }
    rCell.append(radiosRow);
    row.append(rCell);
    tbody.append(row);

    const localSubs = [];
    for (const inp of inputs) {
      inp.addEventListener("change", () => {
        localSubs.forEach((cb) => cb());
        subscribers.forEach((cb) => cb());
      });
    }
    result[q.key] = {
      getValue() {
        const sel = inputs.find((i) => i.checked);
        return sel ? sel.value : null;
      },
      onChange(cb) { localSubs.push(cb); },
    };
  }

  table.append(tbody);
  parent.append(table);
  return result;
}
