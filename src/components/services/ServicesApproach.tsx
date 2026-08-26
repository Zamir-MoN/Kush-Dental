import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ServicesApproach = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="w-full bg-tertiary text-white pt-32 pb-24 relative overflow-hidden reveal-section">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" 
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCuu2CpI-Rz8QqhHOAEzwM9JTboACCbelXP2rlLfBqrU1htyTcU3MImpOTqPWtrfbbvjl4opcX687Wi1gSqOTZLG0D3yCsAdJXQvyKM0Xb0FwDb2TOk4Gza-MAuYZme3pVOz94MHkcEo3sgno3leLcpbPirtbxRP19isbMLg2FjCA0_wHsbftZpaC6kJdzYcaO-BDrljut1BpjmiKAmUtQW5WF_Z621v0vIRM3__KbYG1VNBopa-oqg")' }}
      ></div>
      
      <div className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop relative z-10 reveal-up">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity cursor-hover group mb-12">
          <ArrowLeft className="w-5 h-5 text-secondary group-hover:-translate-x-1 transition-transform" />
          <span className="text-white font-medium text-lg">Back to Home</span>
        </Link>
        
        <div className="text-center">
        <span className="text-secondary tracking-[0.2em] text-sm uppercase font-display mb-6 block font-medium">
          Our Approach
        </span>
        <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-light mb-8 max-w-4xl mx-auto leading-tight text-white">
          Artistry in Dentistry. <br/>Precision in Care.
        </h2>
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          We view every smile as a masterpiece. Our treatments blend advanced clinical expertise with an eye for aesthetic perfection, ensuring results that are as healthy as they are beautiful.
        </p>
        </div>
      </div>
    </section>
  );
};
