/**
 * Appointment Service
 * Pure API calls for appointment management endpoints
 * Maps directly to backend /api/v1/appointments routes
 */

import baseService from '../baseService';
import type { Appointment, AppointmentStatus, SearchParams } from '../types';

export interface CreateAppointmentRequest {
  doctor: string;
  service: string;
  appointmentDate: string;
  startTime: string;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  appointmentDate?: string;
  startTime?: string;
  status?: AppointmentStatus;
  notes?: string;
}

export interface AppointmentFilters extends SearchParams {
  status?: AppointmentStatus;
  doctorId?: string;
  patientId?: string;
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Appointment management API endpoints
 */
export const appointmentService = {
  /**
   * Get all appointments with filters
   * GET /appointments
   */
  async getAll(params?: AppointmentFilters) {
    return baseService.get<Appointment[]>('/appointments', params);
  },

  /**
   * Get appointment by ID
   * GET /appointments/:id
   */
  async getById(id: string) {
    return baseService.get<Appointment>(`/appointments/${id}`);
  },

  /**
   * Create new appointment
   * POST /appointments
   */
  async create(data: CreateAppointmentRequest) {
    return baseService.post<Appointment, CreateAppointmentRequest>('/appointments', data);
  },

  /**
   * Update appointment
   * PATCH /appointments/:id
   */
  async update(id: string, data: UpdateAppointmentRequest) {
    return baseService.patch<Appointment, UpdateAppointmentRequest>(`/appointments/${id}`, data);
  },

  /**
   * Cancel appointment
   * PATCH /appointments/:id/cancel
   */
  async cancel(id: string) {
    return baseService.patch<Appointment>(`/appointments/${id}/cancel`);
  },

  /**
   * Confirm appointment (admin/doctor only)
   * PATCH /appointments/:id/confirm
   */
  async confirm(id: string) {
    return baseService.patch<Appointment>(`/appointments/${id}/confirm`);
  },

  /**
   * Mark appointment as completed (doctor only)
   * PATCH /appointments/:id/complete
   */
  async complete(id: string) {
    return baseService.patch<Appointment>(`/appointments/${id}/complete`);
  },

  /**
   * Mark appointment as no-show
   * PATCH /appointments/:id/no-show
   */
  async markNoShow(id: string) {
    return baseService.patch<Appointment>(`/appointments/${id}/no-show`);
  },

  /**
   * Get my appointments (for patients)
   * GET /appointments/my
   */
  async getMyAppointments(params?: AppointmentFilters) {
    return baseService.get<Appointment[]>('/appointments/my', params);
  },

  /**
   * Get doctor's booked appointments (for doctors)
   * GET /appointments/doctor/bookings
   */
  async getDoctorBookings(params?: AppointmentFilters) {
    return baseService.get<Appointment[]>('/appointments/doctor/bookings', params);
  },

  /**
   * Get today's queue for doctor (for doctors)
   * GET /appointments/doctor/queue
   */
  async getDoctorTodayQueue() {
    return baseService.get<Appointment[]>('/appointments/doctor/queue');
  },
};

export default appointmentService;
