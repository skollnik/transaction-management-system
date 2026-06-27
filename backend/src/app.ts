import express from 'express';
import cors from 'cors';
import transactionsRouter from './routes/transactions.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.use('/transactions', transactionsRouter);

// 404 for unknown routes, then the central error handler.
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Transaction API listening on http://localhost:${PORT}`);
});
