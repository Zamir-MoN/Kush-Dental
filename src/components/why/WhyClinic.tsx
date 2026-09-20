import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { 
  Award,
  HeartHandshake,
  Scan,
  ShieldCheck,
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';

export const WhyClinic: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section 
      ref={sectionRef} 
      className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-y border-[#E8E2D5] overflow-hidden relative scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Subtle Background Watermark / Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-tr from-[#DCA51B]/[0.04] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Masthead Header: Editorial & Asymmetric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end mb-8 sm:mb-10 lg:mb-12">
          
          <div className="lg:col-span-8">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[44px] xl:text-5xl text-zinc-900 leading-[1.14] tracking-tight reveal-up">
              Why Patients Choose <br />
              <span className="italic font-normal text-[#DCA51B]">Kush Dental Clinic</span>.
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end lg:pb-1 reveal-up">
            <p className="text-zinc-600 text-xs sm:text-sm lg:text-[15px] font-sans font-light leading-relaxed border-l-2 border-[#DCA51B]/60 pl-4 sm:pl-5">
              Gentle care, experienced dentists, and modern 3D technology for a comfortable, stress-free dental visit.
            </p>
          </div>

        </div>
        
        {/* Asymmetrical Luxury Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* ----------------- PILLAR 01: CLINICAL MASTERY ----------------- */}
          <motion.div 
            className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-white via-[#FCFAF7] to-[#F8F4ED] border border-[#E8E2D5] hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-2xl hover:shadow-[#DCA51B]/15 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DCA51B] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />

            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-[#DCA51B]/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Subtle Contour Lines Watermark on Hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-500 overflow-hidden">
              <svg className="w-full h-full object-cover" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50 80 C120 40 180 220 360 170 C480 130 540 260 650 220" stroke="#DCA51B" strokeWidth="1.5" />
                <path d="M-30 140 C140 100 200 280 390 230 C510 190 570 320 680 280" stroke="#DCA51B" strokeWidth="1.5" />
                <path d="M-10 200 C160 160 220 340 420 290 C540 250 600 380 710 340" stroke="#DCA51B" strokeWidth="1.5" />
              </svg>
            </div>
            
            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-white group-hover:border-[#DCA51B] group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-[#DCA51B]/25 transition-all duration-400">
                  <Award className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-sans font-bold text-[#C49216] block">
                    PILLAR 01
                  </span>
                  <span className="text-xs text-zinc-500 font-sans font-medium">
                    Experienced Dentists
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#E8E2D5] group-hover:text-[#DCA51B]/40 group-hover:scale-110 transition-all duration-400 select-none">
                01
              </span>
            </div>

            {/* Middle: Title & Narrative */}
            <div className="relative z-10 mb-5 sm:mb-6">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[25px] font-bold text-zinc-900 mb-2.5 leading-snug group-hover:text-[#141518] transition-colors">
                Expert Dental Surgeons &amp; Specialists
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-sans font-normal max-w-xl">
                Led by Dr. Amit Kumar, our team delivers personalized, gentle care for every treatment.
              </p>
            </div>

            {/* Bottom: Feature Pills */}
            <div className="relative z-10 pt-4 sm:pt-5 border-t border-[#E8E2D5] flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>15+ Years Clinical Experience</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
                <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Personalized Doctor Care</span>
              </div>
            </div>
          </motion.div>

          {/* ----------------- PILLAR 02: BESPOKE HOSPITALITY ----------------- */}
          <motion.div 
            className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-white via-[#FCFAF7] to-[#F8F4ED] border border-[#E8E2D5] hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-2xl hover:shadow-[#DCA51B]/15 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DCA51B] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />

            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-[#DCA51B]/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-white group-hover:border-[#DCA51B] group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-[#DCA51B]/25 transition-all duration-400">
                  <HeartHandshake className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-sans font-bold text-[#C49216] block">
                    PILLAR 02
                  </span>
                  <span className="text-xs text-zinc-500 font-sans font-medium">
                    Pain-Free Visits
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#E8E2D5] group-hover:text-[#DCA51B]/40 group-hover:scale-110 transition-all duration-400 select-none">
                02
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 mb-5 sm:mb-6">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[25px] font-bold text-zinc-900 mb-2.5 leading-snug group-hover:text-[#141518] transition-colors">
                Anxiety-Free, Comfortable Dentistry
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                Gentle local numbing, quiet private suites, and zero waiting room delays.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="relative z-10 pt-4 sm:pt-5 border-t border-[#E8E2D5] flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
                <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Gentle Sedation Options</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
                <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Zero Wait Time</span>
              </div>
            </div>
          </motion.div>

          {/* ----------------- PILLAR 03: SUB-MICRON TECH ----------------- */}
          <motion.div 
            className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-white via-[#FCFAF7] to-[#F8F4ED] border border-[#E8E2D5] hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-2xl hover:shadow-[#DCA51B]/15 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DCA51B] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />

            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-[#DCA51B]/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-white group-hover:border-[#DCA51B] group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-[#DCA51B]/25 transition-all duration-400">
                  <Scan className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-sans font-bold text-[#C49216] block">
                    PILLAR 03
                  </span>
                  <span className="text-xs text-zinc-500 font-sans font-medium">
                    Modern 3D Tech
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#E8E2D5] group-hover:text-[#DCA51B]/40 group-hover:scale-110 transition-all duration-400 select-none">
                03
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 mb-5 sm:mb-6">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[25px] font-bold text-zinc-900 mb-2.5 leading-snug group-hover:text-[#141518] transition-colors">
                Digital 3D Dental Scans &amp; Planning
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                No messy putty. Optical scanners capture your teeth in seconds with millimeter precision.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="relative z-10 pt-4 sm:pt-5 border-t border-[#E8E2D5] flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Mess-Free 3D Scans</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
                <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Guided Dental Implants</span>
              </div>
            </div>
          </motion.div>

          {/* ----------------- PILLAR 04: BIOMIMETIC LONGEVITY ----------------- */}
          <motion.div 
            className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-white via-[#FCFAF7] to-[#F8F4ED] border border-[#E8E2D5] hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-2xl hover:shadow-[#DCA51B]/15 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DCA51B] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />

            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-[#DCA51B]/15 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-white group-hover:border-[#DCA51B] group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-[#DCA51B]/25 transition-all duration-400">
                  <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-sans font-bold text-[#C49216] block">
                    PILLAR 04
                  </span>
                  <span className="text-xs text-zinc-500 font-sans font-medium">
                    Tooth Preservation
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#E8E2D5] group-hover:text-[#DCA51B]/40 group-hover:scale-110 transition-all duration-400 select-none">
                04
              </span>
            </div>

            {/* Middle: Title & Narrative */}
            <div className="relative z-10 mb-5 sm:mb-6">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[25px] font-bold text-zinc-900 mb-2.5 leading-snug group-hover:text-[#141518] transition-colors">
                Natural Tooth &amp; Enamel Protection
              </h3>
              <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed font-sans font-normal max-w-xl">
                Biomimetic techniques designed to preserve healthy natural enamel for life.
              </p>
            </div>

            {/* Bottom: Feature Pills */}
            <div className="relative z-10 pt-4 sm:pt-5 border-t border-[#E8E2D5] flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
                <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Metal-Free Ceramic</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-700 text-xs font-sans font-medium group-hover:bg-white group-hover:border-[#DCA51B]/40 group-hover:shadow-xs transition-all duration-300">
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
