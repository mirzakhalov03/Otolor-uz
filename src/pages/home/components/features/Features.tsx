import { useTranslation } from 'react-i18next';
import FeatureCard from './FeatureCard';
import './Features.scss';

// Icon components - you can replace these with your preferred icon library (lucide-react, react-icons, etc.)
const StethoscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const MicroscopeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Features = () => {
    const { t } = useTranslation();
    
    const features = [
        {
            icon: <StethoscopeIcon />,
            title: t('features.feature1Title'),
            description: t('features.feature1Description')
        },
        {
            icon: <MicroscopeIcon />,
            title: t('features.feature2Title'),
            description: t('features.feature2Description')
        },
        {
            icon: <CheckIcon />,
            title: t('features.feature3Title'),
            description: t('features.feature3Description')
        }
    ];

    return (
        <section className="features">
            <div className="features__container container">
                <h2 className="features__title">{t('features.title')}</h2>
                <div className="features__grid">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;