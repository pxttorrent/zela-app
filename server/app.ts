import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import dataRoutes from './data.js';
import paymentRoutes from './payment.js';
import adminRoutes from './admin.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// Note: When running on Netlify Functions, the base path is /.netlify/functions/api
// We can use a router to handle the /api prefix or mount it appropriately.
// For simplicity in both local and lambda, we keep /api prefix.

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Sync Data Endpoint
app.post('/api/sync', async (req, res) => {
  res.json({ status: 'synced', message: 'Sync logic to be implemented with real DB schema' });
});

export default app;
