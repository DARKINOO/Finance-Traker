from pymongo import MongoClient
from dotenv import load_dotenv
import os
from pymongo.errors import ConnectionFailure
import sys

# Load environment variables
load_dotenv()

try:
    # MongoDB connection with options
    client = MongoClient(
        os.getenv("MONGODB_URI"),
        serverSelectionTimeoutMS=5000,  # 5 second timeout
        connectTimeoutMS=5000,
        retryWrites=True,
        w='majority'
    )
    # Verify the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
    db = client.finance_db
except ConnectionFailure as e:
    print(f"Failed to connect to MongoDB: {e}")
    sys.exit(1)