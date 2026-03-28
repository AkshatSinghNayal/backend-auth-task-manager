import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const handleLogin = (newToken, userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
  };

  return token ? (
    <Dashboard token={token} user={user} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}

export default App;
