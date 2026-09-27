/**
 * Service to communicate with backend Study API endpoints.
 */

const rawBackendUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const API_BASE_URL = rawBackendUrl ? `${rawBackendUrl}/api/study` : '/api/study';

/**
 * Sends topic and optional notes to backend to generate study material.
 * @param {string} topic
 * @param {string} notes
 * @returns {Promise<Object>} Generated study data
 */
export const generateStudyMaterial = async (topic, notes) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic, notes })
    });
  } catch (networkErr) {
    const error = new Error(
      'Unable to connect to backend server. Please check that your Render backend is active and that VITE_API_URL is configured.'
    );
    error.code = 'NETWORK_ERROR';
    throw error;
  }

  // Safely parse JSON or handle HTML error pages gracefully
  const responseText = await response.text();
  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          'API endpoint not found (404). Please ensure VITE_API_URL is set in Vercel project settings and points to your Render backend.'
        );
      }
      if (response.status === 502 || response.status === 503) {
        throw new Error(
          'Backend is currently spinning up on Render (free tier cold start). Please wait 30 seconds and try again.'
        );
      }
      throw new Error(`Server returned HTTP ${response.status} (${response.statusText || 'Error'})`);
    }
    throw new Error('Received unexpected non-JSON response from server.');
  }

  if (!response.ok || !result.success) {
    const message = result.error?.message || 'Failed to generate study material. Please try again.';
    const error = new Error(message);
    error.code = result.error?.code || 'API_ERROR';
    throw error;
  }

  return result.data;
};

