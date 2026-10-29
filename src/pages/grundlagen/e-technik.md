---
title: E-Technik kompakt
eyebrow: Auffrischung · Elektrotechnik
footer: Alle Simulationen sind idealisierte Modelle. Sie zeigen Zusammenhänge, keine Eigenschaften realer Bauteile.
---

Was man aus der Elektrotechnik parat haben sollte, um Detektoren, Verstärker und Pulsformer zu verstehen: Felder, Bauelemente, Schaltungen und Rauschen. Jeder Abschnitt baut auf dem vorherigen auf.

## Ladung, Strom, Spannung {#grundgroessen group="Felder" eyebrow="Grundlagen"}

**Ladung** $Q$ ist die Grundgröße. Sie ist immer ein Vielfaches der Elementarladung $e = 1{,}602\cdot10^{-19}$ C. Ein Elektron trägt $-e$, ein Proton $+e$. Gleiche Ladungen stoßen sich ab, ungleiche ziehen sich an.

**Strom** $I$ ist Ladung, die pro Zeit durch einen Querschnitt fließt. 1 Ampere sind 1 Coulomb pro Sekunde, also etwa $6\cdot10^{18}$ Elektronen pro Sekunde.

$$
I = \frac{\mathrm dQ}{\mathrm dt} \qquad\Longleftrightarrow\qquad Q = \int I\,\mathrm dt
$$

**Spannung** $U$ ist Energie pro Ladung. Fällt eine Ladung $Q$ durch die Spannung $U$, gewinnt oder verliert sie die Energie $W = Q\cdot U$. Daher kommt auch die Einheit Elektronenvolt: 1 eV ist die Energie eines Elektrons, das 1 V durchläuft. Spannung wird immer zwischen zwei Punkten gemessen, sie ist eine Potentialdifferenz.

Ein **Widerstand** $R$ setzt Strom und Spannung ins Verhältnis. Für ohmsche Bauteile ist das Verhältnis konstant:

$$
U = R\cdot I \qquad\qquad P = U\cdot I = I^2 R = \frac{U^2}{R}
$$

$P$ ist die Leistung, also die Energie pro Zeit, die der Widerstand in Wärme umsetzt.

### Die zwei Kirchhoffschen Regeln

- **Knotenregel:** In einen Knoten fließt genauso viel Strom hinein wie heraus. Ladung geht nicht verloren: $\sum I = 0$.
- **Maschenregel:** Auf einem geschlossenen Umlauf addieren sich alle Spannungen zu null: $\sum U = 0$. Anschaulich: Wer einmal im Kreis läuft, kommt auf derselben Höhe an.

Mit diesen beiden Regeln und dem ohmschen Gesetz lässt sich jede Gleichstromschaltung berechnen. Das wichtigste Beispiel ist der **Spannungsteiler**: Zwei Widerstände in Reihe teilen die Spannung im Verhältnis ihrer Werte.

$$
U_2 = U\cdot\frac{R_2}{R_1 + R_2}
$$

::: widget et-01-spannungsteiler

> [!abstract] Merke
> - Strom ist Ladung pro Zeit, Spannung ist Energie pro Ladung.
> - $U = RI$, $P = UI$. Knoten: Ströme summieren sich zu null. Masche: Spannungen summieren sich zu null.
> - Reihe: Widerstände addieren sich. Parallel: Kehrwerte addieren sich, $1/R = 1/R_1 + 1/R_2$.

## Elektrisches Feld und Potential {#efeld toc="Elektrisches Feld"}

Zwei Punktladungen üben aufeinander eine Kraft aus, das **Coulomb-Gesetz**:

$$
F = \frac{1}{4\pi\varepsilon_0}\,\frac{Q_1 Q_2}{r^2}
$$

Statt von Kraft zwischen zwei Ladungen spricht man meist vom **elektrischen Feld** $\vec E$: Jede Ladung erzeugt um sich herum ein Feld, und eine zweite Ladung $q$ spürt darin die Kraft $\vec F = q\vec E$. Das Feld ist also „Kraft pro Ladung“, Einheit V/m. Für eine Punktladung zeigt es radial nach außen (bei positiver Ladung) und fällt mit $1/r^2$ ab.

Das **Potential** φ ist die potentielle Energie pro Ladung an einem Ort. Spannung ist die Differenz zweier Potentiale. Feld und Potential hängen eng zusammen: Das Feld zeigt immer in die Richtung, in der das Potential am stärksten abfällt.

$$
\vec E = -\nabla\varphi \qquad\qquad U_{AB} = \varphi_A - \varphi_B = \int_A^B \vec E\cdot\mathrm d\vec s
$$

Im einfachsten Fall, einem homogenen Feld zwischen zwei Platten im Abstand $d$, gilt einfach $E = U/d$. Das ist genau das Feld im Sensor eines Röntgendetektors.

- **Feldlinien** zeigen die Richtung der Kraft auf eine positive Ladung. Sie beginnen an positiven und enden an negativen Ladungen.
- **Äquipotentiallinien** verbinden Punkte gleichen Potentials. Sie stehen immer senkrecht auf den Feldlinien. Entlang einer Äquipotentiallinie kostet es keine Energie, eine Ladung zu verschieben.

