'use strict';
/* Hilfsfunktionen und Daten der Seite physik/rekonstruktion. */
const $ = s => document.querySelector(s);
const root = document.documentElement;
const tok = n => getComputedStyle(root).getPropertyValue(n).trim();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const MONO = '"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace';
const DISP = '"IBM Plex Sans Condensed", "Arial Narrow", system-ui, sans-serif';
const nf = (v, d = 0) => v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
function rgb(c) { c = c.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join(''); const v = parseInt(c, 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
function rgba(c, a) { const [r, g, b] = rgb(c); return `rgba(${r},${g},${b},${a})`; }
function gauss() { let u = 0; while (u === 0) u = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random()); }
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
  const X = v => bx + (v - o.x0) / (o.x1 - o.x0) * bw, Y = v => by + bh - (v - o.y0) / (o.y1 - o.y0) * bh;
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
function clipBox(ctx, f) { ctx.save(); ctx.beginPath(); ctx.rect(f.bx, f.by, f.bw, f.bh); ctx.clip(); }
const mods = [];
const io = new IntersectionObserver(es => es.forEach(e => { if (e.target._mod) e.target._mod.visible = e.isIntersecting; }), { rootMargin: '100px' });
function reg(m) { m.visible = true; m.el._mod = m; io.observe(m.el); mods.push(m); new ResizeObserver(() => m.draw()).observe(m.el); return m; }
const redrawAll = () => mods.forEach(m => m.draw());
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redrawAll);
new MutationObserver(redrawAll).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
let last = performance.now();
function loop(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; for (const m of mods) if (m.anim && m.playing && m.visible) { m.step(dt); m.draw(); } requestAnimationFrame(loop); }
requestAnimationFrame(loop);
function playBtn(btn, m) { btn.addEventListener('click', () => { m.playing = !m.playing; btn.textContent = m.playing ? 'Pause' : 'Abspielen'; }); if (!m.playing) btn.textContent = 'Abspielen'; }
function rafDebounce(fn) { let p = false; return () => { if (p) return; p = true; requestAnimationFrame(() => { p = false; fn(); }); }; }

/* ---------- FFT ---------- */
function fft(re, im, inv) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; } }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = 2 * Math.PI / len * (inv ? 1 : -1), wr = Math.cos(ang), wi = Math.sin(ang), half = len >> 1;
    for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let k = 0; k < half; k++) { const a = i + k, b = a + half; const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr; re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti; const nc = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nc; } }
  }
  if (inv) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}

