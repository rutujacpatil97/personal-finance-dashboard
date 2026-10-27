import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/transaction';
import { getCategoryColor } from '../../models/categories';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionItemComponent {
  @Input({ required: true }) transaction!: Transaction;
  @Output() delete = new EventEmitter<string>();

  get categoryColor() {
    return getCategoryColor(this.transaction.category);
  }

  onDelete() {
    this.delete.emit(this.transaction.id);
  }

}
