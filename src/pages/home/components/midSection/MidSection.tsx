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
        <section className="mid-section">
            {/* Decorative elements */}
            <div className="mid-section__decoration mid-section__decoration--1" />
            <div className="mid-section__decoration mid-section__decoration--2" />
            <div className="mid-section__decoration mid-section__decoration--3" />
            <div className="mid-section__glow mid-section__glow--1" />
            <div className="mid-section__glow mid-section__glow--2" />
            
            {/* Section Header */}
            <div className="mid-section__header">
                <span className="mid-section__tag">{t('midSection.tag', 'Our Foundation')}</span>
                <h2 className="mid-section__title">{t('midSection.title', 'The Three Pillars of Otolor')}</h2>
            </div>
            
            <div className="mid-section__container container">
                {/* Hospital Pillar - Left */}
                <div className="mid-section__pillar mid-section__pillar--hospital">
                    <div className="pillar-image-card">
                        <div className="pillar-image-card__image pillar-image-card__image--cover">
                            <img src={hospital.image || hospitalImage} alt={hospital.title} />
                        </div>
                        <div className="pillar-image-card__content">
                            <h3 className="pillar-image-card__title">{hospital.title}</h3>
                            {hospital.description && (
                                <p className="pillar-image-card__description">{hospital.description}</p>
                            )}
                            <ul className="pillar-image-card__list">
                                {hospital.items?.map((item, index) => (
                                    <li key={index} className="pillar-image-card__list-item">
                                        <span className="pillar-image-card__bullet">
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
                <div className="mid-section__pillar mid-section__pillar--team">
                    <div className="team-carousel-wrapper">
                        <ImageCarousel 
                            autoPlayInterval={carouselAutoPlayInterval} 
                            showDoctorInfo={true}
                            height={560}
                        />
                    </div>
                </div>

                {/* Academy Pillar - Right */}
                <div className="mid-section__pillar mid-section__pillar--academy">
                    <div className="pillar-image-card">
                        <div className="pillar-image-card__image pillar-image-card__image--contain">
                            <img src={academy.image || academyImage} alt={academy.title} />
                        </div>
                        <div className="pillar-image-card__content">
                            <h3 className="pillar-image-card__title">{academy.title}</h3>
                            {academy.description && (
                                <p className="pillar-image-card__description">{academy.description}</p>
                            )}
                            <ul className="pillar-image-card__list">
                                {academy.items?.map((item, index) => (
                                    <li key={index} className="pillar-image-card__list-item">
                                        <span className="pillar-image-card__bullet">
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
