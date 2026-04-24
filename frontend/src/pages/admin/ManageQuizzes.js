// src/pages/admin/ManageQuizzes.js
// Admin: View, publish/unpublish, delete quizzes

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizService, topicService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import AlertMessage from '../../components/AlertMessage';

const ManageQuizzes = () => {
  const [quizzes, setQuizzes]   = useState([]);
  const [topics, setTopics]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [message, setMessage]   = useState({ type: '', text: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [topicFilter, setTopicFilter] = useState('');

  const fetchAll = async () => {
    const [qRes, tRes] = await Promise.all([quizService.getAll(), topicService.getAll()]);
    setQuizzes(qRes.data);
    setTopics(tRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    try {
      await quizService.delete(id);
      setMessage({ type: 'success', text: 'Quiz deleted successfully.' });
      fetchAll();
    } catch { setMessage({ type: 'danger', text: 'Error deleting quiz.' }); }
    setDeleteId(null);
  };

  const handleToggle = async (id) => {
    try {
      const r = await quizService.togglePublish(id);
      setMessage({ type: 'success', text: r.data.message });
      fetchAll();
    } catch { setMessage({ type: 'danger', text: 'Error toggling publish.' }); }
  };

  const filtered = topicFilter ? quizzes.filter((q) => q.topic?._id === topicFilter) : quizzes;

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-0">Manage Quizzes</h2>
            <p className="text-muted mb-0">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} total</p>
          </div>
          <Link to="/admin/quizzes/create" className="btn btn-primary-custom">
            <i className="bi bi-plus-circle me-2"></i>Create Quiz
          </Link>
        </div>

        <AlertMessage type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

        {/* Topic Filter */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <button className={`btn btn-sm rounded-pill ${!topicFilter ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTopicFilter('')}>All</button>
          {topics.map((t) => (
            <button key={t._id} className={`btn btn-sm rounded-pill ${topicFilter === t._id ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setTopicFilter(t._id)}>{t.name}</button>
          ))}
        </div>

        {loading ? <div className="text-center py-4"><span className="spinner-border text-primary"></span></div> : (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Title</th><th>Topic</th><th>Duration</th><th>Questions</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q, i) => (
                    <tr key={q._id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="fw-semibold">{q.title}</div>
                        <small className="text-muted">{q.totalMarks} marks</small>
                      </td>
                      <td><span className="badge bg-primary bg-opacity-10 text-primary">{q.topic?.name || '—'}</span></td>
                      <td>{q.duration} min</td>
                      <td>—</td>
                      <td>
                        <span className={`badge ${q.isPublished ? 'bg-success' : 'bg-secondary'}`}>
                          {q.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-1 flex-wrap">
                          <Link to={`/admin/quizzes/${q._id}/questions`} className="btn btn-sm btn-outline-info" title="Manage Questions">
                            <i className="bi bi-question-circle"></i>
                          </Link>
                          <Link to={`/admin/quizzes/${q._id}/edit`} className="btn btn-sm btn-outline-primary" title="Edit Quiz">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button className={`btn btn-sm ${q.isPublished ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={() => handleToggle(q._id)} title={q.isPublished ? 'Unpublish' : 'Publish'}>
                            <i className={`bi ${q.isPublished ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(q._id)} title="Delete">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="7" className="text-center py-4 text-muted">No quizzes found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 text-center p-4">
              <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
              <h5 className="fw-bold">Delete Quiz?</h5>
              <p className="text-muted small">All questions will also be deleted.</p>
              <div className="d-flex gap-2 justify-content-center mt-2">
                <button className="btn btn-outline-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;
