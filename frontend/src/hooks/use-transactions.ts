import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTransactions, createTransaction } from '@/services/api'

const TRANSACTIONS_KEY = ['transactions'] as const

export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: getTransactions,
  })
}

export function useAddTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_KEY })
    },
  })
}
