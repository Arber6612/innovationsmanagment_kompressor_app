# Grundlagen & Berechnungskonzept
## Kompressor-Abwärme-Rechner

**Hochschule Osnabrück · Innovationsmanagement · Gruppe 8**

---

## 1. Hintergrund & Motivation

Elektrisch betriebene Kompressoren wandeln elektrische Energie in Druckluft um. Dabei geht ein erheblicher Anteil der eingesetzten Energie als Wärme verloren – typischerweise **70–80 % der elektrischen Eingangsleistung** werden als Abwärme abgestrahlt (am Kompressorgehäuse, im Kühlwasser, im Druckluftöl). Diese Wärme lässt sich mit geeigneter Technik zurückgewinnen und z. B. für Raumheizung, Warmwasserbereitung oder Prozesswärme nutzen.

Die App berechnet, wie viel Wärmeenergie eine bestehende Kompressoranlage pro Jahr liefern könnte, was die Erschließung dieser Wärmequelle kostet, wie schnell sich die Investition amortisiert und wie viel CO₂ eingespart wird – verglichen mit einer konventionellen Gasheizung als Alternative.

---

## 2. Eingabegrößen

### Schritt 1 – Kompressoranlage (Quelle)

| Parameter | Symbol | Einheit | Beschreibung |
|---|---|---|---|
| Elektrische Leistung | P_el | kW | Nennleistung des Kompressors laut Typenschild |
| Betriebsstunden | t | h/Jahr | Tatsächliche Laufzeit pro Jahr |
| Alter der Anlage | a | Jahre | Bestimmt den Wirkungsgrad (siehe Abschnitt 3.1) |

> **Mindestwert P_el ≥ 2,2 kW:** Unterhalb dieser Schwelle ist der Aufwand für Wärmerückgewinnung in der Praxis nicht wirtschaftlich darstellbar.

### Schritt 2 – Wärmenutzung (Senke)

| Parameter | Symbol | Einheit | Beschreibung |
|---|---|---|---|
| Temperaturbedarf | T_soll | °C | Benötigte Vorlauftemperatur am Verbraucher |
| Distanz zur Quelle | L | m | Leitungslänge vom Kompressor zum Verbraucher (inkl. Höhenunterschied) |
| Anzahl Wanddurchbrüche | W | – | Anzahl der Mauerdurchführungen für die Wärmeleitung |
| Fixkosten Wärmerückgewinnung | K | € | Gerätekosten (Wärmetauscher, Steuerung, Montage) |
| Gaspreis | g | €/kWh | Aktueller lokaler Gaspreis als Vergleichsmaßstab (ca. 0,035 €/kWh) |

---

## 3. Berechnungsmodell

### 3.1 Wirkungsgrad η – Altersabhängige Effizienz

Kompressoren verlieren über die Betriebsjahre an Effizienz (Verschleiß an Ventilen, Kolbenringen, Dichtungen). Die App verwendet ein vereinfachtes Stufenmodell:

| Anlagenalter | Wirkungsgrad η |
|---|---|
| 0 – 5 Jahre | 95 % |
| 6 – 10 Jahre | 90 % |
| 11 – 15 Jahre | 85 % |
| > 15 Jahre | 80 % |

```
η = wirkungsgradNachAlter(a)
```

Dieser Wirkungsgrad beschreibt, wie gut der Kompressor seine Nennleistung noch erreicht – nicht den Wärmerückgewinnungsgrad.

---

### 3.2 Thermische Leistung P_th

```
P_th = P_el × η × 0,72     [kW]
```

**Erläuterung des Faktors 0,72:**

Der Faktor 0,72 ist der **Abwärmeanteil**, der technisch nutzbar ist. Er setzt sich folgendermaßen zusammen:

- Kompressoren wandeln elektrische Energie in mechanische Energie um. Davon werden nur ca. **72–80 %** als Wärme in Kühlwasser oder Öl übertragen – der Rest geht als Strahlung und Konvektion direkt ans Kompressorengehäuse oder in die komprimierte Luft.
- Der Standardwert in der Ingenieurpraxis für industrielle Schraubenkompressoren liegt bei **72 % nutzbarer Abwärme** (VDI 2067, VDMA-Richtlinie).
- Diese 72 % können über einen Öl-Wasser-Wärmetauscher oder Kühlwasserkreislauf abgeführt und genutzt werden.

