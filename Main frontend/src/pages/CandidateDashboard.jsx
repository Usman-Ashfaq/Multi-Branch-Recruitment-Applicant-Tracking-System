import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`${API}/applications/my`);
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter(a => a.status === 'Interview Scheduled').length;
  const selectedCount = applications.filter(a => a.status === 'Selected').length;

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome back, <span className="gradient-text">{user?.name}</span>! 👋</h1>
          <p>Here's a quick overview of your job applications</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-card-icon">📋</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{applications.length}</span>
                <span className="stat-card-label">Total Applications</span>
              </div>
            </div>
            <div className="stat-card stat-yellow">
              <div className="stat-card-icon">⭐</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{shortlistedCount}</span>
                <span className="stat-card-label">Shortlisted</span>
              </div>
            </div>
            <div className="stat-card stat-purple">
              <div className="stat-card-icon">📅</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{interviewCount}</span>
                <span className="stat-card-label">Interviews</span>
              </div>
            </div>
            <div className="stat-card stat-green">
              <div className="stat-card-icon">🎉</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{selectedCount}</span>
                <span className="stat-card-label">Selected</span>
              </div>
            </div>
          </div>

          <div className="quick-links">
            <h2>Quick Actions</h2>
            <div className="quick-links-grid">
              <Link to="/candidate/profile" className="quick-link-card">
                <span className="quick-link-icon">👤</span>
                <span>Edit Profile</span>
              </Link>
              <Link to="/candidate/applied" className="quick-link-card">
                <span className="quick-link-icon">📄</span>
                <span>View Applications</span>
              </Link>
              <Link to="/jobs" className="quick-link-card">
                <span className="quick-link-icon">🔍</span>
                <span>Browse Jobs</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateDashboard;
