import { Budget } from '../models/budget';
import { EXPENSE_CATEGORIES } from '../models/categories';
import { Transaction } from '../models/transaction';
import { currentMonthKey } from './dates';

export interface BudgetRow {
  category: string;
  color: string;
  spent: number;
  limit: number;      // 0 means no budget set
  percent: number;    // for the bar, max 100
  status: 'none' | 'ok' | 'warn' | 'over';
}

// How much was spent in each category this month compared to its limit
export function getBudgetRows(transactions: Transaction[], budgets: Budget[]): BudgetRow[] {
  const month = currentMonthKey();

  return EXPENSE_CATEGORIES.map((cat) => {
    const spent = transactions
      .filter((t) => t.amount < 0 && t.category === cat.name && (t.date || '').startsWith(month))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const limit = budgets.find((b) => b.category === cat.name)?.limit ?? 0;

    let status: BudgetRow['status'] = 'none';
    if (limit > 0) {
      status = spent > limit ? 'over' : spent >= limit * 0.8 ? 'warn' : 'ok';
    }

    return {
      category: cat.name,
      color: cat.color,
      spent,
      limit,
      percent: limit > 0 ? Math.min((spent / limit) * 100, 100) : 0,
      status,
    };
  });
}
