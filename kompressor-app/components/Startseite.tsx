"use client"

interface Props {
  onStart: () => void
}

const STATS = [
  { wert: "96%", label: "der Verdichtungsarbeit als Abwärme rückgewinnbar" },
  { wert: "16 Mrd.", label: "kWh Strom verbrauchen Kompressoren jährlich in Deutschland" },
  { wert: "430 Mio. €", label: "potenzielle Kosteneinsparung pro Jahr bundesweit" },
]

const FEATURES = [
  { icon: "⚡", titel: "Abwärmepotenzial", text: "Berechnung der nutzbaren thermischen Energie deiner Anlage" },
  { icon: "📊", titel: "Wirtschaftlichkeit", text: "Amortisationszeit und jährliche Ersparnis auf einen Blick" },
  { icon: "🌱", titel: "CO₂-Einsparung", text: "Umweltauswirkung der Abwärmenutzung sichtbar machen" },
]

export default function Startseite({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 flex flex-col">
      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-16 pb-10">
        <div className="mb-4 rounded-2xl bg-blue-600 p-4 shadow-lg">
          <span className="text-4xl">🏭</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          Kompressor-<br />Abwärme Rechner
        </h1>
        <p className="mt-3 text-base text-gray-500 max-w-xs">
          Berechne das Abwärmepotenzial deiner Kompressoranlage und analysiere die Wirtschaftlichkeit einer Wärmerückgewinnung.
        </p>
        <button
          onClick={onStart}
          className="mt-8 w-full max-w-xs rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-md transition hover:bg-blue-700 active:scale-95"
        >
          Jetzt berechnen →
        </button>
        <p className="mt-3 text-xs text-gray-400">Kostenlos · Keine Registrierung</p>
      </div>

      {/* Stats */}
      <div className="px-6 mb-8">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm divide-y divide-gray-100">
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl font-bold text-blue-600 min-w-[80px]">{s.wert}</span>
              <span className="text-sm text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-6 mb-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Was die App berechnet</p>
        <div className="space-y-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl bg-white border border-gray-200 px-5 py-4 shadow-sm">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{f.titel}</p>
                <p className="text-xs text-gray-500 mt-0.5">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pb-8 text-center">
        <p className="text-xs text-gray-400">Hochschule Osnabrück · Innovationsmanagement · Gruppe 8</p>
      </div>
    </div>
  )
}
