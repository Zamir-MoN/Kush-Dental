import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowUpRight, CheckCircle2, X, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  DentalMirrorIcon, 
  ToothSparkleIcon, 
  DentalImplantIcon, 
  SmileCurveIcon, 
  DentalCrownIcon, 
  ToothIcon 
} from '../common/DentalIcons';

const services = [
  {
    id: 1,
    number: '01',
    title: 'Professional Teeth Cleaning',
    category: 'Preventive',
    desc: 'Ultrasonic cleaning and polishing to protect your gum health.',
    benefits: ['Plaque & tartar removal', 'Gum health check'],
    duration: '45-60 mins',
    icon: DentalMirrorIcon,
    img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 2,
    number: '02',
    title: 'Laser Teeth Whitening',
    category: 'Cosmetic',
    desc: 'In-office whitening brightening teeth up to 8 shades in one visit.',
    benefits: ['Bright results in one visit', 'Gentle on sensitive teeth'],
    duration: '60 mins',
    icon: ToothSparkleIcon,
    img: '/images/services/cosmetic dentistry.png',
  },
  {
    id: 3,
    number: '03',
    title: '3D Dental Implants',
    category: 'Surgical',
    desc: 'Computer-guided dental implants for permanent, natural function.',
    benefits: ['Looks and feels like real teeth', 'Permanent bone-safe solution'],
    duration: 'Phased Care',
    icon: DentalImplantIcon,
    img: '/images/services/dental implants.png',
  },
  {
    id: 4,
    number: '04',
    title: 'Custom Porcelain Veneers',
    category: 'Cosmetic',
    desc: 'Custom porcelain covers to fix chips and discoloration naturally.',
    benefits: ['Stain-resistant porcelain', 'Protects natural enamel'],
    duration: '2 Visits',
    icon: SmileCurveIcon,
    img: '/images/services/restorative care.png',
  },
  {
    id: 5,
    number: '05',
    title: 'Gentle Root Canal Therapy',
    category: 'Restorative',
    desc: 'Pain-free care to treat tooth infection and save your natural tooth.',
    benefits: ['Painless local numbing', 'Saves your natural tooth'],
    duration: '1-2 Visits',
    icon: DentalCrownIcon,
    img: '/images/services/root canal.png',
  },
  {
    id: 6,
    number: '06',
    title: 'Wisdom Tooth Removal',
    category: 'Surgical',
    desc: 'Comfortable wisdom tooth extractions with gentle sedation.',
    benefits: ['Calm sedation options', 'Fast and gentle recovery'],
    duration: '45 mins',
    icon: ToothIcon,
    img: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=900&auto=format&fit=crop',
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
  const [selectedService, setSelectedService] = useState<any>(null);
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
    <section ref={sectionRef} className="py-16 lg:py-24 bg-[#FAF7F2] relative z-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Category Navigation Pills with Sliding Obsidian Indicator */}
        <div className="flex justify-center mb-14 reveal-up">
          <div className="bg-[#FCFBF8] rounded-2xl p-2.5 sm:p-3 border border-[#E8E2D5] shadow-sm flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`relative px-5 sm:px-6 py-2.5 rounded-xl font-sans text-xs uppercase font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer select-none ${
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

        {/* Landscape Services Cards Grid (2-Column Horizontal Cards) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`w-full ${filteredServices.length === 1 ? 'max-w-[720px] mx-auto' : 'grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 auto-rows-fr'}`}
          >
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="luxury-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer border border-[#E8E2D5]/70 hover:border-[#DCA51B]/40 bg-white hover:-translate-y-1 h-full"
                  onClick={() => setSelectedService(service)}
                >
                  
                  {/* Left Column: Landscape Image Container */}
                  <div className="sm:w-[46%] lg:w-[48%] relative overflow-hidden bg-[#FAF7F2] shrink-0 min-h-[220px] sm:min-h-0 sm:h-full">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#141518]/85 backdrop-blur-md text-[#DCA51B] text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/10 shadow-sm font-sans">
                        {service.category}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3.5 left-4">
                      <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium rounded-lg flex items-center gap-1.5 shadow-sm font-sans">
                        <Clock className="w-3 h-3 text-[#DCA51B]" />
                        <span>{service.duration}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Service Content & Actions */}
                  <div className="sm:w-[54%] lg:w-[52%] p-5 sm:p-6 lg:p-7 flex flex-col justify-between h-full flex-grow">
                    <div className="flex flex-col flex-grow">
                      {/* Top Meta Row with Icon & Index */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#121316] transition-colors duration-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-neutral/80 font-sans tracking-wider">
                          No. 0{service.id}
                        </span>
                      </div>

                      {/* Service Title with Uniform 2-Line Height Alignment */}
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-tertiary group-hover:text-[#DCA51B] transition-colors leading-snug mb-2 min-h-[3rem] sm:min-h-[3.25rem] flex items-center">
                        {service.title}
                      </h3>

                      {/* Description with Uniform Height */}
                      <p className="text-neutral text-xs sm:text-[13px] leading-relaxed mb-3.5 font-sans font-light line-clamp-2 min-h-[2.5rem] sm:min-h-[2.6rem]">
                        {service.desc}
                      </p>

                      {/* Key Clinical Advantages with Consistent Bottom Alignment */}
                      <div className="space-y-1.5 pb-4 border-b border-border/40 mt-auto">
                        {service.benefits.slice(0, 2).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-sans text-tertiary">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                            <span className="truncate">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-3.5 flex items-center justify-between gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="text-xs font-bold uppercase tracking-wider text-tertiary hover:text-[#DCA51B] transition-colors inline-flex items-center gap-1 cursor-pointer py-1 group/details"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#DCA51B] group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5 transition-transform" />
                      </button>

                      <Link
                        to="/book"
                        className="btn-gold-luxury group/btn px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold tracking-wider rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Book Visit</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Interactive Service Details Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedService && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedService(null)}
                className="fixed inset-0 bg-black/75 z-[100] backdrop-blur-md"
              />
              <motion.div
                initial={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                animate={{ top: '50%', left: '50%', x: '-50%', y: '-50%', opacity: 1 }}
                exit={{ top: '100%', left: '50%', x: '-50%', y: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed w-[92%] max-w-2xl bg-[#FCFBF8] rounded-3xl z-[101] p-6 sm:p-10 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E2D5]"
              >
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#FAF7F2] text-[#141518] transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <span className="text-[#DCA51B] tracking-[0.2em] text-xs uppercase font-bold block mb-2 font-sans">
                  {selectedService.category} SPECIALTY
                </span>
                
                <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4 text-[#141518]">{selectedService.title}</h2>
                
                <div className="w-full aspect-[16/9] mb-6 rounded-2xl overflow-hidden bg-[#FAF7F2] shadow-md border border-[#E8E2D5]">
                  <img src={selectedService.img} alt={selectedService.title} className="w-full h-full object-cover" />
                </div>
                
                <p className="text-zinc-600 text-base sm:text-lg leading-relaxed mb-6 font-sans font-light">
                  {selectedService.desc}
                </p>
                
                <div className="mb-8">
                  <h4 className="font-serif font-bold text-lg text-[#141518] mb-3">Key Clinical Advantages</h4>
                  <div className="space-y-2.5">
                    {selectedService.benefits.map((b: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm font-sans text-zinc-700">
                        <CheckCircle2 className="w-4 h-4 text-[#DCA51B]" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-full border-t border-[#E8E2D5] pt-6 mt-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                  <span className="text-xs sm:text-sm text-zinc-500 font-sans">Duration: {selectedService.duration}</span>
                  <Link 
                    to="/book" 
                    onClick={() => setSelectedService(null)}
                    className="btn-gold-luxury px-7 py-3.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2 font-sans"
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
