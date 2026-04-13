import { useTranslation } from 'react-i18next';
import partnersBg from '../../../../assets/images/otolor-hero-bg.png';

interface Partner {
    name: string;
    logo?: string;
}

const partners: Partner[] = [
    { name: 'MosCadever' },
    { name: 'SokinUyqu' },
    { name: 'Mclinic' },
    { name: 'Davoris' },
    { name: 'CorelMed' },
    { name: 'Bolalar Milliy Tib' },
    { name: 'Men eshityapman' },
    { name: 'Microtia' },
    { name: 'Nuraton' },
    { name: 'Interaccoustics' },
    { name: 'Chammed' },
    { name: 'Archamed' },
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
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-white to-transparent md:w-25 xl:w-37.5" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-linear-to-l from-white to-transparent md:w-25 xl:w-37.5" />
                    
                    <div className="flex w-max gap-4 motion-safe:animate-[partnersScroll_45s_linear_infinite] md:gap-6 xl:gap-8">
                        {duplicatedPartners.map((partner, index) => (
                            <div key={`${partner.name}-${index}`} className="flex shrink-0 items-center justify-center">
                                <div className="flex h-12.5 w-25 items-center justify-center rounded-2xl border border-[rgba(229,231,235,0.5)] bg-[rgba(255,255,255,0.6)] px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-[10px] md:h-17.5 md:w-35 md:px-4 md:py-3 xl:h-22.5 xl:w-45 xl:px-6 xl:py-5">
                                    {partner.logo ? (
                                        <img className='max-h-full max-w-full object-contain grayscale opacity-60' src={partner.logo} alt={partner.name} />
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
