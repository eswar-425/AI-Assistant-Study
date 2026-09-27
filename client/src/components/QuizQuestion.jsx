import React, { useState } from 'react';
import {
  HelpCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon
} from './Icons';

/**
 * QuizQuestion Component
 * Renders an individual multiple choice question, handles option selection,
 * evaluation, and displays feedback with explanation.
 */
export const QuizQuestion = ({
  questionData,
  questionIndex,
  totalQuestions,
  onAnswerSubmitted,
  onNextQuestion,
  isLastQuestion
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { question, options, correctAnswer, explanation } = questionData;

  // Helper to normalize strings for comparison (removes leading 'A)', 'A.', etc.)
  const normalize = (text) => (text || '').replace(/^[A-D][).\s-]+/i, '').trim().toLowerCase();

  const handleOptionSelect = (option) => {
    if (!isSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption) return;

    const isCorrect = normalize(selectedOption) === normalize(correctAnswer);
    setIsSubmitted(true);
    onAnswerSubmitted(questionData, selectedOption, isCorrect);
  };

  const handleNext = () => {
    setSelectedOption('');
    setIsSubmitted(false);
    onNextQuestion();
  };

  const isSelectedCorrect = normalize(selectedOption) === normalize(correctAnswer);

  return (
    <div className="card quiz-card">
      {/* Quiz Progress Header */}
      <div className="quiz-header">
        <span className="badge badge-quiz">
          <HelpCircleIcon size={14} className="badge-icon" /> Practice Quiz
        </span>
        <span className="quiz-progress-text">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Text */}
      <h3 className="quiz-question-title">{question}</h3>

      {/* Options List */}
      <form onSubmit={handleSubmit} className="quiz-options-list">
        {options.map((option, idx) => {
          const optionLetter = String.fromCharCode(65 + idx); // 'A', 'B', 'C', 'D'
          const cleanOptionText = option.replace(/^[A-D][).\s-]+/i, '').trim();
          const isSelected = selectedOption === option;
          const isCorrect = normalize(option) === normalize(correctAnswer);

          // Determine option styling class
          let optionClass = 'quiz-option';
          if (isSubmitted) {
            if (isCorrect) {
              optionClass += ' option-correct';
            } else if (isSelected && !isCorrect) {
              optionClass += ' option-incorrect';
            } else {
              optionClass += ' option-disabled';
            }
          } else if (isSelected) {
            optionClass += ' option-selected';
          }

          return (
            <label
              key={idx}
              className={optionClass}
              onClick={() => handleOptionSelect(option)}
            >
              <input
                type="radio"
                name={`quiz-question-${questionIndex}`}
                value={option}
                checked={isSelected}
                onChange={() => handleOptionSelect(option)}
                disabled={isSubmitted}
                className="quiz-radio"
              />
              <span className="option-prefix">{optionLetter}.</span>
              <span className="option-text">{cleanOptionText}</span>
              {isSubmitted && isCorrect && (
                <span className="status-tag correct-tag">
                  <CheckCircleIcon size={14} /> Correct
                </span>
              )}
              {isSubmitted && isSelected && !isCorrect && (
                <span className="status-tag incorrect-tag">
                  <XCircleIcon size={14} /> Incorrect
                </span>
              )}
            </label>
          );
        })}

        {/* Action Button: Submit or Next */}
        <div className="quiz-actions">
          {!isSubmitted ? (
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={!selectedOption}
            >
              Submit Answer
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-block btn-icon"
              onClick={handleNext}
            >
              <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
              <ArrowRightIcon size={16} />
            </button>
          )}
        </div>
      </form>

      {/* Explanation Box (Revealed after submission) */}
      {isSubmitted && (
        <div className={`explanation-box ${isSelectedCorrect ? 'explanation-correct' : 'explanation-incorrect'}`}>
          <div className="explanation-header">
            {isSelectedCorrect ? (
              <span className="feedback-badge badge-success">
                <CheckCircleIcon size={14} /> Correct Answer!
              </span>
            ) : (
              <span className="feedback-badge badge-danger">
                <XCircleIcon size={14} /> Incorrect
              </span>
            )}
          </div>
          <p className="explanation-text">
            <strong>Explanation: </strong>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
