import { useTranslation } from 'react-i18next';
import './Partners.scss';

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
        <section className="partners">
            {/* Decorative background elements */}
            <div className="partners__bg-glow partners__bg-glow--1" />
            <div className="partners__bg-glow partners__bg-glow--2" />

            <div className="partners__container container">
                <div className="partners__header">
                    <span className="partners__tag">{t('partners.tag', 'Our Partners')}</span>
                    <h2 className="partners__title">{t('partners.title', 'Trusted by Industry Leaders')}</h2>
                </div>
            </div>

            <div className="partners__carousel">
                <div className="partners__gradient partners__gradient--left" />
                <div className="partners__gradient partners__gradient--right" />
                
                <div className="partners__track">
                    {duplicatedPartners.map((partner, index) => (
                        <div key={`${partner.name}-${index}`} className="partners__item">
                            <div className="partners__logo">
                                {partner.logo ? (
                                    <img src={partner.logo} alt={partner.name} />
                                ) : (
                                    <span className="partners__placeholder-text">
                                        {partner.name}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
