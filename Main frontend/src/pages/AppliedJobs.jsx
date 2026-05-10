import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const statusColors = {
  'Submitted': 'badge-gray',
  'Under Review': 'badge-blue',
  'Shortlisted': 'badge-yellow',
  'Interview Scheduled': 'badge-purple',
  'Rejected': 'badge-red',
  'Selected': 'badge-green'
};

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/applications/my`);
      setApplications(res.data);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My <span className="gradient-text">Applications</span></h1>
        <p>Track the status of all your job applications</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No applications yet</h3>
          <p>Start applying to jobs to see them here.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Branch</th>
                <th>Applied Date</th>
                <th>Status</th>
                <th>Resume</th>
                <th>Cover Letter</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td className="td-bold">{app.job?.title || 'N/A'}</td>
                  <td>{app.job?.branch?.name || 'N/A'}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${statusColors[app.status] || 'badge-gray'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="link-primary">
                        View 📄
                      </a>
                    ) : '—'}
                  </td>
                  <td>
                    {app.coverLetterUrl ? (
                      <a href={app.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="link-primary">
                        View 📝
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;
