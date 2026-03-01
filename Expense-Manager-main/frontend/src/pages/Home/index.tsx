import React from 'react';
import HeroSection from '../../components/home/HeroSection';
import FeaturesSection from '../../components/home/FeaturesSection';
import HowItWorksSection from '../../components/home/HowItWorksSection';
import BenefitsSection from '../../components/home/BenefitsSection';
import CTASection from '../../components/home/CTASection';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0f172a]">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CTASection />
    </div>
  );
};

export default Home; 