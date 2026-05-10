import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({ name: '', address: '', description: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try { const res = await axios.get(`${API}/branches`); setBranches(res.data); } catch (err) { setError('Failed to load branches'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) { setError('Branch name is required'); return; }
    try {
      setAdding(true); setError('');
      await axios.post(`${API}/branches`, formData);
      setSuccess('Branch added!');
      setFormData({ name: '', address: '', description: '' });
      fetchBranches();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add branch');
    } finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this branch?')) return;
    try { await axios.delete(`${API}/branches/${id}`); setSuccess('Branch deleted'); fetchBranches(); } catch (err) { setError('Failed to delete branch'); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1>Manage <span className="gradient-text">Branches</span></h1><p>Add and manage recruitment branches</p></div>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{marginBottom:'30px'}}>
        <h3>Add New Branch</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="branch-name">Branch Name *</label>
              <select id="branch-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="filter-select" required>
                <option value="">Select Branch</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="branch-addr">Address</label>
              <input id="branch-addr" type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Branch address" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="branch-desc">Description</label>
            <textarea id="branch-desc" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="2" placeholder="Brief description..." />
          </div>
          <button type="submit" className="btn btn-primary" disabled={adding}>{adding ? 'Adding...' : 'Add Branch'}</button>
        </form>
      </div>

      {loading ? (<div className="loading-container"><div className="spinner"></div></div>) : branches.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">🏢</span><h3>No branches yet</h3></div>
      ) : (
        <div className="branches-grid">
          {branches.map((branch) => (
            <div key={branch._id} className="branch-card">
              <div className="branch-card-header">
                <h3>🏢 {branch.name}</h3>
                <button onClick={() => handleDelete(branch._id)} className="btn btn-sm btn-danger">Delete</button>
              </div>
              {branch.address && <p className="text-muted">📍 {branch.address}</p>}
              {branch.description && <p>{branch.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBranches;
