import { type Doctor } from '../types/appointment.types';

// Helper function to generate dates for the next 30 days
const generateAvailableDates = (daysOfWeek: number[]): string[] => {
    const dates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Check if the day of week is in the available days
        if (daysOfWeek.includes(date.getDay())) {
            dates.push(date.toISOString().split('T')[0]);
        }
    }

    return dates;
};

// Helper function to generate time slots for specific dates
const generateTimeSlots = (dates: string[], times: string[]) => {
    return dates.map(date => ({
        date,
        times: [...times]
    }));
};

export const mockDoctors: Doctor[] = [
    {
        id: 1,
        name: 'Dr. Alisher Karimov',
        specialty: 'Otorinolaringolog',
        image: 'https://randomuser.me/api/portraits/men/32.jpg',
        availableDates: generateAvailableDates([1, 3, 5]), // Monday, Wednesday, Friday
        timeSlots: generateTimeSlots(
            generateAvailableDates([1, 3, 5]),
            ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
        )
    },
    {
        id: 2,
        name: 'Dr. Dilnoza Rashidova',
        specialty: 'Otorinolaringolog',
        image: 'https://randomuser.me/api/portraits/women/44.jpg',
        availableDates: generateAvailableDates([2, 4, 6]), // Tuesday, Thursday, Saturday
        timeSlots: generateTimeSlots(
            generateAvailableDates([2, 4, 6]),
            ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30']
        )
    },
    {
        id: 3,
        name: 'Dr. Sardor Yusupov',
        specialty: 'Otorinolaringolog',
        image: 'https://randomuser.me/api/portraits/men/68.jpg',
        availableDates: generateAvailableDates([1, 2, 3, 4, 5]), // Monday to Friday
        timeSlots: generateTimeSlots(
            generateAvailableDates([1, 2, 3, 4, 5]),
            ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00']
        )
    },
];
