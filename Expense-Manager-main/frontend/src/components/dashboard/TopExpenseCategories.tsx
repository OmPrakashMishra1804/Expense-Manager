import React from 'react';
import { TrendingDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface CategoryData {
  category: string;
  amount: number;
}

interface TopExpenseCategoriesProps {
  data: CategoryData[];
}

const EXPENSE_BAR_COLORS = [
  '#8b5cf6', // Purple
  '#7c3aed', // Darker Purple
  '#c4b5fd', // Light Purple
  '#6d28d9', // Indigo
  '#818cf8', // Blue
  '#6366f1', // Indigo
  '#a5b4fc', // Light Indigo
];

const TopExpenseCategories: React.FC<TopExpenseCategoriesProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl flex items-center justify-center min-h-[200px]">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg mr-3 shadow-lg">
            <TrendingDown className="text-white" size={20} />
          </div>
          Top Expense Categories
        </h2>
        <div className="text-gray-400 text-lg ml-4">No data available</div>
      </div>
    );
  }
  
  // Sort by amount descending
  const sorted = [...data].sort((a, b) => b.amount - a.amount);
  const totalExpense = sorted.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-2 rounded-lg mr-3 shadow-lg">
              <TrendingDown className="text-white" size={20} />
            </div>
            Top Expense Categories
          </h2>
          <span className="text-purple-400 text-xl font-bold">
            ₹{totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-2/3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={sorted}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
                barCategoryGap={8}
                maxBarSize={20} // Control the height of each bar
              >
                <defs>
                  {EXPENSE_BAR_COLORS.map((color, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`barGradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                  <filter id="categoryBarGlow" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feFlood floodColor="#a78bfa" floodOpacity="0.1" result="color" />
                    <feComposite in="color" in2="blur" operator="in" result="shadow" />
                    <feComposite in="SourceGraphic" in2="shadow" operator="over" />
                  </filter>
                </defs>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="category"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#e0e7ff', fontSize: 16, fontWeight: 500 }}
                  width={120}
                />
                <Tooltip
                  cursor={{ fill: '#a78bfa22' }}
                  content={({ active, payload }) =>
                    active && payload && payload.length ? (
                      <div className="bg-[#0f172a]/90 backdrop-blur-md border border-gray-700/50 px-4 py-3 rounded-lg shadow-xl text-base">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: payload[0].payload.fill || EXPENSE_BAR_COLORS[0] }}
                          ></span>
                          <span className="text-white font-semibold">{payload[0].payload.category}</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                          ₹{payload[0].payload.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-sm text-gray-400">
                          {((payload[0].payload.amount / totalExpense) * 100).toFixed(1)}% of total expenses
                        </div>
                      </div>
                    ) : null
                  }
                  wrapperStyle={{ outline: 'none' }}
                />
                <Bar
                  dataKey="amount"
                  radius={[0, 12, 12, 0]}
                  filter="url(#categoryBarGlow)"
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {sorted.map((_, idx) => {
                    return (
                      <Cell 
                        key={`cell-${idx}`} 
                        fill={`url(#barGradient-${idx % EXPENSE_BAR_COLORS.length})`}
                        // Add the fill to the entry for the tooltip
                        fillOpacity={1}
                        stroke="rgba(0,0,0,0.1)"
                        strokeWidth={1}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/3 space-y-3 mt-4 md:mt-0">
            <div className="text-lg font-semibold text-white mb-4">Breakdown</div>
            {sorted.slice(0, 5).map((item, idx) => {
              const percent = (item.amount / totalExpense) * 100;
              const color = EXPENSE_BAR_COLORS[idx % EXPENSE_BAR_COLORS.length];
              
              return (
                <div 
                  key={item.category} 
                  className="bg-[#0f172a] p-3 rounded-lg border border-gray-800/50 hover:bg-[#0d1424] transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: color }}
                      ></span>
                      <span className="text-gray-300 font-medium">{item.category}</span>
                    </div>
                    <span className="text-white font-semibold">
                      ₹{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-1.5 mt-1">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${percent}%`,
                        background: `linear-gradient(90deg, ${color}CC, ${color}66)`
                      }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {percent.toFixed(1)}%
                  </div>
                </div>
              );
            })}
            
            {sorted.length > 5 && (
              <div className="text-center text-sm text-gray-400 mt-2">
                +{sorted.length - 5} more categories
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopExpenseCategories; 