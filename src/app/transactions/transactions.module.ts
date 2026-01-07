import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionItemComponent } from './transaction-item/transaction-item.component';
import { AmountColorDirective } from '../directives/amount-color.directive';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: TransactionListComponent }];

@NgModule({
  declarations: [
    TransactionListComponent,
    TransactionItemComponent,
    AmountColorDirective,
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule.forChild(routes)],
  exports: [
    TransactionListComponent,
    TransactionItemComponent,
    AmountColorDirective
  ],
})
export class TransactionsModule {}
