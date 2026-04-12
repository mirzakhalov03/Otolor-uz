import api from './api';
import type {
  ApiResponse,
  Appointment,
  BookAppointmentPayload,
} from '@/pages/appointments/types/appointment.types';

/**
 * Fetch available dates for a doctor (next 30 days where they work).
 */
export const getAvailableDates = async (doctorId: string): Promise<string[]> => {
  const { data } = await api.get<ApiResponse<string[]>>('/appointments/availability', {
    params: { doctorId },
  });
  return data.data;
};

/**
 * Fetch available 30-min time slots for a specific doctor + date.
 */
export const getAvailableTimeSlots = async (
  doctorId: string,
  date: string
): Promise<string[]> => {
  const { data } = await api.get<ApiResponse<string[]>>('/appointments/availability', {
    params: { doctorId, date },
  });
  return data.data;
};

/**
 * Book an appointment. Returns the created appointment with orderNumber.
 */
export const bookAppointment = async (
  payload: BookAppointmentPayload
): Promise<Appointment> => {
  const { data } = await api.post<ApiResponse<Appointment>>('/appointments', payload);
  return data.data;
};
