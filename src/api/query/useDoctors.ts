import { useQuery } from '@tanstack/react-query';
import { getDoctors } from '@/api/services/doctorService';

/**
 * React Query hook to fetch all doctors.
 */
export const useDoctors = (search?: string) => {
  return useQuery({
    queryKey: ['doctors', search],
    queryFn: () => getDoctors(search),
  });
};
