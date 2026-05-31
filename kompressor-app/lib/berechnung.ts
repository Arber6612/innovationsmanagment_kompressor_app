import { AnlageData, SenkeData, Ergebnis } from "@/types"

// CO2-Faktor für Erdgas in kg pro kWh
const CO2_FAKTOR = 0.202

function wirkungsgradNachAlter(alterJahre: number): number {
  if (alterJahre <= 5) return 0.95
  if (alterJahre <= 10) return 0.90
  if (alterJahre <= 15) return 0.85
  return 0.80
}

export function berechneErgebnis(anlage: AnlageData, senke: SenkeData): Ergebnis {
  const eta = wirkungsgradNachAlter(anlage.alterJahre)

  // Thermische Leistung: P_th = P_el * η * 0,72
  const thermischeLeistungKw = anlage.leistungKw * eta * 0.72

  // Thermische Arbeit: Q_th = P_th * t
  const thermischeArbeitKwh = thermischeLeistungKw * anlage.betriebsstunden

  // Wärmeverlust: Q_Netto = Q_th - (L * 0,05 kW * t)
  const waermeverlustKwh = senke.distanzM * 0.05 * anlage.betriebsstunden
  const nettoWaermeKwh = Math.max(0, thermischeArbeitKwh - waermeverlustKwh)

  // Investitionskosten: I = K + (L * 180€) + (W * 350€)
  const investitionskostenEuro =
    senke.fixkostenEuro +
    senke.distanzM * 180 +
    senke.wanddurchbrueche * 350

  // Jährliche Ersparnis: E = Q_th * Gaspreis
  const jaehrlicheErsparnis = nettoWaermeKwh * senke.gaspreisEuroKwh

  // Amortisation in Jahren
  const amortisationJahre =
    jaehrlicheErsparnis > 0 ? investitionskostenEuro / jaehrlicheErsparnis : Infinity

  // CO2-Einsparung
  const co2EinsparungKg = nettoWaermeKwh * CO2_FAKTOR

  return {
    wirkungsgrad: eta,
    thermischeLeistungKw,
    thermischeArbeitKwh,
    waermeverlustKwh,
    nettoWaermeKwh,
    investitionskostenEuro,
    jaehrlicheErsparnis,
    amortisationJahre,
    co2EinsparungKg,
  }
}

export function ampelBewertung(amortisationJahre: number): "gruen" | "gelb" | "rot" {
  if (amortisationJahre < 5) return "gruen"
  if (amortisationJahre <= 10) return "gelb"
  return "rot"
}
