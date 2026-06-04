"use client"

import { Ergebnis as ErgebnisType } from "@/types"
import { ampelBewertung } from "@/lib/berechnung"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface Props {
  ergebnis: ErgebnisType
  onNeustart: () => void
}

const AMPEL_CONFIG = {
  gruen: { label: "Wirtschaftlich", color: "bg-green-500", textColor: "text-green-700", border: "border-green-200", bg: "bg-green-50" },
  gelb:  { label: "Bedingt wirtschaftlich", color: "bg-yellow-400", textColor: "text-yellow-700", border: "border-yellow-200", bg: "bg-yellow-50" },
  rot:   { label: "Nicht wirtschaftlich", color: "bg-red-500", textColor: "text-red-700", border: "border-red-200", bg: "bg-red-50" },
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

export default function Ergebnis({ ergebnis, onNeustart }: Props) {
  const bewertung = ampelBewertung(ergebnis.amortisationJahre)
  const ampel = AMPEL_CONFIG[bewertung]

  const diagrammDaten = [
    { name: "Thermische Arbeit", wert: Math.round(ergebnis.thermischeArbeitKwh), farbe: "#3b82f6" },
    { name: "Wärmeverlust", wert: Math.round(ergebnis.waermeverlustKwh), farbe: "#f97316" },
    { name: "Nutzbare Wärme", wert: Math.round(ergebnis.nettoWaermeKwh), farbe: "#22c55e" },
  ]

  const fmt = (n: number, stellen = 0) =>
    n.toLocaleString("de-DE", { maximumFractionDigits: stellen })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Ergebnisse</h2>
        <p className="text-sm text-gray-500 mt-1">Abwärmepotenzial & Wirtschaftlichkeit</p>
      </div>

      {/* Ampel */}
      <div className={`rounded-xl border p-4 ${ampel.border} ${ampel.bg}`}>
        <div className="flex items-center gap-3">
          <div className={`h-5 w-5 rounded-full ${ampel.color}`} />
          <div>
            <p className={`font-semibold ${ampel.textColor}`}>{ampel.label}</p>
            <p className="text-xs text-gray-500">
              Amortisation in {ergebnis.amortisationJahre === Infinity ? ">" : ""}{fmt(ergebnis.amortisationJahre, 1)} Jahren
            </p>
          </div>
        </div>
      </div>

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 gap-3">
        <KennzahlKarte
          label="Nutzbare Wärme/Jahr"
          wert={fmt(ergebnis.nettoWaermeKwh)}
          einheit="kWh/Jahr"
        />
        <KennzahlKarte
          label="Jährliche Ersparnis"
          wert={fmt(ergebnis.jaehrlicheErsparnis)}
          einheit="€/Jahr"
        />
        <KennzahlKarte
          label="Investitionskosten"
          wert={fmt(ergebnis.investitionskostenEuro)}
          einheit="€"
        />
        <KennzahlKarte
          label="CO₂-Einsparung"
          wert={fmt(ergebnis.co2EinsparungKg)}
          einheit="kg/Jahr"
        />
      </div>

      {/* Diagramm */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">Energievergleich (kWh/Jahr)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={diagrammDaten} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`${fmt(Number(v))} kWh`, ""]} />
            <Bar dataKey="wert" radius={[4, 4, 0, 0]}>
              {diagrammDaten.map((entry, i) => (
                <Cell key={i} fill={entry.farbe} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2 text-sm">
        <p className="font-medium text-gray-700">Berechnungsdetails</p>
        <div className="flex justify-between text-gray-600">
          <span>Wirkungsgrad η</span>
          <span>{(ergebnis.wirkungsgrad * 100).toFixed(0)} %</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Thermische Leistung</span>
          <span>{fmt(ergebnis.thermischeLeistungKw, 2)} kW</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Thermische Arbeit</span>
          <span>{fmt(ergebnis.thermischeArbeitKwh)} kWh</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Leitungsverluste</span>
          <span>{fmt(ergebnis.waermeverlustKwh)} kWh</span>
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
