export interface FieldError {
  field: string
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly details?: FieldError[]

  constructor(message: string, status: number, details?: FieldError[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}
