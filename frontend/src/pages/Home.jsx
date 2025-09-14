import React from 'react';
import { useNavigate } from 'react-router-dom';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import InsightsIcon from '@mui/icons-material/Insights';
import SecurityIcon from '@mui/icons-material/Security';
import TimelineIcon from '@mui/icons-material/Timeline';
import Img from '../assets/i8.png';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MonetizationOnIcon className="w-10 h-10 text-primary" />,
      title: 'Track Expenses',
      description: 'Easily record and categorize your income and expenses in one place'
    },
    {
      icon: <InsightsIcon className="w-10 h-10 text-primary" />,
      title: 'Smart Insights',
      description: 'Get AI-powered insights about your spending patterns and trends'
    },
    {
      icon: <TimelineIcon className="w-10 h-10 text-primary" />,
      title: 'Visual Analytics',
      description: 'View beautiful charts and graphs of your financial journey'
    },
    {
      icon: <SecurityIcon className="w-10 h-10 text-primary" />,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and stored securely'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 backdrop-blur-3xl"></div>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="backdrop-blur-sm p-8 rounded-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
                Take Control of Your Finances
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                Track expenses, analyze spending patterns, and make smarter financial decisions with AI-powered insights.
              </p>
              <div className="mt-8 space-x-4">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-3 border text-white font-medium shadow-lg text-xl 
                         hover:shadow-pink-500/50 hover:bg-pink-600 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 bg-transparent text-cyan-400 border border-cyan-400 font-medium text-xl
                         shadow-lg hover:shadow-cyan-400/50 hover:bg-cyan-400/10 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Login
                </button>
              </div>
            </div>
            <div className="hidden md:block backdrop-blur-sm p-8 rounded-lg">
              <img src={Img} alt="Finance Illustration" className="ml-24 w-[55%] h-[75%] shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-cyan-500/5 backdrop-blur-xl"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 relative text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="backdrop-blur-sm p-6 flex flex-col items-center text-center rounded-lg
                       border border-pink-400/10 shadow-lg shadow-cyan-400/5
                       hover:shadow-pink-500/20 hover:border-pink-400/20 transition-all duration-300"
            >
              <div className="mb-4 text-pink-500">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-cyan-500/5 backdrop-blur-xl"></div>
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center backdrop-blur-sm p-8 rounded-lg border border-pink-400/10 shadow-lg shadow-cyan-400/5 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            Ready to Start Your Financial Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who are already managing their finances smarter.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary px-8 py-4 text-lg hover:shadow-neon-hover transition-all duration-300"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;