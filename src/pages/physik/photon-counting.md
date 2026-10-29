---
title: Photonen zählen
eyebrow: Detektorphysik · Computertomographie
footer: Alle Simulationen auf dieser Seite sind didaktische Modelle mit typischen Parametern aus der Literatur. Sie zeigen Zusammenhänge und Größenordnungen, keine Herstellerdaten.
---

Wie ein Photon-Counting-Detektor im CT funktioniert: von der Grundidee über Halbleiterphysik und Ausleseelektronik bis zur Materialzerlegung. Jeder Abschnitt geht eine Ebene tiefer.

::: widget pc-01-zaehlen-vs-integrieren

## Zählen statt integrieren {#konzept group="Ebene 1 · Konzept" n="01" level="1"}

Ein CT misst in jeder Projektion, wie stark der Patient die Röntgenstrahlung entlang jedes Strahls schwächt. Konventionelle Detektoren tun das, indem sie während eines kurzen Zeitfensters (eines *Frames* oder einer *Projektion*, typisch einige hundert Mikrosekunden) die gesamte deponierte Energie aufsummieren. Das Ergebnis ist ein Strom bzw. eine Ladung, die proportional zur Summe der Photonenenergien ist.

Ein Photon-Counting-Detektor (PCD) macht etwas grundsätzlich anderes: Er erkennt **jedes einzelne Röntgenquant als eigenes elektrisches Ereignis**, misst dessen Pulshöhe und vergleicht sie mit mehreren Energieschwellen. Am Ende eines Frames stehen pro Pixel nicht eine, sondern mehrere Zahlen: wie viele Photonen über 20 keV, über 35 keV, über 50 keV und so weiter gekommen sind.

### Drei Konsequenzen dieser Idee

**1. Elektronikrauschen verschwindet aus dem Signal.** Beim integrierenden Detektor addiert sich das Rauschen der Ausleseelektronik zu jedem Messwert. Bei wenigen Photonen, etwa hinter dicken Körperteilen oder bei sehr niedriger Dosis, dominiert es. Beim PCD liegt die unterste Schwelle (z. B. 20 keV) weit über dem Rauschpegel (rund 1 keV). Rauschen erzeugt dann praktisch keine Zählereignisse. Was bleibt, ist reines Poisson-Rauschen der Photonen.

**2. Jedes Photon bekommt dasselbe Gewicht.** Ein integrierender Detektor gewichtet jedes Photon mit seiner Energie $E$. Hochenergetische Photonen tragen aber den *geringsten* Kontrast, weil die Schwächungsunterschiede zwischen Geweben mit steigender Energie kleiner werden. Der PCD zählt jedes Photon gleich (Gewicht 1) oder sogar mit einem optimierten, energieabhängigen Gewicht. Das verbessert das Kontrast-Rausch-Verhältnis, vor allem für Iod.

**3. Spektrale Information in jedem Scan.** Mit mehreren Energie-Bins pro Pixel bekommt man aus jeder Aufnahme eine grobe Spektralmessung. Daraus lassen sich Materialien trennen, virtuelle monoenergetische Bilder rechnen oder Kontrastmittel mit K-Kante gezielt darstellen.

|  | Energieintegrierend (EID) | Photonenzählend (PCD) |
|---|---|---|
| Konversion | indirekt: Szintillator → Licht → Photodiode | direkt: Halbleiter → Ladung |
| Messgröße pro Pixel | $\sum_i E_i$ + Rauschen | $N(E \ge T_k)$ für mehrere Schwellen $T_k$ |
| Gewichtung | $w(E) \propto E$ | $w(E) = 1$ oder frei wählbar |
| Elektronikrauschen | im Signal enthalten | durch Schwelle unterdrückt |
| Pixelgröße | durch Septen begrenzt (~1 mm am Detektor) | klein ohne Effizienzverlust (~0,15–0,3 mm) |
| Spektral | nur mit Dual-Source, kV-Switching, Dual-Layer | intrinsisch, 2–8 Bins |
| Hauptprobleme | Rauschen bei Niedrigdosis, Swank-Rauschen | Pile-up, Charge Sharing, Fluoreszenz, Polarisation |

Der Rest dieser Seite folgt dem Weg eines Photons: Absorption im Sensor, Ladungstransport, Signalentstehung, Pulsverarbeitung, Zählung. Danach geht es um die Effekte, die diesen idealen Weg stören, und schließlich darum, was man mit den Energie-Bins in der Bildgebung anfängt.

