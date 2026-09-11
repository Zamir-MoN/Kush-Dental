import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Compass, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-screen min-h-[680px] max-h-[960px] pt-[76px] md:pt-[80px] bg-[#141518] overflow-hidden flex flex-col justify-between">
      
      {/* 1. Full-Bleed Split Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        
        {/* Right Side: Warm Luxury Clinic Interior Background */}
        <div className="absolute inset-0 lg:left-[40%] right-0 h-full overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1800&auto=format&fit=crop" 
            alt="Kush Dental Clinic Luxury Setting" 
            className="w-full h-full object-cover object-center filter brightness-[0.82] saturate-[0.85] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141518] via-[#141518]/60 to-transparent lg:from-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141518] via-transparent to-black/20 lg:hidden" />
        </div>

        {/* Diagonal Slanted Dark Obsidian Backdrop (Desktop) */}
        <div 
          className="relative z-10 w-full lg:w-[58%] h-full bg-[#141518] flex flex-col justify-between"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 82% 100%, 0 100%)'
          }}
        >
          {/* Golden Topographic Contour Waves */}
          <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
            <svg 
              className="w-full h-full object-cover" 
              viewBox="0 0 900 800" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M-100 120 C180 80 280 320 540 260 C720 210 800 380 960 330" stroke="#DCA51B" strokeWidth="1.2" />
              <path d="M-80 190 C210 160 310 400 580 340 C760 290 840 460 980 410" stroke="#DCA51B" strokeWidth="1.2" />
              <path d="M-60 260 C240 240 340 480 620 420 C800 370 880 540 1000 490" stroke="#DCA51B" strokeWidth="1.2" />
              <path d="M-40 330 C270 320 370 560 660 500 C840 450 920 620 1020 570" stroke="#DCA51B" strokeWidth="1.2" />
              <path d="M-20 400 C300 400 400 640 700 580 C880 530 960 700 1040 650" stroke="#DCA51B" strokeWidth="1.2" />
              <path d="M0 470 C330 480 430 720 740 660 C920 610 1000 780 1060 730" stroke="#DCA51B" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Golden Geometric Dot Matrix */}
          <div className="hidden lg:block absolute bottom-28 right-20 pointer-events-none opacity-25">
            <div className="grid grid-cols-4 gap-2.5">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#DCA51B]" />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 2. Doctor Cutout anchored strictly to the bottom edge */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
        className="absolute right-0 lg:right-6 xl:right-16 bottom-0 z-20 pointer-events-none w-full lg:w-[48%] xl:w-[45%] h-[380px] sm:h-[480px] md:h-[560px] lg:h-[82%] xl:h-[88%] max-h-[850px] flex items-end justify-center opacity-85 sm:opacity-95 lg:opacity-100"
      >
        <img 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjsF7fRecc_cpRYBxWO2uQqv6p5QiEK2qMKVen5ACqtO1EOb-RzirP3c2f40XbOSsurGlWYbyFcj1XzHMM1OOnIc6XHn2seIDn0Md_trhN2S-LX_IuS-1U1FlUX7Meoq7D_iUJM5j5HcPj0LC5aNeHyxqewceMim6JSE-TNleAq6DFd7uNO1cQpGhlTzDHwNpFqUpmhbimNJFjNbEhPBRYEiHEmbKx4ZlHBY0bqJ8_ZCmIWWS_uj0uc6JH06oCvYNAk24" 
          alt="Dr. Alexander Kush - Chief Dental Surgeon" 
          className="h-full w-auto max-w-none object-contain object-bottom filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)]"
        />
      </motion.div>

      {/* 3. Hero Foreground Content Grid */}
      <div className="relative z-30 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 w-full flex-grow flex flex-col justify-between pt-6 pb-6 sm:pt-10 sm:pb-10 lg:pt-14 lg:pb-12">
        
        {/* Main Text Box */}
        <div className="max-w-xl xl:max-w-2xl pt-2 sm:pt-4">
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            {/* Tag */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 mb-4 md:mb-5"
            >
              <span className="text-[#DCA51B] font-bold text-xs sm:text-[13px] tracking-[0.24em] uppercase font-sans">
                PRECISION DENTISTRY
              </span>
            </motion.div>

            {/* Classic Luxury Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-[76px] xl:text-[84px] leading-[1.05] text-white tracking-tight mb-5 md:mb-6">
              Excellence<br />
              in Every<br />
              <span className="italic font-normal">Smile</span><span className="text-[#DCA51B]">.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-300 font-sans font-normal text-base sm:text-lg md:text-xl leading-relaxed mb-8 md:mb-10 max-w-md">
              Expert clinical artistry. Advanced digital technology. Beautiful, healthy smiles designed to endure.
            </p>

            {/* CTAs with Luxury Shimmer & Animated Icons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <Link 
                to="/book" 
                className="btn-gold-luxury group cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#141518] group-hover:rotate-12 transition-transform duration-300" />
                <span>BOOK A CONSULTATION</span>
              </Link>

              <Link 
                to="/services" 
                className="text-white hover:text-[#DCA51B] font-sans font-bold text-xs sm:text-sm uppercase tracking-wider inline-flex items-center gap-2 transition-colors py-2 border-b border-white/20 hover:border-[#DCA51B] group cursor-pointer"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:text-[#DCA51B] group-hover:translate-x-1.5 transition-all duration-300" />
              </Link>
            </div>
          </motion.div>

        </div>

        {/* 4. Bottom Metrics & Stats Bar with entrance animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="relative z-30 pt-6 sm:pt-8 border-t border-white/10 mt-8 lg:mt-10 max-w-xl"
        >
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 group cursor-default">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#DCA51B]/40 bg-[#DCA51B]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#DCA51B]/20 transition-all duration-300">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#DCA51B] icon-subtle-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
                  10+
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 font-sans leading-tight mt-0.5">
                  Years of Experience
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 group cursor-default">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#DCA51B]/40 bg-[#DCA51B]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#DCA51B]/20 transition-all duration-300">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#DCA51B] icon-subtle-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
                  2K+
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 font-sans leading-tight mt-0.5">
                  Happy Patients
                </span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 group cursor-default">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#DCA51B]/40 bg-[#DCA51B]/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#DCA51B]/20 transition-all duration-300">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#DCA51B] icon-subtle-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
                  100%
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 font-sans leading-tight mt-0.5">
                  Satisfaction
                </span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>

    </section>
  );
};
