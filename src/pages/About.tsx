import { AboutHero } from '../components/about/AboutHero';
import { AboutMilestones } from '../components/about/AboutMilestones';
import { AboutStandard } from '../components/about/AboutStandard';
import { AboutGallery } from '../components/about/AboutGallery';
export const About = () => {
  return (
    <main className="w-full flex-grow">
      <AboutHero />
      <AboutStandard />
      <AboutMilestones />
      <AboutGallery />
    </main>
  );
};

export default About;
