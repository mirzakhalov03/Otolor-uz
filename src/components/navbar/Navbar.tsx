import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import Logo from "../../assets/Logo"
import CallButton from "../CTA-buttons/CallButton"
import LangSelector from "../langSelector/LangSelector"
import './Navbar.scss'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const Tabs = [
    { name: "Home", to: "/" },
    { name: "Services", to: "/services" },
    { name: "Academy", to: "/academy" },
    { name: "About", to: "/about" },
    { name: "Blog", to: "/blog" },
    { name: "Microtia", to: "/microtia" },
    { name: "Moscadaver", to: "/moscadaver" },
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
          </div>

          <div className="navbar-actions">
            <CallButton />

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
