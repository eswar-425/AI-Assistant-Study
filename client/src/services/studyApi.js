/**
 * Service to communicate with backend Study API endpoints.
 */

const API_BASE_URL = '/api/study';

/**
 * Sends topic and optional notes to backend to generate study material.
 * @param {string} topic
 * @param {string} notes
 * @returns {Promise<Object>} Generated study data
 */
export const generateStudyMaterial = async (topic, notes) => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ topic, notes })
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    const message = result.error?.message || 'Failed to generate study material. Please try again.';
    const error = new Error(message);
    error.code = result.error?.code || 'API_ERROR';
    throw error;
  }

  return result.data;
};
