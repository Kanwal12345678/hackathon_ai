import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Educator',
    bio: 'Experienced educator specializing in AI and robotics.',
    avatar: 'https://via.placeholder.com/150x150/4CAF50/white?text=JD',
    notifications: {
      email: true,
      textbookUpdates: true,
      recommendations: true,
      marketing: false
    },
    preferences: {
      defaultSubject: 'Physical AI',
      defaultLevel: 'intermediate',
      defaultLanguage: 'en',
      exportFormat: 'pdf',
      aiModelPreference: 'balanced'
    }
  });

  const [formData, setFormData] = useState(user);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: target.checked
        }
      }));
    } else if (name.startsWith('preferences.')) {
      const preferenceKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [preferenceKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setUser(formData);
      setIsSaving(false);
      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="settings-page">
      <section className="settings-hero">
        <div className="container">
          <h1>Account Settings</h1>
          <p>Manage your profile, preferences, and account settings</p>
        </div>
      </section>

      <section className="settings-content">
        <div className="container">
          <div className="settings-grid">
            <div className="settings-sidebar">
              <nav className="settings-nav">
                <button
                  className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
                  onClick={() => setActiveTab('preferences')}
                >
                  Preferences
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Notifications
                </button>
                <button
                  className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
              </nav>
            </div>

            <div className="settings-main">
              {saveSuccess && (
                <div className="alert alert-success">
                  Settings saved successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="settings-form">
                {activeTab === 'profile' && (
                  <div className="settings-section">
                    <h2>Profile Information</h2>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="role">Role</label>
                      <input
                        type="text"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="bio">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>

                    <div className="form-group">
                      <label>Avatar</label>
                      <div className="avatar-upload">
                        <img src={formData.avatar} alt="Avatar" className="avatar-preview" />
                        <button type="button" className="btn btn-outline">Change Avatar</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="settings-section">
                    <h2>Preferences</h2>
                    <div className="form-group">
                      <label htmlFor="preferences.defaultSubject">Default Subject</label>
                      <select
                        id="preferences.defaultSubject"
                        name="preferences.defaultSubject"
                        value={formData.preferences.defaultSubject}
                        onChange={handleInputChange}
                      >
                        <option value="Physical AI">Physical AI</option>
                        <option value="Robotics">Robotics</option>
                        <option value="Machine Learning">Machine Learning</option>
                        <option value="Computer Vision">Computer Vision</option>
                        <option value="Natural Language Processing">Natural Language Processing</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="preferences.defaultLevel">Default Educational Level</label>
                      <select
                        id="preferences.defaultLevel"
                        name="preferences.defaultLevel"
                        value={formData.preferences.defaultLevel}
                        onChange={handleInputChange}
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="preferences.defaultLanguage">Default Language</label>
                      <select
                        id="preferences.defaultLanguage"
                        name="preferences.defaultLanguage"
                        value={formData.preferences.defaultLanguage}
                        onChange={handleInputChange}
                      >
                        <option value="en">English</option>
                        <option value="ur">Urdu</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="preferences.exportFormat">Default Export Format</label>
                      <select
                        id="preferences.exportFormat"
                        name="preferences.exportFormat"
                        value={formData.preferences.exportFormat}
                        onChange={handleInputChange}
                      >
                        <option value="pdf">PDF</option>
                        <option value="epub">EPUB</option>
                        <option value="html">HTML</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="preferences.aiModelPreference">AI Model Preference</label>
                      <select
                        id="preferences.aiModelPreference"
                        name="preferences.aiModelPreference"
                        value={formData.preferences.aiModelPreference}
                        onChange={handleInputChange}
                      >
                        <option value="balanced">Balanced (Quality & Speed)</option>
                        <option value="quality">Quality Focused</option>
                        <option value="speed">Speed Focused</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="settings-section">
                    <h2>Notification Settings</h2>
                    <div className="notification-settings">
                      <div className="notification-item">
                        <div className="notification-info">
                          <h3>Email Notifications</h3>
                          <p>Receive email updates about your textbooks</p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="email"
                            checked={formData.notifications.email}
                            onChange={handleInputChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <h3>Textbook Updates</h3>
                          <p>Get notified when your textbooks are completed or updated</p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="textbookUpdates"
                            checked={formData.notifications.textbookUpdates}
                            onChange={handleInputChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <h3>Recommendations</h3>
                          <p>Receive personalized textbook recommendations</p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="recommendations"
                            checked={formData.notifications.recommendations}
                            onChange={handleInputChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <h3>Marketing Communications</h3>
                          <p>Receive updates about new features and promotions</p>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="marketing"
                            checked={formData.notifications.marketing}
                            onChange={handleInputChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="settings-section">
                    <h2>Security Settings</h2>
                    <div className="security-settings">
                      <div className="security-item">
                        <div className="security-info">
                          <h3>Change Password</h3>
                          <p>Update your account password</p>
                        </div>
                        <button type="button" className="btn btn-outline">Change Password</button>
                      </div>

                      <div className="security-item">
                        <div className="security-info">
                          <h3>Two-Factor Authentication</h3>
                          <p>Add an extra layer of security to your account</p>
                        </div>
                        <label className="switch">
                          <input type="checkbox" disabled />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="security-item">
                        <div className="security-info">
                          <h3>Active Sessions</h3>
                          <p>Manage your active login sessions</p>
                        </div>
                        <button type="button" className="btn btn-outline">View Sessions</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <Link to="/dashboard" className="btn btn-outline">Cancel</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;