import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root' })
export class FinanceService {

  allTransactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);

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
        tx.title.toLowerCase().includes(value)
      )
    );
  }
}
