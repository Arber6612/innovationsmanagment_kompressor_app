import { AnlageData, SenkeData, Ergebnis, Bewertung } from "@/types"

function getEta(alterJahre: number): number {
  if (alterJahre <= 5)  return 0.95
  if (alterJahre <= 10) return 0.90
  if (alterJahre <= 15) return 0.85
  return 0.80
}

function getDN(v: number): { dn: string; preisPrTm: number } {
  if (v <= 2.0)  return { dn: "DN 20", preisPrTm: 0 }
  if (v <= 4.0)  return { dn: "DN 25", preisPrTm: 156.20 }
  if (v <= 7.0)  return { dn: "DN 32", preisPrTm: 198.80 }
  if (v <= 12.0) return { dn: "DN 40", preisPrTm: 241.40 }
  if (v <= 20.0) return { dn: "DN 50", preisPrTm: 298.20 }
  return { dn: "DN 65", preisPrTm: 397.60 }
}

function getWaermetauscher(pEl: number): { modell: string; preis: number | null } {
  if (pEl <= 75)  return { modell: "Wolf SL32-50 (75 kW)",  preis: 665 }
  if (pEl <= 100) return { modell: "Wolf SL32-70 (100 kW)", preis: 779 }
  if (pEl <= 120) return { modell: "Wolf SL32-90 (120 kW)", preis: 950 }
  if (pEl <= 160) return { modell: "Wolf SL78 (160 kW)",    preis: 1400 }
  if (pEl <= 200) return { modell: "Wolf SL78-70 (200 kW)", preis: 1800 }
  return { modell: "Auf Anfrage (> 200 kW)", preis: null }
}

function bewertungNachAmortisation(jahre: number): Bewertung {
  if (jahre < 5)  return { label: "Sehr wirtschaftlich",  farbe: "gruen", icon: "✅" }
  if (jahre < 10) return { label: "Wirtschaftlich",       farbe: "gruen", icon: "✅" }
  if (jahre < 15) return { label: "Grenzwertig",          farbe: "gelb",  icon: "⚠️" }
  return                 { label: "Nicht wirtschaftlich", farbe: "rot",   icon: "❌" }
}

export function berechneErgebnis(anlage: AnlageData, senke: SenkeData): Ergebnis {
  const eta = getEta(anlage.alterJahre)
  const pTh = anlage.leistungKw * eta * 0.72
  const nutzwaermeKwh = pTh * anlage.betriebsstunden
  const einsparungEuro = nutzwaermeKwh * senke.gaspreisEuroKwh
  const co2EinsparungT = nutzwaermeKwh * 0.000201

  const volumenstrom = anlage.leistungKw / (1.16 * 20)
  const { dn, preisPrTm } = getDN(volumenstrom)
  const leitungskosten = preisPrTm * senke.distanzM
  const { modell, preis: wtPreis } = getWaermetauscher(anlage.leistungKw)
  const kostenWanddurchbrueche = senke.wanddurchbrueche * 350
  const gesamtinvestition =
    leitungskosten + (wtPreis ?? 0) + kostenWanddurchbrueche + senke.anschlusskosten
  const amortisationJahre =
    einsparungEuro > 0 ? gesamtinvestition / einsparungEuro : Infinity

  return {
    wirkungsgrad: eta,
    thermischeLeistungKw: pTh,
    nutzwaermeKwh,
    einsparungEuro,
    co2EinsparungT,
    volumenstrom,
    dn,
    waermetauscherModell: modell,
    wtPreis,
    leitungskosten,
    kostenWanddurchbrueche,
    anschlusskosten: senke.anschlusskosten,
    gesamtinvestition,
    amortisationJahre,
    bewertung: bewertungNachAmortisation(amortisationJahre),
  }
}
