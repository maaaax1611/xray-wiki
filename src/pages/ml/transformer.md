---
title: Transformer
category: ml
eyebrow: Machine Learning · Architekturen
footer: Alle Abbildungen rechnen mit kleinen, von Hand gewählten Zahlen im Browser. Sie zeigen die Mechanik, nicht das Verhalten trainierter Modelle. Code-Schnipsel in PyTorch, auf das Wesentliche gekürzt.
---

Wie ein Transformer aus einer Folge von Tokens eine Folge von Vektoren macht, die jedes Token im Kontext aller anderen beschreibt. Von Tokenisierung und Embeddings über Attention und den Aufbau eines Blocks bis zu Training, Rechenaufwand und den Techniken, mit denen man große Modelle effizient betreibt und anpasst.

## Sequenzen verarbeiten {#sequenzen group="Grundidee"}

Text, Audio oder Zeitreihen sind **Sequenzen**: Die Bedeutung eines Elements hängt von den anderen ab. In „Die Bank am Fluss“ und „Die Bank gibt Kredite“ ist das Wort „Bank“ dasselbe, gemeint ist etwas anderes. Ein Modell muss also für jedes Element Information aus dem Rest der Folge einsammeln.

Vor dem Transformer übernahmen das **rekurrente Netze** (RNN, LSTM). Sie lesen die Folge Element für Element und tragen einen Zustandsvektor mit, der alles Bisherige zusammenfassen soll. Das hat drei Nachteile:

- **Sequenziell:** Schritt $t$ braucht das Ergebnis von Schritt $t-1$. Auf einer GPU, die tausende Operationen parallel ausführen will, ist das langsam.
- **Flaschenhals:** Alles Frühere muss durch einen Vektor fester Größe. Was am Anfang eines langen Textes stand, ist am Ende oft verblasst.
- **Lange Wege:** Information von Position 1 nach Position 100 läuft durch 99 Schritte. Beim Training müssen Gradienten denselben Weg zurück, sie werden dabei leicht sehr klein oder sehr groß.

Der **Transformer** (Vaswani et al., „Attention Is All You Need“, 2017) verzichtet auf die Rekurrenz. Jedes Element schaut in einem einzigen Schritt direkt auf alle anderen und entscheidet selbst, welche für es wichtig sind. Dieser Mechanismus heißt **Attention**. Der Weg zwischen zwei beliebigen Positionen ist damit immer genau ein Schritt lang, und alle Positionen werden gleichzeitig berechnet. Der Preis: Jede Position vergleicht sich mit jeder anderen, der Aufwand wächst quadratisch mit der Länge der Folge (Abschnitt 11).

## Tokenisierung {#tokenisierung toc="Tokenisierung (BPE)"}

Ein Modell rechnet mit Zahlen, nicht mit Buchstaben. Der erste Schritt zerlegt Text deshalb in **Tokens** aus einem festen **Vokabular** und ersetzt jedes Token durch seine Nummer, die **Token-ID**.

Die naheliegenden Extreme funktionieren beide schlecht. Ganze Wörter als Tokens ergeben ein riesiges Vokabular, und jedes neue Wort, jeder Tippfehler und jede Flexion („Katzen“, „Kätzchen“) ist unbekannt. Einzelne Zeichen als Tokens kennen zwar alles, machen die Folgen aber sehr lang, und das Modell muss erst mühsam lernen, welche Zeichen zusammengehören.

**Byte Pair Encoding** (BPE, für Sprachmodelle eingeführt von Sennrich et al., 2016) liegt dazwischen. Man startet mit einzelnen Zeichen und verschmilzt wiederholt das **häufigste benachbarte Paar** im Trainingstext zu einem neuen Token, bis das Vokabular die gewünschte Größe hat. Häufige Wörter werden so zu einem einzigen Token, seltene zerfallen in bekannte Teile.

::: widget tr-01-bpe

In der Praxis arbeitet man auf **Bytes** statt auf Zeichen (byte-level BPE, z. B. bei GPT-2). Damit lässt sich jeder beliebige Text darstellen, es gibt keine unbekannten Zeichen. Typische Vokabulare haben 30 000 bis 200 000 Tokens. Ein Token entspricht bei englischem Text im Mittel etwa vier Zeichen, bei Deutsch oder Code meist etwas weniger.

Die Tokenisierung erklärt manche Eigenheiten von Sprachmodellen: Ein Wort, das in drei Tokens zerfällt, „sieht“ das Modell nie als Ganzes, und Aufgaben wie Buchstaben zählen oder Zahlen addieren werden schwer, wenn „12345“ als „123“ + „45“ ankommt.

