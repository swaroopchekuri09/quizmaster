// src/pages/admin/EditQuiz.js
// Admin: Edit an existing quiz's details

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { quizService, topicService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import AlertMessage from '../../components/AlertMessage';

const EditQuiz = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [topics, setTopics]     = useState([]);
  const [form, setForm]         = useState(null);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState({ type: '', text: '' });

  useEffect(() => {
    Promise.all([quizService.getById(id), topicService.getAll()]).then(([qRes, tRes]) => {
      const q = qRes.data;
      setForm({ title: q.title, description: q.description, topic: q.topic?._id || '', duration: q.duration, isPublished: q.isPublished });
      setTopics(tRes.data);
    }).catch(() => navigate('/admin/quizzes'));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await quizService.update(id, form);
      setMessage({ type: 'success', text: 'Quiz updated successfully!' });
      setTimeout(() => navigate('/admin/quizzes'), 1500);
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error updating quiz.' });
      setSaving(false);
    }
  };

  if (!form) return <div style={{ paddingTop: '80px' }}><div className="text-center py-5"><span className="spinner-border text-primary"></span></div></div>;

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Link to="/admin/quizzes" className="btn btn-outline-secondary btn-sm"><i className="bi bi-arrow-left"></i></Link>
          <h2 className="fw-bold mb-0">Edit Quiz</h2>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <AlertMessage type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Quiz Title *</label>
                  <input type="text" className="form-control" value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea className="form-control" rows="3" value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Topic *</label>
                    <select className="form-select" value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })} required>
                      <option value="">Select topic</option>
                      {topics.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Duration (minutes) *</label>
                    <input type="number" className="form-control" min="1" value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })} required />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="edit-published"
                      checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                    <label className="form-check-label fw-semibold" htmlFor="edit-published">Published</label>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary-custom px-5" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    Save Changes
                  </button>
                  <Link to="/admin/quizzes" className="btn btn-outline-secondary">Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQuiz;
