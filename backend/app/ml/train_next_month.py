import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import pickle
from datetime import datetime, timedelta
import joblib
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the current directory
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(CURRENT_DIR, 'models')

# MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI"))
db = client.finance_db

# Ensure models directory exists
os.makedirs(MODELS_DIR, exist_ok=True)

def prepare_data(transactions):
    """Convert transactions into a format suitable for prediction."""
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    
    # Create date-based features
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['dayofweek'] = df['date'].dt.dayofweek
    
    # Encode categorical variables
    le = LabelEncoder()
    df['category_encoded'] = le.fit_transform(df['category'])
    
    # Calculate monthly aggregates
    monthly_stats = df.groupby(df['date'].dt.strftime('%Y-%m')).agg({
        'amount': ['sum', 'mean', 'std', 'count']
    }).reset_index()
    monthly_stats.columns = ['month', 'total', 'mean', 'std', 'count']

     # 🔧 Fill NaN or inf values safely
    monthly_stats = monthly_stats.fillna(0)
    monthly_stats = monthly_stats.replace([np.inf, -np.inf], 0)
    
    return monthly_stats, le

def train_next_month_model(user_id):
    """Train a model to predict next month's total expenses."""
    # Get user's transactions
    transactions = list(db.transactions.find({"user_id": user_id}))
    if not transactions:
        raise ValueError("No transactions found for user")
    
    # Prepare data
    monthly_stats, label_encoder = prepare_data(transactions)
    
    # Create features and target
    X = monthly_stats[['total', 'mean', 'std', 'count']].values[:-1]
    y = monthly_stats['total'].values[1:]
    
    if len(X) < 3:
        raise ValueError("Not enough data to train model (need at least 3 months)")
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save model and encoder
    model_path = os.path.join(MODELS_DIR, f'next_month_{user_id}.joblib')
    encoder_path = os.path.join(MODELS_DIR, f'label_encoder_{user_id}.joblib')
    
    joblib.dump(model, model_path)
    joblib.dump(label_encoder, encoder_path)
    
    return model, label_encoder

def predict_next_month(user_id):
    """Predict the total expenses for next month."""
    # Load model and encoder
    try:
        model_path = os.path.join(MODELS_DIR, f'next_month_{user_id}.joblib')
        model = joblib.load(model_path)
    except FileNotFoundError:
        model, _ = train_next_month_model(user_id)
    
    # Get recent transactions
    transactions = list(db.transactions.find({"user_id": user_id}))
    monthly_stats, _ = prepare_data(transactions)
    
    # Prepare features for prediction
    last_month = monthly_stats[['total', 'mean', 'std', 'count']].values[-1:]
    
    # Make prediction
    prediction = model.predict(last_month)[0]
    
    # Calculate confidence interval (using model's estimators predictions)
    predictions = []
    for estimator in model.estimators_:
        predictions.append(estimator.predict(last_month)[0])
    
    confidence_interval = np.percentile(predictions, [2.5, 97.5])
    
    return {
        'predicted_amount': round(float(prediction), 2),
        'confidence_min': round(float(confidence_interval[0]), 2),
        'confidence_max': round(float(confidence_interval[1]), 2)
    }

if __name__ == "__main__":
    # Example usage
    test_user_id = "your_test_user_id"  # Replace with actual user ID
    model, _ = train_next_month_model(test_user_id)
    prediction = predict_next_month(test_user_id)
    print(f"Next month prediction: {prediction}")
