import { useState, useEffect } from 'react';
import { Input, Button, Modal } from 'antd';
import { Clock, User, Phone, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type Doctor, type FieldError } from '../../types/appointment.types';
import { useAvailableDates, useAvailableTimeSlots, useBookAppointment } from '@/api/query/useAppointments';
import WeeklyCalendar from './WeeklyCalendar';
import './appointmentsForm.scss';
import axios from 'axios';

interface AppointmentsFormProps {
  selectedDoctor: Doctor | null;
}

interface BookingConfirmation {
  orderNumber: string;
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
  const [showModal, setShowModal] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const doctorId = selectedDoctor?._id || null;

  // Fetch available dates when doctor is selected
  const {
    data: availableDates = [],
    isLoading: isDatesLoading,
  } = useAvailableDates(doctorId);

  // Fetch available time slots when date is selected
  const {
    data: availableTimeSlots = [],
    isLoading: isTimeSlotsLoading,
  } = useAvailableTimeSlots(doctorId, selectedDate);

  // Booking mutation
  const bookMutation = useBookAppointment();

  // Reset date & time when doctor changes
  useEffect(() => {
    setSelectedDate(null);
    setSelectedTime(null);
    setFieldErrors([]);
    setApiError(null);
  }, [doctorId]);

  // Reset time when date changes
  useEffect(() => {
    setSelectedTime(null);
  }, [selectedDate]);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setFieldErrors([]);
    setApiError(null);
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    setSelectedTime(time);
    setFieldErrors([]);
    setApiError(null);
  };

  // Get field-specific error message
  const getFieldError = (fieldName: string): string | null => {
    const err = fieldErrors.find(e => e.field === fieldName);
    return err ? err.message : null;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setFieldErrors([]);
    setApiError(null);

    // Client-side validation
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setApiError(t('appointments.errorSelectAll', 'Please select a doctor, date, and time'));
      return;
    }

    if (!fullName.trim()) {
      setFieldErrors([{ field: 'fullName', message: t('appointments.errorFullName', 'Please enter your full name') }]);
      return;
    }

    if (!phoneNumber.trim()) {
      setFieldErrors([{ field: 'phoneNumber', message: t('appointments.errorPhone', 'Please enter your phone number') }]);
      return;
    }

    if (!age.trim()) {
      setFieldErrors([{ field: 'age', message: t('appointments.errorAge', 'Please enter your age') }]);
      return;
    }

    bookMutation.mutate(
      {
        doctorId: selectedDoctor._id,
        fullName: fullName.trim(),
        age: parseInt(age, 10),
        phoneNumber: phoneNumber.trim(),
        selectedDate,
        selectedTime,
      },
      {
        onSuccess: (appointment) => {
          // Set booking confirmation data with the real orderNumber
          setBookingConfirmation({
            orderNumber: appointment.orderNumber,
            fullName: appointment.fullName,
            doctorName: appointment.doctorId.name,
            date: appointment.preferredDate,
            time: appointment.preferredTime,
          });

          // Show modal
          setShowModal(true);

          // Reset form
          setSelectedDate(null);
          setSelectedTime(null);
          setFullName('');
          setPhoneNumber('');
          setAge('');
          setFieldErrors([]);
          setApiError(null);
        },
        onError: (error) => {
          if (axios.isAxiosError(error) && error.response?.data) {
            const responseData = error.response.data;

            // Field-level validation errors
            if (responseData.errors && Array.isArray(responseData.errors)) {
              setFieldErrors(responseData.errors);
            } else if (responseData.message) {
              setApiError(responseData.message);
            } else {
              setApiError(t('appointments.error', 'Something went wrong. Please try again.'));
            }
          } else {
            setApiError(t('appointments.error', 'Something went wrong. Please try again.'));
          }
        },
      }
    );
  };

  const handleModalClose = () => {
    setShowModal(false);
    setBookingConfirmation(null);
  };

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
              availableDates={availableDates}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              isLoading={isDatesLoading && !!doctorId}
            />
            {!doctorId && (
              <p className="hint-text">{t('appointments.selectDoctorFirst', 'Select a doctor to see available dates')}</p>
            )}
          </div>

          {/* Right: Time Slots */}
          <div className="time-section">
            <h3 className="subsection-title">{t('appointments.availableTimes', 'Available Times')}</h3>
            <div className="time-slots">
              {!doctorId ? (
                <div className="empty-state">
                  <p>{t('appointments.selectDoctorFirst', 'Select a doctor')}</p>
                </div>
              ) : !selectedDate ? (
                <div className="empty-state">
                  <p>{t('appointments.selectDateFirst', 'Select a date')}</p>
                </div>
              ) : isTimeSlotsLoading ? (
                <div className="empty-state">
                  <Loader2 className="time-slots__spinner" size={24} />
                  <p>{t('appointments.loadingTimes', 'Loading times...')}</p>
                </div>
              ) : availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((time) => (
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
                  <p>{t('appointments.noTimesAvailable', 'No times available for this date')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: User Information */}
      <div className="form-section">
        <h2 className="section-title">{t('appointments.step3Title', '3. Enter Your Information')}</h2>

        {/* API-level error message */}
        {apiError && (
          <div className="api-error">
            <AlertCircle size={18} />
            <span>{apiError}</span>
          </div>
        )}

        <div className="user-info-form">
          <div className="user-info-form__fields">
            <div className={`form-field ${getFieldError('fullName') ? 'form-field--error' : ''}`}>
              <label htmlFor="fullName">
                <User size={16} />
                <span>{t('appointments.fullName', 'Full Name')}</span>
              </label>
              <Input
                id="fullName"
                placeholder={t('appointments.fullNamePlaceholder', 'First Last Name')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                size="large"
                status={getFieldError('fullName') ? 'error' : undefined}
              />
              {getFieldError('fullName') && (
                <span className="field-error">{getFieldError('fullName')}</span>
              )}
            </div>

            <div className={`form-field ${getFieldError('phoneNumber') ? 'form-field--error' : ''}`}>
              <label htmlFor="phoneNumber">
                <Phone size={16} />
                <span>{t('appointments.phoneNumber', 'Phone Number')}</span>
              </label>
              <Input
                id="phoneNumber"
                placeholder="+998 XX XXX XX XX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                size="large"
                status={getFieldError('phoneNumber') ? 'error' : undefined}
              />
              {getFieldError('phoneNumber') && (
                <span className="field-error">{getFieldError('phoneNumber')}</span>
              )}
            </div>

            <div className={`form-field ${getFieldError('age') ? 'form-field--error' : ''}`}>
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
                status={getFieldError('age') ? 'error' : undefined}
              />
              {getFieldError('age') && (
                <span className="field-error">{getFieldError('age')}</span>
              )}
            </div>
          </div>

          <div className="user-info-form__submit">
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              loading={bookMutation.isPending}
              className="submit-button"
              block
            >
              {t('appointments.submitAppointment', 'Book Appointment')}
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
            
            <div className="order-number">
              <span className="order-label">{t('appointments.modal.orderNumber', 'Your Order Number')}</span>
              <span className="order-value">{bookingConfirmation.orderNumber}</span>
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