import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { Award, Sparkles, ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const AboutHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#121316] text-white pt-28 sm:pt-36 pb-20 lg:pb-28 relative overflow-hidden"
    >
      {/* Background Topographic Wave Contours */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full object-cover" viewBox="0 0 1000 700" fill="none">
          <path d="M-50 150 C200 80 400 350 700 250 C900 180 1050 350 1200 280" stroke="#DCA51B" strokeWidth="1.2" />
          <path d="M-50 230 C200 160 400 430 700 330 C900 260 1050 430 1200 360" stroke="#DCA51B" strokeWidth="1.2" />
          <path d="M-50 310 C200 240 400 510 700 410 C900 340 1050 510 1200 440" stroke="#DCA51B" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Radial Gold Ambient Glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#DCA51B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="reveal-up mb-8 sm:mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 font-sans">
          <Link to="/" className="hover:text-[#DCA51B] transition-colors">Home</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-[#DCA51B]">About Our Practice</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-7 reveal-up">
            
            {/* Super Header Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCA51B]/15 border border-[#DCA51B]/30 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
              <span className="text-[#DCA51B] tracking-[0.22em] text-xs uppercase font-bold font-sans">
                EXCELLENCE IN DENTAL ARTISTRY • EST. 2011
              </span>
            </div>

            {/* Main Title */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-normal leading-[1.12] text-white mb-6 tracking-tight">
              Redefining the Standard of <br />
              <span className="italic font-light text-[#DCA51B]">Bespoke Dentistry</span><span className="text-[#DCA51B]">.</span>
            </h1>

            {/* Subtitle / Narrative */}
            <p className="text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed font-sans font-light mb-8">
              We merge uncompromising clinical mastery with the warmth of five-star hospitality. Step into a serene, anxiety-free sanctuary designed around personalized care, microscopic precision, and enduring smile aesthetics.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <a 
                href="#origin" 
                className="inline-flex items-center justify-center bg-[#DCA51B] hover:bg-[#c49216] text-[#121316] font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 shadow-lg active:scale-95 cursor-pointer"
              >
                Our Philosophy
              </a>
              <Link 
                to="/book" 
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-4 rounded-xl transition-all duration-300 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Book Consultation</span>
                <ArrowUpRight className="w-4 h-4 text-[#DCA51B]" />
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#DCA51B]">15+ Years</p>
                <p className="text-xs text-zinc-400 mt-1 font-medium font-sans">Clinical Mastery</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-white">12,000+</p>
                <p className="text-xs text-zinc-400 mt-1 font-medium font-sans">Smiles Transformed</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-white">99.4%</p>
                <p className="text-xs text-zinc-400 mt-1 font-medium font-sans">Satisfaction Rate</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#DCA51B]">100%</p>
                <p className="text-xs text-zinc-400 mt-1 font-medium font-sans">Digital Workflow</p>
              </div>
            </div>

          </div>

          {/* Right Column: High-End Multi-Layer Visual Card */}
          <div className="lg:col-span-5 reveal-up relative flex justify-center lg:justify-end" style={{ transitionDelay: '0.15s' }}>
            
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#DCA51B]/25 via-[#DCA51B]/10 to-transparent rounded-[36px] blur-2xl pointer-events-none" />

            <div className="relative w-full max-w-[420px]">
              
              {/* Main Doctor Frame */}
              <div className="relative rounded-[32px] overflow-hidden border-2 border-white/20 shadow-2xl bg-zinc-900 aspect-[4/5] group">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" 
                  alt="Dr. Sarah Jenkins - Lead Prosthodontist" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121316]/90 via-[#121316]/30 to-transparent" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <div className="flex items-center gap-1.5 text-[#DCA51B] text-xs font-bold uppercase tracking-wider mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Board Certified Specialists</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white leading-tight">
                    Dr. Sarah Jenkins & Associates
                  </h3>
                  <p className="text-xs text-zinc-300 font-sans mt-0.5">
                    Prosthodontics & Aesthetic Reconstructive Dentistry
                  </p>
                </div>
              </div>

              {/* Floating Top-Right Technology Badge */}
              <div className="absolute -top-4 -right-3 sm:-right-6 bg-[#191A1E]/95 backdrop-blur-xl border border-white/15 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-20">
                <div className="w-9 h-9 rounded-xl bg-[#DCA51B]/20 flex items-center justify-center text-[#DCA51B] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">Swiss 3D CBCT</p>
                  <p className="text-[10px] text-zinc-400 mt-1 font-sans">Micron Precision</p>
                </div>
              </div>

              {/* Floating Bottom-Left Experience Badge */}
              <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-[#191A1E]/95 backdrop-blur-xl border border-[#DCA51B]/40 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 z-20">
                <div className="w-10 h-10 rounded-xl bg-[#DCA51B] flex items-center justify-center text-[#121316] shrink-0 font-bold shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-serif font-bold text-base text-white leading-none">15+ Years</p>
                  <p className="text-[11px] text-[#DCA51B] font-semibold mt-1 font-sans">Clinical Mastery</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
