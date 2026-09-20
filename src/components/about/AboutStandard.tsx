import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { 
  DentalMirrorIcon, 
  SmileCurveIcon, 
  DentalScanIcon,
  ToothIcon 
} from '../common/DentalIcons';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  Trophy,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface Certificate {
  id: number;
  number: string;
  title: string;
  category: string;
  issuer: string;
  recipient: string;
  year: string;
  badge: string;
  image: string;
  description: string;
  highlights: string[];
  checkpoints: [string, string];
  icon: React.ComponentType<{ className?: string }>;
}

const certificates: Certificate[] = [
  {
    id: 1,
    number: "01 / 04",
    title: "Fellowship in Oral Implantology",
    category: "Surgical Fellowship",
    issuer: "American Academy of Oral Implantology",
    recipient: "Dr. Amit Kumar",
    year: "Board Certified Fellow",
    badge: "Fellowship",
    image: "/images/certificates/cert-1.jpg",
    description: "Conferred in recognition of advanced clinical mastery, 3D computer-guided implantology, and surgical excellence.",
    highlights: ["3D Guided Surgical Protocols", "Advanced Bone & Tissue Regeneration", "International Board Fellow"],
    checkpoints: ["Internationally Recognized", "Advanced Implant Training"],
    icon: ShieldCheck
  },
  {
    id: 2,
    number: "02 / 04",
    title: "Diplomate in Cosmetic Dentistry",
    category: "Aesthetic Accreditation",
    issuer: "American Academy of Cosmetic Dentistry",
    recipient: "Dr. Amit Kumar",
    year: "Accredited Diplomate",
    badge: "Diplomate",
    image: "/images/certificates/cert-2.jpg",
    description: "Highest tier clinical credential for natural smile design, ceramic veneers, and biomimetic aesthetic rehabilitation.",
    highlights: ["Biomimetic Ceramic Veneers", "Digital Smile Architecture", "Microscopic Enamel Preservation"],
    checkpoints: ["Advanced Aesthetic Training", "Globally Recognized"],
    icon: ToothIcon
  },
  {
    id: 3,
    number: "03 / 04",
    title: "Master of Dental Surgery (M.D.S.)",
    category: "Academic Distinction",
    issuer: "Faculty of Dental Surgery & Health Sciences",
    recipient: "Dr. Amit Kumar",
    year: "Honors Distinction",
    badge: "Post-Graduate",
    image: "/images/certificates/cert-3.jpg",
    description: "Conferred with highest honors for academic merit, restorative clinical trials, and surgical distinction.",
    highlights: ["Advanced Restorative Prosthodontics", "Clinical Honors & Merit", "15+ Years Clinical Research"],
    checkpoints: ["Specialized Surgical Training", "Academic Excellence"],
    icon: GraduationCap
  },
  {
    id: 4,
    number: "04 / 04",
    title: "National Dental Excellence Award",
    category: "National Recognition",
    issuer: "National Clinical Care & Dental Standards Board",
    recipient: "Kush Dental Clinic & Dr. Amit Kumar",
    year: "Clinical Mastery Award",
    badge: "Award Plaque",
    image: "/images/certificates/cert-4.jpg",
    description: "Awarded to Kush Dental Clinic for outstanding patient safety standards, five-star satisfaction, and pain-free clinical care.",
    highlights: ["Zero-Pain Sedation Protocol", "100% Digital Workflow", "Top Patient Care Rating"],
    checkpoints: ["Outstanding Patient Care", "Excellence in Dentistry"],
    icon: Trophy
  }
];

