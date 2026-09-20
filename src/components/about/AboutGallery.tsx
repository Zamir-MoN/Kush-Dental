import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useScrollReveal } from '../../hooks/useGsap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'Treatment Suites' | 'Patient Lounge' | 'Digital 3D Labs' | 'Sterilization';
  description: string;
  image: string;
  images?: string[];
  features: string[];
  span?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Private Operatory Suite',
    category: 'Treatment Suites',
    description: 'Quiet surgical suites with ergonomic chairs and overhead entertainment.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Whisper-quiet handpieces', 'Low-dose sensors', 'Overhead 4K display'],
    span: 'md:col-span-8 md:row-span-2'
  },
  {
    id: 2,
    title: 'Serene Patient Lounge',
    category: 'Patient Lounge',
    description: 'Calming reception lounge with private seating and herbal teas.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop'
    ],
    features: ['Organic tea & espresso bar', 'Calm ambient soundscape', 'Private seating'],
    span: 'md:col-span-4'
  },
  {
    id: 3,
    title: '3D CBCT Scanning Studio',
    category: 'Digital 3D Labs',
    description: 'Ultra-low radiation 3D tomography for precise implant planning.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop',
    features: ['Low-dose imaging', 'Instant 3D capture', 'Guided surgical mapping'],
    span: 'md:col-span-4'
  },
  {
    id: 4,
    title: 'Ceramic Artistry Lab',
    category: 'Digital 3D Labs',
    description: 'In-house digital ceramic milling for same-day precision crowns.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
    features: ['Sub-micron fit', 'Master shading', 'Same-day crowns'],
    span: 'md:col-span-4'
  },
  {
    id: 5,
    title: 'Sterilization Center',
    category: 'Sterilization',
    description: 'Hospital-grade multi-stage sterilization and continuous biological monitoring.',
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1200&auto=format&fit=crop',
    features: ['Class-B autoclaves', 'Barcoded cassettes', 'HEPA air filtration'],
    span: 'md:col-span-4'
  },
  {
    id: 6,
    title: 'Digital Smile Design Suite',
    category: 'Treatment Suites',
    description: 'High-definition 3D smile simulations and facial mapping.',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=1200&auto=format&fit=crop',
    features: ['Interactive 3D preview', 'Facial mapping', 'Smile mock-ups'],
    span: 'md:col-span-4'
  }
];

interface DynamicGalleryCardProps {
  item: GalleryItem;
  idx: number;
  isLarge: string;
  onOpenLightbox: (idx: number, photoIdx: number) => void;
}

