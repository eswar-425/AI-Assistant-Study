import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import studyRoutes from './routes/studyRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Resolve directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Root status endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'AI Study Assistant API',
    status: 'active',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      generate: 'POST /api/study/generate',
      history: 'GET /api/study/history'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Main study routes
app.use('/api/study', studyRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`AI Study Assistant Server running on port ${PORT}`);
  console.log(`Endpoint: http://localhost:${PORT}/api/study/generate`);
});
