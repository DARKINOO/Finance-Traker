from fastapi import APIRouter, HTTPException, Depends
from app.models import Transaction, TransactionCreate
from app.db import db
from bson import ObjectId
from typing import List
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    transaction_dict = transaction.dict()
    transaction_dict["_id"] = ObjectId()
    db.transactions.insert_one(transaction_dict)
    return {**transaction_dict, "id": str(transaction_dict["_id"])}

@router.get("/", response_model=List[Transaction])
async def get_transactions(user_id: str):
    transactions = []
    cursor = db.transactions.find({"user_id": user_id})
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        transactions.append(doc)
    return transactions

@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction(transaction_id: str):
    transaction = db.transactions.find_one({"_id": ObjectId(transaction_id)})
    if transaction:
        transaction["id"] = str(transaction["_id"])
        return transaction
    raise HTTPException(status_code=404, detail="Transaction not found")