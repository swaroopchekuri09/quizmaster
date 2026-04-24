// src/pages/Profile.js
// User profile page showing account details and stats

import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { attemptService, quizService } from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ total: 0, passed: 0, avgScore: 0 });
  const [adminStats, setAdminStats] = useState({ totalCreated: 0, published: 0 });

  useEffect(() => {
    if (isAdmin) {
      quizService.getAll().then((r) => {
        const creatorQuizzes = r.data.filter(q => (q.createdBy?._id || q.createdBy) === user?._id);
        const publishedCount = creatorQuizzes.filter(q => q.isPublished).length;
        setAdminStats({ totalCreated: creatorQuizzes.length, published: publishedCount });
      }).catch(() => {});
    } else {
      attemptService.getMyAttempts().then((r) => {
        const attempts = r.data;
        const total  = attempts.length;
        const passed = attempts.filter((a) => a.isPassed).length;
        const avgScore = total > 0
          ? (attempts.reduce((sum, a) => sum + a.percentage, 0) / total).toFixed(1)
          : 0;
        setStats({ total, passed, avgScore });
      }).catch(() => {});
    }
  }, [isAdmin, user?._id]);

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--light-bg)' }}>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold"><i className="bi bi-person-circle me-2"></i>My Profile</h1>
        </div>
      </div>
      <div className="container pb-5">
        <div className="row g-4 justify-content-center">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header text-center py-5" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                <div className="rounded-circle bg-white d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 80, height: 80 }}>
                  <i className="bi bi-person-fill fs-1 text-primary"></i>
                </div>
                <h4 className="fw-bold mb-1">{user?.name}</h4>
                <p className="mb-0 opacity-75 small">{user?.email}</p>
                <span className={`badge mt-2 px-3 py-2 ${user?.role === 'admin' ? 'bg-warning text-dark' : 'bg-light text-primary'}`}>
                  {user?.role === 'admin' ? '👑 Admin' : '🎓 Student'}
                </span>
              </div>
              <div className="card-body p-4">
                {isAdmin ? (
                  <div className="row g-3 text-center">
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light border border-primary border-opacity-25">
                        <div className="fw-bold fs-4 text-primary">{adminStats.totalCreated}</div>
                        <div className="text-muted small">Total Created Quizzes</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light border border-success border-opacity-25">
                        <div className="fw-bold fs-4 text-success">{adminStats.published}</div>
                        <div className="text-muted small">Published Quizzes</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="row g-3 text-center">
                    <div className="col-4">
                      <div className="p-3 rounded-3 bg-light">
                        <div className="fw-bold fs-4 text-primary">{stats.total}</div>
                        <div className="text-muted small">Attempts</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 rounded-3 bg-light">
                        <div className="fw-bold fs-4 text-success">{stats.passed}</div>
                        <div className="text-muted small">Passed</div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="p-3 rounded-3 bg-light">
                        <div className="fw-bold fs-4 text-info">{stats.avgScore}%</div>
                        <div className="text-muted small">Avg Score</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-4 d-flex flex-column gap-2">
                  {isAdmin ? (
                    <>
                      <Link to="/admin/dashboard" className="btn btn-primary-custom">
                        <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                      </Link>
                      <Link to="/admin/quizzes" className="btn btn-outline-primary">
                        <i className="bi bi-collection me-2"></i>Manage Your Quizzes
                      </Link>
                      <Link to="/admin/quizzes/create" className="btn btn-outline-success">
                        <i className="bi bi-plus-circle me-2"></i>Create New Quiz
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/quizzes" className="btn btn-primary-custom">
                        <i className="bi bi-collection me-2"></i>Browse Quizzes
                      </Link>
                      <Link to="/my-attempts" className="btn btn-outline-primary">
                        <i className="bi bi-clock-history me-2"></i>View My Attempts
                      </Link>
                      <Link to="/leaderboard" className="btn btn-outline-warning">
                        <i className="bi bi-trophy me-2"></i>Leaderboard
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
