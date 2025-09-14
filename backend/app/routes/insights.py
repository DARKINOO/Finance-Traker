from fastapi import APIRouter
from app.db import db
from typing import List, Dict
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/spending-by-category/{user_id}")
async def get_spending_by_category(user_id: str, days: int = 30):
    cutoff_date = datetime.now() - timedelta(days=days)
    
    pipeline = [
        {
            "$match": {
                "user_id": user_id,
                "date": {"$gte": cutoff_date}
            }
        },
        {
            "$group": {
                "_id": "$category",
                "total": {"$sum": "$amount"}
            }
        }
    ]
    
    results = list(db.transactions.aggregate(pipeline))
    return [{"category": r["_id"], "amount": r["total"]} for r in results]

@router.get("/monthly-trend/{user_id}")
async def get_monthly_trend(user_id: str, months: int = 6):
    cutoff_date = datetime.now() - timedelta(days=months * 30)
    
    pipeline = [
        {
            "$match": {
                "user_id": user_id,
                "date": {"$gte": cutoff_date}
            }
        },
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$date"},
                    "month": {"$month": "$date"}
                },
                "total": {"$sum": "$amount"}
            }
        },
        {
            "$sort": {"_id.year": 1, "_id.month": 1}
        }
    ]
    
    results = list(db.transactions.aggregate(pipeline))
    return [{"year": r["_id"]["year"], "month": r["_id"]["month"], "amount": r["total"]} for r in results]