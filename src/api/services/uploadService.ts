import api from './api';
import type { ApiResponse } from '@/pages/appointments/types/appointment.types';

interface UploadImageResponse {
  imageUrl: string;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post<ApiResponse<UploadImageResponse>>('/uploads/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data.data.imageUrl;
};
