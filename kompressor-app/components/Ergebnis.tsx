"use client"

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

function KostenZeile({ label, wert }: { label: string; wert: string }) {
  return (
    <div className="flex justify-between text-sm text-gray-600">
      <span>{label}</span>
      <span className="font-medium tabular-nums">{wert}</span>
    </div>
  )
}

export default function Ergebnis({ ergebnis, onNeustart }: Props) {
  const { bewertung } = ergebnis
  const ampel = AMPEL_CONFIG[bewertung.farbe]
  const fmt = (n: number, stellen = 0) =>
    n.toLocaleString("de-DE", { maximumFractionDigits: stellen })

  const wandAnzahl = Math.round(ergebnis.kostenWanddurchbrueche / 350)

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

      <button
        onClick={onNeustart}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 touch-manipulation"
      >
        Neue Berechnung
      </button>
    </div>
  )
}
