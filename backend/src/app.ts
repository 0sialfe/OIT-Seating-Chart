import express from 'express';
import { json } from 'express';
import cors from 'cors';
import { roomRoutes } from './routes/roomRoutes';

const app = express();

app.use(cors());
app.use(json());

// API路由
app.use('/api', roomRoutes);

export default app; 