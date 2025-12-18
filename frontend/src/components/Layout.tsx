import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Textbook Generator</Link>
        </div>
        <ul className="nav-links">
          <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li className={location.pathname === '/about' ? 'active' : ''}>
            <Link to="/about">About</Link>
          </li>
          <li className={location.pathname === '/contact' ? 'active' : ''}>
            <Link to="/contact">Contact</Link>
          </li>
          <li className={location.pathname === '/dashboard' ? 'active' : ''}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={location.pathname === '/textbook/generate' ? 'active' : ''}>
            <Link to="/textbook/generate">Generate</Link>
          </li>
          <li className={location.pathname.includes('/textbook/history') ? 'active' : ''}>
            <Link to="/textbook/history">History</Link>
          </li>
          <li className={location.pathname.includes('/textbook/library') ? 'active' : ''}>
            <Link to="/textbook/library">Library</Link>
          </li>
        </ul>
        <div className="nav-user">
          <UserProfile />
        </div>
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/textbook/generate">Generate Textbook</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><Link to="/textbook/library">Textbook Library</Link></li>
              <li><Link to="/textbook/history">History</Link></li>
              <li><a href="#api-docs">API Documentation</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@aitextbook-platform.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        <p className="footer-bottom">AI-Powered Textbook Generation Platform &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;