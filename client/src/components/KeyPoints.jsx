import React from 'react';
import { TargetIcon } from './Icons';

/**
 * KeyPoints Component
 * Displays bullet points of important takeaways.
 */
export const KeyPoints = ({ keyPoints = [] }) => {
  return (
    <div className="card content-card">
      <div className="section-header">
        <span className="badge badge-points">
          <TargetIcon size={14} className="badge-icon" /> Key Points
        </span>
        <h2 className="section-title">Important Concepts to Remember</h2>
      </div>

      <ul className="key-points-list">
        {keyPoints.map((point, index) => (
          <li key={index} className="key-point-item">
            <span className="point-number">{index + 1}</span>
            <span className="point-text">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
