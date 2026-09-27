import React from 'react';
import { AlertTriangleIcon, RefreshIcon } from './Icons';

/**
 * ErrorMessage Component
 * Displays clear feedback on failures with realistic vector icons.
 */
export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="card error-card">
      <div className="error-icon-box">
        <AlertTriangleIcon size={44} className="error-svg" />
      </div>
      <h3 className="error-title">Unable to Generate Study Material</h3>
      <p className="error-description">
        {message || 'An unexpected error occurred while communicating with the server. Please check your connection and try again.'}
      </p>

      {onRetry && (
        <button
          type="button"
          className="btn btn-primary btn-icon"
          onClick={onRetry}
        >
          <RefreshIcon size={18} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};
