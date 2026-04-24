// src/pages/admin/ViewUsers.js
// Admin: View all registered users

import { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminSidebar from '../../components/AdminSidebar';
import Spinner from '../../components/Spinner';

const ViewUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    adminService.getUsers()
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: '70px' }}>
      <AdminSidebar />
      <div className="admin-content">
        <h2 className="fw-bold mb-1">All Users</h2>
        <p className="text-muted mb-4">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>

        <div className="input-group mb-4" style={{ maxWidth: 400 }}>
          <span className="input-group-text"><i className="bi bi-search"></i></span>
          <input type="text" className="form-control" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)} id="user-search" />
        </div>

        {loading ? <Spinner /> : (
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ width: 36, height: 36, fontSize: '0.85rem' }}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="fw-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td><small>{u.email}</small></td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-warning text-dark' : 'bg-primary bg-opacity-10 text-primary'}`}>
                          {u.role === 'admin' ? '👑 Admin' : '🎓 User'}
                        </span>
                      </td>
                      <td><small className="text-muted">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</small></td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan="5" className="text-center text-muted py-4">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;