export const AboutStandard: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const [activeCertIndex, setActiveCertIndex] = useState<number | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);

  const featuredCert = certificates[featuredIndex];
  const otherCertificates = certificates.filter((_, idx) => idx !== featuredIndex);

  // Close modal with ESC key or navigate with arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeCertIndex === null) return;
      if (e.key === 'Escape') setActiveCertIndex(null);
      if (e.key === 'ArrowRight') setActiveCertIndex((prev) => (prev !== null ? (prev + 1) % certificates.length : null));
      if (e.key === 'ArrowLeft') setActiveCertIndex((prev) => (prev !== null ? (prev - 1 + certificates.length) % certificates.length : null));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCertIndex]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (activeCertIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCertIndex]);

  const activeCert = activeCertIndex !== null ? certificates[activeCertIndex] : null;

  return (
    <section id="standard" ref={sectionRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 scroll-mt-24 sm:scroll-mt-28">
      {/* Masthead */}
      <div className="text-center mb-12 sm:mb-14 reveal-up">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 tracking-tight">
          The Kush <span className="italic font-normal text-[#DCA51B]">Standard</span>.
        </h2>
        <div className="w-12 h-0.5 bg-[#DCA51B] mx-auto mt-4 rounded-full" />
      </div>
      
      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 sm:mb-20 lg:mb-24">
        {/* Card 1 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up">
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300 shrink-0">
              <DentalMirrorIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 group-hover:text-[#DCA51B] transition-colors">
              Expert Dentists
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              Specialized doctors delivering gentle, reliable care for your whole family.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
        
        {/* Card 2 - Focal Obsidian Centerpiece */}
        <div className="bg-[#141518] text-white rounded-3xl border border-[#DCA51B]/50 p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#DCA51B]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#1B1C20] border border-[#DCA51B]/50 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300 shadow-inner shrink-0">
              <SmileCurveIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DCA51B] block font-sans mb-1">
              PATIENT COMFORT FIRST
            </span>
            <h3 className="font-serif font-bold text-xl text-white mb-2 group-hover:text-[#DCA51B] transition-colors">
              Pain-Free Comfort
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Calm private suites and gentle computerized numbing for anxiety-free, soothing dental visits.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#DCA51B]/60 group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6 relative z-10" />
        </div>
        
        {/* Card 3 */}
        <div className="luxury-card rounded-3xl p-7 sm:p-8 flex flex-col justify-between group cursor-default reveal-up">
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center mb-6 text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#141518] group-hover:rotate-6 transition-all duration-300 shrink-0">
              <DentalScanIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h3 className="font-serif font-bold text-xl text-zinc-900 mb-2 group-hover:text-[#DCA51B] transition-colors">
              3D Digital Precision
            </h3>
            <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-light">
              Optical 3D scans and low-dose imaging without messy dental putty.
            </p>
          </div>
          <div className="w-8 h-0.5 bg-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:w-full transition-all duration-500 mt-6" />
        </div>
      </div>

      {/* ----------------- ACHIEVEMENTS & CERTIFICATES GALLERY ----------------- */}
      <div className="reveal-up border-t border-[#E8E2D5] pt-12 sm:pt-16">
        
        {/* Top Section: Hero Split (Left Text + Right Featured Showcase) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8 sm:mb-12">
          
          {/* Left Column: Eyebrow, Title, Subtitle, 3 Badges, Explore Button */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-[1.5px] w-5 bg-[#DCA51B]" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#DCA51B] font-sans">
                  OUR CREDENTIALS
                </span>
                <span className="h-[1.5px] w-8 bg-[#DCA51B]/40" />
              </div>

              {/* Title */}
              <h3 className="font-serif text-3xl sm:text-4xl lg:text-[40px] leading-[1.12] text-zinc-900 tracking-tight mb-4">
                Clinical Achievements &amp; <br className="hidden sm:inline" />
                <span className="italic font-normal text-[#DCA51B]">Certificates</span>.
              </h3>

              {/* Subtitle */}
              <p className="text-zinc-600 text-xs sm:text-sm font-sans font-light leading-relaxed max-w-md mb-6 sm:mb-8">
                Verified fellowships, dental diplomate credentials, and national excellence plaques earned by Dr. Amit Kumar and Kush Dental Clinic.
              </p>

              {/* 3 Badges */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-7 sm:mb-9 max-w-md">
                <div className="flex flex-col items-start">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3E0] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] mb-2.5 shadow-2xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-zinc-800 leading-tight font-sans">
                    Global<br />Recognitions
                  </span>
                </div>

                <div className="flex flex-col items-start">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3E0] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] mb-2.5 shadow-2xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-zinc-800 leading-tight font-sans">
                    Verified<br />Credentials
                  </span>
                </div>

                <div className="flex flex-col items-start">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3E0] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B] mb-2.5 shadow-2xs">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-[12.5px] font-semibold text-zinc-800 leading-tight font-sans">
                    Commitment<br />to Excellence
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setActiveCertIndex(0)}
                className="bg-[#DCA51B] hover:bg-[#E5B22E] text-zinc-950 font-sans font-bold px-6 py-3 rounded-full text-xs uppercase tracking-wider inline-flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>EXPLORE ALL CERTIFICATES</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Featured Showcase Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-[28px] sm:rounded-[32px] bg-[#F8F4EC] border border-[#E8E2D5] p-6 sm:p-7 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300">
              {/* Eyebrow + Counter */}
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="inline-flex items-center gap-2">
                  <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#DCA51B] font-sans">
                    FEATURED CERTIFICATE
                  </span>
                  <span className="h-[1px] w-6 bg-[#DCA51B]/60" />
                </div>
                <span className="text-xs font-semibold text-zinc-500 font-mono tracking-wider">
                  {featuredCert.number}
                </span>
              </div>

              {/* 2-Column Inside Featured Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Left Info */}
                <div className="md:col-span-6 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-2xl sm:text-[26px] lg:text-3xl text-zinc-900 leading-tight mb-2">
                      {featuredCert.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-zinc-600 font-sans mb-5 leading-relaxed">
                      {featuredCert.issuer}
                    </p>
                    
                    <div className="space-y-2.5 mb-6">
                      {featuredCert.checkpoints.map((cp, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#DCA51B] shrink-0" />
                          <span className="text-xs sm:text-[13px] font-sans text-zinc-700 font-medium">{cp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveCertIndex(featuredIndex)}
                      className="text-xs font-bold text-[#8C5D00] hover:text-[#DCA51B] inline-flex items-center gap-1.5 transition-colors cursor-pointer font-sans group/link"
                    >
                      <span>View Certificate</span>
                      <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                    </button>
                  </div>
                </div>

                {/* Right Framed Photo */}
                <div className="md:col-span-6 relative">
                  <div 
                    onClick={() => setActiveCertIndex(featuredIndex)}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-[#E8E2D5] group/img cursor-pointer bg-white"
                  >
                    <img 
                      src={featuredCert.image} 
                      alt={featuredCert.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow">
                        <Eye className="w-5 h-5 text-[#DCA51B]" />
                      </span>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-2 justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setFeaturedIndex((prev) => (prev - 1 + certificates.length) % certificates.length)}
                      aria-label="Previous Certificate"
                      className="w-9 h-9 rounded-full bg-zinc-900 hover:bg-black text-white flex items-center justify-center shadow transition-all active:scale-90 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeaturedIndex((prev) => (prev + 1) % certificates.length)}
                      aria-label="Next Certificate"
                      className="w-9 h-9 rounded-full bg-[#DCA51B] hover:bg-[#E5B22E] text-zinc-950 flex items-center justify-center shadow transition-all active:scale-90 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {otherCertificates.map((cert) => {
            const Icon = cert.icon;
            return (
              <div 
                key={cert.id}
                onClick={() => setFeaturedIndex(cert.id - 1)}
                className="bg-white rounded-[24px] border border-[#E8E2D5] hover:border-[#DCA51B]/70 p-4 sm:p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-4 group cursor-pointer"
              >
                {/* Left: Framed Image */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCertIndex(cert.id - 1);
                  }}
                  className="w-full sm:w-[42%] aspect-[4/3] sm:aspect-auto rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E8E2D5] shrink-0 relative"
                >
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <Eye className="w-4 h-4 text-[#DCA51B]" />
                    </span>
                  </div>
                </div>

                {/* Right: Certificate Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Icon + Number Counter */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#FAF3E0] border border-[#E8E2D5] flex items-center justify-center text-[#DCA51B]">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-400 font-mono">
                        {cert.number}
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="font-serif font-bold text-sm sm:text-[15px] text-zinc-900 group-hover:text-[#8C5D00] transition-colors leading-snug mb-1">
                      {cert.title}
                    </h5>

                    {/* Subtitle / Issuer */}
                    <p className="text-[11px] text-zinc-500 font-sans line-clamp-1 mb-2.5">
                      {cert.issuer}
                    </p>

                    {/* 2 Checkpoints */}
                    <div className="space-y-1 mb-3">
                      {cert.checkpoints.map((cp, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                          <span className="text-[11px] font-sans text-zinc-700 font-normal truncate">
                            {cp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Link */}
                  <div className="pt-2 border-t border-[#E8E2D5]/60 flex items-center justify-start">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCertIndex(cert.id - 1);
                      }}
                      className="text-[11px] font-bold text-[#8C5D00] hover:text-[#DCA51B] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-all font-sans cursor-pointer"
                    >
                      <span>View Certificate</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Certificate Inspection Lightbox Modal (Portaled) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeCert && activeCertIndex !== null && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 lg:p-10">
              {/* Dark Glass Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveCertIndex(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-lg cursor-pointer"
              />

              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="relative z-10 max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D5] flex flex-col lg:flex-row max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveCertIndex(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#141518] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20 shadow-md"
                  aria-label="Close Certificate View"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left: High-Res Framed Certificate Image */}
                <div className="lg:w-[60%] relative bg-[#141518] min-h-[300px] sm:min-h-[420px] lg:min-h-[500px] flex items-center justify-center overflow-hidden group p-4 sm:p-6">
                  <img 
                    src={activeCert.image} 
                    alt={activeCert.title} 
                    className="w-full h-full object-contain max-h-[70vh] rounded-xl shadow-2xl transition-all duration-300"
                  />

                  {/* Previous / Next Arrow Controls */}
                  <button
                    onClick={() => setActiveCertIndex((activeCertIndex - 1 + certificates.length) % certificates.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 hover:bg-[#DCA51B] hover:text-[#141518] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md"
                    aria-label="Previous certificate"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveCertIndex((activeCertIndex + 1) % certificates.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/55 hover:bg-[#DCA51B] hover:text-[#141518] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md"
                    aria-label="Next certificate"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-4 text-xs text-white/80 font-sans font-medium px-3 py-1 rounded-full bg-black/50 border border-white/15">
                    {activeCertIndex + 1} / {certificates.length}
                  </div>
                </div>

                {/* Right: Verified Specification Details */}
                <div data-lenis-prevent className="lg:w-[40%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar bg-white">
                  <div>
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-900 mb-2 leading-tight">
                      {activeCert.title}
                    </h3>

                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-sans mb-4">
                      Issued to: <span className="text-zinc-900 font-bold">{activeCert.recipient}</span>
                    </p>

                    <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] mb-5">
                      <p className="text-xs font-bold text-[#8C5D00] uppercase tracking-wider font-sans mb-1">
                        Issuing Authority
                      </p>
                      <p className="text-sm font-medium text-zinc-800 font-sans">
                        {activeCert.issuer}
                      </p>
                    </div>

                    <p className="font-sans text-sm text-zinc-600 leading-relaxed font-light mb-6">
                      {activeCert.description}
                    </p>

                    <div className="space-y-2.5 pb-6 border-b border-[#E8E2D5]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
                        Credential Competencies
                      </h4>
                      {activeCert.highlights.map((item, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-800 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-[#DCA51B] shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-600 font-sans">
                      <ShieldCheck className="w-4 h-4 text-[#DCA51B]" />
                      <span>Verified Dental Board License</span>
                    </div>

                    <button
                      onClick={() => setActiveCertIndex(null)}
                      className="text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#DCA51B] transition-colors cursor-pointer font-sans"
                    >
                      Close View
                    </button>
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
};
