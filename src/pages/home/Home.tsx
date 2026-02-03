import { AboutUs } from './components/about';
import { Features } from './components/features';
import Hero from './components/hero/Hero';
import { Services } from './components/services';

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <AboutUs />
            <Services />
        </>
    )
}

export default Home