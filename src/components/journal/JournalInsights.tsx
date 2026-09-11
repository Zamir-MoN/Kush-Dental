import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { featuredArticles, articlesList } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowUp, ArrowDown, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JournalInsights = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);

  return (
    <section ref={sectionRef} id="blog" className="py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-12 bg-white border-b border-[#E8E2D5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20 reveal-up">
          <div className="inline-flex items-center gap-2 mb-3.5">
            <Sparkles className="w-4 h-4 text-[#DCA51B] icon-subtle-pulse" />
            <span className="text-[#DCA51B] font-bold text-xs tracking-[0.22em] uppercase font-sans">
              CLINICAL PERSPECTIVES
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-zinc-900 leading-tight mb-4 tracking-tight">
            Journal & Insights
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed">
            Breakthrough research, restorative case analyses, and expert perspectives on modern dental aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16 items-center">
          
          {/* Animated 3D Stack */}
          <div className="relative w-full max-w-[580px] mx-auto h-[400px] sm:h-[460px] xl:h-[480px] reveal-up">
            <AnimatePresence mode="popLayout">
              {featuredArticles.map((article, index) => {
                const isCurrent = index === currentIndex;
                const isPrev = index === (currentIndex + 1) % featuredArticles.length;
                const isPrevPrev = index === (currentIndex + 2) % featuredArticles.length;
                
                if (!isCurrent && !isPrev && !isPrevPrev) return null;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{
                      opacity: isCurrent ? 1 : isPrev ? 0.75 : 0.45,
                      y: isCurrent ? 0 : isPrev ? 18 : 36,
                      scale: isCurrent ? 1 : isPrev ? 0.96 : 0.92,
                      zIndex: isCurrent ? 30 : isPrev ? 20 : 10,
                    }}
                    exit={{ opacity: 0, y: -40, scale: 0.9 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
                    className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-[#E8E2D5] flex flex-col overflow-hidden"
                  >
                    <Link to={`/blog/${index + 1}`} className="block h-[52%] w-full bg-[#FAF7F2] overflow-hidden group">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </Link>
                    <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                      <span className="text-[#DCA51B] font-bold text-xs uppercase tracking-widest mb-2 block font-sans">
                        {article.category}
                      </span>
                      <Link to={`/blog/${index + 1}`} className="block font-serif font-bold text-xl sm:text-2xl mb-2 text-zinc-900 hover:text-[#DCA51B] transition-colors leading-snug">
                        {article.title}
                      </Link>
                      <p className="text-zinc-500 text-xs sm:text-sm font-sans line-clamp-2 leading-relaxed font-light">
                        {article.excerpt}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls & Article List */}
          <div className="flex flex-col justify-center reveal-up" style={{ transitionDelay: '0.15s' }}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E2D5]">
              <h3 className="font-serif font-bold text-2xl lg:text-3xl text-zinc-900">Curated Articles</h3>
              <div className="flex gap-2.5">
                <button 
                  onClick={prevCard}
                  aria-label="Previous article"
                  className="w-10 h-10 rounded-full border border-[#E8E2D5] flex items-center justify-center hover:bg-[#DCA51B] hover:text-[#141518] hover:border-[#DCA51B] transition-all cursor-pointer text-zinc-700 shadow-sm"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextCard}
                  aria-label="Next article"
                  className="w-10 h-10 rounded-full border border-[#E8E2D5] flex items-center justify-center hover:bg-[#DCA51B] hover:text-[#141518] hover:border-[#DCA51B] transition-all cursor-pointer text-zinc-700 shadow-sm"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {articlesList.map((article, i) => (
                <Link 
                  to={`/blog/${i + 1}`}
                  key={i} 
                  className="group block"
                  onMouseEnter={() => setCurrentIndex(i)}
                >
                  <span className="text-zinc-400 text-[11px] font-bold tracking-widest uppercase block mb-1 font-sans">
                    {article.date}
                  </span>
                  <h4 className="font-serif font-bold text-lg sm:text-xl text-zinc-900 group-hover:text-[#DCA51B] transition-colors duration-200 mb-1 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-zinc-500 text-xs sm:text-sm line-clamp-2 leading-relaxed font-sans font-light">
                    {article.excerpt}
                  </p>
                  {i < articlesList.length - 1 && <div className="w-full h-px bg-[#E8E2D5]/70 mt-5" />}
                </Link>
              ))}
            </div>

            <Link 
              to="/blog" 
              className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#DCA51B] border-b border-zinc-400 hover:border-[#DCA51B] pb-1 transition-colors w-max group"
            >
              <span>EXPLORE ALL ARTICLES</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
