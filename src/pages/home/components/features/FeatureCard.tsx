import React from 'react';
import './Features.scss';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div className="feature-card">
            <div className="feature-card__icon">
                {icon}
            </div>
            <div className="feature-card__content">
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__description">{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
