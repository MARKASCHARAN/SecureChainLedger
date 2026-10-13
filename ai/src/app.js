// ai/src/app.js
import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'securechain-ai', timestamp: new Date().toISOString() });
});

app.use('/api/v1/ai', aiRoutes);

export default app;
