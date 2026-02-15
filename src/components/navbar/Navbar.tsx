import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import Logo from "../../assets/Logo"
import CallButton from "../CTA-buttons/CallButton"
import LangSelector from "../langSelector/LangSelector"
import './Navbar.scss'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t } = useTranslation()

  const Tabs = [
    { name: t('nav.home'), to: "/" },
    { name: t('nav.services'), to: "/services" },
    { name: t('nav.academy'), to: "/academy" },
    { name: t('nav.about'), to: "/about" },
    { name: t('nav.microtia'), to: "/microtia" },
    { name: t('nav.moscadaver'), to: "/moscadaver" },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="navbar-wrapper">
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
