import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock3, Cpu, Users } from 'lucide-react';
import heroBg from '../../../../assets/images/otolor-hero.jpg';
import heroImageMob from '../../../../assets/images/otolor-hero(mob).jpg';

/**
 * Premium Hero section matching modern European clinic aesthetic
 */
const Hero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    {
      icon: <Clock3 size={24} strokeWidth={1.75} />,
      value: t('hero.stat1Value', '20+ Years'),
      label: t('hero.stat1Label', 'Clinical Excellence')
    },
    {
      icon: <Users size={24} strokeWidth={1.75} />,
      value: t('hero.stat2Value', '12,000+'),
      label: t('hero.stat2Label', 'Happy Patients')
    },
    {
      icon: <Cpu size={24} strokeWidth={1.75} />,
      value: t('hero.stat3Value', 'Advanced'),
      label: t('hero.stat3Label', 'German Tech')
    }
  ];

  return (
    <section
      className='relative flex min-h-screen w-full items-center overflow-hidden bg-[#f5f5f0] px-0 pb-24 pt-20 md:pt-40'
    >
      <div
        className='pointer-events-none absolute inset-0 z-0 hidden md:block'
        style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      />
      <div className='pointer-events-none absolute inset-0 z-1 hidden md:block bg-[linear-gradient(to_bottom,#f5f5f0_0%,rgba(245,245,240,0.92)_8%,rgba(245,245,240,0.7)_16%,rgba(245,245,240,0.3)_26%,transparent_38%,transparent_62%,rgba(245,245,240,0.3)_74%,rgba(245,245,240,0.7)_84%,rgba(245,245,240,0.92)_92%,#f5f5f0_100%)]' />
      <div className='pointer-events-none absolute -left-25 bottom-[10%] z-0 h-125 w-125 rounded-full bg-[#86efad51] blur-[100px] md:h-62.5 md:w-62.5' />

      <div className='container relative z-10 w-full'>
        <img
          src={heroImageMob}
          alt={t('hero.headlineAccent', 'Otolor')}
          className='mb-6 block h-auto w-full rounded-2xl object-cover md:hidden'
        />

        <div className='grid items-center md:grid-cols-2'>
          <div className='mx-auto flex w-[1/3] max-w-140 flex-col items-center sm:items-start lg:justify-left '>

            <h1 className='mb-6 text-center md:text-left text-[38px] leading-[1.1] font-semibold tracking-[-0.02em] text-[#111827] md:text-[48px] xl:text-[64px]'>
              <em className='text-[#1a4d2e]'>{t('hero.headlineAccent', 'Otolor')}</em> - <br />{t('hero.headlineRest', ' - Advanced ENT care')}
            </h1>

            <div className='mb-12 flex w-[1/3] gap-4 md:flex-row'>
              <button
                onClick={() => navigate('/appointments')}
                className='inline-flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-full border-0 bg-[linear-gradient(135deg,#1a4d2e_0%,#2e7d32_100%)] px-6 md:px-8  font-semibold text-white shadow-[0_10px_30px_rgba(26,77,46,0.3)]  transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(26,77,46,0.4)] md:w-auto'
              >
                {t('hero.bookAppointment', 'Book Your Consultation')}
                <ArrowRight size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() => navigate('/services')}
                className='cursor-pointer border-0 bg-transparent px-2 py-4 text-base font-medium text-[#374151] transition-colors duration-300 hover:text-[#1a4d2e]'
              >
                {t('hero.ourServices', 'Our Services')}
              </button>
            </div>

            <div className='flex gap-2 md:gap-4 border-t border-[#e5e7eb] pt-6 md:flex-row '>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className='flex items-center justify-center gap-3 border-b border-[#e5e7eb] pb-4 last:border-b-0 md:w-auto md:border-b-0 md:border-r md:px-8 md:pb-0 md:last:border-r-0'
                >
                  <div className='flex h-11 w-11 items-center justify-center rounded-md bg-[rgba(26,77,46,0.08)] text-[#1a4d2e]'>
                    {stat.icon}
                  </div>
                  <div className='flex flex-col text-left'>
                    <span className='text-lg leading-[1.2] font-bold text-[#111827]'>{stat.value}</span>
                    <span className='text-sm text-[#6b7280]'>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero