import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/buttons/Button';
import { useDoctors } from '@/api/query/useDoctors';
import { doctorsImages } from '../../assets/images/doctors/doctorsImages';
import heroBg from '../../assets/images/otolor-hero.jpg';
import hospitalImage from '../../assets/images/midSection/hospital.jpg';
import './About.scss';

/** Card shape the doctors grid renders, whether from the API or the fallback. */
interface DoctorCard {
  key: string;
  image?: string;
  name: string;
  exp?: number;
  role?: string;
}

/** Two-letter initials for the avatar fallback when a doctor has no photo. */
const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const About = () => {
  const { t } = useTranslation();
  const { data: doctors, isLoading: doctorsLoading } = useDoctors();

  // Static trio kept as a fallback so the section never looks broken
  // (e.g. before any doctor is added in the admin panel, or on API error).
  const fallbackDoctors: DoctorCard[] = [
    { key: 'f0', image: doctorsImages[2]?.src || doctorsImages[0]?.src, name: 'Shoazizov Nadir Nigamatillaevich', exp: 29 },
    { key: 'f1', image: doctorsImages[0]?.src, name: 'Gulyamov Sherzod Bahramjanovich', exp: 23 },
    { key: 'f2', image: doctorsImages[1]?.src, name: 'Muzaffarov Tuygun Akramovich', exp: 19 },
  ];

  // Prefer doctors explicitly flagged featured; otherwise show all live doctors.
  const featured = (doctors ?? []).filter((d) => d.isFeatured);
  const liveDoctors = featured.length > 0 ? featured : (doctors ?? []);

  const displayDoctors: DoctorCard[] =
    liveDoctors.length > 0
      ? liveDoctors.slice(0, 6).map((d) => ({
          key: d._id,
          image: d.avatarUrl,
          name: d.name,
          exp: d.experience,
          role: d.specialization,
        }))
      : fallbackDoctors;

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

          {doctorsLoading && (
            <p className="about-page__doctors-loading">{t('common.loading')}</p>
          )}

          <div className="about-page__doctor-grid">
            {displayDoctors.map((doctor) => (
              <article key={doctor.key} className="about-page__doctor-card">
                <div className="about-page__doctor-photo">
                  {doctor.image ? (
                    <img src={doctor.image} alt={doctor.name} />
                  ) : (
                    <span className="about-page__doctor-initials" aria-hidden="true">
                      {getInitials(doctor.name)}
                    </span>
                  )}
                </div>
                <div className="about-page__doctor-body">
                  <h3>{doctor.name}</h3>
                  {typeof doctor.exp === 'number' && doctor.exp > 0 && (
                    <p className="about-page__doctor-exp">
                      {doctor.exp} {t('aboutPage.stat1Label')}
                    </p>
                  )}
                  <p className="about-page__doctor-role">{doctor.role || t('aboutPage.teamRole')}</p>
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