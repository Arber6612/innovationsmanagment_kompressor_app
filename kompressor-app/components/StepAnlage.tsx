"use client"

import { AnlageData } from "@/types"

interface Props {
  data: AnlageData
  onChange: (data: AnlageData) => void
  onWeiter: () => void
}

export default function StepAnlage({ data, onChange, onWeiter }: Props) {
  function update(field: keyof AnlageData, value: string) {
    onChange({ ...data, [field]: parseFloat(value) || 0 })
  }

  const isValid = data.leistungKw >= 2.2 && data.betriebsstunden > 0 && data.alterJahre >= 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Schritt 1: Kompressordaten</h2>
        <p className="text-sm text-gray-500 mt-1">Angaben zur Kompressoranlage</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Elektrische Leistung P<sub>el</sub> (kW)
          </label>
          <input
            type="number"
            min="2.2"
            step="0.1"
            value={data.leistungKw || ""}
            onChange={(e) => update("leistungKw", e.target.value)}
            placeholder="z.B. 22"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Mindestens 2,2 kW</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Betriebsstunden pro Jahr (h)
          </label>
          <input
            type="number"
            min="0"
            max="8760"
            step="1"
            value={data.betriebsstunden || ""}
            onChange={(e) => update("betriebsstunden", e.target.value)}
            placeholder="z.B. 2000"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alter der Anlage (Jahre)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={data.alterJahre || ""}
            onChange={(e) => update("alterJahre", e.target.value)}
            placeholder="z.B. 5"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Bestimmt den Wirkungsgrad η (0–5 J: 95% | 6–10 J: 90% | 11–15 J: 85% | &gt;15 J: 80%)
          </p>
        </div>
      </div>

      <button
        onClick={onWeiter}
        disabled={!isValid}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed touch-manipulation"
      >
        Weiter →
      </button>
    </div>
  )
}
