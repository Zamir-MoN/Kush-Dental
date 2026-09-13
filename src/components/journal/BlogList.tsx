import { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { blogPosts, type BlogPost } from '../../data';
import { ArrowUpRight, Calendar, Clock, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
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

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Derive active category from URL search params (or default to 'View all')
  const activeCategory = useMemo(() => {
    if (!categoryParam) return 'View all';
    const matched = categories.find(
      c => c.toLowerCase() === categoryParam.toLowerCase()
    );
    return matched || 'View all';
  }, [categoryParam]);

  const handleSelectCategory = (cat: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat === 'View all') {
        next.delete('category');
      } else {
        next.set('category', cat);
      }
      return next;
    }, { replace: true });
  };

  // Filtered Posts matching selected category and search query
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post: BlogPost) => {
      const matchesCategory = activeCategory === 'View all' || post.category.toLowerCase() === activeCategory.toLowerCase();
      
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

  // Featured spotlight card updates dynamically with the selected category!
  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;

  // Grid posts: remaining posts after the featured spotlight (e.g. 5 remaining posts on 'View all')
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const handleResetFilters = () => {
    handleSelectCategory('View all');
    setSearchQuery('');
  };

  return (
    <section ref={sectionRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12">
      
      {/* Categories Filter Bar (Positioned prominently at top of listings) */}
      <div className="flex justify-center mb-10 sm:mb-12">
        <div className="bg-[#FCFBF8] rounded-2xl p-2 sm:p-2.5 border border-[#E8E2D5] shadow-sm flex items-center overflow-x-auto no-scrollbar gap-1.5 sm:gap-2 max-w-full">
          {categories.map((cat) => {
            const count = cat === 'View all' 
              ? blogPosts.length 
              : blogPosts.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;

            const isActive = activeCategory.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
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

      {/* Featured Spotlight Card (Smoothly updates when category changes) */}
      <AnimatePresence mode="wait">
        {featuredPost && (
          <motion.div
            key={featuredPost.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-14 lg:mb-18"
          >
            <FeaturedPostSpotlight post={featuredPost} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Remaining Clinical Articles */}
      <AnimatePresence mode="wait">
        {gridPosts.length > 0 ? (
          <motion.div
            key={activeCategory + (searchQuery || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full mb-16"
          >
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E8E2D5]">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-zinc-900">
                More Clinical Publications
              </h3>
              <span className="text-xs text-zinc-500 font-sans font-medium">
                {gridPosts.length} additional publication{gridPosts.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-col gap-8 lg:gap-10 w-full">
            {gridPosts.map((post, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <article
                  key={post.id}
                  className={`group luxury-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[#E8E2D5] hover:border-[#DCA51B]/50 flex flex-col ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  } w-full bg-[#FCFBF8] hover:-translate-y-1`}
                >
                  {/* Image Side (Alternating Left/Right) */}
                  <Link 
                    to={`/blog/${post.id}`} 
                    className="md:w-[44%] lg:w-[42%] min-h-[260px] sm:min-h-[300px] md:min-h-[330px] relative overflow-hidden bg-[#141518] shrink-0 cursor-pointer block"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />

                    {/* Category Tag on Image */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1.5 bg-[#141518]/90 backdrop-blur-md text-[#DCA51B] text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/10 shadow-md font-sans">
                        {post.category}
                      </span>
                    </div>

                    {/* Reading Duration Tag */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium rounded-lg flex items-center gap-1.5 font-sans border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
                        {post.readTime}
                      </span>
                    </div>
                  </Link>

                  {/* Editorial Content Side */}
                  <div className="md:w-[56%] lg:w-[58%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between flex-1 min-w-0 bg-[#FCFBF8]">
                    <div className="flex-1 flex flex-col">
                      
                      {/* Top Author Info & Date */}
                      <div className="flex items-center justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-7 h-7 rounded-full object-cover object-top border border-[#DCA51B]/60 shadow-xs shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop";
                            }}
                          />
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-xs font-bold text-[#141518] font-serif truncate">
                              {post.author}
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#DCA51B] shrink-0" />
                          </div>
                        </div>

                        <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium font-sans shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-[#DCA51B]" />
                          {post.date}
                        </span>
                      </div>

                      {/* Main Title */}
                      <Link to={`/blog/${post.id}`} className="block group/title mb-3">
                        <h3 className="font-serif font-bold text-xl sm:text-2xl lg:text-[25px] text-[#141518] group-hover:text-[#DCA51B] transition-colors duration-200 leading-[1.26]">
                          {post.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="font-sans text-zinc-600 text-sm sm:text-base line-clamp-3 leading-relaxed mb-5 font-light">
                        {post.excerpt}
                      </p>

                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag} 
                            className="text-[11px] bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-600 px-2.5 py-1 rounded-lg font-medium font-sans"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Author Role & Read Action */}
                    <div className="pt-4 border-t border-[#E8E2D5] flex items-center justify-between gap-3">
                      <span className="text-xs text-zinc-500 font-sans truncate font-medium">
                        {post.authorRole}
                      </span>

                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 bg-[#141518] hover:bg-[#DCA51B] text-white hover:text-[#141518] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm group-hover:shadow-md cursor-pointer font-sans shrink-0"
                      >
                        <span>Read Study</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>

                  </div>

                </article>
              );
            })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Empty State when no articles match */}
      {!featuredPost && filteredPosts.length === 0 && (
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
