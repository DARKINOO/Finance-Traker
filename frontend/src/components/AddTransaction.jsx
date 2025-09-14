import React, { useState } from 'react';
import { addTransaction } from '../services/api';
import CategoryPrediction from './CategoryPrediction';

const categories = [
  'Food',
  'Transportation',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Other'
];

const AddTransaction = ({ onTransactionAdded }) => {
  const [open, setOpen] = useState(false);
  const [transaction, setTransaction] = useState({
    amount: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setTransaction(prev => ({
        ...prev,
        amount: value
      }));
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const handleCategorySelect = (category) => {
    setTransaction(prev => ({
      ...prev,
      category
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please login first');
        return;
      }

      await addTransaction({
        ...transaction,
        amount: parseFloat(transaction.amount),
        user_id: userId
      });
      
      setSuccess(true);
      onTransactionAdded();
      handleClose();
      setTransaction({ amount: '', category: '', description: '' });
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError(error.response?.data?.detail || 'Failed to add transaction');
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="px-4 py-2 text-xl border text-pink-600 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Add Transaction
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-gray-900 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-pink-500 mb-4">Add New Transaction</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 dark:bg-red-200 dark:text-red-800" role="alert">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-pink-300 shadow-sm placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Amount"
                      value={transaction.amount}
                      onChange={handleAmountChange}
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter a positive or negative number</p>
                  </div>

                  {transaction.amount && (
                    <CategoryPrediction
                      amount={parseFloat(transaction.amount)}
                      onCategorySelect={handleCategorySelect}
                    />
                  )}

                  <div>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      value={transaction.category}
                      onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <textarea
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 shadow-sm placeholder-gray-400 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Description"
                      value={transaction.description}
                      onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
                    />
                  </div>

                  <div className="mt-5 sm:mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 
                             hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                             dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white text-sm font-medium 
                             hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="p-4 text-sm text-green-700 bg-green-100 dark:bg-green-200 dark:text-green-800" role="alert">
            Transaction added successfully!
          </div>
        </div>
      )}
    </>
  );
};

export default AddTransaction;