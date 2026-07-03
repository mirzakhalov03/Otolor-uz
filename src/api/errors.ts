import axios, { type AxiosError } from 'axios';

export type ApiErrorCode =
  | 'validation'   // 400 with a field-level errors[] array
  | 'business'     // 400 business rule (off-grid slot, past date, schedule conflict)
  | 'conflict'     // 409 double-booking
  | 'auth'         // 401
  | 'rate_limit'   // 429
  | 'network'      // no response (offline / timeout)
  | 'unknown';

export interface FieldError {
  field: string;
  message: string;
}

interface BackendErrorBody {
  success?: boolean;
  message?: string;
  errors?: FieldError[];
}

/** One normalized error shape the whole app reads. */
export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;
  fieldErrors?: FieldError[];

  constructor(args: { status: number; code: ApiErrorCode; message: string; fieldErrors?: FieldError[] }) {
    super(args.message);
    this.name = 'ApiError';
    this.status = args.status;
    this.code = args.code;
    this.fieldErrors = args.fieldErrors;
  }
}

/** Convert any thrown axios error into an ApiError. */
export function normalizeAxiosError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return new ApiError({ status: 0, code: 'unknown', message: 'Unexpected error.' });
  }

  const err = error as AxiosError<BackendErrorBody>;

  if (!err.response) {
    return new ApiError({
      status: 0,
      code: 'network',
      message: 'Network error. Please check your connection and try again.',
    });
  }

  const { status, data } = err.response;
  const message = data?.message || 'Something went wrong. Please try again.';
  const fieldErrors = Array.isArray(data?.errors) ? data.errors : undefined;

  let code: ApiErrorCode = 'unknown';
  if (status === 400) code = fieldErrors ? 'validation' : 'business';
  else if (status === 409) code = 'conflict';
  else if (status === 401) code = 'auth';
  else if (status === 429) code = 'rate_limit';

  return new ApiError({ status, code, message, fieldErrors });
}
