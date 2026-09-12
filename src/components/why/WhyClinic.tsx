import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  ToothSparkleIcon, 
  SmileCurveIcon, 
  DentalScanIcon, 
  DentalShieldIcon 
} from '../common/DentalIcons';

export const WhyClinic: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section 
      ref={sectionRef} 
      className="py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-y border-[#E8E2D5] overflow-hidden relative"
    >
      {/* Subtle Background Watermark / Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-[#DCA51B]/[0.03] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Masthead Header: Editorial & Asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end mb-16 lg:mb-20">
          
          <div className="lg:col-span-8">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-zinc-900 leading-[1.12] tracking-tight reveal-up">
              Why Patients Choose <br />
              <span className="italic font-normal text-[#DCA51B]">Kush Dental Clinic</span>.
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end lg:pb-2 reveal-up">
            <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed border-l-2 border-[#DCA51B]/60 pl-5">
              Gentle care, experienced dentists, and modern 3D technology for a comfortable, stress-free dental visit.
            </p>
          </div>

        </div>
        
        {/* Asymmetrical Luxury Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7">
          
          {/* ----------------- PILLAR 01: CLINICAL MASTERY ----------------- */}
          <motion.div 
            className="lg:col-span-7 rounded-3xl bg-[#141518] border border-[#DCA51B]/35 p-8 sm:p-10 lg:p-11 shadow-2xl relative overflow-hidden flex flex-col justify-between group reveal-up"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient Background Topography */}
            <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
              <svg className="w-full h-full object-cover" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50 80 C120 40 180 220 360 170 C480 130 540 260 650 220" stroke="#DCA51B" strokeWidth="1" />
                <path d="M-30 140 C140 100 200 280 390 230 C510 190 570 320 680 280" stroke="#DCA51B" strokeWidth="1" />
                <path d="M-10 200 C160 160 220 340 420 290 C540 250 600 380 710 340" stroke="#DCA51B" strokeWidth="1" />
              </svg>
            </div>
            
            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DCA51B]/15 border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] shadow-inner group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
                  <ToothSparkleIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-[#DCA51B] block">
                    PILLAR 01
                  </span>
                  <span className="text-xs text-zinc-400 font-sans">
                    Experienced Dentists
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-4xl sm:text-5xl text-[#DCA51B]/30 group-hover:text-[#DCA51B]/60 transition-colors duration-300">
                01
              </span>
            </div>

            {/* Middle: Title & Narrative */}
            <div className="relative z-10 mb-8">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-white mb-3.5 leading-snug group-hover:text-[#FAF7F2] transition-colors">
                Expert Dental Surgeons &amp; Specialists
              </h3>
              <p className="text-zinc-300 text-sm sm:text-[15px] leading-relaxed font-sans font-light max-w-xl">
                Led by Dr. Alexander Kush, our team delivers personalized, gentle care for every treatment.
              </p>
            </div>

            {/* Bottom: Feature Pills */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-zinc-200 text-xs font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>15+ Years Clinical Experience</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-zinc-200 text-xs font-sans">
                <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Personalized Doctor Care</span>
              </div>
            </div>
          </motion.div>

          {/* ----------------- PILLAR 02: BESPOKE HOSPITALITY ----------------- */}
          <motion.div 
            className="lg:col-span-5 rounded-3xl bg-white border border-[#E8E2D5] hover:border-[#DCA51B]/50 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group reveal-up relative overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:scale-105 transition-all duration-300">
                  <SmileCurveIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-[#C49216] block">
                    PILLAR 02
                  </span>
                  <span className="text-xs text-zinc-500 font-sans">
                    Pain-Free Visits
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-4xl sm:text-5xl text-[#E8E2D5] group-hover:text-[#DCA51B]/40 transition-colors duration-300">
                02
              </span>
            </div>

            {/* Content */}
            <div className="mb-8">
              <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-zinc-900 mb-3 leading-snug group-hover:text-[#C49216] transition-colors">
                Anxiety-Free, Comfortable Dentistry
              </h3>
              <p className="text-zinc-600 text-sm sm:text-[14.5px] leading-relaxed font-sans font-light">
                Gentle local numbing, quiet private suites, and zero waiting room delays.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 border-t border-[#E8E2D5] flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans">
                Gentle Sedation Options
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans">
                Zero Wait Time
              </span>
            </div>
          </motion.div>

          {/* ----------------- PILLAR 03: SUB-MICRON TECH ----------------- */}
          <motion.div 
            className="lg:col-span-5 rounded-3xl bg-white border border-[#E8E2D5] hover:border-[#DCA51B]/50 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group reveal-up relative overflow-hidden"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Row */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:scale-105 transition-all duration-300">
                  <DentalScanIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-[#C49216] block">
                    PILLAR 03
                  </span>
                  <span className="text-xs text-zinc-500 font-sans">
                    Modern 3D Tech
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-4xl sm:text-5xl text-[#E8E2D5] group-hover:text-[#DCA51B]/40 transition-colors duration-300">
                03
              </span>
            </div>

            {/* Content */}
            <div className="mb-8">
              <h3 className="font-serif text-2xl sm:text-[26px] font-bold text-zinc-900 mb-3 leading-snug group-hover:text-[#C49216] transition-colors">
                Digital 3D Dental Scans &amp; Planning
              </h3>
              <p className="text-zinc-600 text-sm sm:text-[14.5px] leading-relaxed font-sans font-light">
                No messy putty. Optical scanners capture your teeth in seconds with millimeter precision.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 border-t border-[#E8E2D5] flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans">
                Mess-Free 3D Scans
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans">
                Guided Dental Implants
              </span>
            </div>
          </motion.div>

          {/* ----------------- PILLAR 04: BIOMIMETIC LONGEVITY ----------------- */}
          <motion.div 
            className="lg:col-span-7 rounded-3xl bg-[#141518] border border-[#DCA51B]/35 p-8 sm:p-10 lg:p-11 shadow-2xl relative overflow-hidden flex flex-col justify-between group reveal-up"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ambient Background Grid Pattern */}
            <div className="absolute right-0 bottom-0 pointer-events-none opacity-20">
              <div className="w-48 h-48 bg-radial from-[#DCA51B]/30 to-transparent blur-2xl" />
            </div>

            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DCA51B]/15 border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] shadow-inner group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300">
                  <DentalShieldIcon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-[#DCA51B] block">
                    PILLAR 04
                  </span>
                  <span className="text-xs text-zinc-400 font-sans">
                    Tooth Preservation
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-4xl sm:text-5xl text-[#DCA51B]/30 group-hover:text-[#DCA51B]/60 transition-colors duration-300">
                04
              </span>
            </div>

            {/* Middle: Title & Narrative */}
            <div className="relative z-10 mb-8">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold text-white mb-3.5 leading-snug group-hover:text-[#FAF7F2] transition-colors">
                Natural Tooth &amp; Enamel Protection
              </h3>
              <p className="text-zinc-300 text-sm sm:text-[15px] leading-relaxed font-sans font-light max-w-xl">
                Biomimetic techniques designed to preserve healthy natural enamel for life.
              </p>
            </div>

            {/* Bottom: Feature Pills */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-zinc-200 text-xs font-sans">
                <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Metal-Free Ceramic</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/12 text-zinc-200 text-xs font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Maximum Enamel Protection</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
