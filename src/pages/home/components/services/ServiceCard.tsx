import React from 'react';
import './Services.scss';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    variant?: 'default' | 'primary';
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, variant = 'default' }) => {
    return (
        <div className={`service-card ${variant === 'primary' ? 'service-card--primary' : ''}`}>
            <div className="service-card__icon">
                {icon}
            </div>
            <div className="service-card__content">
                <h3 className="service-card__title">{title}</h3>
                <p className="service-card__description">{description}</p>
                <button className="service-card__link">Подробнее</button>
            </div>
        </div>
    );
};

export default ServiceCard;
