/* ============================================================
   Strictly Come Crawling — app logic
   Static PWA, all data in localStorage on the phone
   ============================================================ */

const STORE_KEY = "scc_v1";

/* ---------- State ---------- */
function blank() {
  return {
    v: 1,
    neck:    { done: {}, checks: {} },
    crawl:   { done: {}, checks: {} },
    stretch: { dates: {} },
    log: []
  };
}
let state = load();

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return blank();
    const s = JSON.parse(raw);
    return Object.assign(blank(), s, {
      neck: Object.assign({ done: {}, checks: {} }, s.neck || {}),
      crawl: Object.assign({ done: {}, checks: {} }, s.crawl || {}),
      stretch: Object.assign({ dates: {} }, s.stretch || {}),
      log: Array.isArray(s.log) ? s.log : []
    });
  } catch (e) { return blank(); }
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

/* ---------- Dates ---------- */
function pad(n) { return String(n).padStart(2, "0"); }
function dstr(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
function today() { return dstr(new Date()); }
function addDays(s, k) { const [y, m, d] = s.split("-").map(Number); const t = new Date(y, m - 1, d); t.setDate(t.getDate() + k); return dstr(t); }
function niceDate(s, opts) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", opts || { weekday: "short", day: "numeric", month: "short" });
}

/* ---------- Derived ---------- */
const NECK_TOTAL = NECK.days.length;     // 20
const CRAWL_TOTAL = CRAWL.days.length;   // 30

function neckCurrent() { for (let n = 1; n <= NECK_TOTAL; n++) if (!state.neck.done[n]) return n; return null; }
function crawlCurrent() { for (let n = 1; n <= CRAWL_TOTAL; n++) if (!state.crawl.done[n]) return n; return null; }
function neckDoneToday() { const t = today(); return Object.keys(state.neck.done).find(n => state.neck.done[n].date === t) || null; }
function crawlDoneToday() { const t = today(); return Object.keys(state.crawl.done).find(n => state.crawl.done[n].date === t) || null; }
function stretchDoneToday() { return !!state.stretch.dates[today()]; }
function neckDay(n) { return NECK.days[n - 1]; }
function crawlDay(n) { return CRAWL.days[n - 1]; }
function count(o) { return Object.keys(o).length; }
function activityOn(date) {
  return {
    n: Object.values(state.neck.done).some(x => x.date === date),
    c: Object.values(state.crawl.done).some(x => x.date === date),
    s: !!state.stretch.dates[date]
  };
}
function anyOn(date) { const a = activityOn(date); return a.n || a.c || a.s; }
function streak() {
  let d = today(), k = 0;
  if (!anyOn(d)) d = addDays(d, -1);
  while (anyOn(d)) { k++; d = addDays(d, -1); }
  return k;
}
function bestStreak() {
  const dates = new Set();
  Object.values(state.neck.done).forEach(x => dates.add(x.date));
  Object.values(state.crawl.done).forEach(x => dates.add(x.date));
  Object.keys(state.stretch.dates).forEach(d => dates.add(d));
  let best = 0;
  dates.forEach(d => {
    if (dates.has(addDays(d, -1))) return;
    let k = 0, x = d;
    while (dates.has(x)) { k++; x = addDays(x, 1); }
    best = Math.max(best, k);
  });
  return best;
}

/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function tempoLabel(t) { return ({ natural: "Natural speed", slow: "Slow", pause: "Pause for one slow breath, in and out, at each position" })[t]; }
function tempoShort(t) { return ({ natural: "Natural", slow: "Slow", pause: "Pause" })[t]; }
function praise() { return PRAISE[Math.floor(Math.random() * PRAISE.length)]; }

let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}
function confetti(big) {
  const box = $("#confetti"); box.innerHTML = "";
  const colours = ["#e8c252", "#ff2d95", "#fff", "#7a2cff", "#f7e08a"];
  const n = big ? 120 : 40;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "vw";
    p.style.background = colours[i % colours.length];
    p.style.animationDelay = (Math.random() * .6) + "s";
    p.style.animationDuration = (1.4 + Math.random()) + "s";
    p.style.transform = "rotate(" + Math.random() * 360 + "deg)";
    box.appendChild(p);
  }
  setTimeout(() => { box.innerHTML = ""; }, 2600);
}
function celebrate() {
  const all = neckDoneToday() && crawlDoneToday() && stretchDoneToday();
  if (all) { toast("PERFECT 40!"); confetti(true); }
  else { toast(praise()); confetti(false); }
}
function addLog(entry) {
  state.log.unshift(Object.assign({ ts: Date.now(), date: today() }, entry));
  if (state.log.length > 400) state.log.length = 400;
}

