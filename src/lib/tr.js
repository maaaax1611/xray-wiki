'use strict';
/* Hilfsfunktionen der Seite Transformer: Canvas, Achsen, Farben, Animationsschleife, Heatmaps, Softmax. */
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


/* ---------- Kleine Lineare Algebra und Softmax ---------- */
const dotv = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const matvec = (W, x) => W.map(r => dotv(r, x));               // W: Zeilen
const matmul = (A, B) => A.map(r => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
const transpose = A => A[0].map((_, j) => A.map(r => r[j]));
function softmax(z, T = 1) { const m = Math.max(...z.filter(isFinite)); const e = z.map(v => isFinite(v) ? Math.exp((v - m) / T) : 0); const s = e.reduce((a, b) => a + b, 0); return e.map(v => v / s); }
const entropy = p => -p.reduce((s, x) => s + (x > 0 ? x * Math.log2(x) : 0), 0);

/* ---------- Farben ---------- */
// Wert 0…1 auf eine Skala von Hintergrund zu Akzentfarbe
function heat(v, col = tok('--accent')) { const [r, g, b] = rgb(col), [r0, g0, b0] = rgb(tok('--surface')); v = Math.max(0, Math.min(1, v)); return `rgb(${Math.round(r0 + (r - r0) * v)},${Math.round(g0 + (g - g0) * v)},${Math.round(b0 + (b - b0) * v)})`; }
// Divergierend: negativ = --hole, positiv = --accent
function div(v) { return v >= 0 ? heat(v, tok('--accent')) : heat(-v, tok('--hole')); }
function textOn(v) { return v > 0.55 ? tok('--surface') : tok('--fg'); }

/* ---------- Heatmap einer Matrix mit Beschriftung ---------- */
// o: {x, y, cell, rows, cols (Beschriftungen), fmt, color(v,i,j), hl:{i,j}, title}
function heatmap(ctx, M, o) {
  const n = M.length, m = M[0].length, c = o.cell, x0 = o.x + (o.rows ? o.lw ?? 54 : 0), y0 = o.y + (o.cols ? o.th ?? 18 : 0);
  ctx.font = `${Math.min(12, c * 0.36)}px ${MONO}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const v = M[i][j], fill = o.color ? o.color(v, i, j) : heat(v);
    ctx.fillStyle = fill; ctx.fillRect(x0 + j * c, y0 + i * c, c - 1, c - 1);
    if (o.fmt && c >= 22) { const t = o.fmt(v, i, j); if (t !== '') { ctx.fillStyle = o.textColor ? o.textColor(v, i, j) : textOn(Math.abs(v)); ctx.fillText(t, x0 + j * c + c / 2, y0 + i * c + c / 2 + 0.5); } }
  }
  if (o.hl) { ctx.strokeStyle = tok('--fg'); ctx.lineWidth = 2; if (o.hl.i != null) ctx.strokeRect(x0 - 1, y0 + o.hl.i * c - 1, m * c + 1, c + 1); if (o.hl.j != null) ctx.strokeRect(x0 + o.hl.j * c - 1, y0 - 1, c + 1, n * c + 1); }
  ctx.font = `12px ${DISP}`; ctx.fillStyle = tok('--muted'); ctx.textBaseline = 'middle';
  if (o.rows) { ctx.textAlign = 'right'; o.rows.forEach((t, i) => ctx.fillText(t, x0 - 6, y0 + i * c + c / 2)); }
  if (o.cols) { ctx.textAlign = 'center'; o.cols.forEach((t, j) => { ctx.save(); ctx.translate(x0 + j * c + c / 2, y0 - 6); if (o.rotate) { ctx.rotate(-Math.PI / 4); ctx.textAlign = 'left'; } ctx.fillText(t, 0, 0); ctx.restore(); }); }
  if (o.title) { ctx.textAlign = 'left'; ctx.fillStyle = tok('--fg'); ctx.font = `600 13px ${DISP}`; ctx.fillText(o.title, o.x, o.y - 4); }
  ctx.textBaseline = 'alphabetic';
  return { x0, y0, w: m * c, h: n * c };
}
// Pixelposition -> Zelle
function cellAt(hm, c, px, py) { const j = Math.floor((px - hm.x0) / c), i = Math.floor((py - hm.y0) / c); return (i >= 0 && j >= 0 && px < hm.x0 + hm.w && py < hm.y0 + hm.h) ? { i, j } : null; }
function mouse(c, e) { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }

/* ---------- Beispielsatz für mehrere Abbildungen ---------- */
const TR_TOKENS = ['Die', 'Katze', 'sitzt', 'auf', 'der', 'Matte'];
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

/* Von Hand gewählte Queries und Keys (d_k = 4, Dimensionen grob: Tier, Ort, Handlung, Funktionswort)
   und zweidimensionale Values, damit man die Mittelwerte zeichnen kann. */
const TR_K = [[0, 0, 0, 1], [1, 0.2, 0, 0], [0, 0, 1, 0], [0, 0.3, 0.2, 0.8], [0, 0, 0, 1], [0, 1, 0, 0]];
const TR_Q = [[2.6, 1.2, 0, 0], [0.4, 0, 2.8, 0.6], [2.8, 1.4, 0, 0], [0, 3, 0, 0], [0.6, 2.8, 0, 0], [0, 0, 1.4, 2.2]];
const TR_V = [[-1.6, 1.2], [1.6, 1.5], [0.2, -1.6], [-1.2, -0.7], [-1.8, 0.5], [1.4, -0.3]];
const trScores = (scale = true) => TR_Q.map(q => TR_K.map(k => dotv(q, k) / (scale ? Math.sqrt(q.length) : 1)));

/* ---------- Matrix als Kästchengitter mit Zahlen ---------- */
// o: {x, y, cw, ch, rows, cols, fmt, fill(v,i,j), num(i,j) -> Zahl zeigen?, dim(i,j) -> true = abgeblendet, hlRow, hlCol, label (unter dem Gitter), border}
function mgrid(ctx, M, o) {
  const n = M.length, m = M[0].length, cw = o.cw, ch = o.ch ?? o.cw, x0 = o.x, y0 = o.y;
  const fs = Math.max(9, Math.min(12.5, cw * 0.27, ch * 0.42));
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const v = M[i][j], x = x0 + j * cw, y = y0 + i * ch, off = o.dim && o.dim(i, j);
    ctx.globalAlpha = off ? 0.28 : 1;
    ctx.fillStyle = o.fill ? o.fill(v, i, j) : tok('--surface'); ctx.fillRect(x, y, cw, ch);
    ctx.strokeStyle = o.border || tok('--rule'); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
    if (v !== null && v !== undefined && cw >= 26 && (!o.num || o.num(i, j))) { ctx.fillStyle = o.text ? o.text(v, i, j) : tok('--fg'); ctx.font = `${fs}px ${MONO}`; ctx.textAlign = 'center'; ctx.fillText(o.fmt ? o.fmt(v) : nf(v, 2), x + cw / 2, y + ch / 2 + 0.5); }
    ctx.globalAlpha = 1;
  }
  ctx.strokeStyle = tok('--fg'); ctx.lineWidth = 2;
  if (o.hlRow != null) ctx.strokeRect(x0 - 1, y0 + o.hlRow * ch - 1, m * cw + 2, ch + 2);
  if (o.hlCol != null) ctx.strokeRect(x0 + o.hlCol * cw - 1, y0 - 1, cw + 2, n * ch + 2);
  ctx.fillStyle = tok('--muted'); ctx.font = `12px ${DISP}`;
  if (o.rows) { ctx.textAlign = 'right'; o.rows.forEach((t, i) => ctx.fillText(t, x0 - 6, y0 + i * ch + ch / 2)); }
  if (o.cols) { ctx.textAlign = 'center'; ctx.font = `11px ${DISP}`; o.cols.forEach((t, j) => ctx.fillText(t, x0 + j * cw + cw / 2, y0 - 9)); }
  if (o.label) { ctx.textAlign = 'center'; ctx.fillStyle = tok('--fg'); ctx.font = `italic 600 14px ${DISP}`; ctx.fillText(o.label, x0 + m * cw / 2, y0 + n * ch + 16); }
  ctx.textBaseline = 'alphabetic';
  return { x0, y0, w: m * cw, h: n * ch, cw, ch, hit(px, py) { const j = Math.floor((px - x0) / cw), i = Math.floor((py - y0) / ch); return i >= 0 && j >= 0 && i < n && j < m ? { i, j } : null; } };
}
function arrowPx(ctx, x1, y1, x2, y2, col, lw = 1.4) {
  ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1); ctx.beginPath(); ctx.moveTo(x2, y2); ctx.lineTo(x2 - 7 * Math.cos(a - 0.4), y2 - 7 * Math.sin(a - 0.4)); ctx.lineTo(x2 - 7 * Math.cos(a + 0.4), y2 - 7 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
}
// Eingabe-Embeddings für die einfache Attention ohne Projektionen (Werte 0…1)
const TR_X = [[0.62, 0.10, 0.08, 0.71], [0.15, 0.88, 0.31, 0.12], [0.22, 0.35, 0.83, 0.18], [0.48, 0.20, 0.27, 0.55], [0.58, 0.12, 0.10, 0.66], [0.10, 0.70, 0.12, 0.24]];
