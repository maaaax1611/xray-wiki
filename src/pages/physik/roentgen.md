---
title: Vom Photon zum Bild
eyebrow: Grundlagen · Röntgen- und Detektorphysik
toc_intro: Die ganze Kette
footer: Alle Abbildungen sind didaktische Modelle mit genäherten Literaturwerten. Sie sollen Zusammenhänge zeigen, nicht exakte Messwerte liefern.
---

Alles, was man wissen muss, bevor man Photon-Counting-Detektoren verstehen kann. Sieben Bausteine, jeder mit einem kleinen Experiment zum Ausprobieren.

::: widget gl-00-messkette

## Was ist ein Photon? {#photon eyebrow="Baustein 1 · Strahlung"}

Radiowellen, Wärmestrahlung, sichtbares Licht, UV und Röntgenstrahlung sind alle dasselbe Phänomen: **elektromagnetische Strahlung**. Sie unterscheiden sich nur in einer Größe, der Energie bzw. gleichwertig der Wellenlänge.

Diese Strahlung kommt nicht als gleichmäßiger Strom, sondern in kleinsten Paketen. Ein solches Paket heißt **Photon**. Man kann sich ein Photon wie eine Münze vorstellen: Es kommt immer ganz oder gar nicht an, und jede Münze hat einen bestimmten Wert, ihre Energie.

### Energie und Wellenlänge

Je kürzer die Wellenlänge, desto mehr Energie trägt ein Photon:

$$
E = h \cdot f = \frac{h \cdot c}{\lambda}
$$

<dl class="sym">
<dt>E</dt><dd>Energie eines einzelnen Photons</dd>
<dt>h</dt><dd>Plancksches Wirkungsquantum, eine Naturkonstante (6,626·10⁻³⁴ J·s)</dd>
<dt>f</dt><dd>Frequenz der Welle (Schwingungen pro Sekunde)</dd>
<dt>c</dt><dd>Lichtgeschwindigkeit (3·10⁸ m/s)</dd>
<dt>λ</dt><dd>Wellenlänge</dd>
</dl>

### Die Einheit Elektronenvolt

Photonenenergien in Joule sind unhandlich klein. Man verwendet deshalb das **Elektronenvolt (eV)**: Das ist die Energie, die ein Elektron gewinnt, wenn es eine Spannung von 1 Volt durchläuft.

$$
1\ \mathrm{eV} = 1{,}602 \cdot 10^{-19}\ \mathrm{J}, \qquad 1\ \mathrm{keV} = 1000\ \mathrm{eV}
$$

Diese Definition ist praktisch, weil sie sich direkt auf die Röntgenröhre übertragen lässt: Ein Elektron, das 120 000 V (120 kV) durchläuft, hat danach 120 keV Energie. Mehr dazu in Baustein 2. Eine nützliche Faustformel zum Umrechnen:

$$
\lambda\,[\mathrm{nm}] \approx \frac{1240}{E\,[\mathrm{eV}]}
$$

::: widget gl-01-em-spektrum

> [!abstract] Merke
> - Strahlung besteht aus Photonen. Jedes Photon hat eine bestimmte Energie.
> - CT-Photonen haben 20–140 keV, also rund 30 000-mal mehr Energie als ein Photon grünen Lichts.
> - Wichtig für später: Eine Röntgenröhre liefert nicht eine einzige Energie, sondern eine Mischung. Diese Verteilung heißt **Spektrum**.

## Die Röntgenröhre {#roehre eyebrow="Baustein 2 · Quelle"}

Eine Röntgenröhre ist im Kern ein evakuierter Glas- oder Metallkolben mit zwei Elektroden:

- Die **Kathode** ist ein Glühdraht. Er wird so heiß, dass Elektronen aus ihm austreten.
- Zwischen Kathode und **Anode** liegt eine Hochspannung, im CT typisch 80–140 kV. Sie beschleunigt die Elektronen auf die Anode zu.
- Die Anode besteht meist aus **Wolfram**. Dort werden die Elektronen schlagartig abgebremst.

