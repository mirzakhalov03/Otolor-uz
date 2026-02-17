import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ImageCarousel from '../../../../components/carousel/ImageCarousel';
import './Hero.scss';

// Stats icons
const ExperienceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PatientsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TechIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * Premium Hero section matching modern European clinic aesthetic
 */
const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    {
      icon: <ExperienceIcon />,
      value: t('hero.stat1Value', '15+ Years'),
      label: t('hero.stat1Label', 'Clinical Excellence')
    },
    {
      icon: <PatientsIcon />,
      value: t('hero.stat2Value', '12,000+'),
      label: t('hero.stat2Label', 'Happy Patients')
    },
    {
      icon: <TechIcon />,
      value: t('hero.stat3Value', 'Advanced'),
      label: t('hero.stat3Label', 'German Tech')
    }
  ];

  return (
    <section className='hero'>
      {/* Soft gradient glows */}
      <div className='hero__glow hero__glow--2' />
      
      <div className='hero__container container'>
        <div className='hero__grid'>
          {/* Left content */}
          <div className="hero__content">
            <span className='hero__tag'>{t('hero.tag', 'PREMIUM ENT CARE')}</span>
            
            <h1 className='hero__headline'>
              <em>{t('hero.headlineAccent', 'Otolor')}</em>{t('hero.headlineRest', ' - Advanced ENT care')}
            </h1>
            
            <p className='hero__description'>
              {t('hero.description')} {t('hero.descriptionLine2')} {t('hero.descriptionLine3')}
            </p>
            
            <div className='hero__actions'>
              <button 
                onClick={() => navigate('/appointments')} 
                className='hero__btn hero__btn--primary'
              >
                {t('hero.bookAppointment', 'Book Your Consultation')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button 
                onClick={() => navigate('/services')}
                className='hero__btn hero__btn--text'
              >
                {t('hero.ourServices', 'Our Services')}
              </button>
            </div>
            
            {/* Stats row */}
            <div className='hero__stats'>
              {stats.map((stat, index) => (
                <div key={index} className='hero__stat'>
                  <div className='hero__stat-icon'>{stat.icon}</div>
                  <div className='hero__stat-content'>
                    <span className='hero__stat-value'>{stat.value}</span>
                    <span className='hero__stat-label'>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right - Doctor card */}
          <div className="hero__visual">
            <div className='hero__doctor-card'>
              <div className='hero__doctor-circle' />
              <ImageCarousel autoPlayInterval={5000} showDoctorInfo />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero