import React from 'react';
import { ClockIcon, LightbulbIcon } from './Icons';

/**
 * Loading Component
 * Clean, static loading view with realistic vector icons (zero animations).
 */
export const Loading = () => {
  return (
    <div className="card loading-card">
      <div className="loading-content">
        <div className="loading-icon-box">
          <ClockIcon size={44} className="loading-svg" />
        </div>
        <h3 className="loading-title">Generating your study material...</h3>
        <p className="loading-subtitle">
          AI is analyzing your topic, structuring summaries, crafting active recall flashcards, and generating quiz questions.
        </p>
        <div className="loading-tip">
          <LightbulbIcon size={16} className="tip-icon" />
          <span><strong>Tip:</strong> Reviewing flashcards before taking the quiz improves test scores by up to 40%.</span>
        </div>
      </div>
    </div>
  );
};
