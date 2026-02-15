/**
 * Services Index
 * Export all API services from a single entry point
 */

export { authService } from './auth.service';
export { doctorService } from './doctor.service';
export { clinicServiceApi } from './clinicService.service';
export { appointmentService } from './appointment.service';
export { userService } from './user.service';

// Re-export request types
export type { CreateDoctorRequest, UpdateDoctorRequest } from './doctor.service';
export type { CreateServiceRequest, UpdateServiceRequest } from './clinicService.service';
export type { CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentFilters } from './appointment.service';
export type { CreateUserRequest, UpdateUserRequest, UserFilters } from './user.service';
