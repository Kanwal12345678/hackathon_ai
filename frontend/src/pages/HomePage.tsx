import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>AI-Powered Textbook Generation Platform</h1>
          <p>
            Create comprehensive textbooks on Physical AI & Humanoid Robotics with our advanced AI system.
            Customize content, format, and pedagogical approach to suit your educational needs.
          </p>
          <div className="cta-buttons">
            <Link to="/textbook/generate" className="btn btn-primary">Generate Textbook</Link>
            <Link to="/textbook/library" className="btn btn-secondary">View Library</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Powerful Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>AI-Powered Generation</h3>
              <p>Advanced AI creates comprehensive textbooks based on your specifications</p>
            </div>
            <div className="feature-card">
              <h3>Customizable Content</h3>
              <p>Tailor textbooks to specific educational levels and learning objectives</p>
            </div>
            <div className="feature-card">
              <h3>Multi-Format Export</h3>
              <p>Export textbooks in PDF, ePub, and HTML formats</p>
            </div>
            <div className="feature-card">
              <h3>Content Validation</h3>
              <p>Factual accuracy and ethical compliance checking</p>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Specify Requirements</h3>
              <p>Define your textbook's subject, level, and learning objectives</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Generation</h3>
              <p>Our AI creates comprehensive content based on your specifications</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Review & Edit</h3>
              <p>Review the generated content and make any necessary adjustments</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Export & Share</h3>
              <p>Export in your preferred format and share with students</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;