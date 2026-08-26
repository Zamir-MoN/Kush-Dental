import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Phone } from 'lucide-react';

export const EmergencyBanner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-12">
      <div className="bg-primary rounded-3xl border border-border/30 p-8 md:p-12 lg:p-16 shadow-xl shadow-border/20 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden reveal-up">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 w-2 h-full bg-secondary"></div>
        
        <div className="pl-2 lg:pl-4 flex-1">
          <span className="text-secondary tracking-[0.1em] text-sm uppercase font-display mb-3 block font-medium">
            Priority Care
          </span>
          <h3 className="font-display text-3xl md:text-4xl text-tertiary mb-4">
            Emergency Dental Care
          </h3>
          <p className="text-neutral text-lg max-w-2xl leading-relaxed">
            Experiencing severe pain or a dental trauma? We offer immediate, priority appointments for urgent cases to alleviate pain and restore health.
          </p>
        </div>
        
        <a 
          href="tel:+13105550199"
          className="flex-shrink-0 bg-tertiary text-white font-display font-medium px-10 py-5 rounded-full hover:bg-secondary transition-colors duration-300 flex items-center gap-3 text-lg cursor-hover shadow-lg"
        >
          <Phone className="w-6 h-6" />
          (310) 555-0199
        </a>
      </div>
    </section>
  );
};
