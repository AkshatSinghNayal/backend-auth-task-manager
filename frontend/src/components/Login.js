import React, { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    const endpoint = isRegister
      ? `${API_BASE}/auth/register`
      : `${API_BASE}/auth/login`;

    const body = isRegister
      ? { name: formData.name, email: formData.email, password: formData.password }
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Show first validation error or server message
        const errMsg =
          data.errors?.[0]?.msg || data.message || 'Something went wrong';
        setMessage({ type: 'error', text: errMsg });
      } else {
        setMessage({ type: 'success', text: data.message });
        // Pass token and user info up to App
        onLogin(data.token, data.user);
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Is the server running?' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '80px auto' }}>
        <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>

        {message.text && (
          <div className={message.type === 'error' ? 'msg-error' : 'msg-success'}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setMessage({ type: '', text: '' }); }}
            style={{ background: 'none', color: '#4a90e2', border: 'none', cursor: 'pointer', fontSize: 13 }}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
