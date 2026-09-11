import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { Award, Sparkles, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column (Doctor & Clinic Visual) */}
        <div className="lg:col-span-5 relative reveal-up">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E8E2D5] bg-white group">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=900&auto=format&fit=crop" 
              alt="Dr. Alexander Kush Clinical Suite" 
              className="w-full h-[400px] sm:h-[480px] lg:h-[560px] object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Floating Luxury Quality Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] shadow-lg flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:border-[#DCA51B]/50">
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#DCA51B] icon-subtle-pulse" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base text-zinc-900">Gold Standard Precision</h4>
                <p className="text-xs text-zinc-500 mt-0.5 font-sans">Computer-guided aesthetics & 3D micro-planning</p>
              </div>
            </div>
          </div>

          {/* Decorative Gold Corner Glow */}
          <div className="absolute -bottom-6 -right-6 w-44 h-44 bg-[#DCA51B]/10 rounded-full blur-3xl -z-10" />
        </div>

        {/* Right Column (Editorial Text & Highlights) */}
        <div className="lg:col-span-7">
          
          <div className="inline-flex items-center gap-2 mb-3.5 reveal-up">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
              ABOUT KUSH DENTAL CLINIC
            </span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-6 text-zinc-900 leading-[1.15] reveal-up tracking-tight">
            Elevating Dentistry to an <span className="italic font-normal text-[#DCA51B]">Art Form.</span>
          </h2>
          
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed mb-8 font-sans font-light reveal-up">
            We believe that visiting the dentist should be a serene, restorative experience. By blending cutting-edge clinical precision with the attentive care of luxury hospitality, Dr. Alexander Kush and our specialist team have redefined the benchmark for aesthetic dental excellence.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-y border-[#E8E2D5] py-8 reveal-up">
            <div className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#DCA51B] group-hover:text-[#141518] text-[#DCA51B] transition-colors duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-zinc-900 mb-1">Holistic Diagnostics</h4>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-sans font-light">
                  Comprehensive 3D scans addressing full functional bite and natural facial symmetry.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#DCA51B] group-hover:text-[#141518] text-[#DCA51B] transition-colors duration-300">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-lg text-zinc-900 mb-1">Biomimetic Protocols</h4>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-sans font-light">
                  Preserving maximum natural tooth enamel with micro-adhesive restorations.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-5 reveal-up">
            <Link 
              to="/about" 
              className="btn-gold-luxury group cursor-pointer"
            >
              <span>MEET OUR SPECIALISTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
            
            <Link 
              to="/services" 
              className="text-zinc-800 hover:text-[#DCA51B] font-sans font-bold text-xs uppercase tracking-wider transition-colors py-2 border-b border-zinc-400 hover:border-[#DCA51B] cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>EXPLORE CLINICAL DIRECTORY</span>
              <span>&rarr;</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
