import { Component, effect } from '@angular/core';
import { FinanceService } from '../../services/finance.service';

@Component({
  selector: 'app-finance-dashboard',
  templateUrl: './finance-dashboard.component.html',
  styleUrl: './finance-dashboard.component.scss'
})
export class FinanceDashboardComponent {

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
  }
  
}
