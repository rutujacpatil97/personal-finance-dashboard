export interface Category {
  name: string;
  color: string;
}

export const EXPENSE_CATEGORIES: Category[] = [
  { name: 'Food & Dining', color: '#f59e0b' },
  { name: 'Bills & Utilities', color: '#3b82f6' },
  { name: 'Transport', color: '#14b8a6' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Health & Fitness', color: '#22c55e' },
  { name: 'Entertainment', color: '#8b5cf6' },
  { name: 'Giving', color: '#f97316' },
  { name: 'Other', color: '#94a3b8' },
];

export const INCOME_CATEGORIES: Category[] = [
  { name: 'Salary', color: '#16a34a' },
  { name: 'Freelance', color: '#0ea5e9' },
  { name: 'Investments', color: '#a855f7' },
  { name: 'Other Income', color: '#64748b' },
];

export function getCategoryColor(name: string): string {
  const all = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
  return all.find((c) => c.name === name)?.color ?? '#94a3b8';
}
