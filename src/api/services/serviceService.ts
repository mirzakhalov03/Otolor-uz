import api from './api';
import type { ApiResponse } from '@/pages/appointments/types/appointment.types';
import type {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from '@/api/types/catalog.types';

export const getServices = async (categoryId?: string): Promise<Service[]> => {
  const params = categoryId ? { categoryId } : {};
  const { data } = await api.get<ApiResponse<Service[]>>('/services', { params });
  return data.data;
};

export const getServiceById = async (id: string): Promise<Service> => {
  const { data } = await api.get<ApiResponse<Service>>(`/services/${id}`);
  return data.data;
};

export const createService = async (payload: CreateServicePayload): Promise<Service> => {
  const { data } = await api.post<ApiResponse<Service>>('/services', payload);
  return data.data;
};

export const updateService = async (id: string, payload: UpdateServicePayload): Promise<Service> => {
  const { data } = await api.put<ApiResponse<Service>>(`/services/${id}`, payload);
  return data.data;
};

export const deleteService = async (id: string): Promise<void> => {
  await api.delete(`/services/${id}`);
};
