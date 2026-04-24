// src/pages/admin/ViewAttempts.js
// Admin: View all quiz attempts across all users

import { useState, useEffect } from 'react';
// Uses axios directly for fetching admin stats
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';
import axios from 'axios';

const ViewAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Fetch all attempts via admin — we reuse the attempt route with a broad quiz filter
    // Since we don't have a "get all attempts" endpoint, we call admin stats which has recentAttempts,
    // but let's use axios directly to get all attempts
    const token = localStorage.getItem('qm_token');
    axios.get(`${process.env.REACT_APP_API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => {
      setAttempts(r.data.recentAttempts || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatTime = (sec) => {
    if (!sec) return '—';
    return `${Math.floor(sec / 60)}m ${sec % 60}s`;
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <h2 className="fw-bold mb-1">Quiz Attempts</h2>
        <p className="text-muted mb-4">Recent 10 attempts across all quizzes</p>

        {loading ? <Spinner /> : (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>User</th><th>Quiz</th><th>Score</th>
                    <th>Percent</th><th>Time</th><th>Result</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a, i) => (
                    <tr key={a._id}>
                      <td>{i + 1}</td>
                      <td><small className="fw-semibold">{a.userId?.name || '—'}</small><br /><small className="text-muted">{a.userId?.email}</small></td>
                      <td><small>{a.quizId?.title || '—'}</small></td>
                      <td><span className="fw-bold">{a.score}/{a.totalMarks}</span></td>
                      <td>
                        <div className="progress mb-1" style={{ height: '5px', width: '70px' }}>
                          <div className="progress-bar bg-primary" style={{ width: `${a.percentage}%` }}></div>
                        </div>
                        <small>{parseFloat(a.percentage).toFixed(1)}%</small>
                      </td>
                      <td><small>{formatTime(a.timeTaken)}</small></td>
                      <td>
                        <span className={`badge ${a.isPassed ? 'bg-success' : 'bg-danger'}`}>
                          {a.isPassed ? 'Pass' : 'Fail'}
                        </span>
                      </td>
                      <td><small className="text-muted">{new Date(a.submittedAt).toLocaleDateString()}</small></td>
                    </tr>
                  ))}
                  {attempts.length === 0 && (
                    <tr><td colSpan="8" className="text-center text-muted py-4">No attempts yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAttempts;
