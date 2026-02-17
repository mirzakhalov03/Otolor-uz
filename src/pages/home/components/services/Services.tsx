import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import './Services.scss';

// Refined icon components with consistent styling
const EarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

const NoseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const ThroatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

/**
 * Services section with premium card design and green-tinted background
 */
const Services = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const services = [
        {
            icon: <EarIcon />,
            title: t('homeServices.service1Title'),
            description: t('homeServices.learnMore'),
            variant: 'default' as const
        },
        {
            icon: <NoseIcon />,
            title: t('homeServices.service2Title'),
            description: t('homeServices.learnMore'),
            variant: 'primary' as const
        },
        {
            icon: <ThroatIcon />,
            title: t('homeServices.service3Title'),
            description: t('homeServices.learnMore'),
            variant: 'default' as const
        }
    ];

    return (
        <section className="services">
            {/* Background decorations */}
            <div className="services__bg-pattern" />
            <div className="services__bg-accent" />
            
            <div className="services__container container">
                <div className="services__header">
                    <span className="services__tag">{t('homeServices.tag', 'Our Services')}</span>
                    <h2 className="services__title">{t('homeServices.title')}</h2>
                </div>
                
                <div className="services__grid">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={index}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                            variant={service.variant}
                            index={index}
                        />
                    ))}
                </div>
                
                <div className="services__more">
                    <button 
                        className="services__more-btn"
                        onClick={() => navigate('/services')}
                    >
                        {t('homeServices.seeAll')}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Services;
