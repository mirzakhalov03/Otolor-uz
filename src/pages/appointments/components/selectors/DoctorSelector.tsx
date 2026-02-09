import { mockDoctors } from '../../data/mockDoctors';
import { type Doctor } from '../../types/appointment.types';
import SelectorCard from './SelectorCard';

interface DoctorSelectorProps {
  selectedDoctorId: number | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorSelector = ({ selectedDoctorId, onSelectDoctor }: DoctorSelectorProps) => {
  return (
    <div className='doctor-selector'>
      <h2 className='section-title'>1. Shifokorni tanlang</h2>
      <div className='flex flex-col md:flex-row gap-4 flex-wrap'>
        {mockDoctors.map((doctor) => (
          <SelectorCard
            key={doctor.id}
            doctor={doctor}
            isSelected={selectedDoctorId === doctor.id}
            onSelect={() => onSelectDoctor(doctor)}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorSelector;