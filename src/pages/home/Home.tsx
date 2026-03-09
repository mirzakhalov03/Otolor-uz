// import { AboutUs } from './components/about';
import { BranchesSection } from './components/branches';
// import { Features } from './components/features';
import Hero from './components/hero/Hero';
import { MidSection } from './components/midSection';
import { Partners } from './components/partners';
// import { Services } from './components/services';

const Home = () => {
    return (
        <>
            <Hero />
            <MidSection />
            <BranchesSection />
            {/* <Features /> */}
            <Partners />
            {/* <AboutUs /> */}
            {/* <Services /> */}
        </>
    )
}

export default Home