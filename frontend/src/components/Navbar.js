// src/components/Navbar.js
// Main navigation bar with dark mode toggle and role-based links

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand text-white" to="/">
          <i className="bi bi-lightning-charge-fill me-2"></i>
          QuizMaster
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list text-white fs-4"></i>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>Home
              </Link>
            </li>
            {user && !isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/quizzes">
                    <i className="bi bi-collection me-1"></i>Quizzes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    <i className="bi bi-trophy me-1"></i>Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-attempts">
                    <i className="bi bi-clock-history me-1"></i>My Attempts
                  </Link>
                </li>
              </>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i>Admin
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {/* Dark Mode Toggle */}
            <li className="nav-item">
              <button
                className="btn btn-sm btn-outline-light rounded-pill px-3"
                onClick={toggleDarkMode}
                title="Toggle Dark Mode"
              >
                <i className={`bi ${darkMode ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-light text-primary rounded-pill px-3 fw-600"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-sm btn-light text-primary rounded-pill px-3 fw-bold" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
