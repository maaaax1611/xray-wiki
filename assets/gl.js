'use strict';
/* Hilfsfunktionen und Daten der Seite physik/roentgen. */
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
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
function frame(ctx, x0px, y0px, w, h, o) {
  const L = o.l ?? 48, R = o.r ?? 12, T = o.t ?? 12, B = o.b ?? 36;
  const bx = x0px + L, by = y0px + T, bw = Math.max(10, w - L - R), bh = Math.max(10, h - T - B);
  const X = v => bx + (v - o.x0) / (o.x1 - o.x0) * bw;
  const Y = v => by + bh - (v - o.y0) / (o.y1 - o.y0) * bh;
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
const BINC = ['--bin0', '--bin1', '--bin2', '--bin3'];

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

/* Schwächungsdaten (cm²/g), genähert nach NIST XCOM */
const WATER = [[10,5.33],[15,1.67],[20,0.81],[30,0.376],[40,0.268],[50,0.227],[60,0.206],[80,0.184],[100,0.171],[150,0.150]];
const BONE  = [[10,28.5],[15,9.0],[20,4.0],[30,1.33],[40,0.665],[50,0.424],[60,0.315],[80,0.223],[100,0.186],[150,0.148]];
const AL    = [[10,26.2],[15,7.96],[20,3.44],[30,1.13],[40,0.568],[50,0.368],[60,0.278],[80,0.202],[100,0.170],[150,0.138]];
function mu(t, E) {
  if (E <= t[0][0]) return t[0][1];
  for (let i = 0; i < t.length - 1; i++) if (E <= t[i + 1][0]) { const [e0, m0] = t[i], [e1, m1] = t[i + 1]; const f = Math.log(E / e0) / Math.log(e1 / e0); return Math.exp(Math.log(m0) + f * Math.log(m1 / m0)); }
  return t[t.length - 1][1];
}
function kleinNishina(EkeV) { // cm² pro Elektron
  const k = EkeV / 511, re2 = 7.9407e-26, l = Math.log(1 + 2 * k);
  return 2 * Math.PI * re2 * ((1 + k) / (k * k) * (2 * (1 + k) / (1 + 2 * k) - l / k) + l / (2 * k) - (1 + 3 * k) / ((1 + 2 * k) ** 2));
}
const EG = []; for (let e = 10; e <= 150.001; e += 0.5) EG.push(Math.round(e * 10) / 10);
function tube(kvp, alMm) {
  const g = (E, c) => Math.exp(-0.5 * ((E - c) / 0.45) ** 2);
  return EG.map(E => {
    if (E >= kvp) return 0;
    let n = (kvp - E) / E;
    if (kvp > 69.5) { const a = 1.3 * (kvp - 69.5) / 50; n += a * (g(E, 59.3) + 0.55 * g(E, 58.0) + 0.32 * g(E, 67.2)); }
    return n * Math.exp(-mu(AL, E) * 2.7 * (1 + alMm) / 10);
  });
}
function sampler(spec) {
  const cdf = []; let s = 0; for (const v of spec) { s += v; cdf.push(s); }
  return () => { const u = Math.random() * s; let lo = 0, hi = cdf.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < u) lo = m + 1; else hi = m; } return EG[lo] + (Math.random() - 0.5) * 0.5; };
}
const ebin = E => E < 40 ? 0 : E < 60 ? 1 : E < 80 ? 2 : 3;