/* ---------- Views ---------- */
function showView(name) {
  document.querySelectorAll(".view").forEach(v => v.classList.toggle("active", v.id === "view-" + name));
  document.querySelectorAll("nav.tabbar button").forEach(b => b.classList.toggle("active", b.dataset.view === name));
  window.scrollTo({ top: 0 });
  renderAll();
}
document.querySelectorAll("nav.tabbar button").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));

function renderAll() { renderTonight(); renderNeck(); renderCrawl(); renderStretch(); renderHistory(); }

/* ---------- Tonight ---------- */
function renderTonight() {
  $("#today-date").textContent = niceDate(today(), { weekday: "long", day: "numeric", month: "long" });

  const nd = neckDoneToday(), cd = crawlDoneToday(), sd = stretchDoneToday();
  const nCur = nd ? Number(nd) : neckCurrent();
  const cCur = cd ? Number(cd) : crawlCurrent();

  const cards = [];

  // 1. Neck
  if (nCur) {
    const d = neckDay(nCur);
    cards.push(orderCard(1, !!nd, "NECKroNODmicon",
      `Week ${d.week} · Day ${d.day} · ${esc(NECK.phases[d.week])} · ${tempoShort(d.tempo)}`,
      nd ? "Done today" : "Up next", () => openNeck(nCur)));
  } else {
    cards.push(orderCard(1, true, "NECKroNODmicon", "All 20 days complete", "Finished", () => showView("neck")));
  }
  // 2. Crawl
  if (cCur) {
    const d = crawlDay(cCur);
    cards.push(orderCard(2, !!cd, "Crawlidays", `Day ${d.n} of 30 · ${esc(d.title)}`, cd ? "Done today" : "Up next", () => openCrawl(cCur)));
  } else {
    cards.push(orderCard(2, true, "Crawlidays", "All 30 days complete", "Finished", () => showView("crawl")));
  }
  // 3. Stretch
  cards.push(orderCard(3, sd, "Neck stretches", "Follow the video, now or later today", sd ? "Done today" : "Up next", () => showView("stretch")));

  const box = $("#running-order"); box.innerHTML = "";
  box.append(...cards);

  // Score
  const parts = [nd, cd, sd].filter(Boolean).length;
  const score = [null, 7, 9, 10][parts];
  const pad = $("#paddles"); pad.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const p = document.createElement("div");
    p.className = "paddle " + (parts === 0 ? "dim" : parts === 3 ? "pink" : "");
    p.textContent = score ? score : "–";
    pad.appendChild(p);
  }
  $("#score-msg").textContent = [
    "The judges are waiting. Do one thing tonight.",
    "A solid start. Two more for the perfect score.",
    "Nearly there. One more and it's a 40.",
    "PERFECT 40! Straight through to next week."
  ][parts];
}

function orderCard(num, done, title, sub, pillText, onOpen) {
  const el = document.createElement("div");
  el.className = "card order-card" + (done ? " done" : "");
  el.innerHTML = `
    <div class="order-num ${done ? "done" : ""}">${done ? "✓" : num}</div>
    <div class="body">
      <h3>${esc(title)}</h3>
      <p class="sub">${sub}</p>
    </div>
    <span class="pill ${done ? "ok" : "pink"}">${pillText}</span>`;
  el.addEventListener("click", onOpen);
  return el;
}

