import type { newTransactionSchema } from './validators/transactions.js';
import type { z } from 'zod';

export const TRANSACTION_STATUSES = ['Pending', 'Settled', 'Failed'] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export type NewTransaction = z.infer<typeof newTransactionSchema>;

export type Transaction = NewTransaction & {
  status: TransactionStatus;
};
