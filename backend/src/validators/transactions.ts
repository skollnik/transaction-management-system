import { z } from 'zod';
import { isValid, parse } from 'date-fns';

function isRealDate(value: string): boolean {
  return isValid(parse(value, 'yyyy-MM-dd', new Date()));
}

export const newTransactionSchema = z.object({
  transactionDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Transaction Date must be in YYYY-MM-DD format')
    .refine(isRealDate, { message: 'Transaction Date must be a real calendar date' }),
  accountNumber: z.string().trim().min(1, 'Account Number is required'),
  accountHolderName: z.string().trim().min(1, 'Account Holder Name is required'),
  amount: z.coerce
    .number()
    .positive('Amount must be greater than 0')
    .finite('Amount must be a finite number'),
});
