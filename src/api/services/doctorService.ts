import api from './api';
import type { ApiResponse, Doctor } from '@/pages/appointments/types/appointment.types';

/**
 * Fetch all doctors, optionally filtered by search query.
 */
export const getDoctors = async (search?: string): Promise<Doctor[]> => {
  const params = search ? { search } : {};
  const { data } = await api.get<ApiResponse<Doctor[]>>('/doctors', { params });
  return data.data;
};

/**
 * Fetch a single doctor by ID.
 */
export const getDoctor = async (id: string): Promise<Doctor> => {
  const { data } = await api.get<ApiResponse<Doctor>>(`/doctors/${id}`);
  return data.data;
};

/**
 * Create a new doctor.
 */
export const createDoctor = async (payload: {
  name: string;
  specialization?: string;
  avatarUrl?: string;
  weeklySchedule: Record<string, string>;
}): Promise<Doctor> => {
  const { data } = await api.post<ApiResponse<Doctor>>('/doctors', payload);
  return data.data;
};

/**
 * Update an existing doctor (partial update).
 */
export const updateDoctor = async (
  id: string,
  payload: {
    name?: string;
    specialization?: string;
    avatarUrl?: string;
    weeklySchedule?: Record<string, string>;
  }
): Promise<Doctor> => {
  const { data } = await api.patch<ApiResponse<Doctor>>(`/doctors/${id}`, payload);
  return data.data;
};

/**
 * Delete a doctor by ID.
 */
export const deleteDoctor = async (id: string): Promise<void> => {
  await api.delete(`/doctors/${id}`);
};
