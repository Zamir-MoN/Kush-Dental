import React, { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck
} from 'lucide-react';
import { ToothSparkleIcon, DentalCrownIcon } from '../common/DentalIcons';
import { AnimatedWaveContours } from '../common/AnimatedWaveContours';

export const AboutHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#FAF7F2] text-zinc-900 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 relative overflow-hidden border-b border-[#E8E2D5]"
    >
      {/* Background Topographic Wave Contours (Golden Luxury Wave Flow) */}
      <AnimatedWaveContours />

      {/* Radial Gold Ambient Glow */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#DCA51B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* 1. Centered Breadcrumb Navigation */}
        <div className="reveal-up mb-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">
          <Link to="/" className="hover:text-[#DCA51B] transition-colors">Home</Link>
          <span className="text-zinc-300">/</span>
          <span className="text-[#DCA51B]">About Our Practice</span>
        </div>

        {/* 2. Grand Centered Editorial Masthead */}
        <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-10 reveal-up">

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-normal leading-[1.1] text-zinc-900 mb-3 tracking-tight">
            Modern Dentistry, <br />
            <span className="italic font-normal text-[#DCA51B]">Personalized Care</span><span className="text-[#DCA51B]">.</span>
          </h1>

          {/* Subtitle / Mission Statement */}
          <p className="text-zinc-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans font-light mb-6">
            Experienced dentists, gentle care, and modern 3D technology in a welcoming clinic.
          </p>

          {/* Centered Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link 
              to="/book" 
              className="btn-gold-luxury group cursor-pointer py-3 px-7 text-xs sm:text-sm font-bold tracking-wider shadow-lg shadow-[#DCA51B]/20 hover:shadow-xl hover:shadow-[#DCA51B]/30"
            >
              <Calendar className="w-4 h-4 text-[#141518]" />
              <span>BOOK A CONSULTATION</span>
            </Link>
            
            <a 
              href="#standard" 
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#E8E2D5] hover:border-[#DCA51B]/60 bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-xs"
            >
              <span>OUR PHILOSOPHY</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DCA51B]" />
            </a>
          </div>

        </div>

        {/* 3. Architectural 3-Card Balanced Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-6 items-end mb-10 sm:mb-12">
          
          {/* Card 1: Left - Operatory Suite (Span 4) */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden relative group border border-[#E8E2D5] bg-white shadow-md hover:shadow-xl transition-all duration-500 h-[220px] sm:h-[280px] reveal-up">
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop" 
              alt="State of the Art Operatory Suite" 
              className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Floating Top Tag */}
            <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#E8E2D5] flex items-center gap-1.5 shadow-sm">
              <ToothSparkleIcon className="w-3 h-3 text-[#DCA51B]" />
              <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider font-sans">
                Modern Clinic Suites
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-serif font-bold text-base text-white">Private Operatory Rooms</p>
              <p className="text-[11px] text-zinc-200 font-sans mt-0.5">Gentle care in quiet comfort</p>
            </div>
          </div>

          {/* Card 2: Center - Chief Specialist Focal Portrait (Span 4, Featured) */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden relative group border-2 border-[#DCA51B]/70 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 h-[280px] sm:h-[350px] md:h-[370px] -mt-0 md:-mt-3 reveal-up z-20">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" 
              alt="Dr. Amit Kumar & Lead Specialists" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#DCA51B]/60 flex items-center gap-1.5 shadow-sm">
              <ShieldCheck className="w-3 h-3 text-[#DCA51B]" />
              <span className="text-[10px] font-bold text-[#DCA51B] uppercase tracking-wider font-sans">
                Experienced Team
              </span>
            </div>

            {/* Bottom Inset Glass Pill */}
            <div className="absolute bottom-4 left-3 right-3 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/25 shadow-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-sm text-white">Dr. Amit Kumar &amp; Team</h4>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
                </div>
                <p className="text-[10px] text-zinc-300 font-sans mt-0.5">Licensed Dental Surgeons &amp; Specialists</p>
              </div>
              <div className="text-[9.5px] font-bold uppercase tracking-wider text-[#DCA51B] bg-[#DCA51B]/20 border border-[#DCA51B]/40 px-2 py-0.5 rounded-full shrink-0">
                Certified
              </div>
            </div>
          </div>

          {/* Card 3: Right - Biomimetic Ceramic Lab (Span 4) */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden relative group border border-[#E8E2D5] bg-white shadow-md hover:shadow-xl transition-all duration-500 h-[220px] sm:h-[280px] reveal-up">
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop" 
              alt="Biomimetic Ceramic Dental Studio" 
              className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Floating Top Tag */}
            <div className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#E8E2D5] flex items-center gap-1.5 shadow-sm">
              <DentalCrownIcon className="w-3 h-3 text-[#DCA51B]" />
              <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider font-sans">
                Dental Lab Precision
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-serif font-bold text-base text-white">Custom Porcelain Lab</p>
              <p className="text-[11px] text-zinc-200 font-sans mt-0.5">Handcrafted natural veneers &amp; crowns</p>
            </div>
          </div>

        </div>

        {/* 4. Unified Luxury Metrics Ribbon (Obsidian Edition) */}
        <div className="bg-[#141518] text-white rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl reveal-up relative overflow-hidden">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#DCA51B]/[0.06] rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center relative z-10">
            
            <div className="pt-2 md:pt-0">
              <p className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-none mb-2">
                15<span className="text-[#DCA51B]">+</span> <span className="text-xl sm:text-2xl font-serif italic font-normal text-zinc-400">Years</span>
              </p>
              <p className="text-xs sm:text-sm text-white font-sans font-bold uppercase tracking-[0.14em]">Clinical Mastery</p>
              <p className="text-[11px] text-zinc-400 font-sans mt-1 font-normal">Pioneering digital dentistry</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-4">
              <p className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-none mb-2">
                12,000<span className="text-[#DCA51B]">+</span>
              </p>
              <p className="text-xs sm:text-sm text-white font-sans font-bold uppercase tracking-[0.14em]">Smiles Transformed</p>
              <p className="text-[11px] text-zinc-400 font-sans mt-1 font-normal">Patients across 40+ countries</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-4">
              <p className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-none mb-2">
                99.4<span className="text-[#DCA51B] font-bold">%</span>
              </p>
              <p className="text-xs sm:text-sm text-white font-sans font-bold uppercase tracking-[0.14em]">Satisfaction Rate</p>
              <p className="text-[11px] text-zinc-400 font-sans mt-1 font-normal">Verified 5-star clinical ratings</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-4">
              <p className="font-sans text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-none mb-2">
                100<span className="text-[#DCA51B] font-bold">%</span>
              </p>
              <p className="text-xs sm:text-sm text-white font-sans font-bold uppercase tracking-[0.14em]">Digital 3D Workflow</p>
              <p className="text-[11px] text-zinc-400 font-sans mt-1 font-normal">Pre-planned computer precision</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
