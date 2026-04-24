// src/pages/admin/CreateQuiz.js
// Admin: Create a new quiz

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quizService, topicService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import AlertMessage from '../../components/AlertMessage';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [topics, setTopics]   = useState([]);
  const [form, setForm]       = useState({ title: '', description: '', topic: '', duration: 15, isPublished: false });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  useEffect(() => {
    topicService.getAll().then((r) => setTopics(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.topic || !form.duration) return setError('Please fill in all required fields.');
    setSaving(true);
    try {
      const res = await quizService.create(form);
      navigate(`/admin/quizzes/${res.data._id}/questions`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating quiz.');
      setSaving(false);
    }
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Link to="/admin/quizzes" className="btn btn-outline-secondary btn-sm"><i className="bi bi-arrow-left"></i></Link>
          <div>
            <h2 className="fw-bold mb-0">Create New Quiz</h2>
            <p className="text-muted mb-0">After creating, you can add questions</p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <AlertMessage message={error} onClose={() => setError('')} />
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="quiz-title">Quiz Title *</label>
                  <input id="quiz-title" type="text" className="form-control" placeholder="e.g., JavaScript Basics"
                    value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="quiz-desc">Description</label>
                  <textarea id="quiz-desc" className="form-control" rows="3" placeholder="What will students learn/test?"
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="quiz-topic">Topic *</label>
                    <select id="quiz-topic" className="form-select" value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })} required>
                      <option value="">Select a topic</option>
                      {topics.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold" htmlFor="quiz-duration">Duration (minutes) *</label>
                    <input id="quiz-duration" type="number" className="form-control" min="1" max="180"
                      value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })} required />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="quiz-published"
                      checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
                    <label className="form-check-label fw-semibold" htmlFor="quiz-published">
                      Publish immediately
                    </label>
                    <div className="text-muted small">Published quizzes are visible to all users</div>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <button type="submit" className="btn btn-primary-custom px-4" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-arrow-right me-2"></i>}
                    Create & Add Questions
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

export default CreateQuiz;
