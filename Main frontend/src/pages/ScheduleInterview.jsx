import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ScheduleInterview = () => {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [formData, setFormData] = useState({ date: '', time: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, intRes] = await Promise.all([
        axios.get(`${API}/hr/applicants`),
        axios.get(`${API}/interviews`)
      ]);
      const shortlisted = appsRes.data.filter(a => a.status === 'Shortlisted');
      setApplications(shortlisted);
      setInterviews(intRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const openScheduleForm = (app) => {
    setSelectedApp(app);
    setFormData({ date: '', time: '', message: '' });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time) { setError('Date and time are required'); return; }
    try {
      setSubmitting(true);
      await axios.post(`${API}/interviews`, {
        applicationId: selectedApp._id,
        date: formData.date,
        time: formData.time,
        message: formData.message
      });
      setSuccess('Interview scheduled and invitation sent!');
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="page-container">
      <div className="page-header"><h1>Schedule <span className="gradient-text">Interviews</span></h1><p>Schedule interviews for shortlisted candidates</p></div>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <h2 className="section-subtitle">Shortlisted Candidates</h2>
      {applications.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">⭐</span><h3>No shortlisted candidates</h3><p>Shortlist candidates from the Manage Applicants page first.</p></div>
      ) : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Candidate</th><th>Email</th><th>Job</th><th>Action</th></tr></thead><tbody>
          {applications.map((app) => (
            <tr key={app._id}><td className="td-bold">{app.candidate?.name}</td><td>{app.candidate?.email}</td><td>{app.job?.title}</td><td>
              <button onClick={() => openScheduleForm(app)} className="btn btn-sm btn-primary">📅 Schedule</button>
            </td></tr>
          ))}
        </tbody></table></div>
      )}

      {showForm && selectedApp && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}><div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header"><h2>Schedule Interview</h2><button onClick={() => setShowForm(false)} className="modal-close">✕</button></div>
          <p style={{marginBottom:'15px',color:'#666'}}>Candidate: <strong>{selectedApp.candidate?.name}</strong> | Job: <strong>{selectedApp.job?.title}</strong></p>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label htmlFor="int-date">Date *</label><input id="int-date" type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required /></div>
              <div className="form-group"><label htmlFor="int-time">Time *</label><input id="int-time" type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required /></div>
            </div>
            <div className="form-group"><label htmlFor="int-msg">Message</label><textarea id="int-msg" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows="3" placeholder="Additional info for the candidate..." /></div>
            <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Scheduling...' : 'Schedule Interview'}</button><button type="button" onClick={() => setShowForm(false)} className="btn btn-outline">Cancel</button></div>
          </form>
        </div></div>
      )}

      <h2 className="section-subtitle" style={{marginTop:'40px'}}>Scheduled Interviews</h2>
      {interviews.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">📅</span><h3>No interviews scheduled</h3></div>
      ) : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Candidate</th><th>Job</th><th>Date</th><th>Time</th><th>Message</th></tr></thead><tbody>
          {interviews.map((int) => (
            <tr key={int._id}><td className="td-bold">{int.candidate?.name}</td><td>{int.job?.title}</td><td>{int.date}</td><td>{int.time}</td><td>{int.message || '—'}</td></tr>
          ))}
        </tbody></table></div>
      )}
    </div>
  );
};

export default ScheduleInterview;
