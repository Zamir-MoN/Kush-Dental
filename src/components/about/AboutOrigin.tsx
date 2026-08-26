import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';

export const AboutOrigin = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-stack-lg md:py-32">
      <div className="bg-white/85 backdrop-blur-xl border border-white/30 rounded-[24px] p-8 md:p-16 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
          <div className="reveal-up order-2 md:order-1 h-[300px] md:h-[400px] rounded-[20px] overflow-hidden">
            <img 
              alt="Doctor Consultation" 
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHPWq6rHGZhWi_EAVZKnyrDqxC5UaxXG3PTtPJ1NPs94Qq8_gJxu2Nf7ihqAKeaE8Y-4ySWjTmADWdX0oyYZbr_N1eesjqvhcXFQ9Y8eFL8GtB13MyWBkszZmP7N9RND9BU_teQHa6kPUao0o92Y6kRaQ3pcxwORMXePkTNBIdzYNKn7Xp_nhioAx57l65bschDeRAcJPAb0SYNfrrUhP8Ey2nQdqM-eN6vg9lP9PqBWvo74h65ES2"
            />
          </div>
          <div className="reveal-up order-1 md:order-2" style={{ transitionDelay: '0.2s' }}>
            <span className="inline-block px-4 py-1 bg-tertiary/5 rounded-full font-label text-sm font-medium text-tertiary mb-4 tracking-wider uppercase">
              Our Origin
            </span>
            <h2 className="font-display text-4xl md:text-[40px] text-tertiary mb-6 leading-tight">
              Contemporary Care with a Human Touch
            </h2>
            <p className="font-body text-base text-neutral mb-4 leading-relaxed">
              Founded on the principle that healthcare should feel hospitable, Kush Dental Clinic was born from a desire to transform the dreaded dental visit into a rejuvenating experience.
            </p>
            <p className="font-body text-base text-neutral leading-relaxed">
              We stripped away the cold, clinical norms and rebuilt our practice around patient comfort, transparent communication, and meticulous precision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
