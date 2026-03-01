import React from 'react';
import { DollarSign, ArrowUpRight, Calendar, Tag, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string | number;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const navigate = useNavigate();
  
  // Get the top 10 most recent transactions
  const topTransactions = transactions && transactions.length > 0 
    ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
    : [];
  
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg mr-3 shadow-lg">
              <DollarSign className="text-white" size={24} />
            </div>
            Recent Transactions
          </h2>
          <div className="bg-[#0d1424] px-3 py-1 rounded-full text-gray-300 text-sm font-medium border border-gray-700/50 shadow-inner">
            Top 5 Transactions
          </div>
        </div>
        
        {(!topTransactions || topTransactions.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[#0f172a]/50 rounded-lg border border-gray-800/50">
            <div className="bg-[#0d1424] p-4 rounded-full mb-4">
              <DollarSign className="text-gray-400" size={32} />
            </div>
            <div className="text-gray-400 text-lg">No transactions available</div>
            <button
              onClick={() => navigate('/transactions')}
              className="mt-4 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 px-4 py-2 rounded-lg font-medium transition flex items-center gap-1"
            >
              Add your first transaction <ArrowUpRight size={16} />
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-800/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#0f172a]">
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Title</th>
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Category</th>
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Date</th>
                    <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {topTransactions.map((transaction, index) => (
                    <tr 
                      key={transaction.id} 
                      className={`border-b border-gray-800 hover:bg-[#0d1424] transition group ${
                        index % 2 === 0 ? 'bg-[#0f172a]/30' : 'bg-[#0f172a]/60'
                      }`}
                    >
                      <td className="py-3 px-4 text-white font-medium">{transaction.title}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Tag size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-300">{transaction.category}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Calendar size={14} className="text-gray-400 mr-2" />
                          <span className="text-gray-300">{transaction.date}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center justify-between ${
                          transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          <span className="font-semibold">
                            {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <div className="w-2 h-2 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-[#0f172a] border-t border-gray-800">
              <div className="text-sm text-gray-400">
                Showing {Math.min(topTransactions.length, 10)} of {transactions.length} transactions
              </div>
              <button
                onClick={() => navigate('/transactions')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 flex items-center gap-1 group"
              >
                View All Transactions
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions; 