import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Sparkles } from 'lucide-react';

export const AboutHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pb-stack-lg md:pb-24 relative overflow-hidden">
      {/* Top back navigation */}
      <div className="reveal-up mb-8 md:mb-12">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity cursor-hover group">
          <ArrowLeft className="w-5 h-5 text-secondary group-hover:-translate-x-1 transition-transform" />
          <span className="text-tertiary font-medium text-base sm:text-lg">Back to Home</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary/15 rounded-full font-body text-xs sm:text-sm font-semibold text-secondary mb-6 tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Excellence in Dental Artistry</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.15] text-tertiary mb-6 tracking-tight">
            Redefining the<br />
            <span className="text-secondary">Dental Experience</span>
          </h1>

          <p className="font-body text-base sm:text-lg text-neutral mb-8 sm:mb-10 max-w-xl leading-relaxed">
            We blend clinical excellence with premium hospitality. Step into a serene environment designed to eliminate anxiety and deliver unparalleled bespoke dental care tailored around you.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="#origin" 
              className="inline-flex items-center justify-center bg-secondary text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-[#c49216] transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
            >
              Our Philosophy
            </a>
            <Link 
              to="/book" 
              className="inline-flex items-center justify-center bg-white/80 border border-border/80 text-tertiary font-bold text-xs sm:text-sm uppercase tracking-wider px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:border-secondary hover:text-secondary transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
            >
              Book Consultation
            </Link>
          </div>
        </div>

        {/* Right Column: Custom Asymmetrical Rounded Doctor Card */}
        <div className="lg:col-span-5 reveal-up relative flex justify-center lg:justify-end mt-8 lg:mt-0" style={{ transitionDelay: '0.2s' }}>
          {/* Ambient Glow */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/20 via-secondary/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Doctor Portrait Card */}
          <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]">
            <div className="relative overflow-hidden rounded-t-[3.5rem] rounded-bl-[4.5rem] rounded-br-[1.5rem] border-[6px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] bg-soft-gray aspect-[4/5] group">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" 
                alt="Lead Dental Specialist" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tertiary/60 via-transparent to-transparent opacity-40 pointer-events-none" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white/95 backdrop-blur-xl border border-white/80 p-3.5 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 z-20">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <p className="font-display font-extrabold text-base sm:text-xl text-tertiary leading-none">15+ Years</p>
                <p className="font-body text-[11px] sm:text-xs text-neutral font-medium mt-1">Clinical Mastery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