::: widget et-02-e-feld

> [!abstract] Merke
> - Feld = Kraft pro Ladung, $\vec F = q\vec E$. Potential = Energie pro Ladung.
> - Feld zeigt vom hohen zum niedrigen Potential, $\vec E = -\nabla\varphi$. Im Plattenkondensator $E = U/d$.

## Magnetfeld und Lorentzkraft {#bfeld}

Bewegte Ladungen, also Ströme, erzeugen ein **Magnetfeld** $\vec B$ (Einheit Tesla). Um einen geraden Leiter laufen die Feldlinien in Kreisen. Die Richtung gibt die **Rechte-Hand-Regel**: Daumen in Stromrichtung, die gekrümmten Finger zeigen die Feldrichtung. Der Betrag im Abstand $r$ ist

$$
B = \frac{\mu_0 I}{2\pi r}
$$

Magnetische Feldlinien haben weder Anfang noch Ende, es gibt keine magnetischen „Ladungen“. Auch ein Stabmagnet ist im Inneren aus atomaren Kreisströmen aufgebaut.

### Lorentzkraft

Umgekehrt spürt eine bewegte Ladung im Magnetfeld eine Kraft, senkrecht zur Geschwindigkeit und senkrecht zum Feld. Zusammen mit dem elektrischen Anteil:

$$
\vec F = q\,\big(\vec E + \vec v\times\vec B\big)
$$

Weil die magnetische Kraft immer senkrecht zur Bewegung steht, ändert sie nur die Richtung, nicht die Geschwindigkeit. In einem homogenen Feld fliegt ein Teilchen deshalb auf einer Kreisbahn mit dem Radius

$$
r = \frac{m v}{|q| B}, \qquad T = \frac{2\pi m}{|q| B}
$$

Die Umlaufzeit $T$ hängt nicht von der Geschwindigkeit ab. Kommt ein elektrisches Feld senkrecht dazu, können sich beide Kräfte aufheben. Das passiert genau bei $v = E/B$, dann fliegt das Teilchen geradeaus (**Wien-Filter**, ein einfacher Geschwindigkeitsfilter).

::: widget et-03-lorentzkraft

> [!abstract] Merke
> - Ströme erzeugen Magnetfelder, um einen Leiter kreisförmig: $B = \mu_0 I / 2\pi r$.
> - Lorentzkraft $\vec F = q(\vec E + \vec v\times\vec B)$: magnetischer Anteil senkrecht zur Bewegung, ändert nur die Richtung.

## Induktion {#induktion}

Ein sich änderndes Magnetfeld erzeugt eine Spannung. Entscheidend ist der **magnetische Fluss** Φ, also wie viel Feld durch eine Fläche tritt ($\Phi = B\cdot A$ bei senkrechtem, homogenem Feld). Das **Induktionsgesetz** von Faraday:

$$
U_{\text{ind}} = -N\,\frac{\mathrm d\Phi}{\mathrm dt}
$$

mit der Windungszahl $N$ der Spule. Es zählt nur die *Änderung*: Ein ruhender Magnet in einer Spule induziert nichts, ein bewegter schon. Das Minuszeichen ist die **Lenzsche Regel**: Der induzierte Strom ist so gerichtet, dass sein eigenes Magnetfeld der Änderung entgegenwirkt.

::: widget et-04-induktion

> [!abstract] Merke
> - Nur ein sich ändernder Fluss induziert Spannung: $U = -N\,\mathrm d\Phi/\mathrm dt$.
> - Eine Spule nutzt Induktion an sich selbst, siehe Abschnitt 6.

## Maxwell-Gleichungen und elektromagnetische Wellen {#maxwell toc="Maxwell und EM-Wellen"}

Alles aus den Abschnitten 2 bis 4 steckt in vier Gleichungen. Man muss sie nicht auswendig können, aber ihre Aussage sollte man kennen:

| Gleichung | Aussage in Worten |
|---|---|
| $\nabla\cdot\vec E = \rho/\varepsilon_0$ | Ladungen sind Quellen des elektrischen Feldes (Coulomb). |
| $\nabla\cdot\vec B = 0$ | Es gibt keine magnetischen Ladungen, B-Feldlinien sind geschlossen. |
| $\nabla\times\vec E = -\partial\vec B/\partial t$ | Ein sich änderndes Magnetfeld erzeugt ein elektrisches Wirbelfeld (Induktion). |
| $\nabla\times\vec B = \mu_0\vec J + \mu_0\varepsilon_0\,\partial\vec E/\partial t$ | Ströme und sich ändernde elektrische Felder erzeugen Magnetfelder. |

Die letzten beiden Gleichungen zusammen haben eine bemerkenswerte Folge: Ein sich änderndes E-Feld erzeugt ein B-Feld, das sich ändernde B-Feld wieder ein E-Feld, und so weiter. Die Störung pflanzt sich selbst fort, ganz ohne Ladungen. Das ist eine **elektromagnetische Welle**. Ihre Geschwindigkeit ergibt sich allein aus den beiden Feldkonstanten:

