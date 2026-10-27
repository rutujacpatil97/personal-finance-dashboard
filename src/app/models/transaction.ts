export interface Transaction {
  id: string;
  title: string;
  amount: number; // +income, -expense
  category: string;
  date: string; // yyyy-mm-dd
}
