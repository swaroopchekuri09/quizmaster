// src/pages/Login.js
// User and Admin login page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData]   = useState({ email: '', password: '' });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      return setError('Please enter your email and password.');
    }
    try {
      setLoading(true);
      const user = await login(formData.email, formData.password);
      // Redirect based on role
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/quizzes');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill for demo credentials
  const fillAdmin = () => setFormData({ email: 'admin@quizmaster.com', password: 'admin123' });
  const fillUser  = () => setFormData({ email: 'alice@example.com', password: 'user1234' });

  return (
    <div className="container" style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="auth-card card">
        <div className="card-header">
          <i className="bi bi-lightning-charge-fill fs-2 mb-2 d-block text-warning"></i>
          <h3 className="fw-bold mb-1">Welcome Back!</h3>
          <p className="mb-0 opacity-75 small">Sign in to continue to QuizMaster</p>
        </div>
        <div className="card-body p-4">
          <AlertMessage message={error} onClose={() => setError('')} />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="login-email">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="login-password">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input
                  id="login-password"
                  type="password"
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary-custom w-100 py-2" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Login</>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 p-3 rounded-3 bg-light">
            <p className="small fw-bold text-muted mb-2">🔑 Quick Demo Login:</p>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-danger" onClick={fillAdmin}>Admin</button>
              <button className="btn btn-sm btn-outline-primary" onClick={fillUser}>User</button>
            </div>
          </div>

          <p className="text-center mt-3 mb-0 small text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary fw-semibold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
