import { BranchesSection } from './components/branches';
import Hero from './components/hero/Hero';
import { MidSection } from './components/midSection';
import { Partners } from './components/partners';

const Home = () => {
    return (
        <>
            <Hero />
            <MidSection />
            <BranchesSection />
            <Partners />
        </>
    )
}

export default Home
