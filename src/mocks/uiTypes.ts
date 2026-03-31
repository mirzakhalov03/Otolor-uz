export type RoleName = 'user' | 'doctor' | 'admin' | 'superadmin';

export interface Role {
  _id: string;
  roleName: RoleName;
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
  role?: Role;
  authProvider?: 'local' | 'google' | 'facebook';
  doctorProfile?: string | null;
  isActive?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface DoctorUser {
  _id: string;
  username: string;
  isActive?: boolean;
}

export interface Doctor {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  specialization?: string;
  specialty?: string[];
  qualifications?: string[];
  experienceYears?: number;
  bio?: string;
  consultationFee?: number;
  workingHours?: {
    start: string;
    end: string;
  };
  availableDays?: string[];
  rating?: number;
  totalReviews?: number;
  profileImage?: {
    url: string;
    key?: string;
  };
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  user?: DoctorUser | null;
  languages?: string[];
}

export interface CreateDoctorRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications?: string[];
  experienceYears?: number;
  bio?: string;
  consultationFee?: number;
  availableDays?: string[];
  workingHours?: {
    start: string;
    end: string;
  };
}

export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> {
  isActive?: boolean;
}

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

export interface CreateServiceRequest {
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
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  isActive?: boolean;
}

export interface ServiceListItem {
  _id: string;
  serviceName: string;
  category: string;
  price: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
