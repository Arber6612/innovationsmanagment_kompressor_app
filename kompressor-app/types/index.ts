export interface AnlageData {
  leistungKw: number
  betriebsstunden: number
  alterJahre: number
}

export interface SenkeData {
  distanzM: number
  wanddurchbrueche: number
  anschlusskosten: number
  gaspreisEuroKwh: number
}

export interface Bewertung {
  label: string
  farbe: "gruen" | "gelb" | "rot"
  icon: string
}

export interface Ergebnis {
  wirkungsgrad: number
  thermischeLeistungKw: number
  nutzwaermeKwh: number
  einsparungEuro: number
  co2EinsparungT: number
  volumenstrom: number
  dn: string
  waermetauscherModell: string
  wtPreis: number | null
  leitungskosten: number
  kostenWanddurchbrueche: number
  anschlusskosten: number
  gesamtinvestition: number
  amortisationJahre: number
  bewertung: Bewertung
}
