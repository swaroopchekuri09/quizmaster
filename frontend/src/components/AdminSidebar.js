// src/components/AdminSidebar.js
// Sidebar navigation for admin pages

import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/admin/dashboard',  icon: 'bi-speedometer2',   label: 'Dashboard'   },
    { to: '/admin/topics',     icon: 'bi-tags',            label: 'Topics'      },
    { to: '/admin/quizzes',    icon: 'bi-collection',      label: 'Quizzes'     },
    { to: '/admin/users',      icon: 'bi-people',          label: 'Users'       },
    { to: '/admin/attempts',   icon: 'bi-clock-history',   label: 'Attempts'    },
    { to: '/leaderboard',      icon: 'bi-trophy',          label: 'Leaderboard' },
  ];

  return (
    <div className="admin-sidebar d-none d-lg-flex flex-column">
      <div className="px-3 mb-4">
        <p className="text-white-50 small text-uppercase fw-bold mb-0">Admin Panel</p>
      </div>
      <nav className="flex-grow-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${link.icon}`}></i>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3">
        <button className="btn btn-outline-danger btn-sm w-100" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left me-1"></i>Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
