import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../../../components/buttons/Button';
import ImageCarousel from '../../../../components/carousel/ImageCarousel';
import './Hero.scss';



const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className='hero'>
      <div className='hero-content container'>
        <div className='hero-wrapper flex flex-col md:flex-row'>
          <div className="hero-wrapper__left">
            <div className='mt-[60px]'>
              <h1 className='hero-headline'>
                <span>{t('hero.title')}</span>
                <br />
                {t('hero.subtitle')}
              </h1>
              <p>{t('hero.description')} <br /> {t('hero.descriptionLine2')} <br /> {t('hero.descriptionLine3')}</p>
              <Button onClick={() => navigate('/appointments')}  className='hero-button'>{t('hero.bookAppointment')}</Button>
            </div>
          </div>
          <div className="hero-wrapper__right">
            <ImageCarousel autoPlayInterval={5000} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero