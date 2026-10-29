# xray-wiki

Persönliches Nachschlagewerk mit interaktiven Seiten, nach Themengebieten geordnet. Jede Abbildung gibt es zusätzlich als einzelnes Widget zum Einbetten, z. B. in Obsidian.

## Struktur

Die Website wird mit [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) aus `docs/` gebaut.

```
mkdocs.yml            Navigation, Theme, Erweiterungen
docs/
  index.md            Startseite
  grundlagen/         Grundlagen (Markdown; E-Technik noch als HTML)
  physik/             Physik (noch als HTML-Seiten)
  widgets/            Interaktive Abbildungen, einzeln einbettbar (Pfade stabil)
  widgets.md          Übersicht aller Widgets
  stylesheets/, javascripts/   Farben, MathJax, automatische Widget-Höhe
```

Seiten sind Markdown mit Formeln in `$…$` bzw. `$$…$$`, Kästen als Obsidian-Callouts (`> [!abstract] Merke`) und Abbildungen als `<iframe class="xw-widget" src="../widgets/….html">`. Dieselben Dateien lassen sich in Obsidian öffnen.

Lokal ansehen: `pip install -r requirements.txt`, dann `mkdocs serve`.

## Veröffentlichen

Die GitHub Action in `.github/workflows/pages.yml` baut bei jedem Push auf `main` die Seite. Dafür unter *Settings → Pages → Build and deployment* die Quelle auf **GitHub Actions** stellen.

## In Obsidian einbetten

```html
<iframe src="https://<user>.github.io/xray-wiki/widgets/rk-06-fbp-labor.html" width="100%" height="720" style="border:0"></iframe>
```

Optionen: `?theme=dark` / `?theme=light` (Farbschema erzwingen), `?frame=0` (ohne Rahmen). Auf der Startseite gibt es für jedes Widget einen fertigen Schnipsel zum Kopieren.

Formeln und Schriften werden von cdnjs bzw. Google Fonts geladen; ohne Internet fehlen die Formeln in Bildunterschriften, die Animationen laufen trotzdem.

## Widgets

| Widget | Datei | Höhe (px, bei ~700 px Breite) |
|---|---|---|
| Die Messkette im CT | `widgets/gl-00-messkette.html` | 340 |
| Elektromagnetisches Spektrum | `widgets/gl-01-em-spektrum.html` | 600 |
| Röntgenröhre und Spektrum | `widgets/gl-02-roentgenroehre.html` | 620 |
| Photoeffekt und Compton-Streuung | `widgets/gl-03-photoeffekt-compton.html` | 440 |
| Schwächung in Materie | `widgets/gl-04-schwaechung.html` | 680 |
| Bändermodell | `widgets/gl-05-baendermodell.html` | 460 |
| Elektron-Loch-Paarerzeugung | `widgets/gl-06-paarerzeugung.html` | 600 |
| Drift und Signalentstehung | `widgets/gl-07-drift-signal.html` | 760 |
| Integrieren oder zählen | `widgets/gl-08-integrieren-zaehlen.html` | 600 |
| Projektion, Sinogramm, Rekonstruktion | `widgets/gl-09-ct-rekonstruktion.html` | 580 |
| Ablauf der gefilterten Rückprojektion | `widgets/rk-00-ablauf.html` | 360 |
| Fourier-Reihe einer Rechteckwelle | `widgets/rk-01-fourier-reihe.html` | 560 |
| Radon-Transformation und Sinogramm | `widgets/rk-02-radon-sinogramm.html` | 680 |
| Rückprojektion eines Punktes | `widgets/rk-03-rueckprojektion-punkt.html` | 640 |
| Fourier-Slice-Theorem | `widgets/rk-04-fourier-slice.html` | 560 |
| Polare Abtastung und Rampenfilter | `widgets/rk-05-polare-abtastung.html` | 500 |
| FBP-Labor | `widgets/rk-06-fbp-labor.html` | 720 |
| Parallel-, Fächer- und Kegelstrahl | `widgets/rk-07-geometrien.html` | 400 |
| Rekonstruktion als Gleichungssystem | `widgets/rk-08-gleichungssystem.html` | 360 |
| Kaczmarz-Verfahren in 2D | `widgets/rk-09-kaczmarz.html` | 720 |
| SART gegen FBP | `widgets/rk-10-sart.html` | 660 |
| Zählen statt integrieren | `widgets/pc-01-zaehlen-vs-integrieren.html` | 580 |
| Indirekte und direkte Konversion | `widgets/pc-02-direkte-konversion.html` | 520 |
| Gewichtungspotential und Small-Pixel-Effekt | `widgets/pc-03-gewichtungspotential.html` | 540 |
| Signalkette im ASIC | `widgets/pc-04-asic-signalkette.html` | 440 |
| Pulse, Schwellen und Pile-up | `widgets/pc-05-pulse-pileup.html` | 780 |
| Totzeitmodelle | `widgets/pc-06-totzeit.html` | 620 |
| Charge Sharing und K-Fluoreszenz | `widgets/pc-07-charge-sharing.html` | 700 |
| Spektrum und Energie-Bins und Schwächungskoeffizienten | `widgets/pc-08-spektrum-bins.html` | 1440 |

## Neu bauen

`manifest.json` listet alle Widgets mit Seite und Einbettungshöhe. Die Widgets wurden automatisch aus den Seiten in `physik/` erzeugt; wer eine Seite ändert, muss das betroffene Widget entsprechend anpassen. Für `grundlagen/e-technik.html` gibt es noch keine Einzel-Widgets.
