import { ArrowUpRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedPostSpotlightProps {
  post: any;
}

export const FeaturedPostSpotlight = ({ post }: FeaturedPostSpotlightProps) => {
  return (
    <div className="relative mb-6 sm:mb-8">
      {/* Decorative ambient background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#DCA51B]/15 via-transparent to-[#DCA51B]/10 rounded-3xl blur-md opacity-60 pointer-events-none" />

      <div className="relative luxury-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-[#E8E2D5]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Image Side (Compact & Proportional) */}
          <div className="md:col-span-5 relative h-52 sm:h-60 md:h-auto min-h-[200px] md:min-h-[260px] max-h-[320px] overflow-hidden group">
            <img
              src={post.coverImage || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop'}
              alt={post.title}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            
            {/* Overlay Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-1 bg-[#141518]/90 backdrop-blur-md text-[#DCA51B] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full border border-white/10 flex items-center gap-1 font-sans">
                <Sparkles className="w-3 h-3" />
                Featured Study
              </span>
              <span className="px-2.5 py-0.5 bg-[#FAF7F2]/95 backdrop-blur-md text-[#141518] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-full font-sans">
                {post.category || 'Article'}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-[11px] font-medium font-sans">
              <span className="flex items-center gap-1.5 opacity-90">
                <Calendar className="w-3 h-3 text-[#DCA51B]" />
                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Recent'}
              </span>
              <span className="flex items-center gap-1.5 opacity-90">
                <Clock className="w-3 h-3 text-[#DCA51B]" />
                5 min read
              </span>
            </div>
          </div>

          {/* Details Side (Clean, Compact, Balanced) */}
          <div className="md:col-span-7 p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-[#FCFBF8]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-[#DCA51B] uppercase tracking-[0.2em] font-sans">
                  Lead Surgeon Case Review
                </span>
              </div>

              <Link to={`/blog/${post.slug}`} className="group block mb-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl md:text-2xl text-[#141518] leading-snug group-hover:text-[#DCA51B] transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </Link>

              <p className="font-sans text-zinc-600 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 sm:line-clamp-3 font-normal">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-600 text-[11px] rounded-md font-medium font-sans"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 mt-auto border-t border-[#E8E2D5] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={post.authorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop'}
                  alt={post.author || 'Doctor'}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover object-top border border-[#DCA51B]/40 shadow-sm shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-serif font-bold text-xs sm:text-sm text-[#141518] truncate">{post.author || 'Doctor'}</p>
                  <p className="font-sans text-[11px] text-zinc-500 truncate">{post.authorRole || 'Clinic'}</p>
                </div>
              </div>

              <Link
                to={`/blog/${post.slug}`}
                className="inline-flex items-center justify-center gap-1.5 bg-[#141518] hover:bg-[#DCA51B] text-white hover:text-[#141518] font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all duration-300 shadow-sm group cursor-pointer font-sans whitespace-nowrap shrink-0"
              >
                <span>Read Study</span>
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
