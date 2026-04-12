import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getAvailableDates,
  getAvailableTimeSlots,
  bookAppointment,
} from '@/api/services/appointmentService';
import type { BookAppointmentPayload } from '@/pages/appointments/types/appointment.types';

/**
 * Fetch available dates for a doctor.
 * Only enabled when doctorId is provided.
 */
export const useAvailableDates = (doctorId: string | null) => {
  return useQuery({
    queryKey: ['availableDates', doctorId],
    queryFn: () => getAvailableDates(doctorId!),
    enabled: !!doctorId,
  });
};

/**
 * Fetch available time slots for a doctor on a specific date.
 * Only enabled when both doctorId and date are provided.
 */
export const useAvailableTimeSlots = (doctorId: string | null, date: string | null) => {
  return useQuery({
    queryKey: ['availableTimeSlots', doctorId, date],
    queryFn: () => getAvailableTimeSlots(doctorId!, date!),
    enabled: !!doctorId && !!date,
  });
};

/**
 * Mutation hook to book an appointment.
 */
export const useBookAppointment = () => {
  return useMutation({
    mutationFn: (payload: BookAppointmentPayload) => bookAppointment(payload),
  });
};
