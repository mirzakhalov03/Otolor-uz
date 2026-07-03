import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Footer } from '../footer';
import './layout.scss';

const Layout = () => {
    const location = useLocation();

    return (
        <>
            <Navbar />
            {/* key re-mounts on route change to retrigger the CSS fade */}
            <div key={location.pathname} className="page-transition">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default Layout;
