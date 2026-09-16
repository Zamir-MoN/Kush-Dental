import React, { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ToothSparkleIcon, SmileCurveIcon, DentalShieldIcon } from '../common/DentalIcons';

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const pillars = [
    {
      icon: ToothSparkleIcon,
      title: "Gentle, Painless Touch",
      desc: "Painless local numbing and whisper-quiet instruments for complete comfort."
    },
    {
      icon: SmileCurveIcon,
      title: "Natural Smile Artistry",
      desc: "Preserving natural tooth enamel with custom-matched ceramics."
    },
    {
      icon: DentalShieldIcon,
      title: "Precision 3D Diagnostics",
      desc: "Sub-millimeter 3D imaging and computer guidance for predictable care."
    }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-b border-[#E8E2D5] overflow-hidden relative scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Warm Ambient Gradient Glows */}
      <div className="absolute top-1/3 left-0 w-[550px] h-[550px] bg-[#DCA51B]/[0.035] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#DCA51B]/[0.025] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* 1. Asymmetrical Editorial Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-end mb-8 sm:mb-10 lg:mb-12">
          <div className="lg:col-span-8 reveal-up">

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl text-zinc-900 leading-[1.14] tracking-tight">
              Dentistry designed to feel <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#DCA51B]">peaceful, precise &amp; personal</span>.
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end lg:pb-1 reveal-up">
            <p className="text-zinc-600 text-xs sm:text-sm lg:text-[15px] font-sans font-light leading-relaxed border-l-2 border-[#DCA51B]/60 pl-4 sm:pl-5">
              Calm hospitality, modern technology, and personalized care designed for your comfort.
            </p>
          </div>
        </div>

        {/* 2. Distinct Dual-Layered Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* LEFT: Multi-Layered Visual Composition (Span 7) */}
          <div className="lg:col-span-7 relative reveal-up">
            
            {/* Main Operatory Suite Showcase Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8E2D5] bg-white group">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1400&auto=format&fit=crop" 
                alt="Kush Dental Clinic Luxury Consultation Suite" 
                className="w-full h-[280px] sm:h-[340px] lg:h-[380px] xl:h-[420px] object-cover filter brightness-[0.98] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

              {/* Floating Suite Tag */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-[#DCA51B] animate-pulse" />
                <span className="text-[11px] font-bold text-white font-sans tracking-wider uppercase">
                  Private Consultation Suite
                </span>
              </div>

              {/* Bottom Inset Pill: Doctor Credentials (Transparent Glassmorphic) */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-black/35 backdrop-blur-md px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center justify-between gap-3 transition-all duration-300 hover:border-[#DCA51B]/60">
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsF7fRecc_cpRYBxWO2uQqv6p5QiEK2qMKVen5ACqtO1EOb-RzirP3c2f40XbOSsurGlWYbyFcj1XzHMM1OOnIc6XHn2seIDn0Md_trhN2S-LX_IuS-1U1FlUX7Meoq7D_iUJM5j5HcPj0LC5aNeHyxqewceMim6JSE-TNleAq6DFd7uNO1cQpGhlTzDHwNpFqUpmhbimNJFjNbEhPBRYEiHEmbKx4ZlHBY0bqJ8_ZCmIWWS_uj0uc6JH06oCvYNAk24" 
                    alt="Dr. Amit Kumar" 
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#DCA51B]/50 shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-white">Dr. Amit Kumar</h4>
                      <CheckCircle2 className="w-3 h-3 text-[#DCA51B]" />
                    </div>
                    <p className="text-[11px] text-zinc-300 font-sans">Chief Dental Surgeon &amp; Aesthetic Specialist</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1 text-[#DCA51B] bg-[#DCA51B]/15 border border-[#DCA51B]/35 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide shrink-0">
                  <span>Certified</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT: 3 Informative Philosophy Pillars + Action (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 sm:space-y-5 reveal-up">
            
            <div className="space-y-3 sm:space-y-3.5">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl border border-[#E8E2D5] hover:border-[#DCA51B]/60 p-3.5 sm:p-4 lg:p-4.5 shadow-xs hover:shadow-lg transition-all duration-300 group cursor-default flex items-start gap-3.5 sm:gap-4"
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FAF7F2] border border-[#DCA51B]/30 group-hover:bg-[#DCA51B] group-hover:border-[#DCA51B] flex items-center justify-center shrink-0 text-[#DCA51B] group-hover:text-[#141518] transition-all duration-300 group-hover:rotate-6 shadow-xs">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-zinc-900 group-hover:text-[#DCA51B] transition-colors leading-snug mb-1">
                        {pillar.title}
                      </h3>
                      <p className="text-zinc-600 text-xs sm:text-[13px] font-sans font-light leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Single Primary Action Button */}
            <div className="pt-1">
              <Link 
                to="/about" 
                className="btn-gold-luxury group cursor-pointer py-3 sm:py-3.5 px-7 sm:px-8 rounded-xl inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider shadow-md shadow-[#DCA51B]/25 hover:shadow-lg hover:shadow-[#DCA51B]/35 w-full sm:w-auto justify-center"
              >
                <span>DISCOVER OUR CLINIC</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
