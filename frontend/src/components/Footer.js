// src/components/Footer.js
const Footer = () => (
  <footer className="footer-custom mt-5">
    <div className="container">
      <div className="row gy-3">
        <div className="col-md-4">
          <h5 className="text-white fw-bold">
            <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>QuizMaster
          </h5>
          <p className="small opacity-75">The ultimate online quiz platform for students. Practice, compete, and grow.</p>
        </div>
        <div className="col-md-4">
          <h6 className="text-white fw-semibold mb-2">Quick Links</h6>
          <ul className="list-unstyled small">
            <li><a href="/quizzes" className="text-white-50 text-decoration-none">Browse Quizzes</a></li>
            <li><a href="/leaderboard" className="text-white-50 text-decoration-none">Leaderboard</a></li>
            <li><a href="/register" className="text-white-50 text-decoration-none">Join Free</a></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h6 className="text-white fw-semibold mb-2">Topics</h6>
          <div className="d-flex flex-wrap gap-1">
            {['JavaScript', 'DBMS', 'Aptitude', 'Java', 'OS', 'CN'].map(t => (
              <span key={t} className="badge bg-secondary">{t}</span>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-secondary mt-4" />
      <p className="text-center small opacity-50 mb-0">
        © 2026 QuizMaster · Built with ❤️ using MERN Stack
      </p>
    </div>
  </footer>
);

export default Footer;
