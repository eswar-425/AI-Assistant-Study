import React, { useState } from 'react';
import { Summary } from '../components/Summary';
import { KeyPoints } from '../components/KeyPoints';
import { Flashcards } from '../components/Flashcards';
import { Quiz } from '../components/Quiz';
import { ProgressTracker } from '../components/ProgressTracker';
import {
  FileTextIcon,
  LayersIcon,
  HelpCircleIcon,
  BarChartIcon,
  BookIcon
} from '../components/Icons';

/**
 * Study Page
 * Preserves component state across tab switches so the student never loses their quiz progress or flashcard position.
 */
export const Study = ({ studyData, onNewSession }) => {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'flashcards' | 'quiz' | 'progress'

  // Session progress state
  const [flashcardsViewedCount, setFlashcardsViewedCount] = useState(1);
  const [quizScore, setQuizScore] = useState(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  if (!studyData) return null;

  const { title, summary, keyPoints, flashcards, quiz } = studyData;

  const handleFlashcardViewed = (viewedCount) => {
    setFlashcardsViewedCount(viewedCount);
  };

  const handleQuizFinished = (score) => {
    setQuizScore(score);
    setIsQuizCompleted(true);
  };

  return (
    <main className="page-container study-page">
      {/* Topic Title Bar */}
      <div className="study-title-bar">
        <div>
          <span className="badge badge-topic-header">Active Study Topic</span>
          <h1 className="study-main-title">{title}</h1>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-icon"
          onClick={onNewSession}
        >
          <BookIcon size={16} />
          <span>Study Another Topic</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <nav className="tab-navigation" aria-label="Study Sections">
        <button
          type="button"
          className={`tab-btn btn-icon ${activeTab === 'summary' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          <FileTextIcon size={16} />
          <span>Summary & Key Points</span>
        </button>

        <button
          type="button"
          className={`tab-btn btn-icon ${activeTab === 'flashcards' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          <LayersIcon size={16} />
          <span>Flashcards ({flashcards?.length || 0})</span>
        </button>

        <button
          type="button"
          className={`tab-btn btn-icon ${activeTab === 'quiz' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <HelpCircleIcon size={16} />
          <span>Practice Quiz ({quiz?.length || 0})</span>
        </button>

        <button
          type="button"
          className={`tab-btn btn-icon ${activeTab === 'progress' ? 'tab-btn-active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <BarChartIcon size={16} />
          <span>Session Progress</span>
        </button>
      </nav>

      {/* Tab Content Panels - Kept mounted to preserve state across tab switches */}
      <div className="tab-content">
        {/* Tab 1: Summary & Key Points */}
        <div 
          className="tab-panel"
          style={{ display: activeTab === 'summary' ? 'block' : 'none' }}
        >
          <Summary title={title} summary={summary} />
          <KeyPoints keyPoints={keyPoints} />
        </div>

        {/* Tab 2: Flashcards */}
        <div 
          className="tab-panel"
          style={{ display: activeTab === 'flashcards' ? 'block' : 'none' }}
        >
          <Flashcards
            flashcards={flashcards}
            onCardViewed={handleFlashcardViewed}
          />
        </div>

        {/* Tab 3: Quiz */}
        <div 
          className="tab-panel"
          style={{ display: activeTab === 'quiz' ? 'block' : 'none' }}
        >
          <Quiz
            quizQuestions={quiz}
            onQuizFinished={handleQuizFinished}
            onNewTopic={onNewSession}
          />
        </div>

        {/* Tab 4: Session Progress */}
        <div 
          className="tab-panel"
          style={{ display: activeTab === 'progress' ? 'block' : 'none' }}
        >
          <ProgressTracker
            materialGenerated={true}
            flashcardsViewed={flashcardsViewedCount}
            totalFlashcards={flashcards?.length || 0}
            quizCompleted={isQuizCompleted}
            quizScore={quizScore}
            totalQuizQuestions={quiz?.length || 0}
          />
        </div>
      </div>
    </main>
  );
};
