// src/pages/Result.js
// Shows quiz result with score, review, and answer breakdown

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { attemptService } from '../services/api';
import Spinner from '../components/Spinner';

const Result = () => {
  const { state }  = useLocation();
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [data, setData]     = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!state) {
      attemptService.getById(id)
        .then((r) => setData(r.data))
        .catch(() => navigate('/quizzes'))
        .finally(() => setLoading(false));
    }
  }, [id, state, navigate]);

  if (loading) return <div style={{ paddingTop: '80px' }}><Spinner /></div>;
  if (!data)   return null;

  const { attempt, reviewQuestions, summary } = data;
  const s = summary || attempt;
  const isPassed    = s.isPassed;
  const percentage  = parseFloat(s.percentage).toFixed(1);

  const formatTime = (sec) => {
    if (!sec) return '—';
    const m = Math.floor(sec / 60), ss = sec % 60;
    return `${m}m ${ss}s`;
  };

  return (
    <div style={{ paddingTop: '80px', minHeight: '100vh', background: 'var(--light-bg)' }}>
      <div className="container py-4">

        {/* ── Result Hero Card ── */}
        <div className={`result-hero ${isPassed ? 'pass' : 'fail'} mb-4`}>
          <div className="score-circle mb-3">
            <div className="score-num">{s.score}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85 }}>/ {s.totalMarks}</div>
          </div>
          <h2 className="fw-bold mb-1">{isPassed ? '🎉 Congratulations!' : '😔 Better Luck Next Time'}</h2>
          <p className="mb-3 opacity-85">You scored {percentage}% — {isPassed ? 'You Passed!' : 'You Failed'}</p>
          <span className={`badge fs-6 px-4 py-2 ${isPassed ? 'bg-white text-success' : 'bg-white text-danger'}`}>
            {isPassed ? '✓ PASS' : '✗ FAIL'} (Pass >= 40%)
          </span>
        </div>

        {/* ── Stats Row ── */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Score',           val: `${s.score} / ${s.totalMarks}`, icon: 'bi-award',         color: 'text-primary' },
            { label: 'Correct',         val: s.correctCount,                  icon: 'bi-check-circle',  color: 'text-success' },
            { label: 'Wrong',           val: s.wrongCount,                    icon: 'bi-x-circle',      color: 'text-danger'  },
            { label: 'Skipped',         val: s.skippedCount || 0,             icon: 'bi-dash-circle',   color: 'text-warning' },
            { label: 'Percentage',      val: `${percentage}%`,                icon: 'bi-percent',       color: 'text-info'    },
            { label: 'Time Taken',      val: formatTime(attempt.timeTaken),   icon: 'bi-clock',         color: 'text-secondary' },
          ].map((item) => (
            <div className="col-6 col-md-4 col-lg-2" key={item.label}>
              <div className="card text-center p-3 border-0 shadow-sm h-100">
                <i className={`bi ${item.icon} ${item.color} fs-3 mb-2`}></i>
                <div className="fw-bold fs-5">{item.val}</div>
                <div className="text-muted small">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Actions ── */}
        <div className="d-flex gap-3 flex-wrap mb-4">
          <button className="btn btn-outline-primary px-4" onClick={() => setShowReview(!showReview)}>
            <i className="bi bi-eye me-2"></i>{showReview ? 'Hide' : 'Show'} Answer Review
          </button>
          <button className="btn btn-primary-custom px-4" onClick={() => navigate('/quizzes')}>
            <i className="bi bi-collection me-2"></i>More Quizzes
          </button>
          <button className="btn btn-outline-secondary px-4" onClick={() => navigate('/my-attempts')}>
            <i className="bi bi-clock-history me-2"></i>My Attempts
          </button>
          <button className="btn btn-outline-warning px-4" onClick={() => navigate('/leaderboard')}>
            <i className="bi bi-trophy me-2"></i>Leaderboard
          </button>
        </div>

        {/* ── Answer Review ── */}
        {showReview && reviewQuestions && (
          <div>
            <h5 className="fw-bold mb-3">Answer Review</h5>
            {reviewQuestions.map((q, i) => {
              const status = !q.selectedAnswer ? 'skipped' : q.isCorrect ? 'correct' : 'wrong';
              return (
                <div key={q._id} className={`answer-item ${status} mb-3`}>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="fw-semibold">Q{i + 1}. {q.questionText}</span>
                    <span className={`badge ms-2 flex-shrink-0 ${status === 'correct' ? 'bg-success' : status === 'wrong' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                      {status === 'correct' ? '✓ Correct' : status === 'wrong' ? '✗ Wrong' : '— Skipped'}
                    </span>
                  </div>
                  {q.options.map((opt, oi) => {
                    const isCorrect  = opt === q.correctAnswer;
                    const isSelected = opt === q.selectedAnswer;
                    return (
                      <div key={oi} className={`ms-3 mb-1 d-flex align-items-center gap-2 small ${isCorrect ? 'text-success fw-bold' : isSelected && !isCorrect ? 'text-danger' : 'text-muted'}`}>
                        <i className={`bi ${isCorrect ? 'bi-check-circle-fill' : isSelected ? 'bi-x-circle-fill' : 'bi-circle'}`}></i>
                        {opt}
                        {isCorrect && ' (Correct Answer)'}
                        {isSelected && !isCorrect && ' (Your Answer)'}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Result;
