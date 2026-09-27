import mongoose from 'mongoose';
import * as geminiService from '../services/geminiService.js';
import { StudySession } from '../models/StudySession.js';

/**
 * Controller to generate study material and optionally save to MongoDB.
 */
export const generateStudyMaterial = async (req, res, next) => {
  try {
    const { topic, notes } = req.body;

    // 1. Generate validated study data
    const studyData = await geminiService.generateStudyMaterial(topic, notes);

    // 2. If MongoDB is connected, save the session to database
    let savedSessionId = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const sessionDoc = await StudySession.create({
          topic,
          notes,
          title: studyData.title,
          summary: studyData.summary,
          keyPoints: studyData.keyPoints,
          flashcards: studyData.flashcards,
          quiz: studyData.quiz
        });
        savedSessionId = sessionDoc._id;
      } catch (dbErr) {
        console.warn('[MongoDB]: Failed to save session document:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      sessionId: savedSessionId,
      data: studyData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to fetch previous study sessions from MongoDB.
 */
export const getStudyHistory = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    const sessions = await StudySession.find({}, 'title topic createdAt quizScore totalQuestions')
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update quiz score for a study session in MongoDB.
 */
export const saveQuizScore = async (req, res, next) => {
  try {
    const { sessionId, score, totalQuestions } = req.body;

    if (!sessionId || mongoose.connection.readyState !== 1) {
      return res.status(200).json({ success: true, saved: false });
    }

    await StudySession.findByIdAndUpdate(sessionId, {
      quizScore: score,
      totalQuestions: totalQuestions
    });

    return res.status(200).json({ success: true, saved: true });
  } catch (error) {
    next(error);
  }
};
