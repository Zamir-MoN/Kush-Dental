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
      <AnimatePresence mode="wait">
        {gridPosts.length > 0 ? (
          <motion.div
            key={activeCategory + (searchQuery || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`w-full ${gridPosts.length === 1 ? 'max-w-[720px] mx-auto' : 'grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch'}`}
          >
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="group luxury-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row h-full w-full hover:-translate-y-1"
              >
                {/* Left Image Column (Uniform Aspect & Height) */}
                <Link 
                  to={`/blog/${post.id}`} 
                  className="sm:w-[44%] lg:w-[42%] h-[230px] sm:h-auto min-h-[230px] sm:min-h-full relative overflow-hidden bg-[#FAF7F2] shrink-0 cursor-pointer block"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />

                  {/* Badges Over Image */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 bg-[#141518]/85 backdrop-blur-md text-[#DCA51B] text-[10.5px] font-bold uppercase tracking-wider rounded-full border border-white/10 shadow-sm font-sans">
                      {post.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3.5">
                    <span className="px-2.5 py-0.5 bg-black/75 backdrop-blur-md text-white text-[10.5px] font-medium rounded-lg flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3 text-[#DCA51B]" />
                      {post.readTime}
                    </span>
                  </div>
                </Link>

                {/* Right Content Column */}
                <div className="sm:w-[56%] lg:w-[58%] p-5 sm:p-6 flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex-1 flex flex-col">
                    {/* Publication Date & Author Avatar Line */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={post.authorAvatar}
                          alt={post.author}
                          className="w-6 h-6 rounded-full object-cover object-top border border-[#DCA51B]/50 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop";
                          }}
                        />
                        <span className="text-[11.5px] font-semibold text-[#141518] font-sans truncate">
                          {post.author}
                        </span>
                      </div>
                      <span className="text-[10.5px] text-zinc-500 flex items-center gap-1 font-medium font-sans shrink-0">
                        <Calendar className="w-3 h-3 text-[#DCA51B]" />
                        {post.date}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/blog/${post.id}`} className="block group/title mb-2">
                      <h3 className="font-serif font-bold text-base sm:text-lg text-[#141518] group-hover:text-[#DCA51B] transition-colors duration-200 leading-snug line-clamp-2 min-h-[2.75rem] flex items-center">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="font-sans text-zinc-600 text-xs sm:text-[13px] line-clamp-2 leading-relaxed mb-3 font-light">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Card Bottom: Tags & Link (Pinned strictly at bottom) */}
                  <div className="mt-auto pt-3 border-t border-[#E8E2D5] flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap min-w-0">
                      {post.tags.slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="text-[9.5px] bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-600 px-2 py-0.5 rounded font-medium font-sans whitespace-nowrap truncate max-w-[110px]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/blog/${post.id}`}
                      className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-[#DCA51B] group-hover:translate-x-1 transition-transform shrink-0 cursor-pointer font-sans"
                    >
                      <span>Read Case</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </article>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="luxury-card rounded-3xl p-12 text-center my-8"
          >
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
          </motion.div>
        )}
      </AnimatePresence>

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