Beim Abbremsen entsteht Röntgenstrahlung. Über 99 % der Energie werden allerdings zu Wärme, deshalb drehen sich CT-Anoden und werden aufwendig gekühlt.

### Bremsstrahlung: warum ein Spektrum entsteht

Ein Elektron fliegt an einem Atomkern der Anode vorbei und wird durch dessen Anziehung abgelenkt und gebremst. Die verlorene Energie geht als Photon weg. Wie viel das Elektron verliert, ist zufällig: Mal ist es nur ein wenig (schwaches Photon), selten alles auf einmal (Photon mit der Maximalenergie). Daraus ergibt sich eine breite Verteilung, das **Bremsstrahlungsspektrum**. Die Obergrenze ist die volle Elektronenenergie:

$$
E_{\max} = e \cdot U \qquad \Rightarrow\qquad 120\ \mathrm{kV} \;\to\; E_{\max} = 120\ \mathrm{keV}
$$

Zusätzlich gibt es scharfe Linien, die **charakteristische Strahlung**: Ein Elektron schlägt ein inneres Elektron aus einem Wolfram-Atom, ein äußeres Elektron springt in die Lücke und sendet dabei ein Photon mit genau festgelegter Energie (für Wolfram etwa 58–59 keV und 67 keV). Das funktioniert erst ab ca. 70 kV.

### Filterung

Niederenergetische Photonen würden im Patienten fast vollständig absorbiert. Sie erhöhen die Dosis, tragen aber nichts zum Bild bei. Darum steht direkt hinter der Röhre ein Metallfilter (meist Aluminium, oft zusätzlich Kupfer oder Zinn). Er schluckt bevorzugt die weichen Photonen. Man sagt: Das Spektrum wird **aufgehärtet**.

::: widget gl-02-roentgenroehre

> [!abstract] Merke
> - Die Röhrenspannung in kV legt die *maximale* Photonenenergie in keV fest.
> - Das Spektrum ist breit, weil Bremsstrahlung zufällig viel oder wenig Energie abgibt.
> - Filter entfernen die weichen Photonen und verschieben die mittlere Energie nach oben.

## Röntgen trifft Materie {#materie eyebrow="Baustein 3 · Wechselwirkung"}

Wenn ein Röntgenphoton durch Materie fliegt, passiert meistens gar nichts. Es fliegt einfach durch. Nur gelegentlich trifft es auf ein Elektron eines Atoms und tritt in Wechselwirkung. Im CT-Energiebereich sind zwei Prozesse wichtig.

::: widget gl-03-photoeffekt-compton

### Der Photoeffekt hängt stark vom Material ab

Die Wahrscheinlichkeit für den Photoeffekt wächst sehr stark mit der Ordnungszahl Z des Atoms und fällt sehr stark mit der Energie:

$$
\text{Photoeffekt} \;\propto\; \frac{Z^{3\ldots4}}{E^{3}}
$$

Das ist der Grund, warum Knochen (Kalzium, Z = 20) im Röntgenbild hell erscheinen und Weichteil (vor allem H, C, O mit Z ≤ 8) nicht. Es ist auch der Grund, warum Detektoren aus schweren Elementen wie Cadmium (Z = 48) und Tellur (Z = 52) gebaut werden: Sie fangen Photonen auf kurzer Strecke.

### Das Schwächungsgesetz

Jedes Photon hat auf jedem Millimeter Weg dieselbe kleine Chance, aufgehalten zu werden. Daraus folgt ein exponentieller Abfall, das **Lambert-Beer-Gesetz**:

$$
I(x) = I_0 \cdot e^{-\mu x}
$$

<dl class="sym">
<dt>I₀</dt><dd>Zahl der Photonen vor dem Objekt</dd>
<dt>I(x)</dt><dd>Zahl der Photonen, die nach der Dicke x noch ungestört durchkommen</dd>
<dt>μ</dt><dd>linearer Schwächungskoeffizient in 1/cm. Er hängt vom Material und von der Photonenenergie ab.</dd>
</dl>

