import { Link } from "react-router-dom"
import logo from "../assets/icons/logo.png"

const Logo = () => {
    return (
        <Link to="/">
            <div className="w-[130px]">
                <img src={logo} alt="logo" />
            </div>
        </Link>
    )
}

export default Logo