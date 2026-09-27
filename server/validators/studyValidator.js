/**
 * Validators for user input and Gemini AI structured responses.
 */

// Middleware to validate user input before sending to Gemini API
export const validateStudyInput = (req, res, next) => {
  const { topic, notes } = req.body || {};

  const cleanTopic = typeof topic === 'string' ? topic.trim() : '';
  const cleanNotes = typeof notes === 'string' ? notes.trim() : '';

  // Check if both topic and notes are empty
  if (!cleanTopic && !cleanNotes) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'EMPTY_INPUT',
        message: 'Please enter a study topic or paste your study notes.'
      }
    });
  }

  // Attach cleaned/sanitized inputs to req.body
  req.body.topic = cleanTopic;
  req.body.notes = cleanNotes;

  next();
};

// Function to validate the parsed JSON schema returned by Gemini
export const validateStudyData = (data) => {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'AI output must be a valid JSON object.' };
  }

  // 1. Validate Title
  if (!data.title || typeof data.title !== 'string') {
    return { isValid: false, error: 'Missing or invalid "title" string in AI response.' };
  }

  // 2. Validate Summary
  if (!data.summary || typeof data.summary !== 'string') {
    return { isValid: false, error: 'Missing or invalid "summary" string in AI response.' };
  }

  // 3. Validate Key Points
  if (!Array.isArray(data.keyPoints) || data.keyPoints.length === 0) {
    return { isValid: false, error: 'Missing or empty "keyPoints" array in AI response.' };
  }

  for (let i = 0; i < data.keyPoints.length; i++) {
    if (typeof data.keyPoints[i] !== 'string' || !data.keyPoints[i].trim()) {
      return { isValid: false, error: `Invalid keyPoint at index ${i}. Must be a non-empty string.` };
    }
  }

  // 4. Validate Flashcards
  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    return { isValid: false, error: 'Missing or empty "flashcards" array in AI response.' };
  }

  for (let i = 0; i < data.flashcards.length; i++) {
    const card = data.flashcards[i];
    if (!card || typeof card.question !== 'string' || typeof card.answer !== 'string') {
      return { isValid: false, error: `Flashcard at index ${i} must have question and answer strings.` };
    }
  }

  // 5. Validate Quiz Questions
  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    return { isValid: false, error: 'Missing or empty "quiz" array in AI response.' };
  }

  for (let i = 0; i < data.quiz.length; i++) {
    const q = data.quiz[i];
    if (!q || typeof q.question !== 'string' || !q.question.trim()) {
      return { isValid: false, error: `Quiz question at index ${i} has invalid question text.` };
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return { isValid: false, error: `Quiz question at index ${i} must contain exactly 4 options.` };
    }

    if (!q.correctAnswer || typeof q.correctAnswer !== 'string') {
      return { isValid: false, error: `Quiz question at index ${i} must have a valid correctAnswer string.` };
    }

    // Ensure correctAnswer is included in options (or clean if option prefix like 'A. ' exists)
    const matchesOption = q.options.some(
      opt => opt.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
    );

    if (!matchesOption) {
      // If the answer is not an exact match, try matching by letter or prefix
      const cleanAnswer = q.correctAnswer.replace(/^[A-D][.\s)]*/i, '').trim();
      const optionFound = q.options.find(
        opt => opt.trim().toLowerCase() === cleanAnswer.toLowerCase() ||
               opt.replace(/^[A-D][.\s)]*/i, '').trim().toLowerCase() === cleanAnswer.toLowerCase()
      );

      if (optionFound) {
        q.correctAnswer = optionFound;
      }
    }

    if (!q.explanation || typeof q.explanation !== 'string') {
      q.explanation = `The correct answer is: ${q.correctAnswer}`;
    }
  }

  return { isValid: true };
};
