export interface CategoryData {
  category: string;
  amount: number;
}

export interface MonthData {
  month: string;
  amount: number;
}

export interface Transaction {
  id: string | number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  description?: string;
}

export interface DailyTransactionData {
  date: string;
  income: number;
  expense: number;
} 