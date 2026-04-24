// src/pages/admin/ManageTopics.js
// CRUD for quiz topics/categories

import { useState, useEffect } from 'react';
import { topicService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import AlertMessage from '../../components/AlertMessage';

const ManageTopics = () => {
  const [topics, setTopics]     = useState([]);
  const [form, setForm]         = useState({ name: '', description: '' });
  const [editId, setEditId]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTopics = () => {
    topicService.getAll()
      .then((r) => setTopics(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTopics(); }, []);

  const resetForm = () => { setForm({ name: '', description: '' }); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editId) {
        await topicService.update(editId, form);
        setMessage({ type: 'success', text: 'Topic updated successfully!' });
      } else {
        await topicService.create(form);
        setMessage({ type: 'success', text: 'Topic created successfully!' });
      }
      resetForm();
      fetchTopics();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error saving topic.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (t) => { setForm({ name: t.name, description: t.description }); setEditId(t._id); };

  const handleDelete = async (id) => {
    try {
      await topicService.delete(id);
      setMessage({ type: 'success', text: 'Topic deleted.' });
      fetchTopics();
    } catch { setMessage({ type: 'danger', text: 'Error deleting topic.' }); }
    setDeleteConfirm(null);
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <h2 className="fw-bold mb-1">Manage Topics</h2>
        <p className="text-muted mb-4">Create and manage quiz categories</p>

        <AlertMessage type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold mb-3">{editId ? 'Edit Topic' : 'Add New Topic'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="topic-name">Topic Name *</label>
                  <input id="topic-name" type="text" className="form-control" placeholder="e.g., JavaScript"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="topic-desc">Description</label>
                  <textarea id="topic-desc" className="form-control" rows="3" placeholder="Brief description..."
                    value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary-custom flex-grow-1" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    {editId ? 'Update' : 'Create'}
                  </button>
                  {editId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>}
                </div>
              </form>
            </div>
          </div>

          {/* Topics Table */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="fw-bold mb-0">All Topics ({topics.length})</h6>
              </div>
              {loading ? (
                <div className="p-4 text-center text-muted">Loading...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr><th>#</th><th>Name</th><th>Description</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {topics.map((t, i) => (
                        <tr key={t._id}>
                          <td>{i + 1}</td>
                          <td><span className="fw-semibold">{t.name}</span></td>
                          <td><small className="text-muted">{t.description || '—'}</small></td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(t)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirm(t._id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                      {topics.length === 0 && (
                        <tr><td colSpan="4" className="text-center text-muted py-4">No topics yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 text-center p-4">
              <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
              <h5 className="fw-bold">Delete Topic?</h5>
              <p className="text-muted small">This action cannot be undone.</p>
              <div className="d-flex gap-2 justify-content-center mt-2">
                <button className="btn btn-outline-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTopics;
