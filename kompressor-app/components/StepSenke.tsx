"use client"

import { useState } from "react"
import { SenkeData } from "@/types"

interface Props {
  data: SenkeData
  onChange: (data: SenkeData) => void
  onZurueck: () => void
  onBerechnen: () => void
}

export default function StepSenke({ data, onChange, onZurueck, onBerechnen }: Props) {
  const [rawGaspreis, setRawGaspreis] = useState(data.gaspreisEuroKwh > 0 ? data.gaspreisEuroKwh.toString() : "")

  function update(field: keyof SenkeData, value: string) {
    onChange({ ...data, [field]: parseFloat(value) || 0 })
  }

  function updateGaspreis(value: string) {
    setRawGaspreis(value)
    const parsed = parseFloat(value.replace(",", "."))
    if (!isNaN(parsed)) onChange({ ...data, gaspreisEuroKwh: parsed })
  }

  const isValid = data.distanzM >= 0 && data.gaspreisEuroKwh > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Schritt 2: Abwärmenutzung (Senke)</h2>
        <p className="text-sm text-gray-500 mt-1">Angaben zur geplanten Wärmenutzung</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperaturbedarf (°C)
          </label>
          <input
            type="number"
            step="1"
            value={data.temperaturbedarf || ""}
            onChange={(e) => update("temperaturbedarf", e.target.value)}
            placeholder="z.B. 60"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Distanz zur Quelle L (m)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={data.distanzM || ""}
            onChange={(e) => update("distanzM", e.target.value)}
            placeholder="z.B. 30"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Leitungslänge inkl. Höhenunterschied</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anzahl Wanddurchbrüche W
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={data.wanddurchbrueche || ""}
            onChange={(e) => update("wanddurchbrueche", e.target.value)}
            placeholder="z.B. 2"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">350 € pro Wanddurchbruch</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fixkosten Wärmerückgewinnung K (€)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            value={data.fixkostenEuro || ""}
            onChange={(e) => update("fixkostenEuro", e.target.value)}
            placeholder="z.B. 5000"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gaspreis (€/kWh)
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={rawGaspreis}
            onChange={(e) => updateGaspreis(e.target.value)}
            placeholder="z.B. 0.035"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Aktueller Gaspreis ca. 0,035 €/kWh</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onZurueck}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 touch-manipulation"
        >
          ← Zurück
        </button>
        <button
          onClick={onBerechnen}
          disabled={!isValid}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
        >
          Berechnen
        </button>
      </div>
    </div>
  )
}
