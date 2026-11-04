// A small fake market: ROWS price series, COLS days each, every series
// trending up with day-to-day noise. Seeded, so it looks the same on every
// visit and in the 3D scene and its flat fallback.
export const COLS = 34
export const ROWS = 6

export type Bar = { col: number; row: number; height: number; up: boolean; today: boolean }

function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function buildMarket(): Bar[] {
  const rand = seeded(20262027)
  const bars: Bar[] = []
  for (let row = 0; row < ROWS; row++) {
    let value = 0.5 + rand() * 0.6
    let prev = value
    for (let col = 0; col < COLS; col++) {
      const drift = 0.11 + row * 0.006
      value = Math.max(0.18, value + drift + (rand() - 0.48) * 0.42)
      bars.push({ col, row, height: value, up: value >= prev, today: col === COLS - 1 })
      prev = value
    }
  }
  return bars
}
