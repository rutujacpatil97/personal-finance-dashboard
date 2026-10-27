// Local date as yyyy-mm-dd (toISOString would use UTC and can be a day off)
export function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "2026-10" for the current month
export function currentMonthKey(): string {
  return todayString().slice(0, 7);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