/* ---------- Neck ---------- */
let neckWeek = null;
function renderNeck() {
  const done = count(state.neck.done);
  $("#neck-progress-pill").textContent = `${done} / ${NECK_TOTAL} days`;
  $("#neck-progress-bar").style.width = (done / NECK_TOTAL * 100) + "%";

  const cur = neckCurrent();
  if (neckWeek === null) neckWeek = cur ? neckDay(cur).week : 4;

  const tabs = $("#neck-week-tabs"); tabs.innerHTML = "";
  for (let w = 1; w <= 4; w++) {
    const b = document.createElement("button");
    b.textContent = "Week " + w; b.className = w === neckWeek ? "active" : "";
    b.addEventListener("click", () => { neckWeek = w; renderNeck(); });
    tabs.appendChild(b);
  }
  $("#neck-phase-name").innerHTML = `Phase ${neckWeek}: <b style="color:var(--gold-2)">${esc(NECK.phases[neckWeek])}</b> · <a href="${NECK.videos[neckWeek]}" target="_blank" rel="noopener">Video demo</a>`;

  const list = $("#neck-day-list"); list.innerHTML = "";
  NECK.days.filter(d => d.week === neckWeek).forEach(d => {
    const isDone = !!state.neck.done[d.n];
    const el = document.createElement("div");
    el.className = "day-item" + (isDone ? " done" : "") + (d.n === cur ? " current" : "");
    el.innerHTML = `<span class="num">Day ${d.day}</span>
      <span class="name">${tempoLabel(d.tempo)}${isDone ? `<br><span class="muted small">${niceDate(state.neck.done[d.n].date)}</span>` : ""}</span>
      <span class="tick">${isDone ? "✓" : ""}</span>`;
    el.addEventListener("click", () => openNeck(d.n));
    list.appendChild(el);
  });

  $("#neck-technique").innerHTML = NECK.technique.map(t => `<li>${esc(t)}</li>`).join("");
}

function openNeck(n) {
  const d = neckDay(n);
  const done = state.neck.done[n];
  const checks = state.neck.checks[n] || {};
  const body = $("#sheet-body");
  const groups = { A: d.exercises.filter(e => e.id[0] === "A"), B: d.exercises.filter(e => e.id[0] === "B") };

  body.innerHTML = `
    <div class="kicker">NECKroNODmicon · Week ${d.week} · ${esc(NECK.phases[d.week])}</div>
    <h2>Day ${d.day} <span class="muted" style="font-size:14px;font-family:var(--font-body);font-weight:500">(day ${n} of ${NECK_TOTAL})</span></h2>
    <div class="tempo-banner">Tempo: ${tempoLabel(d.tempo)}</div>
    ${done ? `<p class="pill ok" style="margin-bottom:8px">Completed ${niceDate(done.date)}</p>` : ""}
    <h2 class="section">Group A</h2>
    <div id="neck-checks-A"></div>
    <h2 class="section">Group B</h2>
    <div id="neck-checks-B"></div>
    <p class="muted small" style="margin-top:12px">Eyes first, then head. Breathe. Tiny range of motion is fine.</p>
    <a class="btn ghost block center" style="text-decoration:none;margin:10px 0" href="${NECK.videos[d.week]}" target="_blank" rel="noopener">Watch the week ${d.week} demo</a>
    ${done
      ? `<button class="btn ghost danger block" id="neck-undo">Undo completion</button>`
      : `<button class="btn block" id="neck-complete">Mark day complete</button>`}
  `;
  ["A", "B"].forEach(g => {
    const box = body.querySelector("#neck-checks-" + g);
    groups[g].forEach(e => {
      const wrap = document.createElement("div");
      wrap.className = "ex";
      if (e.img) wrap.innerHTML = `<img class="fig" src="img/${e.img}.jpg" alt="" loading="lazy">`;
      const el = document.createElement("div");
      el.className = "check" + (checks[e.id] ? " on" : "");
      el.innerHTML = `<div class="box"></div><div class="lbl"><b>${e.id}</b>${esc(e.name)}</div><div class="reps">${esc(e.reps)}</div>`;
      el.addEventListener("click", () => {
        checks[e.id] = !checks[e.id];
        state.neck.checks[n] = checks; save();
        el.classList.toggle("on", !!checks[e.id]);
      });
      wrap.appendChild(el);
      box.appendChild(wrap);
    });
  });
  const c = body.querySelector("#neck-complete");
  if (c) c.addEventListener("click", () => {
    state.neck.done[n] = { date: today(), ts: Date.now() };
    delete state.neck.checks[n];
    addLog({ type: "neck", n, label: `Neck W${d.week} D${d.day}` });
    save(); closeSheet(); neckWeek = null; renderAll(); celebrate();
  });
  const u = body.querySelector("#neck-undo");
  if (u) u.addEventListener("click", () => {
    delete state.neck.done[n];
    state.log = state.log.filter(l => !(l.type === "neck" && l.n === n));
    save(); closeSheet(); neckWeek = null; renderAll(); toast("Day " + n + " reopened");
  });
  openSheet();
}

