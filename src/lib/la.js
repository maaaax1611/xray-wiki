'use strict';
/* Hilfsfunktionen der Seite Lineare Algebra: Canvas, Achsen, Farben, Animationsschleife, Ebene mit Gitter, Pfeile, ziehbare Punkte, 2×2-Algebra, dichte Löser. */
const $ = s => document.querySelector(s);
const root = document.documentElement;
const tok = n => getComputedStyle(root).getPropertyValue(n).trim();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
const DISP = '"IBM Plex Sans Condensed", "Arial Narrow", system-ui, sans-serif';
const nf = (v, d = 0) => (Math.abs(v) < 0.5 * Math.pow(10, -d) ? 0 : v).toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
const ex = (v, d = 1) => { if (!isFinite(v)) return '∞'; if (v === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(v))); if (e >= -2 && e < 4) return nf(v, e < 0 ? d - e : Math.max(0, d + 1 - e)); return `${nf(v / Math.pow(10, e), d)}·10${String(e).replace('-', '⁻').replace(/\d/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c])}`; };
function rgb(c) { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); const v = parseInt(c, 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
function rgba(c, a) { const [r, g, b] = rgb(c); return `rgba(${r},${g},${b},${a})`; }
let seed = 1; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
function gauss() { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); }
function fit(c) {
  const r = c.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, r.width), h = Math.max(1, r.height), W = Math.round(w * dpr), H = Math.round(h * dpr);
  if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
  const ctx = c.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}
function frame(ctx, x0px, y0px, w, h, o) {
  const L = o.l ?? 48, R = o.r ?? 12, T = o.t ?? 12, B = o.b ?? 36;
  const bx = x0px + L, by = y0px + T, bw = Math.max(10, w - L - R), bh = Math.max(10, h - T - B);
  const ty = v => o.ylog ? Math.log10(v) : v;
  const X = v => bx + (v - o.x0) / (o.x1 - o.x0) * bw, Y = v => by + bh - (ty(v) - ty(o.y0)) / (ty(o.y1) - ty(o.y0)) * bh;
  ctx.font = `11px ${MONO}`; ctx.lineWidth = 1;
  const grid = tok('--grid'), muted = tok('--muted');
  for (const v of (o.xt || [])) { const x = X(v); ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(x, by); ctx.lineTo(x, by + bh); ctx.stroke(); ctx.fillStyle = muted; ctx.textAlign = 'center'; ctx.fillText(o.xf ? o.xf(v) : String(v), x, by + bh + 15); }
  for (const v of (o.yt || [])) { const y = Y(v); ctx.strokeStyle = grid; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(bx + bw, y); ctx.stroke(); ctx.fillStyle = muted; ctx.textAlign = 'right'; ctx.fillText(o.yf ? o.yf(v) : String(v), bx - 6, y + 4); }
  ctx.strokeStyle = tok('--rule'); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.stroke();
  ctx.fillStyle = muted; ctx.font = `12px ${DISP}`;
  if (o.xl) { ctx.textAlign = 'center'; ctx.fillText(o.xl, bx + bw / 2, by + bh + 31); }
  if (o.yl) { ctx.save(); ctx.translate(x0px + 12, by + bh / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText(o.yl, 0, 0); ctx.restore(); }
  return { X, Y, bx, by, bw, bh };
}
const mods = [];
const io = new IntersectionObserver(es => es.forEach(e => { if (e.target._mod) e.target._mod.visible = e.isIntersecting; }), { rootMargin: '100px' });
function reg(m) { m.visible = true; m.el._mod = m; io.observe(m.el); mods.push(m); new ResizeObserver(() => m.draw()).observe(m.el); return m; }
const redrawAll = () => mods.forEach(m => m.draw());
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redrawAll);
new MutationObserver(redrawAll).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
let last = performance.now();
function loop(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; for (const m of mods) if (m.anim && m.playing && m.visible) { m.step(dt); m.draw(); } requestAnimationFrame(loop); }
requestAnimationFrame(loop);
function rafDebounce(fn) { let p = false; return () => { if (p) return; p = true; requestAnimationFrame(() => { p = false; fn(); }); }; }

