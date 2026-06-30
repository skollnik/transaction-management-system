import express from 'express';
import cors from 'cors';
import transactionsRouter from './routes/transactions.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/transactions', transactionsRouter);

// 404 for unknown routes, then the central error handler.
app.use(notFound);
app.use(errorHandler);

export { app };
