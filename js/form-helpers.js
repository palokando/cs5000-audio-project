// Shared form helpers used across both studies' pages.

let uid = 0;
const nextName = () => `f${++uid}`;

// Renders a labelled question wrapper. Returns the inner div for content.
export function questionBlock(parent, label) {
  const wrap = document.createElement("div");
  wrap.className = "question";
  const lbl = document.createElement("p");
  lbl.className = "question-label";
  lbl.textContent = label;
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

// 1..N integer Likert; convenience wrapper.
export function likert(parent, label, n, displayLabels) {
  const opts = [];
  for (let i = 1; i <= n; i++) {
    const display = displayLabels ? `${i} – ${displayLabels[i - 1]}` : String(i);
    opts.push([i, display]);
  }
  return radioGroup(parent, label, opts);
}

export function textArea(parent, label, { required = true } = {}) {
  const wrap = questionBlock(parent, label);
  const ta = document.createElement("textarea");
  ta.rows = 3;
  wrap.append(ta);
  const subs = [];
  ta.addEventListener("input", () => subs.forEach((cb) => cb()));
  return {
    element: wrap,
    getValue() { return ta.value.trim(); },
    isFilled() { return !required || ta.value.trim().length > 0; },
    onChange(cb) { subs.push(cb); },
    setDisabled(d) { ta.disabled = d; },
  };
}

export function textInput(parent, label, { maxLength = null } = {}) {
  const wrap = questionBlock(parent, label);
  const inp = document.createElement("input");
  inp.type = "text";
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
      const v = inp.value.trim();
      if (v === "") return null;
      const n = parseInt(v, 10);
      return Number.isFinite(n) ? n : null;
    },
    isFilled() {
      const v = this.getValue();
      return v !== null && v >= min;
    },
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
