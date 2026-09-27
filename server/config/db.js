import mongoose from 'mongoose';

/**
 * Connects to MongoDB database using Mongoose.
 * Gracefully handles missing URI or connection failures.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri === 'your_mongodb_connection_string_here') {
    console.log('[MongoDB]: MONGODB_URI not configured. Running with in-memory session mode.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB]: Connected to database (${conn.connection.host})`);
  } catch (error) {
    console.error('[MongoDB]: Connection error:', error.message);
    console.log('[MongoDB]: Running without database persistence.');
  }
};
