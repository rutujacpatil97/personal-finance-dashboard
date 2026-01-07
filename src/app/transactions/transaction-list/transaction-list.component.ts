import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FinanceService } from '../../services/finance.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent {
  search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(public finance: FinanceService, private fb: FormBuilder) {}

  form!: FormGroup;

  ngOnInit() {
    this.finance.loadTransactions();

    this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
        )
      .subscribe((term) =>
       this.finance.filterTransactions(term)
       );

    this.form = this.fb.group({
      title: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      type: ['expense', Validators.required],
    });
  }

  onSearch(event: Event) {
    this.search$.next((event.target as HTMLInputElement).value);
  }

  getNextId(): string {
    const list = this.finance.allTransactions();
    if (!list.length) return '1';

    const maxId = Math.max(...list.map((tx) => Number(tx.id)));
    return String(maxId + 1);
  }

  addTransaction() {
    if (this.form.invalid) return;

    const { title, amount, type } = this.form.value;

    this.finance.addTransaction({
      id: this.getNextId(),
      title,
      amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
    });

    this.form.reset({ type: 'expense' });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
