import { CheckCircle } from 'lucide-react';
import { type Doctor } from '../../types/appointment.types';
import './selectorCard.scss';

interface SelectorCardProps {
    doctor: Doctor;
    isSelected: boolean;
    onSelect: () => void;
}

const SelectorCard = ({ doctor, isSelected, onSelect }: SelectorCardProps) => {
    // Get initials from doctor name (e.g. "Dr. Sardor Karimov" → "SK")
    const getInitials = (name: string): string => {
        const words = name.replace(/^Dr\.?\s*/i, '').trim().split(/\s+/);
        if (words.length >= 2) {
            return (words[0][0] + words[words.length - 1][0]).toUpperCase();
        }
        return words[0]?.substring(0, 2).toUpperCase() || '?';
    };

    // Format working days from weeklySchedule keys
    const formatWorkingDays = (): string => {
        if (!doctor.weeklySchedule) return '';
        const dayAbbreviations: Record<string, string> = {
            Monday: 'Dush',
            Tuesday: 'Sesh',
            Wednesday: 'Chor',
            Thursday: 'Pay',
            Friday: 'Jum',
            Saturday: 'Shan',
            Sunday: 'Yak',
        };
        return Object.keys(doctor.weeklySchedule)
            .map(day => dayAbbreviations[day] || day)
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
            {isSelected && (
                <div className="selector-card__check">
                    <CheckCircle size={22} />
                </div>
            )}
            <div className="selector-card__inner">
                <div className="selector-card__avatar">
                    <span>{getInitials(doctor.name)}</span>
                </div>
                <div className="selector-card__info">
                    <h3 className="selector-card__name">{doctor.name}</h3>
                    {doctor.specialization && (
                        <p className="selector-card__specialty">{doctor.specialization}</p>
                    )}
                    <div className="selector-card__schedule">
                        <p className="selector-card__schedule-label">Mavjud kunlar:</p>
                        <p className="selector-card__schedule-days">{formatWorkingDays()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectorCard;