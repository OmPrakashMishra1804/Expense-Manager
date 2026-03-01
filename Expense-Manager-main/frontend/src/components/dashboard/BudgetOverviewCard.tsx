import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BudgetOverviewCardProps {
  budget: number;
  totalIncome: number;
  totalExpenses: number;
  remaining: number;
}

const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({ 
  budget, 
  totalIncome, 
  totalExpenses, 
  remaining 
}) => {
  const percentUsed = ((budget - remaining) / budget) * 100;
  const isOverBudget = percentUsed > 100;
  
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
              <Wallet className="text-white" size={24} />
            </div>
            Monthly Budget Overview
          </h2>
          <div className="bg-[#0d1424] px-4 py-1 rounded-full text-gray-300 text-sm font-medium border border-gray-700/50 shadow-inner">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 rounded-xl shadow-lg border border-gray-800/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-white">₹{budget.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <DollarSign className="text-blue-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 rounded-xl shadow-lg border border-gray-800/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Income</p>
                <p className="text-2xl font-bold text-green-500">₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-green-500/10 p-2 rounded-lg">
                <TrendingUp className="text-green-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 rounded-xl shadow-lg border border-gray-800/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Expenses</p>
                <p className="text-2xl font-bold text-red-500">₹{totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="bg-red-500/10 p-2 rounded-lg">
                <TrendingDown className="text-red-400" size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 rounded-xl shadow-lg border border-gray-800/50 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Remaining</p>
                <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-500' : 'text-purple-500'}`}>
                  ₹{remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <DollarSign className="text-purple-400" size={20} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-800/50 rounded-full h-3 mb-3 shadow-inner overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ease-out ${
                isOverBudget 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : percentUsed > 90 
                    ? 'bg-gradient-to-r from-yellow-500 to-red-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            >
              <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDMiPgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iNiIgaGVpZ2h0PSIzIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiPjwvcmVjdD4KPC9zdmc+')] bg-[length:6px_3px] opacity-20"></div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className={`text-sm font-medium ${
              isOverBudget ? 'text-red-400' : percentUsed > 90 ? 'text-yellow-400' : 'text-blue-400'
            }`}>
              {percentUsed.toFixed(1)}% of budget used
            </p>
            
            {isOverBudget && (
              <p className="text-sm font-medium text-red-400 animate-pulse">
                Over budget by ₹{Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverviewCard; 