from fastapi import APIRouter, Depends, HTTPException
from app.auth_utils import get_current_user
from app.ml.train_next_month import train_next_month_model, predict_next_month
from app.ml.train_category import train_category_model, predict_category
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter()

class TransactionInput(BaseModel):
    amount: float = Field(..., description="Transaction amount (positive or negative)")
    date: Optional[datetime] = Field(default=None, description="Transaction date")

@router.post("/train/next-month")
async def train_next_month(current_user: dict = Depends(get_current_user)):
    """Train the next month prediction model for the current user."""
    try:
        model, _ = train_next_month_model(str(current_user["_id"]))
        return {"message": "Next month prediction model trained successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error training model: {str(e)}")

@router.get("/predict/next-month")
async def get_next_month_prediction(current_user: dict = Depends(get_current_user)):
    """Get prediction for next month's total expenses."""
    try:
        prediction = predict_next_month(str(current_user["_id"]))
        return prediction
    except FileNotFoundError:
        # If model doesn't exist, try to train it first
        try:
            train_next_month_model(str(current_user["_id"]))
            prediction = predict_next_month(str(current_user["_id"]))
            return prediction
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making prediction: {str(e)}")

@router.post("/train/category")
async def train_category(current_user: dict = Depends(get_current_user)):
    """Train the category prediction model for the current user."""
    try:
        model, _ = train_category_model(str(current_user["_id"]))
        return {"message": "Category prediction model trained successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error training model: {str(e)}")

@router.post("/predict/category")
async def predict_transaction_category(
    transaction: TransactionInput,
    current_user: dict = Depends(get_current_user)
):
    """Predict category for a new transaction."""
    try:
        prediction = predict_category(
            str(current_user["_id"]),
            transaction.amount,
            transaction.date
        )
        return prediction
    except FileNotFoundError:
        # If model doesn't exist, try to train it first
        try:
            train_category_model(str(current_user["_id"]))
            prediction = predict_category(
                str(current_user["_id"]),
                transaction.amount,
                transaction.date
            )
            return prediction
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error making prediction: {str(e)}")