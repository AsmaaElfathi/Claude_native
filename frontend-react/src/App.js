import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import { getToken } from './utils/auth';

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<PrivateRoute><Rooms /></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/*" element={<Navigate to="/rooms" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