/* ---------- Crawl ---------- */
function renderCrawl() {
  const done = count(state.crawl.done);
  const mins = Object.values(state.crawl.done).reduce((a, x) => a + (Number(x.minutes) || 0), 0);
  $("#crawl-progress-pill").textContent = `${done} / ${CRAWL_TOTAL} days`;
  $("#crawl-progress-bar").style.width = (done / CRAWL_TOTAL * 100) + "%";
  $("#crawl-minutes-total").textContent = mins ? `${mins} minutes crawled so far` : "No minutes logged yet";

  $("#warmup-table").innerHTML = CRAWL.warmup.map(w => `<tr><td>${esc(w.name)}</td><td>${esc(w.reps)}</td></tr>`).join("");

  const cur = crawlCurrent();
  const grid = $("#crawl-grid"); grid.innerHTML = "";
  CRAWL.days.forEach(d => {
    const t = document.createElement("div");
    t.className = "tile" + (state.crawl.done[d.n] ? " done" : "") + (d.n === cur ? " current" : "");
    t.textContent = d.n; t.title = d.title;
    t.addEventListener("click", () => openCrawl(d.n));
    grid.appendChild(t);
  });
}

function openCrawl(n) {
  const d = crawlDay(n);
  const done = state.crawl.done[n];
  const checks = state.crawl.checks[n] || {};
  const body = $("#sheet-body");
  let level = done ? done.level : (d.levels ? 3 : null);
  let minutes = done ? done.minutes : 10;
  const hasLevels = !!d.levels;

  body.innerHTML = `
    <div class="kicker">Crawlidays · Day ${n} of ${CRAWL_TOTAL}</div>
    <h2>${esc(d.title)}</h2>
    ${done ? `<p class="pill ok" style="margin-bottom:8px">Completed ${niceDate(done.date)} · ${done.minutes} min${done.level ? " · Level " + done.level : ""}</p>` : ""}
    ${d.img ? `<img class="fig hero-fig" src="img/${d.img}.jpg" alt="" loading="lazy">` : ""}
    <p class="muted small">${esc(d.note)}</p>

    <h2 class="section">Warm-up</h2>
    <div id="warmup-checks"></div>

    <h2 class="section">Today's crawl</h2>
    <table class="plan">${d.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join("")}</table>
    ${d.repeat ? `<p class="small" style="color:var(--pink-2);font-weight:700;margin:4px 0 0">${esc(d.repeat)}</p>` : ""}
    ${hasLevels ? `<ul class="levels">${d.levels.map((l, i) => `<li><b>Level ${i + 1}</b><span>${esc(l)}</span></li>`).join("")}</ul>` : ""}

    <h2 class="section">${done ? "Edit log" : "Log it"}</h2>
    <label class="field">Minutes crawled</label>
    <div class="stepper">
      <button id="m-minus">−</button>
      <input id="m-input" inputmode="numeric" pattern="[0-9]*" value="${minutes}">
      <button id="m-plus">+</button>
    </div>
    ${hasLevels ? `<label class="field">Level managed</label><div class="level-pick" id="level-pick"></div>` : ""}
    <label class="field">Notes</label>
    <textarea id="c-notes" placeholder="How did it feel?">${done && done.notes ? esc(done.notes) : ""}</textarea>
    <div style="height:14px"></div>
    <button class="btn pink block" id="crawl-save">${done ? "Save changes" : "Save and mark complete"}</button>
    ${done ? `<div style="height:8px"></div><button class="btn ghost danger block" id="crawl-undo">Undo completion</button>` : ""}
  `;

  const wbox = body.querySelector("#warmup-checks");
  CRAWL.warmup.forEach(w => {
    const el = document.createElement("div");
    el.className = "check" + (checks[w.id] ? " on" : "");
    el.innerHTML = `<div class="box"></div>${w.img ? `<img class="thumb" src="img/${w.img}.jpg" alt="" loading="lazy">` : ""}<div class="lbl">${esc(w.name)}</div><div class="reps wrap">${esc(w.reps)}</div>`;
    el.addEventListener("click", () => {
      checks[w.id] = !checks[w.id]; state.crawl.checks[n] = checks; save();
      el.classList.toggle("on", !!checks[w.id]);
    });
    wbox.appendChild(el);
  });

  const inp = body.querySelector("#m-input");
  const clamp = v => Math.max(0, Math.min(120, Math.round(Number(v) || 0)));
  body.querySelector("#m-minus").addEventListener("click", () => { inp.value = clamp(inp.value - 1); });
  body.querySelector("#m-plus").addEventListener("click", () => { inp.value = clamp(Number(inp.value) + 1); });

  if (hasLevels) {
    const lp = body.querySelector("#level-pick");
    const draw = () => {
      lp.innerHTML = "";
      [1, 2, 3].forEach(L => {
        const p = document.createElement("div");
        p.className = "paddle " + (level === L ? "pink" : "dim");
        p.innerHTML = `${L}<span>LEVEL</span>`;
        p.addEventListener("click", () => { level = L; draw(); });
        lp.appendChild(p);
      });
    };
    draw();
  }

  body.querySelector("#crawl-save").addEventListener("click", () => {
    const mins = clamp(inp.value);
    const notes = body.querySelector("#c-notes").value.trim();
    const wasDone = !!done;
    state.crawl.done[n] = { date: done ? done.date : today(), ts: Date.now(), minutes: mins, level: hasLevels ? level : null, notes };
    delete state.crawl.checks[n];
    if (wasDone) {
      const l = state.log.find(x => x.type === "crawl" && x.n === n);
      if (l) { l.minutes = mins; l.level = hasLevels ? level : null; l.notes = notes; }
    } else {
      addLog({ type: "crawl", n, label: `Crawl day ${n}: ${d.title}`, minutes: mins, level: hasLevels ? level : null, notes });
    }
    save(); closeSheet(); renderAll();
    if (wasDone) toast("Saved"); else celebrate();
  });
  const u = body.querySelector("#crawl-undo");
  if (u) u.addEventListener("click", () => {
    delete state.crawl.done[n];
    state.log = state.log.filter(l => !(l.type === "crawl" && l.n === n));
    save(); closeSheet(); renderAll(); toast("Day " + n + " reopened");
  });
  openSheet();
}

