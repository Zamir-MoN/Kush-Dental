import { Hero } from '../components/hero/Hero';
import { AboutSection } from '../components/about/AboutSection';
import { WhyClinic } from '../components/why/WhyClinic';
import { ClinicalSolutions } from '../components/solutions/ClinicalSolutions';
import { TreatmentCollection } from '../components/treatments/TreatmentCollection';
import { PrecisionSection } from '../components/precision/PrecisionSection';
import { BeforeAfterSlider } from '../components/transformations/BeforeAfterSlider';
import { PatientStories } from '../components/testimonials/PatientStories';
import { JournalInsights } from '../components/journal/JournalInsights';
import { Statistics } from '../components/stats/Statistics';
import { FAQ } from '../components/faq/FAQ';
import { ContactForm } from '../components/appointment/AppointmentForm';
import { FinalCTA } from '../components/appointment/FinalCTA';

export const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <div className="content-visibility-auto"><AboutSection /></div>
      <div className="content-visibility-auto"><WhyClinic /></div>
      <div className="content-visibility-auto"><ClinicalSolutions /></div>
      <div className="content-visibility-auto"><TreatmentCollection /></div>
      <div className="content-visibility-auto"><PrecisionSection /></div>
      <div className="content-visibility-auto"><BeforeAfterSlider /></div>
      <div className="content-visibility-auto"><PatientStories /></div>
      <div className="content-visibility-auto"><JournalInsights /></div>
      <div className="content-visibility-auto"><Statistics /></div>
      <div className="content-visibility-auto"><FAQ /></div>
      <div className="content-visibility-auto"><ContactForm /></div>
      <div className="content-visibility-auto"><FinalCTA /></div>
    </div>
  );
};
