import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowRight, ArrowUpRight, CheckCircle2, X, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DentalMirrorIcon, 
  ToothSparkleIcon, 
  DentalImplantIcon, 
  DentalCrownIcon, 
  ToothIcon 
} from '../common/DentalIcons';

interface ServiceItem {
  id: number;
  number: string;
  title: string;
  category: string;
  categoryLabel: string;
  desc: string;
  benefits: string[];
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  img: string;
  isDark: boolean;
  inverted: boolean;
  scriptText?: string;
  scriptPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  imgPosition?: string;
}

const services: ServiceItem[] = [
  {
    id: 1,
    number: '01',
    title: 'Professional Teeth Cleaning',
    category: 'Preventive',
    categoryLabel: 'PREVENTIVE CARE',
    desc: 'Ultrasonic cleaning and polishing to protect your gum health.',
    benefits: ['Plaque & tartar removal', 'Gum health check', 'Fresher breath'],
    duration: '45–60 mins',
    icon: ToothSparkleIcon,
    img: '/images/services/service-cleaning.jpg',
    isDark: true,
    inverted: false,
    scriptText: 'Cleaner\nHealthier\nHappier',
    scriptPosition: 'bottom-right'
  },
  {
    id: 2,
    number: '02',
    title: 'Laser Teeth Whitening',
    category: 'Cosmetic',
    categoryLabel: 'COSMETIC',
    desc: 'In-office whitening brightening teeth up to 8 shades in one visit.',
    benefits: ['Brighter, whiter smile', 'Safe & painless procedure', 'Instant confidence boost'],
    duration: '60 mins',
    icon: Sparkles,
    img: '/images/services/service-whitening.jpg',
    isDark: false,
    inverted: false,
    scriptText: 'Whiter\nBrighter\nYou',
    scriptPosition: 'top-right'
  },
  {
    id: 3,
    number: '03',
    title: '3D Dental Implants',
    category: 'Surgical',
    categoryLabel: 'SURGICAL',
    desc: 'Computer-guided dental implants for permanent, natural function.',
    benefits: ['Looks and feels like real teeth', 'Permanent bone-safe solution', 'Advanced 3D planning'],
    duration: 'Phased Care',
    icon: DentalImplantIcon,
    img: '/images/services/service-implants.jpg',
    isDark: false,
    inverted: true,
    scriptText: 'A Stronger\nSmile for\nLife',
    scriptPosition: 'top-left'
  },
  {
    id: 4,
    number: '04',
    title: 'Custom Porcelain Veneers',
    category: 'Cosmetic',
    categoryLabel: 'COSMETIC',
    desc: 'Custom porcelain covers to fix chips and discoloration naturally.',
    benefits: ['Stain-resistant porcelain', 'Natural-looking results', 'Long-lasting smile'],
    duration: '2 Visits',
    icon: ToothIcon,
    img: '/images/services/restorative care.png',
    isDark: true,
    inverted: true,
    scriptText: 'Natural\nBeautiful\nSmile',
    scriptPosition: 'top-left'
  },
  {
    id: 5,
    number: '05',
    title: 'Wisdom Tooth Removal',
    category: 'Surgical',
    categoryLabel: 'SURGICAL',
    desc: 'Comfortable wisdom tooth extractions with gentle sedation.',
    benefits: ['Calm sedation options', 'Fast and gentle recovery', 'Prevents misalignment'],
    duration: '45 mins',
    icon: DentalMirrorIcon,
    img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900&auto=format&fit=crop',
    isDark: true,
    inverted: false,
    scriptText: 'Gentle\nSafe\nComfort',
    scriptPosition: 'bottom-right'
  },
  {
    id: 6,
    number: '06',
    title: 'Gentle Root Canal Therapy',
    category: 'Restorative',
    categoryLabel: 'RESTORATIVE',
    desc: 'Pain-free care to treat tooth infection and save your natural tooth.',
    benefits: ['Painless local numbing', 'Saves your natural tooth', 'Reinforces tooth structure'],
    duration: '1–2 Visits',
    icon: DentalCrownIcon,
    img: '/images/services/root canal.png',
    isDark: false,
    inverted: false,
    imgPosition: '85% center',
    scriptText: 'Painless\nLasting\nRelief',
    scriptPosition: 'bottom-right'
  }
];

const categories = [
  { name: 'All Services', count: 6 },
  { name: 'Cosmetic', count: 2 },
  { name: 'Preventive', count: 1 },
  { name: 'Restorative', count: 1 },
  { name: 'Surgical', count: 2 }
];