> [!abstract] Merke
> - Text → Tokens → Token-IDs. Das Vokabular ist fest und wird vor dem Modell gelernt.
> - BPE verschmilzt wiederholt das häufigste Paar: häufige Wörter ein Token, seltene mehrere.

## Embeddings {#embeddings}

Jede Token-ID wird über eine Tabelle auf einen Vektor der Länge $d_\text{model}$ abgebildet, das **Embedding**. Die Tabelle ist eine Matrix $E \in \mathbb R^{V \times d_\text{model}}$ mit einer Zeile pro Token im Vokabular. Sie wird mit dem Rest des Modells trainiert. Aus einer Folge von $n$ Tokens wird so eine Matrix $X \in \mathbb R^{n \times d_\text{model}}$: eine Zeile pro Position.

Nach dem Training liegen Tokens mit ähnlicher Bedeutung oder ähnlicher Rolle nah beieinander. Als Maß für Ähnlichkeit dient das Skalarprodukt oder die Kosinus-Ähnlichkeit (siehe [Lineare Algebra](../grundlagen/lineare-algebra.html#vektoren)). Richtungen im Raum tragen dabei oft Bedeutung, etwa Singular gegenüber Plural.

::: widget tr-02-embeddings

Ein einzelnes Embedding beschreibt das Token aber noch **ohne Kontext**: „Bank“ hat in beiden Beispielsätzen aus Abschnitt 1 denselben Vektor. Die Aufgabe der Transformer-Blöcke ist es, diese Vektoren Schicht für Schicht so umzurechnen, dass jeder am Ende die Bedeutung des Tokens *in diesem Satz* beschreibt.

> [!abstract] Merke
> - Embedding = Zeile einer gelernten Tabelle $E \in \mathbb R^{V\times d_\text{model}}$.
> - Eingabe des Modells: $X \in \mathbb R^{n\times d_\text{model}}$, eine Zeile pro Token, noch ohne Kontext.

## Attention als gewichteter Mittelwert {#attention group="Attention" toc="Attention"}

Die Grundidee von Attention ist einfach: Der neue Vektor für Position $i$ ist ein **gewichteter Mittelwert** der Vektoren aller Positionen. Die Gewichte geben an, wie relevant Position $j$ für Position $i$ ist:

$$
\mathbf y_i = \sum_{j=1}^{n} a_{ij}\,\mathbf v_j, \qquad a_{ij} \ge 0, \quad \sum_j a_{ij} = 1
$$

Die Gewichte kommen aus Ähnlichkeitswerten $s_{ij}$, die durch die **Softmax** in eine Wahrscheinlichkeitsverteilung verwandelt werden:

$$
a_{ij} = \operatorname{softmax}_j(s_{ij}) = \frac{e^{s_{ij}}}{\sum_{k} e^{s_{ik}}}
$$

Die Softmax macht alle Werte positiv, normiert sie auf Summe 1 und verstärkt Unterschiede: Ein Wert, der um 2 größer ist als ein anderer, bekommt das $e^2 \approx 7{,}4$-fache Gewicht. Teilt man die Werte vorher durch eine **Temperatur** $T$, wird die Verteilung bei kleinem $T$ spitzer (fast nur das Maximum zählt) und bei großem $T$ flacher (alle zählen gleich).

::: widget tr-03-attention-ein-token

Wichtig ist, was hier *nicht* gelernt wird: Die Gewichte $a_{ij}$ sind keine Parameter, sondern werden für jede Eingabe neu aus den Daten berechnet. Dasselbe Modell achtet in jedem Satz auf andere Stellen.

## Query, Key, Value {#qkv toc="Query, Key, Value"}

Woher kommen die Ähnlichkeitswerte? Man könnte einfach $s_{ij} = \mathbf x_i^\top\mathbf x_j$ nehmen. Dann wäre aber jedes Token sich selbst am ähnlichsten, und die Frage „was suche ich?“ wäre dieselbe wie „was biete ich an?“. Attention trennt diese Rollen über drei gelernte Projektionen:

- **Query** $\mathbf q_i = W_Q\mathbf x_i$: wonach Position $i$ sucht.
- **Key** $\mathbf k_j = W_K\mathbf x_j$: wofür Position $j$ gefunden werden will.
- **Value** $\mathbf v_j = W_V\mathbf x_j$: was Position $j$ weitergibt, wenn sie gefunden wird.

Der Vergleich ist das Skalarprodukt von Query und Key. Für alle Positionen gleichzeitig, mit $Q = XW_Q$, $K = XW_K$, $V = XW_V$ als Matrizen mit einer Zeile pro Token (hier in der in Code üblichen Zeilen-Schreibweise), ergibt das die **Scaled Dot-Product Attention**:

$$
\operatorname{Attention}(Q, K, V) = \operatorname{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

$QK^\top$ ist eine $n\times n$-Matrix aller Ähnlichkeiten, die Softmax läuft zeilenweise, und das Produkt mit $V$ bildet die gewichteten Mittelwerte. $d_k$ ist die Länge der Query- und Key-Vektoren.

::: widget tr-04-attention-matrizen

### Warum durch $\sqrt{d_k}$ teilen?

Haben die Komponenten von $\mathbf q$ und $\mathbf k$ Mittelwert 0 und Varianz 1 und sind unabhängig, dann hat ihr Skalarprodukt die Varianz $d_k$. Bei $d_k = 64$ streuen die Werte also mit einer Standardabweichung von 8. Die Softmax solcher Werte ist fast immer eine harte Auswahl: Ein Eintrag bekommt nahezu das ganze Gewicht, alle anderen fast nichts. Dann sind auch die Gradienten der übrigen Einträge praktisch null, und das Training kommt kaum voran. Die Division durch $\sqrt{d_k}$ bringt die Varianz zurück auf 1, unabhängig von der Dimension.

::: widget tr-05-skalierung

### In Code

```python
import torch, math

def attention(Q, K, V, mask=None):
    # Q, K: (..., n, d_k), V: (..., n, d_v)
    scores = Q @ K.transpose(-2, -1) / math.sqrt(Q.size(-1))  # (..., n, n)
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float("-inf"))
    weights = scores.softmax(dim=-1)                           # Zeilen summieren zu 1
    return weights @ V, weights
```

In PyTorch gibt es dieselbe Rechnung fertig und deutlich schneller als `torch.nn.functional.scaled_dot_product_attention` (siehe Flash Attention in Abschnitt 12).

> [!abstract] Merke
> - Query fragt, Key wird gefunden, Value wird weitergegeben. Alle drei sind lineare Projektionen derselben Eingabe.
> - $\operatorname{softmax}(QK^\top/\sqrt{d_k})\,V$: Ähnlichkeiten, zeilenweise normiert, gewichteter Mittelwert.
> - $\sqrt{d_k}$ hält die Streuung der Werte bei 1, damit die Softmax nicht sättigt.

## Multi-Head Attention {#multihead}

Eine einzelne Attention mischt pro Position genau eine Verteilung von Gewichten. Sprache hat aber viele Beziehungen gleichzeitig: welches Wort grammatisch zu welchem gehört, worauf sich ein Pronomen bezieht, was direkt davor steht. **Multi-Head Attention** rechnet deshalb $h$ Attentions parallel, jede mit eigenen Projektionen und in einem kleineren Raum der Größe $d_k = d_\text{model}/h$:

$$
\text{head}_i = \operatorname{Attention}(XW_Q^{(i)}, XW_K^{(i)}, XW_V^{(i)}), \qquad \operatorname{MHA}(X) = \operatorname{concat}(\text{head}_1, \dots, \text{head}_h)\,W_O
$$

Die Ergebnisse der Köpfe werden aneinandergehängt und mit $W_O$ zurück auf $d_\text{model}$ projiziert. Weil jeder Kopf nur $d_\text{model}/h$ Dimensionen hat, kostet Multi-Head Attention ungefähr so viel wie eine einzelne Attention in voller Breite. Im ursprünglichen Transformer sind es $h = 8$ Köpfe mit $d_k = 64$ bei $d_\text{model} = 512$.

::: widget tr-06-multi-head

Welche Muster die Köpfe eines trainierten Modells lernen, ist nicht vorgegeben. Man findet oft Köpfe, die auf das vorige Token achten, solche, die grammatische Beziehungen abbilden, und viele, deren Muster sich schwer deuten lässt. Die Köpfe in der Abbildung sind von Hand konstruiert, um die Idee zu zeigen.

```python
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        self.h, self.d_k = n_heads, d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)   # W_Q, W_K, W_V in einer Matrix
        self.out = nn.Linear(d_model, d_model)       # W_O

    def forward(self, x, mask=None):                 # x: (batch, n, d_model)
        b, n, _ = x.shape
        q, k, v = self.qkv(x).view(b, n, 3, self.h, self.d_k).permute(2, 0, 3, 1, 4)
        y, _ = attention(q, k, v, mask)              # (batch, h, n, d_k)
        return self.out(y.transpose(1, 2).reshape(b, n, -1))
```

## Positionskodierung {#position}

Attention ist **permutationsinvariant**: Vertauscht man zwei Tokens der Eingabe, vertauschen sich nur die entsprechenden Zeilen der Ausgabe. „Hund beißt Mann“ und „Mann beißt Hund“ wären für das Modell dieselbe Menge von Wörtern. Die Reihenfolge muss deshalb ausdrücklich hinzugefügt werden.

Der ursprüngliche Transformer addiert zu jedem Embedding einen festen Vektor, der nur von der Position $p$ abhängt. Seine Komponenten sind Sinus- und Kosinusschwingungen mit geometrisch abgestuften Wellenlängen:

$$
PE_{p,\,2i} = \sin\!\left(\frac{p}{10000^{2i/d_\text{model}}}\right), \qquad PE_{p,\,2i+1} = \cos\!\left(\frac{p}{10000^{2i/d_\text{model}}}\right)
$$

Die vorderen Dimensionen schwingen schnell und unterscheiden benachbarte Positionen, die hinteren schwingen langsam und unterscheiden weit entfernte. Jedes Sinus-Kosinus-Paar ist ein Zeiger, der sich mit der Position dreht. Der Vektor für Position $p + k$ entsteht deshalb aus dem für Position $p$ durch eine feste Drehung, die nur von $k$ abhängt. Das Skalarprodukt zweier Positionskodierungen hängt nur vom Abstand ab.

::: widget tr-07-positionskodierung

Später setzten sich zwei Alternativen durch:

- **Gelernte Positions-Embeddings** (BERT, GPT-2): eine zweite Tabelle mit einer Zeile pro Position. Einfach, aber auf die beim Training gesehene Länge beschränkt.
- **Rotary Position Embedding** (RoPE, Su et al., 2021): Statt etwas zu addieren, dreht man Query und Key paarweise um einen Winkel proportional zur Position. Im Skalarprodukt $\mathbf q_i^\top\mathbf k_j$ bleibt dann nur die Differenz $i - j$ übrig, die Attention sieht direkt den **relativen** Abstand. RoPE ist heute in den meisten großen Sprachmodellen Standard.

```python
def sinusoidal_pe(n, d_model):
    pos = torch.arange(n).unsqueeze(1)                         # (n, 1)
    freq = 10000 ** (-torch.arange(0, d_model, 2) / d_model)   # (d_model/2,)
    pe = torch.zeros(n, d_model)
    pe[:, 0::2], pe[:, 1::2] = torch.sin(pos * freq), torch.cos(pos * freq)
    return pe
```

> [!abstract] Merke
> - Ohne Positionsinformation sieht Attention nur eine Menge, keine Reihenfolge.
> - Sinus-Kodierung: feste Schwingungen, Abstand entspricht einer Drehung. RoPE dreht Query und Key und macht Attention direkt relativ.

## Der Transformer-Block {#block group="Architektur"}

Ein Transformer besteht aus $N$ gleich aufgebauten **Blöcken** hintereinander, im Original $N = 6$. Jeder Block hat zwei Teilschichten:

1. **Multi-Head Attention:** Die Positionen tauschen Information aus.
2. **Feed-Forward-Netz (FFN):** Jede Position wird für sich durch ein kleines zweischichtiges Netz geschickt, $\operatorname{FFN}(\mathbf x) = W_2\,\phi(W_1\mathbf x + \mathbf b_1) + \mathbf b_2$, mit einer Zwischenschicht der Breite $d_\text{ff}$, meist $4\,d_\text{model}$. $\phi$ ist ReLU im Original, später meist GELU oder SwiGLU.

Attention verteilt Information zwischen den Positionen, das FFN verarbeitet sie an jeder Position. Etwa zwei Drittel der Parameter eines Blocks stecken im FFN.

Um jede Teilschicht liegen zwei Hilfsmittel, ohne die tiefe Transformer nicht trainierbar wären:

- **Residualverbindung:** Die Teilschicht berechnet nur eine Änderung, die zur Eingabe addiert wird, $\mathbf x \leftarrow \mathbf x + f(\mathbf x)$. Gradienten können über diese Abkürzungen ungehindert durch alle Schichten fließen. Man spricht vom **Residual Stream**, in den jede Schicht schreibt und aus dem jede liest.
- **LayerNorm:** normiert jeden Vektor auf Mittelwert 0 und Varianz 1 über seine $d_\text{model}$ Komponenten und skaliert danach mit gelernten Faktoren. Das hält die Größenordnungen über viele Schichten stabil.

Der ursprüngliche Transformer normiert *nach* der Addition (**Post-LN**): $\mathbf x \leftarrow \operatorname{LN}(\mathbf x + f(\mathbf x))$. Fast alle neueren Modelle normieren *vorher* (**Pre-LN**): $\mathbf x \leftarrow \mathbf x + f(\operatorname{LN}(\mathbf x))$. Pre-LN trainiert deutlich stabiler, weil der Residual Stream selbst nie normiert wird und Gradienten ungeschwächt durchlaufen.

::: widget tr-08-block

```python
class Block(nn.Module):  # Pre-LN
    def __init__(self, d_model, n_heads, d_ff):
        super().__init__()
        self.ln1, self.ln2 = nn.LayerNorm(d_model), nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads)
        self.ffn = nn.Sequential(nn.Linear(d_model, d_ff), nn.GELU(), nn.Linear(d_ff, d_model))

    def forward(self, x, mask=None):
        x = x + self.attn(self.ln1(x), mask)   # Austausch zwischen Positionen
        x = x + self.ffn(self.ln2(x))          # Verarbeitung je Position
        return x
```

Am Ende des letzten Blocks bildet eine lineare Schicht jeden Vektor auf $V$ Werte ab, einen pro Token im Vokabular. Diese **Logits** werden mit einer Softmax zur Wahrscheinlichkeitsverteilung über das nächste Token (Abschnitt 10). Oft teilt sich diese Schicht ihre Gewichte mit der Embedding-Tabelle.

> [!abstract] Merke
> - Block = Attention (zwischen Positionen) + FFN (je Position), jeweils mit Residualverbindung und LayerNorm.
> - Pre-LN: $\mathbf x + f(\operatorname{LN}(\mathbf x))$. Der Residual Stream läuft unverändert durch alle Blöcke.

## Encoder, Decoder und Masken {#masken toc="Encoder, Decoder, Masken"}

Der ursprüngliche Transformer war für Übersetzung gebaut und hat zwei Teile:

- Der **Encoder** liest den Ausgangssatz. Jede Position darf auf alle anderen achten, vorwärts wie rückwärts.
- Der **Decoder** erzeugt den übersetzten Satz Token für Token. Er hat zwei Attention-Schichten: eine **Self-Attention** über das bisher Erzeugte und eine **Cross-Attention**, in der die Queries aus dem Decoder und Keys und Values aus dem Encoder kommen. So kann jedes erzeugte Wort im Ausgangssatz nachschlagen.

Beim Erzeugen darf Position $i$ nur auf Positionen $j \le i$ schauen, die Zukunft kennt das Modell ja noch nicht. Beim Training liegt der ganze Zielsatz aber schon vor, und ohne Vorkehrung könnte das Modell einfach abschreiben. Eine **kausale Maske** setzt deshalb alle Werte oberhalb der Diagonale von $QK^\top$ vor der Softmax auf $-\infty$. Deren Gewicht wird exakt 0. Ähnlich blendet eine **Padding-Maske** Füllzeichen aus, mit denen kürzere Folgen in einem Batch auf gleiche Länge gebracht werden.

::: widget tr-09-masken

Aus dem ursprünglichen Aufbau sind drei Familien hervorgegangen:

| Familie | Attention | Trainingsaufgabe | Beispiele | typisch für |
|---|---|---|---|---|
| Encoder-only | bidirektional | maskierte Tokens erraten | BERT, RoBERTa | Klassifikation, Suche, Embeddings |
| Decoder-only | kausal | nächstes Token vorhersagen | GPT, Llama, Claude | Textgenerierung, Chat |
| Encoder-Decoder | Encoder bidirektional, Decoder kausal + Cross-Attention | Folge in Folge übersetzen | Original-Transformer, T5 | Übersetzung, Zusammenfassung |

Decoder-only-Modelle haben sich für allgemeine Sprachmodelle durchgesetzt: Eine einzige, einfache Trainingsaufgabe skaliert auf beliebig viel Text, und jede andere Aufgabe lässt sich als „schreibe den Text weiter“ formulieren.

```python
n = 6
causal = torch.tril(torch.ones(n, n))   # 1 = erlaubt, 0 = maskiert (obere Dreiecksmatrix)
```

## Training und Erzeugung {#training}

Ein Decoder-only-Modell wird darauf trainiert, an jeder Position das **nächste Token** vorherzusagen. Dank kausaler Maske geht das für alle Positionen eines Textes gleichzeitig: Ein Text mit $n$ Tokens liefert in einem Durchlauf $n$ Trainingsbeispiele. Der Verlust ist die **Cross-Entropy**, also $-\log$ der Wahrscheinlichkeit, die das Modell dem tatsächlich folgenden Token gegeben hat, gemittelt über alle Positionen. Dass beim Training stets der echte Text als Eingabe dient und nicht das, was das Modell selbst erzeugt hätte, heißt **Teacher Forcing**.

Beim **Erzeugen** läuft das Modell autoregressiv: Es berechnet die Verteilung für das nächste Token, wählt eines aus, hängt es an und wiederholt das. Wie ausgewählt wird, bestimmt den Charakter des Textes:

- **Greedy:** immer das wahrscheinlichste Token. Deterministisch, neigt zu Wiederholungen.
- **Temperatur** $T$: Logits vor der Softmax durch $T$ teilen. $T < 1$ macht die Verteilung spitzer und den Text vorhersehbarer, $T > 1$ flacher und vielfältiger, aber fehleranfälliger.
- **Top-k:** nur die $k$ wahrscheinlichsten Tokens zulassen und neu normieren.
- **Top-p** (Nucleus Sampling): die kleinste Menge der wahrscheinlichsten Tokens zulassen, deren Wahrscheinlichkeiten zusammen mindestens $p$ ergeben. Passt sich an: Bei einer klaren Verteilung bleiben wenige Kandidaten, bei einer unsicheren viele.

::: widget tr-10-sampling

```python
@torch.no_grad()
def generate(model, ids, steps, T=1.0, k=None):
    for _ in range(steps):
        logits = model(ids)[:, -1, :] / T          # nur die letzte Position
        if k is not None:
            kth = logits.topk(k).values[:, -1:]
            logits[logits < kth] = float("-inf")
        nxt = torch.multinomial(logits.softmax(-1), 1)
        ids = torch.cat([ids, nxt], dim=1)
    return ids
```

Ein vortrainiertes Sprachmodell setzt Text nur fort. Damit es Anweisungen befolgt und hilfreich antwortet, wird es anschließend auf Beispielen von Fragen und guten Antworten weiter trainiert (Instruction Tuning) und mit menschlichem oder automatisiertem Feedback abgestimmt.

> [!abstract] Merke
> - Training: nächstes Token vorhersagen, alle Positionen gleichzeitig, Cross-Entropy.
> - Erzeugen: autoregressiv, Token für Token. Temperatur, Top-k und Top-p steuern die Auswahl.

## Rechenaufwand und KV-Cache {#aufwand group="Praxis" toc="Rechenaufwand, KV-Cache"}

Die Parameter eines Blocks stecken in vier $d\times d$-Matrizen der Attention ($W_Q, W_K, W_V, W_O$) und zwei Matrizen des FFN ($d \times 4d$ und $4d \times d$). Das sind zusammen etwa $12\,d^2$ Parameter pro Block, für das ganze Modell rund

$$
N_\text{param} \approx 12\,L\,d^2 + V d
$$

mit $L$ Blöcken und $d = d_\text{model}$. GPT-2 small ($L = 12$, $d = 768$, $V = 50\,257$) kommt so auf etwa 124 Millionen Parameter.

Pro Token kostet ein Vorwärtsdurchlauf etwa $2\,N_\text{param}$ Rechenoperationen (eine Multiplikation und eine Addition pro Gewicht). Dazu kommt die Attention selbst: $QK^\top$ und das Produkt mit $V$ kosten pro Block etwa $4\,n^2 d$ Operationen für die ganze Folge. Dieser Teil wächst **quadratisch** mit der Länge $n$ und dominiert bei langen Folgen. Auch der Speicher für die $n\times n$-Gewichte wächst quadratisch, das löst Flash Attention (Abschnitt 12).

### KV-Cache

Beim Erzeugen kommt pro Schritt nur ein neues Token dazu. Die Keys und Values der früheren Tokens ändern sich wegen der kausalen Maske nicht mehr. Man speichert sie deshalb im **KV-Cache** und berechnet pro Schritt nur Query, Key und Value des neuen Tokens. Statt die ganze Folge neu zu rechnen, kostet jeder Schritt dann nur noch $O(n)$ für die Attention. Der Cache braucht Speicher:

$$
\text{KV-Cache} = 2 \cdot L \cdot n \cdot d \cdot \text{Bytes pro Zahl}
$$

pro Sequenz (Faktor 2 für Keys und Values). Bei einem Modell mit 32 Blöcken und $d = 4096$ sind das in 16 Bit für 4096 Tokens schon 2 GiB, für jede gleichzeitig bediente Anfrage. Deshalb teilen sich in neueren Modellen mehrere Query-Köpfe dieselben Keys und Values (**Grouped-Query Attention**, im Extrem ein einziger Key-Value-Kopf: Multi-Query Attention). Das verkleinert den Cache um den Faktor der Gruppengröße.

::: widget tr-11-aufwand

> [!abstract] Merke
> - Parameter $\approx 12Ld^2$, Rechenaufwand $\approx 2N_\text{param}$ pro Token plus $O(n^2 d)$ Attention.
> - KV-Cache: Keys und Values früherer Tokens speichern, $2Lnd$ Zahlen pro Sequenz. GQA verkleinert ihn.

## Flash Attention {#flash}

Die naive Attention schreibt die $n\times n$-Matrix der Werte $S = QK^\top$ in den Grafikspeicher, liest sie für die Softmax wieder ein, schreibt die Gewichte $P$ zurück und liest sie erneut für das Produkt mit $V$. Auf einer GPU ist aber nicht das Rechnen der Engpass, sondern dieses Hin- und Herschieben: Der große Grafikspeicher (HBM) ist um ein Vielfaches langsamer als der kleine, schnelle Speicher direkt an den Recheneinheiten (SRAM), der nur einige hundert Kilobyte pro Recheneinheit fasst.

**Flash Attention** (Dao et al., 2022) rechnet dasselbe Ergebnis, ohne $S$ oder $P$ je vollständig zu speichern. Q, K und V werden in **Kacheln** zerlegt, die in den schnellen Speicher passen. Für einen Block von Queries läuft man über alle Key-Value-Kacheln und führt das Ergebnis laufend nach. Das Problem dabei ist die Softmax, die eigentlich das Maximum und die Summe über die ganze Zeile braucht. Die Lösung ist die **Online-Softmax**: Man merkt sich pro Zeile das bisherige Maximum $m$ und die bisherige Summe $\ell$. Kommt eine Kachel mit größerem Maximum, werden alte Summe und altes Zwischenergebnis mit $e^{m_\text{alt} - m_\text{neu}}$ heruntergerechnet:

$$
m' = \max(m, \tilde m), \qquad \ell' = e^{m - m'}\,\ell + e^{\tilde m - m'}\,\tilde\ell, \qquad O' = e^{m - m'}\,O + e^{\tilde m - m'}\,\tilde P\,\tilde V
$$

Am Ende teilt man $O$ durch $\ell$. Das Ergebnis ist **exakt** dasselbe wie bei der naiven Rechnung, keine Näherung. Der Speicherbedarf sinkt von $O(n^2)$ auf $O(n)$, und weil viel weniger Daten durch den langsamen Speicher müssen, wird die Rechnung deutlich schneller. Für die Rückwärtsrechnung beim Training werden die Gewichte bei Bedarf aus Q und K neu berechnet, statt sie zu speichern.

::: widget tr-12-flash-attention

Flash Attention ändert nichts am Modell, nur an der Implementierung. In PyTorch wählt `scaled_dot_product_attention` automatisch eine solche Implementierung, wenn die Hardware sie unterstützt.

> [!abstract] Merke
> - Engpass ist der Speichertransfer, nicht die Rechnung. Flash Attention rechnet kachelweise im schnellen Speicher.
> - Online-Softmax führt Maximum und Summe laufend nach. Exaktes Ergebnis, Speicher $O(n)$ statt $O(n^2)$.

## Fine-Tuning und LoRA {#lora}

Ein vortrainiertes Modell an eine neue Aufgabe anzupassen, heißt **Fine-Tuning**. Beim vollständigen Fine-Tuning werden alle Gewichte weiter trainiert. Bei Milliarden Parametern braucht das sehr viel Speicher, denn der Optimierer (z. B. Adam) hält pro Gewicht noch zwei weitere Zahlen, und am Ende hat man für jede Aufgabe eine vollständige Kopie des Modells.

**LoRA** (Low-Rank Adaptation, Hu et al., 2021) geht davon aus, dass die nötige Änderung der Gewichte einen niedrigen Rang hat (siehe [Niedrigrang-Approximation](../grundlagen/lineare-algebra.html#svd)). Statt eine Gewichtsmatrix $W_0 \in \mathbb R^{d\times k}$ zu ändern, friert man sie ein und lernt nur eine Korrektur als Produkt zweier schmaler Matrizen:

$$
W = W_0 + \frac{\alpha}{r}\,BA, \qquad B \in \mathbb R^{d\times r}, \quad A \in \mathbb R^{r\times k}, \quad r \ll \min(d, k)
$$

Statt $dk$ Parametern trainiert man nur $r(d + k)$. Bei $d = k = 4096$ und $r = 8$ sind das 65 536 statt knapp 17 Millionen pro Matrix, weniger als ein halbes Prozent. $B$ wird mit Nullen initialisiert, sodass das Modell zu Beginn exakt dem Original entspricht. $\alpha$ ist ein fester Skalierungsfaktor. Üblich ist LoRA auf den Attention-Projektionen, oft auch auf den FFN-Matrizen, mit Rang 4 bis 64.

::: widget tr-13-lora-aufbau

Wie stark sich eine Gewichtsänderung mit kleinem Rang darstellen lässt, zeigt die nächste Abbildung.

::: widget tr-14-lora-rang

Nach dem Training kann man $\frac{\alpha}{r}BA$ einfach zu $W_0$ addieren, dann kostet das angepasste Modell beim Ausführen nichts extra. Oder man behält die kleinen Matrizen getrennt und wechselt je nach Aufgabe zwischen mehreren Adaptern für dasselbe Grundmodell. Kombiniert mit einem auf 4 Bit quantisierten Grundmodell (**QLoRA**) lassen sich so auch große Modelle auf einer einzelnen GPU anpassen.

```python
class LoRALinear(nn.Module):
    def __init__(self, base: nn.Linear, r=8, alpha=16):
        super().__init__()
        self.base = base.requires_grad_(False)                    # W_0 eingefroren
        self.A = nn.Parameter(torch.randn(r, base.in_features) * 0.01)
        self.B = nn.Parameter(torch.zeros(base.out_features, r))  # Start: keine Änderung
        self.scale = alpha / r

    def forward(self, x):
        return self.base(x) + (x @ self.A.T @ self.B.T) * self.scale
```

> [!abstract] Merke
> - LoRA: $W_0$ einfrieren, nur $BA$ mit kleinem Rang $r$ trainieren. Parameter $r(d + k)$ statt $dk$.
> - $B = 0$ zu Beginn. Nach dem Training einrechnen oder als austauschbaren Adapter behalten.

## Dimensionen und Formeln {#formeln appendix="A"}

Alle Größen für eine Folge der Länge $n$ (Batch weggelassen). Im ursprünglichen Transformer: $d_\text{model} = 512$, $h = 8$, $d_k = d_v = 64$, $d_\text{ff} = 2048$, $N = 6$ Blöcke in Encoder und Decoder.

| Größe | Form | Bedeutung |
|---|---|---|
| $X$ | $n \times d_\text{model}$ | Eingabe: Embeddings plus Position |
| $E$ | $V \times d_\text{model}$ | Embedding-Tabelle |
| $W_Q^{(i)}, W_K^{(i)}$ | $d_\text{model} \times d_k$ | Projektionen eines Kopfes |
| $W_V^{(i)}$ | $d_\text{model} \times d_v$ | Value-Projektion eines Kopfes |
| $Q, K$ | $n \times d_k$ | Queries, Keys eines Kopfes |
| $V$ | $n \times d_v$ | Values eines Kopfes |
| $QK^\top$, Gewichte | $n \times n$ | Ähnlichkeiten, Attention-Gewichte |
| $W_O$ | $h d_v \times d_\text{model}$ | Zusammenführen der Köpfe |
| $W_1$, $W_2$ | $d_\text{model} \times d_\text{ff}$, $d_\text{ff} \times d_\text{model}$ | Feed-Forward-Netz |
| Logits | $n \times V$ | eine Verteilung über das Vokabular pro Position |

| Thema | Formel |
|---|---|
| Attention | $\operatorname{softmax}(QK^\top/\sqrt{d_k})\,V$ |
| Multi-Head | $\operatorname{concat}(\text{head}_1,\dots,\text{head}_h)\,W_O$, $d_k = d_\text{model}/h$ |
| Sinus-Position | $PE_{p,2i} = \sin(p/10000^{2i/d})$, $PE_{p,2i+1} = \cos(p/10000^{2i/d})$ |
| Block (Pre-LN) | $\mathbf x \leftarrow \mathbf x + \operatorname{MHA}(\operatorname{LN}(\mathbf x))$, $\mathbf x \leftarrow \mathbf x + \operatorname{FFN}(\operatorname{LN}(\mathbf x))$ |
| Temperatur | $p_i = \operatorname{softmax}(z_i / T)$ |
| Parameter | $\approx 12 L d^2 + Vd$ |
| KV-Cache | $2 \cdot L \cdot n \cdot d \cdot$ Bytes (bei GQA geteilt durch Gruppengröße) |
| LoRA | $W = W_0 + \frac{\alpha}{r}BA$, $r(d + k)$ Parameter |

## Glossar {#glossar appendix="B"}

| Begriff | Bedeutung |
|---|---|
| Token | Einheit, in die Text zerlegt wird, oft ein Wortteil |
| Embedding | gelernter Vektor zu einem Token |
| Attention | gewichteter Mittelwert über Positionen, Gewichte aus Query-Key-Ähnlichkeit |
| Self-/Cross-Attention | Queries, Keys und Values aus derselben bzw. aus verschiedenen Folgen |
| Kopf (Head) | eine von mehreren parallelen Attentions mit eigenen Projektionen |
| Residual Stream | Vektor pro Position, zu dem jede Teilschicht ihre Änderung addiert |
| Kausale Maske | verbietet den Blick auf spätere Positionen |
| Logits | Werte vor der Softmax, einer pro Token im Vokabular |
| Kontextlänge | maximale Anzahl Tokens, die das Modell auf einmal verarbeitet |
| KV-Cache | gespeicherte Keys und Values früherer Tokens beim Erzeugen |
| GQA | Grouped-Query Attention: mehrere Query-Köpfe teilen sich Keys und Values |
| LoRA | Anpassung durch eine trainierte Korrektur niedrigen Rangs |
