import React, { useState, useEffect } from 'react';
import { fetchExpenseCategorySummary } from '../../api/expenseAPIs';
import { fetchIncomeCategorySummary } from '../../api/incomeAPIs';
import { fetchExpenseMonthlySummary } from '../../api/expenseAPIs';
import { fetchIncomeMonthlySummary } from '../../api/incomeAPIs';
import { fetchDailyTransactions, fetchAllTransactions } from '../../api/transactionAPIs';
import { CategoryData, MonthData, Transaction, DailyTransactionData } from '../../types/dashboard';
import { 
  BudgetOverviewCard, 
  CategoryPieChart, 
  RecentTransactions, 
  TopExpenseCategories, 
  TransactionsOverview 
} from '../../components/dashboard';
import { Loader2 } from 'lucide-react';

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<CategoryData[]>([]);
  const [incomeByMonth, setIncomeByMonth] = useState<MonthData[]>([]);
  const [expensesByMonth, setExpensesByMonth] = useState<MonthData[]>([]);
  const [dailyTransactions, setDailyTransactions] = useState<DailyTransactionData[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | '3months' | 'year' | 'all'>('month');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [incomeCat, expenseCat, incomeMonth, expenseMonth, recent, daily] = await Promise.all([
          fetchIncomeCategorySummary(),
          fetchExpenseCategorySummary(),
          fetchIncomeMonthlySummary(),
          fetchExpenseMonthlySummary(),
          fetchAllTransactions("", 1),
          fetchDailyTransactions(timeframe),
        ]);
        setIncomeByCategory(incomeCat);
        setExpensesByCategory(expenseCat);
        setIncomeByMonth(incomeMonth);
        setExpensesByMonth(expenseMonth);
        setDailyTransactions(daily);
        setRecentTransactions(recent.map((tx: any) => ({
          id: tx._id,
          title: tx.title,
          amount: tx.amount,
          type: tx.type || 'expense',
          date: tx.date ? new Date(tx.date).toISOString().slice(0, 10) : '',
          category: tx.category,
        })));
        // Calculate budget, totals, remaining
        const totalIncomeVal = incomeMonth.reduce((sum: number, m: MonthData) => sum + m.amount, 0);
        const totalExpenseVal = expenseMonth.reduce((sum: number, m: MonthData) => sum + m.amount, 0);
        setTotalIncome(totalIncomeVal);
        setTotalExpenses(totalExpenseVal);
        setBudget(100000); // Fixed monthly budget to 1 lakh
        setRemaining(100000 - totalExpenseVal);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeframe]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0d1424] py-8 px-4 md:px-8 bg-gradient-animate">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <h1 className="text-3xl font-bold text-white">Financial Dashboard</h1>
          <div className="text-gray-400 text-sm bg-[#0f172a]/50 px-4 py-2 rounded-full border border-gray-800/50">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
            <p className="text-gray-400 text-lg">Loading your financial data...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center animate-fadeIn">
            <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600/30 hover:bg-red-600/50 text-red-300 px-4 py-2 rounded-lg font-medium transition animate-pulse-shadow"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {/* Budget Overview Card */}
            <div className="transform hover:scale-[1.01] transition-transform duration-300 animate-fadeIn">
              <BudgetOverviewCard 
                budget={budget}
                totalIncome={totalIncome}
                totalExpenses={totalExpenses}
                remaining={remaining}
              />
            </div>
            
            {/* Transactions Overview Chart */}
            <div className="transform hover:scale-[1.01] transition-transform duration-300 animate-fadeIn">
              <TransactionsOverview 
                dailyData={dailyTransactions}
              />
            </div>
            
            {/* Category Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="transform hover:scale-[1.01] transition-transform duration-300 animate-fadeIn">
                <CategoryPieChart 
                  data={incomeByCategory}
                  title="Income by Category"
                  colorScheme="income"
                />
              </div>
              <div className="transform hover:scale-[1.01] transition-transform duration-300 animate-fadeIn">
                <CategoryPieChart 
                  data={expensesByCategory}
                  title="Expenses by Category"
                  colorScheme="expense"
                />
              </div>
            </div>
            
            {/* Top Expense Categories */}
            <div className="transform hover:scale-[1.01] transition-transform duration-300 animate-fadeIn">
              <TopExpenseCategories data={expensesByCategory} />
            </div>
            
            {/* Recent Transactions */}
            <div className="transform hover:scale-[1.01] transition-transform duration-300 animate-fadeIn">
              <RecentTransactions transactions={recentTransactions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 