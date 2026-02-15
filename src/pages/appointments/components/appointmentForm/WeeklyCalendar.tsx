import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/uz-latn';
import './weeklyCalendar.scss';

interface WeeklyCalendarProps {
    availableDates: string[]; // ISO date strings
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
}

const WeeklyCalendar = ({ availableDates, selectedDate, onSelectDate }: WeeklyCalendarProps) => {
    // Generate next 7 days starting from today
    const getNextWeek = (): Dayjs[] => {
        const days: Dayjs[] = [];
        const today = dayjs();

        for (let i = 0; i < 7; i++) {
            days.push(today.add(i, 'day'));
        }

        return days;
    };

    const weekDays = getNextWeek();

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

    const getDayName = (date: Dayjs): string => {
        const days = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
        return days[date.day()];
    };

    const getMonthName = (date: Dayjs): string => {
        const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
        return months[date.month()];
    };

    return (
        <div className="weekly-calendar">
            {weekDays.map((day, index) => {
                const available = isDateAvailable(day);
                const selected = isDateSelected(day);
                const isToday = day.isSame(dayjs(), 'day');

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
