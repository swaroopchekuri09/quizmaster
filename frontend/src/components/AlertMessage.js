// src/components/AlertMessage.js
// Reusable Bootstrap alert for success/error messages

const AlertMessage = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      <i className={`bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
      {message}
      {onClose && (
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
      )}
    </div>
  );
};

export default AlertMessage;
