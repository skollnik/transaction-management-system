import { Badge } from '@/components/ui/badge'
import type { TransactionStatus } from '@/services/api'

const styles: Record<TransactionStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
  Settled: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
  Failed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
}

const dots: Record<TransactionStatus, string> = {
  Pending: 'bg-yellow-500',
  Settled: 'bg-green-500',
  Failed: 'bg-red-500',
}

export function StatusBadge({ status }: { status: TransactionStatus }) {
  return (
    <Badge className={styles[status]}>
      <span className={`size-1.5 rounded-full ${dots[status]}`} />
      {status}
    </Badge>
  )
}
