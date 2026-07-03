import { Modal, Button } from 'antd';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface BookingConfirmation {
  orderNumber: string;
  fullName: string;
  doctorName: string;
  date: string;
  time: string;
}

interface Props {
  open: boolean;
  confirmation: BookingConfirmation | null;
  onClose: () => void;
}

const BookingConfirmationModal = ({ open, confirmation, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} size="large">
          {t('common.close')}
        </Button>,
      ]}
      centered
      className="booking-confirmation-modal"
      width={480}
    >
      {confirmation && (
        <div className="confirmation-content">
          <div className="confirmation-icon">
            <CheckCircle size={64} />
          </div>

          <h2 className="confirmation-title">{t('appointments.modal.title')}</h2>

          <div className="order-number">
            <span className="order-label">{t('appointments.modal.orderNumber')}</span>
            <span className="order-value">{confirmation.orderNumber}</span>
          </div>

          <div className="patient-info">
            <p className="patient-name">
              <strong>{t('appointments.modal.patient')}:</strong> {confirmation.fullName}
            </p>
            <p className="doctor-info">
              <strong>{t('appointments.modal.doctor')}:</strong> {confirmation.doctorName}
            </p>
            <p className="appointment-datetime">
              <strong>{t('appointments.modal.datetime')}:</strong> {confirmation.date} | {confirmation.time}
            </p>
          </div>

          <div className="rules-section">
            <h3 className="rules-title">{t('appointments.modal.rulesTitle')}</h3>
            <ul className="rules-list">
              <li>{t('appointments.modal.rule1')}</li>
              <li>{t('appointments.modal.rule2')}</li>
              <li>{t('appointments.modal.rule3')}</li>
              <li>{t('appointments.modal.rule4')}</li>
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default BookingConfirmationModal;
