import Button from '../../../../components/buttons/Button';
import ImageCarousel from '../../../../components/carousel/ImageCarousel';
import './Hero.scss';



const Hero = () => {

  return (
    <div className='hero'>
        <div className='hero-content container'>
            <div className='hero-wrapper'>
              <div className="hero-wrapper__left">
                <div className='mt-[60px]'>
                    <h1 className='hero-headline'>
                    <span>OTOLOR</span>
                    <br />
                    Advanced ENT care for adults and children
                  </h1>
                  <p>Tuzalish shu yerdan boshlanadi. <br /> Samarali davo olish - to'g'ri tashxis qo'yishga bog'liq. <br /> Mutaxassislarimiz eng murakkab tibbiy muammolarni <br /> aniqlaydilar va davolashadilar.</p>
                  <Button className='hero-button'>Book an appointment</Button>
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