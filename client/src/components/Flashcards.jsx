import React, { useState } from 'react';
import {
  LayersIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshIcon,
  LightbulbIcon
} from './Icons';

/**
 * Flashcards Component
 * Allows students to review concepts with active recall flashcards.
 */
export const Flashcards = ({ flashcards = [], onCardViewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [viewedCards, setViewedCards] = useState(new Set([0]));

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="card text-center">
        <p>No flashcards available for this topic.</p>
      </div>
    );
  }

  const totalCards = flashcards.length;
  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setShowAnswer(false);
      
      const newViewed = new Set(viewedCards).add(nextIndex);
      setViewedCards(newViewed);
      if (onCardViewed) onCardViewed(newViewed.size, totalCards);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleToggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setViewedCards(new Set([0]));
    if (onCardViewed) onCardViewed(1, totalCards);
  };

  return (
    <div className="card flashcards-container">
      {/* Header with counter */}
      <div className="flashcard-header">
        <span className="badge badge-flashcard">
          <LayersIcon size={14} className="badge-icon" /> Flashcards
        </span>
        <span className="card-counter">
          Card {currentIndex + 1} of {totalCards}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-bg">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
        />
      </div>

      {/* Flashcard Box */}
      <div className="flashcard-box">
        {/* Question Side */}
        <div className="flashcard-section question-section">
          <span className="flashcard-label">QUESTION</span>
          <h3 className="flashcard-text">{currentCard.question}</h3>
        </div>

        {/* Answer Side (Conditional) */}
        {showAnswer ? (
          <div className="flashcard-section answer-section">
            <span className="flashcard-label answer-label">ANSWER</span>
            <p className="flashcard-text answer-text">{currentCard.answer}</p>
          </div>
        ) : (
          <div className="flashcard-section hint-section">
            <div className="hint-row">
              <LightbulbIcon size={16} className="hint-icon" />
              <p className="hint-text">Try to recall the answer in your mind before revealing it.</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flashcard-actions">
        <button
          type="button"
          className="btn btn-secondary btn-icon"
          onClick={handleToggleAnswer}
        >
          {showAnswer ? (
            <>
              <EyeOffIcon size={16} /> <span>Hide Answer</span>
            </>
          ) : (
            <>
              <EyeIcon size={16} /> <span>Show Answer</span>
            </>
          )}
        </button>

        <div className="nav-button-group">
          <button
            type="button"
            className="btn btn-outline btn-icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeftIcon size={16} /> <span>Previous</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-icon"
            onClick={handleNext}
            disabled={currentIndex === totalCards - 1}
          >
            <span>Next</span> <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>

      {/* Bottom helper */}
      <div className="flashcard-footer">
        <button type="button" className="btn-link btn-icon" onClick={handleReset}>
          <RefreshIcon size={14} /> <span>Restart Flashcards</span>
        </button>
      </div>
    </div>
  );
};
