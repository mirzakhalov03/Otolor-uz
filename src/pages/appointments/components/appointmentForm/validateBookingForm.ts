import type { TFunction } from 'i18next';
import type { FieldError } from '@/api/errors';

interface ValidateInput {
  hasDoctor: boolean;
  selectedDate: string | null;
  selectedTime: string | null;
  fullName: string;
  phoneNumber: string;
  age: string;
}

export interface ValidationResult {
  apiError?: string;
  fieldErrors?: FieldError[];
}

/** Returns null when valid, otherwise the first error to show. Mirrors the old inline checks. */
export function validateBookingForm(input: ValidateInput, t: TFunction): ValidationResult | null {
  if (!input.hasDoctor || !input.selectedDate || !input.selectedTime) {
    return { apiError: t('appointments.errorSelectAll') };
  }
  if (!input.fullName.trim()) {
    return { fieldErrors: [{ field: 'fullName', message: t('appointments.errorFullName') }] };
  }
  if (!input.phoneNumber.trim()) {
    return { fieldErrors: [{ field: 'phoneNumber', message: t('appointments.errorPhone') }] };
  }
  if (!input.age.trim()) {
    return { fieldErrors: [{ field: 'age', message: t('appointments.errorAge') }] };
  }
  return null;
}
