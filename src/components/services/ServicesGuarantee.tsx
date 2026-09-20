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
      desc: "We strictly conserve your natural tooth structure, using microscopic magnification to remove only decay while saving healthy enamel.",
      points: ["Maximum Enamel Retention", "Metal-Free Bio-Ceramics", "Natural Tooth Vitality"]
    },
    {
      num: "02",
      icon: SmileCurveIcon,
      badge: "ANXIETY-FREE COMFORT",
      title: "Gentle Anesthesia Protocol",
      desc: "Computerized anesthetic delivery ensures exact dosing without the sudden pressure sting of traditional dental injections.",
      points: ["Zero Needle Sting", "Quiet Private Treatment Suites", "Warm Herbal Refreshments"]
    },
    {
      num: "03",
      icon: DentalShieldIcon,
      badge: "BIOLOGICAL HEALING",
      title: "Autologous PRF Therapy",
      desc: "Advanced biological platelet-rich fibrin (PRF) extracted naturally to triple recovery speed and prevent post-procedure swelling.",
      points: ["100% Natural Growth Factors", "Rapid Tissue Regeneration", "Minimizes Post-Op Discomfort"]
    },
    {
      num: "04",
      icon: DentalCrownIcon,
      badge: "SURGICAL INTEGRITY",
      title: "Lifetime Implant Warranty",
      desc: "Every implant fixture and handcrafted porcelain restoration includes verified manufacturer certificates and structured warranty.",
      points: ["Certified Titanium & Zirconia", "Complimentary Follow-Up Checkups", "Dedicated 24/7 Clinical Concierge"]
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-12 bg-[#121316] text-white border-y border-white/10 relative overflow-hidden"
    >
      {/* Ambient Gold Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[#DCA51B]/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Section Masthead */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[46px] xl:text-5xl text-white leading-[1.12] tracking-tight mb-4">
            Our Clinical Protocols &amp; <br />
            <span className="italic font-normal text-[#DCA51B]">Patient Guarantees</span><span className="text-[#DCA51B]">.</span>
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed max-w-2xl mx-auto">
            Every procedure at Kush Dental Clinic adheres to strict biomimetic principles, gentle delivery, and documented clinical excellence.
          </p>
        </div>

        {/* 4 Obsidian Protocol Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {protocols.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.num}
                className="bg-[#1B1C20] rounded-3xl border border-white/10 hover:border-[#DCA51B]/60 p-6 sm:p-7 shadow-2xl hover:shadow-[0_12px_36px_rgba(220,165,27,0.12)] transition-all duration-300 flex flex-col justify-between group cursor-default reveal-up"
              >
                <div>
                  {/* Top Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif font-bold text-2xl text-[#DCA51B]">
                      {item.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#121316] border border-white/15 flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#121316] group-hover:scale-105 transition-all duration-300 shadow-inner">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DCA51B] block font-sans mb-1.5">
                    {item.badge}
                  </span>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-[#DCA51B] transition-colors leading-snug mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-sans font-light mb-5">
                    {item.desc}
                  </p>
                </div>

                {/* Point Checkmarks */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                  {item.points.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2 text-xs text-zinc-300 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
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
