import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './appointments.scss';
import AppointmentsForm from './components/appointmentForm/AppointmentsForm';
import DoctorSelector from './components/selectors/DoctorSelector';
import { type Doctor } from './types/appointment.types';

// Icons
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Appointments = () => {
    const { t } = useTranslation();
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const handleDoctorSelect = useCallback((doctor: Doctor) => {
        setSelectedDoctor(doctor);
    }, []);

    const stats = [
        {
            icon: <CalendarIcon />,
            value: t('appointments.stat1Value', '24/7'),
            label: t('appointments.stat1Label', 'Online Booking')
        },
        {
            icon: <ClockIcon />,
            value: t('appointments.stat2Value', '15 min'),
            label: t('appointments.stat2Label', 'Response Time')
        },
        {
            icon: <CheckIcon />,
            value: t('appointments.stat3Value', '100%'),
            label: t('appointments.stat3Label', 'Confirmed')
        }
    ];

    return (
        <section className='appointments'>
            {/* Background glows */}
            <div className='appointments__glow appointments__glow--1' />
            <div className='appointments__glow appointments__glow--2' />
            
            <div className='appointments__container container'>
                {/* Header Section */}
                <div className='appointments__header'>
                    <span className='appointments__tag'>{t('appointments.tag', 'BOOK YOUR VISIT')}</span>
                    <h1 className='appointments__title'>
                        {t('appointments.titlePart1', 'Schedule Your')} <em>{t('appointments.titleAccent', 'Consultation')}</em>
                    </h1>
                    <p className='appointments__subtitle'>
                        {t('appointments.subtitle', 'Book an appointment with our expert ENT specialists. Quick, easy, and convenient online booking.')}
                    </p>
                    
                    {/* Stats row */}
                    <div className='appointments__stats'>
                        {stats.map((stat, index) => (
                            <div key={index} className='appointments__stat'>
                                <div className='appointments__stat-icon'>{stat.icon}</div>
                                <div className='appointments__stat-content'>
                                    <span className='appointments__stat-value'>{stat.value}</span>
                                    <span className='appointments__stat-label'>{stat.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Main Content */}
                <div className='appointments__content'>
                    <div className='appointments__card'>
                        <div className="appointments__doctors">
                            <DoctorSelector
                                selectedDoctorId={selectedDoctor?.id || null}
                                onSelectDoctor={handleDoctorSelect}
                            />
                        </div>
                        <div className="appointments__form">
                            <AppointmentsForm selectedDoctor={selectedDoctor} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Appointments;