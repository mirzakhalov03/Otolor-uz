/**
 * Query Index
 * Export all React Query hooks from a single entry point
 */

// Auth queries
export {
  authKeys,
  useCurrentUser,
  useLogin,
  useAdminLogin,
  useRegister,
  useLogout,
  useLogoutAll,
  useChangePassword,
  useIsAuthenticated,
  useIsAdmin,
  useHasRole,
  usePermissions,
} from './auth.query';

// Doctor queries
export {
  doctorKeys,
  useDoctors,
  useDoctor,
  useDoctorWithUser,
  useCheckUsername,
  useDoctorAvailability,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from './doctor.query';

// Clinic service queries
export {
  serviceKeys,
  useClinicServices,
  useClinicService,
  useCreateClinicService,
  useUpdateClinicService,
  useDeleteClinicService,
  useUploadServiceImage,
} from './clinicService.query';

// Appointment queries
export {
  appointmentKeys,
  useAppointments,
  useAppointment,
  useMyAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useCancelAppointment,
  useConfirmAppointment,
  useCompleteAppointment,
  useMarkNoShow,
  useDoctorBookings,
  useDoctorTodayQueue,
} from './appointment.query';

// User queries
export {
  userKeys,
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useActivateUser,
  useDeactivateUser,
  useUploadProfileImage,
} from './user.query';
