import { useTransactions } from '@/hooks/use-transactions'
import { TransactionTable } from '@/components/transaction-table'
import { AddTransactionModal } from '@/components/add-transaction-modal'

export function Home() {
  const { data, isLoading, isError, error } = useTransactions()

  return (
    <div className="min-h-svh bg-muted/40">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Transaction Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View and add transactions.
            </p>
          </div>
          <AddTransactionModal />
        </header>

        <div className="rounded-xl border bg-card shadow-sm">
          {isLoading && (
            <p className="p-8 text-center text-muted-foreground">Loading…</p>
          )}
          {isError && (
            <p className="p-8 text-center text-red-600">
              {error instanceof Error ? error.message : 'Failed to load transactions'}
            </p>
          )}
          {data && <TransactionTable transactions={data} />}
        </div>
      </main>
    </div>
  )
}
