import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const token = localStorage.getItem("expToken");
  
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-24 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
          Take Control of Your <span className="gradient-text">Finances</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10">
          Track expenses, manage budgets, and gain insights into your spending habits
          with our intuitive personal finance assistant.
        </p>
        <Link
          to={token ? "/dashboard" : "/login"}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition duration-300"
        >
          {token ? "Go to Dashboard" : "Get Started"} <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default HeroSection; 