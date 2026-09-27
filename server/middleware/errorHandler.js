/**
 * Global Error Handling Middleware
 * Standardizes error responses across the backend application.
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]:', err.message || err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'SERVER_ERROR';
  const errorMessage = err.message || 'An unexpected error occurred. Please try again.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: errorMessage
    }
  });
};
