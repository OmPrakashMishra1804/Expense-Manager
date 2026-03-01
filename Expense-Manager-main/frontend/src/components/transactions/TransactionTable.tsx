import React, { useState, useEffect } from 'react';
import { DollarSign, Trash2, Calendar, Tag, ArrowUpRight, ArrowDownRight, Edit, ArrowUp, ArrowDown, ArrowUpDown, FileSpreadsheet } from 'lucide-react';
import { Transaction } from '../../types/transactions';
import * as XLSX from 'xlsx';

interface TransactionTableProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string, type: 'income' | 'expense') => void;
  onEdit?: (transaction: Transaction) => void;
}

type SortField = 'title' | 'category' | 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

interface SortPreference {
  field: SortField;
  direction: SortDirection;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  error,
  onDelete,
  onEdit
}) => {

  // Initialize sort state from localStorage or default to date desc
  const getSavedSortPreference = (): SortPreference => {
    try {
      const saved = localStorage.getItem('transactionSortPreference');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading sort preference from localStorage', e);
    }
    return { field: 'date', direction: 'desc' };
  };
  
  const [sortField, setSortField] = useState<SortField>(getSavedSortPreference().field);
  const [sortDirection, setSortDirection] = useState<SortDirection>(getSavedSortPreference().direction);

  // Save sort preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('transactionSortPreference', JSON.stringify({
        field: sortField,
        direction: sortDirection
      }));
    } catch (e) {
      console.error('Error saving sort preference to localStorage', e);
    }
  }, [sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'date':
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      default:
        comparison = 0;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={14} className="ml-1 opacity-30" />;
    }
    return sortDirection === 'asc' ? 
      <ArrowUp size={14} className="ml-1" /> : 
      <ArrowDown size={14} className="ml-1" />;
  };

  // Export to Excel (all sorted transactions)
  const handleExportExcel = () => {
    if (!sortedTransactions.length) {
      alert('No transactions to export');
      return;
    }
    const data = sortedTransactions.map(t => ({
      Title: t.title,
      Amount: t.amount,
      Type: t.type,
      Date: t.date,
      Category: t.category,
      Description: t.description,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, 'transactions.xlsx');
  };

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl border border-gray-800/40 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
              <DollarSign className="text-white" size={20} />
            </div>
            Transactions
          </h2>
          <div className="flex items-center gap-2">
            {!loading && !error && transactions.length > 0 && (
              <>
                <div className="bg-[#0d1424] px-3 py-1 rounded-full text-gray-300 text-sm font-medium border border-gray-700/50 shadow-inner flex items-center h-9">
                  {transactions.length} {transactions.length === 1 ? 'Transaction' : 'Transactions'}
                </div>
                <button
                  onClick={handleExportExcel}
                  className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-4 py-1.5 rounded-full font-medium border border-yellow-400/30 shadow-inner h-9 text-sm transition-all duration-300"
                  style={{ minWidth: 0 }}
                  title="Export all shown transactions to Excel"
                >
                  <FileSpreadsheet size={16} />
                  Export
                </button>
              </>
            )}
          </div>
        </div>
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Loading transactions...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-6 text-center">
            <h3 className="text-red-400 text-xl font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600/30 hover:bg-red-600/50 text-red-300 px-4 py-2 rounded-lg font-medium transition"
            >
              Try Again
            </button>
          </div>
        )}
        
        {!loading && !error && transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-[#0f172a]/50 rounded-lg border border-gray-800/50">
            <div className="bg-[#0d1424] p-4 rounded-full mb-4">
              <DollarSign className="text-gray-400" size={32} />
            </div>
            <div className="text-gray-400 text-lg mb-2">No transactions found</div>
            <p className="text-gray-500 text-sm text-center max-w-md">
              Try adjusting your filters or add a new transaction to get started.
            </p>
          </div>
        )}
        
        {!loading && !error && transactions.length > 0 && (
          <>
            <div className="overflow-hidden rounded-lg border border-gray-800/50">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#0f172a]">
                      <th 
                        className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('title')}
                        title="Sort by title"
                      >
                        <div className="flex items-center">
                          Title
                          {renderSortIcon('title')}
                        </div>
                      </th>
                      <th 
                        className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('category')}
                        title="Sort by category"
                      >
                        <div className="flex items-center">
                          Category
                          {renderSortIcon('category')}
                        </div>
                      </th>
                      <th 
                        className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('date')}
                        title="Sort by date"
                      >
                        <div className="flex items-center">
                          Date
                          {renderSortIcon('date')}
                        </div>
                      </th>
                      <th 
                        className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleSort('amount')}
                        title="Sort by amount"
                      >
                        <div className="flex items-center">
                          Amount
                          {renderSortIcon('amount')}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-gray-400 font-medium border-b border-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.map((transaction, index) => (
                      <tr 
                        key={transaction._id} 
                        className={`border-b border-gray-800 hover:bg-[#0d1424] transition group ${
                          index % 2 === 0 ? 'bg-[#0f172a]/30' : 'bg-[#0f172a]/60'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                              transaction.type === 'income' 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-red-500/10 text-red-500'
                            }`}>
                              {transaction.type === 'income' 
                                ? <ArrowUpRight size={14} /> 
                                : <ArrowDownRight size={14} />
                              }
                            </div>
                            <div>
                              <div className="text-white font-medium">{transaction.title}</div>
                              <div className="text-gray-500 text-xs">
                                {transaction.type === 'income' ? 'Income' : 'Expense'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Tag size={14} className="text-gray-400 mr-2" />
                            <span className="text-gray-300">{transaction.category}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Calendar size={14} className="text-gray-400 mr-2" />
                            <span className="text-gray-300">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`flex items-center font-semibold ${
                            transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                          }`}>
                            <span>
                              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(transaction)}
                                className="p-1.5 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition"
                                title="Edit transaction"
                              >
                                <Edit size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => onDelete(transaction._id, transaction.type)}
                              className="p-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition"
                              title="Delete transaction"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionTable; 