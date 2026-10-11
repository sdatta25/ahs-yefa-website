// Back-out easing for a confident, slightly overshooting entrance.
export function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  const x = Math.min(Math.max(t, 0), 1)
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

export function easeOutCubic(t: number): number {
  const x = Math.min(Math.max(t, 0), 1)
  return 1 - Math.pow(1 - x, 3)
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
