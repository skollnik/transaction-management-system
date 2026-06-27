import type { Request, Response } from 'express';
import { getAllTransactions, createTransaction } from '../services/transactions.js';
import type { NewTransaction } from '../types.js';

export async function getTransactions(_req: Request, res: Response) {
  const transactions = await getAllTransactions();
  res.json(transactions);
}

export async function postTransaction(
  req: Request<Record<string, never>, unknown, NewTransaction>,
  res: Response,
) {
  const created = await createTransaction(req.body);
  res.status(201).json(created);
}
