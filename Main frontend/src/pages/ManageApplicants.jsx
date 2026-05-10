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

const statuses = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'];

const ManageApplicants = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewAll, setViewAll] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({ candidateId: '', candidateName: '', subject: '', message: '' });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try { const res = await axios.get(`${API}/jobs/all`); setJobs(res.data); } catch (err) { console.error(err); }
  };

  const fetchApplicationsByJob = async (jobId) => {
    try { setLoading(true); setViewAll(false); const res = await axios.get(`${API}/applications/job/${jobId}`); setApplications(res.data); setError(''); } catch (err) { setError('Failed to load applications'); } finally { setLoading(false); }
  };

  const fetchAllApplications = async () => {
    try { setLoading(true); setViewAll(true); setSelectedJob(''); const res = await axios.get(`${API}/hr/applicants`); setAllApplications(res.data); setError(''); } catch (err) { setError('Failed to load all applications'); } finally { setLoading(false); }
  };

  const handleJobChange = (e) => { const jobId = e.target.value; setSelectedJob(jobId); if (jobId) fetchApplicationsByJob(jobId); else setApplications([]); };

  const handleStatusChange = async (appId, newStatus) => {
    try { setSuccess(''); await axios.patch(`${API}/applications/${appId}/status`, { status: newStatus }); setSuccess(`Status updated to "${newStatus}"`); if (viewAll) fetchAllApplications(); else if (selectedJob) fetchApplicationsByJob(selectedJob); } catch (err) { setError(err.response?.data?.message || 'Failed to update status'); }
  };

  const openEmailModal = (cId, cName) => { setEmailData({ candidateId: cId, candidateName: cName, subject: '', message: '' }); setShowEmailModal(true); };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try { setSendingEmail(true); await axios.post(`${API}/hr/message`, { candidateId: emailData.candidateId, subject: emailData.subject, message: emailData.message }); setSuccess(`Email sent to ${emailData.candidateName}`); setShowEmailModal(false); } catch (err) { setError(err.response?.data?.message || 'Failed to send email'); } finally { setSendingEmail(false); }
  };

  const displayApps = viewAll ? allApplications : applications;

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div><h1>Manage <span className="gradient-text">Applicants</span></h1><p>Review applications and communicate with candidates</p></div>
        <button onClick={fetchAllApplications} className="btn btn-primary">View All Applicants</button>
      </div>
      <div className="filters-bar">
        <div className="filter-group" style={{ flex: 1 }}>
          <label htmlFor="job-select">Select a Job</label>
          <select id="job-select" value={selectedJob} onChange={handleJobChange} className="filter-select">
            <option value="">-- Select a Job --</option>
            {jobs.map((job) => (<option key={job._id} value={job._id}>{job.title} ({job.branch?.name})</option>))}
          </select>
        </div>
      </div>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {loading ? (<div className="loading-container"><div className="spinner"></div><p>Loading...</p></div>
      ) : displayApps.length === 0 ? (<div className="empty-state"><span className="empty-icon">👥</span><h3>{viewAll ? 'No applications' : 'Select a job'}</h3></div>
      ) : (
        <div className="table-container"><table className="data-table"><thead><tr><th>Candidate</th><th>Email</th>{viewAll && <th>Job</th>}<th>Status</th><th>Resume</th><th>Cover Letter</th><th>Applied</th><th>Actions</th></tr></thead><tbody>
          {displayApps.map((app) => (<tr key={app._id}><td className="td-bold">{app.candidate?.name}</td><td>{app.candidate?.email}</td>{viewAll && <td>{app.job?.title}</td>}<td>
            <select value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)} className={`status-select ${statusColors[app.status]}`}>{statuses.map((s) => (<option key={s} value={s}>{s}</option>))}</select>
          </td><td>{app.resumeUrl ? <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="link-primary">View 📄</a> : '—'}</td><td>{app.coverLetterUrl ? <a href={app.coverLetterUrl} target="_blank" rel="noopener noreferrer" className="link-primary">View 📝</a> : '—'}</td><td>{new Date(app.appliedAt).toLocaleDateString()}</td><td><button onClick={() => openEmailModal(app.candidate?._id, app.candidate?.name)} className="btn btn-sm btn-outline">✉️ Email</button></td></tr>))}
        </tbody></table></div>
      )}
      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}><div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header"><h2>Email {emailData.candidateName}</h2><button onClick={() => setShowEmailModal(false)} className="modal-close">✕</button></div>
          <form onSubmit={handleSendEmail}>
            <div className="form-group"><label htmlFor="email-subject">Subject *</label><input id="email-subject" type="text" value={emailData.subject} onChange={(e) => setEmailData({...emailData, subject: e.target.value})} required /></div>
            <div className="form-group"><label htmlFor="email-message">Message *</label><textarea id="email-message" value={emailData.message} onChange={(e) => setEmailData({...emailData, message: e.target.value})} rows="5" required /></div>
            <div className="form-actions"><button type="submit" className="btn btn-primary" disabled={sendingEmail}>{sendingEmail ? 'Sending...' : 'Send Email'}</button><button type="button" onClick={() => setShowEmailModal(false)} className="btn btn-outline">Cancel</button></div>
          </form>
        </div></div>
      )}
    </div>
  );
};

export default ManageApplicants;
