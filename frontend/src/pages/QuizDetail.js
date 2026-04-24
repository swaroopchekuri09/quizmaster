// src/pages/QuizDetail.js
// Quiz detail page - shows quiz info and start button

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizService } from '../services/api';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    quizService.getById(id)
      .then((r) => setQuiz(r.data))
      .catch(() => navigate('/quizzes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div style={{ paddingTop: '80px' }}><Spinner /></div>;
  if (!quiz)   return null;

  return (
    <div style={{ paddingTop: '80px' }}>
      <div className="page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-2">
              <li className="breadcrumb-item"><Link to="/quizzes" className="text-white-50">Quizzes</Link></li>
              <li className="breadcrumb-item active text-white">{quiz.title}</li>
            </ol>
          </nav>
          <h1 className="fw-bold">{quiz.title}</h1>
          <span className="badge bg-light text-primary px-3 py-2 rounded-pill">
            {quiz.topic?.name}
          </span>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card card-custom p-4 mb-4">
              <h5 className="fw-bold mb-3"><i className="bi bi-info-circle me-2 text-primary"></i>Quiz Overview</h5>
              <p className="text-muted">{quiz.description || 'No description provided.'}</p>
              <hr />
              <div className="row g-3 text-center">
                {[
                  { icon: 'bi-clock',          label: 'Duration',     val: `${quiz.duration} min`           },
                  { icon: 'bi-patch-question',  label: 'Questions',    val: quiz.questionCount || 0           },
                  { icon: 'bi-award',           label: 'Total Marks',  val: quiz.totalMarks || 0              },
                  { icon: 'bi-bar-chart',       label: 'Pass Mark',    val: '40%'                             },
                ].map((item) => (
                  <div className="col-6 col-sm-3" key={item.label}>
                    <div className="p-3 rounded-3 bg-light">
                      <i className={`bi ${item.icon} text-primary fs-4 d-block mb-1`}></i>
                      <div className="fw-bold fs-5">{item.val}</div>
                      <div className="text-muted small">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="card card-custom p-4 mb-4">
              <h5 className="fw-bold mb-3"><i className="bi bi-list-check me-2 text-warning"></i>Instructions</h5>
              <ul className="list-unstyled mb-0">
                {[
                  `You have ${quiz.duration} minutes to complete this quiz`,
                  'Each question has 4 options — choose the best answer',
                  'You can navigate between questions freely',
                  'The quiz auto-submits when time runs out',
                  'Results are shown immediately after submission',
                  'Unanswered questions are counted as wrong',
                ].map((inst, i) => (
                  <li key={i} className="d-flex align-items-start mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1 flex-shrink-0"></i>
                    <span className="text-muted">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="d-flex gap-3">
              {isAdmin ? (
                <button
                  className="btn btn-warning btn-lg px-5 flex-grow-1"
                  disabled
                >
                  <i className="bi bi-shield-lock me-2"></i>Admins Cannot Take Quizzes
                </button>
              ) : (
                <button
                  className="btn btn-primary-custom btn-lg px-5 flex-grow-1"
                  onClick={() => setShowModal(true)}
                >
                  <i className="bi bi-play-fill me-2"></i>Start Quiz
                </button>
              )}
              <Link to="/quizzes" className="btn btn-outline-secondary btn-lg px-4">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Start Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Ready to Start?</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-stopwatch text-primary" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 mb-1">Timer starts immediately when you click <strong>Start Quiz</strong>.</p>
                <p className="text-muted small">Make sure you're ready and have a stable internet connection.</p>
              </div>
              <div className="modal-footer border-0 justify-content-center gap-3">
                <button className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary-custom px-5" onClick={() => navigate(`/quiz/${id}/take`)}>
                  <i className="bi bi-play-fill me-2"></i>Start Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
