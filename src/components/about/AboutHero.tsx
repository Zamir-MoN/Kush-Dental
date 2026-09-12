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
      className="w-full bg-[#FAF7F2] text-zinc-900 pt-28 sm:pt-36 pb-20 lg:pb-28 relative overflow-hidden border-b border-[#E8E2D5]"
    >
      {/* Background Topographic Wave Contours (Golden Luxury Wave Flow) */}
      <AnimatedWaveContours />

      {/* Radial Gold Ambient Glow */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#DCA51B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* 1. Centered Breadcrumb Navigation */}
        <div className="reveal-up mb-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">
          <Link to="/" className="hover:text-[#DCA51B] transition-colors">Home</Link>
          <span className="text-zinc-300">/</span>
          <span className="text-[#DCA51B]">About Our Practice</span>
        </div>

        {/* 2. Grand Centered Editorial Masthead */}
        <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-14 reveal-up">

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal leading-[1.1] text-zinc-900 mb-4 tracking-tight">
            Modern Dentistry, <br />
            <span className="italic font-normal text-[#DCA51B]">Personalized Care</span><span className="text-[#DCA51B]">.</span>
          </h1>

          {/* Subtitle / Mission Statement */}
          <p className="text-zinc-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-light mb-8">
            Experienced dentists, gentle care, and modern 3D technology in a welcoming clinic.
          </p>

          {/* Centered Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/book" 
              className="btn-gold-luxury group cursor-pointer py-3.5 px-8 text-xs sm:text-sm font-bold tracking-wider shadow-lg shadow-[#DCA51B]/20 hover:shadow-xl hover:shadow-[#DCA51B]/30"
            >
              <Calendar className="w-4 h-4 text-[#141518]" />
              <span>BOOK A CONSULTATION</span>
            </Link>
            
            <a 
              href="#standard" 
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#E8E2D5] hover:border-[#DCA51B]/60 bg-white hover:bg-zinc-50 text-zinc-800 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-xs"
            >
              <span>OUR PHILOSOPHY</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DCA51B]" />
            </a>
          </div>

        </div>

        {/* 3. Architectural 3-Card Balanced Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-end mb-16 lg:mb-20">
          
          {/* Card 1: Left - Operatory Suite (Span 4) */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden relative group border border-[#E8E2D5] bg-white shadow-md hover:shadow-xl transition-all duration-500 h-[280px] sm:h-[340px] reveal-up">
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop" 
              alt="State of the Art Operatory Suite" 
              className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Floating Top Tag */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E2D5] flex items-center gap-2 shadow-sm">
              <ToothSparkleIcon className="w-3.5 h-3.5 text-[#DCA51B]" />
              <span className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-wider font-sans">
                Modern Clinic Suites
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="font-serif font-bold text-lg text-white">Private Operatory Rooms</p>
              <p className="text-xs text-zinc-200 font-sans mt-0.5">Gentle care in quiet comfort</p>
            </div>
          </div>

          {/* Card 2: Center - Chief Specialist Focal Portrait (Span 4, Featured) */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden relative group border-2 border-[#DCA51B]/70 bg-white shadow-xl hover:shadow-2xl transition-all duration-500 h-[300px] sm:h-[370px] -mt-0 md:-mt-4 reveal-up z-20">
            <img 
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop" 
              alt="Dr. Alexander Kush & Lead Specialists" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

            {/* Top Badge */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#DCA51B]/60 flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DCA51B]" />
              <span className="text-[10.5px] font-bold text-[#DCA51B] uppercase tracking-wider font-sans">
                Experienced Team
              </span>
            </div>

            {/* Bottom Inset Glass Pill */}
            <div className="absolute bottom-5 left-4 right-4 bg-black/40 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-white/25 shadow-xl flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-base text-white">Dr. Alexander Kush &amp; Team</h4>
                  <CheckCircle2 className="w-4 h-4 text-[#DCA51B]" />
                </div>
                <p className="text-[11px] text-zinc-300 font-sans mt-0.5">Licensed Dental Surgeons &amp; Specialists</p>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#DCA51B] bg-[#DCA51B]/20 border border-[#DCA51B]/40 px-2.5 py-1 rounded-full shrink-0">
                Certified
              </div>
            </div>
          </div>

          {/* Card 3: Right - Biomimetic Ceramic Lab (Span 4) */}
          <div className="md:col-span-4 rounded-3xl overflow-hidden relative group border border-[#E8E2D5] bg-white shadow-md hover:shadow-xl transition-all duration-500 h-[280px] sm:h-[340px] reveal-up">
            <img 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop" 
              alt="Biomimetic Ceramic Dental Studio" 
              className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Floating Top Tag */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8E2D5] flex items-center gap-2 shadow-sm">
              <DentalCrownIcon className="w-3.5 h-3.5 text-[#DCA51B]" />
              <span className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-wider font-sans">
                Dental Lab Precision
              </span>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="font-serif font-bold text-lg text-white">Custom Porcelain Lab</p>
              <p className="text-xs text-zinc-200 font-sans mt-0.5">Handcrafted natural veneers &amp; crowns</p>
            </div>
          </div>

        </div>

        {/* 4. Unified Luxury Metrics Ribbon */}
        <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-8 shadow-sm reveal-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5] text-center">
            
            <div className="pt-2 md:pt-0">
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#DCA51B] leading-none mb-2">15+ Years</p>
              <p className="text-xs sm:text-sm text-zinc-900 font-sans font-semibold">Clinical Mastery</p>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Pioneering digital dentistry</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-4">
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-none mb-2">12,000+</p>
              <p className="text-xs sm:text-sm text-zinc-900 font-sans font-semibold">Smiles Transformed</p>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Patients across 40+ countries</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-4">
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 leading-none mb-2">99.4%</p>
              <p className="text-xs sm:text-sm text-zinc-900 font-sans font-semibold">Satisfaction Rate</p>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Verified 5-star clinical ratings</p>
            </div>

            <div className="pt-4 md:pt-0 md:pl-4">
              <p className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#DCA51B] leading-none mb-2">100%</p>
              <p className="text-xs sm:text-sm text-zinc-900 font-sans font-semibold">Digital 3D Workflow</p>
              <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Pre-planned computer precision</p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