Eine anschauliche Größe ist die **Halbwertsdicke**: die Dicke, nach der nur noch die Hälfte übrig ist, $x_{1/2} = \ln 2 / \mu$. Für Wasser bei 60 keV sind das etwa 3,4 cm. 20 cm Wasser lassen also nur noch etwa $0{,}5^{6} \approx 1{,}6\,\%$ der Photonen ungestört durch.

::: widget gl-04-schwaechung

Probiere: Bei gleicher Dicke schwächt Knochen viel stärker als Wasser, und der Unterschied ist bei niedriger Energie am größten. Genau dieser Unterschied ist der **Kontrast** im Röntgenbild. Bei hoher Energie werden alle Materialien ähnlich durchsichtig, der Kontrast sinkt.

> [!abstract] Merke
> - Photoeffekt: Photon weg, Energie geht an ein Elektron. Stark bei schweren Atomen und niedriger Energie.
> - Compton: Photon wird abgelenkt und verliert etwas Energie.
> - Die Zahl der ungestörten Photonen fällt exponentiell: $I = I_0 e^{-\mu x}$.
> - μ hängt vom Material und von der Energie ab. Das ist die Grundlage für Kontrast und später für spektrale Bildgebung.

## Halbleiter: wie aus einem Photon Ladung wird {#halbleiter eyebrow="Baustein 4 · Sensor" toc="Halbleiter"}

Im Detektor soll ein Photon ein elektrisches Signal erzeugen. Dafür braucht man ein Material, in dem die Energie des Photons bewegliche Ladungen freisetzt, das aber ohne Photon möglichst keinen Strom leitet. Genau das leistet ein **Halbleiter**.

### Das Bändermodell

In einem Kristall können Elektronen nicht jede beliebige Energie haben, sondern nur Energien innerhalb bestimmter Bereiche, der **Bänder**:

- Im **Valenzband** sitzen die Elektronen, die die Atome zusammenhalten. Sie sind gebunden und können sich nicht frei bewegen.
- Im **Leitungsband** sind Elektronen frei beweglich und können Strom transportieren.
- Dazwischen liegt die **Bandlücke** $E_g$: ein verbotener Bereich. Ein Elektron braucht mindestens diese Energie, um vom Valenz- ins Leitungsband zu springen.

::: widget gl-05-baendermodell

### Warum ausgerechnet ein Halbleiter?

- **Metall:** enthält immer unzählige freie Elektronen. Ein paar zusätzliche durch ein Photon gingen darin unter.
- **Isolator:** hat kaum freie Elektronen, das wäre gut. Aber die Ladungen, die ein Photon erzeugt, bewegen sich in der Regel schlecht und bleiben stecken.
- **Halbleiter:** der Kompromiss. Ohne Photon fließt (bei angelegter Spannung) nur ein kleiner Leckstrom, mit Photon entstehen viele bewegliche Ladungen.

### Wie viele Ladungen ein Photon erzeugt

Absorbiert der Halbleiter ein Röntgenphoton, bekommt zunächst ein einzelnes Elektron die ganze Energie (Photoeffekt aus Baustein 3). Dieses sehr schnelle Elektron rast durch den Kristall und stößt dabei viele weitere Elektronen über die Bandlücke. Es entsteht eine Wolke aus **Elektron-Loch-Paaren**.

Im Mittel kostet jedes Paar eine feste Energie $W$. Sie ist etwa dreimal so groß wie die Bandlücke, weil ein Teil der Energie unterwegs als Wärme im Kristall verloren geht. Die Zahl der Paare ist daher einfach:

$$
N = \frac{E_{\mathrm{Photon}}}{W}
$$

Die entstandene Ladung ist $Q = N \cdot e$, mit der Elementarladung $e = 1{,}602 \cdot 10^{-19}$ C. Das ist die zentrale Eigenschaft für alles Weitere: **Die Ladung ist proportional zur Photonenenergie.** Wer die Ladung misst, misst die Energie.