/* ---------- Stretch ---------- */
function renderStretch() {
  const v = $("#stretch-video");
  if (!v.src) v.src = STRETCH.embed;
  $("#stretch-link").href = STRETCH.url;
  const btn = $("#stretch-done-btn");
  const done = stretchDoneToday();
  btn.textContent = done ? "Stretches done today ✓ (tap to undo)" : "Mark stretches done today";
  btn.className = "btn block " + (done ? "ghost" : "pink");

  const dates = Object.keys(state.stretch.dates).sort().reverse();
  $("#stretch-recent").innerHTML = dates.length
    ? `<p class="muted small" style="margin:0 0 6px">${dates.length} session${dates.length === 1 ? "" : "s"} logged</p>` +
      dates.slice(0, 10).map(x => `<div class="log-item"><span class="when">${niceDate(x)}</span><span class="what">Neck stretches</span></div>`).join("")
    : `<p class="muted small" style="margin:0">Nothing logged yet.</p>`;
}
$("#stretch-done-btn").addEventListener("click", () => {
  const t = today();
  if (state.stretch.dates[t]) {
    delete state.stretch.dates[t];
    state.log = state.log.filter(l => !(l.type === "stretch" && l.date === t));
    save(); renderAll(); toast("Stretches unmarked");
  } else {
    state.stretch.dates[t] = Date.now();
    addLog({ type: "stretch", label: "Neck stretches" });
    save(); renderAll(); celebrate();
  }
});

