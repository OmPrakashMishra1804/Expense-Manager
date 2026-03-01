import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  const token = localStorage.getItem("expToken");
  
  return (
    <div className="py-20 px-6 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Take Control of Your <span className="gradient-text">Financial Future</span>?
        </h2>
        <p className="text-xl text-gray-300 mb-10">
          Join thousands of users who have transformed their financial habits with ExpenseEase.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {token ? (
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition duration-300"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:scale-105 transition duration-300"
              >
                Sign Up Now
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-[#1e293b] text-white font-bold rounded-full border border-indigo-500 hover:bg-[#0f172a] transition duration-300"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CTASection; 