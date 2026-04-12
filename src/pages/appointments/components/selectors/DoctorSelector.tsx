import { useTranslation } from 'react-i18next';
import { useDoctors } from '@/api/query/useDoctors';
import { type Doctor } from '../../types/appointment.types';
import SelectorCard from './SelectorCard';
import { Loader2 } from 'lucide-react';

interface DoctorSelectorProps {
  selectedDoctorId: string | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorSelector = ({ selectedDoctorId, onSelectDoctor }: DoctorSelectorProps) => {
  const { t } = useTranslation();
  const { data: doctors, isLoading, isError, error } = useDoctors();

  return (
    <div className='doctor-selector'>
      <h2 className='section-title'>{t('appointments.step1Title', '1. Select a Doctor')}</h2>

      {isLoading && (
        <div className='doctor-selector__loading'>
          <Loader2 className='doctor-selector__spinner' size={32} />
          <p>{t('appointments.loadingDoctors', 'Loading doctors...')}</p>
        </div>
      )}

      {isError && (
        <div className='doctor-selector__error'>
          <p>{t('appointments.errorLoadingDoctors', 'Failed to load doctors. Please try again.')}</p>
          <p className='doctor-selector__error-detail'>
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      )}

      {!isLoading && !isError && doctors && (
        <div className='doctor-selector__grid'>
          {doctors.length === 0 ? (
            <p className='doctor-selector__empty'>
              {t('appointments.noDoctors', 'No doctors available at the moment.')}
            </p>
          ) : (
            doctors.map((doctor) => (
              <SelectorCard
                key={doctor._id}
                doctor={doctor}
                isSelected={selectedDoctorId === doctor._id}
                onSelect={() => onSelectDoctor(doctor)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorSelector;