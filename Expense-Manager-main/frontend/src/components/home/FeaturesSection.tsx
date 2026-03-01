import React from 'react';
import { CreditCard, PieChart, Receipt, TrendingUp } from 'lucide-react';

// Feature Item Component
const FeatureItem: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  position: 'left' | 'right';
}> = ({ title, description, icon, position }) => {
  const isLeft = position === 'left';
  
  return (
    <div className={`flex items-center mb-16`}>
      {isLeft ? (
        <>
          <div className="w-1/2 pr-8 text-right">
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center z-10">
            {icon}
          </div>
          <div className="w-1/2"></div>
        </>
      ) : (
        <>
          <div className="w-1/2"></div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center z-10">
            {icon}
          </div>
          <div className="w-1/2 pl-8">
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400">{description}</p>
          </div>
        </>
      )}
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <div className="py-20 px-6 bg-[#0f172a]">
      <h2 className="text-4xl font-bold text-center text-white mb-16">
        Powerful <span className="gradient-text">Features</span>
      </h2>
      
      <div className="max-w-5xl mx-auto relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-500 via-blue-600 to-purple-600 rounded-full"></div>
        
        <FeatureItem
          title="Expense Tracking"
          description="Easily log and categorize your daily expenses to keep a close eye on your spending habits."
          icon={<CreditCard size={28} className="text-white" />}
          position="left"
        />
        
        <FeatureItem
          title="Income Management"
          description="Record all sources of income and get a comprehensive view of your financial inflows."
          icon={<TrendingUp size={28} className="text-white" />}
          position="right"
        />
        
        <FeatureItem
          title="Receipt Scanning"
          description="Scan receipts and automatically extract expense information to save time on manual entry."
          icon={<Receipt size={28} className="text-white" />}
          position="left"
        />
        
        <FeatureItem
          title="Visual Analytics"
          description="Get insightful charts and graphs that help you understand where your money goes."
          icon={<PieChart size={28} className="text-white" />}
          position="right"
        />
      </div>
    </div>
  );
};

export default FeaturesSection; 