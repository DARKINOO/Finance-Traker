import React, { useState, useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { getTransactions, getSpendingByCategory, getMonthlyTrend } from '../services/api';
import AddTransaction from '../components/AddTransaction';
import NextMonthPrediction from '../components/NextMonthPrediction';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      const [transactionsData, categoryStats, monthlyTrend] = await Promise.all([
        getTransactions(userId),
        getSpendingByCategory(userId),
        getMonthlyTrend(userId)
      ]);

      setTransactions(transactionsData);
      setCategoryData(categoryStats);
      setTrendData(monthlyTrend);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const chartHeight = isMobile ? 250 : 300;

  return (
    <div className="container mx-auto max-w-7xl mt-2 sm:mt-3 md:mt-4 mb-2 sm:mb-3 md:mb-4 px-4 sm:px-6 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 
                    mb-6 backdrop-blur-sm p-3 sm:p-4 border border-pink-400/10 
                    shadow-lg shadow-cyan-400/5">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="flex text-base sm:text-lg items-center px-3 sm:px-4 py-2 
                   text-pink-500 hover:text-cyan-300 transition-all duration-300
                   border border-pink-400 hover:border-pink-400
                   shadow-sm hover:shadow-cyan-400/10 w-full sm:w-auto justify-center"
          >
            <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Home
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left
                     text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            Financial Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center px-3 sm:px-4 py-2 text-pink-400 hover:text-pink-500 
                   transition-all duration-300 border border-pink-400
                   hover:border-pink-400 shadow-sm hover:shadow-cyan-400/10
                   text-sm sm:text-base flex-1 sm:flex-initial justify-center"
          >
            <PersonIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <span className="hidden sm:inline">Account</span>
            <span className="sm:hidden">Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 sm:px-4 py-2 text-gray-300 hover:text-white 
                   transition-all duration-300 border border-pink-500
                   shadow-lg hover:shadow-pink-500/20 bg-gray-900/50 hover:bg-gray-900/70
                   text-sm sm:text-base flex-1 sm:flex-initial justify-center"
          >
            <LogoutIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {/* Add Transaction Section */}
        <div className="w-full">
          <div className="mb-4">
            <AddTransaction onTransactionAdded={fetchData} />
          </div>
        </div>
        
        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Spending by Category Chart */}
          <div className="p-4 sm:p-6 backdrop-blur-sm border border-pink-400/10 shadow-lg shadow-cyan-400/5">
            <h2 className="text-xl font-bold text-pink-500 mb-4">
              Spending by Category
            </h2>
            <div className={`w-full`} style={{ height: `${chartHeight}px` }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 80 : 100}
                    fill="#8884d8"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Next Month Prediction */}
          <div className="p-4 sm:p-6 backdrop-blur-sm border border-pink-400/10 shadow-lg shadow-cyan-400/5">
            <NextMonthPrediction />
          </div>
        </div>

        {/* Monthly Spending Trend */}
        <div className="p-4 sm:p-6 backdrop-blur-sm border border-pink-400/10 shadow-lg shadow-cyan-400/5">
          <h2 className="text-xl font-bold text-pink-500 mb-4">
            Monthly Spending Trend
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(145, 6, 215, 0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#b3b3b3"
                  tick={{ fill: '#b3b3b3' }}
                />
                <YAxis 
                  stroke="#b3b3b3"
                  tick={{ fill: '#b3b3b3' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(145, 6, 215, 0.3)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={{ fill: '##EC4899', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="p-4 sm:p-6 backdrop-blur-sm border border-pink-400/10 shadow-lg shadow-cyan-400/5">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-pink-500">
              Recent Transactions
            </h2>
            <div className="flex-1 h-px bg-pink-400/20" />
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr>
                  <th className="p-4 text-left font-bold border-b border-pink-400/20 text-pink-500">
                    Date
                  </th>
                  <th className="p-4 text-left font-bold border-b border-pink-400/20 text-pink-400">
                    Category
                  </th>
                  {!isMobile && (
                    <th className="p-4 text-left font-bold border-b border-pink-400/20 text-pink-500">
                      Description
                    </th>
                  )}
                  <th className="p-4 text-right font-bold border-b border-pink-400/20 text-pink-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...transactions].reverse().map((transaction) => (
                  <tr 
                    key={transaction.id}
                    className="hover:bg-cyan-400/5 transition-colors duration-200"
                  >
                    <td className="p-4 text-gray-300">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-300">{transaction.category}</td>
                    {!isMobile && (
                      <td className="p-4 text-gray-300">{transaction.description}</td>
                    )}
                    <td className={`p-4 text-right font-bold ${
                      transaction.amount < 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td 
                      colSpan={isMobile ? 3 : 4} 
                      className="p-8 text-center text-gray-500"
                    >
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;