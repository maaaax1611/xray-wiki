# xray-wiki

Persönliches Nachschlagewerk mit interaktiven Seiten, nach Themengebieten geordnet. Jede Abbildung gibt es zusätzlich als einzelnes Widget zum Einbetten, z. B. in Obsidian.

## Struktur

```
index.html            Startseite: Themengebiete, Suche, Widget-Liste (aus manifest.json)
assets/               wiki.css, wiki.js für die Startseite
grundlagen/           Fachübergreifendes Basiswissen
  e-technik.html        E-Technik kompakt
physik/               Röntgenphysik, Detektoren, CT
  roentgen.html         Vom Photon zum Bild
  rekonstruktion.html   Vom Sinogramm zum Schnittbild
  photon-counting.html  Photonen zählen im CT
ml/                   Machine Learning (noch leer)
widgets/              Einzelne Abbildungen zum Einbetten (Pfade bleiben stabil)
manifest.json         Themengebiete, Seiten, Widgets
```

Geplant in `grundlagen/`: Lineare Algebra, Wahrscheinlichkeit und Statistik, Fourier und Signale.

### Neue Seite hinzufügen

1. HTML-Datei im passenden Ordner anlegen.
2. Eintrag in `manifest.json` unter `pages` ergänzen (`id`, `category`, `path`, `title`, `desc`, `tags`). Mit `"status": "geplant"` erscheint die Seite ausgegraut.
3. Neues Themengebiet: Eintrag unter `categories` und gleichnamigen Ordner anlegen.

Die alten Adressen `grundlagen.html`, `rekonstruktion.html` und `photon-counting.html` im Root leiten auf die neuen Pfade weiter.

Die Startseite lädt `manifest.json` per `fetch`. Lokal deshalb über einen Webserver öffnen, z. B. `python -m http.server`.

## Veröffentlichen mit GitHub Pages

1. Neues Repository anlegen (z. B. `xray-wiki`) und den Inhalt dieses Ordners hochladen.
2. *Settings → Pages → Build and deployment*: Source **Deploy from a branch**, Branch **main**, Ordner **/ (root)**.
3. Nach ca. einer Minute ist die Seite unter `https://<user>.github.io/xray-wiki/` erreichbar.

Die Datei `.nojekyll` sorgt dafür, dass GitHub die Dateien unverändert ausliefert.

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