::: widget gl-06-paarerzeugung

> [!abstract] Merke
> - Halbleiter haben eine kleine Bandlücke: Energie von außen erzeugt bewegliche Elektronen und Löcher.
> - Ein Photon erzeugt $N = E/W$ Paare, in CdTe etwa 13 500 bei 60 keV. Das ist eine winzige Ladung von etwa 2 fC.
> - Die Ladung ist proportional zur Energie des Photons.

## Ladung im elektrischen Feld {#drift eyebrow="Baustein 5 · Transport"}

Die Elektron-Loch-Wolke allein nützt noch nichts. Wenn man nichts tut, finden Elektronen und Löcher nach kurzer Zeit wieder zusammen und die Information ist verloren. Deshalb legt man an den Sensor eine Spannung an.

### Spannung und Feld

Der Sensor ist eine Kristallscheibe mit einer Elektrode oben und unten, wie ein Plattenkondensator. Die Spannung $U$ zwischen ihnen erzeugt im Inneren ein elektrisches Feld:

$$
\mathcal{E} = \frac{U}{d}
$$

Bei 1000 V über 1,6 mm sind das 6250 V/cm. Das Feld übt auf jede Ladung eine Kraft aus: Elektronen (negativ) werden zur positiven Elektrode gezogen, der **Anode**. Löcher (positiv) wandern zur negativen Elektrode, der **Kathode**. So werden die beiden Sorten getrennt, bevor sie sich wiederfinden.

### Drift: konstante Geschwindigkeit statt Beschleunigung

Im Vakuum würde eine Ladung im Feld immer schneller. Im Kristall stößt sie aber ständig mit dem Gitter zusammen und wird wieder gebremst. Im Mittel stellt sich eine konstante **Driftgeschwindigkeit** ein, ähnlich wie eine Kugel, die in Honig sinkt:

$$
v = \mu \cdot \mathcal{E}
$$

Die **Beweglichkeit** μ sagt, wie leicht eine Ladung durch den Kristall kommt. In CdTe sind Elektronen etwa zehnmal beweglicher als Löcher (≈ 1100 gegen ≈ 100 cm²/Vs). Löcher sind also die langsamen Ladungen.

### Einfangen (Trapping)

Kein Kristall ist perfekt. Fehlstellen und Verunreinigungen wirken wie Fallen, in denen Ladungen stecken bleiben können. Wie lange eine Ladung im Mittel frei bleibt, heißt **Lebensdauer** τ. Die interessante Frage ist: Wie weit kommt sie in dieser Zeit?

$$
\lambda = v \cdot \tau = \mu \tau \cdot \mathcal{E}
$$

Ist diese mittlere Driftlänge λ viel größer als die Sensordicke, kommt fast jede Ladung an. Ist sie kleiner, geht unterwegs ein Teil verloren, und das Signal wird zu klein. Deshalb ist das Produkt μτ eine der wichtigsten Kennzahlen eines Sensormaterials.

::: widget gl-07-drift-signal

Probiere: Verringere μτ der Löcher und setze die Absorption nah an die Anode (große Tiefe), dann nah an die Kathode. Je nach Ort fehlt ein anderer Teil des Signals. Gleiche Photonenenergie ergibt dann unterschiedlich große Signale. Genau dieses Problem behandelt die Seite zu Photon Counting im Abschnitt über den Small-Pixel-Effekt.

> [!abstract] Merke
> - Die Spannung erzeugt ein Feld $\mathcal E = U/d$, das Elektronen und Löcher trennt.
> - Die Ladungen driften mit $v = \mu \mathcal E$. Elektronen sind schnell, Löcher langsam.
> - Fallen im Kristall fangen Ladungen ein. Ob genug ankommt, entscheidet $\lambda = \mu\tau\mathcal E$ im Vergleich zur Dicke.

## Vom Ladungsträger zum Signal {#signal eyebrow="Baustein 6 · Elektronik"}

### Strom ist bewegte Ladung

