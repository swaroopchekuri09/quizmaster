// src/pages/MyAttempts.js
// Shows all past quiz attempts for the logged-in user

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attemptService } from '../services/api';
import Spinner from '../components/Spinner';

const MyAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    attemptService.getMyAttempts()
      .then((r) => setAttempts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (sec) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}m ${s}s`;
  };

  if (loading) return <div style={{ paddingTop: '80px' }}><Spinner /></div>;

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-header">
        <div className="container">
          <h1 className="fw-bold"><i className="bi bi-clock-history me-2"></i>My Attempts</h1>
          <p className="mb-0 opacity-75">{attempts.length} attempt{attempts.length !== 1 ? 's' : ''} recorded</p>
        </div>
      </div>

      <div className="container pb-5">
        {attempts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-journal-x text-muted" style={{ fontSize: '4rem' }}></i>
            <h4 className="mt-3 text-muted">No attempts yet</h4>
            <Link to="/quizzes" className="btn btn-primary-custom mt-3">Browse Quizzes</Link>
          </div>
        ) : (
          <div className="row g-4">
            {attempts.map((a) => (
              <div className="col-md-6 col-lg-4" key={a._id}>
                <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                  <div className={`card-header border-0 py-3 ${a.isPassed ? 'bg-success' : 'bg-danger'} text-white`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">
                        {a.isPassed ? '✓ Passed' : '✗ Failed'}
                      </span>
                      <span className="badge bg-white bg-opacity-25 px-2">
                        {a.quizId?.topic?.name || 'General'}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">{a.quizId?.title || 'Quiz'}</h6>
                    <div className="row g-2 text-center mb-3">
                      <div className="col-4">
                        <div className="p-2 rounded-3 bg-light">
                          <div className="fw-bold">{a.score}/{a.totalMarks}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>Score</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded-3 bg-light">
                          <div className="fw-bold">{parseFloat(a.percentage).toFixed(1)}%</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>Percentage</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 rounded-3 bg-light">
                          <div className="fw-bold">{formatTime(a.timeTaken)}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>Time</div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2 small text-muted mb-3">
                      <span><i className="bi bi-check-circle text-success me-1"></i>{a.correctCount} correct</span>
                      <span><i className="bi bi-x-circle text-danger me-1"></i>{a.wrongCount} wrong</span>
                    </div>
                    <div className="text-muted small mb-3">
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric'})}
                    </div>
                    <Link to={`/result/${a._id}`} className="btn btn-outline-primary btn-sm w-100">
                      <i className="bi bi-eye me-2"></i>View Result
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttempts;
