import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction';
<<<<<<< HEAD
=======
import { Budget } from '../models/budget';
>>>>>>> aa1bc4e (Few improvements in dashboard with graphs and smart tips)

@Injectable({ providedIn: 'root' })
export class FinanceService {

  allTransactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);
<<<<<<< HEAD
=======
  budgets = signal<Budget[]>([]);
>>>>>>> aa1bc4e (Few improvements in dashboard with graphs and smart tips)

  transactions = this.filteredTransactions.asReadonly();

  totalBalance = computed(() =>
    this.allTransactions().reduce((sum, t) => sum + t.amount, 0)
  );

  constructor(private http: HttpClient) {}

  loadTransactions() {

    if (this.allTransactions().length) return;

    this.http
      .get<Transaction[]>('http://localhost:3000/transactions')
      .subscribe((data) => {
        this.allTransactions.set(data);
        this.filteredTransactions.set(data);
      });
  }

  addTransaction(tx: Transaction) {
    this.http
    .post<Transaction>('http://localhost:3000/transactions', tx)
    .subscribe((savedTx) => {
      this.allTransactions.update(list => [...list, savedTx]);
      this.filteredTransactions.set(this.allTransactions());
    });
  }

  deleteTransaction(id: string) {
    this.http
    .delete(`http://localhost:3000/transactions/${id}`)
    .subscribe(() => {
      this.allTransactions.update(list =>
        list.filter(tx => tx.id !== id)
      );
      this.filteredTransactions.set(this.allTransactions());
    });
  }

  filterTransactions(term: string) {
    const value = term.toLowerCase().trim();

    if (!value) {
      this.filteredTransactions.set(this.allTransactions());
      return;
    }

    this.filteredTransactions.set(
      this.allTransactions().filter((tx) =>
<<<<<<< HEAD
        tx.title.toLowerCase().includes(value)
      )
    );
  }
=======
        tx.title.toLowerCase().includes(value) ||
        (tx.category || '').toLowerCase().includes(value)
      )
    );
  }

  loadBudgets() {
    this.http
      .get<Budget[]>('http://localhost:3000/budgets')
      .subscribe((data) => this.budgets.set(data));
  }

  // limit of 0 (or empty) removes the budget for that category
  setBudget(category: string, limit: number) {
    const url = 'http://localhost:3000/budgets';
    const existing = this.budgets().find((b) => b.category === category);
    const hasLimit = Number.isFinite(limit) && limit > 0;

    if (existing && !hasLimit) {
      this.http
        .delete(`${url}/${encodeURIComponent(existing.id)}`)
        .subscribe(() => {
          this.budgets.update((list) => list.filter((b) => b.id !== existing.id));
        });
    } else if (existing) {
      this.http
        .patch<Budget>(`${url}/${encodeURIComponent(existing.id)}`, { limit })
        .subscribe((saved) => {
          this.budgets.update((list) => list.map((b) => (b.id === saved.id ? saved : b)));
        });
    } else if (hasLimit) {
      this.http
        .post<Budget>(url, { id: category, category, limit })
        .subscribe((saved) => {
          this.budgets.update((list) => [...list, saved]);
        });
    }
  }
>>>>>>> aa1bc4e (Few improvements in dashboard with graphs and smart tips)
}
