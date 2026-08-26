import { Header } from '../components/layout/Header';
import { Hero } from '../components/hero/Hero';
import { AboutSection } from '../components/about/AboutSection';
import { WhyClinic } from '../components/why/WhyClinic';
import { ClinicalSolutions } from '../components/solutions/ClinicalSolutions';
import { TreatmentCollection } from '../components/treatments/TreatmentCollection';
import { PrecisionSection } from '../components/precision/PrecisionSection';
import { BeforeAfterSlider } from '../components/transformations/BeforeAfterSlider';
import { MasterClinicians } from '../components/clinicians/MasterClinicians';
import { PatientStories } from '../components/testimonials/PatientStories';
import { JournalInsights } from '../components/journal/JournalInsights';
import { Statistics } from '../components/stats/Statistics';
import { FAQ } from '../components/faq/FAQ';
import { AppointmentForm } from '../components/appointment/AppointmentForm';
import { FinalCTA } from '../components/appointment/FinalCTA';
import { Footer } from '../components/layout/Footer';

export const Home = () => {
  return (
    <>
      <Header />
      
      <main>
        <Hero />
        <AboutSection />
        <WhyClinic />
        <ClinicalSolutions />
        <TreatmentCollection />
        <PrecisionSection />
        <BeforeAfterSlider />
        <MasterClinicians />
        <PatientStories />
        <JournalInsights />
        <Statistics />
        <FAQ />
        <AppointmentForm />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
};
