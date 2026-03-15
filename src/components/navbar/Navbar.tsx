import { useState, useEffect, useRef } from "react"
import { NavLink, useLocation, matchPath } from "react-router-dom"
import { Menu, X, ChevronDown, Lock } from "lucide-react"
import { useTranslation } from "react-i18next"
import Logo from "../../assets/Logo"
import CallButton from "../CTA-buttons/CallButton"
import LangSelector from "../langSelector/LangSelector"
import './Navbar.scss'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileAcademyOpen, setIsMobileAcademyOpen] = useState(false)
  const [isDesktopAcademyOpen, setIsDesktopAcademyOpen] = useState(false)
  const academyDropdownRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const { t } = useTranslation()

  const Tabs = [
    { name: t('nav.home'), to: "/" },
    { name: t('nav.services'), to: "/services" },
    { name: t('nav.about'), to: "/about" },
  ]

  const academyDropdownItems = [
    { name: t('nav.courses'), to: "/courses", disabled: false },
    { name: t('nav.books'), to: "/books", disabled: true },
    { name: t('nav.moscadaver'), to: "/moscadaver", disabled: true },
    { name: t('nav.microtia'), to: "/microtia", disabled: true },
  ]

  const isAcademyActive = academyDropdownItems.some((item) => {
    if (item.disabled) {
      return false
    }

    return Boolean(matchPath({ path: `${item.to}/*` }, location.pathname) || location.pathname === item.to)
  })

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (academyDropdownRef.current && !academyDropdownRef.current.contains(event.target as Node)) {
        setIsDesktopAcademyOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div className={`navbar-wrapper ${isScrolled ? 'navbar-wrapper--scrolled' : ''}`}>
      <div className="navbar-inner container">
        <ul className="navbar-list">
          <Logo />

          {/* Desktop Navigation */}
          <div className="navbar-tabs">
            {Tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.to}
                end={tab.to === "/"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                {tab.name}
              </NavLink>
            ))}
            
            {/* Academy Dropdown */}
            <div
              ref={academyDropdownRef}
              className={`nav-dropdown ${isDesktopAcademyOpen ? 'nav-dropdown--open' : ''}`}
              onMouseEnter={() => setIsDesktopAcademyOpen(true)}
              onMouseLeave={() => setIsDesktopAcademyOpen(false)}
            >
              <button
                type="button"
                className={`nav-link nav-dropdown__trigger ${isAcademyActive ? 'active' : ''}`}
                aria-haspopup="menu"
                aria-expanded={isDesktopAcademyOpen}
                onClick={() => setIsDesktopAcademyOpen((prev) => !prev)}
              >
                {t('nav.academy')}
                <ChevronDown size={16} className="nav-dropdown__icon" />
              </button>
              {isDesktopAcademyOpen && (
                <div className="nav-dropdown__menu">
                  {academyDropdownItems.map((item) => (
                    item.disabled ? (
                      <span key={item.name} className="nav-dropdown__item nav-dropdown__item--disabled">
                        {item.name}
                        <Lock size={14} className="nav-dropdown__lock" />
                      </span>
                    ) : (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className="nav-dropdown__item"
                        onClick={() => setIsDesktopAcademyOpen(false)}
                      >
                        {item.name}
                      </NavLink>
                    )
                  ))}
                </div>
              )}
            </div>
            
            <LangSelector />
            <CallButton />
          </div>

          <div className="navbar-actions">
            {/* Burger Menu Button */}
            <button
              className="navbar-burger"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </ul>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`navbar-mobile ${isMobileMenuOpen ? 'navbar-mobile--open' : ''}`}>
        <div className="navbar-mobile__content">
          {/* Close Button */}
          <button
            className="navbar-mobile__close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={28} />
          </button>

          <nav className="navbar-mobile__nav">
            {Tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.to}
                end={tab.to === "/"}
                className={({ isActive }) =>
                  `navbar-mobile__link ${isActive ? "navbar-mobile__link--active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                {tab.name}
              </NavLink>
            ))}
            
            {/* Mobile Academy Dropdown */}
            <div className="navbar-mobile__dropdown">
              <button
                className={`navbar-mobile__dropdown-trigger ${isMobileAcademyOpen ? 'navbar-mobile__dropdown-trigger--open' : ''} ${isAcademyActive ? 'navbar-mobile__dropdown-trigger--active' : ''}`}
                onClick={() => setIsMobileAcademyOpen(!isMobileAcademyOpen)}
              >
                {t('nav.academy')}
                <ChevronDown size={18} className="navbar-mobile__dropdown-icon" />
              </button>
              {isMobileAcademyOpen && (
                <div className="navbar-mobile__dropdown-menu">
                  {academyDropdownItems.map((item) => (
                    item.disabled ? (
                      <span key={item.name} className="navbar-mobile__dropdown-item navbar-mobile__dropdown-item--disabled">
                        {item.name}
                        <Lock size={14} className="navbar-mobile__dropdown-lock" />
                      </span>
                    ) : (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className="navbar-mobile__dropdown-item"
                        onClick={() => {
                          setIsMobileAcademyOpen(false)
                          closeMobileMenu()
                        }}
                      >
                        {item.name}
                      </NavLink>
                    )
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="navbar-mobile__footer">
            <LangSelector />
            <CallButton />
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="navbar-backdrop"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  )
}

export default Navbar
