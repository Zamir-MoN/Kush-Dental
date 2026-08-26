import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useGsap';

export const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-tertiary text-primary text-center">
      <div className="max-w-3xl mx-auto reveal-up">
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl mb-6">
          Begin Your Journey.
        </h2>
        <p className="text-primary/70 text-lg mb-12 font-body font-light max-w-xl mx-auto">
          Experience the pinnacle of dental artistry and luxury care.
        </p>
        <Link to="/book" className="inline-block bg-secondary text-primary label-small px-10 py-5 rounded hover:bg-[#c49216] transition-colors duration-300 cursor-hover shadow-lg">
          Book an Appointment
        </Link>
      </div>
    </section>
  );
};
