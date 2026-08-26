import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { featuredArticles, articlesList } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const JournalInsights = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const nextCard = () => setCurrentIndex((prev) => (prev + 1) % featuredArticles.length);
  const prevCard = () => setCurrentIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);

  return (
    <section ref={sectionRef} id="blog" className="py-section-mobile md:py-section-desktop px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-primary border-b border-border/30">
      <div className="max-w-container mx-auto">
        <div className="text-center mb-16 reveal-up">
          <h2 className="font-display text-4xl lg:text-5xl mb-4">Journal & Insights</h2>
          <p className="text-neutral max-w-2xl mx-auto text-sm">
            Insights, trends, and clinical perspectives on the art and science of luxury dentistry.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-24 items-center">
          
          {/* Animated Stack */}
          <div className="relative w-full aspect-[4/3] max-w-[600px] mx-auto h-[400px] xl:h-[450px] reveal-up">
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
                      opacity: isCurrent ? 1 : isPrev ? 0.8 : 0.5,
                      y: isCurrent ? 0 : isPrev ? 15 : 30,
                      scale: isCurrent ? 1 : isPrev ? 0.97 : 0.94,
                      zIndex: isCurrent ? 30 : isPrev ? 20 : 10,
                    }}
                    exit={{ opacity: 0, y: -40, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 bg-primary rounded-3xl shadow-md border border-border/30 flex flex-col overflow-hidden"
                  >
                    <div className="h-1/2 w-full bg-soft-gray overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                      <span className="label-small text-secondary mb-2 block">{article.category}</span>
                      <h3 className="font-display text-2xl mb-3 text-tertiary">{article.title}</h3>
                      <p className="text-neutral text-sm line-clamp-2">{article.excerpt}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Controls & Article List */}
          <div className="flex flex-col justify-center reveal-up" style={{ transitionDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
              <h3 className="font-display text-3xl lg:text-4xl text-tertiary">Featured Articles</h3>
              <div className="flex gap-3">
                <button 
                  onClick={prevCard}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:text-primary hover:border-secondary transition-colors cursor-hover text-tertiary"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button 
                  onClick={nextCard}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:text-primary hover:border-secondary transition-colors cursor-hover text-tertiary"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {articlesList.map((article, i) => (
                <div 
                  key={i} 
                  className="group cursor-hover"
                  onMouseEnter={() => setCurrentIndex(i)}
                >
                  <span className="label-small text-border text-[10px] block mb-2 group-hover:text-neutral transition-colors">{article.date}</span>
                  <h4 className="font-display text-2xl text-tertiary group-hover:text-secondary transition-colors duration-300 mb-2">
                    {article.title}
                  </h4>
                  <p className="text-neutral text-sm line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  {i < articlesList.length - 1 && <div className="w-full h-px bg-border/30 mt-6" />}
                </div>
              ))}
            </div>

            <button className="mt-10 label-small text-tertiary border-b border-tertiary pb-1 hover:text-secondary hover:border-secondary transition-colors cursor-hover w-max">
              View All Articles
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
