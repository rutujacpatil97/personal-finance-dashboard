import { Transaction } from '../models/transaction';

export interface MonthTotals {
  label: string;
  income: number;
  expenses: number;
}

// Income and expenses for each of the last few months (this month is the last one)
export function getMonthlyTotals(transactions: Transaction[], count = 6): MonthTotals[] {
  const now = new Date();
  const months: MonthTotals[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const inMonth = transactions.filter((t) => (t.date || '').startsWith(key));

    months.push({
      label: d.toLocaleString('en-US', { month: 'short' }),
      income: inMonth.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
      expenses: inMonth.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0),
    });
  }

  return months;
}

// ---- line chart maths (plain SVG, no chart library) ----

const WIDTH = 640;
const HEIGHT = 260;
const LEFT = 56;
const RIGHT = 20;
const TOP = 20;
const BOTTOM = 36;

export interface TrendChart {
  left: number;
  right: number;
  incomePoints: string;
  expensePoints: string;
  dots: { x: number; y: number; color: string; tip: string }[];
  grid: { y: number; label: string }[];
  labels: { x: number; text: string }[];
}

// pick a round step for the y axis (1k, 2k, 2.5k, 5k, 10k ...)
function niceStep(maxValue: number): number {
  if (maxValue <= 0) return 1000;
  const raw = maxValue / 4;
  const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
  const multiplier = [1, 2, 2.5, 5, 10].find((m) => m * magnitude >= raw) ?? 10;
  return multiplier * magnitude;
}

function formatAxis(value: number): string {
  return value >= 1000 ? `${value / 1000}k` : String(value);
}

export function buildTrendChart(months: MonthTotals[]): TrendChart {
  const biggest = Math.max(...months.map((m) => Math.max(m.income, m.expenses)), 0);
  const step = niceStep(biggest);
  const max = step * 4;

  const plotWidth = WIDTH - LEFT - RIGHT;
  const plotHeight = HEIGHT - TOP - BOTTOM;
  const x = (i: number) => LEFT + (months.length > 1 ? (i * plotWidth) / (months.length - 1) : plotWidth / 2);
  const y = (value: number) => TOP + (1 - value / max) * plotHeight;

  const money = (n: number) => '₹' + n.toLocaleString('en-IN');

  const dots: TrendChart['dots'] = [];
  months.forEach((m, i) => {
    dots.push({ x: x(i), y: y(m.income), color: '#1c8133', tip: `${m.label} income: ${money(m.income)}` });
    dots.push({ x: x(i), y: y(m.expenses), color: '#dc3545', tip: `${m.label} expenses: ${money(m.expenses)}` });
  });

  return {
    left: LEFT,
    right: WIDTH - RIGHT,
    incomePoints: months.map((m, i) => `${x(i)},${y(m.income)}`).join(' '),
    expensePoints: months.map((m, i) => `${x(i)},${y(m.expenses)}`).join(' '),
    dots,
    grid: [0, 1, 2, 3, 4].map((n) => ({ y: y(n * step), label: formatAxis(n * step) })),
    labels: months.map((m, i) => ({ x: x(i), text: m.label })),
  };
}
