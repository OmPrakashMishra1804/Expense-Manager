import React, { useState, useEffect } from 'react';
import { PieChart as PieChartIcon, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchExpenseCategorySummary } from '../../api/expenseAPIs';
import { fetchIncomeCategorySummary } from '../../api/incomeAPIs';

interface CategoryData {
  category: string;
  amount: number;
}

interface CategoryPieChartProps {
  data: CategoryData[];
  title: string;
  colorScheme: 'income' | 'expense';
}

const COLORS_EXPENSE = [
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#f97316', // Orange
];

const COLORS_INCOME = [
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, fill } = payload[0];
    return (
      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-gray-700/50 px-4 py-3 rounded-lg shadow-xl text-base">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: fill }}></span>
          <span className="text-white font-semibold">{name}</span>
        </div>
        <div className="text-lg font-bold text-white">
          ₹{value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
      </div>
    );
  }
  return null;
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data: initialData, title, colorScheme }) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | '3months' | 'year' | 'all'>('month');
  const [data, setData] = useState<CategoryData[]>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTimeframe, setActiveTimeframe] = useState<'week' | 'month' | '3months' | 'year' | 'all'>('month');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let newData;
        if (colorScheme === 'expense') {
          newData = await fetchExpenseCategorySummary(timeframe);
        } else {
          newData = await fetchIncomeCategorySummary(timeframe);
        }
        setData(newData);
        setActiveTimeframe(timeframe);
      } catch (error) {
        console.error(`Error fetching ${colorScheme} category data:`, error);
        // Fallback to initial data if fetch fails
        setData(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    // If we already have data for this timeframe and it's the initial 'month' timeframe, use it
    if (initialData && initialData.length > 0 && timeframe === 'month') {
      setData(initialData);
    } else {
      fetchData();
    }
  }, [timeframe, initialData, colorScheme]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl h-full flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3 shadow-lg">
            <PieChartIcon className="text-white" size={24} />
          </div>
          {title}
        </h2>
        <div className="text-gray-400 text-lg">No data available</div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.amount, 0);
  const COLORS = colorScheme === 'expense' ? COLORS_EXPENSE : COLORS_INCOME;

  const timeframeOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ];

  const handleTimeframeChange = (newTimeframe: 'week' | 'month' | '3months' | 'year' | 'all') => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl h-full flex flex-col relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <div className={`p-2 rounded-lg mr-3 shadow-lg ${colorScheme === 'income'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : 'bg-gradient-to-r from-purple-500 to-pink-600'
            }`}>
            <PieChartIcon className="text-white" size={24} />
          </div>
          {title}
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
            className={`px-3 py-1 rounded-full text-sm transition-all ${timeframe === option.value
                ? `bg-gradient-to-r ${colorScheme === 'income'
                  ? 'from-green-500 to-emerald-600'
                  : 'from-purple-500 to-pink-600'
                } text-white font-medium shadow-md`
                : 'bg-[#0f172a] text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[320px]">
          <div className={`animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 ${colorScheme === 'income' ? 'border-green-500' : 'border-purple-500'
            }`}></div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 relative z-10">
          {/* Donut Chart */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-36 h-36 rounded-full ${colorScheme === 'income'
                  ? 'bg-gradient-to-br from-green-500/10 to-cyan-500/5'
                  : 'bg-gradient-to-br from-purple-500/10 to-pink-500/5'
                } blur-md`}></div>
            </div>

            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <defs>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feFlood floodColor="#6366f1" floodOpacity="0.2" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                  </filter>
                </defs>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  cornerRadius={8}
                  filter="url(#glow)"
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationBegin={300}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(0,0,0,0.1)"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ zIndex: 50 }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center total */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-[#0f172a]/80 backdrop-blur-sm p-3 rounded-full w-32 h-32 justify-center">
              <span className="text-gray-300 text-sm font-medium">Total</span>
              <span className={`text-2xl font-bold ${colorScheme === 'income' ? 'text-green-400' : 'text-purple-400'
                }`}>
                ₹{total.toLocaleString(undefined, { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full overflow-auto max-h-60 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="space-y-3">
              {data.map((item, idx) => {
                const percent = total ? (item.amount / total) * 100 : 0;
                const color = COLORS[idx % COLORS.length];

                return (
                  <div
                    key={item.category}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center">
                      <span
                        className="w-4 h-4 rounded mr-2 shadow-sm"
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="text-gray-300 text-base">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        ₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${color}20`,
                          color: color
                        }}
                      >
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart; 