/* ---------- History ---------- */
function renderHistory() {
  const mins = Object.values(state.crawl.done).reduce((a, x) => a + (Number(x.minutes) || 0), 0);
  const stats = [
    [count(state.neck.done), "Neck days"],
    [count(state.crawl.done), "Crawl days"],
    [mins, "Crawl mins"],
    [count(state.stretch.dates), "Stretches"],
    [streak(), "Streak"],
    [bestStreak(), "Best streak"]
  ];
  $("#stats").innerHTML = stats.map(s => `<div class="stat"><div class="v">${s[0]}</div><div class="k">${s[1]}</div></div>`).join("");

  // Calendar: last 28 days, Monday-aligned
  const cal = $("#cal"); cal.innerHTML = "";
  const t = today();
  const [y, m, dd] = t.split("-").map(Number);
  const dow = (new Date(y, m - 1, dd).getDay() + 6) % 7; // Mon=0
  const start = addDays(t, -(21 + dow));
  ["M", "T", "W", "T", "F", "S", "S"].forEach(h => {
    const e = document.createElement("div"); e.className = "d"; e.style.aspectRatio = "auto"; e.style.background = "transparent"; e.style.border = "0"; e.textContent = h; cal.appendChild(e);
  });
  for (let i = 0; i < 28; i++) {
    const day = addDays(start, i);
    if (day > t) { const e = document.createElement("div"); e.className = "d"; e.style.opacity = ".3"; e.textContent = Number(day.slice(8)); cal.appendChild(e); continue; }
    const a = activityOn(day);
    const e = document.createElement("div");
    e.className = "d" + (day === t ? " today" : "");
    e.innerHTML = `<span>${Number(day.slice(8))}</span><span class="dots"><i class="dot ${a.n ? "n" : ""}"></i><i class="dot ${a.c ? "c" : ""}"></i><i class="dot ${a.s ? "s" : ""}"></i></span>`;
    cal.appendChild(e);
  }

  const log = $("#log");
  log.innerHTML = state.log.length
    ? state.log.slice(0, 60).map(l => `<div class="log-item"><span class="when">${niceDate(l.date)}</span>
        <span class="what"><b>${esc(l.label || l.type)}</b>${l.minutes != null ? ` · ${l.minutes} min` : ""}${l.level ? ` · L${l.level}` : ""}${l.notes ? `<div class="note">${esc(l.notes)}</div>` : ""}</span></div>`).join("")
    : `<p class="muted small" style="margin:0">Nothing yet. Tonight is a good night to start.</p>`;
}

/* ---------- Backup ---------- */
$("#export-btn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "strictly-come-crawling-" + today() + ".json";
  document.body.appendChild(a); a.click(); a.remove();
});
$("#import-btn").addEventListener("click", () => $("#import-file").click());
$("#import-file").addEventListener("change", ev => {
  const f = ev.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const s = JSON.parse(r.result);
      if (!s || typeof s !== "object" || !s.neck || !s.crawl) throw new Error("bad");
      if (!confirm("Replace everything on this phone with the backup?")) return;
      localStorage.setItem(STORE_KEY, JSON.stringify(s));
      state = load(); neckWeek = null; renderAll(); toast("Backup restored");
    } catch (e) { alert("That file does not look like a Strictly Come Crawling backup."); }
  };
  r.readAsText(f); ev.target.value = "";
});
$("#reset-neck").addEventListener("click", () => {
  if (!confirm("Restart the neck programme from Day 1? Logged days are kept in the history log.")) return;
  state.neck = { done: {}, checks: {} }; neckWeek = null; save(); renderAll(); toast("Neck programme restarted");
});
$("#reset-crawl").addEventListener("click", () => {
  if (!confirm("Restart Crawlidays from Day 1? Logged days are kept in the history log.")) return;
  state.crawl = { done: {}, checks: {} }; save(); renderAll(); toast("Crawlidays restarted");
});
$("#reset-all").addEventListener("click", () => {
  if (!confirm("Wipe everything? This cannot be undone. Export a backup first if in doubt.")) return;
  state = blank(); neckWeek = null; save(); renderAll(); toast("All clear");
});

/* ---------- Sheet ---------- */
function openSheet() {
  $("#sheet-backdrop").classList.add("open");
  $("#sheet").classList.add("open");
  $("#sheet").scrollTop = 0;
  document.body.style.overflow = "hidden";
}
function closeSheet() {
  $("#sheet-backdrop").classList.remove("open");
  $("#sheet").classList.remove("open");
  document.body.style.overflow = "";
}
$("#sheet-backdrop").addEventListener("click", closeSheet);
$("#sheet-close").addEventListener("click", closeSheet);

/* ---------- Boot ---------- */
renderAll();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
