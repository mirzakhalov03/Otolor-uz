import { NavLink } from "react-router-dom"
import Logo from "../../assets/Logo"
import CallButton from "../CTA-buttons/CallButton"
import LangSelector from "../langSelector/LangSelector"
import './Navbar.scss'

const Navbar = () => {
 
  const Tabs = [
    {name: "Home", to: "/"},
    {name: "Services", to: "/services"},
    {name: "Academy", to: "/academy"},
    {name: "About", to: "/about"},
    {name: "Blog", to: "/blog"},
    {name: "Microtia", to: "/microtia"},
    {name: "Moscadaver", to: "/moscadaver"},
  ]

  return (
    <div className="navbar-wrapper">
      <div className="navbar-inner container">
        <ul className="navbar-list">
            <Logo />
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
                <LangSelector/>
            </div>
            <CallButton/>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
