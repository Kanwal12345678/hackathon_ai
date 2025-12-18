import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { TextbookGenerator } from './pages/textbook/generate';
import TextbookHistory from './pages/textbook/history';
import TextbookLibrary from './pages/textbook/library';
import './components/textbook-generator/TextbookGenerator.css';

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/textbook/generate" element={<TextbookGenerator />} />
          <Route path="/textbook/history" element={<TextbookHistory />} />
          <Route path="/textbook/library" element={<TextbookLibrary />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;