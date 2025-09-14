from fastapi import APIRouter, HTTPException, Depends
from app.models import User, UserCreate
from app.auth import get_password_hash, verify_password, create_access_token
from app.db import db
from bson import ObjectId
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate):
    # Check if user exists
    if db.users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict["_id"] = ObjectId()
    
    db.users.insert_one(user_dict)
    
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(login_data: LoginRequest):
    try:
        user = db.users.find_one({"email": login_data.email})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(login_data.password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": str(user["_id"])})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user["_id"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))