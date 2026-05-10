import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchBranches();
    fetchJobs();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [branchFilter, departmentFilter]);

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/branches`);
      setBranches(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/jobs`, {
        params: {
          ...(branchFilter && { branch: branchFilter }),
          ...(departmentFilter && { department: departmentFilter })
        }
      });
      setJobs(res.data.data || res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Open <span className="gradient-text">Positions</span></h1>
        <p>Explore our current job openings and find the perfect role for you</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label htmlFor="branch-filter">Branch</label>
          <select
            id="branch-filter"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Branches</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="dept-filter">Department</label>
          <input
            id="dept-filter"
            type="text"
            placeholder="Search department..."
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Loading */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No jobs found</h3>
          <p>Try adjusting your filters or check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <span className="job-department-badge">{job.department}</span>
                <span className="job-seats">{job.seats} seat{job.seats > 1 ? 's' : ''}</span>
              </div>
              <h3 className="job-title">{job.title}</h3>
              <p className="job-description">{job.description.substring(0, 120)}...</p>
              <div className="job-card-footer">
                <span className="job-branch">
                  📍 {job.branch?.name || 'N/A'}
                </span>
                <Link to={`/jobs/${job._id}`} className="btn btn-sm btn-primary">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
