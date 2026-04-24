// src/pages/Register.js
// New user registration page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertMessage from '../components/AlertMessage';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password) {
      return setError('All fields are required.');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    try {
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
      navigate('/quizzes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <div className="auth-card card">
        <div className="card-header">
          <i className="bi bi-person-plus-fill fs-2 mb-2 d-block text-warning"></i>
          <h3 className="fw-bold mb-1">Create Account</h3>
          <p className="mb-0 opacity-75 small">Join QuizMaster for free</p>
        </div>
        <div className="card-body p-4">
          <AlertMessage message={error} onClose={() => setError('')} />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="reg-name">Full Name</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person"></i></span>
                <input id="reg-name" type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="reg-email">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input id="reg-email" type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="reg-password">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input id="reg-password" type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required />
              </div>
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold" htmlFor="reg-confirm">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input id="reg-confirm" type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
              </div>
            </div>
            <button type="submit" className="btn btn-primary-custom w-100 py-2" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
              ) : (
                <><i className="bi bi-rocket me-2"></i>Register</>
              )}
            </button>
          </form>
          <p className="text-center mt-3 mb-0 small text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
