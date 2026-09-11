import { AboutHero } from '../components/about/AboutHero';
import { AboutOrigin } from '../components/about/AboutOrigin';
import { AboutMilestones } from '../components/about/AboutMilestones';
import { AboutStandard } from '../components/about/AboutStandard';

export const About = () => {
  return (
    <main className="w-full flex-grow">
      <AboutHero />
      <AboutOrigin />
      <AboutMilestones />
      <AboutStandard />
    </main>
  );
};

export default About;
