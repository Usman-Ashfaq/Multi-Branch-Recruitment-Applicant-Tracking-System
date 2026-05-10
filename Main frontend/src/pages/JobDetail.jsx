import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      setError('Failed to load job details.');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      setApplyError('Please upload your resume');
      return;
    }

    try {
      setApplying(true);
      setApplyError('');
      const formData = new FormData();
      formData.append('jobId', id);
      formData.append('resume', resume);
      if (coverLetter) {
        formData.append('coverLetter', coverLetter);
      }

      await axios.post(`${API}/applications`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setApplySuccess('Application submitted successfully! 🎉');
      setShowApplyForm(false);
      setResume(null);
      setCoverLetter(null);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="page-container"><div className="alert alert-error">{error}</div></div>;
  }

  if (!job) {
    return <div className="page-container"><div className="alert alert-error">Job not found</div></div>;
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate('/jobs')} className="btn btn-outline btn-sm back-btn">← Back to Jobs</button>

      <div className="job-detail-card">
        <div className="job-detail-header">
          <div>
            <span className="job-department-badge">{job.department}</span>
            <h1 className="job-detail-title">{job.title}</h1>
            <div className="job-meta">
              <span>📍 {job.branch?.name || 'N/A'}</span>
              {job.branch?.address && <span> — {job.branch.address}</span>}
              <span> | 🪑 {job.seats} seat{job.seats > 1 ? 's' : ''}</span>
              <span> | 📅 {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <span className={`status-badge status-${job.status}`}>
            {job.status === 'open' ? '🟢 Open' : '🔴 Closed'}
          </span>
        </div>

        <div className="job-detail-body">
          <div className="detail-section">
            <h3>📝 Description</h3>
            <p>{job.description}</p>
          </div>

          {job.requirements && (
            <div className="detail-section">
              <h3>✅ Requirements</h3>
              <p>{job.requirements}</p>
            </div>
          )}

          {job.postedBy && (
            <div className="detail-section">
              <h3>👤 Posted By</h3>
              <p>{job.postedBy.name} ({job.postedBy.email})</p>
            </div>
          )}
        </div>

        {/* Apply Section */}
        {applySuccess && <div className="alert alert-success">{applySuccess}</div>}

        {user && user.role === 'candidate' && job.status === 'open' && !applySuccess && (
          <div className="apply-section">
            {!showApplyForm ? (
              <button onClick={() => setShowApplyForm(true)} className="btn btn-primary btn-lg">
                Apply for this Job 🚀
              </button>
            ) : (
              <form onSubmit={handleApply} className="apply-form">
                <h3>Submit Your Application</h3>
                {applyError && <div className="alert alert-error">{applyError}</div>}
                <div className="form-group">
                  <label htmlFor="resume-upload">Resume (PDF) *</label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="file-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cover-letter-upload">Cover Letter (PDF/DOCX)</label>
                  <input
                    id="cover-letter-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCoverLetter(e.target.files[0])}
                    className="file-input"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={applying}>
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button type="button" onClick={() => setShowApplyForm(false)} className="btn btn-outline">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {!user && job.status === 'open' && (
          <div className="apply-section">
            <p className="login-prompt">
              <a href="/login" className="link-primary">Login</a> or <a href="/register" className="link-primary">Register</a> to apply for this job
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
