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
      className="py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-y border-[#E8E2D5] overflow-hidden relative"
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Simple & Classic Centered Masthead */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20 reveal-up">
          
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-zinc-900 leading-[1.15] tracking-tight mb-4">
            Modern Technology, <span className="italic font-normal text-[#DCA51B]">Gentle Care</span>.
          </h2>
          
          <p className="text-zinc-600 text-sm sm:text-base lg:text-lg font-sans font-light leading-relaxed max-w-2xl mx-auto">
            Advanced digital dental tools designed to make every visit gentle, accurate, and comfortable.
          </p>
        </div>

        {/* Clean, Classic 4-Pillar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.num}
                className="bg-white rounded-3xl border border-[#E8E2D5] hover:border-[#DCA51B]/50 p-7 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-default reveal-up"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
              >
                <div>
                  {/* Top Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif font-bold text-3xl sm:text-4xl text-[#DCA51B] block">
                      {item.num}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:scale-105 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C49216] block font-sans mb-1.5">
                    {item.subtitle}
                  </span>

                  <h3 className="font-serif font-bold text-xl sm:text-[22px] text-zinc-900 group-hover:text-[#C49216] transition-colors leading-snug mb-3">
                    {item.title}
                  </h3>

                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-sans font-light mb-6">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Highlight Pills */}
                <div className="pt-5 border-t border-[#E8E2D5] flex flex-col gap-2">
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
        <div className="mt-12 lg:mt-16 rounded-2xl bg-white border border-[#E8E2D5] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs reveal-up">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] shrink-0 mx-auto sm:mx-0">
              <DentalShieldIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 font-sans">
                Safe, Minimally Invasive &amp; Digitally Guided Care
              </p>
              <p className="text-xs text-zinc-500 font-sans">
                Every scan and treatment plan is reviewed in person by Dr. Alexander Kush.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-700 font-sans">
              <SmileCurveIcon className="w-4 h-4 text-[#DCA51B]" />
              <span>100% Patient Comfort Focus</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
