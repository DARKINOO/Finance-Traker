import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './index.css';

const globalStyles = {
  // These styles will be added to index.css later
}

 

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-background bg-[radial-gradient(circle_at_50%_50%,rgba(145,6,215,0.1),rgba(0,0,0,0)_50%)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;