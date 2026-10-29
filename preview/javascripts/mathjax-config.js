window.MathJax = {
  tex: { inlineMath: [['\\(', '\\)']], displayMath: [['\\[', '\\]']], processEscapes: true, processEnvironments: true },
  options: { ignoreHtmlClass: '.*|', processHtmlClass: 'arithmatex' },
  svg: { fontCache: 'global' }
};
if (window.document$) document$.subscribe(() => { if (window.MathJax && MathJax.typesetPromise) { MathJax.typesetClear(); MathJax.texReset(); MathJax.typesetPromise(); } });
