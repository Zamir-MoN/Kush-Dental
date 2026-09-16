import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ToothSparkleIcon, SmileCurveIcon, DentalShieldIcon } from '../common/DentalIcons';
import { AnimatedWaveContours } from '../common/AnimatedWaveContours';
import { motion } from 'framer-motion';
import { useLoading } from '../../context/LoadingContext';

export const Hero: React.FC = () => {
  const { isLoaded } = useLoading();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isReady = isLoaded || isMobile;

  return (
    <section className="relative w-full pt-20 sm:pt-24 lg:pt-24 xl:pt-26 min-h-[520px] lg:h-screen lg:min-h-[620px] lg:max-h-[900px] 2xl:max-h-[1020px] bg-[#141518] overflow-hidden flex flex-col justify-center">
      
      {/* 1. Full-Bleed Split Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Right Side: Natural Clinic Interior Background with Gentle Scale & Exposure Fade */}
        <motion.div 
          initial={{ opacity: isMobile ? 1 : 0, scale: isMobile ? 1 : 1.08 }}
          animate={isReady ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
          transition={{ duration: isMobile ? 0.3 : 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 lg:left-[38%] right-0 h-full overflow-hidden"
        >
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop" 
            srcSet="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=75&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop 1200w"
            sizes="(max-width: 768px) 100vw, 60vw"
            alt="Kush Dental Clinic Luxury Setting" 
            loading="lazy"
            fetchPriority="low"
            decoding="async"
            width="1200"
            height="800"
            className="w-full h-full object-cover object-center scale-100 brightness-[0.92]"
          />
          {/* Subtle soft fade to smoothly blend the image without heavy dark shading */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141518]/90 via-[#141518]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141518]/50 via-transparent to-transparent" />
        </motion.div>

        {/* Diagonal Slanted Dark Obsidian Backdrop (Desktop only) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={isReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
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
        </motion.div>

      </div>

      {/* 2. Doctor Visual on Right (Tastefully enlarged, majestic presence with entrance glide) */}
      <motion.div 
        initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 55, scale: isMobile ? 1 : 0.96 }}
        animate={isReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 55, scale: 0.96 }}
        transition={{ duration: isMobile ? 0.3 : 1.0, delay: isMobile ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="flex absolute right-0 sm:right-2 md:right-4 lg:right-6 xl:right-10 2xl:right-16 bottom-0 z-20 pointer-events-none w-[46%] sm:w-[42%] md:w-[38%] lg:w-[38%] xl:w-[36%] 2xl:w-[34%] max-w-[240px] sm:max-w-[320px] md:max-w-[390px] lg:max-w-[470px] xl:max-w-[530px] 2xl:max-w-[580px] h-[66%] sm:h-[72%] md:h-[76%] lg:h-[80%] xl:h-[83%] max-h-[640px] 2xl:max-h-[720px] items-end justify-end"
      >
        <img 
          src="/images/doctor-hero.png" 
          alt="Dr. Amit Kumar - Chief Dental Surgeon" 
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="580"
          height="720"
          className="max-h-full max-w-full w-auto h-full object-contain object-bottom object-right-bottom filter drop-shadow-[0_16px_36px_rgba(0,0,0,0.45)] select-none"
        />

        {/* Floating Doctor Credentials Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.88, y: 15 }}
          animate={isReady ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.88, y: 15 }}
          transition={{ duration: 0.7, delay: isMobile ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:flex absolute bottom-4 lg:bottom-6 -left-4 lg:-left-8 pointer-events-auto bg-black/40 backdrop-blur-md border border-white/20 hover:border-[#DCA51B]/50 rounded-2xl p-2.5 sm:p-3 shadow-2xl items-center gap-2.5 transition-colors duration-300"
        >
          <div className="w-8 h-8 rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/35 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-[#DCA51B]" />
          </div>
          <div className="pr-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-bold text-white font-serif drop-shadow-sm">Dr. Amit Kumar</p>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
            </div>
            <p className="text-[10px] text-zinc-200 font-sans drop-shadow-sm">Chief Dental Surgeon</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Hero Main Content Container (Zoomed-In, Bold & High-Impact) */}
      <div className="relative z-30 max-w-[1440px] 2xl:max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-12 w-full pt-3 sm:pt-4 md:pt-5 pb-5 sm:pb-7 lg:py-6 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Bold, Confident Typography & Metrics */}
          <div className="w-[55%] sm:w-[56%] md:w-[58%] lg:w-full lg:col-span-7 xl:col-span-7 flex flex-col justify-center">
            
            <div>

              {/* Bold, Grand Headline with Cascading Staggered Reveal */}
              <h1 className="font-serif text-[28px] sm:text-5xl lg:text-[54px] xl:text-[66px] 2xl:text-[76px] leading-[1.08] sm:leading-[1.06] text-white tracking-tight mb-2 sm:mb-3.5 overflow-hidden">
                <motion.span 
                  initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 35 }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
                  transition={{ duration: isMobile ? 0.3 : 0.75, delay: isMobile ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  Excellence
                </motion.span>
                <motion.span 
                  initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 35 }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
                  transition={{ duration: isMobile ? 0.3 : 0.75, delay: isMobile ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  in Every
                </motion.span>
                <motion.span 
                  initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 35 }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
                  transition={{ duration: isMobile ? 0.3 : 0.75, delay: isMobile ? 0 : 0.40, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  <span className="italic font-normal">Smile</span><span className="text-[#DCA51B]">.</span>
                </motion.span>
              </h1>

              {/* Clear Subtitle */}
              <motion.p 
                initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 16 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
                className="text-zinc-200 font-sans font-light text-[11px] sm:text-base lg:text-[16px] leading-snug sm:leading-relaxed mb-3 sm:mb-5 max-w-[215px] sm:max-w-xl"
              >
                Gentle dental care, modern 3D technology, and natural smiles crafted to last.
              </motion.p>

              {/* Action Button (Single Option) */}
              <motion.div 
                initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 18, scale: isMobile ? 1 : 0.96 }}
                animate={isReady ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.96 }}
                transition={{ duration: isMobile ? 0.3 : 0.7, delay: isMobile ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center mb-3 sm:mb-5"
              >
                <Link 
                  to="/book" 
                  className="btn-gold-luxury group cursor-pointer shadow-xl shadow-[#DCA51B]/25 py-2 sm:py-3.5 px-3.5 sm:px-8 text-[10px] sm:text-sm font-bold tracking-wider"
                >
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
                  <span>BOOK A CONSULTATION</span>
                </Link>
              </motion.div>

              {/* Social Proof Review Pill */}
              <motion.div 
                initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 14 }}
                animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                transition={{ duration: isMobile ? 0.3 : 0.6, delay: isMobile ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-1 sm:gap-2.5 py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-full bg-white/[0.06] border border-white/12 backdrop-blur-md mb-3 sm:mb-5"
              >
                <div className="flex items-center text-[#DCA51B] gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#DCA51B] text-[#DCA51B]" />
                  ))}
                </div>
                <span className="text-[9px] sm:text-xs lg:text-[13px] font-sans text-zinc-200">
                  <strong className="text-white font-semibold">4.9 / 5.0</strong> (850+ Patients)
                </span>
              </motion.div>
            </div>

            {/* Bottom Metrics & Stats Grid (Cascading Classic Reveal) */}
            <div className="pt-1 sm:pt-2 w-full max-w-[215px] sm:max-w-xl">
              <div className="grid grid-cols-3 gap-1.5 sm:gap-3.5">
                
                {/* Stat 1 */}
                <motion.div 
                  initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 20 }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: isMobile ? 0.3 : 0.65, delay: isMobile ? 0 : 0.80, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#DCA51B]/35 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-3.5 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/25 flex items-center justify-center mb-1 group-hover:scale-105 group-hover:bg-[#DCA51B]/25 transition-all text-[#DCA51B]">
                    <ToothSparkleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-serif font-bold text-lg sm:text-[26px] text-white block leading-tight">
                    15+
                  </span>
                  <span className="text-[9px] sm:text-xs text-zinc-300 font-sans block mt-0.5 sm:mt-1 leading-tight font-medium">
                    Years Mastery
                  </span>
                </motion.div>

                {/* Stat 2 */}
                <motion.div 
                  initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 20 }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: isMobile ? 0.3 : 0.65, delay: isMobile ? 0 : 0.90, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#DCA51B]/35 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-3.5 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/25 flex items-center justify-center mb-1 group-hover:scale-105 group-hover:bg-[#DCA51B]/25 transition-all text-[#DCA51B]">
                    <SmileCurveIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-serif font-bold text-lg sm:text-[26px] text-white block leading-tight">
                    12k+
                  </span>
                  <span className="text-[9px] sm:text-xs text-zinc-300 font-sans block mt-0.5 sm:mt-1 leading-tight font-medium">
                    Smiles Restored
                  </span>
                </motion.div>

                {/* Stat 3 */}
                <motion.div 
                  initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 20 }}
                  animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: isMobile ? 0.3 : 0.65, delay: isMobile ? 0 : 1.00, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#DCA51B]/35 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-3.5 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[#DCA51B]/15 border border-[#DCA51B]/25 flex items-center justify-center mb-1 group-hover:scale-105 group-hover:bg-[#DCA51B]/25 transition-all text-[#DCA51B]">
                    <DentalShieldIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span className="font-serif font-bold text-lg sm:text-[26px] text-white block leading-tight">
                    100%
                  </span>
                  <span className="text-[9px] sm:text-xs text-zinc-300 font-sans block mt-0.5 sm:mt-1 leading-tight font-medium">
                    Gentle Care
                  </span>
                </motion.div>

              </div>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
