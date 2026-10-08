export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function formatTime12h(time: string): string {
  const [hStr, mStr] = time.split(":")
  const h = Number(hStr)
  const period = h >= 12 ? "PM" : "AM"
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${mStr} ${period} ET`
}

export function formatMonthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function formatDateLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export type CalendarCell = {
  iso: string
  day: number
  inMonth: boolean
}

export function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const cells: CalendarCell[] = []

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const d = new Date(year, month - 1, day)
    cells.push({ iso: isoOf(d), day, inMonth: false })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day)
    cells.push({ iso: isoOf(d), day, inMonth: true })
  }

  while (cells.length % 7 !== 0 || cells.length < 42) {
    const idx = cells.length - (startWeekday + daysInMonth)
    const d = new Date(year, month + 1, idx + 1)
    cells.push({ iso: isoOf(d), day: d.getDate(), inMonth: false })
  }

  return cells
}

function isoOf(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}
