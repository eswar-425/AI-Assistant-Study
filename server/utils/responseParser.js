/**
 * Helper to parse and extract valid JSON from Gemini AI's response text.
 * Handles markdown code fences (```json ... ```) and leading/trailing content.
 */
export const parseGeminiResponse = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    const error = new Error('Empty response received from AI service.');
    error.code = 'INVALID_AI_RESPONSE';
    error.statusCode = 502;
    throw error;
  }

  let cleaned = rawText.trim();

  // Remove markdown code block wrappers if present (e.g., ```json ... ```)
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
    cleaned = cleaned.trim();
  }

  // If the model output still contains leading text before the first '{'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (parseError) {
    console.error('Failed to parse AI JSON response:', parseError.message);
    console.error('Raw response received:', rawText);
    const error = new Error('The AI returned an invalid JSON response. Please try generating the material again.');
    error.code = 'PARSE_ERROR';
    error.statusCode = 502;
    throw error;
  }
};
