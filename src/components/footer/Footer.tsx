import { Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Footer.scss';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const { t } = useTranslation();

    const footerLinks = {
        information: [
            { label: t('nav.home'), href: '/' },
            { label: t('footer.ourServices'), href: '/services' },
            { label: t('footer.patients'), href: '/patients' },
            { label: t('footer.promotions'), href: '/promotions' },
            { label: t('nav.about'), href: '/about' },
            { label: t('nav.blog'), href: '/blog' }
        ],
        branches: [
            {
                name: t('footer.branch1Name'),
                address: t('footer.branch1Address')
            },
            {
                name: t('footer.branch2Name'),
                address: t('footer.branch2Address')
            },
            {
                name: t('footer.branch3Name'),
                address: ''
            }
        ]
    };

    return (
        <footer className="footer">
            <div className="footer__container container">
                <div className="footer__content">
                    {/* Logo and Contact Section */}
                    <div className="footer__section footer__section--brand">
                        <div className="footer__logo">
                            <h2 className="footer__logo-text">otolor</h2>
                        </div>
                        <div className="footer__contact">
                            <a href="tel:+998781133883" className="footer__phone">
                                + 998 (78) 113-38-83
                            </a>
                            <p className="footer__address">
                                {t('footer.mainAddress')}<br />
                                {t('footer.workingHours')}
                            </p>
                        </div>
                        <div className="footer__social">
                            <a href="#" className="footer__social-link" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="footer__social-link" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="footer__social-link" aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                            <a href="#" className="footer__social-link" aria-label="Telegram">
                                <Send size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Information Links */}
                    <div className="footer__section">
                        <h3 className="footer__section-title">{t('footer.information')}</h3>
                        <ul className="footer__links">
                            {footerLinks.information.map((link, index) => (
                                <li key={index} className="footer__link-item">
                                    <a href={link.href} className="footer__link">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Branches */}
                    <div className="footer__section footer__section--branches">
                        <h3 className="footer__section-title">{t('footer.branches')}</h3>
                        <ul className="footer__branches">
                            {footerLinks.branches.map((branch, index) => (
                                <li key={index} className="footer__branch">
                                    <p className="footer__branch-name">{branch.name}</p>
                                    {branch.address && (
                                        <p className="footer__branch-address">{branch.address}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="footer__bottom">
                    <p className="footer__copyright">
                        {t('footer.copyright', { year: currentYear })}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
