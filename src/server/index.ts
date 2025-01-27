import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createSecureMessage, getSecureMessage } from './api/secure-messages';
import { initDatabase } from './database';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase().catch(console.error);

// Routes
app.post('/api/secure-messages', createSecureMessage);
app.get('/api/secure-messages/:token', getSecureMessage);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});