import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const AboutHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pb-stack-lg md:pb-24 relative overflow-hidden">
      <div className="reveal-up mb-12">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity cursor-hover group">
          <ArrowLeft className="w-5 h-5 text-secondary group-hover:-translate-x-1 transition-transform" />
          <span className="text-tertiary font-medium text-lg">Back to Home</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg items-center">
        <div className="reveal-up">
          <h1 className="font-display text-5xl md:text-[72px] leading-tight text-tertiary mb-stack-md">
            Redefining the<br/>
            <span className="text-secondary">Dental Experience</span>
          </h1>
          <p className="font-body text-lg text-neutral mb-stack-lg max-w-lg">
            We blend clinical excellence with premium hospitality. Step into a serene environment designed to eliminate anxiety and deliver unparalleled care.
          </p>
          <a href="#" className="inline-flex items-center justify-center bg-transparent border border-tertiary text-tertiary font-label text-sm font-medium rounded-xl px-8 py-4 hover:bg-black/5 transition-colors cursor-hover">
            Our Philosophy
          </a>
        </div>
        
        <div className="reveal-up relative h-[400px] md:h-[500px] flex items-center justify-center mt-12 lg:mt-0" style={{ transitionDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl"></div>
          <img 
            alt="Premium Clinic Interior" 
            className="w-full h-full object-cover shadow-2xl transition-transform duration-700 hover:scale-105" 
            style={{ 
              maskImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="black" d="M42.7,-62.4C55.6,-53.6,66.5,-41,74.7,-26.4C82.9,-11.8,88.4,4.8,85.2,20.2C82,35.5,70.2,49.6,56.5,60.8C42.8,72.1,27.2,80.5,10.2,82.4C-6.7,84.4,-25,79.9,-41.2,70.2C-57.5,60.4,-71.7,45.4,-79.8,27.7C-88,10,-90,-10.3,-84.1,-27.6C-78.1,-44.9,-64.2,-59.2,-48.6,-67.2C-33.1,-75.2,-16.5,-76.9,-0.6,-76.1C15.4,-75.3,30.8,-72,42.7,-62.4Z" transform="translate(100 100)"/></svg>')`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="black" d="M42.7,-62.4C55.6,-53.6,66.5,-41,74.7,-26.4C82.9,-11.8,88.4,4.8,85.2,20.2C82,35.5,70.2,49.6,56.5,60.8C42.8,72.1,27.2,80.5,10.2,82.4C-6.7,84.4,-25,79.9,-41.2,70.2C-57.5,60.4,-71.7,45.4,-79.8,27.7C-88,10,-90,-10.3,-84.1,-27.6C-78.1,-44.9,-64.2,-59.2,-48.6,-67.2C-33.1,-75.2,-16.5,-76.9,-0.6,-76.1C15.4,-75.3,30.8,-72,42.7,-62.4Z" transform="translate(100 100)"/></svg>')`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center'
            }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbuYOe3LmZLHuoWSUJbrKWN7nE5W6k2BGB7CM1SSi5WTD5AHas2JFTLe2DVx6bhBKw3J2eAeY6EYkX079_nf_vdwuxVVfSkzUT6Nhfs_IiYEyFDx0nrLv0k-SxodLfYZdTSmdwf2t1wJuC25Xx_nrAP_-eignwCEMUYyru9X7J_DYMSImY_wLhLYCNNtvBCFpVkZ_4Fdc5scVhfazi1KHNyiDBi4ETqiUk2RlSQ3chd3aKqhJ7k1ep"
          />
        </div>
      </div>
    </section>
  );
};
