import React, { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToothIcon, DentalShieldIcon } from '../common/DentalIcons';

/**
 * 4-Point Sparkle Icon matching the mockup
 */
const SparkleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
  </svg>
);

/**
 * Circular Frosted Glass Stamp Badge ("YOUR SMILE · OUR PRIORITY")
 * Features continuous slow rotation and center gold tooth icon
 */
const CircularStampBadge: React.FC<{ className?: string; mini?: boolean }> = ({ 
  className = '', 
  mini = false 
}) => (
  <div 
    className={`relative rounded-full bg-white/85 backdrop-blur-md border border-[#E8DFC8] shadow-xl flex items-center justify-center select-none group transition-transform duration-500 hover:scale-105 ${
      mini 
        ? 'w-14 h-14 sm:w-16 sm:h-16 p-1' 
        : 'w-24 h-24 sm:w-28 sm:h-28 lg:w-30 lg:h-30 xl:w-32 xl:h-32 p-1.5'
    } ${className}`}
  >
    {/* Rotating Circular Text */}
    <svg viewBox="0 0 120 120" className="w-full h-full animate-[spin_26s_linear_infinite] pointer-events-none">
      <defs>
        <path
          id="stampCirclePath"
          d="M 60,60 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
          fill="none"
        />
      </defs>
      <text className={`${mini ? 'text-[8.5px]' : 'text-[9.5px]'} font-sans font-bold tracking-[0.26em] uppercase fill-[#8C7A5E]`}>
        <textPath href="#stampCirclePath" startOffset="0%">
          YOUR SMILE · OUR PRIORITY · 
        </textPath>
      </text>
    </svg>

    {/* Center Gold Tooth Icon */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className={`${
        mini ? 'w-6 h-6' : 'w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10'
      } rounded-full bg-[#FAF5EC] border border-[#DCA51B]/40 flex items-center justify-center text-[#DCA51B] shadow-inner group-hover:scale-110 transition-transform duration-300`}>
        <ToothIcon className={mini ? 'w-3 h-3' : 'w-4 h-4 sm:w-5 sm:h-5'} strokeWidth={1.8} />
      </div>
    </div>
  </div>
);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const features = [
    {
      icon: ToothIcon,
      title: "Gentle, Painless Touch",
      desc: "Painless local numbing and whisper-quiet instruments."
    },
    {
      icon: SparkleIcon,
      title: "Natural Smile Artistry",
      desc: "Preserving natural tooth enamel with custom-matched ceramics."
    },
    {
      icon: DentalShieldIcon,
      title: "Precision 3D Diagnostics",
      desc: "Sub-millimeter 3D imaging and computer guidance for accuracy."
    }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="py-14 sm:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-b border-[#E8E2D5] overflow-hidden relative scroll-mt-24 sm:scroll-mt-28"
    >
      {/* ------------------------------------------------------------- */}
      {/* SVG Clip Path Definitions for Desktop Flanking Arches         */}
      {/* ------------------------------------------------------------- */}
      <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true">
        <defs>
          {/* Left Wing Inward Concave Arch Clip */}
          <clipPath id="leftWingArchPath" clipPathUnits="userSpaceOnUse">
            <path d="M 0,0 L 260,0 C 340,30 380,80 380,130 C 380,240 230,300 230,400 C 230,500 390,560 390,670 C 390,720 280,780 180,800 L 0,800 Z" />
          </clipPath>

          {/* Right Wing Inward Concave Arch Clip */}
          <clipPath id="rightWingArchPath" clipPathUnits="userSpaceOnUse">
            <path d="M 140,0 L 400,0 L 400,800 L 220,800 C 120,780 10,720 10,670 C 10,560 170,500 170,400 C 170,300 20,240 20,130 C 20,80 60,30 140,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ------------------------------------------------------------- */}
      {/* DESKTOP FLANKING WINGS: Arched Photo Cutouts (lg+ screens)    */}
      {/* ------------------------------------------------------------- */}

      {/* LEFT WING: Operatory Suite */}
      <div 
        className="hidden lg:block absolute left-0 top-0 bottom-0 w-[26%] xl:w-[29%] 2xl:w-[32%] z-0 select-none pointer-events-none"
      >
        <div className="relative w-full h-full">
          <svg 
            viewBox="0 0 400 800" 
            preserveAspectRatio="none" 
            className="w-full h-full"
          >
            {/* Operatory Suite Image clipped to arched portal */}
            <g clipPath="url(#leftWingArchPath)">
              <image 
                href="/images/about/operatory-suite.jpg" 
                x="0" 
                y="0" 
                width="400" 
                height="800" 
                preserveAspectRatio="xMidYMid slice" 
              />
              {/* Soft Ambient Inner Vignette */}
              <rect x="0" y="0" width="400" height="800" fill="url(#leftVignette)" opacity="0.3" />
            </g>

            {/* Subtle Gradient Definition */}
            <defs>
              <linearGradient id="leftVignette" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
                <stop offset="80%" stopColor="#FAF7F2" stopOpacity="0" />
                <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Glowing Golden Rim on inner arch edge */}
            <path 
              d="M 260,0 C 340,30 380,80 380,130 C 380,240 230,300 230,400 C 230,500 390,560 390,670 C 390,720 280,780 180,800" 
              fill="none" 
              stroke="#DCA51B" 
              strokeWidth="4" 
              strokeOpacity="0.35" 
            />
            {/* Crisp Warm Cream Rim Stroke */}
            <path 
              d="M 260,0 C 340,30 380,80 380,130 C 380,240 230,300 230,400 C 230,500 390,560 390,670 C 390,720 280,780 180,800" 
              fill="none" 
              stroke="#E8DAC5" 
              strokeWidth="2.5" 
            />
          </svg>

          {/* Floating Glass Stamp Badge */}
          <div className="absolute bottom-8 left-6 xl:bottom-12 xl:left-8 pointer-events-auto z-20">
            <CircularStampBadge />
          </div>
        </div>
      </div>

      {/* RIGHT WING: Reception Lounge */}
      <div 
        className="hidden lg:block absolute right-0 top-0 bottom-0 w-[26%] xl:w-[29%] 2xl:w-[32%] z-0 select-none pointer-events-none"
      >
        <div className="relative w-full h-full">
          <svg 
            viewBox="0 0 400 800" 
            preserveAspectRatio="none" 
            className="w-full h-full"
          >
            {/* Reception Lounge Image clipped to arched portal */}
            <g clipPath="url(#rightWingArchPath)">
              <image 
                href="/images/about/reception-lounge.jpg" 
                x="0" 
                y="0" 
                width="400" 
                height="800" 
                preserveAspectRatio="xMidYMid slice" 
              />
              {/* Soft Ambient Inner Vignette */}
              <rect x="0" y="0" width="400" height="800" fill="url(#rightVignette)" opacity="0.3" />
            </g>

            {/* Subtle Gradient Definition */}
            <defs>
              <linearGradient id="rightVignette" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
                <stop offset="80%" stopColor="#FAF7F2" stopOpacity="0" />
                <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Glowing Golden Rim on inner arch edge */}
            <path 
              d="M 140,0 C 60,30 20,80 20,130 C 20,240 170,300 170,400 C 170,500 10,560 10,670 C 10,720 120,780 220,800" 
              fill="none" 
              stroke="#DCA51B" 
              strokeWidth="4" 
              strokeOpacity="0.35" 
            />
            {/* Crisp Warm Cream Rim Stroke */}
            <path 
              d="M 140,0 C 60,30 20,80 20,130 C 20,240 170,300 170,400 C 170,500 10,560 10,670 C 10,720 120,780 220,800" 
              fill="none" 
              stroke="#E8DAC5" 
              strokeWidth="2.5" 
            />
          </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER STAGE CONTENT: Eyebrow, Title, Cards, CTA & Divider     */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-[780px] xl:max-w-[850px] mx-auto relative z-10 text-center">

        {/* 1. Delicate Top Eyebrow: — MODERN DENTAL CARE — */}
        <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4 reveal-up">
          <span className="w-8 sm:w-12 h-[1px] bg-[#DCA51B]/40" />
          <span className="text-[10.5px] sm:text-xs font-sans font-bold tracking-[0.22em] text-[#B88A44] uppercase">
            MODERN DENTAL CARE
          </span>
          <span className="w-8 sm:w-12 h-[1px] bg-[#DCA51B]/40" />
        </div>

        {/* 2. Centered Editorial Headline */}
        <div className="mb-3 sm:mb-4 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[45px] xl:text-[52px] text-zinc-900 leading-[1.12] tracking-tight font-normal">
            Dentistry designed<br />
            <span className="italic font-normal text-[#DCA51B]">to feel peaceful, precise</span><br />
            <span className="italic font-normal text-[#DCA51B]">&amp; personal.</span>
          </h2>
        </div>

        {/* 3. Centered Subtitle */}
        <div className="mb-6 sm:mb-8 lg:mb-10 reveal-up">
          <p className="max-w-lg mx-auto text-zinc-600 text-xs sm:text-sm lg:text-[14.5px] font-sans font-light leading-relaxed">
            Calm hospitality, modern technology, and personalized care designed for your comfort.
          </p>
        </div>

        {/* 4. MOBILE / TABLET ARCHED SHOWCASE (< 1024px) */}
        <div className="lg:hidden mb-7 sm:mb-9 reveal-up">
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 p-2 sm:p-2.5 bg-white/70 backdrop-blur-xs rounded-3xl border border-[#E8E2D5] shadow-xs max-w-sm sm:max-w-md mx-auto">
            {/* Left Photo: Operatory Suite with curved arch styling */}
            <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-inner group">
              <img 
                src="/images/about/operatory-suite.jpg" 
                alt="Kush Dental Operatory Suite" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Miniature Stamp Badge */}
              <div className="absolute bottom-2 left-2">
                <CircularStampBadge mini={true} />
              </div>
            </div>

            {/* Right Photo: Reception Lounge with glowing tooth logo */}
            <div className="relative h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-inner group">
              <img 
                src="/images/about/reception-lounge.jpg" 
                alt="Kush Dental Reception Lounge" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 5. The 3 Feature Cards (All Warm White & Cream Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-4.5 mb-7 sm:mb-9 lg:mb-10 reveal-up">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl sm:rounded-3xl border border-[#EBDCC8]/80 hover:border-[#DCA51B] p-5 sm:p-5.5 lg:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-400 ease-out group cursor-default text-center flex flex-col items-center justify-start"
              >
                {/* Circular Gold Icon Badge */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FAF5EC] border border-[#F0DCB8] flex items-center justify-center text-[#DCA51B] mb-3 sm:mb-3.5 group-hover:scale-110 group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-400 shadow-xs">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" strokeWidth={1.8} />
                </div>

                {/* Card Title */}
                <h3 className="font-serif font-bold text-sm sm:text-base text-zinc-900 group-hover:text-[#DCA51B] transition-colors duration-300 leading-snug mb-1.5 sm:mb-2">
                  {feature.title}
                </h3>

                {/* Card Description */}
                <p className="text-zinc-600 text-xs sm:text-[13px] font-sans font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 6. Centered Solid Gold Pill Button & Tooth Divider */}
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-4.5 reveal-up">
          <Link 
            to="/about" 
            className="btn-gold-solid group inline-flex items-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full font-sans font-bold text-xs sm:text-[13px] tracking-wider uppercase cursor-pointer shadow-lg shadow-[#DCA51B]/20"
          >
            <span>DISCOVER OUR CLINIC</span>
            <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>

          {/* Delicate Bottom Accent Divider: —— 🦷 —— */}
          <div className="flex items-center justify-center gap-3 pt-1 pointer-events-none select-none">
            <span className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#DCA51B]/50" />
            <ToothIcon className="w-3.5 h-3.5 text-[#DCA51B]" strokeWidth={1.5} />
            <span className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#DCA51B]/50" />
          </div>
        </div>

      </div>
    </section>
  );
};
