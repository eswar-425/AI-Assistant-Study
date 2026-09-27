import React from 'react';
import { FileTextIcon } from './Icons';

/**
 * Summary Component
 * Displays the topic title and AI-generated concise summary.
 */
export const Summary = ({ title, summary }) => {
  return (
    <div className="card content-card">
      <div className="section-header">
        <span className="badge badge-topic">
          <FileTextIcon size={14} className="badge-icon" /> Topic Summary
        </span>
        <h2 className="section-title">{title}</h2>
      </div>

      <div className="summary-body">
        {summary.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="summary-paragraph">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
};
