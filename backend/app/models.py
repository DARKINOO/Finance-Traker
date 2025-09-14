from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: str
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime

class TransactionBase(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: datetime = Field(default_factory=datetime.now)

class TransactionCreate(TransactionBase):
    user_id: str

class Transaction(TransactionBase):
    id: str
    user_id: str