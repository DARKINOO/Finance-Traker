from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routes import users, transactions, insights
from app.ml import ml_endpoints
import os
import datetime

app = FastAPI(
    title="HisabKitab AI API",
    description="Backend API for HisabKitab AI - Smart Expense Tracking with AI",
    version="1.0.0"
)

# Configure CORS with environment-based origins
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
ALLOWED_ORIGINS = [
    FRONTEND_URL,
    "http://localhost:3000",
    "https://hisabkitab-ai.vercel.app",  # Add your Vercel domain here
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])
app.include_router(ml_endpoints.router, prefix="/api/ml", tags=["ml"])

@app.get("/")
async def root():
    return JSONResponse(
        content={
            "message": "Welcome to HisabKitab AI API",
            "status": "operational",
            "version": "1.0.0",
            "documentation": "/docs",
        },
        status_code=200
    )

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={
            "status": "healthy",
            "timestamp": datetime.datetime.now().isoformat()
        },
        status_code=200
    )