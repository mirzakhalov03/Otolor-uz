import { CheckCircle } from 'lucide-react';
import { type Doctor } from '../../types/appointment.types';
import './selectorCard.scss';

interface SelectorCardProps {
    doctor: Doctor;
    isSelected: boolean;
    onSelect: () => void;
}

const SelectorCard = ({ doctor, isSelected, onSelect }: SelectorCardProps) => {
    const formatAvailability = () => {
        const daysOfWeek = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
        const uniqueDays = new Set<number>();

        doctor.timeSlots.forEach(slot => {
            const date = new Date(slot.date);
            uniqueDays.add(date.getDay());
        });

        return Array.from(uniqueDays)
            .sort()
            .map(day => daysOfWeek[day])
            .join(', ');
    };

    return (
        <div
            className={`selector-card ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect()}
        >
            <div className="flex items-center p-2 gap-4 relative">
                {isSelected && (
                    <div className="absolute top-2 right-2">
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                )}
                <div className="w-[130px] h-[130px] rounded-lg bg-gray-200 shrink-0">
                    <img
                        src={doctor.image}
                        alt={doctor.name}
                        className='w-full h-full object-cover rounded-lg'
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Mavjud kunlar:</p>
                        <p className="text-sm font-medium text-green-600">{formatAvailability()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectorCard;