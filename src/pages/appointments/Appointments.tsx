import { useState, useEffect } from 'react';
import { Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import './appointments.scss';
import AppointmentsForm from './components/appointmentForm/AppointmentsForm';
import DoctorSelector from './components/selectors/DoctorSelector';
import { type Doctor } from './types/appointment.types';
import Spinner from '../../components/spinner/Spinner';

const Appointments = () => {
    const { t } = useTranslation();
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate initial data loading
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleDoctorSelect = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
    };

    if (isLoading) {
        return (
            <div className='appointments'>
                <div className='container'>
                    <div className='appointments-loading'>
                        <Spinner size='lg' />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='appointments'>
            <div className='container'>
                <h1 className='appointments-title'>{t('appointments.pageTitle')}</h1>
                <div className='appointments-wrapper'>
                    <div className="appointments-wrapper__clinics">
                        <Alert
                            type='info'
                            message={t('appointments.alertMessage')}
                            showIcon
                            style={{ fontSize: "16px", fontWeight: "bold" }}
                        />
                    </div>
                    <div className="appointments-wrapper__doctors">
                        <DoctorSelector
                            selectedDoctorId={selectedDoctor?.id || null}
                            onSelectDoctor={handleDoctorSelect}
                        />
                    </div>
                    <div className="appointments-wrapper__form">
                        <AppointmentsForm selectedDoctor={selectedDoctor} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointments;