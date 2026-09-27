import React from 'react';
import { StudyInput } from '../components/StudyInput';

/**
 * Home Page
 * Initial landing view where students submit their topic or study notes.
 */
export const Home = ({ onGenerate, loading }) => {
  return (
    <main className="page-container home-page">
      <div className="hero-banner">
        <h1 className="hero-title">Master Any Topic Faster with AI</h1>
        <p className="hero-subtitle">
          Turn any subject or study notes into structured summaries, active-recall flashcards, and MCQ quizzes in seconds.
        </p>
      </div>

      <StudyInput onSubmit={onGenerate} loading={loading} />
    </main>
  );
};
