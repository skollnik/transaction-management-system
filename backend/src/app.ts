// Express application entry point.

import express from 'express';
import cors from 'cors';
import transactionsRouter from './routes/transactions.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.use('/transactions', transactionsRouter);

app.listen(PORT, () => {
  console.log(`Transaction API listening on http://localhost:${PORT}`);
});
