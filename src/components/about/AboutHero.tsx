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
      <div className="max-w-3xl">
        <div className="reveal-up">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-tight text-tertiary mb-stack-md">
            Redefining the<br/>
            <span className="text-secondary">Dental Experience</span>
          </h1>
          <p className="font-body text-base sm:text-lg text-neutral mb-stack-lg max-w-xl leading-relaxed">
            We blend clinical excellence with premium hospitality. Step into a serene environment designed to eliminate anxiety and deliver unparalleled care.
          </p>
          <a href="#origin" className="inline-flex items-center justify-center bg-transparent border border-tertiary text-tertiary font-label text-sm font-medium rounded-xl px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-tertiary hover:text-white transition-colors cursor-hover">
            Our Philosophy
          </a>
        </div>
      </div>
    </section>
  );
};
