// src/components/Spinner.js
// Reusable loading spinner

const Spinner = ({ text = 'Loading...' }) => (
  <div className="loading-container">
    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="text-muted fw-semibold">{text}</p>
  </div>
);

export default Spinner;
