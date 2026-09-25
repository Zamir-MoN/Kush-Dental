import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useGsap';
import { Calendar } from 'lucide-react';
import { WaterDropRipples } from '../common/WaterDropRipples';

export const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-14 sm:py-18 lg:py-20 px-4 sm:px-6 lg:px-12 bg-[#141518] text-white text-center relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      {/* Animated Water Drop Ripple Circles */}
      <WaterDropRipples />

      {/* Soft Radial Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#DCA51B]/[0.08] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto reveal-up">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-white leading-tight font-normal">
          Excellence in Every <span className="italic font-normal text-[#DCA51B]">Smile</span><span className="text-[#DCA51B]">.</span>
        </h2>

        <p className="text-zinc-300 text-xs sm:text-sm lg:text-base mb-6 sm:mb-8 font-sans font-light max-w-xl mx-auto leading-relaxed">
          Schedule your dental checkup, cleaning, or smile transformation in our modern, gentle clinic.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-3.5 sm:gap-4">
          <Link 
            to="/book" 
            className="btn-gold-luxury group cursor-pointer py-3 px-6 text-xs"
          >
            <Calendar className="w-4 h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
            <span>BOOK YOUR VISIT</span>
          </Link>

          <Link 
            to="/about" 
            className="text-white hover:text-[#DCA51B] font-sans font-bold text-xs uppercase tracking-wider px-6 py-3 transition-all duration-300 border border-white/20 hover:border-[#DCA51B] rounded-xl cursor-pointer"
          >
            LEARN ABOUT US
          </Link>
        </div>
      </div>
    </section>
  );
};
