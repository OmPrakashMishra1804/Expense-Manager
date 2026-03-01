import React from 'react';
import { Check } from 'lucide-react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    "Intuitive and easy-to-use interface",
    "Secure data storage and privacy",
    "Detailed financial reports and analytics",
    "Receipt scanning technology",
    "Budget planning and tracking",
    "Cross-platform accessibility"
  ];

  return (
    <div className="py-20 px-6 bg-[#0f172a]">
      <h2 className="text-4xl font-bold text-center text-white mb-16">
        Why Choose <span className="gradient-text">ExpenseEase?</span>
      </h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Check size={14} className="text-white" />
            </div>
            <p className="text-gray-300">{benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsSection; 