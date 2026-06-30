import { z } from 'zod'

export const transactionFormSchema = z.object({
  transactionDate: z.string().min(1, 'Transaction Date is required'),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{4}-\d{4}$/, 'Account Number must look like 1234-5678-9012'),
  accountHolderName: z.string().trim().min(1, 'Account Holder Name is required'),
  amount: z.coerce
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be greater than 0'),
})

export type TransactionFormInput = z.input<typeof transactionFormSchema>
export type TransactionFormValues = z.output<typeof transactionFormSchema>
