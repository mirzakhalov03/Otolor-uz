import { useTranslation } from 'react-i18next';
import './AboutUs.scss';

/**
 * About Us section with editorial layout and premium stat cards
 */
const AboutUs = () => {
    const { t } = useTranslation();
    
    const stats = [
        {
            number: t('homeAbout.stat1Number'),
            label: t('homeAbout.stat1Label')
        },
        {
            number: t('homeAbout.stat2Number'),
            label: t('homeAbout.stat2Label')
        },
        {
            number: t('homeAbout.stat3Number'),
            label: t('homeAbout.stat3Label')
        }
    ];
    
    return (
        <section className="about-us">
            {/* Decorative elements */}
            <div className="about-us__decoration about-us__decoration--1" />
            <div className="about-us__decoration about-us__decoration--2" />
            
            <div className="about-us__container container">
                <div className="about-us__content">
                    <span className="about-us__tag">
                        {t('homeAbout.tag', 'About Our Clinic')}
                    </span>
                    <h2 className="about-us__title">{t('homeAbout.title')}</h2>
                    <div className="about-us__text">
                        <p className="about-us__description">
                            {t('homeAbout.description1')}
                        </p>
                        <p className="about-us__description">
                            {t('homeAbout.description2')}
                        </p>
                    </div>
                    
                    <div className="about-us__stats">
                        {stats.map((stat, index) => (
                            <div 
                                key={index} 
                                className="about-us__stat"
                                style={{ animationDelay: `${index * 100 + 200}ms` }}
                            >
                                <div className="about-us__stat-number">{stat.number}</div>
                                <div className="about-us__stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
