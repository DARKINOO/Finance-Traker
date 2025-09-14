from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import users, transactions, insights
from app.ml import ml_endpoints

app = FastAPI(title="Finance Project API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
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
    return {"message": "Welcome to Finance Project API"}