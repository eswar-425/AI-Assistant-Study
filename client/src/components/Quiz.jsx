import React, { useState } from 'react';
import { QuizQuestion } from './QuizQuestion';
import { QuizResult } from './QuizResult';
import { Retest } from './Retest';

/**
 * Quiz Master Component
 * Controls standard quiz navigation, answer scoring, mistake tracking, and retest mode.
 */
export const Quiz = ({ quizQuestions = [], onQuizFinished, onNewTopic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isRetestMode, setIsRetestMode] = useState(false);

  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="card text-center">
        <p>No quiz questions available for this topic.</p>
      </div>
    );
  }

  const totalQuestions = quizQuestions.length;
  const currentQuestion = quizQuestions[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Called when user submits an answer to a question
  const handleAnswerSubmitted = (questionObj, selectedOption, isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    } else {
      setWrongQuestions((prev) => [...prev, questionObj]);
    }
  };

  // Called when user clicks "Next Question" or "View Results"
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setIsQuizCompleted(true);
      if (onQuizFinished) {
        onQuizFinished(score, totalQuestions);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Restart standard quiz from beginning
  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setWrongQuestions([]);
    setIsQuizCompleted(false);
    setIsRetestMode(false);
  };

  // Enter Retest mode for wrong answers
  const handleStartRetest = () => {
    setIsRetestMode(true);
  };

  // Exit Retest mode back to results screen
  const handleExitRetest = () => {
    setIsRetestMode(false);
  };

  // Mode 1: Retest Mode
  if (isRetestMode) {
    return (
      <Retest
        wrongQuestions={wrongQuestions}
        onExitRetest={handleExitRetest}
        onRetestCompleted={(retestScore, total) => {
          console.log(`Retest completed: ${retestScore}/${total}`);
        }}
      />
    );
  }

  // Mode 2: Quiz Results Mode
  if (isQuizCompleted) {
    return (
      <QuizResult
        score={score}
        totalQuestions={totalQuestions}
        wrongQuestions={wrongQuestions}
        onStartRetest={handleStartRetest}
        onRestartQuiz={handleRestartQuiz}
        onNewTopic={onNewTopic}
      />
    );
  }

  // Mode 3: Active Quiz Mode
  return (
    <QuizQuestion
      questionData={currentQuestion}
      questionIndex={currentIndex}
      totalQuestions={totalQuestions}
      onAnswerSubmitted={handleAnswerSubmitted}
      onNextQuestion={handleNextQuestion}
      isLastQuestion={isLastQuestion}
    />
  );
};
