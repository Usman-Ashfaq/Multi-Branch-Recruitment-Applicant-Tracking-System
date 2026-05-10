import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profilePicture, setProfilePicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (profilePicture) formData.append('profilePicture', profilePicture);
      if (resume) formData.append('resume', resume);
      if (coverLetter) formData.append('coverLetter', coverLetter);

      const res = await axios.patch(`${API}/auth/profile`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      updateUser(res.data.user);
      setMessage('Profile updated successfully! ✅');
      setProfilePicture(null);
      setResume(null);
      setCoverLetter(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My <span className="gradient-text">Profile</span></h1>
        <p>Manage your personal information and documents</p>
      </div>

      <div className="profile-layout">
        {/* Profile Card */}
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
            <h3>{user?.name}</h3>
            <p className="text-muted">{user?.email}</p>
            <span className="role-badge">{user?.role}</span>
          </div>

          <div className="profile-documents">
            <h4>Documents</h4>
            {user?.resumeUrl ? (
              <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer" className="doc-link">
                📄 View Resume
              </a>
            ) : (
              <p className="text-muted">No resume uploaded</p>
            )}
            {user?.coverLetterUrl ? (
              <a href={user.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="doc-link">
                📝 View Cover Letter
              </a>
            ) : (
              <p className="text-muted">No cover letter uploaded</p>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="profile-form-card">
          <h2>Edit Profile</h2>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-phone">Phone Number</label>
              <input
                id="profile-phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 1234567"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-pic">Profile Picture</label>
              <input
                id="profile-pic"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="file-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-resume">Resume (PDF)</label>
              <input
                id="profile-resume"
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
                className="file-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-cover">Cover Letter (PDF/DOCX)</label>
              <input
                id="profile-cover"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCoverLetter(e.target.files[0])}
                className="file-input"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
