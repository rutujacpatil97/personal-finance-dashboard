import { getCategoryColor } from '../models/categories';
import { Transaction } from '../models/transaction';
import { BudgetRow } from './budgets';
import { MonthTotals } from './trends';

export interface CategorySlice {
  name: string;
  color: string;
  total: number;
  percent: number;
  dash: string;   // used by the donut chart
  offset: number; // used by the donut chart
}

export interface Advice {
  type: 'good' | 'warn' | 'tip';
  text: string;
}

export function getCategories(transactions: Transaction[]): CategorySlice[] {
  const expenses = transactions.filter((t) => t.amount < 0);
  const totalSpent = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  if (!totalSpent) return [];

  // add up the spending for each category
  const totals = new Map<string, number>();
  for (const t of expenses) {
    const name = t.category || 'Other';
    totals.set(name, (totals.get(name) ?? 0) + Math.abs(t.amount));
  }

  // biggest first, then work out the donut segments
  let covered = 0;
  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, total]) => {
      const percent = (total / totalSpent) * 100;
      // small gap between segments so they look separate
      const visible = Math.max(percent - 0.6, 0);
      const slice = {
        name,
        color: getCategoryColor(name),
        total,
        percent,
        dash: `${visible} ${100 - visible}`,
        offset: 25 - covered,
      };
      covered += percent;
      return slice;
    });
}

interface AdviceInput {
  income: number;
  expenses: number;
  balance: number;
  categories: CategorySlice[];
  budgetRows: BudgetRow[];
  months: MonthTotals[]; // last item is this month
}

const money = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

export function getAdvice(data: AdviceInput): Advice[] {
  const { income, expenses, balance, categories, budgetRows, months } = data;
  const advice: Advice[] = [];

  if (!income && !expenses) return advice;

  // 1. savings rate
  if (income > 0) {
    const rate = Math.round(((income - expenses) / income) * 100);
    if (rate < 0) {
      advice.push({ type: 'warn', text: `You are spending more than you earn (${Math.abs(rate)}% over your income). Try cutting a few non-essential expenses first.` });
    } else if (rate < 20) {
      advice.push({ type: 'warn', text: `You are saving ${rate}% of your income. A common target is 20%, so there is some room to improve.` });
    } else {
      advice.push({ type: 'good', text: `Great job! You are saving ${rate}% of your income, which is above the usual 20% target.` });
    }
  }

  // 2. budgets for this month
  for (const row of budgetRows.filter((r) => r.status === 'over')) {
    advice.push({ type: 'warn', text: `You are over your ${row.category} budget this month by ${money(row.spent - row.limit)}.` });
  }
  const nearLimit = budgetRows.find((r) => r.status === 'warn');
  if (nearLimit) {
    advice.push({ type: 'tip', text: `You have used ${Math.round(nearLimit.percent)}% of your ${nearLimit.category} budget already. Go easy for the rest of the month.` });
  }

  // 3. this month compared to last month
  if (months.length >= 2) {
    const thisMonth = months[months.length - 1].expenses;
    const lastMonth = months[months.length - 2].expenses;
    if (lastMonth > 0) {
      const change = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
      if (change >= 15) {
        advice.push({ type: 'warn', text: `Your spending this month is ${change}% higher than last month.` });
      } else if (change <= -15) {
        advice.push({ type: 'good', text: `Your spending this month is ${Math.abs(change)}% lower than last month. Keep it up!` });
      }
    }
  }

  // 4. biggest spending category
  const top = categories[0];
  if (top && top.percent >= 30) {
    advice.push({ type: 'warn', text: `${top.name} takes ${Math.round(top.percent)}% of your spending. Check if anything there can be reduced.` });
  } else if (top) {
    advice.push({ type: 'tip', text: `Your biggest spending area is ${top.name} (${Math.round(top.percent)}% of expenses).` });
  }

  // 5. small daily habits
  const food = categories.find((c) => c.name === 'Food & Dining');
  if (food && food !== top && food.percent >= 20) {
    advice.push({ type: 'tip', text: `Food & Dining is ${Math.round(food.percent)}% of your expenses. Cooking at home a bit more could save a noticeable amount.` });
  }
  const fun = categories.find((c) => c.name === 'Entertainment');
  if (fun && fun.percent >= 10) {
    advice.push({ type: 'tip', text: `Entertainment and subscriptions are ${Math.round(fun.percent)}% of your expenses. Review subscriptions you rarely use.` });
  }

  // 6. cushion
  if (expenses > 0 && balance / expenses >= 3) {
    advice.push({ type: 'good', text: 'Your balance can cover your recorded spending several times over. Consider putting some of it into savings or investments.' });
  }

  return advice;
}
