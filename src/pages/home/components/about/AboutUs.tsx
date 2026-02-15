import { useTranslation } from 'react-i18next';
import './AboutUs.scss';

const AboutUs = () => {
    const { t } = useTranslation();
    
    return (
        <section className="about-us">
            <div className="about-us__container container">
                <div className="about-us__content">
                    <h2 className="about-us__title">{t('homeAbout.title')}</h2>
                    <p className="about-us__description">
                        {t('homeAbout.description1')}
                    </p>
                    <p className="about-us__description">
                        {t('homeAbout.description2')}
                    </p>
                    <div className="about-us__stats">
                        <div className="about-us__stat">
                            <div className="about-us__stat-number">{t('homeAbout.stat1Number')}</div>
                            <div className="about-us__stat-label">{t('homeAbout.stat1Label')}</div>
                        </div>
                        <div className="about-us__stat">
                            <div className="about-us__stat-number">{t('homeAbout.stat2Number')}</div>
                            <div className="about-us__stat-label">{t('homeAbout.stat2Label')}</div>
                        </div>
                        <div className="about-us__stat">
                            <div className="about-us__stat-number">{t('homeAbout.stat3Number')}</div>
                            <div className="about-us__stat-label">{t('homeAbout.stat3Label')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
