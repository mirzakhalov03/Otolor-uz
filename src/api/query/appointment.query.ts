/**
 * Appointment Query Hooks
 * React Query hooks for appointment management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services'; 
import type {
  CreateAppointmentRequest, 
  UpdateAppointmentRequest,
  AppointmentFilters 
} from '../services';
import type { ApiResponse } from '../types';

// Query keys for cache management
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params?: AppointmentFilters) => [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  my: (params?: AppointmentFilters) => [...appointmentKeys.all, 'my', params] as const,
};

/**
 * Hook to get all appointments with filters
 */
export const useAppointments = (params?: AppointmentFilters) => {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: async () => {
      const response = await appointmentService.getAll(params);
      if (!response.success) {
        throw response;
      }
      return { data: response.data, meta: response.meta };
    },
    staleTime: 15 * 1000, // 15 seconds - more frequent updates for appointments
  });
};

/**
 * Hook to get a single appointment by ID
 */
export const useAppointment = (id: string, enabled = true) => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: async () => {
      const response = await appointmentService.getById(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    enabled: !!id && enabled,
  });
};

/**
 * Hook to get current user's appointments
 */
export const useMyAppointments = (params?: AppointmentFilters) => {
  return useQuery({
    queryKey: appointmentKeys.my(params),
    queryFn: async () => {
      const response = await appointmentService.getMyAppointments(params);
      if (!response.success) {
        throw response;
      }
      return { data: response.data, meta: response.meta };
    },
    staleTime: 15 * 1000,
  });
};

/**
 * Hook to create a new appointment
 */
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAppointmentRequest) => {
      const response = await appointmentService.create(data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.my() });
    },
    onError: (error: ApiResponse) => {
      console.error('Create appointment failed:', error.message);
    },
  });
};

/**
 * Hook to update an appointment
 */
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAppointmentRequest }) => {
      const response = await appointmentService.update(id, data);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedAppointment) => {
      if (updatedAppointment) {
        queryClient.setQueryData(appointmentKeys.detail(updatedAppointment._id), updatedAppointment);
      }
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Update appointment failed:', error.message);
    },
  });
};

/**
 * Hook to cancel an appointment
 */
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await appointmentService.cancel(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedAppointment) => {
      if (updatedAppointment) {
        queryClient.setQueryData(appointmentKeys.detail(updatedAppointment._id), updatedAppointment);
      }
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.my() });
    },
    onError: (error: ApiResponse) => {
      console.error('Cancel appointment failed:', error.message);
    },
  });
};

/**
 * Hook to confirm an appointment
 */
export const useConfirmAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await appointmentService.confirm(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedAppointment) => {
      if (updatedAppointment) {
        queryClient.setQueryData(appointmentKeys.detail(updatedAppointment._id), updatedAppointment);
      }
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Confirm appointment failed:', error.message);
    },
  });
};

/**
 * Hook to complete an appointment
 */
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await appointmentService.complete(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedAppointment) => {
      if (updatedAppointment) {
        queryClient.setQueryData(appointmentKeys.detail(updatedAppointment._id), updatedAppointment);
      }
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Complete appointment failed:', error.message);
    },
  });
};

/**
 * Hook to mark appointment as no-show
 */
export const useMarkNoShow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await appointmentService.markNoShow(id);
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    onSuccess: (updatedAppointment) => {
      if (updatedAppointment) {
        queryClient.setQueryData(appointmentKeys.detail(updatedAppointment._id), updatedAppointment);
      }
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
    onError: (error: ApiResponse) => {
      console.error('Mark no-show failed:', error.message);
    },
  });
};

/**
 * Hook to get doctor's booked appointments
 */
export const useDoctorBookings = (params?: AppointmentFilters, enabled = true) => {
  return useQuery({
    queryKey: [...appointmentKeys.all, 'doctor-bookings', params],
    queryFn: async () => {
      const response = await appointmentService.getDoctorBookings(params);
      if (!response.success) {
        throw response;
      }
      return { data: response.data, meta: response.meta };
    },
    enabled,
    staleTime: 15 * 1000, // 15 seconds
  });
};

/**
 * Hook to get today's queue for doctor
 */
export const useDoctorTodayQueue = (enabled = true) => {
  return useQuery({
    queryKey: [...appointmentKeys.all, 'doctor-queue'],
    queryFn: async () => {
      const response = await appointmentService.getDoctorTodayQueue();
      if (!response.success) {
        throw response;
      }
      return response.data;
    },
    enabled,
    staleTime: 15 * 1000, // 15 seconds - frequent updates for live queue
  });
};