const DynamicGalleryCard: React.FC<DynamicGalleryCardProps> = ({
  item,
  idx,
  isLarge,
  onOpenLightbox
}) => {
  const images = item.images && item.images.length > 0 ? item.images : [item.image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through images dynamically every 3.5 seconds
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      onClick={() => onOpenLightbox(idx, currentIdx)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-3xl overflow-hidden border border-[#E8E2D5] bg-[#141518] shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-end min-h-[260px] sm:min-h-[320px] ${isLarge}`}
    >
      {/* Dynamic Background Images with Smooth Crossfade & Ken Burns Scale */}
      <div className="absolute inset-0 overflow-hidden bg-[#141518]">
        {images.map((imgSrc, imgIdx) => (
          <img
            key={imgSrc}
            src={imgSrc}
            alt={`${item.title} - View ${imgIdx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
              imgIdx === currentIdx
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-108 pointer-events-none'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:via-black/35" />
      </div>

      {/* Top Action / Zoom */}
      <div className="absolute top-4 right-4 z-10">
        <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
          <Eye className="w-4 h-4" />
        </span>
      </div>

      {/* Manual Quick Navigation Chevrons on Hover */}
      {images.length > 1 && (
        <div className="absolute inset-y-0 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <button
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#DCA51B] hover:text-[#141518] text-white flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/20 cursor-pointer shadow-md"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#DCA51B] hover:text-[#141518] text-white flex items-center justify-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/20 cursor-pointer shadow-md"
            aria-label="Next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Content Title & View Indicators */}
      <div className="relative z-10 p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-white group-hover:text-[#DCA51B] transition-colors leading-snug">
            {item.title}
          </h3>
          <p className="text-zinc-300 text-xs font-sans font-light mt-1 max-w-sm line-clamp-1">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIdx
                      ? 'w-5 bg-[#DCA51B]'
                      : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`View photo ${i + 1}`}
                />
              ))}
            </div>
          )}

          <span className="text-xs font-sans text-zinc-300 group-hover:text-white flex items-center gap-1 transition-colors">
            <span>Explore</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const categories = ['View All', 'Treatment Suites', 'Patient Lounge', 'Digital 3D Labs', 'Sterilization'] as const;
type CategoryFilter = (typeof categories)[number];

export const AboutGallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('View All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>(0);

  const filteredItems = activeCategory === 'View All'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handleOpenLightbox = (idx: number, photoIdx: number = 0) => {
    setLightboxIndex(idx);
    setLightboxPhotoIndex(photoIdx);
  };

  // Close lightbox with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  const activeLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section 
      id="gallery" 
      ref={sectionRef} 
      className="py-12 sm:py-16 lg:py-18 xl:py-20 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-t border-[#E8E2D5] relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#DCA51B]/[0.035] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#DCA51B]/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 reveal-up">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-3">
            Our Modern <span className="italic font-normal text-[#DCA51B]">Suites</span>.
          </h2>

          <p className="font-sans text-sm sm:text-base text-zinc-600 font-light">
            A visual look inside our treatment suites, digital labs, and patient lounge.
          </p>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-4 mb-8 sm:mb-12 no-scrollbar reveal-up">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-white border border-[#E8E2D5] shadow-xs">
            {categories.map((category) => {
              const isActive = activeCategory === category;
              const count = category === 'View All' 
                ? galleryItems.length 
                : galleryItems.filter(i => i.category === category).length;

              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all duration-300 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#141518] text-white shadow-md'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-sans ${
                    isActive ? 'bg-[#DCA51B] text-[#141518] font-bold' : 'bg-[#FAF7F2] text-zinc-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bento / Responsive Gallery Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-stretch"
          >
            {filteredItems.map((item, idx) => {
              const isLarge = activeCategory === 'View All' && item.span ? item.span : 'md:col-span-6 lg:col-span-4';

              return (
                <DynamicGalleryCard
                  key={item.id}
                  item={item}
                  idx={idx}
                  isLarge={isLarge}
                  onOpenLightbox={handleOpenLightbox}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Fullscreen Interactive Lightbox Modal (Portaled to document.body) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {activeLightboxItem && lightboxIndex !== null && (
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 lg:p-10">
              {/* Dark Glass Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxIndex(null)}
                className="absolute inset-0 bg-black/85 backdrop-blur-lg cursor-pointer"
              />

              {/* Lightbox Card Container */}
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
                  onClick={() => setLightboxIndex(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#141518] text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
                  aria-label="Close Gallery Modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left: High-Res Image View with Navigation */}
                <div className="lg:w-[62%] relative bg-[#141518] min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] flex items-center justify-center overflow-hidden group">
                  <img 
                    src={activeLightboxItem.images?.[lightboxPhotoIndex] || activeLightboxItem.image} 
                    alt={activeLightboxItem.title} 
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Previous / Next Arrow Controls */}
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#DCA51B] hover:text-[#141518] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setLightboxIndex((lightboxIndex + 1) % filteredItems.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-[#DCA51B] hover:text-[#141518] text-white flex items-center justify-center transition-all cursor-pointer border border-white/20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-4 left-4 text-xs text-white/80 font-sans font-medium px-3 py-1 rounded-full bg-black/50 border border-white/15">
                    {lightboxIndex + 1} / {filteredItems.length}
                  </div>
                </div>

                {/* Right: Room Specifications & Highlights */}
                <div data-lenis-prevent className="lg:w-[38%] p-6 sm:p-8 flex flex-col justify-between overflow-y-auto custom-scrollbar overscroll-contain bg-white">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] text-[#DCA51B] text-xs font-bold uppercase tracking-wider font-sans mb-3">
                      {activeLightboxItem.category}
                    </span>

                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-zinc-900 mb-3 leading-tight">
                      {activeLightboxItem.title}
                    </h3>

                    <p className="font-sans text-sm text-zinc-600 leading-relaxed font-light mb-6">
                      {activeLightboxItem.description}
                    </p>

                    <div className="space-y-3 pb-6 border-b border-[#E8E2D5]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-sans">
                        Suite Specifications
                      </h4>
                      {activeLightboxItem.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-zinc-800 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-[#DCA51B] shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-sans">
                      <ShieldCheck className="w-4 h-4 text-[#DCA51B]" />
                      <span>Certified Clinical Suite</span>
                    </div>

                    <button
                      onClick={() => setLightboxIndex(null)}
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
