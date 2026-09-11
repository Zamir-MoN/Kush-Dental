import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useScrollReveal } from '../../hooks/useGsap';
import { Sparkles, Scan, Cpu, Eye, Activity } from 'lucide-react';

export const PrecisionSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  useEffect(() => {
    if (!bgRef.current || !sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Scan, title: '3D CBCT Volumetric Imaging', desc: 'Sub-millimeter resolution for flawless implant & anatomical planning.' },
    { icon: Cpu, title: 'Guided Robotic Precision', desc: 'Computer-assisted surgical guides eliminating manual deviations.' },
    { icon: Eye, title: 'Digital Intraoral 3D Scans', desc: 'No messy impression trays—instant microscopic digital impressions.' },
    { icon: Activity, title: 'Biomimetic Bonding', desc: 'Preserves up to 90% more healthy natural enamel than traditional crowns.' },
  ];

  return (
    <section ref={sectionRef} className="py-20 sm:py-28 lg:py-36 relative overflow-hidden bg-[#141518] text-white">
      
      {/* Background with Parallax */}
      <div className="absolute inset-0 z-0 h-[120%] -top-[10%]" ref={bgRef}>
        <img 
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1600&auto=format&fit=crop" 
          alt="Precision Dental Technology" 
          className="w-full h-full object-cover opacity-20 filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-[#141518]/85 to-[#141518]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 reveal-up">
          <div className="inline-flex items-center gap-2 mb-3.5">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.24em] uppercase font-sans">
              NEXT-GEN DIAGNOSTICS
            </span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-6 text-white leading-tight">
            Precision <span className="italic font-normal text-[#DCA51B]">Redefined</span><span className="text-[#DCA51B]">.</span>
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-sans font-light max-w-2xl mx-auto">
            Integrating the world’s most advanced digital imaging workflows for absolute accuracy, maximum predictability, and zero discomfort.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="reveal-up luxury-dark-card p-7 sm:p-8 rounded-3xl group cursor-default"
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#DCA51B]/15 border border-[#DCA51B]/35 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 text-[#DCA51B] transition-all duration-300">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white mb-3 group-hover:text-[#DCA51B] transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-sans font-light">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
        
      </div>
      
    </section>
  );
};
