# HisabKitab AI

A modern AI-powered expense tracking and financial management application that combines traditional bookkeeping with artificial intelligence.

## Features

- **Smart AI Predictions**: Get next month's expense predictions based on your spending patterns
- **Beautiful Analytics**: Visualize your finances with interactive charts and insights
- **Secure Authentication**: Full user authentication system with JWT
- **Responsive Design**: Seamless experience across all devices
- **Real-time Tracking**: Monitor your expenses as they happen
- **Category Management**: Organize expenses with intelligent categorization
- **AI-Powered Categorization**: Automatic transaction categorization using machine learning

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Material-UI Icons
- Recharts for data visualization
- Axios for API calls

### Backend
- FastAPI
- MongoDB
- PyMongo for database operations
- JWT Authentication
- Scikit-learn for ML predictions

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- MongoDB 6.0+

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd hisabkitab-ai
```

2. **Set up the frontend**
```bash
cd frontend
npm install
npm start
```

3. **Set up the backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

4. **Set up the database**
- Install and start MongoDB
- Create a new MongoDB database
- Update the database configuration in `backend/.env`

## Environment Variables

### Frontend
Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8000
```

### Backend
Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/hisabkitab
SECRET_KEY=your_secret_key
```

## Features in Detail

### AI-Powered Predictions
- Uses machine learning to analyze spending patterns
- Considers seasonality and recurring expenses
- Provides confidence ranges for predictions
- Updates in real-time with new transactions

### Financial Dashboard
- Monthly spending trends
- Category-wise expense breakdown
- Interactive charts and visualizations
- Real-time transaction tracking

### Security
- JWT-based authentication
- Secure password hashing
- Protected API endpoints
- Data encryption

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - youremail@example.com
Project Link: [https://github.com/yourusername/finance_project](https://github.com/yourusername/finance_project)