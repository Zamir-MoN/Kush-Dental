import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowRight, Sparkles, ShieldCheck, Smile, Activity, Microscope } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Dental Cleaning',
    category: 'Preventive',
    desc: 'Professional scaling and polishing to remove plaque and tartar, ensuring healthy gums and fresh breath.',
    icon: <Sparkles strokeWidth={1} className="w-8 h-8" />,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF04fHaVw3hwvqrALDqIFrlXc5nWieiPCUrmoqXa885Hgh7hmBD4TjXiTqq1cgoTsRbOmicsA8-7XmaX0oWd6JLnzTfTx6whWBmYux8rKqDrrvoFqKbD4CUlJkppM64ZJCZm3xGOQ7-yekAnumeSuFxeWF8MyugvdD7Lerm0oWFs4YNoQCQXTaO9bec4vv3KUAIn5MUE77UCGYu6Za2429ZV4XYkzv4e3lg00ab0yrDHVRgMTAnW0Z',
    col: 1
  },
  {
    id: 4,
    title: 'Teeth Whitening',
    category: 'Cosmetic',
    desc: 'Professional laser whitening treatments to brighten your smile safely and effectively in one visit.',
    icon: <Smile strokeWidth={1} className="w-8 h-8" />,
    img: '',
    col: 1
  },
  {
    id: 2,
    title: 'Dental Implants',
    category: 'Surgical',
    desc: 'Permanent, natural-looking replacements for missing teeth, restoring full function and aesthetics.',
    icon: <ShieldCheck strokeWidth={1} className="w-8 h-8" />,
    img: '',
    col: 2
  },
  {
    id: 5,
    title: 'Wisdom Extraction',
    category: 'Surgical',
    desc: 'Safe and comfortable removal of impacted wisdom teeth by experienced oral surgeons.',
    icon: <Activity strokeWidth={1} className="w-8 h-8" />,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpb3EWb10XaOXczx57UYqf-2b1Yds5ZQlTfUz3LC2UcvjWyOmwgk2EMnM4QoBBe8dIUQ1EuLuE2kWvlOCM3yKt-DlACo_1laGCFCS-gzP3cHqmmsPoMBNubMC3utoCRWiJXchvzO9x9uZMLKHxIZx0NCZCN1YhlIqn6DJSI_DYG7-l9xVqDLh95CylyqovgjhQ4_7dvbHA7vHAjDHZqL2kmlCdDJHOo2wNrXMnYEhZK8kMOsYGtjLR',
    col: 2
  },
  {
    id: 6,
    title: 'Smile Designing',
    category: 'Cosmetic',
    desc: 'Comprehensive cosmetic makeovers utilizing veneers and contouring for the perfect smile.',
    icon: <Smile strokeWidth={1} className="w-8 h-8" />,
    img: '',
    col: 3,
    bgColor: 'bg-primary'
  },
  {
    id: 3,
    title: 'Root Canal',
    category: 'Restorative',
    desc: 'Advanced endodontic therapy to save infected teeth, performed painlessly with cutting-edge techniques.',
    icon: <Microscope strokeWidth={1} className="w-8 h-8" />,
    img: '',
    col: 3
  }
];

const categories = ['All Services', 'Preventive', 'Restorative', 'Cosmetic', 'Surgical'];

export const ServicesGrid = () => {
  const [activeCategory, setActiveCategory] = useState('All Services');
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const filteredServices = services.filter(s => 
    activeCategory === 'All Services' || s.category.includes(activeCategory)
  );

  return (
    <section ref={sectionRef} className="pb-16 pt-0 bg-background relative z-10">
      
      {/* Sticky Filter */}
      <div className="sticky top-[64px] md:top-[72px] z-40 bg-background/90 backdrop-blur-xl border-b border-border/30 py-6 mb-16 reveal-up">
        <div className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
          <div className="flex overflow-x-auto pb-2 gap-4 scrollbar-hide snap-x items-center">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start whitespace-nowrap px-8 py-3 rounded-full font-display transition-all duration-300 shadow-sm cursor-hover ${
                  activeCategory === cat 
                    ? 'bg-tertiary text-white' 
                    : 'bg-primary text-neutral hover:text-tertiary hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pb-24">
        
        {/* Using standard grid for filtering since Masonry layout with fixed columns breaks easily with filtered items */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`group rounded-3xl overflow-hidden border border-border/30 flex flex-col cursor-hover shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${service.bgColor || 'bg-white'}`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {service.img && (
                  <div className="h-64 w-full overflow-hidden relative bg-light-gray">
                    <img 
                      src={service.img} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="w-16 h-16 rounded-full bg-light-gray flex items-center justify-center mb-8 text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors duration-500">
                    {service.icon}
                  </div>
                  
                  <span className="label-small tracking-widest uppercase text-neutral mb-3 block text-xs">
                    {service.category}
                  </span>
                  
                  <h3 className="font-display text-2xl md:text-3xl text-tertiary mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-neutral leading-relaxed mb-8 text-sm md:text-base">
                    {service.desc}
                  </p>
                  
                  <div className="mt-auto flex items-center text-tertiary font-medium group-hover:text-secondary transition-colors">
                    Explore Treatment 
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {activeCategory === 'All Services' && (
          <div className="mt-20 flex justify-center reveal-up">
            <button className="border border-border/50 text-tertiary font-display font-medium px-10 py-4 rounded-full hover:bg-tertiary hover:text-white transition-all duration-300 cursor-hover">
              View Complete Gallery
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
