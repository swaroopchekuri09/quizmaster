// src/pages/admin/ManageQuestions.js
// Admin: Add, edit, delete questions for a specific quiz

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionService, quizService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import AlertMessage from '../../components/AlertMessage';

const EMPTY_FORM = { questionText: '', options: ['', '', '', ''], correctAnswer: '', marks: 1 };

const ManageQuestions = () => {
  const { id }  = useParams(); // quizId
  const [quiz, setQuiz]         = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [message, setMessage]   = useState({ type: '', text: '' });
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    const [qRes, queRes] = await Promise.all([quizService.getById(id), questionService.getByQuiz(id)]);
    setQuiz(qRes.data);
    setQuestions(queRes.data);
  };

  useEffect(() => { fetchData(); }, [id]);

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); };

  const setOption = (idx, val) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm({ ...form, options: opts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.questionText || form.options.some((o) => !o.trim()) || !form.correctAnswer) {
      return setMessage({ type: 'danger', text: 'Please fill in question, all 4 options, and select the correct answer.' });
    }
    if (!form.options.includes(form.correctAnswer)) {
      return setMessage({ type: 'danger', text: 'Correct answer must match one of the options.' });
    }
    setSaving(true);
    try {
      if (editId) {
        await questionService.update(editId, form);
        setMessage({ type: 'success', text: 'Question updated!' });
      } else {
        await questionService.create({ ...form, quizId: id });
        setMessage({ type: 'success', text: 'Question added!' });
      }
      resetForm();
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Error saving question.' });
    } finally { setSaving(false); }
  };

  const handleEdit = (q) => {
    setForm({ questionText: q.questionText, options: q.options, correctAnswer: q.correctAnswer, marks: q.marks });
    setEditId(q._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (qid) => {
    try {
      await questionService.delete(qid);
      setMessage({ type: 'success', text: 'Question deleted.' });
      fetchData();
    } catch { setMessage({ type: 'danger', text: 'Error deleting.' }); }
    setDeleteId(null);
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Link to="/admin/quizzes" className="btn btn-outline-secondary btn-sm"><i className="bi bi-arrow-left"></i></Link>
          <div>
            <h2 className="fw-bold mb-0">Manage Questions</h2>
            <p className="text-muted mb-0">{quiz?.title} — {questions.length} question{questions.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <AlertMessage type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />

        <div className="row g-4 mt-1">
          {/* Add/Edit Form */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 position-sticky" style={{ top: '80px' }}>
              <h5 className="fw-bold mb-3">{editId ? '✏️ Edit Question' : '➕ Add Question'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" htmlFor="q-text">Question *</label>
                  <textarea id="q-text" className="form-control" rows="3" placeholder="Enter the question..."
                    value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} required></textarea>
                </div>
                {['A', 'B', 'C', 'D'].map((label, i) => (
                  <div className="mb-2" key={i}>
                    <label className="form-label fw-semibold small">Option {label} *</label>
                    <input type="text" className="form-control" placeholder={`Option ${label}`}
                      value={form.options[i]} onChange={(e) => setOption(i, e.target.value)} required />
                  </div>
                ))}
                <div className="mb-3 mt-3">
                  <label className="form-label fw-semibold">Correct Answer *</label>
                  <select className="form-select" value={form.correctAnswer}
                    onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} required>
                    <option value="">Select correct option</option>
                    {form.options.filter((o) => o.trim()).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Marks *</label>
                  <input type="number" className="form-control" min="1" max="10"
                    value={form.marks} onChange={(e) => setForm({ ...form, marks: parseInt(e.target.value) })} />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary-custom flex-grow-1" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    {editId ? 'Update' : 'Add Question'}
                  </button>
                  {editId && <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>}
                </div>
              </form>
            </div>
          </div>

          {/* Questions List */}
          <div className="col-lg-7">
            {questions.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-question-circle fs-1 mb-3 d-block"></i>
                <p>No questions added yet. Add your first question!</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {questions.map((q, i) => (
                  <div key={q._id} className="card border-0 shadow-sm rounded-4 p-4">
                    <div className="d-flex justify-content-between align-items-start">
                      <span className="badge bg-primary mb-2">Q{i + 1} · {q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(q)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(q._id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="fw-semibold mb-3">{q.questionText}</p>
                    <div className="row g-2">
                      {q.options.map((opt, oi) => (
                        <div className="col-6" key={oi}>
                          <div className={`p-2 rounded-3 small border ${opt === q.correctAnswer ? 'bg-success bg-opacity-10 border-success text-success fw-bold' : 'bg-light border-light'}`}>
                            {['A','B','C','D'][oi]}. {opt}
                            {opt === q.correctAnswer && ' ✓'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0 rounded-4 text-center p-4">
              <i className="bi bi-exclamation-triangle-fill text-warning fs-1 mb-3"></i>
              <h5 className="fw-bold">Delete Question?</h5>
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

export default ManageQuestions;
