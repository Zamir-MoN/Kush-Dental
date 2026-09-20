import React, { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowDown 
} from 'lucide-react';
import { AnimatedWaveContours } from '../common/AnimatedWaveContours';

export const ServicesApproach: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const handleScrollToGrid = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.querySelector('section.py-16');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#FAF7F2] text-zinc-900 pt-28 sm:pt-36 pb-20 lg:pb-28 relative overflow-hidden border-b border-[#E8E2D5]"
    >
      {/* Background Topographic Wave Contours (Golden Luxury Wave Flow) */}
      <AnimatedWaveContours />

      {/* Radial Gold Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#DCA51B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Mission Narrative */}
          <div className="lg:col-span-6 space-y-6 reveal-up">
            
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">
              <Link to="/" className="hover:text-[#DCA51B] transition-colors">Home</Link>
              <span className="text-zinc-300">/</span>
              <span className="text-[#DCA51B]">Services</span>
            </div>

            {/* Grand Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-normal leading-[1.08] text-zinc-900 tracking-tight">
              Artistry in Dentistry<span className="text-[#DCA51B]">.</span> <br />
              <span className="italic font-normal text-[#DCA51B]">Precision in Care</span><span className="text-[#DCA51B]">.</span>
            </h1>

            {/* Narrative Paragraph */}
            <p className="text-zinc-600 text-base sm:text-lg font-sans font-light leading-relaxed max-w-lg">
              Gentle dental checkups, cosmetic smile makeovers, and advanced care in a calm, modern clinic.
            </p>

            {/* Clean Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link 
                to="/book" 
                className="btn-gold-luxury group cursor-pointer py-3.5 px-8 text-xs sm:text-sm font-bold tracking-wider shadow-lg shadow-[#DCA51B]/20 hover:shadow-xl hover:shadow-[#DCA51B]/30"
              >
                <Calendar className="w-4 h-4 text-[#141518]" />
                <span>BOOK A CONSULTATION</span>
              </Link>
              
              <button 
                onClick={handleScrollToGrid}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#E8E2D5] hover:border-[#DCA51B]/60 bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-xs cursor-pointer"
              >
                <span>EXPLORE TREATMENTS</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#DCA51B]" />
              </button>
            </div>

          </div>

          {/* RIGHT: Pure, Pristine Clinic Visual Frame (Span 6) */}
          <div className="lg:col-span-6 relative reveal-up">
            
            {/* Subtle Ambient Backlight */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-[#DCA51B]/15 to-transparent rounded-[36px] blur-xl pointer-events-none" />

            {/* Clean Luxury Frame (No cluttered badges or overlapping cards) */}
            <div className="relative rounded-3xl overflow-hidden border border-[#E8E2D5] bg-white shadow-xl group aspect-[4/3] sm:aspect-[16/11]">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop" 
                alt="Kush Dental Clinic Luxury Operatory Suite" 
                className="w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Refined Minimalist Bottom Gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
