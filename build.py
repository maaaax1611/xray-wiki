#!/usr/bin/env python3
"""Baut die Wiki-Seiten aus Markdown.

    python build.py

Quellen:
  src/pages/<kategorie>/<seite>.md   Seiteninhalt (Markdown mit Formeln)
  src/figures/<slug>.html            Abbildung: Markup + <script>, eingebunden mit "::: widget <slug>"
  src/lib/                           page.css, core.js und gemeinsame Bibliotheken (z. B. la.js)
  src/template.html                  HTML-Gerüst

Ergebnis (wird mit eingecheckt, GitHub Pages liefert es direkt aus):
  <kategorie>/<seite>.html, widgets/<slug>.html, assets/page.css, assets/*.js, manifest.json (Widget-Liste)

Markdown-Erweiterungen:
  ## Titel {#id group="Gruppe" toc="Kurztitel"}   Abschnitt; group setzt die Zwischenüberschrift im Inhaltsverzeichnis
  ## Titel {#id appendix="A"}                      Anhang statt Nummer
  > [!abstract] Merke                              Kasten (Obsidian-Callout-Syntax)
  ::: widget la-04-determinante                    Abbildung an dieser Stelle
  $…$ und $$…$$                                    Formeln (MathJax)
"""
import html, json, re, shutil, sys
from pathlib import Path

import markdown
import yaml
from bs4 import BeautifulSoup, NavigableString

ROOT = Path(__file__).resolve().parent
SRC = ROOT / 'src'
TEMPLATE = (SRC / 'template.html').read_text()
THEME_BTNS = ('<div class="theme" role="group" aria-label="Darstellung"><button type="button" data-t="light">Hell</button>'
              '<button type="button" data-t="dark">Dunkel</button><button type="button" data-t="system">System</button></div>')


def esc(s):
    return html.escape(s, quote=True)


# ---------- Abbildungen ----------
def load_figure(slug):
    path = SRC / 'figures' / f'{slug}.html'
    if not path.exists():
        sys.exit(f'Abbildung nicht gefunden: {path.relative_to(ROOT)}')
    text = path.read_text()
    meta = {}
    m = re.match(r'<!--(.*?)-->\s*', text, re.S)
    if m:
        for line in m.group(1).strip().splitlines():
            k, _, v = line.strip().partition(':')
            meta[k.strip()] = v.strip()
        text = text[m.end():]
    m = re.search(r'<script>(.*)</script>\s*$', text, re.S)
    markup, code = (text[:m.start()].strip(), m.group(1).strip()) if m else (text.strip(), '')
    libs = [l.strip() for l in meta.get('lib', '').split(',') if l.strip()]
    return {'slug': slug, 'title': meta.get('title', slug), 'markup': markup, 'code': code, 'libs': libs,
            'interactive': bool(re.search(r'<input|<select|<button|tabindex', markup))}


def number_caption(markup, n):
    return re.sub(r'<b>Abb\.[^<]*</b>', f'<b>Abb. {n}</b>', markup, count=1)


def script_tags(root, libs, inline_codes):
    tags = [f'<script src="{root}assets/core.js"></script>']
    tags += [f'<script src="{root}assets/{lib}.js"></script>' for lib in libs]
    tags += [f'<script>\n{c}\n</script>' for c in inline_codes if c]
    return '\n'.join(tags)


# ---------- Markdown ----------
CALLOUT = re.compile(r'^> \[!(\w+)\][ \t]*(.*)\n((?:>.*\n?)*)', re.M)
WIDGET = re.compile(r'^::: *widget +([\w-]+) *$', re.M)


def preprocess(md):
    def callout(m):
        title = m.group(2).strip() or m.group(1).capitalize()
        inner = re.sub(r'^> ?', '', m.group(3), flags=re.M)
        return f'<div class="merke" markdown="1">\n<div class="eyebrow">{esc(title)}</div>\n\n{inner}\n</div>\n'
    md = CALLOUT.sub(callout, md)
    md = WIDGET.sub(lambda m: f'\n<div class="xw-widget-slot" data-slug="{m.group(1)}"></div>\n', md)
    return md


def render(md):
    return markdown.markdown(md, extensions=['tables', 'attr_list', 'md_in_html', 'pymdownx.arithmatex'],
                             extension_configs={'pymdownx.arithmatex': {'generic': True}})