Elektrischer Strom ist Ladung pro Zeit. Fließt ein Strom $i(t)$ eine Weile, ist die insgesamt transportierte Ladung die Fläche unter der Stromkurve:

$$
i = \frac{\mathrm{d}Q}{\mathrm{d}t} \qquad\Longleftrightarrow\qquad Q = \int i(t)\,\mathrm{d}t
$$

### Das Signal entsteht schon während der Bewegung

Man könnte denken, die Elektrode merkt erst etwas, wenn eine Ladung bei ihr ankommt. Das stimmt nicht. Jede Ladung im Sensor zieht auf den Elektroden eine Gegenladung an (**Influenz**, wie ein Spiegelbild). Wandert die Ladung, verschiebt sich das Spiegelbild, und dafür muss im Stromkreis Strom fließen. Der Strom fließt also, *solange* sich Ladungen bewegen.

Im einfachsten Fall, zwei großen flachen Elektroden, gilt: Eine Ladung, die einen Bruchteil der Sensordicke zurücklegt, liefert genau diesen Bruchteil ihrer Ladung als Signal. Ein Elektron, das 60 % der Dicke durchquert, und ein Loch, das die übrigen 40 % schafft, ergeben zusammen 100 %. Das ist die Kurve in Abb. 7: Der steile Anstieg kommt von den schnellen Elektronen, der langsame Rest von den Löchern. Bleiben die Löcher stecken, fehlt dieser Rest.

### Der Verstärker

Die Ladung eines Photons beträgt nur einige Femtocoulomb. Ein **ladungsempfindlicher Verstärker** sammelt sie auf einem winzigen Kondensator $C_f$ und macht daraus eine messbare Spannung:

$$
V = \frac{Q}{C_f}
$$

Bei $C_f$ = 10 fF und 2 fC ergibt das 0,2 V. Ein nachgeschalteter Pulsformer erzeugt daraus einen kurzen Spannungspuls. Seine Höhe ist proportional zur Ladung und damit zur Photonenenergie. Jedes Photon wird zu einem Puls.

### Integrieren oder zählen

Jetzt gibt es zwei grundsätzliche Wege, aus den Pulsen eine Zahl pro Pixel zu machen. Das ist die Gabelung, an der Photon Counting beginnt:

- **Integrieren:** Alles aufsummieren, was in einem Zeitfenster ankommt. Das Ergebnis ist proportional zur Gesamtenergie. Das Rauschen der Elektronik wird immer mit aufsummiert. So arbeiten klassische CT-Detektoren.
- **Zählen:** Jeden Puls einzeln mit einer Schwelle vergleichen und Pulse über der Schwelle zählen. Rauschen, das unter der Schwelle bleibt, wird ignoriert. Mit mehreren Schwellen kann man die Photonen zusätzlich nach Energie sortieren.

::: widget gl-08-integrieren-zaehlen

> [!abstract] Merke
> - Bewegte Ladung im Sensor erzeugt sofort Strom an der Elektrode. Die Fläche unter dem Strom ist die Ladung.
> - Ein Verstärker macht aus der Ladung eines Photons einen Spannungspuls, dessen Höhe der Energie entspricht.
> - Integrierende Detektoren summieren alles auf, Rauschen inklusive. Zählende Detektoren zählen Pulse über einer Schwelle.

## Vom Signal zum CT-Bild {#ct eyebrow="Baustein 7 · Bildgebung"}

Ein einzelnes Röntgenbild ist eine **Projektion**: Alles, was auf dem Strahlweg liegt, überlagert sich. Man sieht nicht, ob ein Schatten vorne oder hinten im Körper liegt. Das CT löst das, indem es Projektionen aus vielen Richtungen aufnimmt und daraus einen Querschnitt berechnet.

### Was ein Detektorpixel eigentlich misst

Für einen Strahl durch verschiedene Gewebe verallgemeinert sich das Schwächungsgesetz aus Baustein 3: Die Schwächungskoeffizienten entlang des Weges addieren sich.

