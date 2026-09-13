import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts, type BlogPost } from '../../data';
import { useScrollReveal } from '../../hooks/useGsap';
import { 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { DentalMirrorIcon } from '../common/DentalIcons';
import { Link } from 'react-router-dom';

interface JournalInsightsProps {
  showFilters?: boolean;
}

export const JournalInsights: React.FC<JournalInsightsProps> = ({ showFilters = false }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All Topics');
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const categories = ['All Topics', 'Preventive Care', 'Cosmetic Dentistry', 'Dental Technology', 'Restorative Care'];

  // All 4 curated clinical publications
  const allCurated: BlogPost[] = blogPosts.slice(0, 4);

  // Filter posts based on active category
  const filteredPosts: BlogPost[] = activeCategory === 'All Topics' 
    ? allCurated 
    : allCurated.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  // In "All Topics" mode, first post is the panoramic lead story, next 3 are column features
  const leadPost: BlogPost = allCurated[0];
  const secondaryPosts: BlogPost[] = allCurated.slice(1, 4);

  return (
    <section 
      id="journal" 
      ref={sectionRef} 
      className="py-24 sm:py-32 lg:py-36 px-4 sm:px-6 lg:px-12 bg-[#FAF7F2] border-b border-[#E8E2D5] overflow-hidden relative"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#DCA51B]/[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* 1. Editorial Masthead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 lg:mb-14">
          <div className="lg:col-span-8 reveal-up">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-zinc-900 leading-[1.12] tracking-tight">
              Journal &amp; Insights<span className="text-[#DCA51B]">.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end lg:pb-1 reveal-up">
            <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed border-l-2 border-[#DCA51B]/60 pl-5 mb-4">
              Helpful oral care guides, dental treatment comparisons, and smile tips from our dental team.
            </p>
            <div className="pl-5">
              <Link 
                to="/blog" 
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 hover:text-[#DCA51B] transition-colors group font-sans"
              >
                <span>EXPLORE ALL ARTICLES</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300 text-[#DCA51B]" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Interactive Category Filter Bar (Hidden on Home Page) */}
        {showFilters && (
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 sm:mb-12 no-scrollbar reveal-up">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold font-sans tracking-wider uppercase transition-all duration-300 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#141518] text-[#DCA51B] shadow-md border border-[#DCA51B]/40 scale-102'
                      : 'bg-white text-zinc-600 hover:text-zinc-900 border border-[#E8E2D5] hover:border-[#DCA51B]/40'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. New Editorial Layout */}
        <AnimatePresence mode="wait">
          {activeCategory === 'All Topics' ? (
            /* ---------------- MODE A: PANORAMIC LEAD + 3-COLUMN DISPATCHES ---------------- */
            <motion.div
              key="all-topics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="space-y-8 lg:space-y-10"
            >
              {/* Grand Panoramic Lead Feature */}
              <div className="bg-white rounded-3xl border border-[#E8E2D5] hover:border-[#DCA51B]/50 shadow-xl hover:shadow-2xl transition-all duration-400 overflow-hidden group reveal-up">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  
                  {/* Left: Cinematic Clinical Image */}
                  <div className="lg:col-span-7 relative h-[280px] sm:h-[380px] lg:h-auto min-h-[340px] overflow-hidden bg-[#141518]">
                    <img 
                      src={leadPost.image} 
                      alt={leadPost.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/20 lg:to-black/60" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2">
                      <span className="px-3.5 py-1.5 rounded-full bg-[#141518]/90 backdrop-blur-md border border-[#DCA51B]/40 text-[#DCA51B] text-[11px] font-bold uppercase tracking-wider font-sans flex items-center gap-1.5 shadow-lg">
                        <Bookmark className="w-3.5 h-3.5 fill-[#DCA51B]" />
                        Lead Cover Story
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/95 text-zinc-900 text-[10.5px] font-bold uppercase tracking-wider font-sans shadow-md">
                        {leadPost.category}
                      </span>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="absolute bottom-5 left-5 right-5 text-white/90 flex items-center justify-between text-xs font-sans">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#DCA51B]" />
                        {leadPost.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
                        {leadPost.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Right: Rich Editorial Content */}
                  <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[#DCA51B] text-[11px] font-bold uppercase tracking-[0.2em] font-sans mb-3">
                        <Sparkles className="w-3 h-3" />
                        <span>Featured Research Analysis</span>
                      </div>

                      <Link to={`/blog/${leadPost.id}`} className="block group/title">
                        <h3 className="font-serif font-bold text-2xl sm:text-3xl lg:text-[32px] text-zinc-900 group-hover/title:text-[#DCA51B] transition-colors leading-[1.18] tracking-tight mb-4">
                          {leadPost.title}
                        </h3>
                      </Link>

                      <p className="text-zinc-600 text-sm sm:text-base font-sans font-light leading-relaxed mb-6">
                        {leadPost.excerpt}
                      </p>

                      {/* Editorial Pull Quote */}
                      {leadPost.quote && (
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] mb-6 border-l-4 border-l-[#DCA51B]">
                          <p className="font-serif italic text-xs sm:text-sm text-zinc-800 leading-relaxed">
                            "{leadPost.quote.text}"
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Author & Action */}
                    <div className="pt-6 border-t border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={leadPost.authorAvatar} 
                          alt={leadPost.author} 
                          className="w-11 h-11 rounded-full object-cover border border-[#DCA51B]/40 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-zinc-900 font-sans block">
                              {leadPost.author}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B]" />
                          </div>
                          <span className="text-xs text-zinc-500 font-sans block">
                            {leadPost.authorRole}
                          </span>
                        </div>
                      </div>

                      <Link 
                        to={`/blog/${leadPost.id}`}
                        className="btn-gold-luxury group/btn py-2.5 px-5 text-xs font-bold tracking-wider inline-flex items-center justify-center shrink-0"
                      >
                        <span>READ ESSAY</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>

                </div>
              </div>

              {/* 3 Companion Editorial Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                {secondaryPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="bg-white rounded-3xl border border-[#E8E2D5] hover:border-[#DCA51B]/60 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer reveal-up"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="relative w-full h-[200px] sm:h-[220px] rounded-2xl overflow-hidden mb-5 bg-[#141518]">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105 filter brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        <div className="absolute top-3.5 left-3.5">
                          <span className="px-3 py-1 rounded-full bg-white/95 text-zinc-900 text-[10px] font-bold uppercase tracking-wider font-sans shadow-md">
                            {post.category}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3.5 right-3.5 text-white/90 flex items-center justify-between text-[11px] font-sans">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-serif font-bold text-xl text-zinc-900 group-hover:text-[#DCA51B] transition-colors leading-snug mb-3 line-clamp-2">
                        {post.title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-zinc-600 text-xs sm:text-sm font-sans font-light leading-relaxed line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Bottom Author Row */}
                    <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.author} 
                          className="w-8 h-8 rounded-full object-cover border border-[#DCA51B]/30"
                        />
                        <div>
                          <p className="text-xs font-bold text-zinc-900 font-sans leading-tight">
                            {post.author}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-sans">
                            {post.readTime}
                          </p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:border-[#DCA51B] group-hover:text-[#141518] text-zinc-700 flex items-center justify-center transition-all duration-300 shrink-0">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                  </Link>
                ))}
              </div>

            </motion.div>
          ) : (
            /* ---------------- MODE B: FILTERED CATEGORY GRID ---------------- */
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
            >
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="bg-white rounded-3xl border border-[#E8E2D5] hover:border-[#DCA51B]/60 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Card Image */}
                    <div className="relative w-full h-[220px] rounded-2xl overflow-hidden mb-5 bg-[#141518]">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105 filter brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-3.5 left-3.5">
                        <span className="px-3 py-1 rounded-full bg-white/95 text-zinc-900 text-[10px] font-bold uppercase tracking-wider font-sans shadow-md">
                          {post.category}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3.5 right-3.5 text-white/90 flex items-center justify-between text-[11px] font-sans">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="font-serif font-bold text-xl text-zinc-900 group-hover:text-[#DCA51B] transition-colors leading-snug mb-3">
                      {post.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-zinc-600 text-xs sm:text-sm font-sans font-light leading-relaxed line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Bottom Author Row */}
                  <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.author} 
                        className="w-8 h-8 rounded-full object-cover border border-[#DCA51B]/30"
                      />
                      <div>
                        <p className="text-xs font-bold text-zinc-900 font-sans leading-tight">
                          {post.author}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-sans">
                          {post.authorRole}
                        </p>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] group-hover:bg-[#DCA51B] group-hover:border-[#DCA51B] group-hover:text-[#141518] text-zinc-700 flex items-center justify-center transition-all duration-300 shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Bottom Academic Banner Strip */}
        <div className="mt-12 lg:mt-16 rounded-2xl bg-white border border-[#E8E2D5] p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 reveal-up">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#DCA51B]/12 border border-[#DCA51B]/30 flex items-center justify-center shrink-0 text-[#DCA51B]">
              <DentalMirrorIcon className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-serif font-bold text-sm sm:text-base text-zinc-900">
                Interested in surgical protocols or smile restorations?
              </h5>
              <p className="text-xs text-zinc-500 font-sans">
                Browse our documented case library and patient smile transformations.
              </p>
            </div>
          </div>

          <Link 
            to="/blog"
            className="btn-outline-luxury py-2.5 px-5 text-xs font-bold uppercase tracking-wider shrink-0"
          >
            <span>VIEW CLINICAL ARCHIVE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
};
