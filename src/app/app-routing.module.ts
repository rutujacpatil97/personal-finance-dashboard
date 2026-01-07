import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinanceDashboardComponent } from './dashboard/finance-dashboard/finance-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' , pathMatch: 'full' },
  { path: 'dashboard', component: FinanceDashboardComponent },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
