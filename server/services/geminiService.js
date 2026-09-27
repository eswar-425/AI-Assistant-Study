import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseGeminiResponse } from '../utils/responseParser.js';
import { validateStudyData } from '../validators/studyValidator.js';

/**
 * Constructs a strict, detailed prompt for Gemini AI.
 * Requires exactly 10 flashcards and 10 relevant MCQs based on the topic & notes.
 */
const buildPrompt = (topic, notes) => {
  return `
You are an expert university professor and educational specialist. Your task is to generate an in-depth, comprehensive study guide based on the provided Topic and/or Study Notes.

STUDY TOPIC:
${topic ? topic : 'Extract the main subject from the provided notes'}

STUDY NOTES:
${notes ? notes : 'No additional notes provided. Generate comprehensive, authoritative material on the topic above.'}

CRITICAL GENERATION REQUIREMENTS:
1. SUMMARY: Write a comprehensive, highly relevant 2-3 paragraph summary explaining core principles, architecture, mechanisms, and real-world importance.
2. KEY POINTS: Provide 6 to 8 distinct, bullet-worthy takeaways summarizing key facts, definitions, and rules.
3. FLASHCARDS: Generate EXACTLY 10 distinct active-recall flashcards.
   - Each flashcard must have a clear "question" and an accurate, educational "answer".
   - Cover diverse aspects of the topic (definitions, tradeoffs, algorithms, edge cases, formulas/concepts).
4. PRACTICE QUIZ: Generate EXACTLY 10 distinct multiple-choice questions (MCQs).
   - Each question must be deeply relevant and specific to "${topic || 'the topic'}".
   - Each question MUST have EXACTLY 4 plausible, realistic, and distinct options in the "options" array.
   - "correctAnswer" must be an EXACT character-for-character match with one of the 4 options.
   - "explanation" must clearly explain WHY that option is correct and why other options are incorrect.
5. FORMAT: Output RAW JSON ONLY matching the schema below. Do not wrap in markdown or backticks.

STRICT JSON OUTPUT SCHEMA:
{
  "title": "${topic ? topic : 'Study Topic'}",
  "summary": "String (2-3 detailed paragraphs)",
  "keyPoints": [
    "String (Key takeaway 1)",
    "String (Key takeaway 2)",
    "String (Key takeaway 3)",
    "String (Key takeaway 4)",
    "String (Key takeaway 5)",
    "String (Key takeaway 6)"
  ],
  "flashcards": [
    { "question": "Question 1", "answer": "Answer 1" },
    { "question": "Question 2", "answer": "Answer 2" },
    { "question": "Question 3", "answer": "Answer 3" },
    { "question": "Question 4", "answer": "Answer 4" },
    { "question": "Question 5", "answer": "Answer 5" },
    { "question": "Question 6", "answer": "Answer 6" },
    { "question": "Question 7", "answer": "Answer 7" },
    { "question": "Question 8", "answer": "Answer 8" },
    { "question": "Question 9", "answer": "Answer 9" },
    { "question": "Question 10", "answer": "Answer 10" }
  ],
  "quiz": [
    {
      "question": "Question 1",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 2",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 3",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 4",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 5",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 6",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 7",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 8",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 9",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    },
    {
      "question": "Question 10",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option matching one of the 4 above",
      "explanation": "Detailed explanation"
    }
  ]
}
`;
};

/**
 * Generates structured study material using the Google Gemini API.
 */
export const generateStudyMaterial = async (topic, notes) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    const error = new Error('GEMINI_API_KEY is not configured in server/.env.');
    error.code = 'API_KEY_MISSING';
    error.statusCode = 500;
    throw error;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Supported models on this endpoint
  const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-pro-latest'];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      const prompt = buildPrompt(topic, notes);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // 1. Parse raw text into JSON
      const parsedData = parseGeminiResponse(responseText);

      // 2. Validate JSON against the required schema
      const validation = validateStudyData(parsedData);
      if (validation.isValid) {
        console.log(`[Gemini Service]: Successfully generated study material using ${modelName} (${parsedData.flashcards.length} flashcards, ${parsedData.quiz.length} quiz questions).`);
        return parsedData;
      } else {
        console.warn(`[Gemini Service]: Schema validation failed on ${modelName}:`, validation.error);
      }
    } catch (err) {
      console.warn(`[Gemini Service]: Model ${modelName} error:`, err.message);
      lastError = err;
    }
  }

  // If all model calls failed, throw an informative error
  const apiError = new Error(lastError ? lastError.message : 'Unable to generate study material from Gemini API. Please try again.');
  apiError.code = 'API_ERROR';
  apiError.statusCode = 502;
  throw apiError;
};
