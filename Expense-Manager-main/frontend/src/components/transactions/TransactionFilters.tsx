import React, { useEffect, useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Calendar, DollarSign, Tag, X } from 'lucide-react';
import { defaultExpenseCategories, defaultIncomeCategories } from '../../data/categories';

interface FilterOptions {
  type: 'all' | 'income' | 'expense';
  category: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  searchQuery: string;
}

interface TransactionFiltersProps {
  filterType: 'all' | 'income' | 'expense';
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filterType,
  onFilterChange,
  currentFilters
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // If type changes, reset category
    if (key === 'type') {
      newFilters.category = '';
    }

    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      type: 'all',
      category: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      searchQuery: ''

    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const categories = filters.type === 'income'
    ? defaultIncomeCategories
    : filters.type === 'expense'
      ? defaultExpenseCategories
      : [...defaultIncomeCategories, ...defaultExpenseCategories];

  const isFiltered =
    filters.category !== '' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '' ||
    filters.amountMin !== '' ||
    filters.amountMax !== '';

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-xl overflow-hidden mb-6 border border-gray-800/40">
      {/* Main Filter Bar */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-lg">
            <Filter size={20} className="text-indigo-400" />
          </div>
          <h2 className="text-lg font-medium text-white">Filters</h2>
          {isFiltered && (
            <div className="bg-indigo-600/20 px-2 py-1 rounded-full text-xs text-indigo-400 font-medium">
              Active Filters
            </div>
          )}
        </div>

        <div className="flex gap-2 items-center">
          <div>
            <input
              type='text'
              placeholder='Enter to search for all fields'
              className="bg-[#0f172a] border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            >
            </input>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('type', 'all')}
              className={`px-4 py-1.5 rounded-lg transition-all ${filters.type === 'all'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800 border border-gray-700/50'
                }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('type', 'income')}
              className={`px-4 py-1.5 rounded-lg transition-all ${filters.type === 'income'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                  : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800 border border-gray-700/50'
                }`}
            >
              Income
            </button>
            <button
              onClick={() => handleFilterChange('type', 'expense')}
              className={`px-4 py-1.5 rounded-lg transition-all ${filters.type === 'expense'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                  : 'bg-[#0f172a] text-gray-300 hover:bg-gray-800 border border-gray-700/50'
                }`}
            >
              Expenses
            </button>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 bg-[#0f172a] border border-gray-700/50 p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
            title={expanded ? "Hide advanced filters" : "Show advanced filters"}
          >
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {expanded && (
        <div className="p-4 border-t border-gray-800/40 bg-[#0f172a]/50 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-300 text-sm gap-2">
                <Tag size={14} />
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full bg-[#0f172a] border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-300 text-sm gap-2">
                <Calendar size={14} />
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="flex items-center text-gray-300 text-sm gap-2">
                <DollarSign size={14} />
                Amount Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Min"
                  min="0"
                />
                <input
                  type="number"
                  value={filters.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e.target.value)}
                  className="w-full bg-[#0f172a] border border-gray-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Active Filters & Reset Button */}
          {isFiltered && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-gray-400 text-sm">Active filters:</span>

              {filters.category && (
                <div className="bg-[#1e293b] text-gray-300 text-xs rounded-full px-3 py-1 flex items-center gap-1">
                  <Tag size={12} />
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {filters.dateFrom && (
                <div className="bg-[#1e293b] text-gray-300 text-xs rounded-full px-3 py-1 flex items-center gap-1">
                  <Calendar size={12} />
                  From: {filters.dateFrom}
                  <button
                    onClick={() => handleFilterChange('dateFrom', '')}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {filters.dateTo && (
                <div className="bg-[#1e293b] text-gray-300 text-xs rounded-full px-3 py-1 flex items-center gap-1">
                  <Calendar size={12} />
                  To: {filters.dateTo}
                  <button
                    onClick={() => handleFilterChange('dateTo', '')}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {filters.amountMin && (
                <div className="bg-[#1e293b] text-gray-300 text-xs rounded-full px-3 py-1 flex items-center gap-1">
                  <DollarSign size={12} />
                  Min: ₹{filters.amountMin}
                  <button
                    onClick={() => handleFilterChange('amountMin', '')}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {filters.amountMax && (
                <div className="bg-[#1e293b] text-gray-300 text-xs rounded-full px-3 py-1 flex items-center gap-1">
                  <DollarSign size={12} />
                  Max: ₹{filters.amountMax}
                  <button
                    onClick={() => handleFilterChange('amountMax', '')}
                    className="text-gray-400 hover:text-white ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              <button
                onClick={handleReset}
                className="ml-auto bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white text-xs px-3 py-1 rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionFilters; 