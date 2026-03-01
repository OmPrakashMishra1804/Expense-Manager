export interface Transaction {
  _id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFormData {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
  description: string;
}

export interface TransactionsResponse {
  success: boolean;
  data?: Transaction[];
  message?: string;
}

export interface TransactionResponse {
  success: boolean;
  data?: Transaction;
  message?: string;
}

export interface PaginatedTransactionsResponse {
  success: boolean;
  data?: {
    transactions: Transaction[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
  message?: string;
} 