$$
c = \frac{1}{\sqrt{\mu_0\varepsilon_0}} \approx 3\cdot10^8\ \mathrm{m/s}
$$

E und B stehen senkrecht aufeinander und senkrecht zur Ausbreitungsrichtung, schwingen in Phase, und es gilt $E = cB$. Radio, Licht und Röntgenstrahlung sind alle solche Wellen, nur mit unterschiedlicher Frequenz. Ihre Teilchennatur, das Photon, beschreibt Baustein 1 der Seite [„Vom Photon zum Bild“](../physik/roentgen.html#photon).

::: widget et-05-em-welle

## Passive Bauelemente: Widerstand, Kondensator, Spule {#passiv group="Bauelemente" toc="Widerstand, Kondensator, Spule"}

Die drei passiven Grundbauelemente unterscheiden sich darin, wie sie Strom und Spannung verknüpfen. Der Widerstand setzt Energie in Wärme um. Kondensator und Spule speichern Energie, der eine im elektrischen, die andere im magnetischen Feld.

|  | Widerstand | Kondensator | Spule |
|---|---|---|---|
| Grundgleichung | $U = R\,I$ | $I = C\,\dfrac{\mathrm dU}{\mathrm dt}$ | $U = L\,\dfrac{\mathrm dI}{\mathrm dt}$ |
| Einheit | Ohm (Ω) | Farad (F) | Henry (H) |
| Energie | wird zu Wärme, $P = I^2R$ | gespeichert, $\tfrac12 CU^2$ | gespeichert, $\tfrac12 LI^2$ |
| kann nicht springen | (nichts) | Spannung | Strom |
| bei Gleichspannung | R | sperrt | leitet (Kurzschluss) |
| bei hoher Frequenz | R | leitet | sperrt |
| Reihenschaltung | $R_1 + R_2$ | $1/C = 1/C_1 + 1/C_2$ | $L_1 + L_2$ |
| Parallelschaltung | $1/R = 1/R_1 + 1/R_2$ | $C_1 + C_2$ | $1/L = 1/L_1 + 1/L_2$ |

### Widerstand

Der Widerstand eines Leiters hängt vom Material und von der Form ab:

$$
R = \rho\,\frac{l}{A}
$$

mit dem spezifischen Widerstand ρ, der Länge $l$ und dem Querschnitt $A$. Langer, dünner Draht hat viel Widerstand, kurzer, dicker wenig. Kupfer hat $\rho \approx 1{,}7\cdot10^{-8}$ Ωm, Silizium ohne Dotierung rund $2\cdot10^{3}$ Ωm, Glas über $10^{10}$ Ωm. Die Spanne über viele Größenordnungen ist der Grund, warum man von Leitern, Halbleitern und Isolatoren spricht.

Bei Metallen steigt ρ mit der Temperatur, weil die Gitterschwingungen die Elektronen stärker streuen (Kaltleiter, PTC). Bei Halbleitern ist es umgekehrt: Mit der Temperatur werden mehr Ladungsträger frei, und der Widerstand sinkt (Heißleiter, NTC). Das nutzt man für Temperatursensoren.

### Kondensator

Ein Kondensator besteht aus zwei leitenden Flächen, getrennt durch einen Isolator. Legt man eine Spannung an, sammelt sich auf der einen Platte positive, auf der anderen gleich viel negative Ladung. Die **Kapazität** $C$ sagt, wie viel Ladung pro Volt hineinpasst:

$$
Q = C\cdot U \qquad\qquad C_{\text{Platte}} = \varepsilon_0\,\varepsilon_r\,\frac{A}{d}
$$

Große Fläche, kleiner Abstand und ein Isolator mit hoher Permittivität $\varepsilon_r$ ergeben große Kapazität. Ein Detektorpixel ist selbst ein kleiner Plattenkondensator: Bei 0,2 × 0,2 mm² Fläche, 1,6 mm CdTe ($\varepsilon_r \approx 11$) sind das nur etwa 2,4 fF.

::: widget et-06-plattenkondensator

#### Strom und Spannung am Kondensator

Leitet man $Q = CU$ nach der Zeit ab, bekommt man die Beziehung, die man für Schaltungen braucht:

$$
I = C\,\frac{\mathrm dU}{\mathrm dt} \qquad\Longleftrightarrow\qquad U = \frac{1}{C}\int I\,\mathrm dt
$$

- Ein Kondensator lässt Strom nur fließen, solange sich seine Spannung ändert. Bei Gleichspannung sperrt er, sobald er geladen ist.
- Seine Spannung kann nicht springen, denn dafür bräuchte es einen unendlich großen Strom. Deshalb glättet er.
- Er integriert den Strom: Die Spannung ist die bisher hineingeflossene Ladung geteilt durch $C$. Das ist der Kern des ladungsempfindlichen Verstärkers.
- Gespeicherte Energie: $W = \tfrac12 C U^2$.

### Spule

Eine Spule ist ein aufgewickelter Draht. Fließt Strom hindurch, entsteht in ihrem Inneren ein Magnetfeld. Ändert sich der Strom, ändert sich das Feld, und die Spule induziert in sich selbst eine Spannung, die der Änderung entgegenwirkt (**Selbstinduktion**, Abschnitt 4). Die **Induktivität** $L$ beschreibt, wie stark. Für eine lange Zylinderspule gilt:

$$
L = \mu_0\,\mu_r\,\frac{N^2 A}{l} \qquad\qquad U = L\,\frac{\mathrm dI}{\mathrm dt} \qquad\qquad W = \tfrac12 L I^2
$$

Die Induktivität wächst mit dem Quadrat der Windungszahl, und ein Eisen- oder Ferritkern mit großem $\mu_r$ vervielfacht sie.

- Der Strom durch eine Spule kann nicht springen. Versucht man ihn schlagartig abzuschalten, erzeugt sie eine hohe Spannungsspitze. Deshalb liegt parallel zu Relaisspulen eine Freilaufdiode.
- Mit einem Widerstand zusammen entsteht ein RL-Glied mit der Zeitkonstante $\tau = L/R$. Es verhält sich spiegelbildlich zum RC-Glied: Der Strom steigt exponentiell an.
- Zwei Spulen auf einem gemeinsamen Kern bilden einen Transformator. Das Spannungsverhältnis entspricht dem Windungsverhältnis, $U_2/U_1 = N_2/N_1$. Hochspannungsgeneratoren für Röntgenröhren beruhen darauf.

In der Detektor-Elektronik selbst spielen Spulen kaum eine Rolle. Wichtig sind sie in Netzteilen, Transformatoren und als ungewollte (parasitäre) Induktivität langer Leitungen, die schnelle Signale verformt.

> [!abstract] Merke
> - Widerstand: $U = RI$, wandelt Energie in Wärme. $R = \rho l/A$.
> - Kondensator: $I = C\,\mathrm dU/\mathrm dt$, Spannung kann nicht springen, sperrt Gleichstrom.
> - Spule: $U = L\,\mathrm dI/\mathrm dt$, Strom kann nicht springen, sperrt hohe Frequenzen.

## Halbleiter: von der Dotierung zum Transistor {#halbleiter toc="Halbleiter, Diode, Transistor"}

Dioden, Transistoren, Solarzellen und die Sensoren von Röntgendetektoren beruhen alle auf demselben Prinzip: Man steuert gezielt, wie viele bewegliche Ladungsträger es in einem Halbleiter gibt und wo.

### Leiter, Halbleiter, Isolator

Im Kristall können Elektronen nur Energien in bestimmten Bändern haben. Im **Valenzband** sind sie in den Bindungen festgehalten, im **Leitungsband** frei beweglich. Dazwischen liegt die **Bandlücke** $E_g$. Bei Metallen überlappen die Bänder, es gibt immer freie Elektronen. Bei Isolatoren ist die Lücke so groß (über 5 eV), dass praktisch kein Elektron hinüberkommt. Halbleiter liegen dazwischen: Silizium hat 1,12 eV, Germanium 0,66 eV, CdTe 1,44 eV. Eine Skizze dazu steht in Baustein 4 der Seite [„Vom Photon zum Bild“](../physik/roentgen.html#halbleiter).

### Eigenleitung

Silizium hat vier Valenzelektronen, jedes Atom ist mit vier Nachbarn verbunden. Durch die Wärmebewegung reißt gelegentlich ein Elektron aus seiner Bindung und wird frei. Zurück bleibt ein **Loch**, eine fehlende Bindung, die sich wie eine positive Ladung verhält: Ein Nachbarelektron kann in die Lücke springen, wodurch das Loch weiterwandert. Elektronen und Löcher entstehen immer paarweise.

Die Dichte dieser Paare heißt **Eigenleitungsdichte** $n_i$. In Silizium bei Raumtemperatur ist $n_i \approx 10^{10}\ \text{cm}^{-3}$, bei etwa $5\cdot10^{22}$ Atomen pro cm³ also nur ein freies Elektron auf rund $10^{12}$ Atome. Sie steigt stark mit der Temperatur, ungefähr wie $e^{-E_g/2kT}$. Deshalb rauschen Detektoren mit kleiner Bandlücke stärker und werden gekühlt (Germanium-Detektoren mit flüssigem Stickstoff).

### Dotierung

Reines Silizium leitet schlecht. Baut man gezielt Fremdatome ein, ändert sich das um viele Größenordnungen, schon ein Fremdatom auf eine Million Siliziumatome reicht:

::: widget et-07-dotierung-im-siliziumgitter-vereinfacht

- **n-dotiert** (Phosphor, Arsen, 5 Valenzelektronen): Jedes Fremdatom spendet ein freies Elektron (**Donator**). Elektronen sind die **Majoritätsträger**, Löcher die Minoritätsträger. Das Atom selbst bleibt als ortsfestes positives Ion zurück.
- **p-dotiert** (Bor, Gallium, 3 Valenzelektronen): Jedem Fremdatom fehlt ein Elektron, es nimmt eines aus der Umgebung auf (**Akzeptor**) und hinterlässt ein Loch. Löcher sind die Majoritätsträger. Das Atom bleibt als negatives Ion zurück.

Wichtig: Ein dotierter Halbleiter ist insgesamt elektrisch neutral. Zu jedem freien Elektron gehört ein positives Ion, zu jedem Loch ein negatives. Erst wenn man die beweglichen Träger wegschiebt, bleiben die Ionen als Ladung übrig.

### Der pn-Übergang

Bringt man ein p- und ein n-Gebiet in Kontakt, wandern Elektronen aus dem n-Gebiet ins p-Gebiet und Löcher umgekehrt, einfach weil auf der anderen Seite weniger davon sind (**Diffusion**). An der Grenze treffen sie sich und rekombinieren. Zurück bleibt eine Zone ohne freie Ladungsträger, die **Raumladungszone** oder Verarmungszone. In ihr sitzen nur noch die ortsfesten Ionen: negative auf der p-Seite, positive auf der n-Seite.

Diese Ionen erzeugen ein elektrisches Feld, das weitere Diffusion bremst. Es stellt sich ein Gleichgewicht mit einer eingebauten Spannung, der **Diffusionsspannung** $U_D$, ein (in Silizium etwa 0,6–0,8 V). Die Breite der Zone hängt von der Dotierung und der angelegten Spannung ab:

$$
w = \sqrt{\frac{2\varepsilon}{e}\,\frac{N_A + N_D}{N_A N_D}\,\big(U_D - U\big)}
$$

::: widget et-08-pn-uebergang

- **Sperrrichtung** (Plus an n, Minus an p, $U < 0$): Die Spannung zieht die freien Träger noch weiter von der Grenze weg. Die Zone wird breiter, es fließt nur ein winziger Sperrstrom aus thermisch erzeugten Paaren.
- **Durchlassrichtung** ($U > 0$): Die Spannung schiebt die Träger in die Zone hinein. Nähert sich $U$ der Diffusionsspannung, verschwindet die Barriere, und der Strom steigt exponentiell.

Für Strahlungsdetektoren ist die Sperrrichtung entscheidend: Die Raumladungszone ist ein Volumen ohne freie Ladungsträger, aber mit starkem Feld. Ein Photon, das dort Elektron-Loch-Paare erzeugt, liefert ein sauberes Signal, weil das Feld die Paare sofort trennt. Siliziumsensoren sind großflächige, schwach dotierte Dioden, die mit hoher Sperrspannung über die ganze Dicke **voll verarmt** werden. Schwache Dotierung ist dafür wichtig, wie die Simulation zeigt.

### Dioden

Eine Diode ist ein pn-Übergang mit zwei Anschlüssen. Ihre Kennlinie folgt der Shockley-Gleichung:

$$
I = I_S\left(e^{U/(n\,U_T)} - 1\right), \qquad U_T = \frac{kT}{e} \approx 26\ \mathrm{mV}\ \text{bei Raumtemperatur}
$$

| Typ | Besonderheit | Einsatz |
|---|---|---|
| Gleichrichterdiode | Si-pn-Übergang, Durchlass ab ca. 0,7 V | Netzteile, Schutz gegen Verpolung |
| Schottky-Diode | Metall-Halbleiter-Kontakt statt pn, ca. 0,2–0,4 V, sehr schnell | schnelle Schaltungen; auch Kontakte von CdTe-Sensoren |
| Z-Diode | bricht in Sperrrichtung bei definierter Spannung kontrolliert durch | Spannungsstabilisierung, Überspannungsschutz |
| Leuchtdiode (LED) | Rekombination sendet Licht aus, Farbe hängt von der Bandlücke ab | Beleuchtung, Anzeigen |
| Photodiode | in Sperrrichtung, Licht erzeugt Paare in der Raumladungszone | Lichtsensoren; unter dem Szintillator eines Flachdetektors |
| Detektordiode | großvolumig, voll verarmt, hohe Sperrspannung | Röntgen- und Teilchendetektoren (Si, CdTe als Schottky) |

### Transistoren

Ein Transistor hat drei Anschlüsse. Mit einem kleinen Signal am Steueranschluss steuert er einen großen Strom zwischen den beiden anderen. Er kann damit **schalten** (voll an oder aus) und **verstärken** (Zwischenwerte proportional zum Steuersignal). Es gibt zwei Grundtypen:

- **Bipolartransistor (BJT)**: zwei pn-Übergänge hintereinander (npn oder pnp). Ein kleiner Basisstrom $I_B$ steuert einen großen Kollektorstrom $I_C = B\cdot I_B$, mit der Stromverstärkung $B$ von typisch 100 bis 500. Die Basis-Emitter-Strecke verhält sich wie eine Diode, also etwa 0,7 V.
- **MOSFET**: Das Gate ist durch eine dünne Oxidschicht isoliert. Die Gate-Spannung $U_{GS}$ zieht Ladungsträger an die Oberfläche und bildet dort einen leitenden Kanal. Es fließt kein Gatestrom, gesteuert wird allein durch Spannung. MOSFETs sind die Bausteine praktisch aller integrierten Schaltungen, auch der Pixel-ASICs von Detektoren.

Beim MOSFET unterscheidet man zwei Arbeitsbereiche. Im **linearen Bereich** (kleines $U_{DS}$) wirkt der Kanal wie ein Widerstand, dessen Wert die Gate-Spannung einstellt. So baut man auf Chips Schalter und einstellbare Widerstände, etwa den Entladepfad eines ladungsempfindlichen Verstärkers. Im **Sättigungsbereich** hängt der Strom fast nur noch von $U_{GS}$ ab, der Transistor ist eine steuerbare Stromquelle und damit die Grundlage jedes Verstärkers.

$$
I_D = k\left[(U_{GS}-U_{th})\,U_{DS} - \tfrac12 U_{DS}^2\right] \ \text{(linear)}, \qquad I_D = \tfrac{k}{2}\,(U_{GS}-U_{th})^2 \ \text{(Sättigung)}
$$

::: widget et-09-kennlinien

|  | Bipolartransistor | MOSFET |
|---|---|---|
| Steuergröße | Basisstrom $I_B$ | Gate-Spannung $U_{GS}$ |
| Steuerleistung | braucht dauernd Basisstrom | praktisch keine (isoliertes Gate) |
| Stärken | rauscharm bei niedriger Impedanz, hohe Steilheit | winzig, sparsam, ideal für Chips und Schalter |
| typisch in | diskreten Verstärkern, Analogtechnik | integrierten Schaltungen, Leistungsschaltern, ASICs |

> [!abstract] Merke
> - Dotierung: n = zusätzliche Elektronen (Donatoren), p = Löcher (Akzeptoren). Insgesamt bleibt der Halbleiter neutral.
> - pn-Übergang: Raumladungszone ohne freie Träger, mit Feld. Sperrrichtung macht sie breiter, Durchlassrichtung baut sie ab.
> - Detektoren nutzen voll verarmte Dioden in Sperrrichtung: Photonen erzeugen dort Paare, das Feld trennt sie.
> - Transistor: kleines Steuersignal steuert großen Strom. BJT stromgesteuert, MOSFET spannungsgesteuert.

## RC-Glied: Laden und Entladen {#rc group="Schaltungen" toc="RC-Glied"}

Schaltet man einen Widerstand und einen Kondensator in Reihe an eine Spannung $U_0$, lädt sich der Kondensator nicht sofort auf. Am Anfang ist er leer, die ganze Spannung liegt am Widerstand, und es fließt der größte Strom. Je voller der Kondensator wird, desto weniger Spannung bleibt für den Widerstand, und der Strom wird kleiner. Das Ergebnis ist ein exponentieller Verlauf:

$$
U_C(t) = U_0\,\big(1 - e^{-t/\tau}\big) \qquad\qquad \tau = R\,C
$$

Die **Zeitkonstante** τ ist die wichtigste Zahl einer RC-Schaltung. Nach einer Zeitkonstante sind 63 % erreicht, nach drei etwa 95 %, nach fünf über 99 %. Beim Entladen über den Widerstand fällt die Spannung entsprechend mit $U_0\,e^{-t/\tau}$. Die Einheit passt: Ω · F = s, praktisch zum Merken ist kΩ · µF = ms und kΩ · fF = ps.

::: widget et-10-rc-glied

Das ist die Brücke zum Pulsformer: Ein CR-Glied mit Abgriff am Widerstand ist ein Hochpass und macht aus einer Stufe einen abklingenden Puls. Ein RC-Glied mit Abgriff am Kondensator ist ein Tiefpass und rundet ihn ab.

> [!abstract] Merke
> - τ = RC. Nach 1τ: 63 %, nach 3τ: 95 %, nach 5τ: über 99 %.
> - Spannung am C: Tiefpass, glättet. Spannung am R: Hochpass, zeigt nur Änderungen.

## Wechselstrom, Impedanz und Filter {#impedanz toc="Impedanz und Filter"}

Bei sinusförmigen Signalen rechnet man am bequemsten mit **komplexen Zahlen**. Eine Schwingung $U(t) = \hat U\cos(\omega t + \varphi)$ wird zum Zeiger $\underline U = \hat U e^{j\varphi}$, der mit der Kreisfrequenz $\omega = 2\pi f$ rotiert. Die Länge des Zeigers ist die Amplitude, sein Winkel die Phase. (In der E-Technik schreibt man $j$ statt $i$, weil $i$ schon für den Strom vergeben ist.)

Der Vorteil: Ableiten wird zu Multiplikation mit $j\omega$, Integrieren zu Division. Damit wird aus jedem Bauelement eine komplexe **Impedanz** $Z = \underline U / \underline I$, mit der man wie mit Widerständen rechnet:

| Bauelement | Impedanz | bei tiefer Frequenz | bei hoher Frequenz | Phase U zu I |
|---|---|---|---|---|
| Widerstand | $Z_R = R$ | R | R | 0° |
| Kondensator | $Z_C = \dfrac{1}{j\omega C}$ | sperrt (∞) | leitet (→ 0) | −90° (Strom eilt vor) |
| Spule | $Z_L = j\omega L$ | leitet (→ 0) | sperrt (∞) | +90° (Spannung eilt vor) |

### Tiefpass und Hochpass

Das RC-Glied aus Abschnitt 8 ist jetzt einfach ein Spannungsteiler aus $R$ und $Z_C$. Abgriff am Kondensator (Tiefpass) und am Widerstand (Hochpass):

$$
H_{\text{TP}} = \frac{Z_C}{R + Z_C} = \frac{1}{1 + j\omega RC} \qquad\qquad H_{\text{HP}} = \frac{R}{R + Z_C} = \frac{j\omega RC}{1 + j\omega RC}
$$

Bei der **Grenzfrequenz** $f_g = 1/(2\pi RC)$ sind Widerstand und Kondensator gleich groß, die Amplitude ist auf $1/\sqrt2 \approx 0{,}71$ gefallen (−3 dB) und die Phase um 45° verschoben. Weit darüber fällt der Tiefpass mit 20 dB pro Dekade: zehnfache Frequenz, zehntel Amplitude.

**Dezibel** sind ein logarithmisches Maß für Verhältnisse. Für Spannungen gilt $\text{dB} = 20\log_{10}(U_2/U_1)$: −3 dB ≈ 0,71, −6 dB ≈ 0,5, −20 dB = 0,1, −40 dB = 0,01. Die Darstellung von Betrag in dB und Phase über der logarithmischen Frequenz heißt **Bode-Diagramm**.

::: widget et-11-bode

> [!abstract] Merke
> - Impedanzen: $Z_R = R$, $Z_C = 1/(j\omega C)$, $Z_L = j\omega L$. Damit rechnet man wie mit Widerständen.
> - RC-Filter: $f_g = 1/(2\pi RC)$, dort −3 dB und 45°. Darüber bzw. darunter 20 dB pro Dekade.

## Operationsverstärker {#opv}

Ein Operationsverstärker (OPV) ist ein Differenzverstärker mit zwei Eingängen (+ und −) und einem Ausgang. Er verstärkt die Spannungsdifferenz zwischen den Eingängen mit einem riesigen Faktor $A$, oft $10^5$ bis $10^6$: $U_a = A\,(U_+ - U_-)$. Allein ist das unbrauchbar, schon ein Mikrovolt Differenz würde ihn in die Begrenzung treiben. Nützlich wird er erst mit **Gegenkopplung**: Ein Teil des Ausgangs wird auf den − Eingang zurückgeführt.

### Die zwei Faustregeln

Mit Gegenkopplung lässt sich fast jede OPV-Schaltung mit zwei Regeln verstehen:

1. **In die Eingänge fließt kein Strom.** Der Eingangswiderstand ist praktisch unendlich.
2. **Der Ausgang stellt sich so ein, dass beide Eingänge dieselbe Spannung haben**, $U_- = U_+$. Grund: Jede Differenz würde mit $A$ verstärkt und über die Gegenkopplung sofort ausgeglichen.

Liegt der + Eingang auf Masse, hält der OPV also auch den − Eingang auf 0 V, obwohl er nicht direkt mit Masse verbunden ist. Das nennt man **virtuelle Masse**.

### Die Grundschaltungen

- **Invertierender Verstärker:** Wegen der virtuellen Masse fließt durch $R_1$ der Strom $U_e/R_1$. Weil nichts in den Eingang fließt, muss er komplett durch $R_2$ weiter. Dafür muss der Ausgang auf $-R_2 \cdot U_e/R_1$ gehen: $U_a = -\tfrac{R_2}{R_1}U_e$.
- **Nichtinvertierender Verstärker:** $U_e$ liegt am + Eingang, $R_1$ und $R_2$ bilden einen Spannungsteiler vom Ausgang zum − Eingang. Der OPV regelt, bis der geteilte Ausgang gleich $U_e$ ist: $U_a = \big(1 + \tfrac{R_2}{R_1}\big)U_e$.
- **Spannungsfolger:** Der Ausgang direkt auf den − Eingang, also $U_a = U_e$. Verstärkt nicht, belastet aber die Quelle nicht und kann trotzdem Strom liefern (Impedanzwandler, vgl. Abb. 1 mit Last).
- **Integrator:** Wie der invertierende Verstärker, aber mit Kondensator statt $R_2$. Der Strom $U_e/R$ lädt den Kondensator, also $U_a = -\tfrac{1}{RC}\int U_e\,\mathrm dt$. Ersetzt man $R$ und $U_e$ durch eine Stromquelle, den Sensor, ist das genau der **ladungsempfindliche Verstärker**: $U_a = -Q/C_f$.

::: widget et-12-operationsverstaerker

> [!abstract] Merke
> - Mit Gegenkopplung: kein Eingangsstrom, und der OPV macht $U_- = U_+$.
> - Invertierend $-R_2/R_1$, nichtinvertierend $1 + R_2/R_1$, Folger 1, Integrator $-\frac{1}{RC}\int$.
> - Der CSA ist ein Integrator mit Stromquelle am Eingang.

## Rauschen {#rauschen}

Jede reale Schaltung rauscht: Das Signal ist von zufälligen Schwankungen überlagert. Drei Quellen sollte man kennen.

<ul class="tight">
<li><strong>Thermisches Rauschen</strong> (Johnson-Nyquist): Die Elektronen in jedem Widerstand bewegen sich wegen ihrer Temperatur zufällig. Das erzeugt eine Rauschspannung, die nur von \(R\), \(T\) und der betrachteten Bandbreite \(B\) abhängt:
          <div class="eq">$$u_{n,\text{rms}} = \sqrt{4\,k\,T\,R\,B}$$</div></li>
<li><strong>Schrotrauschen:</strong> Strom besteht aus einzelnen Ladungen, die zufällig ankommen, ähnlich wie Photonen. Ein Gleichstrom \(I\) schwankt deshalb um
          <div class="eq">$$i_{n,\text{rms}} = \sqrt{2\,e\,I\,B}$$</div>
          Bei Detektoren ist das der Leckstrom des Sensors: Er ist das Parallelrauschen aus der ENC-Formel.</li>
<li><strong>1/f-Rauschen:</strong> Schwankungen, die zu tiefen Frequenzen hin zunehmen, vor allem in Transistoren. Es dominiert bei langen Messzeiten.</li>
</ul>

Thermisches und Schrotrauschen sind **weiß**: gleich stark bei allen Frequenzen. Ihre Leistung wächst deshalb linear mit der Bandbreite, die Amplitude mit $\sqrt B$. Darum gibt man Rauschen oft als **Rauschdichte** in nV/√Hz an. Und darum verringert jeder Filter, der die Bandbreite begrenzt, das Rauschen. Genau das macht der Pulsformer, und genau deshalb rauscht ein schneller Pulsformer stärker als ein langsamer.

Unabhängige Rauschquellen addieren sich **quadratisch**: $u_{\text{ges}} = \sqrt{u_1^2 + u_2^2 + \dots}$. Die größte Quelle dominiert schnell. Das **Signal-Rausch-Verhältnis** gibt man oft in dB an: $\text{SNR} = 20\log_{10}(U_{\text{Signal}}/u_{n,\text{rms}})$.

::: widget et-13-rauschen

> [!abstract] Merke
> - Thermisch $\sqrt{4kTRB}$, Schrot $\sqrt{2eIB}$. Beide weiß, Amplitude wächst mit $\sqrt B$.
> - Rauschquellen addieren sich quadratisch. Bandbreite begrenzen heißt Rauschen begrenzen.

## Formeln und Konstanten {#formeln appendix="A" eyebrow="Anhang"}

| Konstante | Symbol | Wert |
|---|---|---:|
| Elementarladung | $e$ | 1,602·10⁻¹⁹ C |
| Elektrische Feldkonstante | $\varepsilon_0$ | 8,854·10⁻¹² F/m |
| Magnetische Feldkonstante | $\mu_0$ | 1,257·10⁻⁶ H/m |
| Lichtgeschwindigkeit | $c$ | 2,998·10⁸ m/s |
| Boltzmann-Konstante | $k$ | 1,381·10⁻²³ J/K |
| Elektronenmasse | $m_e$ | 9,109·10⁻³¹ kg |
| Thermische Spannung bei 300 K | $U_T = kT/e$ | 25,9 mV |

| Thema | Formel |
|---|---|
| Strom, Ohm, Leistung | $I = \mathrm dQ/\mathrm dt$, $U = RI$, $P = UI$ |
| Reihe / parallel (R) | $R = R_1 + R_2$ / $1/R = 1/R_1 + 1/R_2$ |
| Spannungsteiler | $U_2 = U\,R_2/(R_1+R_2)$ |
| Coulomb, Feld | $F = Q_1Q_2/(4\pi\varepsilon_0 r^2)$, $\vec F = q\vec E$, $E = U/d$ |
| Kondensator | $Q = CU$, $C = \varepsilon_0\varepsilon_r A/d$, $I = C\,\mathrm dU/\mathrm dt$, $W = \tfrac12 CU^2$ |
| Magnetfeld, Lorentzkraft | $B = \mu_0 I/(2\pi r)$, $\vec F = q(\vec E + \vec v\times\vec B)$, $r = mv/(qB)$ |
| Induktion, Spule | $U = -N\,\mathrm d\Phi/\mathrm dt$, $U = L\,\mathrm dI/\mathrm dt$, $W = \tfrac12 LI^2$ |
| RC-Glied | $\tau = RC$, $U_C = U_0(1 - e^{-t/\tau})$ |
| Impedanzen | $Z_R = R$, $Z_C = 1/(j\omega C)$, $Z_L = j\omega L$ |
| RC-Filter | $f_g = 1/(2\pi RC)$, $H_{\text{TP}} = 1/(1 + j\omega RC)$ |
| Dezibel (Spannung) | $20\log_{10}(U_2/U_1)$: −3 dB ≈ 0,71, −20 dB = 0,1 |
| Diode | $I = I_S(e^{U/nU_T} - 1)$ |
| OPV | invertierend $-R_2/R_1$, nichtinvertierend $1 + R_2/R_1$, Integrator $-\frac{1}{RC}\int U_e\,\mathrm dt$ |
| Rauschen | $\sqrt{4kTRB}$, $\sqrt{2eIB}$, quadratisch addieren |

Weiter zu [„Vom Photon zum Bild“](../physik/roentgen.html#signal), dort zeigt Baustein 6 den ladungsempfindlichen Verstärker und den Pulsformer im Detail.