def build_page(path, manifest):
    raw = path.read_text()
    fm, md = {}, raw
    m = re.match(r'^---\n(.*?)\n---\n', raw, re.S)
    if m:
        fm, md = yaml.safe_load(m.group(1)) or {}, raw[m.end():]
    rel = path.relative_to(SRC / 'pages').with_suffix('.html')
    depth = len(rel.parts) - 1
    root = '../' * depth
    soup = BeautifulSoup(render(preprocess(md)), 'html.parser')

    # Formeln, Tabellen, Listen in die Klassen des Seitenlayouts
    for d in soup.select('div.arithmatex'):
        d['class'] = ['eq']
    for t in soup.find_all('table'):
        t.wrap(soup.new_tag('div', attrs={'class': 'tbl'}))
    for ul in soup.find_all('ul'):
        ul['class'] = ul.get('class', []) + ['tight']

    # Abbildungen einsetzen und nummerieren
    figs, n = [], 0
    for slot in soup.select('div.xw-widget-slot'):
        n += 1
        f = load_figure(slot['data-slug'])
        f['n'] = n
        figs.append(f)
        slot.replace_with(BeautifulSoup(number_caption(f['markup'], n), 'html.parser'))

    # In Abschnitte gliedern
    intro, sections, cur = [], [], None
    for node in list(soup.children):
        if getattr(node, 'name', None) == 'h2':
            cur = {'h2': node, 'nodes': []}
            sections.append(cur)
        elif cur is None:
            intro.append(node)
        else:
            cur['nodes'].append(node)

    toc, toc_m, body_secs, num, group = [], [], [], 0, None
    for s in sections:
        h = s['h2']
        sid = h.get('id') or re.sub(r'\W+', '-', h.get_text().lower()).strip('-')
        app = h.get('appendix')
        g = h.get('group')
        short = h.get('toc') or h.get_text().strip()
        for a in ('id', 'group', 'toc', 'appendix'):
            if a in h.attrs:
                del h[a]
        if app:
            if group != 'Anhang':
                toc.append('<li class="lv">Anhang</li>')
                group = 'Anhang'
            badge = f'<div class="eyebrow">Anhang {esc(app)}</div>'
            mark = app
        else:
            num += 1
            if g and g != group:
                toc.append(f'<li class="lv">{esc(g)}</li>')
                group = g
            badge = f'<div class="step"><b>{num}</b><span class="eyebrow">{esc(group or "")}</span></div>'
            mark = str(num)
        toc.append(f'<li><a href="#{sid}"><span class="n">{mark}</span><span>{esc(short)}</span></a></li>')
        toc_m.append(f'<li><a href="#{sid}">{esc(short)}</a></li>')
        inner = ''.join(str(x) for x in s['nodes'])
        body_secs.append(f'<section id="{sid}">\n{badge}\n{h}\n{inner}\n</section>')

    intro_html = ''.join(str(x) for x in intro).strip()
    intro_html = re.sub(r'^<p>', '<p class="lede">', intro_html, count=1)
    cat = fm.get('category', rel.parts[0] if depth else '')
    cat_title = {c['id']: c['title'] for c in manifest.get('categories', [])}.get(cat, cat)
    back = f'<p class="backlink"><a href="{root}index.html">← Wiki</a>' + (f' · <a href="{root}index.html#{cat}">{esc(cat_title)}</a>' if cat else '') + '</p>'
    body = f'''<div class="wrap">
  <nav class="toc" aria-label="Inhalt">
    <div class="eyebrow">Inhalt</div>
    <ol>
      {chr(10).join('      ' + t for t in toc).strip()}
    </ol>
  </nav>
  <main>
    <header id="ueberblick">
      {back}
      <div class="topbar"><div class="eyebrow">{esc(fm.get('eyebrow', cat_title))}</div>
        {THEME_BTNS}</div>
      <h1>{esc(fm['title'])}</h1>
      {intro_html}
      <details class="toc-mobile"><summary>Inhalt</summary><ol>{''.join(toc_m)}</ol></details>
    </header>
{chr(10).join(body_secs)}
    {f'<footer>{esc(fm["footer"])}</footer>' if fm.get('footer') else ''}
  </main>
</div>'''
    libs = list(dict.fromkeys(l for f in figs for l in f['libs']))
    scripts = script_tags(root, libs, [f['code'] for f in figs])
    out = TEMPLATE.replace('{{title}}', esc(fm['title'])).replace('{{root}}', root).replace('{{source}}', str(path.relative_to(ROOT)))
    out = out.replace('{{body}}', body).replace('{{scripts}}', scripts)
    dest = ROOT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(out)
    return {'id': fm.get('id', path.stem), 'path': str(rel), 'figs': figs}


def build_widget(f, page_title):
    markup = f'<main class="widget">\n{number_caption(f["markup"], f["n"])}\n</main>'
    out = TEMPLATE.replace('{{title}}', esc(f['title'])).replace('{{root}}', '../').replace('{{source}}', f'src/figures/{f["slug"]}.html')
    out = out.replace('{{body}}', markup).replace('{{scripts}}', script_tags('../', f['libs'], [f['code']]))
    (ROOT / 'widgets' / f'{f["slug"]}.html').write_text(out)


def main():
    manifest = json.loads((ROOT / 'manifest.json').read_text())
    (ROOT / 'assets').mkdir(exist_ok=True)
    for name in ['page.css'] + [p.name for p in (SRC / 'lib').glob('*.js')]:
        shutil.copyfile(SRC / 'lib' / name, ROOT / 'assets' / name)
    heights = {w['slug']: w.get('height', 0) for w in manifest.get('widgets', [])}
    pages = sorted((SRC / 'pages').rglob('*.md'))
    for p in pages:
        info = build_page(p, manifest)
        for f in info['figs']:
            build_widget(f, info['id'])
        manifest['widgets'] = [w for w in manifest['widgets'] if w['page'] != info['id']] + [
            {'slug': f['slug'], 'page': info['id'], 'title': f['title'], 'interactive': f['interactive'], 'height': heights.get(f['slug']) or 640}
            for f in info['figs']]
        print(f'{info["path"]}: {len(info["figs"])} Abbildungen')
    (ROOT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n')


if __name__ == '__main__':
    main()
