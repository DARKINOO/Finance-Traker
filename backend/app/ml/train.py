# Machine learning model for expense prediction
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor

def train_model(data):
    """
    Train a machine learning model for expense prediction
    """
    # Prepare features and target
    X = data[['amount', 'category']]  # Add more features as needed
    y = data['amount']
    
    # Convert categorical variables
    X = pd.get_dummies(X, columns=['category'])
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Save model
    joblib.dump(model, 'model.joblib')
    return model