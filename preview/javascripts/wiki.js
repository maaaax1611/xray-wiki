// Widgets passen ihre Höhe selbst an und folgen dem Farbschema der Seite.
(() => {
  const scheme = () => document.body.getAttribute('data-md-color-scheme') === 'slate' ? 'dark' : 'light';
  function wire() {
    document.querySelectorAll('iframe.xw-widget').forEach(f => {
      const u = new URL(f.getAttribute('src'), location.href);
      u.searchParams.set('theme', scheme());
      if (f.src !== u.href) f.src = u.href;
    });
  }
  addEventListener('message', e => {
    if (!e.data || e.data.xwiki !== 'height') return;
    document.querySelectorAll('iframe.xw-widget').forEach(f => { if (f.contentWindow === e.source) f.style.height = e.data.h + 'px'; });
  });
  new MutationObserver(wire).observe(document.body, { attributes: true, attributeFilter: ['data-md-color-scheme'] });
  if (window.document$) document$.subscribe(wire); else addEventListener('DOMContentLoaded', wire);
})();