Der Faktor η × 0,72 kombiniert also den altersbedingten Leistungsverlust mit dem technisch erschließbaren Wärmeanteil.

**Beispiel:**
> Kompressor mit P_el = 22 kW, 5 Jahre alt (η = 0,95):
> P_th = 22 × 0,95 × 0,72 = **15,05 kW**

---

### 3.3 Thermische Arbeit Q_th

```
Q_th = P_th × t     [kWh/Jahr]
```

Die thermische Leistung (kW) multipliziert mit den jährlichen Betriebsstunden (h) ergibt die gesamte rückgewinnbare Wärmeenergie pro Jahr in Kilowattstunden.

**Beispiel:**
> P_th = 15,05 kW, t = 2.000 h/Jahr:
> Q_th = 15,05 × 2.000 = **30.100 kWh/Jahr**

---

### 3.4 Wärmeverlust in der Leitung Q_Verlust

```
Q_Verlust = L × 0,05 kW × t     [kWh/Jahr]
```

Beim Transport der Wärme über eine Rohrleitung entstehen Verluste durch Wärmeabgabe ans Umgebungsmaterial. Der Verlustfaktor **0,05 kW pro Meter Leitungslänge** ist ein praxisnaher Schätzwert für gedämmte Warmwasserleitungen (DN25–DN50) im Innenbereich bei einer Temperaturdifferenz von ca. 30–50 K zur Umgebung.

```
Q_Netto = max(0, Q_th − Q_Verlust)     [kWh/Jahr]
```

Der Netto-Wert wird auf 0 begrenzt – physikalisch kann kein negativer Energieertrag entstehen.

**Beispiel:**
> L = 30 m, t = 2.000 h/Jahr:
> Q_Verlust = 30 × 0,05 × 2.000 = 3.000 kWh/Jahr
> Q_Netto = 30.100 − 3.000 = **27.100 kWh/Jahr**

---

### 3.5 Investitionskosten I

```
I = K + (L × 180 €) + (W × 350 €)     [€]
```

Die Gesamtinvestition setzt sich zusammen aus:

| Kostenposition | Berechnung | Erläuterung |
|---|---|---|
| Fixkosten Wärmerückgewinnung | K | Wärmetauscher, Steuerung, Rohre, Montageaufwand – pauschal vom Nutzer angegeben |
| Leitungskosten | L × 180 €/m | Marktüblicher Richtwert für gedämmte Heizungsleitung inkl. Verlegung (Innenbereich) |
| Wanddurchbrüche | W × 350 €/Stück | Pauschale für Kernbohrung, Abdichtung und Mantelrohr |

**Beispiel:**
> K = 5.000 €, L = 30 m, W = 2:
> I = 5.000 + (30 × 180) + (2 × 350) = 5.000 + 5.400 + 700 = **11.100 €**

---

### 3.6 Jährliche Ersparnis E

```
E = Q_Netto × g     [€/Jahr]
```

Die nutzbare Wärmemenge (kWh/Jahr) wird mit dem Gaspreis (€/kWh) multipliziert. Die Logik dahinter: Die zurückgewonnene Wärme ersetzt Wärme, die sonst durch eine Gasheizung erzeugt werden müsste. Der Gaspreis ist damit die relevante **Opportunitätskostengröße**.

> **Wichtig:** Dieser Ansatz setzt voraus, dass die Abwärme eine Gasheizung eins zu eins substituiert. Bei Fernwärme, Pelletheizung oder Wärmepumpe wäre ein anderer Vergleichspreis zu verwenden.

**Beispiel:**
> Q_Netto = 27.100 kWh/Jahr, g = 0,035 €/kWh:
> E = 27.100 × 0,035 = **948,50 €/Jahr**

---

### 3.7 Amortisationszeit A

```
A = I / E     [Jahre]
```

Die statische Amortisationszeit gibt an, nach wie vielen Jahren die Investitionskosten durch die jährliche Ersparnis vollständig gedeckt sind. Es handelt sich um eine **vereinfachte (statische) Methode** – Zinsen, Inflation oder Energiepreisentwicklung werden nicht berücksichtigt.

Ist E = 0 (kein Gaspreis angegeben oder keine nutzbare Wärme), wird A = ∞ gesetzt.

