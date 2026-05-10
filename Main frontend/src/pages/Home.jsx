import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="hero-content">
          <span className="hero-badge">🚀 #1 Recruitment Platform</span>
          <h1 className="hero-title">
            Find Your <span className="gradient-text">Dream Job</span> Today
          </h1>
          <p className="hero-subtitle">
            Discover thousands of opportunities across multiple branches. Connect with top employers 
            and take the next step in your career journey with our intelligent recruitment system.
          </p>
          <div className="hero-actions">
            <Link to="/jobs" className="btn btn-primary btn-lg">
              <span>Browse Jobs</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              Create Account
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Active Jobs</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Candidates</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Branches</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose <span className="gradient-text">ATSRecruit</span>?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Easy Application</h3>
            <p>Apply to multiple jobs with just a few clicks. Upload your resume once and apply everywhere.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Multi-Branch</h3>
            <p>Explore opportunities across Islamabad, Lahore, Karachi, and Remote positions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Real-time status updates on your applications. Know exactly where you stand.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h3>Email Notifications</h3>
            <p>Get instant email notifications for shortlisting, interviews, and status changes.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of candidates who found their dream job through ATSRecruit.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Get Started Free →</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
