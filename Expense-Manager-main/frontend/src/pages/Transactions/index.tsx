import React, { useState, useEffect } from 'react';
import { Plus, BarChart2, Receipt, List } from 'lucide-react';
import { fetchAllTransactions, addTransaction, deleteTransaction, updateTransaction } from '../../api/transactionAPIs';
import { Transaction, TransactionFormData } from '../../types/transactions';
import { defaultExpenseCategories } from '../../data/categories';
import toast from 'react-hot-toast';
import {
  TransactionForm,
  TransactionFilters,
  TransactionTable,
  TransactionPagination,
  ReceiptUploader,
  TransactionHistoryUploader
} from '../../components/transactions';

const ITEMS_PER_PAGE = 10;

interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  searchQuery: string;
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showReceiptUploader, setShowReceiptUploader] = useState<boolean>(false);
  const [showHistoryUploader, setShowHistoryUploader] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string>('');
  const [currentTransactionType, setCurrentTransactionType] = useState<'income' | 'expense'>('expense');

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    searchQuery: '',
  });

  // Form state
  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: 0,
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    category: defaultExpenseCategories[0],
    description: '',
  });

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'income' | 'expense' } | null>(null);

  // Fetch transactions on component mount
  useEffect(() => {
    console.log("Fetching transactions for page:", currentPage);
    setLoading(true);
    fetchTransactions();
  }, [currentPage]);

  // Apply filters when transactions or filters change
  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllTransactions("", currentPage);
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async() => {
    let result = [...transactions];

    // Filter by type
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Filter by category
    if (filters.category) {
      result = result.filter(t => t.category === filters.category);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(t => new Date(t.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set time to end of day
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(t => new Date(t.date) <= toDate);
    }

    // Filter by amount range
    if (filters.amountMin) {
      const minAmount = parseFloat(filters.amountMin);
      result = result.filter(t => t.amount >= minAmount);
    }

    if (filters.amountMax) {
      const maxAmount = parseFloat(filters.amountMax);
      result = result.filter(t => t.amount <= maxAmount);
    }

    if (filters.searchQuery) {
      const res = await fetchAllTransactions(filters.searchQuery, currentPage);
      console.log(res);
      setFilteredTransactions(res);
      return;
    }


    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));

    // Update category options when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: value === 'income' ? 'Salary' : 'Food'
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;

      if (isEditing) {
        result = await updateTransaction(currentTransactionId, currentTransactionType, formData);
      } else {
        result = await addTransaction(formData);
      }

      if (result.success) {
        toast.success(result.message);
        resetForm();
        // Refresh transactions
        fetchTransactions();
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isEditing ? 'update' : 'add'} transaction`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'income' | 'expense') => {
    setDeleteTarget({ id, type });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setShowDeleteModal(false);
    setLoading(true);
    try {
      const result = await deleteTransaction(deleteTarget.id, deleteTarget.type);
      if (result.success) {
        toast.success(result.message);
        fetchTransactions();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete transaction');
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setIsEditing(true);
    setCurrentTransactionId(transaction._id);
    setCurrentTransactionType(transaction.type);

    // Format the date to YYYY-MM-DD for the input field
    const formattedDate = new Date(transaction.date).toISOString().split('T')[0];

    setFormData({
      title: transaction.title,
      amount: transaction.amount,
      type: transaction.type,
      date: formattedDate,
      category: transaction.category,
      description: transaction.description || '',
    });

    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setCurrentTransactionId('');
    setCurrentTransactionType('expense');

    // Reset form data
    setFormData({
      title: '',
      amount: 0,
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      category: defaultExpenseCategories[0],
      description: '',
    });
  };

  const handleExtractedReceiptData = (data: Partial<TransactionFormData>) => {
    // Pre-fill the form with extracted data
    setFormData(prev => ({
      ...prev,
      title: data.title || prev.title,
      amount: data.amount !== undefined ? data.amount : prev.amount,
      date: data.date || prev.date,
      category: data.category || prev.category,
      description: data.description || prev.description,
      // Always set as expense for receipts
      type: 'expense',
    }));

    // Show the form after receipt processing
    setIsEditing(false);
    setShowReceiptUploader(false);
    setShowForm(true);
  };

  const handleExtractedHistory = async (data: TransactionFormData[]) => {
    // Import all extracted transactions
    setLoading(true);
    try {
      for (const t of data) {
        await addTransaction(t);
      }
      toast.success(`${data.length} transactions imported successfully!`);
      fetchTransactions();
    } catch (err: any) {
      toast.error('Failed to import some transactions');
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#0d1424] py-8 px-4 md:px-8 bg-gradient-animate">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
                <BarChart2 className="text-white" size={24} />
              </div>
              Transactions
            </h1>
            <p className="text-gray-400 mt-1">Manage and track all your financial transactions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHistoryUploader(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/20"
            >
              <List size={18} /> Upload History
            </button>
            <button
              onClick={() => setShowReceiptUploader(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/20"
            >
              <Receipt size={18} /> Scan Receipt
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
            >
              <Plus size={18} /> Add Transaction
            </button>
          </div>
        </div>

        {/* Add/Edit Transaction Form */}
        {showForm && (
          <TransactionForm
            formData={formData}
            loading={loading}
            isEditing={isEditing}
            transactionId={currentTransactionId}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />
        )}

        {/* Receipt Uploader */}
        {showReceiptUploader && (
          <ReceiptUploader
            onExtractedData={handleExtractedReceiptData}
            onClose={() => setShowReceiptUploader(false)}
          />
        )}

        {/* Transaction History Uploader */}
        {showHistoryUploader && (
          <TransactionHistoryUploader
            onExtractedTransactions={handleExtractedHistory}
            onClose={() => setShowHistoryUploader(false)}
          />
        )}

        {/* Transaction Filters */}
        <TransactionFilters
          filterType={filters.type}
          onFilterChange={setFilters}
          currentFilters={filters}
        />

        {/* Transaction Table */}
        <TransactionTable
          transactions={paginatedTransactions}
          loading={loading}
          error={error}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      </div>
        <button onClick={()=>{
          setCurrentPage(prev => Math.max(1, prev - 1));
        }}
         className='bg-white'>Next</button>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#1e293b] rounded-xl p-8 shadow-2xl border border-gray-700 w-full max-w-md mx-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">Delete Transaction?</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                onClick={() => { setShowDeleteModal(false); setDeleteTarget(null); }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg transition shadow-lg hover:shadow-red-500/20"
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage; 