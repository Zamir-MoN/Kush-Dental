import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { ShieldCheck, Flower2, Cpu, Sparkles } from 'lucide-react';

export const AboutStandard = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
      <div className="text-center mb-14 reveal-up">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#DCA51B]/30 mb-3.5">
          <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
          <span className="text-[#DCA51B] text-xs font-bold tracking-widest uppercase font-sans">
            OUR CORE VALUES
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900">The Kush Standard</h2>
        <div className="w-12 h-0.5 bg-[#DCA51B] mx-auto mt-4 rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Card 1 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up">
          <div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-3 group-hover:text-[#DCA51B] transition-colors">
              Clinical Excellence
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              Mastery in technique combined with continuous academic fellowships ensures you receive premier, internationally acclaimed dental care.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
        
        {/* Card 2 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up" style={{ transitionDelay: '0.1s' }}>
          <div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
              <Flower2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-3 group-hover:text-[#DCA51B] transition-colors">
              Patient Serenity
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              From organic ambient aromatherapy to noise-canceling headsets, every detail of our suite is curated for your absolute tranquility.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
        
        {/* Card 3 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up" style={{ transitionDelay: '0.2s' }}>
          <div>
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
              <Cpu className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-3 group-hover:text-[#DCA51B] transition-colors">
              Leading Technology
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              We employ state-of-the-art 3D CBCT diagnostic tools and computer-guided surgery to provide minimally invasive, swift results.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
      </div>
    </section>
  );
};