/* ---------- Ebene mit Koordinatengitter ---------- */
// R: halbe Breite des sichtbaren Bereichs in Einheiten der kürzeren Seite
function plane(c, R = 3, cx0 = 0, cy0 = 0) {
  const { ctx, w, h } = fit(c);
  const s = Math.min(w, h) / (2 * R), cx = w / 2 - cx0 * s, cy = h / 2 + cy0 * s;
  const S = (x, y) => [cx + x * s, cy - y * s], inv = (px, py) => [(px - cx) / s, (cy - py) / s];
  const xr = [inv(0, 0)[0], inv(w, 0)[0]], yr = [inv(0, h)[1], inv(0, 0)[1]];
  return { ctx, w, h, s, S, inv, xr, yr };
}
function grid(p, step = 1) {
  const { ctx, S, xr, yr, w, h } = p;
  ctx.lineWidth = 1; ctx.strokeStyle = tok('--grid');
  ctx.beginPath();
  for (let x = Math.ceil(xr[0] / step) * step; x <= xr[1]; x += step) { const [px] = S(x, 0); ctx.moveTo(px, 0); ctx.lineTo(px, h); }
  for (let y = Math.ceil(yr[0] / step) * step; y <= yr[1]; y += step) { const [, py] = S(0, y); ctx.moveTo(0, py); ctx.lineTo(w, py); }
  ctx.stroke();
  ctx.strokeStyle = tok('--rule'); ctx.lineWidth = 1.4; ctx.beginPath();
  const [ox, oy] = S(0, 0); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
}
function arrow(p, x0, y0, x1, y1, col, lw = 2.4, dash) {
  const { ctx, S } = p; const [a, b] = S(x0, y0), [c, d] = S(x1, y1);
  const L = Math.hypot(c - a, d - b); if (L < 1) return;
  const ux = (c - a) / L, uy = (d - b) / L, hl = Math.min(11, L * 0.45);
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c - ux * hl * 0.8, d - uy * hl * 0.8); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(c, d); ctx.lineTo(c - ux * hl - uy * hl * 0.45, d - uy * hl + ux * hl * 0.45); ctx.lineTo(c - ux * hl + uy * hl * 0.45, d - uy * hl - ux * hl * 0.45); ctx.closePath(); ctx.fill();
}
function line(p, x0, y0, x1, y1, col, lw = 1.5, dash) { const { ctx, S } = p; const [a, b] = S(x0, y0), [c, d] = S(x1, y1); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); ctx.setLineDash([]); }
function label(p, x, y, txt, col, dx = 8, dy = -8, font = `600 14px ${DISP}`) { const { ctx, S } = p; const [a, b] = S(x, y); ctx.font = font; ctx.fillStyle = col; ctx.textAlign = dx < 0 ? 'right' : 'left'; ctx.fillText(txt, a + dx, b + dy); }
function dot(p, x, y, col, r = 4) { const { ctx, S } = p; const [a, b] = S(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(a, b, r, 0, 2 * Math.PI); ctx.fill(); }
function handle(p, x, y, col) { const { ctx, S } = p; const [a, b] = S(x, y); ctx.fillStyle = tok('--surface'); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(a, b, 6.5, 0, 2 * Math.PI); ctx.fill(); ctx.stroke(); }
function poly(p, pts, close) { const { ctx, S } = p; ctx.beginPath(); pts.forEach(([x, y], i) => { const [a, b] = S(x, y); i ? ctx.lineTo(a, b) : ctx.moveTo(a, b); }); if (close) ctx.closePath(); }

// Ziehbare Punkte: hs = [{get, set}], view() liefert die aktuelle Ebene
function draggable(c, hs, view, onchange, onClickEmpty) {
  let act = null;
  const pos = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  c.style.touchAction = 'none';
  c.addEventListener('pointerdown', e => {
    const p = view(); if (!p) return; const [mx, my] = pos(e);
    let best = null, bd = 22;
    hs.forEach(h => { const [x, y] = h.get(); const [a, b] = p.S(x, y); const d = Math.hypot(a - mx, b - my); if (d < bd) { bd = d; best = h; } });
    if (best) { act = best; c.setPointerCapture(e.pointerId); e.preventDefault(); }
    else if (onClickEmpty) { onClickEmpty(...p.inv(mx, my)); }
  });
  c.addEventListener('pointermove', e => {
    const p = view(); if (!p) return; const [mx, my] = pos(e);
    if (act) { let [x, y] = p.inv(mx, my); x = Math.max(p.xr[0] + 0.1, Math.min(p.xr[1] - 0.1, x)); y = Math.max(p.yr[0] + 0.1, Math.min(p.yr[1] - 0.1, y)); act.set(Math.round(x * 10) / 10, Math.round(y * 10) / 10); onchange(); }
    else c.style.cursor = hs.some(h => { const [x, y] = h.get(); const [a, b] = p.S(x, y); return Math.hypot(a - mx, b - my) < 22; }) ? 'grab' : (onClickEmpty ? 'crosshair' : 'default');
  });
  const up = () => { act = null; }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
}

/* ---------- 2×2-Algebra ---------- */
const mul = (M, x, y) => [M[0] * x + M[1] * y, M[2] * x + M[3] * y];
const mm = (A, B) => [A[0] * B[0] + A[1] * B[2], A[0] * B[1] + A[1] * B[3], A[2] * B[0] + A[3] * B[2], A[2] * B[1] + A[3] * B[3]];
const det2 = M => M[0] * M[3] - M[1] * M[2];
const rot = t => [Math.cos(t), -Math.sin(t), Math.sin(t), Math.cos(t)];
function eig2(M) {
  const [a, b, c, d] = M, tr = a + d, dt = det2(M), disc = tr * tr / 4 - dt;
  if (disc < -1e-12) return { complex: true, re: tr / 2, im: Math.sqrt(-disc) };
  const s = Math.sqrt(Math.max(0, disc)), l = [tr / 2 + s, tr / 2 - s];
  const vec = lam => { let v; if (Math.abs(b) > 1e-9) v = [b, lam - a]; else if (Math.abs(c) > 1e-9) v = [lam - d, c]; else v = Math.abs(lam - a) < 1e-9 ? [1, 0] : [0, 1]; const n = Math.hypot(...v); return [v[0] / n, v[1] / n]; };
  const v1 = vec(l[0]); let v2 = vec(l[1]);
  if (Math.abs(b) < 1e-9 && Math.abs(c) < 1e-9 && Math.abs(l[0] - l[1]) < 1e-9) v2 = [0, 1];
  return { complex: false, l, v: [v1, v2] };
}
function svd2(M) {
  const [a, b, c, d] = M;
  const s11 = a * a + c * c, s22 = b * b + d * d, s12 = a * b + c * d;
  const phi = 0.5 * Math.atan2(2 * s12, s11 - s22);
  const v1 = [Math.cos(phi), Math.sin(phi)], v2 = [-Math.sin(phi), Math.cos(phi)];
  const av1 = mul(M, ...v1), av2 = mul(M, ...v2);
  const sg1 = Math.hypot(...av1), sg2 = Math.hypot(...av2);
  const u1 = sg1 > 1e-12 ? [av1[0] / sg1, av1[1] / sg1] : [1, 0];
  let u2 = sg2 > 1e-9 ? [av2[0] / sg2, av2[1] / sg2] : [-u1[1], u1[0]];
  return { phi, s: [sg1, sg2], v: [v1, v2], u: [u1, u2] }; // sg1 >= sg2 durch Wahl von phi
}
const fmtM = M => `[${nf(M[0], 2)}  ${nf(M[1], 2)} ; ${nf(M[2], 2)}  ${nf(M[3], 2)}]`;

/* ---------- Matrix-Eingabe mit Beispielen ---------- */
const PRESETS = {
  'Einheitsmatrix': [1, 0, 0, 1],
  'Streckung': [2, 0, 0, 0.5],
  'Drehung um 30°': [0.87, -0.5, 0.5, 0.87],
  'Drehung um 90°': [0, -1, 1, 0],
  'Scherung': [1, 1, 0, 1],
  'Spiegelung': [1, 0, 0, -1],
  'Symmetrisch': [2, 1, 1, 1.5],
  'Projektion (Rang 1)': [1, 1, 0.5, 0.5],
  'Allgemein': [1.5, 0.6, -0.4, 1.1],
};
function matCtl(box, sel, init, onchange, names = Object.keys(PRESETS)) {
  const ids = ['a', 'b', 'c', 'd'], lbl = ['a₁₁', 'a₁₂', 'a₂₁', 'a₂₂'], ins = [];
  box.innerHTML = ids.map((k, i) => `<div class="ctrl"><div class="lab"><label for="${box.id}-${k}">${lbl[i]}</label><output id="${box.id}-${k}-o"></output></div><input autocomplete="off" id="${box.id}-${k}" type="range" min="-2" max="2" step="0.01"></div>`).join('');
  ids.forEach(k => ins.push(box.querySelector(`#${box.id}-${k}`)));
  sel.innerHTML = names.map(n => `<option>${n}</option>`).join('') + '<option value="">eigene Werte</option>';
  const show = () => ins.forEach((el, i) => box.querySelector(`#${box.id}-${ids[i]}-o`).textContent = nf(+el.value, 2));
  const set = M => { ins.forEach((el, i) => el.value = M[i]); show(); };
  ins.forEach(el => el.addEventListener('input', () => { sel.value = ''; show(); onchange(); }));
  sel.addEventListener('change', () => { if (sel.value) { set(PRESETS[sel.value]); onchange(); } });
  sel.value = init; set(PRESETS[init]);
  return { get: () => ins.map(el => +el.value), set };
}

/* ---------- Dichte Hilfsroutinen ---------- */
function solve(Ain, bin) { // Gauß mit Spaltenpivotisierung, A n×n als Array von Zeilen
  const n = bin.length, A = Ain.map(r => r.slice()), b = bin.slice();
  for (let k = 0; k < n; k++) {
    let p = k; for (let i = k + 1; i < n; i++) if (Math.abs(A[i][k]) > Math.abs(A[p][k])) p = i;
    [A[k], A[p]] = [A[p], A[k]]; [b[k], b[p]] = [b[p], b[k]];
    for (let i = k + 1; i < n; i++) { const f = A[i][k] / A[k][k]; if (!isFinite(f)) continue; for (let j = k; j < n; j++) A[i][j] -= f * A[k][j]; b[i] -= f * b[k]; }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let j = i + 1; j < n; j++) s -= A[i][j] * x[j]; x[i] = s / A[i][i]; }
  return x;
}
function jacobiEig(Sin, n) { // symmetrisch, Float64Array n*n; liefert Eigenwerte absteigend und Eigenvektoren als Spalten
  const S = Float64Array.from(Sin), V = new Float64Array(n * n);
  for (let i = 0; i < n; i++) V[i * n + i] = 1;
  for (let sweep = 0; sweep < 30; sweep++) {
    let off = 0; for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += S[p * n + q] * S[p * n + q];
    if (off < 1e-22) break;
    for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
      const apq = S[p * n + q]; if (Math.abs(apq) < 1e-300) continue;
      const app = S[p * n + p], aqq = S[q * n + q], tau = (aqq - app) / (2 * apq);
      const t = Math.sign(tau || 1) / (Math.abs(tau) + Math.sqrt(1 + tau * tau)), cs = 1 / Math.sqrt(1 + t * t), sn = t * cs;
      for (let k = 0; k < n; k++) { const skp = S[k * n + p], skq = S[k * n + q]; S[k * n + p] = cs * skp - sn * skq; S[k * n + q] = sn * skp + cs * skq; }
      for (let k = 0; k < n; k++) { const spk = S[p * n + k], sqk = S[q * n + k]; S[p * n + k] = cs * spk - sn * sqk; S[q * n + k] = sn * spk + cs * sqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k * n + p], vkq = V[k * n + q]; V[k * n + p] = cs * vkp - sn * vkq; V[k * n + q] = sn * vkp + cs * vkq; }
    }
  }
  const idx = [...Array(n).keys()].sort((i, j) => S[j * n + j] - S[i * n + i]);
  return { val: idx.map(i => S[i * n + i]), vec: idx.map(i => Array.from({ length: n }, (_, k) => V[k * n + i])) };
}

