import React from 'react';
import './Features.scss';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    index?: number;
}

/**
 * Premium feature card with accent bar and hover effects
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index = 0 }) => {
    return (
        <div 
            className="feature-card"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="feature-card__accent" />
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