/* ---------- Phantom ---------- */
const PH = [[0, 0, 14, 10, 0, 0.2], [-6, 1.5, 3.6, 5.2, 10, -0.15], [6, 1.5, 3.6, 5.2, -10, -0.15], [0.3, 0.6, 3.0, 2.4, 30, 0.02], [0, -6.8, 1.8, 1.6, 0, 0.4], [2.7, -4.0, 1.0, 1.0, 0, 0.15]];
const HW = 16, NG = 128, DX = 2 * HW / NG, NS = 128;
const XC = new Float64Array(NG), YC = new Float64Array(NG);
for (let i = 0; i < NG; i++) { XC[i] = -HW + (i + 0.5) * DX; YC[i] = HW - (i + 0.5) * DX; }
const MASK = new Uint8Array(NG * NG), TRUTH = new Float64Array(NG * NG);
for (let j = 0; j < NG; j++) for (let i = 0; i < NG; i++) {
  const x = XC[i], y = YC[j]; MASK[j * NG + i] = (x * x + y * y <= (HW - 0.5) ** 2) ? 1 : 0;
  let v = 0; for (const [x0, y0, A, B, ad, m] of PH) { const a = ad * Math.PI / 180, dx = x - x0, dy = y - y0; const xr = dx * Math.cos(a) + dy * Math.sin(a), yr = -dx * Math.sin(a) + dy * Math.cos(a); if ((xr / A) ** 2 + (yr / B) ** 2 <= 1) v += m; }
  TRUTH[j * NG + i] = v;
}
function projA(th) {
  const out = new Float64Array(NS), ct = Math.cos(th), st = Math.sin(th);
  for (let n = 0; n < NS; n++) {
    const s = -HW + (n + 0.5) * DX; let p = 0;
    for (const [x0, y0, A, B, ad, m] of PH) { const a = ad * Math.PI / 180, sp = s - (x0 * ct + y0 * st); const a2 = A * A * Math.cos(th - a) ** 2 + B * B * Math.sin(th - a) ** 2; if (sp * sp < a2) p += m * 2 * A * B * Math.sqrt(a2 - sp * sp) / a2; }
    out[n] = p;
  }
  return out;
}
function poisson(l) { if (l < 30) { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= Math.random(); } while (p > L); return k - 1; } return Math.max(0, Math.round(l + Math.sqrt(l) * gauss())); }
function noisy(p, I0) { return p.map(v => -Math.log(Math.max(poisson(I0 * Math.exp(-v)), 0.5) / I0)); }
const NP = 256;
const WIN = { ramlak: () => 1, shepp: f => f === 0 ? 1 : Math.sin(Math.PI * f / 2) / (Math.PI * f / 2), cos: f => Math.cos(Math.PI * f / 2), hann: f => 0.5 * (1 + Math.cos(Math.PI * f)) };
const Hc = {};
function getH(w) {
  if (Hc[w]) return Hc[w];
  const re = new Float64Array(NP), im = new Float64Array(NP);
  for (let n = 0; n < NP; n++) { const m = n <= NP / 2 ? n : n - NP; re[n] = m === 0 ? 1 / (4 * DX * DX) : (m % 2 ? -1 / (Math.PI * Math.PI * m * m * DX * DX) : 0); }
  fft(re, im, false);
  const H = new Float64Array(NP);
  for (let k = 0; k < NP; k++) { const f = Math.min(k, NP - k) / (NP / 2); H[k] = re[k] * DX * WIN[w](f); }
  return Hc[w] = H;
}
function filt(p, H) {
  const re = new Float64Array(NP), im = new Float64Array(NP); re.set(p);
  fft(re, im, false); for (let k = 0; k < NP; k++) { re[k] *= H[k]; im[k] *= H[k]; } fft(re, im, true);
  return re.slice(0, NS);
}
function backproject(qs, ths, out) {
  const w = Math.PI / ths.length;
  for (let k = 0; k < ths.length; k++) {
    const q = qs[k], ct = Math.cos(ths[k]), st = Math.sin(ths[k]);
    for (let j = 0; j < NG; j++) { const ys = YC[j] * st; for (let i = 0; i < NG; i++) { const idx = j * NG + i; if (!MASK[idx]) continue; const u = (XC[i] * ct + ys + HW) / DX - 0.5, n0 = Math.floor(u); if (n0 < 0 || n0 >= NS - 1) continue; const fr = u - n0; out[idx] += w * (q[n0] * (1 - fr) + q[n0 + 1] * fr); } }
  }
  return out;
}
function fbp(sino, ths, win) { const H = win === 'none' ? null : getH(win); return backproject(sino.map(p => H ? filt(p, H) : p), ths, new Float64Array(NG * NG)); }
function grayImg(arr, nx, ny, lo, hi, opt = {}) {
  const id = new ImageData(nx, ny);
  for (let k = 0; k < nx * ny; k++) {
    const o = k * 4; let v = arr[k];
    if (opt.mask && !opt.mask[k]) { id.data[o] = 0; id.data[o + 1] = 0; id.data[o + 2] = 0; id.data[o + 3] = 255; continue; }
    if (opt.neg && v < 0) { const a = Math.min(1, -v / (opt.neg)); id.data[o] = 20 * (1 - a); id.data[o + 1] = 40 * a; id.data[o + 2] = Math.round(180 * a); id.data[o + 3] = 255; continue; }
    const g = Math.round(255 * Math.max(0, Math.min(1, (v - lo) / (hi - lo))));
    id.data[o] = g; id.data[o + 1] = g; id.data[o + 2] = g; id.data[o + 3] = 255;
  }
  const off = document.createElement('canvas'); off.width = nx; off.height = ny; off.getContext('2d').putImageData(id, 0, 0); return off;
}
function drawImg(c, off, label) {
  const { ctx, w, h } = fit(c); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
  ctx.imageSmoothingEnabled = true; const s = Math.min(w, h); ctx.drawImage(off, (w - s) / 2, (h - s) / 2, s, s);
  if (label) { ctx.fillStyle = '#ccc'; ctx.font = `11px ${MONO}`; ctx.textAlign = 'left'; ctx.fillText(label, 8, 16); }
  return { ctx, w, h };
}
const rmseHU = x => { let s = 0, n = 0; for (let k = 0; k < x.length; k++) if (MASK[k]) { s += (x[k] - TRUTH[k]) ** 2; n++; } return 1000 * Math.sqrt(s / n) / 0.2; };
