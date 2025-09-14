import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full max-w-6xl">
          {/* Left Side - Project Info */}
          <div className="flex flex-col justify-center space-y-6 p-4 md:p-8 order-2 lg:order-1">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 mb-4">
                Join Our Community
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Take control of your finances with our smart AI-powered finance tracker
              </p>
            </div>
            
            {/* Feature Cards - Show on both mobile and desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div className="backdrop-blur-sm border border-pink-400/10 rounded-lg p-4 md:p-6 shadow-lg shadow-cyan-400/5 
                          transform hover:scale-105 transition-transform duration-300">
                <div className="text-xl md:text-2xl font-bold text-pink-500 mb-2">Real-time</div>
                <p className="text-gray-400 text-sm md:text-base">Track your expenses as they happen</p>
              </div>
              <div className="backdrop-blur-sm border border-cyan-400/10 rounded-lg p-4 md:p-6 shadow-lg shadow-pink-400/5
                          transform hover:scale-105 transition-transform duration-300">
                <div className="text-xl md:text-2xl font-bold text-cyan-400 mb-2">Secure</div>
                <p className="text-gray-400 text-sm md:text-base">Your data is encrypted and protected</p>
              </div>
            </div>
          </div>
          
          {/* Right Side - Signup Form */}
          <div className="relative backdrop-blur-sm border border-pink-400/10 shadow-lg shadow-cyan-400/5 rounded-lg 
                       p-6 md:p-8 lg:p-12 order-1 lg:order-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 md:mb-8 
                       text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
              Create Account
            </h1>
            
            {error && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 text-sm md:text-base text-red-400 
                         bg-red-900/50 rounded-lg border border-red-500/20" role="alert">
                {error}
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div className="group">
              <input
                type="text"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-900/50 border border-pink-400/20 rounded-lg
                         text-gray-100 placeholder-gray-400 text-sm md:text-base
                         focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 ease-in-out
                         group-hover:border-pink-400/30"
                placeholder="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="group">
              <input
                type="email"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-900/50 border border-pink-400/20 rounded-lg
                         text-gray-100 placeholder-gray-400 text-sm md:text-base
                         focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 ease-in-out
                         group-hover:border-pink-400/30"
                placeholder="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="group">
              <input
                type="password"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-900/50 border border-pink-400/20 rounded-lg
                         text-gray-100 placeholder-gray-400 text-sm md:text-base
                         focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 ease-in-out
                         group-hover:border-pink-400/30"
                placeholder="Password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="group">
              <input
                type="password"
                required
                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-900/50 border border-pink-400/20 rounded-lg
                         text-gray-100 placeholder-gray-400 text-sm md:text-base
                         focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 ease-in-out
                         group-hover:border-pink-400/30"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 md:py-3 px-4 md:px-6
                       bg-gradient-to-r from-pink-500 to-cyan-400 
                       text-white text-sm md:text-base font-semibold rounded-lg
                       shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40
                       focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform hover:scale-[0.99] active:scale-[0.97]
                       transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-pink-500 hover:text-pink-400 text-sm md:text-base font-medium transition-colors duration-200"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Signup;