$$
I = I_0 \cdot e^{-\int \mu(l)\,\mathrm{d}l} \qquad\Rightarrow\qquad p = -\ln\frac{I}{I_0} = \int \mu(l)\,\mathrm{d}l
$$

Logarithmiert man das Verhältnis von gemessenen zu ungeschwächten Photonen, erhält man also die Summe von μ entlang des Strahls, das **Linienintegral** $p$. Jedes Detektorpixel liefert ein solches $p$ für seinen Strahl.

### Sinogramm und Rückprojektion

Röhre und Detektor drehen sich um den Patienten. Für jeden Winkel θ entsteht ein Profil $p(\theta, s)$ über die Detektorposition $s$. Stapelt man diese Profile Winkel für Winkel untereinander, erhält man das **Sinogramm**. Der Name kommt daher, dass jeder Punkt im Körper darin eine Sinuskurve beschreibt.

Zur Rekonstruktion „verschmiert“ man jedes Profil zurück über das Bild, entlang der Richtung, aus der es gemessen wurde (**Rückprojektion**). Wo viele Strahlen hohe Schwächung gemessen haben, entsteht ein heller Bereich. Ohne Weiteres wird das Ergebnis aber stark verwaschen. Deshalb filtert man jedes Profil vorher mit einem Hochpass, der Kanten betont: die **gefilterte Rückprojektion** (FBP). Moderne Geräte verwenden oft iterative oder KI-gestützte Verfahren, das Prinzip bleibt aber dasselbe. Die ausführliche Herleitung steht auf der Seite [„Vom Sinogramm zum Schnittbild“](rekonstruktion.html).

::: widget gl-09-ct-rekonstruktion

### Hounsfield-Einheiten

Die rekonstruierten μ-Werte hängen von der Strahlenergie ab. Um Bilder vergleichbar zu machen, rechnet man sie in **Hounsfield-Einheiten** um, bezogen auf Wasser:

$$
\mathrm{HU} = 1000 \cdot \frac{\mu - \mu_{\mathrm{Wasser}}}{\mu_{\mathrm{Wasser}}}
$$

| Gewebe | typische HU |
|---|---:|
| Luft | −1000 |
| Lunge | −900 bis −700 |
| Fett | −120 bis −80 |
| Wasser | 0 |
| Weichteil, Muskel | +30 bis +60 |
| Gefäß mit Iod-Kontrastmittel | +200 bis +500 |
| Knochen | +300 bis +2000 |

Weil μ von der Energie abhängt und das Spektrum polychromatisch ist, sind HU-Werte nur näherungsweise eindeutig. Ein Material kann bei 80 kV einen anderen Wert haben als bei 140 kV. Genau diese Energieabhängigkeit nutzt die spektrale CT, und Photon Counting liefert sie in jedem Scan mit.

> [!abstract] Merke
> - Jedes Detektorpixel misst ein Linienintegral $p = -\ln(I/I_0) = \int\mu\,\mathrm{d}l$.
> - Viele Projektionen aus vielen Winkeln ergeben das Sinogramm.
> - Gefilterte Rückprojektion macht daraus ein Schnittbild von μ, dargestellt in HU.

## Weiter zu Photon Counting {#bruecke eyebrow="Nächster Schritt" n="→"}

Mit diesen Bausteinen lässt sich die Seite zu Photon-Counting-Detektoren Schritt für Schritt lesen. Die Tabelle zeigt, welcher Grundlagen-Baustein wo gebraucht wird.

| Thema bei Photon Counting | baut auf |
|---|---|
| Zählen statt integrieren | Baustein 6: Pulse, Schwelle, Rauschen |
| Direkte Konversion in CdTe | Baustein 3 (Photoeffekt, Z) und 4 (Paarerzeugung) |
| Ladungstransport, Hecht-Gleichung | Baustein 5: Drift, μτ, Driftlänge |
| Shockley-Ramo, Small-Pixel-Effekt | Baustein 6: Influenz, Signal während der Bewegung |
| ASIC, Schwellen, Energie-Bins | Baustein 6: Verstärker, Puls ∝ Energie |
| Pile-up | Baustein 6: Pulse dauern eine gewisse Zeit |
| K-Fluoreszenz | Baustein 3: Photoeffekt an inneren Schalen; Baustein 2: charakteristische Strahlung |
| Spektren, Materialzerlegung | Baustein 2 (Spektrum) und 3 (μ hängt von Energie und Material ab) |
| Bildgebung, HU, virtuelle monoenergetische Bilder | Baustein 7 |

