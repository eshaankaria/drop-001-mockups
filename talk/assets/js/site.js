// Drop 001 storefront mockup, version 2. No backend: the bag lives in this browser, nothing is saved or charged.
const DROP = {
  opens: new Date("2027-02-12T20:00:00Z"),   // Fri Feb 12 2027, 12pm PT (placeholder date)
  opensText: "Opens Fri, Feb 12 at 12pm PT",
  shipsText: "March 19",
};
const ALL = ["XS", "S", "M", "L", "XL", "2XL"];
const FLEECE = "Heavyweight garment-dyed cotton fleece with a sun-faded wash. Final weight is confirmed when the samples land.";
const JERSEY = "Heavyweight garment-dyed cotton jersey with a sun-faded wash. Final weight is confirmed when the samples land.";
const ZIPFIT = "Zip-up. Baggy and boxy, dropped shoulder, cropped at the hip. Take your usual size.";
const PULLFIT = "Pullover. Baggy and boxy, dropped shoulder, cropped at the hip. Take your usual size.";
// colors: [id, label, swatch]
const ITEMS = [
  { id: "talk-zip", name: "Talk Zip", price: 85, sizes: ALL, big: true, fit: ZIPFIT, fabric: FLEECE,
    says: "TALK in raised fuzzy letters across the chest",
    colors: [["black", "Washed black", "#2b2a2a"], ["cream", "Cream", "#e9e2d0"], ["sage", "Sage", "#8fa585"], ["red", "Black and red", "#b3262b"]] },
  { id: "talk-sweats", name: "Talk Sweats", price: 75, sizes: ALL, big: true, fabric: FLEECE,
    fit: "Wide leg that stacks at an open hem. Matches the Talk Zip. Take your usual size.",
    says: "lettering on the thigh",
    colors: [["blackpink", "Washed black", "#2b2a2a"], ["pink", "Pink", "#e3a3ad"], ["sage", "Sage", "#8fa585"], ["black", "Black, script", "#4a4848"]] },
  { id: "one-love", name: "One Love", price: 85, sizes: ALL, fit: PULLFIT, fabric: FLEECE,
    says: "ONE LOVE in raised fuzzy letters across the chest",
    colors: [["pink", "Pink", "#e3a3ad"]] },
  { id: "script-zip", name: "Script Zip", price: 90, sizes: ALL, fit: ZIPFIT, fabric: FLEECE,
    says: "yk we love to talk in script across the chest",
    colors: [["leopard", "Black, leopard hood", "#2b2a2a"], ["pink", "Pink", "#e3a3ad"]] },
  { id: "blur-tee", name: "Blur Tee", price: 45, sizes: ALL, fabric: JERSEY,
    fit: "Boxy, dropped shoulder, thick collar. Take your usual size.",
    says: "a blurred meditating figure with meditate in red",
    colors: [["cream", "Cream", "#e9e2d0"], ["black", "Washed black", "#2b2a2a"]] },
  { id: "baby-tee", name: "Baby Tee", price: 35, sizes: ["XS", "S", "M", "L", "XL"], fabric: JERSEY,
    fit: "Fitted and cropped above the waist. Size up for a looser fit.",
    says: "script across the chest",
    colors: [["bone", "Bone", "#ece7dc"], ["black", "Washed black", "#2b2a2a"], ["pink", "Pink", "#e3a3ad"]] },
  { id: "two-tone-zip", name: "Two-Tone Zip", price: 95, sizes: ALL, fit: ZIPFIT, fabric: "Fleece body with waffle-knit sleeves and hood. Final fabrics are confirmed when the samples land.",
    says: "love to talk in script on the chest",
    colors: [["black", "Black and charcoal", "#2b2a2a"]] },
  { id: "sherpa-zip", name: "Sherpa Zip", price: 120, sizes: ALL, fit: ZIPFIT, fabric: "Cream sherpa fleece with washed black trim. Final fabric is confirmed when the samples land.",
    says: "love to talk in script on the chest",
    colors: [["cream", "Cream", "#e9e2d0"]] },
  { id: "meditate-pullover", name: "Meditate Pullover", price: 95, sizes: ALL, fit: PULLFIT, fabric: FLEECE,
    says: "meditate in rhinestones across the chest",
    colors: [["burgundy", "Burgundy", "#7a2a35"]] },
  { id: "end-pullover", name: "End Pullover", price: 85, sizes: ALL, fit: PULLFIT, fabric: FLEECE,
    says: "let me know at the end in script across the chest",
    colors: [["black", "Washed black", "#2b2a2a"], ["blue", "Baby blue", "#9cc0e6"]] },
  { id: "distressed-pullover", name: "Distressed Pullover", price: 90, sizes: ALL, fit: PULLFIT, fabric: FLEECE + " Frayed cuffs, hem and hood edge.",
    says: "love to talk in spiked lettering across the chest",
    colors: [["black", "Washed black", "#2b2a2a"]] },
];
const $ = (s, r = document) => r.querySelector(s);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const item = id => ITEMS.find(i => i.id === id);
const colorOf = (i, c) => i.colors.find(x => x[0] === c) || i.colors[0];
const src = (i, c, w) => `assets/img/${i.id}-${colorOf(i, c)[0]}-${w}.webp`;
const img = (i, c, sizes, eager) =>
  `<img src="${src(i, c, 560)}" srcset="${src(i, c, 560)} 560w, ${src(i, c, 1024)} 1024w" sizes="${sizes}" width="1024" height="1024" alt="${i.name} in ${colorOf(i, c)[1].toLowerCase()}, with ${i.says}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const tile = (i, sizes, eager) =>
  `<a class="tile${i.big ? " tile--big" : ""}" href="product.html#${i.id}"><div class="tile__img">${img(i, null, sizes, eager)}</div>
   <div class="tile__meta"><span class="tile__name">${i.name}</span><span>$${i.price}</span></div>
   <div class="tile__sub">${i.colors.length > 1 ? i.colors.length + " colors" : i.colors[0][1]}</div></a>`;

/* ---------- window state + clock ---------- */
let state = store.get("d1-state", "open");            // before | open | closed  (mockup switch)
const openEnds = Date.now() + ((6 * 24 + 3) * 3600 + 59 * 60 + 42) * 1000;   // simulated: window closes in ~6 days
const pad = n => String(n).padStart(2, "0");
function parts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
}
function tick() {
  const label = $("#winLabel"), clock = $("#clock"), big = $("#bigClock");
  if (state === "open") {
    const [d, h, m, s] = parts(openEnds - Date.now());
    label.textContent = "Pre-order closes in";
    clock.textContent = `${pad(d)}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  } else if (state === "before") {
    label.textContent = "Drop 001 opens February 12";
    clock.textContent = "";
    if (big) parts(DROP.opens - Date.now()).forEach((v, n) => { big.querySelectorAll("b")[n].textContent = pad(v); });
  } else {
    label.textContent = `Drop 001 is closed. Ships by ${DROP.shipsText}`;
    clock.textContent = "";
  }
}
function applyState() {
  document.querySelectorAll(".mock button").forEach(b => b.setAttribute("aria-pressed", b.dataset.state === state));
  const page = $("#app").dataset.page;
  if (page === "floor") {
    $("#floor").hidden = state === "before";
    $("#gate").hidden = state !== "before";
    $("#after").hidden = state !== "closed";
  }
  if (page === "piece") renderPiece();
  tick();
}

