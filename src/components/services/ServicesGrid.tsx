import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowUpRight, Sparkles, ShieldCheck, Smile, Activity, Microscope, CheckCircle2, X, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    number: '01',
    title: 'Professional Dental Cleaning & Hygiene',
    category: 'Preventive',
    desc: 'Advanced ultrasonic scaling, biofilm removal, and diamond polishing to preserve healthy gums, strengthen enamel, and maintain radiant breath.',
    benefits: ['Subgingival plaque & tartar removal', 'Laser gum health assessment', 'Custom enamel remineralization'],
    duration: '45-60 mins',
    icon: Sparkles,
    img: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 2,
    number: '02',
    title: 'Cosmetic Laser Teeth Whitening',
    category: 'Cosmetic',
    desc: 'Medical-grade laser teeth whitening safely brightening your natural smile by up to 8 shades in a single relaxing session with zero sensitivity.',
    benefits: ['Immediate, radiant results in one visit', 'Formulated for sensitive teeth', 'Custom take-home touchup kit'],
    duration: '60 mins',
    icon: Smile,
    img: '/images/services/cosmetic dentistry.png',
  },
  {
    id: 3,
    number: '03',
    title: '3D Computer-Guided Dental Implants',
    category: 'Surgical',
    desc: 'Permanent, state-of-the-art titanium and ceramic implant placement utilizing 3D CBCT digital precision for lifetime structural stability.',
    benefits: ['Sub-millimeter surgical accuracy', 'Virtually painless digital workflow', 'Preserves natural jawbone density'],
    duration: 'Phased Care',
    icon: ShieldCheck,
    img: '/images/services/dental implants.png',
  },
  {
    id: 4,
    number: '04',
    title: 'Custom Porcelain Veneers & Makeovers',
    category: 'Cosmetic',
    desc: 'Ultra-thin handcrafted porcelain shells custom-sculpted by master ceramists to correct discoloration, gaps, and chips with lifelike translucency.',
    benefits: ['Stain-resistant high-luster porcelain', 'Minimally invasive enamel preservation', '3D digital smile simulation'],
    duration: '2-3 Visits',
    icon: Smile,
    img: '/images/services/restorative care.png',
  },
  {
    id: 5,
    number: '05',
    title: 'Microscopic Endodontics (Root Canal)',
    category: 'Restorative',
    desc: 'Gentle, pain-free endodontic therapy utilizing high-power surgical microscopes and 3D imaging to save natural teeth from deep infection.',
    benefits: ['100% painless modern anesthesia protocols', 'High-magnification surgical precision', 'Biocompatible ceramic root seals'],
    duration: '1-2 Visits',
    icon: Microscope,
    img: '/images/services/root canal.png',
  },
  {
    id: 6,
    number: '06',
    title: 'Surgical Wisdom Tooth Extraction',
    category: 'Surgical',
    desc: 'Comfortable, minimally invasive oral surgery for impacted or problematic third molars under luxury sedation and rapid recovery protocols.',
    benefits: ['Sedation options for complete relaxation', 'Minimally invasive piezosurgery tools', 'Accelerated PRF healing protocols'],
    duration: '45 mins',
    icon: Activity,
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

        {/* Clean Luxury Landscape Services Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98, y: 18 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    transition: { 
                      duration: 0.45, 
                      delay: i * 0.04,
                      ease: [0.16, 1, 0.3, 1] as const
                    } 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.96, 
                    y: 8, 
                    transition: { 
                      duration: 0.22, 
                      ease: [0.16, 1, 0.3, 1] as const
                    } 
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
                  className="luxury-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group cursor-pointer"
                  onClick={() => setSelectedService(service)}
                >
                  
                  {/* Left Column: Landscape Image Container */}
                  <div className="sm:w-[44%] lg:w-[42%] min-h-[220px] sm:min-h-[280px] relative overflow-hidden bg-[#FAF7F2] shrink-0">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#141518]/85 backdrop-blur-md text-[#DCA51B] text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/10 shadow-sm font-sans">
                        {service.category}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-3 left-4">
                      <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium rounded-lg flex items-center gap-1.5 shadow-sm font-sans">
                        <Clock className="w-3 h-3 text-[#DCA51B]" />
                        <span>{service.duration}</span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Service Content & Actions */}
                  <div className="sm:w-[56%] lg:w-[58%] p-6 sm:p-7 flex flex-col justify-between">
                    <div>
                      {/* Top Meta Row with Icon & Index */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] group-hover:bg-[#DCA51B] group-hover:text-[#121316] transition-colors duration-300">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-neutral/80 font-sans tracking-wider">
                          No. 0{service.id}
                        </span>
                      </div>

                      {/* Service Title */}
                      <h3 className="font-serif font-bold text-xl sm:text-[22px] text-tertiary group-hover:text-[#DCA51B] transition-colors leading-snug mb-2.5">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-neutral text-xs sm:text-sm leading-relaxed mb-4 font-sans font-light line-clamp-3">
                        {service.desc}
                      </p>

                      {/* Key Clinical Advantages */}
                      <div className="space-y-1.5 pb-4 border-b border-border/40">
                        {service.benefits.slice(0, 2).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-sans text-tertiary">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                            <span className="truncate">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Actions Row */}
                    <div className="pt-4 flex items-center justify-between gap-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedService(service)}
                        className="text-xs font-bold uppercase tracking-wider text-tertiary hover:text-[#DCA51B] transition-colors inline-flex items-center gap-1 cursor-pointer py-1 group/details"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#DCA51B] group-hover/details:translate-x-0.5 group-hover/details:-translate-y-0.5 transition-transform" />
                      </button>

                      <Link
                        to="/book"
                        className="group/btn bg-[#DCA51B] hover:bg-[#C49216] text-[#121316] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:shadow-[#DCA51B]/20 transition-all duration-300 active:scale-95 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Book Visit</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

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
