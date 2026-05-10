import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HRDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    interviewsScheduled: 0,
    selected: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [jobsRes, appsRes, interviewsRes] = await Promise.all([
        axios.get(`${API}/jobs/all`),
        axios.get(`${API}/hr/applicants`),
        axios.get(`${API}/interviews`)
      ]);

      setStats({
        totalJobs: jobsRes.data.length,
        totalApplications: appsRes.data.length,
        shortlisted: appsRes.data.filter(a => a.status === 'Shortlisted').length,
        interviewsScheduled: interviewsRes.data.length,
        selected: appsRes.data.filter(a => a.status === 'Selected').length,
        rejected: appsRes.data.filter(a => a.status === 'Rejected').length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="dashboard-welcome">
        <div>
          <h1>HR <span className="gradient-text">Dashboard</span> 📊</h1>
          <p>Overview of recruitment activities</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid stats-grid-6">
            <div className="stat-card stat-blue">
              <div className="stat-card-icon">💼</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{stats.totalJobs}</span>
                <span className="stat-card-label">Total Jobs</span>
              </div>
            </div>
            <div className="stat-card stat-indigo">
              <div className="stat-card-icon">📋</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{stats.totalApplications}</span>
                <span className="stat-card-label">Applications</span>
              </div>
            </div>
            <div className="stat-card stat-yellow">
              <div className="stat-card-icon">⭐</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{stats.shortlisted}</span>
                <span className="stat-card-label">Shortlisted</span>
              </div>
            </div>
            <div className="stat-card stat-purple">
              <div className="stat-card-icon">📅</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{stats.interviewsScheduled}</span>
                <span className="stat-card-label">Interviews</span>
              </div>
            </div>
            <div className="stat-card stat-green">
              <div className="stat-card-icon">🎉</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{stats.selected}</span>
                <span className="stat-card-label">Selected</span>
              </div>
            </div>
            <div className="stat-card stat-red">
              <div className="stat-card-icon">❌</div>
              <div className="stat-card-info">
                <span className="stat-card-number">{stats.rejected}</span>
                <span className="stat-card-label">Rejected</span>
              </div>
            </div>
          </div>

          <div className="quick-links">
            <h2>Quick Actions</h2>
            <div className="quick-links-grid">
              <Link to="/hr/jobs" className="quick-link-card">
                <span className="quick-link-icon">💼</span>
                <span>Manage Jobs</span>
              </Link>
              <Link to="/hr/applicants" className="quick-link-card">
                <span className="quick-link-icon">👥</span>
                <span>View Applicants</span>
              </Link>
              <Link to="/hr/interviews" className="quick-link-card">
                <span className="quick-link-icon">📅</span>
                <span>Schedule Interviews</span>
              </Link>
              <Link to="/hr/branches" className="quick-link-card">
                <span className="quick-link-icon">🏢</span>
                <span>Manage Branches</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HRDashboard;
