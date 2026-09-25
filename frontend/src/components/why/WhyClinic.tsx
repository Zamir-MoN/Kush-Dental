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
          
          {/* ----------------- PILLAR 01: CLINICAL MASTERY (LUXURY OBSIDIAN BLACK) ----------------- */}
          <motion.div 
            className="lg:col-span-7 rounded-3xl bg-[#141518] border border-[#DCA51B]/35 hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-2xl hover:shadow-[#DCA51B]/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DCA51B] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />

            {/* Ambient Background Glow on Hover */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-radial from-[#DCA51B]/20 to-transparent rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Animated Background Wave Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-75"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 900 450" 
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="p1WaveGrad1" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DCA51B" stopOpacity="0.05" />
                  <stop offset="30%" stopColor="#DCA51B" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#F5D77F" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#DCA51B" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="p1WaveGrad2" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.05" />
                  <stop offset="40%" stopColor="#FAF7F2" stopOpacity="0.3" />
                  <stop offset="75%" stopColor="#DCA51B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="p1WaveGrad3" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DCA51B" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#DCA51B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#DCA51B" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              {/* Wave Line 1 */}
              <path 
                d="M 0,180 Q 225,80 450,180 T 900,180 T 1350,180 T 1800,180 T 2250,180 T 2700,180" 
                fill="none" 
                stroke="url(#p1WaveGrad1)" 
                strokeWidth="1.75" 
              >
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  from="0 0" 
                  to="-900 0" 
                  dur="15s" 
                  repeatCount="indefinite" 
                />
              </path>
              {/* Wave Line 2 */}
              <path 
                d="M 0,220 Q 175,340 350,220 T 700,220 T 1050,220 T 1400,220 T 1750,220 T 2100,220 T 2450,220 T 2800,220" 
                fill="none" 
                stroke="url(#p1WaveGrad2)" 
                strokeWidth="1.5" 
              >
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  from="0 0" 
                  to="-700 0" 
                  dur="12s" 
                  repeatCount="indefinite" 
                />
              </path>
              {/* Wave Line 3 */}
              <path 
                d="M 0,280 Q 250,200 500,280 T 1000,280 T 1500,280 T 2000,280 T 2500,280 T 3000,280" 
                fill="none" 
                stroke="url(#p1WaveGrad3)" 
                strokeWidth="2" 
              >
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  from="0 0" 
                  to="-1000 0" 
                  dur="20s" 
                  repeatCount="indefinite" 
                />
              </path>
            </svg>
            
            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#DCA51B]/15 border border-[#DCA51B]/35 text-[#DCA51B] shadow-inner flex items-center justify-center group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:border-[#DCA51B] group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#DCA51B]/30 transition-all duration-400">
                  <Award className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-sans font-bold text-[#DCA51B] block">
                    PILLAR 01
                  </span>
                  <span className="text-xs text-zinc-400 font-sans font-medium">
                    Experienced Dentists
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#DCA51B]/35 group-hover:text-[#DCA51B]/70 group-hover:scale-110 transition-all duration-400 select-none">
                01
              </span>
            </div>

            {/* Middle: Title & Narrative */}
            <div className="relative z-10 mb-5 sm:mb-6">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[25px] font-bold text-white mb-2.5 leading-snug group-hover:text-[#FAF7F2] transition-colors">
                Expert Dental Surgeons &amp; Specialists
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans font-light max-w-xl">
                Led by Dr. Amit Kumar, our team delivers personalized, gentle care for every treatment.
              </p>
            </div>

            {/* Bottom: Feature Pills */}
            <div className="relative z-10 pt-4 sm:pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-zinc-200 text-xs font-sans group-hover:bg-white/[0.14] group-hover:border-[#DCA51B]/50 transition-all duration-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>15+ Years Clinical Experience</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-zinc-200 text-xs font-sans group-hover:bg-white/[0.14] group-hover:border-[#DCA51B]/50 transition-all duration-300">
                <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Personalized Doctor Care</span>
              </div>
            </div>
          </motion.div>

          {/* ----------------- PILLAR 02: BESPOKE HOSPITALITY (LUXURY IVORY WHITE) ----------------- */}
          <motion.div 
            className="lg:col-span-5 rounded-3xl bg-white border border-[#E8E2D5] hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-2xl hover:shadow-[#DCA51B]/15 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
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

          {/* ----------------- PILLAR 03: SUB-MICRON TECH (LUXURY IVORY WHITE) ----------------- */}
          <motion.div 
            className="lg:col-span-5 rounded-3xl bg-white border border-[#E8E2D5] hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-md hover:shadow-2xl hover:shadow-[#DCA51B]/15 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
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

          {/* ----------------- PILLAR 04: BIOMIMETIC LONGEVITY (LUXURY OBSIDIAN BLACK) ----------------- */}
          <motion.div 
            className="lg:col-span-7 rounded-3xl bg-[#141518] border border-[#DCA51B]/35 hover:border-[#DCA51B] p-6 sm:p-7 lg:p-8 shadow-2xl hover:shadow-[#DCA51B]/20 transition-all duration-500 relative overflow-hidden flex flex-col justify-between group reveal-up cursor-default"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#DCA51B] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center pointer-events-none" />

            {/* Ambient Background Radial Glow */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-radial from-[#DCA51B]/20 to-transparent rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Animated Background Wave Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-75"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 900 450" 
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="p4WaveGrad1" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DCA51B" stopOpacity="0.05" />
                  <stop offset="30%" stopColor="#DCA51B" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#F5D77F" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#DCA51B" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="p4WaveGrad2" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FAF7F2" stopOpacity="0.05" />
                  <stop offset="40%" stopColor="#FAF7F2" stopOpacity="0.3" />
                  <stop offset="75%" stopColor="#DCA51B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="p4WaveGrad3" x1="0" y1="0" x2="900" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DCA51B" stopOpacity="0.08" />
                  <stop offset="50%" stopColor="#DCA51B" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#DCA51B" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              {/* Wave Line 1 */}
              <path 
                d="M 0,180 Q 225,80 450,180 T 900,180 T 1350,180 T 1800,180 T 2250,180 T 2700,180" 
                fill="none" 
                stroke="url(#p4WaveGrad1)" 
                strokeWidth="1.75" 
              >
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  from="0 0" 
                  to="-900 0" 
                  dur="15s" 
                  repeatCount="indefinite" 
                />
              </path>
              {/* Wave Line 2 */}
              <path 
                d="M 0,220 Q 175,340 350,220 T 700,220 T 1050,220 T 1400,220 T 1750,220 T 2100,220 T 2450,220 T 2800,220" 
                fill="none" 
                stroke="url(#p4WaveGrad2)" 
                strokeWidth="1.5" 
              >
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  from="0 0" 
                  to="-700 0" 
                  dur="12s" 
                  repeatCount="indefinite" 
                />
              </path>
              {/* Wave Line 3 */}
              <path 
                d="M 0,280 Q 250,200 500,280 T 1000,280 T 1500,280 T 2000,280 T 2500,280 T 3000,280" 
                fill="none" 
                stroke="url(#p4WaveGrad3)" 
                strokeWidth="2" 
              >
                <animateTransform 
                  attributeName="transform" 
                  type="translate" 
                  from="0 0" 
                  to="-1000 0" 
                  dur="20s" 
                  repeatCount="indefinite" 
                />
              </path>
            </svg>

            {/* Top Row */}
            <div className="relative z-10 flex items-start justify-between mb-5 sm:mb-6">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#DCA51B]/15 border border-[#DCA51B]/35 text-[#DCA51B] shadow-inner flex items-center justify-center group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:border-[#DCA51B] group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#DCA51B]/30 transition-all duration-400">
                  <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.2em] font-sans font-bold text-[#DCA51B] block">
                    PILLAR 04
                  </span>
                  <span className="text-xs text-zinc-400 font-sans font-medium">
                    Tooth Preservation
                  </span>
                </div>
              </div>

              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#DCA51B]/35 group-hover:text-[#DCA51B]/70 group-hover:scale-110 transition-all duration-400 select-none">
                04
              </span>
            </div>

            {/* Middle: Title & Narrative */}
            <div className="relative z-10 mb-5 sm:mb-6">
              <h3 className="font-serif text-xl sm:text-2xl lg:text-[25px] font-bold text-white mb-2.5 leading-snug group-hover:text-[#FAF7F2] transition-colors">
                Natural Tooth &amp; Enamel Protection
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans font-light max-w-xl">
                Biomimetic techniques designed to preserve healthy natural enamel for life.
              </p>
            </div>

            {/* Bottom: Feature Pills */}
            <div className="relative z-10 pt-4 sm:pt-5 border-t border-white/10 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-zinc-200 text-xs font-sans group-hover:bg-white/[0.14] group-hover:border-[#DCA51B]/50 transition-all duration-300">
                <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
                <span>Metal-Free Ceramic</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.07] border border-white/15 text-zinc-200 text-xs font-sans group-hover:bg-white/[0.14] group-hover:border-[#DCA51B]/50 transition-all duration-300">
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
