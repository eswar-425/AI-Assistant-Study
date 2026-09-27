import React, { useState } from 'react';
import { useStudy } from './hooks/useStudy';
import { Navbar } from './components/Navbar';
import { Loading } from './components/Loading';
import { ErrorMessage } from './components/ErrorMessage';
import { Home } from './pages/Home';
import { Study } from './pages/Study';
import {
  FileTextIcon,
  LayersIcon,
  TargetIcon
} from './components/Icons';

/**
 * Main Application Component
 */
export function App() {
  const { studyData, loading, error, fetchStudyMaterial, resetStudy } = useStudy();
  const [lastSubmittedTopic, setLastSubmittedTopic] = useState({ topic: '', notes: '' });

  const handleGenerate = (topic, notes) => {
    setLastSubmittedTopic({ topic, notes });
    fetchStudyMaterial(topic, notes);
  };

  const handleRetry = () => {
    if (lastSubmittedTopic.topic || lastSubmittedTopic.notes) {
      fetchStudyMaterial(lastSubmittedTopic.topic, lastSubmittedTopic.notes);
    } else {
      resetStudy();
    }
  };

  return (
    <div className="app-container">
      {/* Top Navigation with Theme Toggle */}
      <Navbar
        hasStudyData={Boolean(studyData)}
        onNewSession={resetStudy}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {loading && <Loading />}

        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
          />
        )}

        {!loading && !error && !studyData && (
          <Home
            onGenerate={handleGenerate}
            loading={loading}
          />
        )}

        {!loading && !error && studyData && (
          <Study
            studyData={studyData}
            onNewSession={resetStudy}
          />
        )}
      </div>

      {/* Innovative Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-main-tagline">
            <strong>Smart Learning Engineered:</strong> Transforming raw study notes into structured mastery through adaptive quizzes, flashcards, and mistake-driven retests.
          </p>
          <div className="footer-pillars">
            <span className="footer-chip">
              <FileTextIcon size={13} className="chip-icon" /> Structured Summaries
            </span>
            <span className="footer-chip">
              <LayersIcon size={13} className="chip-icon" /> Active Recall Cards
            </span>
            <span className="footer-chip">
              <TargetIcon size={13} className="chip-icon" /> Targeted Mistake Retests
            </span>
          </div>
          <p className="footer-subtext">
            Built for Students & Lifelong Learners — Focus on What Truly Matters
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
