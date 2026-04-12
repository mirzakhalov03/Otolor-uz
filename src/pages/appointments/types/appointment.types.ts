// ========================================
// BACKEND API RESPONSE TYPES
// ========================================

/** Standard API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: FieldError[];
}

/** Field-level validation error */
export interface FieldError {
  field: string;
  message: string;
}

// ========================================
// DOCTOR TYPES
// ========================================

/** Doctor as returned by GET /api/doctors */
export interface Doctor {
  _id: string;
  id: string;
  name: string;
  specialization?: string;
  weeklySchedule: Record<string, string>; // e.g. { Monday: "09:00-16:00" }
  createdAt: string;
  updatedAt: string;
}

// ========================================
// APPOINTMENT TYPES
// ========================================

/** Appointment as returned by POST /api/appointments */
export interface Appointment {
  _id: string;
  id: string;
  doctorId: {
    _id: string;
    name: string;
    specialization?: string;
  };
  fullName: string;
  age: number;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  orderNumber: string;
  status: 'pending' | 'seen' | 'missed';
  createdAt: string;
}

/** Payload for POST /api/appointments */
export interface BookAppointmentPayload {
  doctorId: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  selectedDate: string;
  selectedTime: string;
}

// ========================================
// FORM STATE TYPES
// ========================================

/** Local form state for the booking flow */
export interface AppointmentFormData {
  doctorId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  fullName: string;
  phoneNumber: string;
  age: string;
}
