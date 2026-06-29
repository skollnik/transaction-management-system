import { ApiError, type FieldError } from './api-error'

export type TransactionStatus = 'Pending' | 'Settled' | 'Failed'

export interface Transaction {
  transactionDate: string
  accountNumber: string
  accountHolderName: string
  amount: number
  status: TransactionStatus
}

// Status is assigned server-side.
export type NewTransaction = Omit<Transaction, 'status'>

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

interface ErrorBody {
  error?: string
  details?: FieldError[]
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const body: ErrorBody | null = await res.json().catch(() => null)
    throw new ApiError(
      body?.error ?? `Request failed with status ${res.status}`,
      res.status,
      body?.details,
    )
  }

  return res.json() as Promise<T>
}

export function getTransactions(): Promise<Transaction[]> {
  return request<Transaction[]>('/transactions')
}

export function createTransaction(input: NewTransaction): Promise<Transaction> {
  return request<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
