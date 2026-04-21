import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import './appointments.scss';
import AppointmentsForm from './components/appointmentForm/AppointmentsForm';
import DoctorSelector from './components/selectors/DoctorSelector';
import { type Doctor } from './types/appointment.types';


const Appointments = () => {
    const { t } = useTranslation();
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const handleDoctorSelect = useCallback((doctor: Doctor) => {
        setSelectedDoctor(doctor);
    }, []);

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
                    
                </div>
                
                {/* Main Content */}
                <div className='appointments__content'>
                    <div className='appointments__card'>
                        <div className="appointments__doctors">
                            <DoctorSelector
                                selectedDoctorId={selectedDoctor?._id || null}
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