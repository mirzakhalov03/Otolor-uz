import { type Doctor } from '../types/appointment.types';
import doctor1 from '../../../assets/images/doctors/doctor1.jpg';
import doctor2 from '../../../assets/images/doctors/doctor2.jpg';
import doctor3 from '../../../assets/images/doctors/doctor3.jpg';

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
        name: 'Sherzod Gulyamov',
        specialty: 'ENT Specialist',
        image: doctor1,
        availableDates: generateAvailableDates([1, 2, 3, 4, 5]), // Monday, Wednesday, Friday
        timeSlots: generateTimeSlots(
            generateAvailableDates([1, 2, 3, 4, 5]),
            ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
        )
    },
    {
        id: 2,
        name: "Tuyg'un Muzaffarov",
        specialty: 'Head & Neck Surgeon',
        image: doctor2,
        availableDates: generateAvailableDates([2, 4, 6]), // Tuesday, Thursday, Saturday
        timeSlots: generateTimeSlots(
            generateAvailableDates([2, 4, 6]),
            ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30']
        )
    },
    {
        id: 3,
        name: 'Sherzod Botirov',
        specialty: 'ENT Specialist',
        image: doctor3,
        availableDates: generateAvailableDates([1, 2, 3, 4, 5]), // Monday to Friday
        timeSlots: generateTimeSlots(
            generateAvailableDates([1, 2, 3, 4, 5]),
            ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00']
        )
    },
];
