import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAddTransaction } from '@/hooks/use-transactions'
import { ApiError } from '@/services/api-error'
import {
  transactionFormSchema,
  type TransactionFormInput,
  type TransactionFormValues,
} from '@/validators/transaction'

const fields = [
  { name: 'transactionDate', label: 'Transaction Date', type: 'date', placeholder: '' },
  { name: 'accountNumber', label: 'Account Number', type: 'text', placeholder: '1234-5678-9012' },
  { name: 'accountHolderName', label: 'Account Holder Name', type: 'text', placeholder: 'Jane Doe' },
  { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
] as const

function formatAccountNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12)
  return digits.replace(/(\d{4})(?=\d)/g, '$1-')
}

export function AddTransactionModal() {
  const [open, setOpen] = useState(false)
  const { mutateAsync } = useAddTransaction()
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormInput, unknown, TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
  })

  function onOpenChange(next: boolean) {
    setOpen(next)
    if (!next) reset()
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      await mutateAsync(values)
      onOpenChange(false)
    } catch (err) {
      if (err instanceof ApiError && err.details) {
        for (const d of err.details) {
          setError(d.field as keyof TransactionFormValues, { message: d.message })
        }
      } else {
        setError('root', {
          message: err instanceof Error ? err.message : 'Something went wrong',
        })
      }
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Enter the details below. A status is assigned automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} className="space-y-1.5">
              <Label htmlFor={name}>{label}</Label>
              <Input
                id={name}
                type={type}
                step={type === 'number' ? '0.01' : undefined}
                placeholder={placeholder || undefined}
                {...register(name)}
                {...(name === 'accountNumber' && {
                  onChange: (e) =>
                    setValue('accountNumber', formatAccountNumber(e.target.value)),
                })}
              />
              {errors[name] && (
                <p className="text-sm text-red-600">{errors[name]?.message}</p>
              )}
            </div>
          ))}
          {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
