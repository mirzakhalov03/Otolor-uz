import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets scroll position to the top on every route (pathname) change.
 * Rendered once inside the router so it covers public + admin layouts.
 * useLayoutEffect runs before paint, so the new page never flashes at the
 * previous scroll offset.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
