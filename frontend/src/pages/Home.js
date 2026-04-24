// src/pages/Home.js
// Landing page with hero section and feature highlights

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: 'bi-lightning-charge', color: 'text-warning', title: 'Instant Results', text: 'Get your score, percentage, and answer review immediately after submission.' },
  { icon: 'bi-stopwatch',        color: 'text-danger',  title: 'Timed Quizzes',  text: 'Real exam simulation with countdown timers and auto-submission.' },
  { icon: 'bi-trophy',           color: 'text-success', title: 'Leaderboard',    text: 'Compete with other students and see your rank in real-time.' },
  { icon: 'bi-collection',       color: 'text-primary', title: 'Topic Filters',  text: 'Browse quizzes by Java, DBMS, OS, CN, Aptitude, JavaScript & more.' },
  { icon: 'bi-shield-check',     color: 'text-info',    title: 'Secure Scoring', text: 'All scores are calculated server-side. No cheating possible.' },
  { icon: 'bi-phone',            color: 'text-secondary',title: 'Mobile Ready',  text: 'Fully responsive design. Take quizzes on any device.' },
];

const topics = ['JavaScript','Java','DBMS','Operating Systems','Computer Networks','Aptitude'];

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="fade-in-up">
                <span className="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">
                  🎓 #1 Quiz Platform for Students
                </span>
                <h1 className="hero-title mb-3">
                  Master Every Topic with <span style={{ color: '#f6d365' }}>QuizMaster</span>
                </h1>
                <p className="hero-subtitle mb-4 opacity-90">
                  Practice topic-wise MCQ tests, compete on leaderboards, and ace your placements and exams.
                </p>
                <div className="d-flex gap-3 flex-wrap">
                  {user ? (
                    <Link to="/quizzes" className="btn btn-light btn-lg rounded-pill px-4 fw-bold text-primary">
                      <i className="bi bi-collection me-2"></i>Browse Quizzes
                    </Link>
                  ) : (
                    <>
                      <Link to="/register" className="btn btn-light btn-lg rounded-pill px-4 fw-bold text-primary">
                        <i className="bi bi-person-plus me-2"></i>Get Started Free
                      </Link>
                      <Link to="/login" className="btn btn-outline-light btn-lg rounded-pill px-4">
                        <i className="bi bi-box-arrow-in-right me-2"></i>Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center d-none d-lg-block">
              <div className="float-anim" style={{ fontSize: '12rem', opacity: 0.15 }}>
                <i className="bi bi-lightning-charge-fill"></i>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="row mt-5 g-3">
            {[
              { num: '500+', label: 'Questions' },
              { num: '30+',  label: 'Quizzes' },
              { num: '6',    label: 'Topics' },
              { num: '100%', label: 'Free' },
            ].map((s) => (
              <div className="col-6 col-md-3" key={s.label}>
                <div className="text-center py-3 px-2 rounded-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="fw-800 fs-2 text-white">{s.num}</div>
                  <div className="text-white-50 small">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Topics ── */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-4">Browse by Topic</h2>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {topics.map((t) => (
              <Link
                key={t}
                to={`/quizzes?search=${t}`}
                className="btn btn-outline-primary rounded-pill px-4 py-2 fw-semibold"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-5 bg-white">
        <div className="container">
          <h2 className="text-center fw-bold mb-2">Why QuizMaster?</h2>
          <p className="text-center text-muted mb-5">Everything you need to prepare and excel</p>
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-md-4" key={f.title}>
                <div className="card-custom card p-4 h-100">
                  <i className={`bi ${f.icon} ${f.color} mb-3`} style={{ fontSize: '2.2rem' }}></i>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section className="py-5" style={{ background: 'var(--gradient-primary)' }}>
          <div className="container text-center py-3">
            <h2 className="text-white fw-bold mb-3">Ready to Test Your Knowledge?</h2>
            <p className="text-white-50 mb-4">Join thousands of students already using QuizMaster</p>
            <Link to="/register" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary">
              <i className="bi bi-rocket me-2"></i>Start Learning Now
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
