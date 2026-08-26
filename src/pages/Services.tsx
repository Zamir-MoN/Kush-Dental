import { useEffect } from 'react';

import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ServicesApproach } from '../components/services/ServicesApproach';
import { ServicesGrid } from '../components/services/ServicesGrid';
import { EmergencyBanner } from '../components/services/EmergencyBanner';

export const Services = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      
      <main className="pb-16">
        <ServicesApproach />
        <ServicesGrid />
        <EmergencyBanner />
      </main>

      <Footer />
    </>
  );
};
