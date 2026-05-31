export interface AnlageData {
  leistungKw: number
  betriebsstunden: number
  alterJahre: number
}

export interface SenkeData {
  temperaturbedarf: number
  distanzM: number
  wanddurchbrueche: number
  fixkostenEuro: number
  gaspreisEuroKwh: number
}

export interface Ergebnis {
  wirkungsgrad: number
  thermischeLeistungKw: number
  thermischeArbeitKwh: number
  waermeverlustKwh: number
  nettoWaermeKwh: number
  investitionskostenEuro: number
  jaehrlicheErsparnis: number
  amortisationJahre: number
  co2EinsparungKg: number
}
