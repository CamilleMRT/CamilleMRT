export const BASE_NIGHT: Record<string, number> = {
  studio: 62,
  t2: 88,
  t3: 128,
  t4: 175,
}

export const CAP_REF: Record<string, number> = {
  studio: 2,
  t2: 3,
  t3: 5,
  t4: 7,
}

export const OCC_RATE = 0.70
export const NIGHTS_PER_MONTH = 30
export const COMMISSION = 0.20
export const RANGE_LOW = 0.86
export const RANGE_HIGH = 1.12

export const QUARTIERS = [
  { label: "Bordeaux — Triangle d'Or / centre", coeff: 1.18 },
  { label: 'Bordeaux — Chartrons / Saint-Pierre', coeff: 1.12 },
  { label: 'Bordeaux — Saint-Michel / Bastide', coeff: 1.00 },
  { label: 'Métropole — Talence, Pessac, Mérignac', coeff: 0.92 },
  { label: "Bassin d'Arcachon", coeff: 1.25 },
]
