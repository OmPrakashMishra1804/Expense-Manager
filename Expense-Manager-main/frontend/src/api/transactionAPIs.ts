import { Transaction, TransactionFormData } from "../types/transactions";

// Fetch all transactions (both income and expense)
export async function fetchAllTransactions(searchQuery : string, currentPage: number): Promise<Transaction[]> {
  const token = localStorage.getItem("expToken");
  console.log(currentPage);
  try {
    // Fetch both income and expense transactions
    const [expenseRes, incomeRes] = await Promise.all([
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense/?searchQuery=${searchQuery}&page=${currentPage}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      }),
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/income/?searchQuery=${searchQuery}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      })
    ]);

    const expenseData = await expenseRes.json();
    const incomeData = await incomeRes.json();

    if (!expenseRes.ok) throw new Error(expenseData.message || 'Failed to fetch expenses');
    if (!incomeRes.ok) throw new Error(incomeData.message || 'Failed to fetch income');

    // Combine and format the transactions
    const expenses = expenseData.data.map((expense: any) => ({
      ...expense,
      type: 'expense'
    }));
    
    const income = incomeData.data.map((income: any) => ({
      ...income,
      type: 'income'
    }));

    // Combine and sort by date (newest first)
    return [...expenses, ...income].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

// Add a new transaction (either income or expense)
export async function addTransaction(transaction: TransactionFormData): Promise<{ success: boolean, message: string }> {
  const token = localStorage.getItem("expToken");
  const endpoint = transaction.type === 'income' ? 'income' : 'expense';
  
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(transaction),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Failed to add ${transaction.type}`);

    return { 
      success: true, 
      message: data.message || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} added successfully` 
    };
  } catch (error) {
    console.error(`Error adding ${transaction.type}:`, error);
    throw error;
  }
}

// Delete a transaction (either income or expense)
export async function deleteTransaction(id: string, type: 'income' | 'expense'): Promise<{ success: boolean, message: string }> {
  const token = localStorage.getItem("expToken");
  const endpoint = type === 'income' ? 'income' : 'expense';
  
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/${endpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Failed to delete ${type}`);

    return { 
      success: true, 
      message: data.message || `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully` 
    };
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
    throw error;
  }
} 

// Update an existing transaction
export async function updateTransaction(id: string, type: 'income' | 'expense', transaction: TransactionFormData): Promise<{ success: boolean, message: string }> {
  const token = localStorage.getItem("expToken");
  const endpoint = type === 'income' ? 'income' : 'expense';
  
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(transaction),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Failed to update ${transaction.type}`);

    return { 
      success: true, 
      message: data.message || `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} updated successfully` 
    };
  } catch (error) {
    console.error(`Error updating ${transaction.type}:`, error);
    throw error;
  }
}

// Fetch daily transaction data for the TransactionsOverview graph
export async function fetchDailyTransactions(timeframe: 'week' | 'month' | '3months' | 'year' | 'all' = 'month'): Promise<{ date: string; income: number; expense: number }[]> {
  const token = localStorage.getItem("expToken");
  try {
    // Fetch both income and expense transactions
    const [expenseRes, incomeRes] = await Promise.all([
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/expense`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      }),
      fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/income`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      })
    ]);

    const expenseData = await expenseRes.json();
    const incomeData = await incomeRes.json();

    if (!expenseRes.ok) throw new Error(expenseData.message || 'Failed to fetch expenses');
    if (!incomeRes.ok) throw new Error(incomeData.message || 'Failed to fetch income');

    // Calculate date cutoff based on timeframe
    const now = new Date();
    let cutoffDate = new Date();
    
    switch(timeframe) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        cutoffDate = new Date(0); // Beginning of time
        break;
    }

    // Get all transactions
    const expenses = expenseData.data
      .filter((expense: any) => new Date(expense.date) >= cutoffDate)
      .map((expense: any) => ({
        ...expense,
        type: 'expense',
        date: new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      }));
    
    const income = incomeData.data
      .filter((income: any) => new Date(income.date) >= cutoffDate)
      .map((income: any) => ({
        ...income,
        type: 'income',
        date: new Date(income.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
      }));

    // Combine all transactions
    const allTransactions = [...expenses, ...income];
    
    // Group by date
    const groupedByDate = allTransactions.reduce((acc: Record<string, { income: number; expense: number }>, transaction: any) => {
      const { date, amount, type } = transaction;
      
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 };
      }
      
      if (type === 'income') {
        acc[date].income += amount;
      } else {
        acc[date].expense += amount;
      }
      
      return acc;
    }, {});

    // Convert to array format needed by the chart
    const result = Object.entries(groupedByDate).map(([date, values]) => ({
      date,
      income: values.income,
      expense: values.expense
    }));

    // Sort by date
    return result.sort((a, b) => {
      // Parse dates like "Jan 01" to compare them
      const dateA = new Date(`${a.date} ${new Date().getFullYear()}`);
      const dateB = new Date(`${b.date} ${new Date().getFullYear()}`);
      return dateA.getTime() - dateB.getTime();
    });
  } catch (error) {
    console.error("Error fetching daily transactions:", error);
    throw error;
  }
} 