import React, { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { CheckCircle2 } from 'lucide-react';
import { DentalShieldIcon, ToothSparkleIcon, DentalCrownIcon, SmileCurveIcon } from '../common/DentalIcons';

export const ServicesGuarantee: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const protocols = [
    {
      num: "01",
      icon: ToothSparkleIcon,
      badge: "BIOMIMETIC PRESERVATION",
      title: "Micro-Invasive Philosophy",
      desc: "Conserves natural tooth structure with microscopic precision.",
      points: ["Maximum Enamel Retention", "Metal-Free Bio-Ceramics", "Natural Tooth Vitality"]
    },
    {
      num: "02",
      icon: SmileCurveIcon,
      badge: "ANXIETY-FREE COMFORT",
      title: "Gentle Anesthesia Protocol",
      desc: "Computerized delivery with zero injection pressure sting.",
      points: ["Zero Needle Sting", "Quiet Private Treatment Suites", "Warm Herbal Refreshments"]
    },
    {
      num: "03",
      icon: DentalShieldIcon,
      badge: "BIOLOGICAL HEALING",
      title: "Autologous PRF Therapy",
      desc: "Natural PRF therapy to accelerate recovery and healing.",
      points: ["100% Natural Growth Factors", "Rapid Tissue Regeneration", "Minimizes Post-Op Discomfort"]
    },
    {
      num: "04",
      icon: DentalCrownIcon,
      badge: "SURGICAL INTEGRITY",
      title: "Lifetime Implant Warranty",
      desc: "Certified implants and restorations with structured warranty.",
      points: ["Certified Titanium & Zirconia", "Complimentary Follow-Up Checkups", "Dedicated 24/7 Clinical Concierge"]
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-12 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-12 bg-[#121316] text-white border-y border-white/10 relative overflow-hidden"
    >
      {/* Ambient Gold Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#DCA51B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Masthead */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 reveal-up">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-[1.15] tracking-tight mb-2.5">
            Our Clinical Protocols &amp; <br />
            <span className="italic font-normal text-[#DCA51B]">Patient Guarantees</span><span className="text-[#DCA51B]">.</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-[13px] font-sans font-light leading-relaxed max-w-xl mx-auto">
            Every procedure at Kush Dental Clinic adheres to strict biomimetic principles, gentle delivery, and documented clinical excellence.
          </p>
        </div>

        {/* 4 Compact Obsidian Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-4.5">
          {protocols.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.num}
                className="bg-[#1B1C20] rounded-2xl border border-white/10 hover:border-[#DCA51B]/60 p-4 sm:p-5 shadow-xl hover:shadow-[0_8px_28px_rgba(220,165,27,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-default reveal-up"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-serif font-bold text-xl sm:text-2xl text-[#DCA51B]">
                      {item.num}
                    </span>
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#121316] border border-white/15 flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#121316] group-hover:scale-105 transition-all duration-300 shadow-inner">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>

                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#DCA51B] block font-sans mb-1">
                    {item.badge}
                  </span>

                  <h3 className="font-serif font-bold text-base sm:text-[17px] text-white group-hover:text-[#DCA51B] transition-colors leading-snug mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light mb-3.5">
                    {item.desc}
                  </p>
                </div>

                {/* Point Checkmarks */}
                <div className="pt-3 border-t border-white/10 flex flex-col gap-1.5">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5 text-[11.5px] sm:text-xs text-zinc-300 font-sans">
                      <CheckCircle2 className="w-3 h-3 text-[#DCA51B] shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
