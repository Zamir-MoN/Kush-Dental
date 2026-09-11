import type { BlogPost } from '../../data';
import { ArrowUpRight, Calendar, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedPostSpotlightProps {
  post: BlogPost;
}

export const FeaturedPostSpotlight = ({ post }: FeaturedPostSpotlightProps) => {
  return (
    <div className="relative mb-16 lg:mb-24">
      {/* Decorative ambient background */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#DCA51B]/20 via-transparent to-[#DCA51B]/10 rounded-[32px] blur-xl opacity-70 pointer-events-none" />

      <div className="relative luxury-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Image Side */}
          <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[460px] overflow-hidden group">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Overlay Badges */}
            <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1.5 bg-[#141518]/85 backdrop-blur-md text-[#DCA51B] text-xs font-bold uppercase tracking-wider rounded-full border border-white/10 flex items-center gap-1.5 font-sans">
                <Sparkles className="w-3 h-3" />
                Featured Clinical Study
              </span>
              <span className="px-3 py-1 bg-[#FAF7F2]/90 backdrop-blur-md text-[#141518] text-xs font-bold uppercase tracking-wider rounded-full font-sans">
                {post.category}
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between text-xs font-medium font-sans">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#DCA51B]" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Details Side */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#FCFBF8]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-[#DCA51B] uppercase tracking-[0.2em] font-sans">
                  Lead Surgeon Case Review
                </span>
              </div>

              <Link to={`/blog/${post.id}`} className="group block">
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#141518] leading-[1.22] mb-4 group-hover:text-[#DCA51B] transition-colors">
                  {post.title}
                </h2>
              </Link>

              <p className="font-sans text-zinc-600 text-sm sm:text-base leading-relaxed mb-6 line-clamp-4 font-light">
                {post.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#FAF7F2] border border-[#E8E2D5] text-zinc-600 text-xs rounded-lg font-medium font-sans"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Footer & CTA */}
            <div className="pt-6 border-t border-[#E8E2D5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#DCA51B]/40 shadow-sm"
                />
                <div>
                  <p className="font-serif font-bold text-sm text-[#141518]">{post.author}</p>
                  <p className="font-sans text-xs text-zinc-500">{post.authorRole}</p>
                </div>
              </div>

              <Link
                to={`/blog/${post.id}`}
                className="inline-flex items-center justify-center gap-2 bg-[#141518] hover:bg-[#DCA51B] text-white hover:text-[#141518] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 shadow-md group cursor-pointer font-sans"
              >
                <span>Read Study</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
