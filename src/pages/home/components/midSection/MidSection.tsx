import { useTranslation } from 'react-i18next';
import './MidSection.scss';
import ImageCarousel from '../../../../components/carousel/ImageCarousel';

// Import images
import hospitalImage from '../../../../assets/images/midSection/hospital.jpg';
import academyImage from '../../../../assets/images/midSection/academy.jpg';

interface PillarItem {
    text: string;
}

interface PillarProps {
    title: string;
    description?: string;
    items?: PillarItem[];
    image?: string;
}

interface MidSectionProps {
    hospitalData?: PillarProps;
    academyData?: PillarProps;
    carouselAutoPlayInterval?: number;
}

/**
 * Mid Section component highlighting three core pillars:
 * - Otolor Hospital (left)
 * - Otolor Team carousel (center)
 * - Otolor Academy (right)
 */
const MidSection = ({ 
    hospitalData, 
    academyData,
    carouselAutoPlayInterval = 4000 
}: MidSectionProps) => {
    const { t } = useTranslation();
    
    // Default data from translations if not provided via props
    const hospital = hospitalData || {
        title: t('midSection.hospital.title', 'Otolor Hospital'),
        description: t('midSection.hospital.description'),
        image: hospitalImage,
        items: [
            { text: t('midSection.hospital.item1') },
            { text: t('midSection.hospital.item2') },
            { text: t('midSection.hospital.item3') }
        ]
    };
    
    const academy = academyData || {
        title: t('midSection.academy.title', 'Otolor Academy'),
        description: t('midSection.academy.description'),
        image: academyImage,
        items: [
            { text: t('midSection.academy.item1') },
            { text: t('midSection.academy.item2') },
            { text: t('midSection.academy.item3') }
        ]
    };

    return (
        <section className="mid-section relative w-full overflow-hidden bg-[linear-gradient(180deg,#f5f5f0_0%,#f9f7f2_30%,#f3ede0_70%,#f5f5f0_100%)] py-12 md:py-10 lg:py-10 xl:py-14">
            {/* Decorative elements */}
            <div className="mid-section__decoration mid-section__decoration--1" />
            <div className="mid-section__decoration mid-section__decoration--2" />
            <div className="mid-section__decoration mid-section__decoration--3" />
            <div className="mid-section__glow mid-section__glow--1" />
            <div className="mid-section__glow mid-section__glow--2" />
            
            {/* Section Header */}
            <div className="mid-section__header relative z-1 mx-auto mb-12 max-w-175 px-4 text-center lg:mb-16">
                <span className="mid-section__tag mb-2 inline-block rounded-full border border-[rgba(26,77,46,0.2)] bg-[rgba(26,77,46,0.08)] px-4 py-1 text-xs font-semibold tracking-[0.08em] uppercase text-[#1a4d2e]">{t('midSection.tag', 'Our Foundation')}</span>
                <h2 className="mid-section__title text-[28px] leading-tight font-semibold tracking-[-0.01em] text-[#111827] md:text-[34px] lg:text-[40px] xl:text-[42px]">{t('midSection.title', 'The Three Pillars of Otolor')}</h2>
            </div>
            
            <div className="mid-section__container container relative z-1 grid items-stretch gap-8 px-4 md:max-w-105 md:grid-cols-1 lg:max-w-full lg:grid-cols-2 xl:grid-cols-[1fr_1.2fr_1fr]">
                {/* Hospital Pillar - Left */}
                <div className="mid-section__pillar mid-section__pillar--hospital flex flex-col">
                    <div className="pillar-image-card flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(212,184,150,0.3)] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.08)] transition duration-300 hover:-translate-y-1.5">
                        <div className="pillar-image-card__image pillar-image-card__image--cover h-55 w-full overflow-hidden bg-[linear-gradient(135deg,#f3ede0_0%,#eaddcb_100%)] sm:h-60 lg:h-70">
                            <img className='h-full w-full object-cover transition duration-500' src={hospital.image || hospitalImage} alt={hospital.title} />
                        </div>
                        <div className="pillar-image-card__content flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                            <h3 className="pillar-image-card__title mb-2 text-xl leading-tight font-bold text-[#111827] sm:text-2xl">{hospital.title}</h3>
                            {hospital.description && (
                                <p className="pillar-image-card__description mb-4 text-sm leading-6 text-[#6b7280]">{hospital.description}</p>
                            )}
                            <ul className="pillar-image-card__list mt-auto flex list-none flex-col gap-2 p-0">
                                {hospital.items?.map((item, index) => (
                                    <li key={index} className="pillar-image-card__list-item flex items-start gap-2 text-sm leading-6 text-[#374151]">
                                        <span className="pillar-image-card__bullet mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[rgba(26,77,46,0.1)] text-[#1a4d2e]">
                                            <CheckIcon />
                                        </span>
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Team Carousel - Center */}
                <div className="mid-section__pillar mid-section__pillar--team flex flex-col lg:order-0">
                    <div className="team-carousel-wrapper flex h-full items-stretch justify-center">
                        <ImageCarousel 
                            autoPlayInterval={carouselAutoPlayInterval} 
                            showDoctorInfo={true}
                            height={460}
                        />
                    </div>
                </div>

                {/* Academy Pillar - Right */}
                <div className="mid-section__pillar mid-section__pillar--academy flex flex-col">
                    <div className="pillar-image-card flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(212,184,150,0.3)] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.08)] transition duration-300 hover:-translate-y-1.5">
                        <div className="pillar-image-card__image pillar-image-card__image--contain flex h-55 w-full items-center justify-center bg-white p-4 sm:h-60 lg:h-70">
                            <img className='h-auto max-h-[85%] w-auto max-w-[85%] object-contain drop-shadow-[0_4px_12px_rgba(26,77,46,0.15)] transition duration-300 hover:scale-[1.03]' src={academy.image || academyImage} alt={academy.title} />
                        </div>
                        <div className="pillar-image-card__content flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                            <h3 className="pillar-image-card__title mb-2 text-xl leading-tight font-bold text-[#111827] sm:text-2xl">{academy.title}</h3>
                            {academy.description && (
                                <p className="pillar-image-card__description mb-4 text-sm leading-6 text-[#6b7280]">{academy.description}</p>
                            )}
                            <ul className="pillar-image-card__list mt-auto flex list-none flex-col gap-2 p-0">
                                {academy.items?.map((item, index) => (
                                    <li key={index} className="pillar-image-card__list-item flex items-start gap-2 text-sm leading-6 text-[#374151]">
                                        <span className="pillar-image-card__bullet mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-[rgba(26,77,46,0.1)] text-[#1a4d2e]">
                                            <CheckIcon />
                                        </span>
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Icon Components
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default MidSection;
