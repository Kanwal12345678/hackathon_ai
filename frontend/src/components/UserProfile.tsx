import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (loading) {
    return (
      <div className="user-profile">
        <div className="user-profile-btn">
          <div className="user-avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
            ...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-profile">
        <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none', padding: '0.5rem 1rem' }}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <button className="user-profile-btn" onClick={toggleMenu}>
        <div className="user-avatar-placeholder" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
          {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="user-name">{user.name || user.email}</span>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div className="user-info">
            <div className="user-avatar-large" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <h3>{user.name || user.email}</h3>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <Link to="/dashboard" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <span className="item-icon">📊</span>
            Dashboard
          </Link>

          <Link to="/settings" className="dropdown-item" onClick={() => setIsOpen(false)}>
            <span className="item-icon">⚙️</span>
            Settings
          </Link>

          <button onClick={handleLogout} className="dropdown-item logout-btn">
            <span className="item-icon">🚪</span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;