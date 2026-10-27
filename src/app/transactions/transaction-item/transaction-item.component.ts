import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Transaction } from '../../models/transaction';
<<<<<<< HEAD
=======
import { getCategoryColor } from '../../models/categories';
>>>>>>> aa1bc4e (Few improvements in dashboard with graphs and smart tips)

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrl: './transaction-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionItemComponent {
  @Input({ required: true }) transaction!: Transaction;
  @Output() delete = new EventEmitter<string>();

<<<<<<< HEAD
=======
  get categoryColor() {
    return getCategoryColor(this.transaction.category);
  }

>>>>>>> aa1bc4e (Few improvements in dashboard with graphs and smart tips)
  onDelete() {
    this.delete.emit(this.transaction.id);
  }

}
