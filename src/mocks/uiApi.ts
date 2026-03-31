import { useEffect, useMemo, useState } from 'react';
import { uiClinicServices, uiDoctors, uiPublicServices } from './uiData';
import type {
  ApiResponse,
  ClinicService,
  CreateDoctorRequest,
  CreateServiceRequest,
  Doctor,
  LoginRequest,
  PaginationMeta,
  UpdateDoctorRequest,
  UpdateServiceRequest,
  User,
} from './uiTypes';

type MutationState<TError = unknown> = {
  isPending: boolean;
  isError: boolean;
  error: TError | null;
  mutateAsync: (payload?: any) => Promise<any>;
};

const listeners = new Set<() => void>();

function notifyStoreChange() {
  listeners.forEach((listener) => listener());
}

function useStoreSubscription() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((prev) => prev + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
}

function toMeta(page: number, perPage: number, totalItems: number): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  return {
    currentPage: page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

function useLocalMutation<TPayload, TResult>(
  handler: (payload: TPayload) => Promise<TResult>
): MutationState {
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const mutateAsync = async (payload?: TPayload) => {
    setIsPending(true);
    setIsError(false);
    setError(null);
    try {
      const result = await handler(payload as TPayload);
      return result;
    } catch (err) {
      setIsError(true);
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, isError, error, mutateAsync };
}

export function useAdminLogin() {
  return useLocalMutation<LoginRequest, ApiResponse>(async () => {
    return {
      success: true,
      status: 200,
      message: 'UI-only mode: login simulated. Protected pages are intentionally blocked.',
    };
  });
}

export function useLogout() {
  return useLocalMutation<void, ApiResponse>(async () => ({
    success: true,
    status: 200,
    message: 'UI-only logout complete.',
  }));
}

export function useDoctors(params?: { page?: number; limit?: number; search?: string }) {
  useStoreSubscription();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = (params?.search ?? '').toLowerCase();

  const filtered = uiDoctors.filter((doctor) => {
    if (!search) return true;
    return [doctor.fullName, doctor.firstName, doctor.lastName, doctor.email, doctor.specialization]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(search));
  });

  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data: {
      success: true,
      status: 200,
      message: 'OK',
      data,
      meta: toMeta(page, limit, filtered.length),
    },
    isLoading: false,
    refetch: async () => ({ success: true }),
  };
}

export function useDoctor(id: string, enabled = true) {
  useStoreSubscription();
  const data = enabled ? uiDoctors.find((doctor) => doctor._id === id) ?? null : null;
  return { data, isLoading: false };
}

export function useDoctorWithUser(id: string, enabled = true) {
  useStoreSubscription();
  const data = enabled ? uiDoctors.find((doctor) => doctor._id === id) ?? null : null;
  return { data, isLoading: false };
}

export function useCheckUsername(username: string, enabled = true) {
  const data = useMemo(() => {
    if (!enabled || !username) return null;
    const normalized = username.toLowerCase();
    const exists = uiDoctors.some((doctor) => doctor.user?.username?.toLowerCase() === normalized);
    return { username, isAvailable: !exists };
  }, [username, enabled]);

  return { data, isFetching: false };
}

export function useCreateDoctor() {
  return useLocalMutation<CreateDoctorRequest, Doctor>(async (payload) => {
    const doctor: Doctor = {
      _id: `doc-${Date.now()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      phone: payload.phone,
      specialization: payload.specialization,
      specialty: [payload.specialization],
      qualifications: payload.qualifications ?? [],
      experienceYears: payload.experienceYears ?? 0,
      bio: payload.bio ?? '',
      consultationFee: payload.consultationFee ?? 0,
      availableDays: payload.availableDays ?? [],
      workingHours: payload.workingHours ?? { start: '09:00', end: '17:00' },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: { _id: `u-${Date.now()}`, username: payload.username, isActive: true },
    };

    uiDoctors.unshift(doctor);
    notifyStoreChange();
    return doctor;
  });
}

export function useUpdateDoctor() {
  return useLocalMutation<{ id: string; data: UpdateDoctorRequest }, Doctor>(async (payload) => {
    const index = uiDoctors.findIndex((doctor) => doctor._id === payload.id);
    if (index < 0) {
      throw new Error('Doctor not found');
    }

    const current = uiDoctors[index];
    const next: Doctor = {
      ...current,
      ...payload.data,
      fullName: `${payload.data.firstName ?? current.firstName} ${payload.data.lastName ?? current.lastName}`,
      updatedAt: new Date().toISOString(),
    };
    uiDoctors[index] = next;
    notifyStoreChange();
    return next;
  });
}

export function useDeleteDoctor() {
  return useLocalMutation<string, ApiResponse>(async (id) => {
    const index = uiDoctors.findIndex((doctor) => doctor._id === id);
    if (index >= 0) {
      uiDoctors.splice(index, 1);
      notifyStoreChange();
    }
    return { success: true, status: 200, message: 'Doctor deleted' };
  });
}

export function useClinicServices(params?: { page?: number; limit?: number; search?: string }) {
  useStoreSubscription();
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const search = (params?.search ?? '').toLowerCase();

  const filtered = uiClinicServices.filter((service) => {
    if (!search) return true;
    return [service.name.en, service.name.ru, service.name.uz, service.category]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(search));
  });

  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data: {
      success: true,
      status: 200,
      message: 'OK',
      data,
      meta: toMeta(page, limit, filtered.length),
    },
    isLoading: false,
    refetch: async () => ({ success: true }),
  };
}

export function useClinicService(id: string, enabled = true) {
  useStoreSubscription();
  const data = enabled ? uiClinicServices.find((service) => service._id === id) ?? null : null;
  return { data, isLoading: false };
}

export function useCreateClinicService() {
  return useLocalMutation<CreateServiceRequest, ClinicService>(async (payload) => {
    const next: ClinicService = {
      _id: `svc-${Date.now()}`,
      name: payload.name,
      description: payload.description,
      category: payload.category,
      price: payload.price,
      duration: payload.duration,
      isActive: true,
      image: { url: null, key: null },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    uiClinicServices.unshift(next);
    notifyStoreChange();
    return next;
  });
}

export function useUpdateClinicService() {
  return useLocalMutation<{ id: string; data: UpdateServiceRequest }, ClinicService>(async (payload) => {
    const index = uiClinicServices.findIndex((service) => service._id === payload.id);
    if (index < 0) {
      throw new Error('Service not found');
    }

    const current = uiClinicServices[index];
    const next: ClinicService = {
      ...current,
      ...payload.data,
      name: { ...current.name, ...(payload.data.name ?? {}) },
      description: { ...current.description, ...(payload.data.description ?? {}) },
      updatedAt: new Date().toISOString(),
    };

    uiClinicServices[index] = next;
    notifyStoreChange();
    return next;
  });
}

export function useDeleteClinicService() {
  return useLocalMutation<string, ApiResponse>(async (id) => {
    const index = uiClinicServices.findIndex((service) => service._id === id);
    if (index >= 0) {
      uiClinicServices.splice(index, 1);
      notifyStoreChange();
    }
    return { success: true, status: 200, message: 'Service deleted' };
  });
}

export function useService() {
  return {
    data: {
      success: true,
      status: 200,
      message: 'OK',
      data: {
        services: uiPublicServices,
      },
    },
    isLoading: false,
  };
}

export const authKeys = {
  me: () => ['auth', 'me'] as const,
};

export const demoUser: User = {
  _id: 'ui-user-1',
  firstName: 'UI',
  lastName: 'Preview',
  email: 'ui@preview.local',
  role: { _id: 'role-user', roleName: 'user' },
  isActive: true,
};
