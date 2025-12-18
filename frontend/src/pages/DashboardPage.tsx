import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth-service';

const DashboardPage: React.FC = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [recommendedTopics, setRecommendedTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authUser) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard data
        const data = await authService.getDashboardData();
        setDashboardData(data);

        // Extract stats and recent activity
        setStats(data.stats);
        setRecentActivity(data.recentGenerationRequests || []);

        // Generate some recommended topics based on user's expertise level and preferences
        const topicsByLevel: Record<string, string[]> = {
          'BEGINNER': [
            'Introduction to Physical AI',
            'Basic Robotics Concepts',
            'Getting Started with AI',
            'Simple Control Systems'
          ],
          'INTERMEDIATE': [
            'Advanced Control Systems',
            'Reinforcement Learning in Robotics',
            'Computer Vision for Robots',
            'Humanoid Robot Kinematics'
          ],
          'ADVANCED': [
            'Deep Learning for Physical AI',
            'Advanced Humanoid Control',
            'Multi-Agent Robotics',
            'Ethical AI in Robotics'
          ]
        };

        const userLevel = authUser.expertiseLevel || 'INTERMEDIATE';
        setRecommendedTopics(topicsByLevel[userLevel] || topicsByLevel['INTERMEDIATE']);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (authUser && !authLoading) {
      fetchDashboardData();
    }
  }, [authUser, authLoading]);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return '#f44336';
    if (progress < 70) return '#ff9800';
    return '#4CAF50';
  };

  if (loading || authLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="error-container">
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="error-container">
            <h2>Access Denied</h2>
            <p>Please log in to access your dashboard.</p>
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container">
          <div className="hero-content">
            <div className="user-info">
              <div className="user-avatar-placeholder">
                {authUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <h1>Welcome back, {authUser.name || authUser.email}!</h1>
                <p className="user-role">
                  {authUser.role} • {authUser.expertiseLevel} • Member since {new Date(authUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p>Here's your personalized overview of textbook projects and recommendations.</p>
          </div>
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="stat-icon-textbook">📚</i>
              </div>
              <h3>{stats?.totalGenerationRequests || 0}</h3>
              <p>Total Requests</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="stat-icon-check">✅</i>
              </div>
              <h3>{stats?.completedTextbooks || 0}</h3>
              <p>Completed</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="stat-icon-progress">🔄</i>
              </div>
              <h3>{stats?.inProgressTextbooks || 0}</h3>
              <p>In Progress</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="stat-icon-words">📝</i>
              </div>
              <h3>{stats?.totalTextbooksGenerated || 0}</h3>
              <p>Total Textbooks</p>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-grid">
            <div className="dashboard-section">
              <div className="section-header">
                <h2>Recent Activity</h2>
                <Link to="/textbook/generate" className="btn btn-primary">Create New</Link>
              </div>

              <div className="textbook-list">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="textbook-item">
                      <div className="textbook-info">
                        <h3>{activity.title || 'Untitled Textbook'}</h3>
                        <div className="textbook-meta">
                          <span className={`status status-${activity.status.toLowerCase()}`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                          <span className="subject-tag">{activity.parameters?.subject || 'Physical AI & Humanoid Robotics'}</span>
                        </div>
                        <p className="created-date">Created: {new Date(activity.createdAt).toLocaleDateString()}</p>
                        {activity.progress !== undefined && (
                          <p className="textbook-stats">
                            Progress: {activity.progress}%
                          </p>
                        )}
                      </div>
                      <div className="textbook-actions">
                        {activity.status === 'PROCESSING' && (
                          <div className="progress-container">
                            <div className="progress-bar">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${activity.progress}%`,
                                  backgroundColor: getProgressColor(activity.progress)
                                }}
                              ></div>
                            </div>
                            <span className="progress-text">{activity.progress}%</span>
                          </div>
                        )}
                        <div className="action-buttons">
                          <Link to={`/textbook/${activity.id}`} className="btn btn-secondary btn-small">View</Link>
                          {activity.status === 'COMPLETED' && (
                            <Link to={`/textbook/${activity.id}/edit`} className="btn btn-outline btn-small">Edit</Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No recent activity. Start by creating your first textbook!</p>
                    <Link to="/textbook/generate" className="btn btn-primary">Create Textbook</Link>
                  </div>
                )}
              </div>
            </div>

            <div className="dashboard-sidebar">
              <div className="dashboard-section">
                <h2>Quick Actions</h2>
                <div className="quick-actions">
                  <Link to="/textbook/generate" className="action-card">
                    <div className="action-icon">➕</div>
                    <div className="action-content">
                      <h3>Generate New Textbook</h3>
                      <p>Create a new AI-powered textbook from scratch</p>
                    </div>
                  </Link>
                  <Link to="/textbook/library" className="action-card">
                    <div className="action-icon">📚</div>
                    <div className="action-content">
                      <h3>View Library</h3>
                      <p>Access your collection of textbooks</p>
                    </div>
                  </Link>
                  <Link to="/textbook/history" className="action-card">
                    <div className="action-icon">⏱️</div>
                    <div className="action-content">
                      <h3>History</h3>
                      <p>Review your textbook generation history</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Recommended Topics</h2>
                <div className="recommended-topics">
                  {recommendedTopics.map((topic, index) => (
                    <div key={index} className="recommended-topic">
                      <span className="topic-text">{topic}</span>
                      <Link to={`/textbook/generate?topic=${encodeURIComponent(topic)}`} className="btn btn-sm">Try</Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-section">
                <h2>Your Profile</h2>
                <div className="profile-summary">
                  <p><strong>Expertise Level:</strong> {authUser.expertiseLevel}</p>
                  <p><strong>Role:</strong> {authUser.role}</p>
                  <div className="preferences-actions">
                    <Link to="/settings" className="btn btn-outline btn-small">Update Profile</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;