[Zur Seite „Photonen zählen“](photon-counting.html)

## Glossar {#glossar appendix="A" eyebrow="Anhang"}

<div class="tbl"><table>
<tbody>
<tr><td><strong>Anode / Kathode</strong></td><td>Positive / negative Elektrode. In der Röhre treffen die Elektronen auf die Anode, im Sensor sammeln sich die Elektronen an der Anode.</td></tr>
<tr><td><strong>Bandlücke \(E_g\)</strong></td><td>Mindestenergie, um ein Elektron im Halbleiter beweglich zu machen.</td></tr>
<tr><td><strong>Beweglichkeit μ</strong></td><td>Wie schnell eine Ladung pro Feldstärke driftet, in cm²/Vs. (Nicht verwechseln mit dem Schwächungskoeffizienten, der ebenfalls μ heißt.)</td></tr>
<tr><td><strong>Bremsstrahlung</strong></td><td>Röntgenstrahlung, die entsteht, wenn Elektronen in der Anode abgebremst werden. Liefert ein breites Spektrum.</td></tr>
<tr><td><strong>Compton-Streuung</strong></td><td>Photon gibt einen Teil seiner Energie an ein Elektron ab und ändert die Richtung.</td></tr>
<tr><td><strong>Drift</strong></td><td>Gleichmäßige Bewegung einer Ladung im elektrischen Feld innerhalb eines Kristalls.</td></tr>
<tr><td><strong>Elektronenvolt (eV)</strong></td><td>Energie, die ein Elektron beim Durchlaufen von 1 V gewinnt. 1 eV = 1,602·10⁻¹⁹ J.</td></tr>
<tr><td><strong>Elektron-Loch-Paar</strong></td><td>Ein befreites Elektron plus die positive Lücke, die es zurücklässt.</td></tr>
<tr><td><strong>Filterung / Aufhärtung</strong></td><td>Entfernen weicher Photonen, wodurch die mittlere Energie steigt.</td></tr>
<tr><td><strong>Influenz</strong></td><td>Eine Ladung zieht auf einer Elektrode eine Gegenladung an. Bewegt sie sich, fließt Strom.</td></tr>
<tr><td><strong>Linienintegral \(p\)</strong></td><td>Summe der Schwächung entlang eines Strahls, \(p = -\ln(I/I_0)\).</td></tr>
<tr><td><strong>Photoeffekt</strong></td><td>Photon wird vollständig absorbiert, seine Energie geht an ein Elektron.</td></tr>
<tr><td><strong>Photon</strong></td><td>Kleinstes Paket elektromagnetischer Strahlung mit Energie \(E = hf\).</td></tr>
<tr><td><strong>Projektion / Sinogramm</strong></td><td>Messprofil aus einer Richtung / alle Profile aller Winkel gestapelt.</td></tr>
<tr><td><strong>Schwächungskoeffizient μ</strong></td><td>Wie stark ein Material Photonen einer Energie aufhält, in 1/cm.</td></tr>
<tr><td><strong>Spektrum</strong></td><td>Verteilung der Photonenenergien.</td></tr>
<tr><td><strong>Trapping, μτ</strong></td><td>Einfangen von Ladungen an Kristallfehlern; μτ bestimmt, wie weit sie im Mittel kommen.</td></tr>
<tr><td><strong>W-Wert</strong></td><td>Mittlere Energie pro erzeugtem Elektron-Loch-Paar (CdTe: 4,43 eV).</td></tr>
</tbody>
</table></div>
