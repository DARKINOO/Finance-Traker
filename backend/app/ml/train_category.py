import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import pickle
from datetime import datetime
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
    """Convert transactions into a format suitable for category prediction."""
    # Convert to DataFrame
    df = pd.DataFrame(transactions)
    
    # Create features
    df['date'] = pd.to_datetime(df['date'])
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['dayofweek'] = df['date'].dt.dayofweek
    df['amount'] = df['amount'].abs()  # Use absolute values for prediction
    
    # Encode categories
    le = LabelEncoder()
    df['category_encoded'] = le.fit_transform(df['category'])
    
    return df, le

def train_category_model(user_id):
    """Train a model to predict transaction categories."""
    # Get user's transactions
    transactions = list(db.transactions.find({"user_id": user_id}))
    if not transactions:
        raise ValueError("No transactions found for user")
    
    # Prepare data
    df, label_encoder = prepare_data(transactions)
    
    # Create features and target
    X = df[['amount', 'month', 'day', 'dayofweek']].values
    y = df['category_encoded'].values
    
    if len(X) < 10:
        raise ValueError("Not enough data to train model (need at least 10 transactions)")
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save model and encoder
    model_path = os.path.join(MODELS_DIR, f'category_{user_id}.joblib')
    encoder_path = os.path.join(MODELS_DIR, f'category_encoder_{user_id}.joblib')
    
    joblib.dump(model, model_path)
    joblib.dump(label_encoder, encoder_path)
    
    return model, label_encoder

def predict_category(user_id, amount, date=None):
    """Predict the category for a new transaction."""
    # Load model and encoder
    try:
        model_path = os.path.join(MODELS_DIR, f'category_{user_id}.joblib')
        encoder_path = os.path.join(MODELS_DIR, f'category_encoder_{user_id}.joblib')
        model = joblib.load(model_path)
        label_encoder = joblib.load(encoder_path)
    except FileNotFoundError:
        try:
            model, label_encoder = train_category_model(user_id)
        except ValueError as e:
            raise ValueError(str(e))
    
    # Prepare features
    if date is None:
        date = datetime.now()
    
    features = np.array([[
        abs(amount),
        date.month,
        date.day,
        date.weekday()
    ]])
    
    # Make prediction
    category_encoded = model.predict(features)[0]
    predicted_category = label_encoder.inverse_transform([category_encoded])[0]
    
    # Get probabilities for all categories
    probabilities = model.predict_proba(features)[0]
    categories = label_encoder.inverse_transform(range(len(probabilities)))
    
    # Create sorted predictions with probabilities
    predictions = [
        {'category': cat, 'probability': round(float(prob), 3)}
        for cat, prob in sorted(
            zip(categories, probabilities),
            key=lambda x: x[1],
            reverse=True
        )
    ]
    
    return {
        'predicted_category': predicted_category,
        'all_predictions': predictions
    }

if __name__ == "__main__":
    # Example usage
    test_user_id = "your_test_user_id"  # Replace with actual user ID
    model, _ = train_category_model(test_user_id)
    prediction = predict_category(test_user_id, 1500)
    print(f"Category prediction: {prediction}")