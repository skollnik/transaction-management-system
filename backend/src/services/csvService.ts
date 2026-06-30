import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createObjectCsvWriter } from 'csv-writer';
import csvParser from 'csv-parser';
import type { Transaction } from '../types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Overridable so tests can point at a temporary file.
const CSV_FILE_PATH = process.env.CSV_FILE_PATH
  ? path.resolve(process.env.CSV_FILE_PATH)
  : path.resolve(__dirname, '../../data/transactions.csv');

const CSV_HEADER = [
  { id: 'transactionDate', title: 'Transaction Date' },
  { id: 'accountNumber', title: 'Account Number' },
  { id: 'accountHolderName', title: 'Account Holder Name' },
  { id: 'amount', title: 'Amount' },
  { id: 'status', title: 'Status' },
];

type CsvRow = Record<string, string>;

function fromCsvRow(row: CsvRow): Transaction {
  return {
    transactionDate: row['Transaction Date'],
    accountNumber: row['Account Number'],
    accountHolderName: row['Account Holder Name'],
    amount: Number(row['Amount']),
    status: row['Status'] as Transaction['status'],
  };
}

function toCsvRow(transaction: Transaction): CsvRow {
  return {
    transactionDate: transaction.transactionDate,
    accountNumber: transaction.accountNumber,
    accountHolderName: transaction.accountHolderName,
    amount: transaction.amount.toFixed(2),
    status: transaction.status,
  };
}

export function readTransactions() {
  return new Promise<Transaction[]>((resolve, reject) => {
    const transactions: Transaction[] = [];

    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csvParser())
      .on('data', (row: CsvRow) => {
        transactions.push(fromCsvRow(row));
      })
      .on('end', () => resolve(transactions))
      .on('error', () => reject(new Error('Failed to read transactions CSV')));
  });
}

// Serializes concurrent appends; the CSV file is not safe for parallel writes.
let writeLock: Promise<unknown> = Promise.resolve();

export function appendTransaction(transaction: Transaction) {
  const run = writeLock.then(async () => {
    const writer = createObjectCsvWriter({
      path: CSV_FILE_PATH,
      header: CSV_HEADER,
      append: true,
    });

    await writer.writeRecords([toCsvRow(transaction)]);
    return transaction;
  });

  writeLock = run.catch(() => undefined);
  return run;
}
