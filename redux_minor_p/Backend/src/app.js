import express from 'express';
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
import notesRouter from './routes/routes.js';
import authRouter from './auth/routes/auth.routes.js';
import configureGoogleStrategy from './auth/strategies/google.strategy.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Initialize Passport
configureGoogleStrategy();
app.use(passport.initialize());

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler (must be last)
app.use(errorMiddleware);

export default app;