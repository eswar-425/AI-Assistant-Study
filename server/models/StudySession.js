import mongoose from 'mongoose';

/**
 * Flashcard sub-schema
 */
const FlashcardSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

/**
 * Quiz question sub-schema
 */
const QuizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true }
}, { _id: false });

/**
 * StudySession Schema
 * Stores generated study materials and student test results.
 */
const StudySessionSchema = new mongoose.Schema({
  topic: { type: String, default: '' },
  notes: { type: String, default: '' },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  keyPoints: [{ type: String, required: true }],
  flashcards: [FlashcardSchema],
  quiz: [QuizQuestionSchema],
  quizScore: { type: Number, default: null },
  totalQuestions: { type: Number, default: null }
}, {
  timestamps: true
});

export const StudySession = mongoose.model('StudySession', StudySessionSchema);
