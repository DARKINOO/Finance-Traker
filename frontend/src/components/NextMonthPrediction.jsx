import React, { useState } from 'react';
import { predictNextMonth } from '../services/api';

const NextMonthPrediction = () => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPrediction = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await predictNextMonth();
            setPrediction(data);
        } catch (err) {
            setError(err.response?.data?.detail || 'Error getting prediction');
        } finally {
            setLoading(false);
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(Math.abs(amount));
    };

    return (
        <div className="shadow-lg overflow-hidden backdrop-blur-sm border border-pink-400/10">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400 mb-4">
                    Next Month's Expense Prediction
                </h2>
                
                <div className="mb-6 space-y-3">
                    <p className="text-gray-300 text-lg">
                        Our AI analyzes your spending patterns using:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-md">
                        <li className="flex items-start space-x-2">
                            <span className="text-pink-500 mt-1">•</span>
                            <span className="text-gray-400">Monthly spending trends & seasonality</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-pink-500 mt-1">•</span>
                            <span className="text-gray-400">Category-wise expense patterns</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-pink-500 mt-1">•</span>
                            <span className="text-gray-400">Regular bills & subscriptions</span>
                        </li>
                        <li className="flex items-start space-x-2">
                            <span className="text-pink-500 mt-1">•</span>
                            <span className="text-gray-400">Historical spending behavior</span>
                        </li>
                    </ul>
                </div>

                {loading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 text-sm text-red-400 bg-red-900/50 rounded-lg border border-red-500/20" role="alert">
                        {error}
                    </div>
                )}

                {prediction && (
                    <div className="space-y-3 bg-gray-900/30 p-4 rounded-lg border border-pink-400/10">
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
                            {formatAmount(prediction.predicted_amount)}
                        </h3>
                        <p className="text-sm text-gray-400">
                            Confidence Range: {formatAmount(prediction.confidence_min)} - {formatAmount(prediction.confidence_max)}
                        </p>
                        <p className="text-xs text-gray-500">
                            * Prediction based on your last 6 months of transaction history and spending patterns
                        </p>
                    </div>
                )}

                <button 
                    onClick={getPrediction}
                    disabled={loading}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white text-xl border font-medium 
                             hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {prediction ? 'Refresh Prediction' : 'Get Prediction'}
                </button>
            </div>
        </div>
    );
};

export default NextMonthPrediction;
