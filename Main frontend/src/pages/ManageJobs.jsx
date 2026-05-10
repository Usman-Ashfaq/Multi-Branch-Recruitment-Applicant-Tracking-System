import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    branch: '',
    requirements: '',
    seats: 1,
    status: 'open'
  });

  useEffect(() => {
    fetchJobs();
    fetchBranches();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/jobs/all`);
      setJobs(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/branches`);
      setBranches(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditingJob(null);
    setFormData({ title: '', description: '', department: '', branch: '', requirements: '', seats: 1, status: 'open' });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      department: job.department,
      branch: job.branch?._id || '',
      requirements: job.requirements || '',
      seats: job.seats,
      status: job.status
    });
    setShowModal(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.description || !formData.department || !formData.branch) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingJob) {
        await axios.put(`${API}/jobs/${editingJob._id}`, formData);
        setSuccess('Job updated successfully!');
      } else {
        await axios.post(`${API}/jobs`, formData);
        setSuccess('Job created successfully!');
      }
      fetchJobs();
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await axios.delete(`${API}/jobs/${jobId}`);
      setSuccess('Job deleted successfully');
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1>Manage <span className="gradient-text">Jobs</span></h1>
          <p>Create, edit, and manage job postings</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">+ Add New Job</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">💼</span>
          <h3>No jobs created yet</h3>
          <p>Click "Add New Job" to create your first job posting.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Branch</th>
                <th>Seats</th>
                <th>Status</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="td-bold">{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.branch?.name || 'N/A'}</td>
                  <td>{job.seats}</td>
                  <td>
                    <span className={`status-badge ${job.status === 'open' ? 'badge-green' : 'badge-red'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-btns">
                      <button onClick={() => openEditModal(job)} className="btn btn-sm btn-outline">Edit</button>
                      <button onClick={() => handleDelete(job._id)} className="btn btn-sm btn-danger">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingJob ? 'Edit Job' : 'Create New Job'}</h2>
              <button onClick={() => setShowModal(false)} className="modal-close">✕</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="job-title">Job Title *</label>
                <input id="job-title" type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Software Engineer" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="job-dept">Department *</label>
                  <input id="job-dept" type="text" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Engineering" required />
                </div>
                <div className="form-group">
                  <label htmlFor="job-branch">Branch *</label>
                  <select id="job-branch" name="branch" value={formData.branch} onChange={handleChange} className="filter-select" required>
                    <option value="">Select Branch</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="job-desc">Description *</label>
                <textarea id="job-desc" name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the role..." required />
              </div>
              <div className="form-group">
                <label htmlFor="job-reqs">Requirements</label>
                <textarea id="job-reqs" name="requirements" value={formData.requirements} onChange={handleChange} rows="3" placeholder="Required skills and qualifications..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="job-seats">Seats *</label>
                  <input id="job-seats" type="number" name="seats" min="1" value={formData.seats} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="job-status">Status</label>
                  <select id="job-status" name="status" value={formData.status} onChange={handleChange} className="filter-select">
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{editingJob ? 'Update Job' : 'Create Job'}</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
