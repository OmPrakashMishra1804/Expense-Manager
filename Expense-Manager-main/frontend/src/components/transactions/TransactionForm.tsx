import React from 'react';
import { TransactionFormData } from '../../types/transactions';
import { defaultExpenseCategories, defaultIncomeCategories } from '../../data/categories';
import { SquarePen } from 'lucide-react';

interface TransactionFormProps {
  formData: TransactionFormData;
  loading: boolean;
  isEditing?: boolean;
  transactionId?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  formData,
  loading,
  isEditing = false,
  transactionId,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-[#181f2a] to-[#0f172a] rounded-2xl p-8 shadow-2xl w-full max-w-lg border border-gray-800/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg">
            <SquarePen size={28} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                required
                className="w-full bg-[#101624] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition"
                placeholder="e.g. Salary, Rent, etc."
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={onInputChange}
                required
                min="0"
                step="0.01"
                className="w-full bg-[#101624] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 transition"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={onInputChange}
                required
                className="w-full bg-[#101624] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={onInputChange}
                required
                className="w-full bg-[#101624] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                {formData.type === 'income'
                  ? defaultIncomeCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))
                  : defaultExpenseCategories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))
                }
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1 font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={onInputChange}
                required
                className="w-full bg-[#101624] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onInputChange}
              required
              className="w-full bg-[#101624] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 placeholder-gray-500 transition"
              placeholder="Add a description..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition shadow-lg hover:shadow-indigo-500/20 font-semibold"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm; 