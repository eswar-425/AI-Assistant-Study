import express from 'express';
import {
  generateStudyMaterial,
  getStudyHistory,
  saveQuizScore
} from '../controllers/studyController.js';
import { validateStudyInput } from '../validators/studyValidator.js';

const router = express.Router();

/**
 * @route   POST /api/study/generate
 * @desc    Generate study material using Gemini AI
 */
router.post('/generate', validateStudyInput, generateStudyMaterial);

/**
 * @route   GET /api/study/history
 * @desc    Get list of past study sessions from MongoDB
 */
router.get('/history', getStudyHistory);

/**
 * @route   POST /api/study/score
 * @desc    Save completed quiz score to MongoDB
 */
router.post('/score', saveQuizScore);

export default router;
