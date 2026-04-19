import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import './BranchesSection.scss';

interface Branch {
    id: number;
    name: string;
    address: string;
    phone: string;
    workingHours?: string;
    fullWorkingdays?: string;
    mapUrl?: string;
    isMain?: boolean;
}

/**
 * Branches Section - Displays clinic locations in an interactive card layout
 * Features a unique hexagonal grid pattern background and 3D card hover effects
 */
const BranchesSection = () => {
    const { t } = useTranslation();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement | null>(null);

    // Pause all 6 infinite CSS animations when section is off-screen
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                el.classList.toggle('branches-section--visible', entry.isIntersecting);
            },
            { threshold: 0.05 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const branches: Branch[] = [
        {
            id: 1,
            name: t('branches.branch1.name', 'Otolor Hospital (Main)'),
            address: t('branches.branch1.address', 'Kashgar massif, 24A'),
            phone: '+998 78 113 38 83',
            fullWorkingdays: t(`branches.fullWorkingdays`, '24/7 ish vaqti'),
            isMain: true,
        },
        {
            id: 2,
            name: t('branches.branch2.name', 'Otolor Medas'),
            address: t('branches.branch2.address', 'Amir Temur Avenue, 119B'),
            phone: '+998 78 113 38 83',
            fullWorkingdays: t(`branches.fullWorkingdays`, '24/7 ish vaqti'),
        },
        {
            id: 3,
            name: t('branches.branch3.name', 'Otolor M-Clinic'),
            address: t('branches.branch3.address', 'Taltana Street, 1'),
            phone: '+998 78 113 38 83',
            workingHours: t('branches.workingHours', 'Mon-Sat: 08:00 - 14:00'),
        },
        {
            id: 4,
            name: t('branches.branch4.name', 'Otolor Algoritm'),
            address: t('branches.branch4.address', 'Al Xorazmiy dahasi, 50'),
            phone: '+998 78 113 38 83',
            fullWorkingdays: t(`branches.fullWorkingdays`, '24/7 ish vaqti'),
        },
        {
            id: 5,
            name: t('branches.branch5.name', 'Otolor Apnoe Center'),
            address: t('branches.branch5.address', 'Qashqar dahasi, 24A'),
            phone: '+998 78 113 38 83',
            fullWorkingdays: t(`branches.fullWorkingdays`, '24/7 ish vaqti'),
        },
    ];

    return (
        <section ref={sectionRef} className="branches-section relative w-full overflow-hidden bg-[linear-gradient(135deg,#f5f5f0_0%,#f0f0ea_50%,#f5f5f0_100%)] px-0 pb-16 pt-10 md:pb-20 md:pt-14 lg:pb-28">
            {/* Animated Grid Background */}
            <div className="branches-section__bg-pattern">
                <div className="branches-section__grid-lines" />
            </div>
            
            {/* Floating Location Markers */}
            <div className="branches-section__floating-markers">
                <div className="floating-marker floating-marker--1">
                    <LocationPinIcon />
                </div>
                <div className="floating-marker floating-marker--2">
                    <LocationPinIcon />
                </div>
                <div className="floating-marker floating-marker--3">
                    <LocationPinIcon />
                </div>
            </div>

            {/* Header */}
            <div className="branches-section__header relative z-2 mx-auto mb-10 max-w-150 px-4 text-center md:mb-14 lg:mb-16">
                <div className="branches-section__header-content motion-safe:animate-[fadeInUp_0.8s_ease_forwards]">
                    <span className="branches-section__tag mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(26,77,46,0.15)] bg-[rgba(26,77,46,0.08)] px-5 py-2.5 text-sm font-semibold tracking-[1.5px] uppercase text-[#1a4d2e]">
                        <MapIcon />
                        {t('branches.tag', 'Find Us')}
                    </span>
                    <h2 className="branches-section__title mb-4 text-[32px] leading-tight font-bold md:text-[40px] lg:text-[48px]">
                        {t('branches.title', 'Clinics Near You')}
                    </h2>
                    <p className="branches-section__subtitle mx-auto max-w-120 text-base leading-relaxed text-[#6b7280] md:text-lg">
                        {t('branches.subtitle', 'Visit any of our convenient locations across the city')}
                    </p>
                </div>
            </div>

            {/* Cards Container */}
            <div className="branches-section__container relative z-2 mx-auto max-w-350 px-4">
                <div className="branches-section__cards grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-5 xl:gap-6">
                    {branches.map((branch, index) => (
                        <div
                            key={branch.id}
                            className={`branch-card ${branch.isMain ? 'branch-card--main' : ''} ${
                                hoveredCard === branch.id ? 'branch-card--active' : ''
                            }`}
                            style={{ '--card-index': index } as CSSProperties}
                            onMouseEnter={() => setHoveredCard(branch.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            {/* Card Glow Effect */}
                            <div className="branch-card__glow" />
                            
                            {/* Card Border Animation */}
                            <div className="branch-card__border-animation" />
                            
                            {/* Card Content */}
                            <div className="branch-card__content">
                                {/* Location Icon */}
                                <div className="branch-card__icon-wrapper">
                                    <div className="branch-card__icon">
                                        <LocationPinIcon />
                                    </div>
                                    {branch.isMain && (
                                        <span className="branch-card__badge">
                                            {t('branches.mainBranch', 'Main')}
                                        </span>
                                    )}
                                </div>

                                {/* Branch Info */}
                                <div className="branch-card__info">
                                    <h3 className="branch-card__name">{branch.name}</h3>
                                    <p className="branch-card__address">
                                        <AddressIcon />
                                        {branch.address}
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="branch-card__details">
                                    <div className="branch-card__detail">
                                        <PhoneIcon />
                                        <span>{branch.phone}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <a 
                                    href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="branch-card__action"
                                >
                                    <span>{t('branches.getDirections', 'Get Directions')}</span>
                                    <ArrowIcon />
                                </a>
                            </div>

                            {/* Decorative Corner */}
                            <div className="branch-card__corner branch-card__corner--top" />
                            <div className="branch-card__corner branch-card__corner--bottom" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="branches-section__cta relative z-2 mt-10 flex flex-col items-center gap-4 md:mt-14 lg:mt-16">
                <p className="branches-section__cta-text text-base text-[#6b7280]">
                    {t('branches.ctaText', "Can't find a branch near you?")}
                </p>
                <a href="tel:+998712345678" className="branches-section__cta-button inline-flex items-center gap-2.5 rounded-full border-2 border-[#1a4d2e] px-7 py-3.5 text-base font-semibold text-[#1a4d2e] transition hover:-translate-y-0.5 hover:bg-[#1a4d2e] hover:text-white">
                    <PhoneIcon />
                    {t('branches.callUs', 'Call Us')}
                </a>
            </div>
        </section>
    );
};

// Icon Components
const LocationPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M8.161 2.58a1.875 1.875 0 011.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0121.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 01-1.676 0l-4.994-2.497a.375.375 0 00-.336 0l-3.868 1.935A1.875 1.875 0 012.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437zM9 6a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V6.75A.75.75 0 019 6zm6.75 3a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V9z" clipRule="evenodd" />
    </svg>
);

const AddressIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
    </svg>
);

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);

export default BranchesSection;
