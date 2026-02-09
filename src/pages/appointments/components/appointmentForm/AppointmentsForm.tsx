import { useState } from 'react';
import { Input, Button, message } from 'antd';
import { Clock, User, Phone } from 'lucide-react';
import { type Doctor } from '../../types/appointment.types';
import WeeklyCalendar from './WeeklyCalendar';
import './appointmentsForm.scss';

interface AppointmentsFormProps {
  selectedDoctor: Doctor | null;
}

const AppointmentsForm = ({ selectedDoctor }: AppointmentsFormProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get available times for selected date
  const getAvailableTimesForDate = (date: string): string[] => {
    if (!selectedDoctor) return [];
    const slot = selectedDoctor.timeSlots.find(s => s.date === date);
    return slot ? slot.times : [];
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedTime(null); // Reset time selection when date changes
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      message.error('Iltimos, shifokor, sana va vaqtni tanlang');
      return;
    }

    if (!fullName.trim()) {
      message.error('Iltimos, to\'liq ismingizni kiriting');
      return;
    }

    if (!phoneNumber.trim()) {
      message.error('Iltimos, telefon raqamingizni kiriting');
      return;
    }

    if (!age.trim()) {
      message.error('Iltimos, yoshingizni kiriting');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      message.success('Navbat muvaffaqiyatli ro\'yxatdan o\'tdi!');

      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setFullName('');
      setPhoneNumber('');
      setAge('');
    } catch (error) {
      message.error('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <div className="appointments-form">
      {/* Step 2: Date & Time Selection (Side by Side) */}
      <div className="form-section">
        <h2 className="section-title">2. Sana va vaqtni tanlang</h2>
        <div className="date-time-container">
          {/* Left: Calendar */}
          <div className="calendar-section">
            <h3 className="subsection-title">Sana</h3>
            <WeeklyCalendar
              availableDates={selectedDoctor?.availableDates || []}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />
          </div>

          {/* Right: Time Slots */}
          <div className="time-section">
            <h3 className="subsection-title">Mavjud vaqtlar</h3>
            <div className="time-slots">
              {!selectedDoctor ? (
                <div className="empty-state">
                  <p className="text-gray-400">Shifokorni tanlang</p>
                </div>
              ) : !selectedDate ? (
                <div className="empty-state">
                  <p className="text-gray-400">Sanani tanlang</p>
                </div>
              ) : availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    <Clock size={16} />
                    <span>{time}</span>
                  </button>
                ))
              ) : (
                <div className="empty-state">
                  <p className="text-gray-400">Bu sana uchun vaqt mavjud emas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: User Information */}
      <div className="form-section">
        <h2 className="section-title">3. Ma'lumotlaringizni kiriting</h2>
        <div className="user-info-form">
          <div className='flex gap-4 flex-col md:flex-row justify-center'>
            <div className="form-field w-[300px]">
              <label htmlFor="fullName">
                <User size={16} />
                <span>To'liq ism</span>
              </label>
              <Input
                id="fullName"
                placeholder="Familiya Ism Sharif"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                size="large"
              />
            </div>

            <div className="form-field w-[300px]">
              <label htmlFor="phoneNumber">
                <Phone size={16} />
                <span>Telefon raqam</span>
              </label>
              <Input
                id="phoneNumber"
                placeholder="+998 XX XXX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size="large"
              />
            </div>

            <div className="form-field w-[300px]">
              <label htmlFor="age">
                <User size={16} />
                <span>Yosh</span>
              </label>
              <Input
                id="age"
                placeholder="25"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                size="large"
              />
            </div>
          </div>

          <div className='w-[300px] mx-auto mt-4'>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              loading={isSubmitting}
              className="submit-button"
              block
            >
              Ro'yxatdan o'tish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsForm;