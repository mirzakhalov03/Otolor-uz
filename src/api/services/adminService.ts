import api from './api';
import type { ApiResponse, Appointment } from '@/pages/appointments/types/appointment.types';

/** Shape of the paginated response from GET /api/admin/appointments */
export interface AdminAppointmentsResponse {
  success: boolean;
  message: string;
  data: Appointment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Query params for admin appointments endpoint */
export interface AdminAppointmentParams {
  page?: number;
  limit?: number;
  status?: 'pending' | 'seen' | 'missed';
  doctorId?: string;
  date?: string;
  search?: string;
}

/**
 * Fetch all appointments (admin view) with filtering and pagination.
 */
export const getAdminAppointments = async (
  params: AdminAppointmentParams = {}
): Promise<AdminAppointmentsResponse> => {
  // Remove undefined/empty values before sending
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null)
  );
  const { data } = await api.get<AdminAppointmentsResponse>('/admin/appointments', {
    params: cleanParams,
  });
  return data;
};

/**
 * Update an appointment's status (pending → seen | missed).
 */
export const updateAppointmentStatus = async (
  id: string,
  status: 'seen' | 'missed'
): Promise<Appointment> => {
  const { data } = await api.patch<ApiResponse<Appointment>>(
    `/admin/appointments/${id}/status`,
    { status }
  );
  return data.data;
};

/**
 * Delete an appointment by ID.
 */
export const deleteAppointment = async (id: string): Promise<void> => {
  await api.delete(`/admin/appointments/${id}`);
};
