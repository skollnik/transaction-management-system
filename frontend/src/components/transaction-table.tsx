import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { StatusBadge } from '@/components/status-badge'
import type { Transaction } from '@/services/api'

export function TransactionTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">No transactions yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first one to get started.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead>Date</TableHead>
          <TableHead>Account Number</TableHead>
          <TableHead>Account Holder</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t, i) => (
          <TableRow key={`${t.accountNumber}-${i}`}>
            <TableCell className="text-muted-foreground tabular-nums">
              {t.transactionDate}
            </TableCell>
            <TableCell className="font-mono text-sm">{t.accountNumber}</TableCell>
            <TableCell className="font-medium">{t.accountHolderName}</TableCell>
            <TableCell className="text-right tabular-nums">
              ${t.amount.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">
              <StatusBadge status={t.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
