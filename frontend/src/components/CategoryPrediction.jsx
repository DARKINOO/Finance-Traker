import React, { useState, useEffect } from 'react';
import { predictCategory } from '../services/api';

const CategoryPrediction = ({ amount, onCategorySelect }) => {
    const [predictions, setPredictions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (amount > 0) {
            getPrediction();
        }
    }, [amount]);

    const getPrediction = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Ensure amount is a valid number
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                throw new Error("Invalid amount");
            }
            
            const data = await predictCategory(Math.abs(numAmount));
            setPredictions(data);
        } catch (err) {
            let errorMessage = 'Error getting prediction';
            if (err.message === "Invalid amount") {
                errorMessage = "Please enter a valid number";
            } else if (err.response?.data?.detail) {
                errorMessage = typeof err.response.data.detail === 'object' 
                    ? err.response.data.detail.msg 
                    : err.response.data.detail;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!amount) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mt-4">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-pink-500 mb-4">
                    Suggested Categories
                </h3>

                {loading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                        {error}
                    </div>
                )}

                {predictions && (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-400">
                        {predictions.all_predictions.map((pred, index) => (
                            <li 
                                key={pred.category}
                                onClick={() => onCategorySelect(pred.category)}
                                className={`py-3 cursor-pointer transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700
                                          ${index === 0 ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {pred.category}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Confidence: {(pred.probability * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                                        <div 
                                            className="h-2 bg-primary-600 rounded-full transition-all duration-300" 
                                            style={{ width: `${pred.probability * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default CategoryPrediction;