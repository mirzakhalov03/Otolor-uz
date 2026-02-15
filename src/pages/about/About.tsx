import { Award, Shield, Microscope, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/buttons/Button';
import { doctorsImages } from '../../assets/images/doctors/doctorsImages';
import heroBg from '../../assets/images/otolor-hero-bg.png';
import './About.scss';

const About = () => {
  const { t } = useTranslation();
  
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-page__hero">
        <img src={heroBg} alt="Otolor Hero" className="about-page__hero-bg" />
        <div className="about-page__hero-content container">
          <h1 className="about-page__hero-title">{t('aboutPage.heroTitle')}</h1>
          <p className="about-page__hero-subtitle">
            {t('aboutPage.heroSubtitle')}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-page__section">
        <div className="container">
          <div className="about-page__grid">
            <div className="about-page__image-wrapper">
              <img src={doctorsImages[0].src} alt="Our Clinic" />
            </div>
            <div className="about-page__content">
              <span className="section-tag">{t('aboutPage.storyTag')}</span>
              <h2 className="section-title">{t('aboutPage.storyTitle')}</h2>
              <p className="section-desc">
                {t('aboutPage.storyDesc1')}
              </p>
              <p className="section-desc">
                {t('aboutPage.storyDesc2')}
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#2DC263]" size={20} />
                  <span className="text-gray-700">{t('aboutPage.storyCheckpoint1')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#2DC263]" size={20} />
                  <span className="text-gray-700">{t('aboutPage.storyCheckpoint2')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-[#2DC263]" size={20} />
                  <span className="text-gray-700">{t('aboutPage.storyCheckpoint3')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="about-page__section about-page__section--gray">
        <div className="container text-center">
          <span className="section-tag">{t('aboutPage.valuesTag')}</span>
          <h2 className="section-title">{t('aboutPage.valuesTitle')}</h2>

          <div className="about-page__values">
            <div className="about-page__values-card">
              <div className="card-icon"><Award /></div>
              <h3 className="card-title">{t('aboutPage.value1Title')}</h3>
              <p className="card-desc">{t('aboutPage.value1Desc')}</p>
            </div>
            <div className="about-page__values-card">
              <div className="card-icon"><Microscope /></div>
              <h3 className="card-title">{t('aboutPage.value2Title')}</h3>
              <p className="card-desc">{t('aboutPage.value2Desc')}</p>
            </div>
            <div className="about-page__values-card">
              <div className="card-icon"><Shield /></div>
              <h3 className="card-title">{t('aboutPage.value3Title')}</h3>
              <p className="card-desc">{t('aboutPage.value3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="about-page__section">
        <div className="container">
          <div className="about-page__stats">
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">{t('aboutPage.stat1Number')}</span>
              <span className="about-page__stats-label">{t('aboutPage.stat1Label')}</span>
            </div>
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">{t('aboutPage.stat2Number')}</span>
              <span className="about-page__stats-label">{t('aboutPage.stat2Label')}</span>
            </div>
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">{t('aboutPage.stat3Number')}</span>
              <span className="about-page__stats-label">{t('aboutPage.stat3Label')}</span>
            </div>
            <div className="about-page__stats-item">
              <span className="about-page__stats-number">{t('aboutPage.stat4Number')}</span>
              <span className="about-page__stats-label">{t('aboutPage.stat4Label')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Highlights Section */}
      <section className="about-page__section about-page__section--gray">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-tag">{t('aboutPage.teamTag')}</span>
            <h2 className="section-title">{t('aboutPage.teamTitle')}</h2>
          </div>

          <div className="about-page__team-grid">
            {doctorsImages.slice(0, 4).map((member, index) => (
              <div key={index} className="about-page__team-member">
                <div className="member-image">
                  <img src={member.src} alt={member.alt} />
                </div>
                <h3 className="member-name">{member.alt || `${t('aboutPage.teamMember')} ${index + 1}`}</h3>
                <p className="member-role">{t('aboutPage.teamRole')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-page__section">
        <div className="container">
          <div className="bg-[#2DC263] rounded-[32px] p-12 text-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">{t('aboutPage.ctaTitle')}</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                {t('aboutPage.ctaDesc')}
              </p>
              <Button
                color="white"
                className="text-[#2DC263] bg-white px-10 py-6 rounded-full font-bold hover:scale-105 transition-all text-lg"
              >
                {t('aboutPage.ctaButton')}
              </Button>
            </div>
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;