/* ---------- bag ---------- */
let bag = store.get("d2-bag", []).filter(l => item(l.id));
function renderBag() {
  $("#bagCount").textContent = bag.reduce((n, l) => n + l.qty, 0);
  const lines = $("#bagLines");
  if (!bag.length) {
    lines.innerHTML = `<p class="bag__empty">Nothing in the bag yet.</p>`;
  } else {
    lines.innerHTML = bag.map((l, n) => {
      const i = item(l.id);
      return `<div class="line"><div class="line__img"><img src="${src(i, l.color, 560)}" width="72" height="72" alt=""></div>
        <div><div class="line__name">${i.name}</div><div class="mute caps">${colorOf(i, l.color)[1]} · ${l.size}</div>
          <div class="qty"><button data-n="${n}" data-d="-1" aria-label="One fewer ${i.name}">−</button><span>${l.qty}</span><button data-n="${n}" data-d="1" aria-label="One more ${i.name}">+</button></div></div>
        <div class="line__right">$${i.price * l.qty}</div></div>`;
    }).join("");
  }
  $("#bagTotal").textContent = "$" + bag.reduce((t, l) => t + l.qty * item(l.id).price, 0);
  $("#bagCheckout").disabled = !bag.length;
  store.set("d2-bag", bag);
}
function initBag() {
  const dlg = $("#bag");
  $("#bagOpen").addEventListener("click", () => { $("#bagNote").textContent = ""; dlg.showModal(); });
  $("#bagClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  $("#bagLines").addEventListener("click", e => {
    const b = e.target.closest("button[data-n]"); if (!b) return;
    const l = bag[+b.dataset.n]; l.qty += +b.dataset.d;
    if (l.qty < 1) bag.splice(+b.dataset.n, 1);
    renderBag();
  });
  $("#bagCheckout").addEventListener("click", () => {
    $("#bagNote").textContent = "Checkout connects once the Shopify store exists. Nothing is charged here.";
  });
  renderBag();
}

