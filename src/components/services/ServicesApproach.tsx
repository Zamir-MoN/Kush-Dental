import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Zap, Activity } from 'lucide-react';

export const ServicesApproach = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="w-full bg-[#141518] text-white pt-28 sm:pt-36 pb-20 lg:pb-28 relative overflow-hidden">
      
      {/* Background Topographic Wave Contours */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full object-cover" viewBox="0 0 1000 700" fill="none">
          <path d="M-50 150 C200 80 400 350 700 250 C900 180 1050 350 1200 280" stroke="#DCA51B" strokeWidth="1.2" />
          <path d="M-50 230 C200 160 400 430 700 330 C900 260 1050 430 1200 360" stroke="#DCA51B" strokeWidth="1.2" />
          <path d="M-50 310 C200 240 400 510 700 410 C900 340 1050 510 1200 440" stroke="#DCA51B" strokeWidth="1.2" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="reveal-up mb-8 sm:mb-12 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 font-sans">
          <Link to="/" className="hover:text-[#DCA51B] transition-colors">Home</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-[#DCA51B]">Services</span>
        </div>
        
        <div className="max-w-4xl mx-auto text-center reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCA51B]/15 border border-[#DCA51B]/30 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] tracking-[0.22em] text-xs uppercase font-bold font-sans">
              PREMIER CLINICAL SUITES
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.1] text-white mb-6 tracking-tight">
            Artistry in Dentistry<span className="text-[#DCA51B]">.</span><br />
            <span className="italic font-light">Precision in Care.</span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-light mb-10">
            We view every smile as a bespoke masterpiece. Our treatments blend advanced digital clinical workflows with an eye for natural facial aesthetics.
          </p>

          {/* Quick Highlight Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10">
            <div className="flex items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-sans font-medium group cursor-default">
              <ShieldCheck className="w-4 h-4 text-[#DCA51B] shrink-0 group-hover:scale-110 transition-transform" />
              <span>3D Guided Precision</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-sans font-medium group cursor-default">
              <Zap className="w-4 h-4 text-[#DCA51B] shrink-0 group-hover:scale-110 transition-transform" />
              <span>Minimally Invasive Protocols</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-sans font-medium group cursor-default">
              <Activity className="w-4 h-4 text-[#DCA51B] shrink-0 group-hover:scale-110 transition-transform" />
              <span>Enduring Biomimetic Strength</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
