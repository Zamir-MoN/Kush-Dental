import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { ShieldCheck, Flower2, Cpu } from 'lucide-react';

export const AboutStandard = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-stack-lg md:py-24">
      <div className="text-center mb-16 reveal-up">
        <h2 className="font-display text-4xl lg:text-5xl text-tertiary">The Kush Standard</h2>
        <div className="w-16 h-1 bg-secondary mx-auto mt-6 rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Card 1 */}
        <div className="bg-white rounded-[20px] p-8 border border-border/50 hover:shadow-lg transition-all duration-300 reveal-up">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl text-tertiary mb-3">Clinical Excellence</h3>
          <p className="font-body text-base text-neutral leading-relaxed">
            Mastery in technique combined with rigorous continuous education ensures you receive world-class dental treatments.
          </p>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white rounded-[20px] p-8 border border-border/50 hover:shadow-lg transition-all duration-300 reveal-up" style={{ transitionDelay: '0.1s' }}>
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary">
            <Flower2 className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl text-tertiary mb-3">Patient Comfort</h3>
          <p className="font-body text-base text-neutral leading-relaxed">
            From ambient aromatherapy to noise-canceling headphones, every detail is curated for your absolute serenity.
          </p>
        </div>
        
        {/* Card 3 */}
        <div className="bg-white rounded-[20px] p-8 border border-border/50 hover:shadow-lg transition-all duration-300 reveal-up" style={{ transitionDelay: '0.2s' }}>
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-6 text-secondary">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl text-tertiary mb-3">Leading Technology</h3>
          <p className="font-body text-base text-neutral leading-relaxed">
            We employ state-of-the-art diagnostic and surgical tools to provide minimally invasive, precise, and swift care.
          </p>
        </div>
      </div>
    </section>
  );
};