export const ServicesGrid = () => {
  const [activeCategory, setActiveCategory] = useState('All Services');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  const filteredServices = services.filter(s => 
    activeCategory === 'All Services' || s.category === activeCategory
  );

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-18 xl:py-20 bg-[#FAF7F2] relative z-10 overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Category Navigation Pills with Sliding Obsidian Indicator */}
        <div className="flex justify-center mb-10 sm:mb-14 reveal-up">
          <div className="bg-[#FCFBF8] rounded-2xl p-2 sm:p-2.5 border border-[#E8E2D5] shadow-xs flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-sans text-xs uppercase font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer select-none ${
                    isActive
                      ? 'text-white'
                      : 'bg-[#FAF7F2] text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {/* Sliding Obsidian Pill Background */}
                  {isActive && (
                    <motion.div
                      layoutId="servicesActivePill"
                      className="absolute inset-0 bg-[#141518] rounded-xl shadow-md z-0"
                      transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.8 }}
                    />
                  )}

                  <span className="relative z-10">{cat.name}</span>
                  <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-md font-sans transition-colors ${
                    isActive ? 'bg-[#DCA51B] text-[#141518] font-extrabold shadow-sm' : 'bg-[#E8E2D5] text-zinc-600 font-semibold'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Curved Architectural Bento Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`w-full ${filteredServices.length === 1 ? 'max-w-[700px] mx-auto' : 'grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7 lg:gap-8'}`}
          >
            {filteredServices.map((service) => {
              const Icon = service.icon;
              const isDark = service.isDark;
              const isInverted = service.inverted;
              const cardBg = isDark ? '#141518' : '#FFFFFF';

              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`relative rounded-[26px] sm:rounded-[30px] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border group cursor-pointer flex flex-col ${
                    isInverted ? 'sm:flex-row-reverse' : 'sm:flex-row'
                  } ${
                    isDark 
                      ? 'bg-[#141518] text-white border-white/10 hover:border-[#DCA51B]/60 hover:shadow-[#DCA51B]/15' 
                      : 'bg-white text-zinc-900 border-[#E8E2D5] hover:border-[#DCA51B]/70 hover:shadow-xl'
                  }`}
                >
                  
                  {/* Content Column */}
                  <div className={`w-full sm:w-[55%] lg:w-[56%] p-5 sm:p-6 lg:p-7.5 flex flex-col justify-between relative z-10 ${
                    isInverted ? 'sm:pl-6 lg:pl-8' : 'sm:pr-4 lg:pr-6'
                  }`}>
                    <div>
                      {/* Eyebrow: Icon + Category Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-4 h-4 text-[#DCA51B] shrink-0" />
                        <span className={`text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.16em] font-sans ${
                          isDark ? 'text-[#DCA51B]' : 'text-[#C49216]'
                        }`}>
                          {service.categoryLabel}
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className={`font-serif font-bold text-xl sm:text-[22px] lg:text-2xl leading-tight mb-2 transition-colors ${
                        isDark ? 'text-white group-hover:text-[#FAF7F2]' : 'text-zinc-900 group-hover:text-black'
                      }`}>
                        {service.title}
                      </h3>

                      {/* Short Description */}
                      <p className={`text-xs sm:text-[12.5px] leading-relaxed mb-4 font-sans font-light ${
                        isDark ? 'text-zinc-300' : 'text-zinc-600'
                      }`}>
                        {service.desc}
                      </p>

                      {/* 3 Checkpoint Benefits */}
                      <div className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
                        {service.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#DCA51B] shrink-0" />
                            <span className={`text-xs sm:text-[12.5px] font-sans font-normal truncate ${
                              isDark ? 'text-zinc-200' : 'text-zinc-700'
                            }`}>
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Buttons: Solid Gold Book Visit + View Details */}
                    <div 
                      className="flex items-center gap-3 sm:gap-4 pt-1 shrink-0" 
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        to="/book"
                        className="bg-[#DCA51B] hover:bg-[#E5B22E] text-zinc-950 font-sans font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[11px] sm:text-xs uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95"
                      >
                        <span>BOOK VISIT</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 transition-colors cursor-pointer py-1 ${
                          isDark ? 'text-white/85 hover:text-[#DCA51B]' : 'text-zinc-700 hover:text-[#DCA51B]'
                        }`}
                      >
                        <span>VIEW DETAILS</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#DCA51B]" />
                      </button>
                    </div>
                  </div>

                  {/* Image Column */}
                  <div className={`w-full sm:w-[45%] lg:w-[44%] min-h-[200px] sm:min-h-0 relative overflow-hidden shrink-0 ${
                    isDark ? 'bg-[#141518]' : 'bg-white'
                  }`}>
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      style={service.imgPosition ? { objectPosition: service.imgPosition } : undefined}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Soft gradient overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                    {/* Cursive Handwriting Script Text */}
                    {service.scriptText && (
                      <div className={`absolute z-10 pointer-events-none font-script text-2xl sm:text-[28px] lg:text-3xl leading-[1.1] font-bold select-none ${
                        service.scriptPosition === 'top-left'
                          ? 'top-4 left-4 sm:left-5 text-left text-zinc-900 drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)]'
                          : service.scriptPosition === 'top-right'
                            ? 'top-4 right-4 sm:right-5 text-right text-zinc-900 drop-shadow-[0_1px_4px_rgba(255,255,255,0.9)]'
                            : 'bottom-4 right-4 sm:right-5 text-right text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]'
                      }`}>
                        {service.scriptText.split('\n').map((line, lIdx) => (
                          <div key={lIdx}>{line}</div>
                        ))}
                      </div>
                    )}

                    {/* Elegant Curved Gold Divider (Bleeding past column seam to guarantee zero visible straight lines) */}
                    {!isInverted ? (
                      <div className="hidden sm:block absolute top-0 bottom-0 -left-[3px] w-[40px] lg:w-[46px] z-10 pointer-events-none h-full overflow-visible">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 36 320" preserveAspectRatio="none" fill="none">
                          <path 
                            d="M-10,-5 L-10,325 L0,320 C24,220 24,100 0,0 L-10,-5 Z" 
                            fill={cardBg} 
                          />
                          <path 
                            d="M0,0 C24,100 24,220 0,320" 
                            stroke="#DCA51B" 
                            strokeWidth="2.5" 
                            fill="none" 
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="hidden sm:block absolute top-0 bottom-0 -right-[3px] w-[40px] lg:w-[46px] z-10 pointer-events-none h-full overflow-visible">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 36 320" preserveAspectRatio="none" fill="none">
                          <path 
                            d="M46,-5 L46,325 L36,320 C12,220 12,100 36,0 L46,-5 Z" 
                            fill={cardBg} 
                          />
                          <path 
                            d="M36,0 C12,100 12,220 36,320" 
                            stroke="#DCA51B" 
                            strokeWidth="2.5" 
                            fill="none" 
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Interactive Service Details Modal (Portaled) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedService && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md cursor-pointer"
              />
              <motion.div
                initial={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                animate={{ top: '50%', left: '50%', x: '-50%', y: '-50%', opacity: 1 }}
                exit={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                className="fixed w-[92%] max-w-2xl bg-[#FCFBF8] rounded-3xl z-[101] max-h-[90vh] shadow-2xl border border-[#E8E2D5] flex flex-col overflow-hidden"
              >
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#141518] border border-[#E8E2D5] shadow-xs flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Scrollable Content Container */}
                <div data-lenis-prevent className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-9 overscroll-contain">
                  <span className="text-[#DCA51B] tracking-[0.2em] text-xs uppercase font-bold block mb-2 font-sans">
                    {selectedService.categoryLabel}
                  </span>
                  
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl mb-4 text-[#141518] pr-10">
                    {selectedService.title}
                  </h2>
                  
                  <div className="w-full max-h-[260px] aspect-[16/9] mb-5 rounded-2xl overflow-hidden bg-[#FAF7F2] shadow-md border border-[#E8E2D5]">
                    <img src={selectedService.img} alt={selectedService.title} className="w-full h-full object-cover" />
                  </div>
                  
                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-6 font-sans font-light">
                    {selectedService.desc}
                  </p>
                  
                  <div className="mb-4">
                    <h4 className="font-serif font-bold text-lg text-[#141518] mb-3">Key Clinical Advantages</h4>
                    <div className="space-y-2.5">
                      {selectedService.benefits.map((b: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm font-sans text-zinc-700">
                          <CheckCircle2 className="w-4 h-4 text-[#DCA51B] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Fixed Modal Action Footer */}
                <div className="w-full border-t border-[#E8E2D5] bg-[#FCFBF8] px-6 sm:px-9 py-4 shrink-0 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-xs sm:text-sm text-zinc-500 font-sans">Duration: {selectedService.duration}</span>
                  <Link 
                    to="/book" 
                    onClick={() => setSelectedService(null)}
                    className="bg-[#DCA51B] hover:bg-[#E5B22E] text-zinc-950 px-7 py-3 rounded-xl shadow-md transition-all inline-flex items-center gap-2 font-sans text-sm font-bold"
                  >
                    <Calendar className="w-4 h-4 text-[#141518]" />
                    <span>BOOK CONSULTATION</span>
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

    </section>
  );
};
