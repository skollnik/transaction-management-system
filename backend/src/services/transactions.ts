import { readTransactions, appendTransaction } from './csvService.js';
import { TRANSACTION_STATUSES } from '../types.js';
import type { NewTransaction, Transaction } from '../types.js';

function randomStatus() {
  const index = Math.floor(Math.random() * TRANSACTION_STATUSES.length);
  return TRANSACTION_STATUSES[index];
}

export function getAllTransactions() {
  return readTransactions();
}

export function createTransaction(input: NewTransaction) {
  const transaction: Transaction = {
    ...input,
    status: randomStatus(),
  };

  return appendTransaction(transaction);
}
