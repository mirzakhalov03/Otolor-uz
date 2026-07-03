import { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import { clinicNext7, clinicToday } from '@/utils/clinicTime';
import './weeklyCalendar.scss';

interface WeeklyCalendarProps {
    availableDates: string[]; // API dates in "YYYY-MM-DD" format
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
    isLoading?: boolean;
}

const WeeklyCalendar = ({ availableDates, selectedDate, onSelectDate, isLoading }: WeeklyCalendarProps) => {
    const { t } = useTranslation();

    // Next 7 days anchored to the clinic timezone (Asia/Tashkent)
    const weekDays = clinicNext7();

    const isDateAvailable = (date: Dayjs): boolean => {
        const dateStr = date.format('YYYY-MM-DD');
        return availableDates.includes(dateStr);
    };

    const isDateSelected = (date: Dayjs): boolean => {
        if (!selectedDate) return false;
        return date.format('YYYY-MM-DD') === selectedDate;
    };

    const handleDateClick = (date: Dayjs) => {
        if (!isDateAvailable(date)) return;
        onSelectDate(date.format('YYYY-MM-DD'));
    };

    const days = t('weeklyCalendar.days', { returnObjects: true }) as string[];
    const months = t('weeklyCalendar.months', { returnObjects: true }) as string[];

    const getDayName = (date: Dayjs): string => days[date.day()];
    const getMonthName = (date: Dayjs): string => months[date.month()];

    if (isLoading) {
        return (
            <div className="weekly-calendar weekly-calendar--loading">
                {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="day-card day-card--skeleton">
                        <div className="skeleton-line skeleton-line--sm" />
                        <div className="skeleton-line skeleton-line--lg" />
                        <div className="skeleton-line skeleton-line--sm" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="weekly-calendar">
            {weekDays.map((day, index) => {
                const available = isDateAvailable(day);
                const selected = isDateSelected(day);
                const isToday = day.isSame(clinicToday(), 'day');

                return (
                    <button
                        key={index}
                        className={`day-card ${available ? 'available' : 'unavailable'} ${selected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                        onClick={() => handleDateClick(day)}
                        disabled={!available}
                    >
                        <div className="day-name">{getDayName(day)}</div>
                        <div className="day-number">{day.date()}</div>
                        <div className="month-name">{getMonthName(day)}</div>
                    </button>
                );
            })}
        </div>
    );
};

export default WeeklyCalendar;
