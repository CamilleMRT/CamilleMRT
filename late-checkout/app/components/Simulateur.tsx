'use client'

import { useState, useMemo } from 'react'
import {
  BASE_NIGHT,
  CAP_REF,
  OCC_RATE,
  NIGHTS_PER_MONTH,
  COMMISSION,
  RANGE_LOW,
  RANGE_HIGH,
  QUARTIERS,
} from '@/lib/simulator-config'

const TYPES = [
  { key: 'studio', label: 'Studio' },
  { key: 't2', label: 'T2' },
  { key: 't3', label: 'T3' },
  { key: 't4', label: 'T4+' },
]

function computeEstimate(
  type: string,
  quartierCoeff: number,
  cap: number
): { low: number; high: number; net: number } {
  const capRef = CAP_REF[type] ?? 2
  const capAdj = Math.max(0.7, 1 + (cap - capRef) * 0.06)
  const nightly = BASE_NIGHT[type] * quartierCoeff * capAdj
  const net = nightly * OCC_RATE * NIGHTS_PER_MONTH * (1 - COMMISSION)
  const low = Math.round((net * RANGE_LOW) / 10) * 10
  const high = Math.round((net * RANGE_HIGH) / 10) * 10
  return { low, high, net }
}

function getRecommendation(net: number): string {
  if (net >= 2600 || net >= 1400) return 'Sérénité'
  return 'Essentiel'
}

export default function Simulateur() {
  const [type, setType] = useState('t2')
  const [quartierIndex, setQuartierIndex] = useState(0)
  const [cap, setCap] = useState(3)

  const quartier = QUARTIERS[quartierIndex]

  const { low, high, net } = useMemo(
    () => computeEstimate(type, quartier.coeff, cap),
    [type, quartier.coeff, cap]
  )

  const reco = getRecommendation(net)

  const capMin = type === 'studio' ? 1 : type === 't2' ? 2 : type === 't3' ? 3 : 4
  const capMax = type === 'studio' ? 4 : type === 't2' ? 6 : type === 't3' ? 8 : 12

  function formatEur(n: number) {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
  }

  return (
    <section id="simulateur">
      <div className="wrap">
        <div className="sim-grid">
          <div className="sim-head">
            <span className="eyebrow">Simulateur</span>
            <h2>
              Combien peut{' '}
              <em className="display-italic">rapporter</em>{' '}
              votre bien ?
            </h2>
            <p>
              Obtenez une estimation personnalisée de vos revenus nets
              mensuels en quelques secondes. Sans engagement.
            </p>
          </div>

          <div className="sim-panel">
            {/* Type de logement */}
            <div className="field">
              <label>Type de logement</label>
              <div className="seg">
                {TYPES.map((t) => (
                  <button
                    key={t.key}
                    aria-pressed={type === t.key}
                    onClick={() => {
                      setType(t.key)
                      const newMin = t.key === 'studio' ? 1 : t.key === 't2' ? 2 : t.key === 't3' ? 3 : 4
                      setCap(Math.max(cap, newMin))
                    }}
                    type="button"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quartier */}
            <div className="field">
              <label htmlFor="quartier-select">Quartier / secteur</label>
              <select
                id="quartier-select"
                value={quartierIndex}
                onChange={(e) => setQuartierIndex(Number(e.target.value))}
              >
                {QUARTIERS.map((q, i) => (
                  <option key={i} value={i}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capacité */}
            <div className="field">
              <label htmlFor="cap-range">Capacité (voyageurs)</label>
              <div className="range-row">
                <input
                  id="cap-range"
                  type="range"
                  min={capMin}
                  max={capMax}
                  step={1}
                  value={cap}
                  onChange={(e) => setCap(Number(e.target.value))}
                />
                <span className="range-val">{cap}</span>
              </div>
            </div>

            {/* Output */}
            <div className="sim-out">
              <p className="small">Estimation revenus nets / mois</p>
              <div className="sim-amount">
                {formatEur(low)}&nbsp;–&nbsp;{formatEur(high)}
              </div>
              <p className="sim-sub">
                Après commission Late Checkout ({Math.round(COMMISSION * 100)} %), hors charges.
              </p>

              <div className="sim-reco">
                Formule recommandée : <b>{reco}</b> — idéale pour votre profil.
              </div>
            </div>

            <a href="#formules" className="btn btn-primary">
              Voir la formule {reco}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            <p className="disclaimer">
              Estimation indicative basée sur les performances moyennes du marché bordelais.
              Résultats non garantis.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
