import React, { useState, useEffect } from 'react';
import { BarChart, Calendar } from 'lucide-react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchDailyTransactions } from '../../api/transactionAPIs';

interface TransactionsOverviewProps {
  dailyData: { date: string; income: number; expense: number }[];
}

// Custom tooltip for the bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
    const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
    return (
      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-gray-700/50 px-4 py-3 rounded-lg shadow-xl">
        <div className="text-white font-semibold mb-2 border-b border-gray-700/50 pb-1">
          {label}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#4ade80]"></span>
              <span className="text-gray-300">Income</span>
            </div>
            <span className="text-green-400 font-medium">₹{income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#a78bfa]"></span>
              <span className="text-gray-300">Expense</span>
            </div>
            <span className="text-purple-400 font-medium">₹{expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="border-t border-gray-700/50 pt-1 mt-1">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Net</span>
              <span className={`font-medium ${income - expense >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{(income - expense).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const TransactionsOverview: React.FC<TransactionsOverviewProps> = ({ dailyData }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | '3months' | 'year' | 'all'>('month');
  const [chartData, setChartData] = useState<{ date: string; income: number; expense: number }[]>([]);
  const [activeTimeframe, setActiveTimeframe] = useState<'week' | 'month' | '3months' | 'year' | 'all'>('month');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate dynamic bar width based on number of data points
  const calculateBarSize = () => {
    if (!chartData || chartData.length === 0) return 18;
    
    const baseSize = 18;
    
    if (chartData.length <= 7) return baseSize; 
    if (chartData.length <= 14) return Math.max(12, baseSize - 2); 
    if (chartData.length <= 30) return Math.max(8, baseSize - 4); 
    if (chartData.length <= 90) return Math.max(6, baseSize - 6); 
    return Math.max(4, baseSize - 8); 
  };

  // Fetch data when timeframe changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDailyTransactions(timeframe);
        setChartData(data);
        setActiveTimeframe(timeframe);
      } catch (error) {
        console.error("Error fetching data for timeframe:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // If we already have data for this timeframe, use it
    if (dailyData && dailyData.length > 0 && timeframe === 'month') {
      setChartData(dailyData);
    } else {
      fetchData();
    }
  }, [timeframe, dailyData]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl flex items-center justify-center min-h-[200px]">
        <h2 className="text-2xl font-bold text-white">Transactions Overview</h2>
        <div className="text-gray-400 text-lg ml-4">No data available</div>
      </div>
    );
  }

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);
  const netAmount = totalIncome - totalExpense;
  const barSize = calculateBarSize();

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | '3months' | 'year' | 'all') => {
    setTimeframe(newTimeframe);
  };

  const timeframeOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
              <BarChart className="text-white" size={24} />
            </div>
            Transactions Overview
          </h2>
          <div className="flex items-center gap-2">
            <div className="bg-[#0d1424] px-3 py-1 rounded-full text-gray-300 text-sm font-medium border border-gray-700/50 shadow-inner flex items-center">
              <Calendar size={14} className="mr-1.5" />
              {timeframeOptions.find(option => option.value === activeTimeframe)?.label}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {timeframeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTimeframeChange(option.value as any)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                timeframe === option.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-md'
                  : 'bg-[#0f172a] text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-[320px]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <>
            <div className="relative">
              <ResponsiveContainer width="100%" height={320}>
                <ReBarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ade80" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity={0.4} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.4} />
                    </linearGradient>
                    <filter id="barGlow" x="-10%" y="-10%" width="120%" height="120%">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feFlood floodColor="#6366f1" floodOpacity="0.1" result="color" />
                      <feComposite in="color" in2="blur" operator="in" result="shadow" />
                      <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                    </filter>
                  </defs>
                  <CartesianGrid stroke="#232136" vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#bdb4e1', fontSize: 13 }} 
                    axisLine={false} 
                    tickLine={false}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fill: '#bdb4e1', fontSize: 13 }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={v => `₹${(v/1000).toFixed(1)}k`}
                    tickMargin={10}
                  />
                  <Tooltip 
                    content={<CustomBarTooltip />} 
                    cursor={{ fill: '#a78bfa22' }}
                    wrapperStyle={{ outline: 'none' }}
                  />
                  <Bar 
                    dataKey="income" 
                    fill="url(#incomeGradient)" 
                    radius={[6, 6, 0, 0]} 
                    barSize={barSize} 
                    maxBarSize={24}
                    filter="url(#barGlow)"
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                  <Bar 
                    dataKey="expense" 
                    fill="url(#expenseGradient)" 
                    radius={[6, 6, 0, 0]} 
                    barSize={barSize} 
                    maxBarSize={24}
                    filter="url(#barGlow)"
                    animationDuration={1000}
                    animationBegin={300}
                    animationEasing="ease-out"
                  />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-800/50 flex flex-col">
                <span className="text-gray-400 text-sm mb-1">Total Income</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-2xl font-bold text-green-400">₹{totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-800/50 flex flex-col">
                <span className="text-gray-400 text-sm mb-1">Total Expenses</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-2xl font-bold text-purple-400">₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              
              <div className="bg-[#0f172a] rounded-lg p-4 border border-gray-800/50 flex flex-col">
                <span className="text-gray-400 text-sm mb-1">Net Balance</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${netAmount >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                  <span className={`text-2xl font-bold ${netAmount >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                    ₹{netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsOverview; 