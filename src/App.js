import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector
import './App.css';
import LoginForm from './LoginForm';
import NewComponent from './NewComponent';
import MainPage from './MainPage';

function App() {
  const storedToken = localStorage.getItem('token');
  const token = useSelector((state) => state.token) || storedToken;  // Access the token from Redux store

  const ProtectedRoute = ({ element, path }) => {
    if (!token && path !== '/login') {
      return <Navigate to="/login" />;
    }
    return element;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/main/*"
            element={<ProtectedRoute element={<MainPage />} path="/main/*" />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute element={<div>404 Unauthorized</div>} path="/*" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
