import { ServicesApproach } from '../components/services/ServicesApproach';
import { ServicesGrid } from '../components/services/ServicesGrid';
import { ServicesGuarantee } from '../components/services/ServicesGuarantee';
import { EmergencyBanner } from '../components/services/EmergencyBanner';

export const Services = () => {
  return (
    <main className="w-full flex-grow">
      <ServicesApproach />
      <ServicesGrid />
      <ServicesGuarantee />
      <div className="pt-12 sm:pt-16 bg-[#FAF7F2]">
        <EmergencyBanner />
      </div>
    </main>
  );
};

export default Services;