## Direkte Konversion im Halbleiter {#konversion group="Ebene 2 · Sensor" n="02" level="2" toc="Direkte Konversion"}

Damit ein einzelnes Photon als eigener Puls erkennbar ist, muss die Umwandlung in ein elektrisches Signal schnell und ohne Zwischenschritt geschehen. Ein Szintillator ist dafür ungeeignet: Er erzeugt einen Lichtblitz mit einer Abklingzeit von Mikrosekunden (bei GOS sogar mit langem Nachleuchten), und das Licht verteilt sich über mehrere Pixel. Ein PCD verwendet deshalb einen **direkt konvertierenden Halbleiter**.

::: widget pc-02-direkte-konversion

### Absorption

Der Sensor muss die Röntgenquanten in wenigen Millimetern stoppen. Entscheidend sind hohe Ordnungszahl und Dichte, denn der Photoeffekt skaliert ungefähr mit $Z^4/E^3$. **CdTe** (Z = 48 und 52, ρ = 5,85 g/cm³) und die Legierung **CdZnTe (CZT)** erfüllen das. Bei 1,5–2 mm Dicke wird der diagnostisch wichtige Teil des CT-Spektrums nahezu vollständig absorbiert, erst am oberen Ende (über ~100 keV) sinkt die Quanteneffizienz merklich. Silizium (Z = 14) absorbiert viel schwächer und braucht eine andere Geometrie (siehe [Abschnitt 11](#systeme)).

### Erzeugung von Ladungsträgern

Das absorbierte Photon überträgt seine Energie auf ein Photoelektron, das auf seinem Weg durch den Kristall viele Elektron-Loch-Paare erzeugt. Im Mittel kostet ein Paar die Energie $W$, etwa das Dreifache der Bandlücke, weil ein Teil der Energie an Gitterschwingungen geht:

$$
N = \frac{E}{W}, \qquad W_{\mathrm{CdTe}} \approx 4{,}43\ \mathrm{eV}
$$

Ein 60-keV-Photon erzeugt also rund 13 500 Paare, das sind etwa 2,2 fC. Die Zahl der Paare schwankt weniger als nach Poisson zu erwarten, weil die Erzeugungsprozesse nicht unabhängig sind. Das beschreibt der Fano-Faktor $F$:

$$
\sigma_N = \sqrt{F\,N}, \qquad F \approx 0{,}1 \quad\Rightarrow\quad \Delta E_{\mathrm{FWHM}} = 2{,}355\,\sqrt{F\,W\,E} \approx 0{,}4\ \mathrm{keV}\ \text{bei 60 keV}
$$

Diese Fano-Grenze ist eine theoretische Untergrenze. Reale CT-Detektoren erreichen einige keV, weil Elektronikrauschen, unvollständige Ladungssammlung und Charge Sharing dominieren. Das sind die Themen der nächsten Abschnitte.

## Ladungstransport und Signalentstehung {#signal n="03" level="2" toc="Ladungstransport & Signal"}

Eine Hochspannung von einigen hundert Volt pro Millimeter zieht die Elektronen zu den Pixelanoden und die Löcher zur gemeinsamen Kathode. Die Driftgeschwindigkeit ist $v = \mu E$. Elektronen und Löcher unterscheiden sich in CdTe stark:

| Größe | Elektronen | Löcher |
|---|---:|---:|
| Beweglichkeit μ | ~1100 cm²/Vs | ~100 cm²/Vs |
| Mobilitäts-Lebensdauer-Produkt μτ | ~10⁻³ cm²/V | ~10⁻⁴ cm²/V |
| Driftzeit über 1,6 mm bei 1000 V | ~23 ns | ~250 ns |

Ladungsträger können unterwegs an Störstellen eingefangen werden (*Trapping*). Die mittlere Driftlänge bis zum Einfang ist $\lambda = \mu\tau E$. Bei einem planaren Detektor mit zwei großflächigen Elektroden hängt die gesammelte Ladung deshalb von der Interaktionstiefe $x$ ab, gemessen von der Kathode. Das beschreibt die **Hecht-Gleichung**:

$$
\mathrm{CCE}(x) = \frac{\lambda_e}{d}\left(1 - e^{-(d-x)/\lambda_e}\right) + \frac{\lambda_h}{d}\left(1 - e^{-x/\lambda_h}\right)
$$

### Wo das Signal wirklich entsteht: das Shockley-Ramo-Theorem

Ein häufiges Missverständnis: Das Signal entsteht nicht erst, wenn die Elektronen an der Anode „ankommen“. Schon während der Drift *influenziert* jede bewegte Ladung einen Strom auf allen Elektroden. Wie groß dieser Strom auf einer bestimmten Elektrode ist, bestimmt das **Gewichtungspotential** $\varphi_w$. Man erhält es, indem man die Laplace-Gleichung löst, mit der betrachteten Elektrode auf Potential 1 und allen anderen auf 0. Raumladung und tatsächliche Bias-Spannung spielen dafür keine Rolle.

$$
Q_{\mathrm{ind}} = -q\,\Delta\varphi_w, \qquad i(t) = q\,\vec v \cdot \vec E_w
$$

Bei einem planaren Detektor fällt $\varphi_w$ linear von 1 an der Anode auf 0 an der Kathode ab. Elektronen und Löcher tragen dann je nach Tiefe zum Signal bei. Ist das Pixel aber klein gegenüber der Sensordicke, bleibt $\varphi_w$ im größten Teil des Volumens nahe null und steigt erst kurz vor der Anode steil an. Das ist der **Small-Pixel-Effekt**: Fast das gesamte Signal stammt von den Elektronen auf ihren letzten Mikrometern, die Löcher tragen kaum bei. Ihr schlechter Transport fällt damit kaum noch ins Gewicht.

::: widget pc-03-gewichtungspotential

Schiebe die Pixelbreite nach oben, bis sie größer als die Dicke ist: Das Gewichtungspotential wird linear, die Kurve der induzierten Ladung bekommt einen langsamen Anteil durch die Löcher, und mit kleinem μτ der Löcher bleibt die gesammelte Ladung unter 100 %. Das erzeugt im Spektrum den niederenergetischen Ausläufer (Tail). Bei kleinen Pixeln ist die induzierte Ladung fast unabhängig von der Tiefe.

> [!note]
> Der Preis kleiner Pixel: Die Ladungswolke ist im Verhältnis zur Pixelgröße nicht mehr vernachlässigbar, und mehr Ereignisse verteilen sich auf Nachbarpixel. Darum geht es in [Abschnitt 6](#sharing).

## Vom Ladungspuls zum Zählerstand {#asic group="Ebene 3 · Elektronik" n="04" level="3" toc="Vom Puls zum Zählerstand"}

Unter jedem Pixel sitzt ein eigener Signalverarbeitungskanal im ASIC, der per Flip-Chip-Bonding direkt mit dem Sensor verbunden ist. Die Kette ist in allen photonenzählenden Systemen im Prinzip gleich.

::: widget pc-04-asic-signalkette

### Rauschen und Formungszeit

<p class="muted" style="font-size:15px">Grundlagen zu thermischem Rauschen, Schrotrauschen und Filtern stehen auf der Seite <a href="../grundlagen/e-technik.html#rauschen">„E-Technik kompakt“</a>.</p>

Das Rauschen der Kette wird als äquivalente Rauschladung (ENC) angegeben, also die Ladung am Eingang, die ein gleich großes Ausgangssignal erzeugen würde. Drei Beiträge konkurrieren:

$$
\mathrm{ENC}^2 \approx \underbrace{a\,\frac{C_{\mathrm{in}}^2}{\tau_p}}_{\text{seriell, weiß}} \;+\; \underbrace{b\,I_{\mathrm{leak}}\,\tau_p}_{\text{parallel}} \;+\; \underbrace{c\,C_{\mathrm{in}}^2}_{1/f}
$$

Eine kurze Peaking-Zeit $\tau_p$ ist nötig, damit sich Pulse bei hohen Raten nicht überlappen, erhöht aber das serielle Rauschen. Kleine Pixel helfen doppelt: kleinere Eingangskapazität $C_{\mathrm{in}}$ und weniger Leckstrom pro Kanal. Typische Werte liegen bei 100–200 e⁻ rms, also etwa 0,5–1 keV. Gegenüber Schwellen ab 20 keV ist das vernachlässigbar.

### Schwellen und Kalibrierung pro Pixel

Die Schwellen werden global über DACs eingestellt. Weil Verstärkung und Offset von Pixel zu Pixel streuen, hat jeder Kanal zusätzlich Trim-DACs, mit denen die effektive Schwelle in keV über alle Pixel angeglichen wird. Die Zähler (typisch 12–24 Bit) werden pro Projektion ausgelesen. Oft gibt es zwei Zählerbänke, sodass eine gelesen wird, während die andere zählt, ohne Totzeit zwischen den Frames.

::: widget pc-05-pulse-pileup

## Zählrate, Totzeit und Pile-up {#pileup group="Ebene 4 · Grenzen" n="05" level="4" toc="Totzeit & Pile-up"}

Die Herausforderung für Photon Counting im CT ist der Fluss. Hinter Luft oder am Rand des Patienten treffen bis zu 10⁸–10⁹ Photonen pro mm² und Sekunde auf den Detektor. Bei einer Pixelfläche von ~0,05 mm² sind das bis zu einige 10⁷ Ereignisse pro Sekunde und Kanal. Die Pulse dauern aber einige 10 ns. Das Verhältnis $n\tau$ ist damit nicht mehr klein.

### Zwei Totzeitmodelle

Nach jedem gezählten Ereignis ist der Kanal für eine Totzeit $\tau$ blind. Zwei idealisierte Modelle beschreiben die gemessene Rate $m$ als Funktion der wahren Rate $n$:

$$
\text{nicht-paralysierbar:}\quad m = \frac{n}{1 + n\tau} \qquad\qquad \text{paralysierbar:}\quad m = n\,e^{-n\tau}
$$

Im nicht-paralysierbaren Fall nähert sich $m$ asymptotisch $1/\tau$. Im paralysierbaren Fall verlängert jedes Photon, auch ein nicht gezähltes, die Totzeit. Die gemessene Rate erreicht bei $n = 1/\tau$ ihr Maximum $1/(e\tau)$ und *fällt danach wieder*. Das ist kritisch: Eine gemessene Rate gehört dann zu zwei wahren Raten, und hinter Luft kann ein Pixel weniger zählen als hinter Gewebe. Ein Komparator am Ausgang eines Pulsformers verhält sich weitgehend paralysierbar, reale Systeme liegen zwischen beiden Modellen.

::: widget pc-06-totzeit

### Spektrale Folgen

Pile-up kostet nicht nur Zählungen, es verfälscht auch Energien:

- **Peak-Pile-up:** Zwei Photonen kommen fast gleichzeitig. Ihre Pulse addieren sich zu einem Puls der Höhe ≈ $E_1 + E_2$. Statt zwei niederenergetischer Zählungen gibt es eine hochenergetische.
- **Tail-Pile-up:** Ein Puls sitzt auf dem Ausläufer des vorigen. Seine Höhe ist zu groß (oder bei bipolarer Formung zu klein).

Das Spektrum verschiebt sich zu höheren Energien, während die Gesamtzahl sinkt. Für die Materialzerlegung ist das gefährlich, weil sie gerade auf dem Verhältnis zwischen den Bins beruht. Abb. 5 zeigt beide Effekte direkt: Bei hoher Rate steigen die gezählten Ereignisse in den oberen Bins über die wahren Werte, während die unterste Schwelle Zählungen verliert.

### Gegenmaßnahmen

- **Kleine Pixel:** Der Fluss pro Kanal sinkt mit der Fläche. Das ist der wichtigste Hebel und ein Grund für Pixel von ~0,2 mm.
- **Kurze Pulsformung** und schnelle Rücksetzung des CSA, im Tausch gegen etwas mehr Rauschen.
- **Pile-up-Trigger oder Retrigger-Logik:** Ein zusätzlicher Komparator erkennt, ob ein Puls über der Schwelle bleibt, und zählt Mehrfachereignisse.
- **Formfilter (Bowtie)** vor dem Patienten senken den Fluss an den Rändern, wo wenig Gewebe durchstrahlt wird.
- **Modellbasierte Korrektur:** Pixelweise kalibrierte Funktionen $m_k(n)$ pro Schwelle, meist über Messungen mit variablem Röhrenstrom gewonnen.

## Charge Sharing und K-Fluoreszenz {#sharing n="06" level="4" toc="Charge Sharing & Fluoreszenz"}

Bisher wurde angenommen, dass ein Photon genau ein Ereignis in genau einem Pixel erzeugt. Zwei Effekte brechen diese Annahme, und beide werden mit kleineren Pixeln stärker.

### Charge Sharing

Die Elektronenwolke ist zu Beginn nur wenige Mikrometer groß, weitet sich aber während der Drift durch Diffusion und gegenseitige Abstoßung auf:

$$
\sigma_{\mathrm{diff}} = \sqrt{2 D t}, \qquad D = \frac{\mu k_B T}{q} \approx 28\ \mathrm{cm^2/s}\ (\text{Elektronen, CdTe})
$$

Nach ~20 ns Drift ergibt das σ ≈ 10 µm, mit Coulomb-Abstoßung bei hohen Energien eher 15–25 µm. Trifft ein Photon nahe einer Pixelgrenze, verteilt sich seine Ladung auf zwei oder vier Pixel. Jedes sieht dann ein Ereignis mit zu niedriger Energie. Liegt der Anteil über der Schwelle, wird das Photon *doppelt* gezählt, liegt er darunter, geht es verloren oder wird zu niedrig eingeordnet.

### K-Fluoreszenz

Liegt die Photonenenergie über einer K-Kante (Cd: 26,7 keV, Te: 31,8 keV), wird meist ein K-Schalen-Elektron herausgeschlagen. Die Lücke füllt sich unter Aussendung eines Fluoreszenzphotons (Cd Kα ≈ 23,1 keV, Te Kα ≈ 27,5 keV). Die Fluoreszenzausbeute liegt bei ~85 %. Dieses Photon fliegt in CdTe typisch 50–120 µm weit, das ist vergleichbar mit der Pixelgröße. Folgen:

- Im Primärpixel bleibt $E - E_{K\alpha}$ übrig: ein **Escape-Peak**.
- Im Nachbarpixel entsteht ein zusätzliches Ereignis bei ~23–27 keV: eine **Fluoreszenzzählung**.
- Ein Photon kann so zwei Zählungen in verschiedenen Pixeln auslösen, die **korreliert** sind. Das hat Folgen für Rauschspektrum und DQE (siehe [Abschnitt 10](#bildqualitaet)).

::: widget pc-07-charge-sharing

### Gegenmaßnahmen im ASIC

Abb. 7 zeigt die Grundidee der Korrektur: Wer weiß, dass benachbarte Pixel *gleichzeitig* ein Signal sehen, kann diese Teilsignale wieder zusammenführen.

- **Charge Summing:** Die analogen Signale benachbarter Pixel (z. B. jedes 2×2-Knotens) werden summiert, ein Arbitrierungsmechanismus ordnet das rekonstruierte Ereignis dem Pixel mit dem größten Anteil zu. Bekannt geworden ist das Prinzip mit dem Medipix3-ASIC.
- **Anti-Coincidence:** Ereignisse, die innerhalb eines kurzen Zeitfensters in Nachbarpixeln auftreten, werden als ein Ereignis gewertet bzw. die kleinere Zählung verworfen.

Beide Verfahren brauchen Kommunikation zwischen Pixeln und verlängern die effektive Totzeit, denn jedes Ereignis belegt jetzt mehrere Kanäle. Es entsteht ein dritter Zielkonflikt, zusätzlich zu Rauschen gegen Rate und Auflösung gegen Charge Sharing: spektrale Treue gegen Zählratenfähigkeit.

## Polarisation, Drift und Kalibrierung {#kalibrierung n="07" level="4" toc="Polarisation & Kalibrierung"}

### Polarisation

Bei hohem Fluss werden Löcher, die langsamer und kürzer leben als Elektronen, in tiefen Störstellen eingefangen und bilden eine positive Raumladung. Sie verformt das elektrische Feld: Nahe der Kathode kann es so weit zusammenbrechen, dass Ladung dort kaum noch gesammelt wird. Sichtbar wird das als Einbruch der Zählrate, Verschiebung der Energieskala und zeitabhängiges Verhalten über Sekunden bis Minuten. Es gibt auch die Variante, dass sich unter Bias-Spannung allein über längere Zeit ein Raumladungsfeld aufbaut (Schottky-Kontakte), was periodisches Abschalten der Spannung erfordert.

Gegenmittel sind gute Kristallqualität mit wenig tiefen Störstellen, eine passende Kontakttechnologie (ohmsch gegen Schottky, mit Kompromiss zwischen Leckstrom und Polarisationsneigung), Temperaturkontrolle und in manchen Ansätzen eine Bestrahlung mit Infrarotlicht, die die Fallen in einen stabilen Zustand bringt.

### Was kalibriert werden muss

| Größe | Warum | Wie, typischerweise |
|---|---|---|
| Schwellen-Equalisierung | Offset und Gain streuen pro Pixel | Rauschflanke oder Testpulse, Trim-DACs pixelweise setzen |
| Energieskala (keV ↔ DAC) | Schwellen sollen in keV gleich sein | bekannte Linien: Fluoreszenzfolien, Radionuklide (z. B. Am-241, 59,5 keV), K-Kanten-Filter |
| Ratenabhängigkeit | Totzeit, Pile-up, Polarisation | Messungen bei variablem Röhrenstrom und Filterung, pixelweise Korrekturkurven pro Schwelle |
| Spektrale Antwort | Basis für Materialzerlegung | Modell der Detector Response Function plus Kalibrierphantome bekannter Zusammensetzung |
| Temperatur | Leckstrom, Gain und Schwellen driften | aktive Kühlung, Temperaturmodell der Korrekturen |

Ein CT ist bei pixelweisen Inhomogenitäten unerbittlich: Was im Projektionsbild ein Unterschied von wenigen Promille ist, wird nach der Rekonstruktion zu einem Ring. Ein PCD hat viele Pixel, mehrere Schwellen pro Pixel und ratenabhängiges Verhalten. Entsprechend aufwendig sind Kalibrierung und Stabilität.

## Spektren und Energie-Bins {#bins group="Ebene 5 · Bildgebung" n="08" level="5" toc="Spektren & Energie-Bins"}

Hinter dem Patienten trifft ein Spektrum auf jedes Pixel, das durch die Röhre (Bremsstrahlung plus Wolfram-Linien), die Vorfilterung und die durchstrahlten Gewebe geformt wurde. Weiche Photonen werden stärker geschwächt, das Spektrum *härtet auf*. Die Schwellen schneiden dieses Spektrum in Bins. Was in welchem Bin landet, hängt davon ab, was der Strahl durchquert hat. Genau diese Information nutzt die Materialzerlegung.

::: widget pc-08-spektrum-bins part=1

Zwei Beobachtungen lohnen sich. Erstens: Mit mehr Wasser verschieben sich die Anteile zu den oberen Bins (Aufhärtung). Zweitens: Iod schwächt oberhalb seiner K-Kante bei 33,2 keV sprunghaft stärker. Ein Bin, der direkt über der Kante beginnt, reagiert deshalb empfindlich auf Iod, ein Bin knapp darunter kaum. Diese Asymmetrie ist mit zwei breiten Spektren (Dual-Energy) nur schwer zu nutzen, mit schmalen Bins dagegen direkt.

## Materialzerlegung {#zerlegung n="09" level="5"}

Die Schwächung eines Materials setzt sich im CT-Energiebereich aus zwei physikalischen Prozessen zusammen: Photoeffekt (stark abhängig von Z, fällt etwa mit $E^{-3}$) und Compton-Streuung (abhängig von der Elektronendichte, nahezu flach, Klein-Nishina). Ohne K-Kanten gilt daher für jedes Material in guter Näherung:

$$
\mu(E) = a_1\,f_{\mathrm{PE}}(E) + a_2\,f_{\mathrm{KN}}(E)
$$

Zwei Basisfunktionen reichen also, oder äquivalent zwei Basismaterialien wie Wasser und Iod oder Wasser und Kalzium. Jedes weitere Material ist im Rahmen der Messgenauigkeit eine Linearkombination davon. Ein **drittes** Material lässt sich nur unabhängig bestimmen, wenn es eine K-Kante im genutzten Spektrum hat, die seine Energieabhängigkeit von der der beiden anderen unterscheidet.

::: widget pc-08-spektrum-bins part=2

### Vorwärtsmodell

Für die Zerlegung im Projektionsraum beschreibt man den Erwartungswert der Zählungen im Bin $b$ als Funktion der Linienintegrale $A_k = \int \rho_k\,\mathrm{d}l$ der Basismaterialien:

$$
\bar\lambda_b(\mathbf A) = \int N_0(E)\,S_b(E)\,\exp\!\Big(-\sum_k A_k\,f_k(E)\Big)\,\mathrm{d}E
$$

$N_0(E)$ ist das Röhrenspektrum, $S_b(E)$ die spektrale Empfindlichkeit von Bin $b$, also die Detector Response Function (mit Charge Sharing, Fluoreszenz, Tail) integriert zwischen den Schwellen. An $S_b$ hängt die Genauigkeit der gesamten Zerlegung.

### Schätzung

Die Bin-Zählungen $y_b$ sind näherungsweise Poisson-verteilt. Daraus ergibt sich die Maximum-Likelihood-Schätzung

$$
\hat{\mathbf A} = \arg\max_{\mathbf A}\ \sum_b \Big[\,y_b \ln \bar\lambda_b(\mathbf A) - \bar\lambda_b(\mathbf A)\,\Big]
$$

Die Cramér-Rao-Schranke, also die Inverse der Fisher-Information $\mathbf F_{kl} = \sum_b \frac{1}{\bar\lambda_b} \frac{\partial \bar\lambda_b}{\partial A_k}\frac{\partial \bar\lambda_b}{\partial A_l}$, gibt das kleinste erreichbare Rauschen der Basisbilder an. Mit ihr lassen sich Schwellen gezielt optimieren. Zwei praktische Punkte:

- **Rauschkorrelation:** Die Basisbilder sind stark antikorreliert verrauscht, weil die Basisfunktionen ähnlich aussehen. Eine gemeinsame Regularisierung oder ein korreliertes Denoising verbessert die Ergebnisse deutlich.
- **Alternativen:** Zerlegung im Bildraum (einfacher, aber mit Aufhärtungsfehlern), oder One-Step-Rekonstruktion direkt aus den Bin-Rohdaten in Materialbilder (rechenintensiv, statistisch am saubersten).

### Was daraus wird

| Bild | Berechnung | Nutzen |
|---|---|---|
| Virtuelles monoenergetisches Bild (VMI) | $\mu(E_0) = \sum_k a_k f_k(E_0)$ für frei wählbares $E_0$ | niedrige keV für Iod-Kontrast, hohe keV gegen Metall- und Aufhärtungsartefakte |
| Iod-Map, virtuelles Nativbild | Basisbild Iod bzw. Wasser/Gewebe ohne Iod | Perfusion, Kontrastmittelanreicherung, Ersatz einer nativen Serie |
| Kalzium-Unterdrückung | Zerlegung mit Kalzium-Basis | Gefäßlumen trotz Plaque, Knochenmarködem |
| K-Kanten-Bildgebung | dritte Basis mit K-Kante | z. B. Gadolinium (50,2 keV) und Iod gleichzeitig unterscheiden |
| Optimal gewichtetes Bild | lineare Bin-Kombination mit maximalem CNR | Dosisreduktion bei gleicher Bildqualität |

## Bildqualität: MTF, NPS und DQE {#bildqualitaet level="5" toc="MTF, NPS, DQE"}

Die klassischen Kenngrößen gelten auch für PCDs, müssen aber mit Bedacht interpretiert werden, weil die Annahmen der linearen Systemtheorie nicht ohne Weiteres erfüllt sind.

### MTF

Ohne Szintillator gibt es keine Lichtstreuung. Die MTF wird im Wesentlichen durch die Pixelapertur bestimmt und folgt nahezu der idealen sinc-Funktion. Charge Sharing verbreitert die Antwort leicht. Ein bemerkenswerter Effekt: Bei *hoher* Schwelle werden nur Ereignisse nahe der Pixelmitte vollständig gezählt, weil Randereignisse ihre Ladung teilen und unter die Schwelle fallen. Die effektive Apertur wird kleiner als das Pixel, und die MTF kann *über* der sinc-Kurve des geometrischen Pixels liegen. Die MTF ist damit schwellenabhängig.

### NPS und Mehrfachzählung

Weil Elektronikrauschen nicht gezählt wird, besteht das Rauschen im Idealfall nur aus Photonenstatistik. Mehrfachzählungen ändern das: Wenn ein Photon in zwei benachbarten Pixeln gezählt wird, sind deren Werte korreliert. Das NPS ist dann nicht mehr flach (weiß), sondern bei niedrigen Ortsfrequenzen erhöht. Außerdem ist die Varianz der Gesamtzählung größer als ihr Mittelwert.

### DQE

Sei $m$ die Zahl der Zählungen, die ein einzelnes absorbiertes Photon auslöst (0, 1, 2 …). Analog zum Swank-Faktor eines Szintillators gilt bei der Ortsfrequenz null:

$$
\mathrm{DQE}(0) = \eta \cdot \frac{\langle m\rangle^2}{\langle m^2\rangle}
$$

mit der Quanteneffizienz $\eta$. Ein Detektor, der jedes Photon genau einmal zählt, hat $\langle m\rangle^2/\langle m^2\rangle = 1$. Zählt er 20 % der Photonen doppelt, ist $\langle m\rangle = 1{,}2$, $\langle m^2\rangle = 1{,}6$, und der Faktor sinkt auf 0,9. Abb. 7 berechnet diesen Faktor live: Stelle eine niedrige Schwelle und kleine Pixel ein und beobachte, wie er fällt. Mit Charge Summing kommt er näher an 1.

> [!note]
> **Messpraxis:** Normen für die DQE-Messung digitaler Röntgendetektoren (z. B. die Reihe IEC 62220) gehen von einem linearen, verschiebungsinvarianten System mit linearisierter Kennlinie aus. Für PCDs braucht es zusätzlich eine ratenabhängige Linearisierung, eine Festlegung, welche Schwelle bzw. welche Bin-Kombination betrachtet wird, und die Messung bei Flüssen, die klinisch relevant sind, weil Pile-up die Antwort verändert. Die Werte hängen von Schwelle und Rate ab und sind nicht als einzelne Zahl vergleichbar.

## Systeme und Sensortypen {#systeme level="5" toc="Systeme & Sensortypen"}

### CdTe / CZT, Face-on

Der Sensor liegt flach zum Strahl, die Röntgenquanten treten durch die Kathode ein. Vorteile: hohe Absorption in wenigen Millimetern, kompakte Module. Nachteile: Fluoreszenz bei 23–27 keV, Polarisation, anspruchsvolle Kristallherstellung. Das erste klinisch zugelassene PCD-CT, das Siemens NAEOTOM Alpha (FDA-Zulassung 2021), verwendet CdTe in einer Dual-Source-Geometrie.

### Silizium, Edge-on

Silizium absorbiert schwach. Man stellt die Sensoren deshalb hochkant, sodass der Strahl mehrere Zentimeter Silizium durchquert. Entlang der Tiefe kann man den Sensor zusätzlich segmentieren, was den Fluss pro Kanal verteilt und Tiefeninformation liefert. Vorteile: ausgereifte Materialqualität, keine Polarisation, keine störende K-Fluoreszenz im relevanten Bereich. Nachteile: Bei niedriger Ordnungszahl dominiert Compton-Streuung im Sensor, was zusätzliche niederenergetische Ereignisse erzeugt, und die Geometrie ist mechanisch aufwendig. Dieser Ansatz wird unter anderem als „Deep Silicon“ verfolgt.

### Typische Betriebsmodi

- **Ultra-High-Resolution (UHR):** Die kleinen Subpixel werden einzeln ausgelesen. Die Ortsauflösung reicht für Felsenbein, Lunge oder Koronarstents.
- **Standard / spektral:** Subpixel werden zu Makropixeln zusammengefasst, alle Bins werden für VMI und Materialbilder genutzt.
- **Niedrigdosis:** Profitiert direkt vom fehlenden Elektronikrauschen.

## Zahlen auf einen Blick {#zahlen appendix="A" eyebrow="Anhang"}

<p class="muted">Typische Größenordnungen bei Raumtemperatur. Werte für μτ schwanken je nach Kristallqualität und Hersteller um mindestens eine Größenordnung.</p>

| Größe | CdTe | CZT | Si |
|---|---:|---:|---:|
| Ordnungszahlen | 48 / 52 | 48 / 30 / 52 | 14 |
| Dichte (g/cm³) | 5,85 | ~5,8 | 2,33 |
| Bandlücke (eV) | 1,44 | ~1,57 | 1,12 |
| Paarerzeugungsenergie W (eV) | 4,43 | ~4,6 | 3,62 |
| μₑ (cm²/Vs) | ~1100 | ~1000 | ~1400 |
| μₕ (cm²/Vs) | ~100 | 50–100 | ~450 |
| (μτ)ₑ (cm²/V) | ~10⁻³ | 10⁻³–10⁻² | &gt; 1 |
| (μτ)ₕ (cm²/V) | ~10⁻⁴ | ~10⁻⁵ | ~1 |
| K-Kanten (keV) | Cd 26,7 · Te 31,8 | wie CdTe | 1,8 |

| Größe | Typischer Wert |
|---|---:|
| Sensordicke CdTe/CZT | 1,5–3 mm |
| Bias-Spannung | einige 100 V/mm |
| Pixelgröße am Detektor | ~0,1–0,3 mm |
| Energieschwellen pro Pixel | 2–8 |
| Unterste Schwelle | ~20–25 keV |
| Elektronikrauschen (ENC) | ~0,5–1 keV rms |
| Peaking-Zeit / Totzeit | ~10–30 ns |
| Fluss am Detektor (unabgeschwächt) | bis ~10⁸–10⁹ mm⁻²s⁻¹ |
| Ladungswolke (σ, nach Drift) | ~10–25 µm |
| K-Fluoreszenz Cd / Te (Kα) | 23,1 / 27,5 keV |
| K-Kanten Kontrastmittel | I 33,2 · Gd 50,2 · W 69,5 · Au 80,7 · Bi 90,5 keV |
