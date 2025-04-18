// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceDashboard from './pages/AttendanceDashboard';
import Register from './pages/Register';

const App = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  return (
      <Routes>
        <Route path="/" element={token && userId ? <Navigate to="/attendance" /> : <Register />} />
        <Route path="/attendance" element={token && userId ? <MarkAttendance /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={token && userId ? <AttendanceDashboard /> : <Navigate to="/" />} />
      </Routes>
  );
};

export default App;
