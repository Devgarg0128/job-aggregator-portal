import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import jobRoutes from './routes/jobs.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import './cron/scheduler.js';

const app = express();
app.use(cors());
app.use(json()); // app.use(json()) is middleware that parses JSON data from requests.
                // When axios sends data to your backend, it sends it as JSON text. Express needs to convert that text into a JavaScript object so your code can use it.

app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
