import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Footer } from '../footer';
import { PageTransition } from '../../App';
import './Layout.scss';

const Layout = () => {
    const location = useLocation();

    return (
        <>
            <div className="main-content">
                <Navbar />
                <AnimatePresence mode="wait">
                    <PageTransition key={location.pathname}>
                        <Outlet />
                    </PageTransition>
                </AnimatePresence>
            </div>
            <Footer />
        </>
    );
};

export default Layout;