**Beispiel:**
> I = 11.100 €, E = 948,50 €/Jahr:
> A = 11.100 / 948,50 = **11,7 Jahre**

---

### 3.8 CO₂-Einsparung

```
CO₂ = Q_Netto × 0,202 kg/kWh     [kg/Jahr]
```

Der CO₂-Faktor **0,202 kg CO₂ pro kWh** ist der Emissionsfaktor für **Erdgas** gemäß:
- IPCC (2006): 56,1 kg CO₂/GJ → entspricht ca. 0,202 kg/kWh (Heizwert Hi)
- Umweltbundesamt (UBA): Emissionsfaktor Erdgas 0,201 kg CO₂/kWh (Stand 2023)

Die Einsparung beschreibt, wie viel CO₂ nicht mehr durch die Gasheizung ausgestoßen wird, wenn die Abwärme diese ersetzt.

**Beispiel:**
> Q_Netto = 27.100 kWh/Jahr:
> CO₂ = 27.100 × 0,202 = **5.474 kg/Jahr ≈ 5,5 t CO₂/Jahr**

---

## 4. Wirtschaftlichkeitsbewertung (Ampelsystem)

Die App bewertet das Ergebnis mit einem Ampelsystem auf Basis der Amortisationszeit:

| Amortisation | Bewertung | Bedeutung |
|---|---|---|
| < 5 Jahre | 🟢 Wirtschaftlich | Sehr attraktive Investition |
| 5 – 10 Jahre | 🟡 Bedingt wirtschaftlich | Akzeptabel, abhängig von Nutzungsdauer |
| > 10 Jahre | 🔴 Nicht wirtschaftlich | Hohe Unsicherheit, lange Kapitalbindung |

Diese Grenzen orientieren sich an typischen betrieblichen Investitionshorizonten im deutschen Mittelstand (vgl. VDMA-Studie Druckluft 2022).

---

## 5. Modellgrenzen & Vereinfachungen

Die App liefert eine **Erstabschätzung** – kein Ersatz für eine ingenieurmäßige Detailplanung. Folgende Aspekte werden vereinfacht oder nicht berücksichtigt:

| Vereinfachung | Auswirkung |
|---|---|
| Statische Amortisation | Unterschätzt Zinslast, unterschätzt bei steigenden Gaspreisen die Rentabilität |
| Fixer Wärmeabgabefaktor (0,72) | Variiert je nach Kompressorbauart (Kolben vs. Schraube vs. Turbokompressor) |
| Linearer Leitungsverlust (0,05 kW/m) | Abhängig von Dämmstärke, Temperatur, Leitungsdurchmesser |
| Kein Temperaturniveau-Check | Ob T_soll vom Kompressor erreichbar ist, wird nicht validiert – Schraubenkompressoren liefern typisch 70–90 °C |
| Gleichmäßige Betriebsstunden | Saisonale Schwankungen (Heizbedarf im Winter vs. Sommer) werden nicht abgebildet |
| Gaspreis als Referenz | Nur sinnvoll wenn Erdgas tatsächlich die Alternative wäre |

---

## 6. Formelübersicht (Kompakt)

```
η         = f(Alter)                          [Stufenfunktion, s. 3.1]
P_th      = P_el × η × 0,72                  [kW]
Q_th      = P_th × t                          [kWh/Jahr]
Q_Verlust = L × 0,05 × t                     [kWh/Jahr]
Q_Netto   = max(0, Q_th − Q_Verlust)          [kWh/Jahr]
I         = K + L×180 + W×350                 [€]
E         = Q_Netto × g                       [€/Jahr]
A         = I / E                             [Jahre]
CO₂       = Q_Netto × 0,202                   [kg/Jahr]
```

---

## 7. Quellen & Normen

- **VDI 2067** – Wirtschaftlichkeit gebäudetechnischer Anlagen
- **VDMA Einheitsblatt 15390** – Druckluftanlagen, Energieeffizienz
- **DIN EN ISO 50001** – Energiemanagementsysteme
- **IPCC Guidelines for National Greenhouse Gas Inventories (2006)** – CO₂-Emissionsfaktoren
- **Umweltbundesamt (2023)** – Emissionsfaktoren fossile Energieträger
- **Bundesministerium für Wirtschaft und Klimaschutz (BMWK)** – Energieeffizienz in der Druckluftversorgung (2022)
