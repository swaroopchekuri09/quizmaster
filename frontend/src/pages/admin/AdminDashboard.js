// src/pages/admin/AdminDashboard.js
// Admin dashboard with analytics stats and recent activity

import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ paddingTop: '80px' }}><Spinner /></div>;

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Dashboard</h2>
            <p className="text-muted mb-0">Welcome back, Admin 👋</p>
          </div>
          <Link to="/admin/quizzes/create" className="btn btn-primary-custom">
            <i className="bi bi-plus-circle me-2"></i>New Quiz
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          {[
            { label: 'Total Users',       val: stats.totalUsers,      icon: 'bi-people',        cls: 'primary'  },
            { label: 'Total Quizzes',     val: stats.totalQuizzes,    icon: 'bi-collection',    cls: 'success'  },
            { label: 'Total Attempts',    val: stats.totalAttempts,   icon: 'bi-clock-history', cls: 'warning'  },
            { label: 'Avg Score',         val: `${stats.avgScore}%`,  icon: 'bi-bar-chart',     cls: 'danger'   },
          ].map((s) => (
            <div className="col-sm-6 col-xl-3" key={s.label}>
              <div className={`stat-card ${s.cls}`}>
                <i className={`bi ${s.icon} mb-2`} style={{ fontSize: '2.2rem' }}></i>
                <div className="stat-number">{s.val}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary Stats */}
        <div className="row g-4 mb-4">
          {[
            { label: 'Published Quizzes', val: stats.publishedQuizzes, icon: 'bi-check-circle', color: 'text-success' },
            { label: 'Total Topics',      val: stats.totalTopics,      icon: 'bi-tags',          color: 'text-info'    },
            { label: 'Pass Rate',         val: stats.totalAttempts > 0 ? `${((stats.passCount / stats.totalAttempts) * 100).toFixed(1)}%` : '0%', icon: 'bi-trophy', color: 'text-warning' },
            { label: 'Avg Time (sec)',    val: `${stats.avgTime}s`,    icon: 'bi-stopwatch',     color: 'text-primary' },
          ].map((s) => (
            <div className="col-6 col-md-3" key={s.label}>
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                <i className={`bi ${s.icon} ${s.color} fs-3 mb-2`}></i>
                <div className="fw-bold fs-4">{s.val}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Recent Attempts */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h6 className="fw-bold mb-0"><i className="bi bi-clock-history me-2 text-primary"></i>Recent Attempts</h6>
                <Link to="/admin/attempts" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Quiz</th>
                      <th>Score</th>
                      <th>Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentAttempts.map((a) => (
                      <tr key={a._id}>
                        <td><small className="fw-semibold">{a.userId?.name || '—'}</small></td>
                        <td><small className="text-muted">{a.quizId?.title || '—'}</small></td>
                        <td><small>{a.score}/{a.totalMarks}</small></td>
                        <td>
                          <span className={`badge ${a.isPassed ? 'bg-success' : 'bg-danger'}`}>
                            {a.isPassed ? 'Pass' : 'Fail'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Top Quizzes */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="fw-bold mb-0"><i className="bi bi-fire me-2 text-danger"></i>Top Quizzes</h6>
              </div>
              <div className="card-body pt-0">
                {stats.topQuizzes.map((q, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between py-2 border-bottom">
                    <div>
                      <div className="fw-semibold small">{q.quizTitle}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{q.count} attempt{q.count !== 1 ? 's' : ''}</div>
                    </div>
                    <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3">
                      {q.avgScore}% avg
                    </span>
                  </div>
                ))}
                {stats.topQuizzes.length === 0 && (
                  <p className="text-muted text-center py-3 small">No attempts yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="row g-3 mt-1">
          {[
            { to: '/admin/topics',         icon: 'bi-tags',         label: 'Manage Topics',    cls: 'outline-info'    },
            { to: '/admin/quizzes',        icon: 'bi-collection',   label: 'Manage Quizzes',   cls: 'outline-primary' },
            { to: '/admin/users',          icon: 'bi-people',       label: 'View Users',       cls: 'outline-success' },
            { to: '/admin/attempts',       icon: 'bi-clock-history',label: 'View Attempts',    cls: 'outline-warning' },
          ].map((l) => (
            <div className="col-6 col-md-3" key={l.to}>
              <Link to={l.to} className={`btn btn-${l.cls} w-100 py-3 rounded-3 d-flex flex-column align-items-center gap-1`}>
                <i className={`bi ${l.icon} fs-4`}></i>
                <span className="small fw-semibold">{l.label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
