import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Footer } from '../footer';
import './layout.scss';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="site-layout">
            <Navbar />
            {/* key re-mounts on route change to retrigger the CSS fade.
                site-main grows to fill the viewport so the footer stays pinned
                to the bottom during Suspense loading (prevents the footer flicker). */}
            <main key={location.pathname} className="page-transition site-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
