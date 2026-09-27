import { useState } from 'react';
import { generateStudyMaterial } from '../services/studyApi';

/**
 * Custom hook to handle study session state and AI generation.
 */
export const useStudy = () => {
  const [studyData, setStudyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to call API and store study material
  const fetchStudyMaterial = async (topic, notes) => {
    setLoading(true);
    setError(null);

    try {
      const data = await generateStudyMaterial(topic, notes);
      setStudyData(data);
    } catch (err) {
      setError(err.message || 'Unable to generate study material right now.');
    } finally {
      setLoading(false);
    }
  };

  // Function to reset state to start a new study session
  const resetStudy = () => {
    setStudyData(null);
    setError(null);
    setLoading(false);
  };

  return {
    studyData,
    loading,
    error,
    fetchStudyMaterial,
    resetStudy
  };
};
