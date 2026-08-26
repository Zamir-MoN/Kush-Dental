import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { AboutHero } from '../components/about/AboutHero';
import { AboutOrigin } from '../components/about/AboutOrigin';
import { AboutStandard } from '../components/about/AboutStandard';
import { FinalCTA } from '../components/appointment/FinalCTA';

export const About = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-16">
        <AboutHero />
        <AboutOrigin />
        <AboutStandard />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};
