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
