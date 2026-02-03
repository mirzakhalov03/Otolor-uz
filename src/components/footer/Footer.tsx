import { Instagram, Facebook, Youtube, Send } from 'lucide-react';
import './Footer.scss';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        information: [
            { label: 'Главная', href: '/' },
            { label: 'Наши услуги', href: '/services' },
            { label: 'Пациентам', href: '/patients' },
            { label: 'Акциями', href: '/promotions' },
            { label: 'О нас', href: '/about' },
            { label: 'Блог', href: '/blog' }
        ],
        branches: [
            {
                name: 'Otolor hospital (ЕМГ) Очилов Мирза-уля Туйлабаш',
                address: 'ЦОotolor hospital (ЦБ)- массив Кашгар, 24А'
            },
            {
                name: 'Otolor hospital (Медез klinika) - проси. Амира Темура',
                address: '1196'
            },
            {
                name: 'Otolor hospital (M clinic) — ул. Талтана. 1',
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
                                г. Ташкент, ул. Мустақил, 24А<br />
                                Пн-Пт: с 08:00 до 18:00
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
                        <h3 className="footer__section-title">Информация</h3>
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
                        <h3 className="footer__section-title">Филиалы:</h3>
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
                        © Все права защищены. {currentYear} год
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
