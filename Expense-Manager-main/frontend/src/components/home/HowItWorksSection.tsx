import React from 'react';

// Step Component
const Step: React.FC<{ number: number; title: string; description: string }> = ({
  number,
  title,
  description
}) => {
  return (
    <div className="flex flex-col items-center max-w-sm mx-auto mb-12 md:mb-0">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  return (
    <div className="py-20 px-6 bg-[#0f172a]">
      <h2 className="text-4xl font-bold text-center text-white mb-16">
        How It <span className="gradient-text">Works?</span>
      </h2>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <Step
          number={1}
          title="Create an Account"
          description="Sign up for free and set up your profile to start tracking your finances."
        />
        <Step
          number={2}
          title="Add Your Transactions"
          description="Record your expenses and income or scan receipts to import data automatically."
        />
        <Step
          number={3}
          title="Gain Financial Insights"
          description="View reports and analytics to understand your spending patterns and make better financial decisions."
        />
      </div>
    </div>
  );
};

export default HowItWorksSection; 