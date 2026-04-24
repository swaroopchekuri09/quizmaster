// src/pages/TakeQuiz.js
// Main quiz-taking page with timer, question navigation, and palette

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizService, questionService, attemptService } from '../services/api';
import Spinner from '../components/Spinner';

const TakeQuiz = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [quiz, setQuiz]               = useState(null);
  const [questions, setQuestions]     = useState([]);
  const [answers, setAnswers]         = useState({});   // { questionId: selectedAnswer }
  const [current, setCurrent]         = useState(0);    // current question index
  const [timeLeft, setTimeLeft]       = useState(0);    // seconds remaining
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const startTime = useRef(Date.now());
  const submitted = useRef(false);

  // Fetch quiz and questions on mount
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const [quizRes, qRes] = await Promise.all([
          quizService.getById(id),
          questionService.getByQuiz(id),
        ]);
        setQuiz(quizRes.data);
        setQuestions(qRes.data);
        setTimeLeft(quizRes.data.duration * 60); // convert minutes to seconds
      } catch {
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  // Submit quiz (called on manual submit OR timer end)
  const handleSubmit = useCallback(async () => {
    if (submitted.current || submitting) return;
    submitted.current = true;
    setSubmitting(true);
    try {
      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      const answersArr = questions.map((q) => ({
        questionId:     q._id,
        selectedAnswer: answers[q._id] || '',
      }));
      const res = await attemptService.submit({ quizId: id, answers: answersArr, timeTaken });
      navigate(`/result/${res.data.attempt._id}`, { state: res.data });
    } catch (err) {
      console.error(err);
      submitted.current = false;
      setSubmitting(false);
    }
  }, [id, questions, answers, submitting, navigate]);

  // Countdown timer
  useEffect(() => {
    if (!quiz || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // Auto-submit when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz, handleSubmit, timeLeft]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerClass = timeLeft <= 60 ? 'danger' : timeLeft <= 180 ? 'warning' : '';

  const q = questions[current];
  const attempted = Object.keys(answers).length;

  if (loading) return <div style={{ paddingTop: '80px' }}><Spinner text="Loading quiz..." /></div>;
  if (!quiz || questions.length === 0) return (
    <div style={{ paddingTop: '80px' }} className="container text-center py-5">
      <h4 className="text-muted">No questions available for this quiz.</h4>
    </div>
  );

  return (
    <div style={{ paddingTop: '70px' }}>
      {/* ── Timer Bar ── */}
      <div className="timer-bar">
        <div className="container d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="fw-bold text-truncate">{quiz.title}</div>
          <div className="d-flex align-items-center gap-3">
            <div className={`timer-display ${timerClass}`}>
              <i className="bi bi-stopwatch me-2"></i>{formatTime(timeLeft)}
            </div>
            <span className="badge bg-light text-dark">{attempted}/{questions.length} Answered</span>
            <button
              className="btn btn-success btn-sm px-3"
              onClick={() => setShowSubmitModal(true)}
              disabled={submitting}
            >
              <i className="bi bi-check-circle me-1"></i>Submit
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div className="progress" style={{ height: '4px' }}>
          <div
            className="progress-bar"
            style={{ width: `${(attempted / questions.length) * 100}%`, background: 'var(--gradient-primary)' }}
          ></div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* ── Question Area ── */}
          <div className="col-lg-8">
            <div className="card border-0 rounded-4 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge rounded-pill px-3 py-2" style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                  Question {current + 1} of {questions.length}
                </span>
                <span className="badge bg-light text-primary">
                  <i className="bi bi-award me-1"></i>{q.marks} mark{q.marks > 1 ? 's' : ''}
                </span>
              </div>

              <h5 className="fw-bold mb-4" style={{ lineHeight: 1.5 }}>{q.questionText}</h5>

              {/* Options */}
              <div className="d-flex flex-column gap-3">
                {q.options.map((opt, idx) => {
                  const isSelected = answers[q._id] === opt;
                  return (
                    <label
                      key={idx}
                      className={`d-flex align-items-center gap-3 p-3 rounded-3 cursor-pointer border ${
                        isSelected ? 'border-primary bg-primary bg-opacity-10' : 'border-light bg-light'
                      }`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      <input
                        type="radio"
                        name={`q-${q._id}`}
                        value={opt}
                        checked={isSelected}
                        onChange={() => setAnswers({ ...answers, [q._id]: opt })}
                        className="form-check-input flex-shrink-0"
                        style={{ width: '20px', height: '20px' }}
                      />
                      <span className="fw-medium">{['A', 'B', 'C', 'D'][idx]}. {opt}</span>
                    </label>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setCurrent((c) => c - 1)}
                  disabled={current === 0}
                >
                  <i className="bi bi-arrow-left me-2"></i>Previous
                </button>
                {current < questions.length - 1 ? (
                  <button
                    className="btn btn-primary-custom px-4"
                    onClick={() => setCurrent((c) => c + 1)}
                  >
                    Next <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                ) : (
                  <button className="btn btn-success px-4" onClick={() => setShowSubmitModal(true)}>
                    <i className="bi bi-check-circle me-2"></i>Submit Quiz
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Question Palette ── */}
          <div className="col-lg-4">
            <div className="card border-0 rounded-4 shadow-sm p-3 position-sticky" style={{ top: '80px' }}>
              <h6 className="fw-bold mb-3">Question Palette</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {questions.map((ques, idx) => (
                  <button
                    key={idx}
                    className={`q-palette-btn ${answers[ques._id] ? 'answered' : ''} ${current === idx ? 'current' : ''}`}
                    onClick={() => setCurrent(idx)}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div className="border-top pt-3">
                <div className="d-flex align-items-center gap-2 small mb-1">
                  <div className="q-palette-btn answered" style={{ width: 20, height: 20, borderRadius: 4, fontSize: '0.6rem' }}></div>
                  <span className="text-muted">Answered ({attempted})</span>
                </div>
                <div className="d-flex align-items-center gap-2 small">
                  <div className="q-palette-btn" style={{ width: 20, height: 20, borderRadius: 4, fontSize: '0.6rem' }}></div>
                  <span className="text-muted">Unanswered ({questions.length - attempted})</span>
                </div>
              </div>
              <button
                className="btn btn-success w-100 mt-3"
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
              >
                {submitting ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check-circle me-2"></i>}
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Confirm Submission</h5>
                <button className="btn-close" onClick={() => setShowSubmitModal(false)}></button>
              </div>
              <div className="modal-body text-center py-3">
                <i className="bi bi-question-circle text-warning" style={{ fontSize: '3rem' }}></i>
                <div className="mt-3">
                  <p className="mb-1"><strong>Answered:</strong> {attempted} / {questions.length}</p>
                  <p className="mb-0 text-muted small">Unanswered questions will be marked as wrong.</p>
                </div>
              </div>
              <div className="modal-footer border-0 justify-content-center gap-3">
                <button className="btn btn-outline-secondary" onClick={() => setShowSubmitModal(false)}>Keep Answering</button>
                <button className="btn btn-success px-4" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
