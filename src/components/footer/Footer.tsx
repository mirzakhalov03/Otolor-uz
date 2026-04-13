import { Instagram, Facebook, Youtube, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import otolorLogo from '../../assets/icons/logo.png';

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
        <footer className="w-full bg-[#0F3620] px-0 py-10 text-white md:py-15 md:pb-5">
            <div className="mx-auto w-full max-w-300 px-5">
                <div className="mb-10 grid grid-cols-1 gap-7.5 md:grid-cols-2 md:gap-10 lg:grid-cols-[1fr_1fr_2fr] lg:gap-15">
                    {/* Logo and Contact Section */}
                    <div className="flex flex-col gap-5">
                        <div className="mb-2.5 w-35 ">
                            <img src={otolorLogo} alt="Otolor Logo" />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <a
                                href="tel:+998781133883"
                                className="text-lg font-semibold text-white transition-opacity duration-300 hover:opacity-80 md:text-xl"
                            >
                                + 998 (78) 113-38-83
                            </a>
                            <p className="m-0 text-[13px] leading-[1.6] text-white/90 md:text-sm">
                                {t('footer.mainAddress')}<br />
                                {t('footer.workingHours')}
                            </p>
                        </div>
                        <div className="mt-2.5 flex gap-3.75">
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.75 hover:bg-white/20 md:h-10 md:w-10"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.75 hover:bg-white/20 md:h-10 md:w-10"
                                aria-label="Facebook"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.75 hover:bg-white/20 md:h-10 md:w-10"
                                aria-label="YouTube"
                            >
                                <Youtube size={20} />
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 hover:-translate-y-0.75 hover:bg-white/20 md:h-10 md:w-10"
                                aria-label="Telegram"
                            >
                                <Send size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Information Links */}
                    <div>
                        <h3 className="mb-5 text-lg font-semibold text-white">{t('footer.information')}</h3>
                        <ul className="m-0 flex list-none flex-col gap-3 p-0">
                            {footerLinks.information.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="inline-block text-sm text-white/90 transition-all duration-300 hover:translate-x-1.25 hover:text-white"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Branches */}
                    <div className="md:col-span-2 lg:col-auto">
                        <h3 className="mb-5 text-lg font-semibold text-white">{t('footer.branches')}</h3>
                        <ul className="m-0 flex max-h-none list-none flex-col gap-5 overflow-y-visible p-0 pr-0 lg:max-h-75 lg:overflow-y-auto lg:pr-2.5">
                            {footerLinks.branches.map((branch, index) => (
                                <li
                                    key={index}
                                    className="border-b border-white/10 pb-5 last:border-b-0 last:pb-0"
                                >
                                    <p className="m-0 mb-1.25 text-[13px] leading-normal text-white">{branch.name}</p>
                                    {branch.address && (
                                        <p className="m-0 text-xs text-white/80">{branch.address}</p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-3 text-center">
                    <p className="m-0 text-xs text-white/80 md:text-sm">
                        {t('footer.copyright', { year: currentYear })}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
