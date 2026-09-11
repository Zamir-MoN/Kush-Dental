import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../../hooks/useGsap';
import { Calendar, Sparkles } from 'lucide-react';

export const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 md:py-32 px-4 sm:px-6 lg:px-12 bg-[#141518] text-white text-center relative overflow-hidden">
      {/* Decorative Gold Topographic Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full object-cover" viewBox="0 0 800 800" fill="none">
          <circle cx="400" cy="400" r="300" stroke="#DCA51B" strokeWidth="1" />
          <circle cx="400" cy="400" r="450" stroke="#DCA51B" strokeWidth="1" />
          <circle cx="400" cy="400" r="600" stroke="#DCA51B" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto reveal-up">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
          <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
            BEGIN YOUR JOURNEY
          </span>
        </div>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6 text-white leading-tight font-normal">
          Excellence in Every <span className="italic font-normal text-[#DCA51B]">Smile</span><span className="text-[#DCA51B]">.</span>
        </h2>

        <p className="text-zinc-300 text-base sm:text-lg mb-10 font-sans font-light max-w-xl mx-auto leading-relaxed">
          Experience the pinnacle of clinical artistry, advanced digital workflows, and attentive luxury care.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-5">
          <Link 
            to="/book" 
            className="btn-gold-luxury group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
            <span>BOOK YOUR VISIT</span>
          </Link>

          <Link 
            to="/about" 
            className="text-white hover:text-[#DCA51B] font-sans font-bold text-xs uppercase tracking-wider px-7 py-3.5 transition-all duration-300 border border-white/20 hover:border-[#DCA51B] rounded-xl cursor-pointer"
          >
            LEARN ABOUT US
          </Link>
        </div>
      </div>
    </section>
  );
};
