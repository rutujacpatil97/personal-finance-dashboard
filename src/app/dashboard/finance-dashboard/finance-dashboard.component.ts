import { Component, computed, effect } from '@angular/core';
import { FinanceService } from '../../services/finance.service';
import { getAdvice, getCategories } from '../../utils/spending';
import { getBudgetRows } from '../../utils/budgets';
import { buildTrendChart, getMonthlyTotals } from '../../utils/trends';

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrl: './finance-dashboard.component.scss'
})
export class FinanceDashboardComponent {

  income = computed(() =>
    this.finance.allTransactions()
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  expenses = computed(() =>
    this.finance.allTransactions()
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  );

  savingsRate = computed(() =>
    this.income() > 0
      ? Math.round(((this.income() - this.expenses()) / this.income()) * 100)
      : 0
  );

  categories = computed(() => getCategories(this.finance.allTransactions()));

  months = computed(() => getMonthlyTotals(this.finance.allTransactions()));

  trend = computed(() => buildTrendChart(this.months()));

  budgetRows = computed(() =>
    getBudgetRows(this.finance.allTransactions(), this.finance.budgets())
  );

  advice = computed(() =>
    getAdvice({
      income: this.income(),
      expenses: this.expenses(),
      balance: this.finance.totalBalance(),
      categories: this.categories(),
      budgetRows: this.budgetRows(),
      months: this.months(),
    })
  );

  constructor(public finance : FinanceService) {
    effect(() => {
      console.log(
        '[TransactionList effect] Transactions:',
        this.finance.transactions()
      );
    });

    effect(() => {
      console.log(
        '[FinanceService effect] TotalBalance:',
        this.finance.totalBalance()
      );
    });

  }

  ngOnInit() {
    this.finance.loadTransactions();
    this.finance.loadBudgets();
  }

  onBudgetChange(category: string, event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.finance.setBudget(category, value);
  }
  
}
