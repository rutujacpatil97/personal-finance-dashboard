import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionItemComponent {
  @Input({ required: true }) transaction!: Transaction;
  @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.transaction.id);
  }

}
