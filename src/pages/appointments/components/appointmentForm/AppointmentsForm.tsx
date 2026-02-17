import { useState } from 'react';
import { Input, Button, message, Modal } from 'antd';
import { Clock, User, Phone, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type Doctor } from '../../types/appointment.types';
import WeeklyCalendar from './WeeklyCalendar';
import './appointmentsForm.scss';

interface AppointmentsFormProps {
  selectedDoctor: Doctor | null;
}

interface BookingConfirmation {
  queueNumber: number;
  fullName: string;
  doctorName: string;
  date: string;
  time: string;
}

const AppointmentsForm = ({ selectedDoctor }: AppointmentsFormProps) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);

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
      message.error(t('appointments.errorSelectAll', 'Please select a doctor, date, and time'));
      return;
    }

    if (!fullName.trim()) {
      message.error(t('appointments.errorFullName', 'Please enter your full name'));
      return;
    }

    if (!phoneNumber.trim()) {
      message.error(t('appointments.errorPhone', 'Please enter your phone number'));
      return;
    }

    if (!age.trim()) {
      message.error(t('appointments.errorAge', 'Please enter your age'));
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate queue number (in real app, this would come from backend)
      const queueNumber = Math.floor(Math.random() * 50) + 1;

      // Set booking confirmation data
      setBookingConfirmation({
        queueNumber,
        fullName: fullName.trim(),
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
      });

      // Show modal
      setShowModal(true);

      // Reset form
      setSelectedDate(null);
      setSelectedTime(null);
      setFullName('');
      setPhoneNumber('');
      setAge('');
    } catch (error) {
      message.error(t('appointments.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setBookingConfirmation(null);
  };

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <div className="appointments-form">
      {/* Step 2: Date & Time Selection (Side by Side) */}
      <div className="form-section">
        <h2 className="section-title">{t('appointments.step2Title', '2. Select Date & Time')}</h2>
        <div className="date-time-container">
          {/* Left: Calendar */}
          <div className="calendar-section">
            <h3 className="subsection-title">{t('appointments.dateLabel', 'Date')}</h3>
            <WeeklyCalendar
              availableDates={selectedDoctor?.availableDates || []}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
            />
          </div>

          {/* Right: Time Slots */}
          <div className="time-section">
            <h3 className="subsection-title">{t('appointments.availableTimes', 'Available Times')}</h3>
            <div className="time-slots">
              {!selectedDoctor ? (
                <div className="empty-state">
                  <p className="text-gray-400">{t('appointments.selectDoctorFirst', 'Select a doctor')}</p>
                </div>
              ) : !selectedDate ? (
                <div className="empty-state">
                  <p className="text-gray-400">{t('appointments.selectDateFirst', 'Select a date')}</p>
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
                  <p className="text-gray-400">{t('appointments.noTimesAvailable', 'No times available for this date')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: User Information */}
      <div className="form-section">
        <h2 className="section-title">{t('appointments.step3Title', '3. Enter Your Information')}</h2>
        <div className="user-info-form">
          <div className='flex gap-4 flex-col md:flex-row justify-center'>
            <div className="form-field w-[300px]">
              <label htmlFor="fullName">
                <User size={16} />
                <span>{t('appointments.fullName')}</span>
              </label>
              <Input
                id="fullName"
                placeholder={t('appointments.fullNamePlaceholder', 'First Last Name')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                size="large"
              />
            </div>

            <div className="form-field w-[300px]">
              <label htmlFor="phoneNumber">
                <Phone size={16} />
                <span>{t('appointments.phoneNumber')}</span>
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
                <span>{t('appointments.age', 'Age')}</span>
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
              {t('appointments.submitAppointment')}
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        open={showModal}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" type="primary" onClick={handleModalClose} size="large">
            {t('common.close', 'Close')}
          </Button>
        ]}
        centered
        className="booking-confirmation-modal"
        width={480}
      >
        {bookingConfirmation && (
          <div className="confirmation-content">
            <div className="confirmation-icon">
              <CheckCircle size={64} />
            </div>
            
            <h2 className="confirmation-title">
              {t('appointments.modal.title', 'Booking Confirmed!')}
            </h2>
            
            <div className="queue-number">
              <span className="queue-label">{t('appointments.modal.queueNumber', 'Your Queue Number')}</span>
              <span className="queue-value">#{bookingConfirmation.queueNumber}</span>
            </div>
            
            <div className="patient-info">
              <p className="patient-name">
                <strong>{t('appointments.modal.patient', 'Patient')}:</strong> {bookingConfirmation.fullName}
              </p>
              <p className="doctor-info">
                <strong>{t('appointments.modal.doctor', 'Doctor')}:</strong> {bookingConfirmation.doctorName}
              </p>
              <p className="appointment-datetime">
                <strong>{t('appointments.modal.datetime', 'Date & Time')}:</strong> {bookingConfirmation.date} | {bookingConfirmation.time}
              </p>
            </div>
            
            <div className="rules-section">
              <h3 className="rules-title">{t('appointments.modal.rulesTitle', 'Important Guidelines')}</h3>
              <ul className="rules-list">
                <li>{t('appointments.modal.rule1', 'Please arrive 15 minutes before your appointment time')}</li>
                <li>{t('appointments.modal.rule2', 'Bring your ID and any previous medical records')}</li>
                <li>{t('appointments.modal.rule3', 'If you need to cancel, please do so at least 24 hours in advance')}</li>
                <li>{t('appointments.modal.rule4', 'Wear a mask and follow clinic hygiene protocols')}</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsForm;