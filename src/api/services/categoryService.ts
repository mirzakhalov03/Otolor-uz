import api from './api';
import type { ApiResponse } from '@/pages/appointments/types/appointment.types';
import type { Category, CreateCategoryPayload } from '@/api/types/catalog.types';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<ApiResponse<Category[]>>('/categories');
  return data.data;
};

export const createCategory = async (payload: CreateCategoryPayload): Promise<Category> => {
  const { data } = await api.post<ApiResponse<Category>>('/categories', payload);
  return data.data;
};
