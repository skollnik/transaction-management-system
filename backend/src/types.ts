export const TRANSACTION_STATUSES = ['Pending', 'Settled', 'Failed'] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export type Transaction = {
  transactionDate: string;
  accountNumber: string;
  accountHolderName: string;
  amount: number;
  status: TransactionStatus;
}

// Status is omitted on purpose — the server assigns it.
export type NewTransaction = Omit<Transaction, 'status'>;
