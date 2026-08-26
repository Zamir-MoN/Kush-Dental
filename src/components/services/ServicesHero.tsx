import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';

export const ServicesHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
      {/* Text Column */}
      <div className="flex-1 space-y-8 reveal-up">
        <h1 className="font-display text-on-surface tracking-tight text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-tertiary">
          Complete Dental Care <br/>
          <span className="text-secondary italic font-light">Under One Roof</span>
        </h1>
        <p className="text-neutral text-lg md:text-xl max-w-2xl leading-relaxed">
          From preventive care to advanced oral surgery, we provide personalized treatments using modern technology in a calm, welcoming environment.
        </p>
        
        <div className="pt-6 flex flex-wrap gap-4">
          <Link to="/book" className="bg-secondary text-primary font-display font-medium px-8 py-4 rounded-3xl hover:bg-[#c49216] transition-colors shadow-lg cursor-hover">
            Schedule Consultation
          </Link>
          <button className="border border-border/50 text-tertiary font-display font-medium px-8 py-4 rounded-3xl hover:bg-white/50 transition-colors cursor-hover bg-transparent">
            View Price List
          </button>
        </div>
      </div>

      {/* Image Column */}
      <div className="flex-1 w-full h-[400px] lg:h-[600px] rounded-[3rem] overflow-hidden relative shadow-2xl reveal-up" style={{ transitionDelay: '200ms' }}>
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDtIayIbXrMuVUNVxDVRHOnPdKQncxbrMRmqaCsubNksdfOIusjPFzKsb4TJI3HkzV4wO2zvf9VwEN3DbJ3nijuYTr5VmPP5j1Q8YauvGiIpmgAJ1CkbR9SxR9enOArq-_tkr8rTlFGAsQCr2r3sXiSPOkRfa9HWjQP8yNsTnKI8GrjceCiy8e-IakYjjgIoNcKrl0jOeoEmykaXONbfWVn5WpZNLIlp7wXlW0VYhwrNprAYpglN_q" 
          alt="Modern Dental Room"
          className="w-full h-full object-cover img-reveal-anim" 
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none"></div>
      </div>
    </section>
  );
};
