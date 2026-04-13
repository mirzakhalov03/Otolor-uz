import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/buttons/Button';
import { doctorsImages } from '../../assets/images/doctors/doctorsImages';
import heroBg from '../../assets/images/otolor-hero.jpg';
import hospitalImage from '../../assets/images/midSection/hospital.jpg';
import './About.scss';

const About = () => {
  const { t } = useTranslation();

  const featuredDoctors = [
    {
      image: doctorsImages[2]?.src || doctorsImages[0]?.src,
      name: "Shoazizov Nadir Nigamatillaevich",
      exp: "29",
    },
    {
      image: doctorsImages[0]?.src,
      name: "Gulyamov Sherzod Bahramjanovich",
      exp: "23",
    },
    {
      image: doctorsImages[1]?.src,
      name: "Muzaffarov Tuygun Akramovich",
      exp: "19",
    },
  ];
  
  return (
    <div className="about-page pt-25">
      <section className="about-page__intro section-spacing">
        <div className="container about-page__intro-grid">
          <div className="about-page__intro-copy">
            <h1>{t('aboutPage.storyTag')}</h1>
            <h2>{t('aboutPage.storyTitle')}</h2>
            <p>{t('aboutPage.storyDesc1')}</p>
          </div>

          <div className="about-page__video-card">
            <iframe
              src="https://www.youtube.com/embed/YbkYgJkxDDg?si=2NT0SgRpGTbuCz5U"
              title="Otolor video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="about-page__details section-spacing">
        <div className="container about-page__details-grid">
          <div className="about-page__photo-collage" aria-hidden="true">
            <div className="about-page__photo about-page__photo--tall">
              <img src={heroBg} alt="" />
            </div>

            <div className="about-page__photo about-page__photo--wide">
              <img src={hospitalImage} alt="" />
            </div>

            <div className="about-page__photo about-page__photo--small">
              <img src={doctorsImages[3]?.src || doctorsImages[4]?.src} alt="" />
            </div>

            <div className="about-page__photo about-page__photo--small">
              <img src={doctorsImages[5]?.src || doctorsImages[6]?.src} alt="" />
            </div>
          </div>

          <article className="about-page__details-copy">
            <h3>{t('aboutPage.storyTitle')}</h3>
            <p>{t('aboutPage.storyDesc1')}</p>
            <p>{t('aboutPage.storyDesc2')}</p>
            <p>{t('aboutPage.heroSubtitle')}</p>
          </article>
        </div>
      </section>

      <section className="about-page__doctors section-spacing">
        <div className="container">
          <h2 className="about-page__doctors-title">
            {t('aboutPage.teamTitle')}
          </h2>

          <div className="about-page__doctor-grid">
            {featuredDoctors.map((doctor) => (
              <article key={doctor.name} className="about-page__doctor-card">
                <div className="about-page__doctor-photo">
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <div className="about-page__doctor-body">
                  <h3>{doctor.name}</h3>
                  <p className="about-page__doctor-exp">
                    {doctor.exp} {t('aboutPage.stat1Label')}
                  </p>
                  <p className="about-page__doctor-role">{t('aboutPage.teamRole')}</p>
                  <div className="about-page__doctor-actions">
                    <Link to="/appointments" aria-label={t('aboutPage.ctaButton')}>
                      <Button color="white" className="about-page__doctor-btn about-page__doctor-btn--solid">
                        {t('aboutPage.ctaButton')}
                      </Button>
                    </Link>
                    <Link to="/services" aria-label={t('aboutPage.valuesTitle')}>
                      <Button color="white" className="about-page__doctor-btn">
                        {t('aboutPage.valuesTitle')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;