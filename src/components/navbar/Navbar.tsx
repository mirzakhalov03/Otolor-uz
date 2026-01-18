import Logo from "../../assets/Logo"
import CallButton from "../CTA-buttons/CallButton"
import LangSelector from "../langSelector/LangSelector"

const Navbar = () => {
  return (
    <div className="w-full relative ">
      <div className="container flex-center  absolute top-3 left-0 right-0 rounded-xl">
        <ul className="w-full flex items-center justify-between p-5 ">
            <Logo />
            <li>Home</li>
            <li>Services</li>
            <li>Academy</li>
            <li>About</li>
            <li>Blog</li>
            <li>Microtia</li>
            <li>Moscadaver</li>
            <LangSelector/>
            <CallButton/>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
