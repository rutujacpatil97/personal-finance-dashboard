import { Transaction } from '../models/transaction';
import { todayString } from './dates';

// Wrap in quotes if the value has a comma, quote or new line.
// Text starting with = + - @ gets a ' in front so Excel does not treat it as a formula.
function cell(value: string | number, isText = false): string {
  let text = String(value ?? '');
  if (isText && /^[=+\-@]/.test(text)) {
    text = "'" + text;
  }
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function exportTransactionsCsv(transactions: Transaction[]) {
  const header = ['Date', 'Description', 'Category', 'Type', 'Amount'];

  const rows = transactions.map((t) => [
    cell(t.date),
    cell(t.title, true),
    cell(t.category, true),
    cell(t.amount < 0 ? 'Expense' : 'Income'),
    cell(t.amount),
  ]);

  const csv = [header, ...rows].map((r) => r.join(',')).join('\r\n');

  // the \ufeff at the start helps Excel read the file as UTF-8
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-${todayString()}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
