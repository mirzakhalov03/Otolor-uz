import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import { Footer } from '../footer';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    const reduceMotion = useReducedMotion();

    if (reduceMotion) {
        return <>{children}</>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
};

const Layout = () => {
    const location = useLocation();

    return (
        <>
            <div className="relative z-10 min-h-screen bg-[#F5F5F0]">
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
