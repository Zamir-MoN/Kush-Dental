import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FinalCTA } from '../components/appointment/FinalCTA';
import { blogPosts } from '../data';
import { useLenis } from '../components/ui/SmoothScroll';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  Bookmark, 
  ChevronRight
} from 'lucide-react';
import { ToothSparkleIcon } from '../components/common/DentalIcons';

export const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { scrollTo } = useLenis();

  const postId = Number(id);
  const post = blogPosts.find((p) => p.id === postId) || blogPosts[0];
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  useEffect(() => {
    scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [id, scrollTo]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!post) {
    return (
      <main className="pt-36 pb-20 max-w-container mx-auto px-margin-mobile text-center">
        <h1 className="font-display font-bold text-4xl text-tertiary mb-4">Post Not Found</h1>
        <p className="font-body text-neutral mb-8">The clinical article you are looking for does not exist or has been moved.</p>
        <Link to="/blog" className="btn-gold-luxury inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider px-6 py-3.5 rounded-xl cursor-pointer">
          <ArrowLeft className="w-4 h-4 text-[#141518]" /> Return to Blog
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full flex-grow pt-28 md:pt-36 bg-[#FAF7F2]">
      {/* Content wrapper with bottom padding before FinalCTA */}
      <div className="pb-16 sm:pb-24">
      {/* Navigation & Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button 
            onClick={() => navigate('/blog')}
            className="inline-flex items-center gap-2 text-[#141518] hover:text-[#DCA51B] font-medium text-xs sm:text-sm transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#DCA51B] group-hover:-translate-x-1 transition-transform" />
            <span className="font-sans font-semibold">Back to Blog</span>
          </button>

          <nav className="flex items-center gap-2 text-xs text-zinc-500 font-sans">
            <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#E8E2D5]" />
            <Link to="/blog" className="hover:text-zinc-900 transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3 text-[#E8E2D5]" />
            <span className="text-[#DCA51B] font-medium truncate max-w-[150px] sm:max-w-none">{post.category}</span>
          </nav>
        </div>
      </div>

      {/* Article Header Section */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12">
        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3.5 py-1 bg-[#DCA51B]/15 text-[#DCA51B] text-xs font-bold uppercase tracking-wider rounded-full border border-[#DCA51B]/30 font-sans">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium font-sans">
            <Calendar className="w-3.5 h-3.5 text-[#DCA51B]" />
            {post.date}
          </span>
          <span className="text-[#E8E2D5]">•</span>
          <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium font-sans">
            <Clock className="w-3.5 h-3.5 text-[#DCA51B]" />
            {post.readTime}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.16] text-[#141518] mb-8 tracking-tight">
          {post.title}
        </h1>

        {/* Author Info Bar & Share Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[#E8E2D5]">
          {/* Author Profile */}
          <div className="flex items-center gap-4">
            <img 
              src={post.authorAvatar} 
              alt={post.author} 
              className="w-12 h-12 rounded-full object-cover object-top border-2 border-[#DCA51B]/40 shadow-sm"
            />
            <div>
              <p className="font-serif font-bold text-base text-[#141518] leading-tight">{post.author}</p>
              <p className="font-sans text-xs text-zinc-500 mt-0.5">{post.authorRole}</p>
            </div>
          </div>

          {/* Social Share & Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FCFBF8] border border-[#E8E2D5] hover:border-[#DCA51B] text-xs font-semibold text-[#141518] transition-all duration-200 shadow-sm active:scale-95 cursor-pointer font-sans"
              title="Copy Article Link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#DCA51B]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#FCFBF8] border border-[#E8E2D5] hover:border-[#DCA51B] flex items-center justify-center text-zinc-500 hover:text-[#141518] transition-colors shadow-sm"
              title="Share on Twitter / X"
            >
              <Share2 className="w-3.5 h-3.5" />
            </a>

            <Link
              to="/book"
              className="hidden sm:inline-flex btn-gold-luxury py-2 px-4 text-xs font-bold tracking-wider rounded-xl cursor-pointer"
            >
              Consult Author
            </Link>
          </div>
        </div>
      </header>

      {/* Feature Image Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#E8E2D5]">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-[280px] sm:h-[380px] md:h-[480px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white/95 text-xs sm:text-sm font-sans">
            <span className="font-semibold text-[#DCA51B]">Clinical Archive:</span> {post.title} • Kush Dental Clinic
          </div>
        </div>
      </div>

      {/* Article Body Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction Callout */}
        <div className="luxury-card border-l-4 border-l-[#DCA51B] p-6 sm:p-8 rounded-r-3xl rounded-l-md shadow-sm mb-10">
          <div className="flex items-center gap-2 text-[#DCA51B] font-bold text-xs uppercase tracking-wider mb-2 font-sans">
            <ToothSparkleIcon className="w-4 h-4" />
            <span>Clinical Overview</span>
          </div>
          <p className="font-sans text-base sm:text-lg text-zinc-800 leading-relaxed font-normal">
            {post.introduction}
          </p>
        </div>

        {/* Dynamic Article Sections */}
        <div className="space-y-10 mb-12">
          {post.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#141518] tracking-tight">
                {section.heading}
              </h2>
              
              {section.body.map((para, pIdx) => (
                <p key={pIdx} className="font-sans text-base sm:text-lg text-zinc-600 leading-relaxed font-light">
                  {para}
                </p>
              ))}

              {section.highlight && (
                <div className="bg-[#FAF7F2] border border-[#DCA51B]/30 p-5 rounded-2xl my-4">
                  <p className="font-sans text-sm sm:text-base font-medium text-zinc-800 leading-relaxed flex items-start gap-3">
                    <Bookmark className="w-5 h-5 text-[#DCA51B] shrink-0 mt-0.5" />
                    <span>{section.highlight}</span>
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Pull Quote */}
        {post.quote && (
          <figure className="my-12 py-8 px-6 sm:px-10 border-y border-[#DCA51B]/30 bg-[#FCFBF8] rounded-2xl text-center">
            <blockquote className="font-serif italic text-xl sm:text-2xl text-[#141518] leading-snug mb-4">
              "{post.quote.text}"
            </blockquote>
            <figcaption className="font-sans font-bold text-xs sm:text-sm text-[#DCA51B] uppercase tracking-widest">
              — {post.quote.author}
            </figcaption>
          </figure>
        )}

        {/* Key Clinical Takeaways Card */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 my-12">
          <h3 className="font-serif font-bold text-xl text-[#141518] mb-5 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#DCA51B]" />
            <span>Key Clinical Takeaways</span>
          </h3>
          <ul className="space-y-3.5">
            {post.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-600 text-sm sm:text-base leading-relaxed font-sans">
                <span className="w-2 h-2 rounded-full bg-[#DCA51B] shrink-0 mt-2" />
                <span className="font-light">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags Cloud */}
        <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-[#E8E2D5] mb-12 font-sans">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D5] hover:border-[#DCA51B] hover:text-[#DCA51B] rounded-full text-xs font-medium text-zinc-600 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 shadow-sm mb-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img 
              src={post.authorAvatar} 
              alt={post.author} 
              className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-[#DCA51B]/40 shadow-md shrink-0"
            />
            <div className="flex-1">
              <span className="inline-block px-3 py-0.5 bg-[#DCA51B]/15 text-[#DCA51B] text-[11px] font-bold uppercase tracking-wider rounded-full mb-1.5 font-sans">
                About the Author
              </span>
              <h4 className="font-serif font-bold text-xl text-[#141518]">{post.author}</h4>
              <p className="font-sans text-xs text-[#DCA51B] font-semibold mb-3">{post.authorRole}</p>
              <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-4 font-light">
                Dedicated to gentle dental care, natural smile restorations, and patient comfort.
              </p>
              <Link
                to="/book"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#141518] hover:text-[#DCA51B] border-b border-[#141518] hover:border-[#DCA51B] pb-0.5 transition-colors cursor-pointer font-sans"
              >
                Book Appointment with {post.author.split(' ')[1] || 'Doctor'} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 border-t border-[#E8E2D5]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[#DCA51B] text-xs font-bold tracking-widest uppercase block mb-1 font-sans">Further Reading</span>
            <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#141518]">Related Dental Articles</h3>
          </div>
          <Link 
            to="/blog" 
            className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#141518] hover:text-[#DCA51B] transition-colors inline-flex items-center gap-1 font-sans"
          >
            All Articles <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relatedPosts.map((rPost) => (
            <Link
              key={rPost.id}
              to={`/blog/${rPost.id}`}
              className="group luxury-card rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col"
            >
              <div className="h-[200px] sm:h-[220px] rounded-2xl overflow-hidden mb-5 relative border border-[#E8E2D5]">
                <img 
                  src={rPost.image} 
                  alt={rPost.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-[#141518]/85 backdrop-blur-md text-[#DCA51B] text-xs font-bold uppercase rounded-full shadow-sm font-sans">
                  {rPost.category}
                </span>
              </div>
              <h4 className="font-serif font-bold text-xl text-[#141518] group-hover:text-[#DCA51B] transition-colors mb-2 line-clamp-2">
                {rPost.title}
              </h4>
              <p className="font-sans text-zinc-600 text-sm line-clamp-2 mb-4 leading-relaxed font-light">
                {rPost.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#DCA51B] group-hover:translate-x-1 transition-transform mt-auto font-sans">
                Read post <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      </div>

      {/* Final CTA Banner (Seamlessly touches Footer with zero gap) */}
      <FinalCTA />
    </main>
  );
};
