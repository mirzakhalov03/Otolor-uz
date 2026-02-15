export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    image: string;
    availableDates: string[]; // ISO date strings
    timeSlots: TimeSlot[];
}

export interface TimeSlot {
    date: string; // ISO date string
    times: string[]; // e.g., ["09:00", "10:00", "11:00"]
}

export interface AppointmentFormData {
    doctorId: number | null;
    selectedDate: string | null;
    selectedTime: string | null;
    fullName: string;
    phoneNumber: string;
    age: string;
}

export interface BookingStep {
    step: 1 | 2 | 3 | 4;
    completed: boolean;
}
