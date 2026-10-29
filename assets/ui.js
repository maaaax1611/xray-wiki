'use strict';
/* Bedienung aller Wiki-Seiten: Hell/Dunkel-Schalter, aktiver Eintrag im Inhaltsverzeichnis, Höhe von Widgets an die einbettende Seite melden. */
(() => {
const root = document.documentElement;
/* ---------- Darstellung umschalten ---------- */
(() => {
  const btns = [...document.querySelectorAll('.theme button')];
  if (!btns.length) return;
  let saved = 'system'; try { saved = localStorage.getItem('theme') || 'system'; } catch (e) {}
  function apply(t) {
    if (t === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', t);
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === t)));
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  btns.forEach(b => b.addEventListener('click', () => apply(b.dataset.t)));
  if (!new URLSearchParams(location.search).get('theme')) apply(saved); else btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.t === root.getAttribute('data-theme'))));
})();

/* ---------- Inhaltsverzeichnis ---------- */
(() => {
  const links = [...document.querySelectorAll('nav.toc a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { links.forEach(a => a.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); } }), { rootMargin: '-30% 0px -60% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => so.observe(s));
})();

/* ---------- Höhe an einbettende Seite melden (nur in Widgets) ---------- */
if (window.parent !== window) (() => {
  const send = () => { try { parent.postMessage({ xwiki: 'height', h: Math.ceil(document.documentElement.getBoundingClientRect().height) }, '*'); } catch (e) {} };
  new ResizeObserver(send).observe(document.body); addEventListener('load', send);
})();
})();
