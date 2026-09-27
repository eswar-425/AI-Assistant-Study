import React from 'react';
import { BookIcon, SunIcon, MoonIcon } from './Icons';
import { useTheme } from '../context/ThemeContext';

/**
 * Top navigation bar with theme toggle and vector branding
 */
export const Navbar = ({ onNewSession, hasStudyData }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="navbar-logo-box">
            <BookIcon size={22} className="navbar-logo-svg" />
          </div>
          <div>
            <h1 className="navbar-title">AI Study Assistant</h1>
            <p className="navbar-subtitle">Smart Quiz & Flashcards</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {hasStudyData && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onNewSession}
            >
              + New Topic
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
