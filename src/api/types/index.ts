/**
 * API Types and Contracts
 * Matches backend response structures exactly
 */

// ================== Generic Response Types ==================

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ApiError[];
}

export interface PaginationMeta {
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiError {
  field?: string;
  message: string;
}

// ================== Auth Types ==================

export interface LoginRequest {
  login: string; // Can be username, email, or phone
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  username?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

// ================== User Types ==================

export interface Role {
  _id: string;
  name: 'user' | 'doctor' | 'admin' | 'superadmin';
  description?: string;
  permissions: string[];
  isActive: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  username?: string;
  email: string;
  phone?: string;
  profileImage?: {
    url: string | null;
    key: string | null;
  };
  role: Role;
  authProvider: 'local' | 'google' | 'facebook';
  doctorProfile?: string | null;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// ================== Doctor Types ==================

export interface DoctorUser {
  _id: string;
  username: string;
  isActive?: boolean;
}

export interface Doctor {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  bio: string;
  consultationFee: number;
  workingHours: {
    start: string;
    end: string;
  };
  availableDays: string[];
  rating?: number;
  totalReviews?: number;
  profileImage?: {
    url: string;
    key?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Linked user account (for authentication)
  user?: DoctorUser | null;
  languages?: string[];
}

// ================== Service Types ==================

export interface ClinicService {
  _id: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  category: string;
  price: number;
  duration: number;
  image?: {
    url: string | null;
    key: string | null;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ================== Appointment Types ==================

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Appointment {
  _id: string;
  patient: User | string;
  doctor: Doctor | string;
  service: ClinicService | string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ================== Pagination Types ==================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  [key: string]: unknown;
}

export interface SearchParams extends PaginationParams {
  search?: string;
}

// ================== Permission Types ==================

export type Permission = 
  | 'users:create' | 'users:read' | 'users:update' | 'users:delete' | 'users:manage'
  | 'doctors:create' | 'doctors:read' | 'doctors:update' | 'doctors:delete' | 'doctors:manage'
  | 'services:create' | 'services:read' | 'services:update' | 'services:delete' | 'services:manage'
  | 'appointments:create' | 'appointments:read' | 'appointments:update' | 'appointments:delete' | 'appointments:manage';
