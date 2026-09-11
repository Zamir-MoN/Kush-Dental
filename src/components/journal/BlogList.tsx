import { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { blogPosts, type BlogPost } from '../../data';
import { ArrowUpRight, Calendar, Clock, Sparkles, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeaturedPostSpotlight } from './FeaturedPostSpotlight';
import { BlogNewsletter } from './BlogNewsletter';
import { EditorialStandards } from './EditorialStandards';

const categories = ['View all', 'Cosmetics', 'Implantology', 'Orthodontics', 'Oral Surgery', 'Restorative', 'Technology'];

interface BlogListProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const BlogList = ({ searchQuery, setSearchQuery }: BlogListProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const [activeCategory, setActiveCategory] = useState('View all');

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post: BlogPost) => {
      const matchesCategory = activeCategory === 'View all' || post.category === activeCategory;
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.author.toLowerCase().includes(q) ||
        post.tags.some(t => t.toLowerCase().includes(q))
      );

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Featured post is the first one in the dataset when on 'View all' without search
  const featuredPost = (activeCategory === 'View all' && !searchQuery) 
    ? blogPosts[0] 
    : null;

  // Grid posts (exclude featuredPost if it's shown in spotlight)
  const gridPosts = featuredPost 
    ? filteredPosts.filter(p => p.id !== featuredPost.id)
    : filteredPosts;

  const handleResetFilters = () => {
    setActiveCategory('View all');
    setSearchQuery('');
  };

  return (
    <section ref={sectionRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16">
      
      {/* Featured Spotlight (Only shown on primary default view) */}
      {featuredPost && (
        <div className="reveal-up">
          <FeaturedPostSpotlight post={featuredPost} />
        </div>
      )}

      {/* Categories Filter Bar */}
      <div className="flex justify-center mb-12 reveal-up">
        <div className="bg-[#FCFBF8] rounded-2xl p-2 sm:p-2.5 border border-[#E8E2D5] shadow-sm flex items-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 max-w-full">
          {categories.map((cat) => {
            const count = cat === 'View all' 
              ? blogPosts.length 
              : blogPosts.filter(p => p.category === cat).length;

            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-2 cursor-pointer font-sans ${
                  isActive
                    ? 'text-white'
                    : 'bg-[#FAF7F2] text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="blogActiveCategoryPill"
                    className="absolute inset-0 bg-[#141518] rounded-xl shadow-md z-0"
                    transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.8 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
                <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-md font-sans transition-colors ${
                  isActive ? 'bg-[#DCA51B] text-[#141518] font-extrabold shadow-sm' : 'bg-[#E8E2D5] text-zinc-600 font-semibold'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Clinical Articles */}
      {gridPosts.length > 0 ? (
        <div className={`grid gap-8 lg:gap-10 ${gridPosts.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          <AnimatePresence mode="popLayout">
            {gridPosts.map((post, i) => (
              <motion.article
                key={post.id}
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
                className="group luxury-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
              >
                {/* Left Image Column */}
                <Link to={`/blog/${post.id}`} className="sm:w-[44%] lg:w-[42%] min-h-[220px] sm:min-h-[270px] relative overflow-hidden bg-[#FAF7F2] shrink-0 cursor-pointer">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Badges Over Image */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#141518]/85 backdrop-blur-md text-[#DCA51B] text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/10 shadow-sm font-sans">
                      {post.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium rounded-lg flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3 text-[#DCA51B]" />
                      {post.readTime}
                    </span>
                  </div>
                </Link>

                {/* Right Content Column */}
                <div className="sm:w-[56%] lg:w-[58%] p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    {/* Publication Date & Author Avatar Line */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-7 h-7 rounded-full object-cover object-top border border-[#DCA51B]/50"
                        />
                        <span className="text-xs font-semibold text-[#141518] font-sans">
                          {post.author}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-medium font-sans">
                        <Calendar className="w-3 h-3 text-[#DCA51B]" />
                        {post.date}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/blog/${post.id}`} className="block group/title">
                      <h3 className="font-serif font-bold text-xl sm:text-[22px] text-[#141518] group-hover:text-[#DCA51B] transition-colors duration-200 leading-snug mb-3">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="font-sans text-zinc-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 font-light">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Card Bottom: Tags & Link */}
                  <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-600 px-2 py-0.5 rounded font-medium font-sans">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#DCA51B] group-hover:translate-x-1 transition-transform shrink-0 cursor-pointer font-sans"
                    >
                      <span>Read Case</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <div className="luxury-card rounded-3xl p-12 text-center my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#DCA51B]/30 flex items-center justify-center text-[#DCA51B] mx-auto mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-[#141518] mb-2">No Matching Articles Found</h3>
          <p className="font-sans text-zinc-600 text-sm max-w-md mx-auto mb-6 leading-relaxed font-light">
            We couldn't find any clinical publications matching your filter criteria. Try clearing search filters or selecting another specialty.
          </p>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#141518] text-white hover:bg-[#DCA51B] hover:text-[#141518] font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md cursor-pointer font-sans"
          >
            <RefreshCw className="w-4 h-4" />
            <span>View All Clinical Articles</span>
          </button>
        </div>
      )}

      {/* Middle VIP Digest Banner */}
      <div className="reveal-up">
        <BlogNewsletter />
      </div>

      {/* Editorial Standards & Guarantees */}
      <div className="reveal-up">
        <EditorialStandards />
      </div>

    </section>
  );
};
