import React from 'react';
import { useTranslation } from 'react-i18next';
import './Services.scss';

interface ServiceCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    variant?: 'default' | 'primary';
    index?: number;
}

/**
 * Premium service card with accent styling and hover effects
 */
const ServiceCard: React.FC<ServiceCardProps> = ({ 
    title, 
    description, 
    icon, 
    variant = 'default',
    index = 0 
}) => {
    const { t } = useTranslation();
    
    return (
        <div 
            className={`service-card ${variant === 'primary' ? 'service-card--primary' : ''}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="service-card__accent" />
            <div className="service-card__icon">
                {icon}
            </div>
            <div className="service-card__content">
                <h3 className="service-card__title">{title}</h3>
                <p className="service-card__description">{description}</p>
                <button className="service-card__link">
                    {t('homeServices.learnMore', 'Learn More')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
