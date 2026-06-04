"use client"

import { useState } from "react"
import { Ergebnis as ErgebnisType } from "@/types"

interface Props {
  ergebnis: ErgebnisType
  onNeustart: () => void
}

const AMPEL_CONFIG = {
  gruen: { color: "bg-green-500", textColor: "text-green-700", border: "border-green-200", bg: "bg-green-50" },
  gelb:  { color: "bg-yellow-400", textColor: "text-yellow-700", border: "border-yellow-200", bg: "bg-yellow-50" },
  rot:   { color: "bg-red-500", textColor: "text-red-700", border: "border-red-200", bg: "bg-red-50" },
}

function KennzahlKarte({ label, wert, einheit }: { label: string; wert: string; einheit: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-800">{wert}</p>
      <p className="text-xs text-gray-400">{einheit}</p>
    </div>
  )
}

function KostenZeile({ label, wert, highlight }: { label: string; wert: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm text-gray-600">
      <span>{label}</span>
      <span className={`tabular-nums ${highlight ? "font-semibold text-gray-800" : "font-medium"}`}>{wert}</span>
    </div>
  )
}

function VergleichSpalte({
  titel,
  investition,
  foerderung,
  netto,
  amortisation,
  highlight,
  fmt,
}: {
  titel: string
  investition: number
  foerderung: number | null
  netto: number
  amortisation: number
  highlight: boolean
  fmt: (n: number, s?: number) => string
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-1.5 ${highlight ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${highlight ? "text-green-700" : "text-gray-500"}`}>
        {titel}
      </p>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Investition</span>
        <span className="tabular-nums">{fmt(investition)} €</span>
      </div>
      {foerderung !== null && (
        <div className="flex justify-between text-sm text-green-700">
          <span>Förderung ({Math.round((foerderung / investition) * 100)} %)</span>
          <span className="tabular-nums font-medium">−{fmt(foerderung)} €</span>
        </div>
      )}
      <div className={`flex justify-between text-sm border-t pt-1.5 ${highlight ? "border-green-200" : "border-gray-200"}`}>
        <span className="font-semibold text-gray-800">Netto-Investition</span>
        <span className="tabular-nums font-semibold text-gray-800">{fmt(netto)} €</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600 pt-0.5">
        <span>Amortisation</span>
        <span className="tabular-nums font-semibold">
          {amortisation === Infinity ? "∞" : fmt(amortisation, 1)} Jahre
        </span>
      </div>
    </div>
  )
}

const BAFA_URL =
  "https://www.bafa.de/DE/Energie/Energieeffizienz/Energieeffizienz_und_Prozesswaerme/Modul1_Querschnittstechnologien/modul1_querschnittstechnologien_node.html"

export default function Ergebnis({ ergebnis, onNeustart }: Props) {
  const [foerderungAufgeklappt, setFoerderungAufgeklappt] = useState(false)

  const { bewertung } = ergebnis
  const ampel = AMPEL_CONFIG[bewertung.farbe]
  const fmt = (n: number, stellen = 0) =>
    n.toLocaleString("de-DE", { maximumFractionDigits: stellen })

  const wandAnzahl = Math.round(ergebnis.kostenWanddurchbrueche / 350)

  const [foerderRate, setFoerderRate] = useState<0.25 | 0.20>(0.25)
  const foerderungBetrag = ergebnis.gesamtinvestition * foerderRate
  const nettoMitFoerderung = ergebnis.gesamtinvestition * (1 - foerderRate)
  const amortisationMitFoerderung =
    ergebnis.einsparungEuro > 0 ? nettoMitFoerderung / ergebnis.einsparungEuro : Infinity

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Ergebnisse</h2>
        <p className="text-sm text-gray-500 mt-1">Abwärmepotenzial & Wirtschaftlichkeit</p>
      </div>

      {/* Ampel */}
      <div className={`rounded-xl border p-4 ${ampel.border} ${ampel.bg}`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{bewertung.icon}</span>
          <div>
            <p className={`font-semibold ${ampel.textColor}`}>{bewertung.label}</p>
            <p className="text-xs text-gray-500">
              Amortisation in{" "}
              {ergebnis.amortisationJahre === Infinity ? "∞" : fmt(ergebnis.amortisationJahre, 1)}{" "}
              Jahren
            </p>
          </div>
        </div>
      </div>

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 gap-3">
        <KennzahlKarte
          label="Nutzwärme/Jahr"
          wert={fmt(ergebnis.nutzwaermeKwh)}
          einheit="kWh/Jahr"
        />
        <KennzahlKarte
          label="Jährliche Einsparung"
          wert={fmt(ergebnis.einsparungEuro)}
          einheit="€/Jahr"
        />
        <KennzahlKarte
          label="CO₂-Einsparung"
          wert={fmt(ergebnis.co2EinsparungT, 1)}
          einheit="t CO₂/Jahr"
        />
        <KennzahlKarte
          label="Gesamtinvestition"
          wert={fmt(ergebnis.gesamtinvestition)}
          einheit="€"
        />
      </div>

      {/* Investitionsaufschlüsselung */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-3">Investitionsaufschlüsselung</p>
        <KostenZeile
          label={`Rohrleitung ${ergebnis.dn}`}
          wert={`${fmt(ergebnis.leitungskosten)} €`}
        />
        <KostenZeile
          label={ergebnis.waermetauscherModell}
          wert={ergebnis.wtPreis !== null ? `${fmt(ergebnis.wtPreis)} €` : "Auf Anfrage"}
        />
        <KostenZeile
          label={`Wanddurchbrüche (${wandAnzahl} × 350 €)`}
          wert={`${fmt(ergebnis.kostenWanddurchbrueche)} €`}
        />
        <KostenZeile
          label="Anschluss & Montage"
          wert={`${fmt(ergebnis.anschlusskosten)} €`}
        />
        <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold text-gray-800 text-sm">
          <span>Gesamt</span>
          <span className="tabular-nums">{fmt(ergebnis.gesamtinvestition)} €</span>
        </div>
      </div>

      {/* Berechnungsdetails */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2 text-sm">
        <p className="font-medium text-gray-700">Berechnungsdetails</p>
        <div className="flex justify-between text-gray-600">
          <span>Wirkungsgrad η</span>
          <span>{(ergebnis.wirkungsgrad * 100).toFixed(0)} %</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Thermische Leistung P_th</span>
          <span className="tabular-nums">{fmt(ergebnis.thermischeLeistungKw, 1)} kW</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Volumenstrom</span>
          <span className="tabular-nums">{fmt(ergebnis.volumenstrom, 2)} m³/h</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Rohrdimension</span>
          <span>{ergebnis.dn}</span>
        </div>
      </div>

      {/* Fördermittel-Block */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
        <div>
          <p className="text-sm font-semibold text-blue-800">Fördermittel: BAFA EEW – Modul 1 Querschnittstechnologien</p>
          <p className="text-xs text-blue-700 mt-1">
            Druckluftanlagen und Wärmeübertrager zur Abwärmenutzung von Bestandsanlagen werden
            vom BAFA im Rahmen der Bundesförderung für Energie- und Ressourceneffizienz in der
            Wirtschaft (EEW) explizit gefördert – nur für KMU.
          </p>
          <ul className="mt-2 space-y-0.5 text-xs text-blue-700 list-disc list-inside">
            <li>Kleine Unternehmen: <strong>25 %</strong> der förderfähigen Ausgaben</li>
            <li>Mittlere Unternehmen: <strong>20 %</strong> der förderfähigen Ausgaben</li>
            <li>Mindestinvestition: 2.000 € · Max. Zuschuss: 200.000 €</li>
            <li>Antrag muss <strong>vor</strong> Projektbeginn gestellt werden</li>
          </ul>
        </div>

        <a
          href={BAFA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 underline underline-offset-2"
        >
          Weitere Infos auf bafa.de →
        </a>

        {!foerderungAufgeklappt ? (
          <button
            onClick={() => setFoerderungAufgeklappt(true)}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 touch-manipulation"
          >
            Mit BAFA-Förderung vergleichen (20–25 %)
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-blue-800 uppercase tracking-wide">Vergleich</p>
              <div className="flex rounded-lg border border-blue-300 overflow-hidden text-xs font-medium">
                <button
                  onClick={() => setFoerderRate(0.25)}
                  className={`px-3 py-1 transition ${foerderRate === 0.25 ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-100"}`}
                >
                  Klein (25 %)
                </button>
                <button
                  onClick={() => setFoerderRate(0.20)}
                  className={`px-3 py-1 transition ${foerderRate === 0.20 ? "bg-blue-600 text-white" : "text-blue-700 hover:bg-blue-100"}`}
                >
                  Mittel (20 %)
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <VergleichSpalte
                titel="Ohne Förderung"
                investition={ergebnis.gesamtinvestition}
                foerderung={null}
                netto={ergebnis.gesamtinvestition}
                amortisation={ergebnis.amortisationJahre}
                highlight={false}
                fmt={fmt}
              />
              <VergleichSpalte
                titel={`Mit Förderung (${foerderRate * 100} %)`}
                investition={ergebnis.gesamtinvestition}
                foerderung={foerderungBetrag}
                netto={nettoMitFoerderung}
                amortisation={amortisationMitFoerderung}
                highlight={true}
                fmt={fmt}
              />
            </div>
            <p className="text-xs text-blue-600 italic">
              * Richtwert – Förderbedingungen können sich ändern. Antrag vor Projektbeginn stellen.
            </p>
            <button
              onClick={() => setFoerderungAufgeklappt(false)}
              className="w-full rounded-lg border border-blue-300 px-4 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-100 touch-manipulation"
            >
              Vergleich ausblenden
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onNeustart}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 touch-manipulation"
      >
        Neue Berechnung
      </button>
    </div>
  )
}
