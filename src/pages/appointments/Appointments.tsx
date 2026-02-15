import { useState, useCallback } from 'react';
import { Alert } from 'antd';
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