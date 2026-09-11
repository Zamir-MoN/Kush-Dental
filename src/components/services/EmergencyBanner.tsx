import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Phone, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmergencyBanner = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pb-20 sm:pb-24 overflow-hidden">
      <div className="bg-[#141518] text-white rounded-3xl border border-white/10 p-7 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden reveal-up">
        
        {/* Subtle Gold Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DCA51B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCA51B]/15 border border-[#DCA51B]/30 mb-4">
              <AlertCircle className="w-3.5 h-3.5 text-[#DCA51B] icon-subtle-pulse" />
              <span className="text-[#DCA51B] tracking-[0.2em] text-xs uppercase font-bold font-sans">
                SAME-DAY PRIORITY CARE
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight font-normal">
              Emergency & Urgent Dental Care<span className="text-[#DCA51B]">.</span>
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans font-light mb-6">
              Experiencing severe acute pain, a fractured restoration, or a dental emergency? Our dedicated concierge team provides immediate triage and priority treatment slots.
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-zinc-400 font-sans">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#DCA51B]" />
                <span>Immediate 2-Hour Response</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#DCA51B]" />
                <span>On-Site 3D Diagnostic Scans</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0 w-full sm:w-auto">
            <a 
              href="tel:+13105550199"
              className="btn-gold-luxury group cursor-pointer w-full sm:w-auto"
            >
              <Phone className="w-4 h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
              <span>CALL DIRECT: (310) 555-0199</span>
            </a>

            <Link
              to="/book"
              className="text-white hover:text-[#DCA51B] font-sans font-bold text-xs uppercase tracking-wider px-7 py-3.5 border border-white/20 hover:border-[#DCA51B] rounded-xl transition-colors text-center w-full sm:w-auto cursor-pointer"
            >
              REQUEST URGENT VISIT
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
