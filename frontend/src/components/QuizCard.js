// src/components/QuizCard.js
// Reusable quiz card used in quiz listing pages

import { Link } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
  const totalMarks = quiz.totalMarks || 0;

  return (
    <div className="card quiz-card h-100">
      <div className="card-header d-flex justify-content-between align-items-start">
        <div>
          <span className="badge bg-light text-primary mb-2">
            {quiz.topic?.name || 'General'}
          </span>
          <h5 className="card-title text-white mb-0 fw-bold">{quiz.title}</h5>
        </div>
        {quiz.isPublished ? (
          <span className="badge bg-success ms-2 flex-shrink-0">Live</span>
        ) : (
          <span className="badge bg-secondary ms-2 flex-shrink-0">Draft</span>
        )}
      </div>
      <div className="card-body">
        <p className="card-text text-muted small">{quiz.description || 'No description provided.'}</p>
        <div className="d-flex gap-3 text-muted small mt-3 flex-wrap">
          <span><i className="bi bi-clock me-1 text-primary"></i>{quiz.duration} min</span>
          <span><i className="bi bi-patch-question me-1 text-primary"></i>{totalMarks} marks</span>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pb-3">
        <Link
          to={`/quiz/${quiz._id}`}
          className="btn btn-primary-custom w-100"
        >
          <i className="bi bi-play-circle me-2"></i>View Quiz
        </Link>
      </div>
    </div>
  );
};

export default QuizCard;
