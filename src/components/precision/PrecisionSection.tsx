import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { CheckCircle2 } from 'lucide-react';
import { 
  DentalScanIcon, 
  ToothSparkleIcon, 
  DentalImplantIcon, 
  DentalCrownIcon,
  DentalShieldIcon,
  SmileCurveIcon
} from '../common/DentalIcons';

interface TechFeature {
  num: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  desc: string;
  highlights: string[];
}

export const PrecisionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const features: TechFeature[] = [
    {
      num: "01",
      icon: DentalScanIcon,
      title: "Low-Dose 3D Dental Imaging",
      subtitle: "Safe 3D X-Rays",
      desc: "Clear 3D imaging maps your jaw and teeth safely with up to 80% lower radiation.",
      highlights: ["Low Radiation", "Fast 3D Mapping"]
    },
    {
      num: "02",
      icon: ToothSparkleIcon,
      title: "Digital Optical Tooth Scans",
      subtitle: "No Messy Putty",
      desc: "Comfortable optical scans capture your teeth in seconds with zero gag reflex.",
      highlights: ["Zero Gagging", "Instant 3D Preview"]
    },
    {
      num: "03",
      icon: DentalImplantIcon,
      title: "Computer-Guided Surgery",
      subtitle: "Gentle Implant Placement",
      desc: "Digital surgical guides ensure millimeter-accurate implant placement and faster healing.",
      highlights: ["Gentle & Accurate", "Faster Healing"]
    },
    {
      num: "04",
      icon: DentalCrownIcon,
      title: "Durable Ceramic Restorations",
      subtitle: "Enamel-Safe Materials",
      desc: "Tooth-colored ceramic materials that strengthen teeth while saving healthy enamel.",
      highlights: ["Natural Look", "Long-Lasting Strength"]
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-y border-[#E8E2D5] overflow-hidden relative scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Simple & Classic Centered Masthead */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12 reveal-up">
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl text-zinc-900 leading-[1.15] tracking-tight mb-3">
            Modern Technology, <span className="italic font-normal text-[#DCA51B]">Gentle Care</span>.
          </h2>
          
          <p className="text-zinc-600 text-xs sm:text-sm lg:text-base font-sans font-light leading-relaxed max-w-2xl mx-auto">
            Advanced digital dental tools designed to make every visit gentle, accurate, and comfortable.
          </p>
        </div>

        {/* Clean, Classic 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.num}
                className="bg-white rounded-3xl border border-[#E8E2D5] hover:border-[#DCA51B]/50 p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-default reveal-up"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
              >
                <div>
                  {/* Top Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif font-bold text-2xl sm:text-3xl text-[#DCA51B] block">
                      {item.num}
                    </span>
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:scale-105 transition-all duration-300">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#C49216] block font-sans mb-1">
                    {item.subtitle}
                  </span>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-900 group-hover:text-[#C49216] transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>

                  <p className="text-zinc-600 text-xs sm:text-[13px] leading-relaxed font-sans font-light mb-4">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Highlight Pills */}
                <div className="pt-4 border-t border-[#E8E2D5] flex flex-col gap-1.5">
                  {item.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-zinc-700 font-sans">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Subtle, Soft Assurance Banner */}
        <div className="mt-8 sm:mt-10 rounded-2xl bg-white border border-[#E8E2D5] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs reveal-up">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] shrink-0 mx-auto sm:mx-0">
              <DentalShieldIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-zinc-900 font-sans">
                Safe, Minimally Invasive &amp; Digitally Guided Care
              </p>
              <p className="text-[11px] text-zinc-500 font-sans">
                Every scan and treatment plan is reviewed in person by Dr. Amit Kumar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 font-sans">
              <SmileCurveIcon className="w-3.5 h-3.5 text-[#DCA51B]" />
              <span>100% Patient Comfort Focus</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
