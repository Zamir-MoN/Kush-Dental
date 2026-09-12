import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ToothSparkleIcon, SmileCurveIcon, DentalShieldIcon } from '../common/DentalIcons';
import { AnimatedWaveContours } from '../common/AnimatedWaveContours';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full pt-28 sm:pt-32 md:pt-36 lg:pt-0 min-h-[660px] lg:h-[calc(100vh)] lg:min-h-[660px] lg:max-h-[920px] 2xl:max-h-[1020px] bg-[#141518] overflow-hidden flex flex-col justify-center">
      
      {/* 1. Full-Bleed Split Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Right Side: Natural Clinic Interior Background with Gentle Fade */}
        <div className="absolute inset-0 lg:left-[38%] right-0 h-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1800&auto=format&fit=crop" 
            alt="Kush Dental Clinic Luxury Setting" 
            className="w-full h-full object-cover object-center scale-120 xl:scale-125 brightness-[0.92]"
          />
          {/* Subtle soft fade to smoothly blend the image without heavy dark shading */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141518]/50 via-[#141518]/15 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141518]/40 via-transparent to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#141518]/85 via-[#141518]/70 to-[#141518] lg:hidden" />
        </div>

        {/* Diagonal Slanted Dark Obsidian Backdrop (Desktop only) */}
        <div 
          className="hidden lg:block relative z-10 w-[59%] xl:w-[57%] h-full bg-[#141518]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 84% 100%, 0 100%)'
          }}
        >
          {/* Golden Topographic Contour Waves (Flowing Luxury Current) */}
          <AnimatedWaveContours opacity="opacity-20" />

          {/* Golden Geometric Dot Matrix */}
          <div className="absolute bottom-12 right-20 pointer-events-none opacity-25">
            <div className="grid grid-cols-4 gap-2.5">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#DCA51B]" />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 2. Doctor Visual (Zoomed In, Closer & Prominent with Entire Face In View) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
        className="hidden lg:flex absolute right-0 xl:right-4 2xl:right-10 bottom-0 top-[62px] sm:top-[66px] lg:top-[70px] z-20 pointer-events-none w-[50%] xl:w-[48%] 2xl:w-[45%] items-end justify-center"
      >
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsF7fRecc_cpRYBxWO2uQqv6p5QiEK2qMKVen5ACqtO1EOb-RzirP3c2f40XbOSsurGlWYbyFcj1XzHMM1OOnIc6XHn2seIDn0Md_trhN2S-LX_IuS-1U1FlUX7Meoq7D_iUJM5j5HcPj0LC5aNeHyxqewceMim6JSE-TNleAq6DFd7uNO1cQpGhlTzDHwNpFqUpmhbimNJFjNbEhPBRYEiHEmbKx4ZlHBY0bqJ8_ZCmIWWS_uj0uc6JH06oCvYNAk24" 
          alt="Dr. Alexander Kush - Chief Dental Surgeon" 
          className="h-full w-auto max-w-none object-contain object-bottom filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
        />

        {/* Floating Doctor Credentials Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="absolute bottom-7 xl:bottom-9 left-2 xl:left-6 pointer-events-auto bg-black/20 backdrop-blur-md border border-white/20 hover:border-[#DCA51B]/50 rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center gap-3.5 transition-colors duration-300"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/35 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#DCA51B]" />
          </div>
          <div className="pr-1.5">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-white font-serif drop-shadow-sm">Dr. Alexander Kush</p>
              <CheckCircle2 className="w-4 h-4 text-[#DCA51B]" />
            </div>
            <p className="text-xs text-zinc-200 font-sans drop-shadow-sm">Chief Dental Surgeon & Implantologist</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Hero Main Content Container (Zoomed-In, Bold & High-Impact) */}
      <div className="relative z-30 max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-12 w-full py-5 sm:py-7 lg:py-6 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Bold, Confident Typography & Metrics */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >


              {/* Bold, Grand Headline */}
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-[54px] xl:text-[66px] 2xl:text-[76px] leading-[1.06] text-white tracking-tight mb-3 sm:mb-4">
                Excellence<br />
                in Every<br />
                <span className="italic font-normal">Smile</span><span className="text-[#DCA51B]">.</span>
              </h1>

              {/* Clear Subtitle */}
              <p className="text-zinc-200 font-sans font-light text-sm sm:text-base lg:text-[16px] leading-relaxed mb-5 sm:mb-6 max-w-xl">
                Gentle dental care, modern 3D technology, and natural smiles crafted to last.
              </p>

              {/* Action Button (Single Option) */}
              <div className="flex items-center mb-5 sm:mb-6">
                <Link 
                  to="/book" 
                  className="btn-gold-luxury group cursor-pointer shadow-xl shadow-[#DCA51B]/25 py-3 sm:py-3.5 px-7 sm:px-8 text-xs sm:text-sm font-bold tracking-wider"
                >
                  <Calendar className="w-4 h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
                  <span>BOOK A CONSULTATION</span>
                </Link>
              </div>

              {/* Social Proof Review Pill */}
              <div className="inline-flex items-center gap-2.5 py-1.5 px-3.5 rounded-full bg-white/[0.06] border border-white/12 backdrop-blur-md mb-5 sm:mb-6">
                <div className="flex items-center text-[#DCA51B] gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#DCA51B] text-[#DCA51B]" />
                  ))}
                </div>
                <span className="text-xs sm:text-[13px] font-sans text-zinc-200">
                  <strong className="text-white font-semibold">4.9 / 5.0</strong> from 850+ Happy Patients
                </span>
              </div>
            </motion.div>

            {/* Bottom Metrics & Stats Grid (Zoomed-In, Luxury Modular Cards) */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 sm:pt-2.5 w-full max-w-xl"
            >
              <div className="grid grid-cols-3 gap-3 sm:gap-3.5">
                
                {/* Stat 1 */}
                <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#DCA51B]/35 rounded-2xl p-2.5 sm:p-3 lg:p-3.5 transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/25 flex items-center justify-center mb-1.5 group-hover:scale-105 group-hover:bg-[#DCA51B]/25 transition-all text-[#DCA51B]">
                    <ToothSparkleIcon className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-2xl sm:text-[26px] text-white block leading-tight">
                    15+
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-300 font-sans block mt-1 leading-tight font-medium">
                    Years Mastery
                  </span>
                </div>

                {/* Stat 2 */}
                <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#DCA51B]/35 rounded-2xl p-2.5 sm:p-3 lg:p-3.5 transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/25 flex items-center justify-center mb-1.5 group-hover:scale-105 group-hover:bg-[#DCA51B]/25 transition-all text-[#DCA51B]">
                    <SmileCurveIcon className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-2xl sm:text-[26px] text-white block leading-tight">
                    12k+
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-300 font-sans block mt-1 leading-tight font-medium">
                    Smiles Restored
                  </span>
                </div>

                {/* Stat 3 */}
                <div className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#DCA51B]/35 rounded-2xl p-2.5 sm:p-3 lg:p-3.5 transition-all duration-300 group">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/25 flex items-center justify-center mb-1.5 group-hover:scale-105 group-hover:bg-[#DCA51B]/25 transition-all text-[#DCA51B]">
                    <DentalShieldIcon className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-2xl sm:text-[26px] text-white block leading-tight">
                    100%
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-300 font-sans block mt-1 leading-tight font-medium">
                    Gentle Care
                  </span>
                </div>

              </div>
            </motion.div>

          </div>

          {/* Mobile & Tablet Dedicated Doctor Presentation */}
          <div className="lg:hidden col-span-1 flex flex-col items-center mt-2">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-[#DCA51B]/30 bg-gradient-to-b from-[#1E2025] to-[#141518] shadow-2xl p-4 flex flex-col items-center">
              <div className="w-full h-60 sm:h-72 overflow-hidden rounded-2xl bg-[#18191D] flex items-end justify-center relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsF7fRecc_cpRYBxWO2uQqv6p5QiEK2qMKVen5ACqtO1EOb-RzirP3c2f40XbOSsurGlWYbyFcj1XzHMM1OOnIc6XHn2seIDn0Md_trhN2S-LX_IuS-1U1FlUX7Meoq7D_iUJM5j5HcPj0LC5aNeHyxqewceMim6JSE-TNleAq6DFd7uNO1cQpGhlTzDHwNpFqUpmhbimNJFjNbEhPBRYEiHEmbKx4ZlHBY0bqJ8_ZCmIWWS_uj0uc6JH06oCvYNAk24" 
                  alt="Dr. Alexander Kush" 
                  className="h-full w-auto object-contain object-bottom"
                />
              </div>
              <div className="w-full mt-3 flex items-center justify-between px-1">
                <div>
                  <h3 className="font-serif font-bold text-white text-base">Dr. Alexander Kush</h3>
                  <p className="text-xs text-[#DCA51B] font-sans">Chief Dental Surgeon</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-medium text-emerald-300">Available</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
