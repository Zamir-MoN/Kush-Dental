import { ServicesApproach } from '../components/services/ServicesApproach';
import { ServicesGrid } from '../components/services/ServicesGrid';
import { EmergencyBanner } from '../components/services/EmergencyBanner';

export const Services = () => {
  return (
    <main className="w-full flex-grow">
      <ServicesApproach />
      <ServicesGrid />
      <EmergencyBanner />
    </main>
  );
};

export default Services;

