import { useTranslation } from 'react-i18next';
import partnersBg from '../../../../assets/images/otolor-hero-bg.png';
import moscadaver from '../../../../assets/images/partners/moscadaver.png';
import sokinUyqu from '../../../../assets/images/partners/sokinuyqu.jpg';
import mclinic from '../../../../assets/images/partners/mclinic.png';
import corelMed from '../../../../assets/images/partners/coralmed.jpg';
import bolalarMilliyTib from '../../../../assets/images/partners/bolalarmilliytib.png';
import interaccoustics from '../../../../assets/images/partners/interaccoustics.webp';
import chammed from '../../../../assets/images/partners/chammed.jpg';

interface Partner {
    name: string;
    logo?: string;
}

const partners: Partner[] = [
    { name: 'MosCadever', logo: moscadaver },
    { name: 'SokinUyqu', logo: sokinUyqu },
    { name: 'Mclinic', logo: mclinic },
    { name: 'DAVORIS' },
    { name: 'CorelMed', logo: corelMed },
    { name: 'Bolalar Milliy Tib', logo: bolalarMilliyTib },
    { name: 'MICROTIA'},
    { name: 'Interaccoustics', logo: interaccoustics },
    { name: 'Chammed', logo: chammed },
];

/**
 * Premium partners section with infinite scroll carousel
 */
const Partners = () => {
    const { t } = useTranslation();

    // Duplicate partners for seamless infinite scroll
    const duplicatedPartners = [...partners, ...partners];

    return (
        <div className='w-full'>
            <section
                className="relative w-full overflow-hidden bg-white bg-cover bg-center bg-no-repeat px-0 pb-20 pt-16 "
                style={{ backgroundImage: `url(${partnersBg})` }}
            >

                <div className="container relative z-1">
                    <div className="mx-auto mb-12 max-w-160 text-center">
                        <h2 className="text-[24px] leading-tight font-semibold tracking-[-0.01em] text-[#111827] md:text-[36px] xl:text-[44px]">{t('partners.tag', 'Trusted by Industry Leaders')}</h2>
                    </div>
                </div>

                <div className="relative w-full overflow-hidden py-5">
                    
                    <div className="flex w-max gap-4 motion-safe:animate-[partnersScroll_45s_linear_infinite] md:gap-6 xl:gap-8">
                        {duplicatedPartners.map((partner, index) => (
                            <div key={`${partner.name}-${index}`} className="flex shrink-0 items-center justify-center">
                                <div className="flex h-12.5 w-25 items-center justify-center rounded-2xl bg-[rgb(255,255,255)] px-0 py-0 shadow-[0_4px_16px_rgba(0,0,0,0.04)] md:h-17.5 md:w-35 xl:h-22.5 xl:w-45">
                                    {partner.logo ? (
                                        <img className='max-h-full max-w-full object-cover  opacity-60' src={partner.logo} alt={partner.name} />
                                    ) : (
                                        <span className="whitespace-nowrap text-xs font-medium tracking-[-0.01em] text-[#6b7280] md:text-base xl:text-lg">
                                            {partner.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Partners;
