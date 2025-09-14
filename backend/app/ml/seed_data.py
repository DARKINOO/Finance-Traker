from faker import Faker
import random
from datetime import datetime, timedelta
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import argparse
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

# MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI"))
db = client.finance_db

# Initialize Faker and password context
fake = Faker()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_or_create_test_user(email="test@example.com", password="password123"):
    """Get existing test user or create a new one."""
    user = db.users.find_one({"email": email})
    
    if not user:
        user = {
            "_id": ObjectId(),
            "email": email,
            "password": pwd_context.hash(password),
            "name": "Test User"
        }
        db.users.insert_one(user)
        print(f"Created new test user with email: {email}")
    else:
        print(f"Using existing user with email: {email}")
    
    return str(user["_id"])

# Categories with their typical amount ranges and sample descriptions
CATEGORIES = {
    'Food': {
        'range': (100, 2000),
        'descriptions': [
            'Lunch at {}', 'Dinner at {}', 'Groceries from {}',
            'Food delivery from {}', 'Coffee at {}'
        ],
        'places': [
            'Dominos', 'McDonald\'s', 'Subway', 'Local Cafe',
            'Whole Foods', 'Restaurant', 'Starbucks'
        ]
    },
    'Rent': {
        'range': (15000, 50000),
        'descriptions': ['Monthly Rent', 'House Rent', 'Apartment Rent'],
        'places': []
    },
    'Travel': {
        'range': (500, 5000),
        'descriptions': [
            'Uber to {}', 'Cab from {}', 'Bus ticket to {}',
            'Train ticket to {}', 'Flight to {}'
        ],
        'places': [
            'Airport', 'Office', 'Home', 'Mall', 'Station',
            'Downtown', 'Market'
        ]
    },
    'Shopping': {
        'range': (500, 10000),
        'descriptions': [
            'Shopping at {}', 'Clothes from {}', 'Electronics from {}',
            'Purchase at {}', 'Online order from {}'
        ],
        'places': [
            'Amazon', 'Mall', 'Walmart', 'Target', 'Best Buy',
            'Nike Store', 'Apple Store'
        ]
    },
    'Entertainment': {
        'range': (200, 3000),
        'descriptions': [
            'Movie at {}', 'Gaming subscription {}', 'Concert at {}',
            'Streaming service {}', 'Entertainment at {}'
        ],
        'places': [
            'Netflix', 'PVR Cinema', 'PlayStation', 'Spotify',
            'Theme Park', 'Theatre'
        ]
    },
    'Bills': {
        'range': (1000, 8000),
        'descriptions': [
            'Electricity Bill', 'Water Bill', 'Internet Bill',
            'Phone Bill', 'Gas Bill', 'Insurance Payment'
        ],
        'places': []
    },
    'Salary': {
        'range': (50000, 150000),
        'descriptions': [
            'Monthly Salary', 'Salary Credit', 'Income'
        ],
        'places': []
    }
}

def generate_transaction(user_id, date):
    category = random.choice(list(CATEGORIES.keys()))
    category_data = CATEGORIES[category]
    amount = random.uniform(*category_data['range'])
    
    if category_data['places']:
        place = random.choice(category_data['places'])
        description = random.choice(category_data['descriptions']).format(place)
    else:
        description = random.choice(category_data['descriptions'])
    
    # Make salary always positive, expenses negative
    if category != 'Salary':
        amount = -amount

    return {
        "_id": ObjectId(),
        "user_id": user_id,
        "amount": round(amount, 2),
        "category": category,
        "description": description,
        "date": date
    }

def seed_transactions(user_id, num_months=18, transactions_per_month=(25, 35)):
    """Generate realistic transactions for the given user over a period."""
    
    # Clear existing transactions for this user
    db.transactions.delete_many({"user_id": user_id})
    
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30 * num_months)
    
    all_transactions = []
    current_date = start_date
    
    while current_date < end_date:
        # Generate random number of transactions for this month
        num_transactions = random.randint(*transactions_per_month)
        
        # Generate transactions for the month
        month_transactions = []
        for _ in range(num_transactions):
            # Random day in the current month
            transaction_date = current_date + timedelta(
                days=random.randint(0, 29)
            )
            transaction = generate_transaction(user_id, transaction_date)
            month_transactions.append(transaction)
        
        all_transactions.extend(month_transactions)
        current_date += timedelta(days=30)
    
    # Insert all transactions
    if all_transactions:
        db.transactions.insert_many(all_transactions)
        print(f"Created {len(all_transactions)} transactions for user {user_id}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Seed transaction data for testing ML models')
    parser.add_argument('--email', default='test@example.com',
                      help='Email for test user (default: test@example.com)')
    parser.add_argument('--password', default='password123',
                      help='Password for test user (default: password123)')
    parser.add_argument('--months', type=int, default=18,
                      help='Number of months of data to generate (default: 18)')
    parser.add_argument('--min-transactions', type=int, default=25,
                      help='Minimum transactions per month (default: 25)')
    parser.add_argument('--max-transactions', type=int, default=35,
                      help='Maximum transactions per month (default: 35)')
    
    args = parser.parse_args()
    
    # Get or create test user
    user_id = get_or_create_test_user(args.email, args.password)
    
    # Generate transactions
    seed_transactions(
        user_id,
        num_months=args.months,
        transactions_per_month=(args.min_transactions, args.max_transactions)
    )
    
    print("\nYou can now log in with:")
    print(f"Email: {args.email}")
    print(f"Password: {args.password}")
    print("\nUser ID (for reference):", user_id)