/* ---------- product page ---------- */
let cur = null, size = null, color = null;
function renderPiece() {
  const next = item(location.hash.slice(1)) || ITEMS[0];
  if (next !== cur) { cur = next; size = null; color = cur.colors[0][0]; window.scrollTo(0, 0); }
  document.title = `${cur.name} · Drop 001`;
  $("#pieceArt").innerHTML = img(cur, color, "(max-width: 760px) 100vw, 58vw", true);
  $("#pName").textContent = cur.name;
  $("#pPrice").textContent = "$" + cur.price;
  $("#pFit").textContent = cur.fit;
  $("#pFabric").textContent = cur.fabric;
  $("#pColorName").textContent = colorOf(cur, color)[1];
  $("#pColors").innerHTML = cur.colors.map(c =>
    `<button class="swatch" data-c="${c[0]}" aria-pressed="${c[0] === color}" aria-label="${c[1]}"><i style="background:${c[2]}"></i></button>`).join("");
  $("#pSizes").innerHTML = cur.sizes.map(s => `<button class="size" data-s="${s}" aria-pressed="${s === size}">${s}</button>`).join("");
  const buy = $("#buy");
  buy.disabled = state !== "open";
  buy.textContent = state === "before" ? "Opens February 12" : state === "closed" ? "Closed" : size ? `Pre-order · $${cur.price}` : "Choose a size";
  $("#promise").textContent = state === "closed"
    ? "This drop is in production. Sign up on the front page to hear about the next one."
    : `Made to order after the window closes. Ships by ${DROP.shipsText}.`;
  const n = ITEMS.indexOf(cur);
  $("#rest").innerHTML = [1, 2, 3].map(k => ITEMS[(n + k) % ITEMS.length]).map(i => tile({ ...i, big: false }, "(max-width: 760px) 33vw, 300px")).join("");
}
function initPiece() {
  $("#pSizes").addEventListener("click", e => { const b = e.target.closest(".size"); if (b) { size = b.dataset.s; renderPiece(); } });
  $("#pColors").addEventListener("click", e => {
    const b = e.target.closest(".swatch"); if (!b) return;
    color = b.dataset.c; renderPiece(); $(`#pColors [data-c="${color}"]`).focus();
  });
  $("#buy").addEventListener("click", () => {
    if (!size) { $("#pSizes .size")?.focus(); return; }
    const l = bag.find(x => x.id === cur.id && x.size === size && x.color === color);
    l ? l.qty++ : bag.push({ id: cur.id, color, size, qty: 1 });
    renderBag(); $("#bagNote").textContent = ""; $("#bag").showModal();
  });
  addEventListener("hashchange", renderPiece);
}

/* ---------- boot ---------- */
function start() {
  const page = $("#app").dataset.page;
  if (page === "floor") {
    $("#floor").innerHTML = ITEMS.map((i, n) => tile(i, i.big ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 760px) 50vw, 33vw", n < 2)).join("");
    $("#opensText").textContent = DROP.opensText;
    document.querySelectorAll("form.signup").forEach(f => f.addEventListener("submit", e => {
      e.preventDefault();
      const done = f.nextElementSibling;
      done.textContent = f.elements[0].value.trim() ? "You're on the list." : "Enter an email or a phone number.";
    }));
  }
  if (page === "piece") initPiece();
  initBag();
  document.querySelectorAll(".mock button").forEach(b => b.addEventListener("click", () => { state = b.dataset.state; store.set("d1-state", state); applyState(); }));
  applyState();
  setInterval(tick, 1000);
}
start();
