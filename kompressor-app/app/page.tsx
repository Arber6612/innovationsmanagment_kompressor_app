"use client"

import React, { useState } from "react"
import Startseite from "@/components/Startseite"
import StepAnlage from "@/components/StepAnlage"
import StepSenke from "@/components/StepSenke"
import Ergebnis from "@/components/Ergebnis"
import { berechneErgebnis } from "@/lib/berechnung"
import { AnlageData, SenkeData, Ergebnis as ErgebnisType } from "@/types"

const STEPS = ["Kompressor", "Abwärme", "Ergebnis"]

const defaultAnlage: AnlageData = { leistungKw: 0, betriebsstunden: 0, alterJahre: 0 }
const defaultSenke: SenkeData = {
  temperaturbedarf: 0,
  distanzM: 0,
  wanddurchbrueche: 0,
  fixkostenEuro: 0,
  gaspreisEuroKwh: 0.035,
}

export default function Home() {
  const [gestartet, setGestartet] = useState(false)
  const [schritt, setSchritt] = useState(0)
  const [anlage, setAnlage] = useState<AnlageData>(defaultAnlage)
  const [senke, setSenke] = useState<SenkeData>(defaultSenke)
  const [ergebnis, setErgebnis] = useState<ErgebnisType | null>(null)

  function handleBerechnen() {
    const result = berechneErgebnis(anlage, senke)
    setErgebnis(result)
    setSchritt(2)
  }

  function handleNeustart() {
    setAnlage(defaultAnlage)
    setSenke(defaultSenke)
    setErgebnis(null)
    setSchritt(0)
    setGestartet(false)
  }

  if (!gestartet) {
    return <Startseite onStart={() => setGestartet(true)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      {/* Header */}
      <div className="w-full max-w-md mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kompressor-Abwärme</h1>
        <p className="text-sm text-gray-500">Abwärmepotenzial & Wirtschaftlichkeit berechnen</p>
      </div>

      {/* Stepper */}
      <div className="w-full max-w-xs mb-6 flex items-start">
        {STEPS.map((label, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div className="flex-1 flex items-start pt-[18px]">
                <div className={`h-0.5 w-full mx-2 ${i <= schritt ? "bg-blue-600" : "bg-gray-200"}`} />
              </div>
            )}
            <div className="flex flex-col items-center w-14">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${i < schritt ? "bg-blue-600 text-white" : i === schritt ? "bg-blue-600 text-white ring-2 ring-blue-300" : "bg-gray-100 text-gray-400"}`}
              >
                {i < schritt ? "✓" : i + 1}
              </div>
              <span className={`text-xs mt-2 text-center leading-tight ${i === schritt ? "text-blue-600 font-medium" : "text-gray-400"}`}>
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Karte */}
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
        {schritt === 0 && (
          <StepAnlage
            data={anlage}
            onChange={setAnlage}
            onWeiter={() => setSchritt(1)}
          />
        )}
        {schritt === 1 && (
          <StepSenke
            data={senke}
            onChange={setSenke}
            onZurueck={() => setSchritt(0)}
            onBerechnen={handleBerechnen}
          />
        )}
        {schritt === 2 && ergebnis && (
          <Ergebnis ergebnis={ergebnis} onNeustart={handleNeustart} />
        )}
      </div>
    </div>
  )
}
