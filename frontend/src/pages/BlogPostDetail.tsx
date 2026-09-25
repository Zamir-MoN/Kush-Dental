import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FinalCTA } from '../components/appointment/FinalCTA';
import { useLenis } from '../components/ui/SmoothScroll';
import { apiClient } from '../lib/apiClient';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Calendar, 
  Share2, 
  Copy, 
  Check, 
  ChevronRight
} from 'lucide-react';
import { ToothSparkleIcon } from '../components/common/DentalIcons';

export const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>(); // ID is actually slug
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { scrollTo } = useLenis();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiClient<any>(`/api/v1/public/blog/${id}`, { method: 'GET' });
        setPost(data);
      } catch (err) {
        console.error('Post not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

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

  if (loading) {
    return (
      <main className="pt-36 pb-20 max-w-container mx-auto px-margin-mobile text-center">
        <h1 className="font-display font-bold text-4xl text-tertiary mb-4">Loading...</h1>
      </main>
    );
  }

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
            <span className="text-[#DCA51B] font-medium truncate max-w-[150px] sm:max-w-none">{post.category || 'Article'}</span>
          </nav>
        </div>
      </div>

      {/* Article Header Section */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 md:mb-12">
        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-3.5 py-1 bg-[#DCA51B]/15 text-[#DCA51B] text-xs font-bold uppercase tracking-wider rounded-full border border-[#DCA51B]/30 font-sans">
            Article
          </span>
          <span className="flex items-center gap-1 text-xs text-zinc-500 font-medium font-sans">
            <Calendar className="w-3.5 h-3.5 text-[#DCA51B]" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
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
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop" 
              alt="Doctor" 
              className="w-12 h-12 rounded-full object-cover object-top border-2 border-[#DCA51B]/40 shadow-sm"
            />
            <div>
              <p className="font-serif font-bold text-base text-[#141518] leading-tight">Doctor</p>
              <p className="font-sans text-xs text-zinc-500 mt-0.5">Clinic</p>
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
            src={post.coverImage || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=800&auto=format&fit=crop'} 
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
            {post.excerpt}
          </p>
        </div>

        {/* Dynamic Article Sections rendered via HTML */}
        <div 
          className="prose prose-lg prose-zinc max-w-none prose-headings:font-serif prose-headings:text-[#141518] prose-p:font-sans prose-p:font-light prose-p:text-zinc-600 prose-a:text-[#DCA51B] mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio Box */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 shadow-sm mb-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop" 
              alt="Doctor" 
              className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-[#DCA51B]/40 shadow-md shrink-0"
            />
            <div className="flex-1">
              <span className="inline-block px-3 py-0.5 bg-[#DCA51B]/15 text-[#DCA51B] text-[11px] font-bold uppercase tracking-wider rounded-full mb-1.5 font-sans">
                About the Author
              </span>
              <h4 className="font-serif font-bold text-xl text-[#141518]">Doctor</h4>
              <p className="font-sans text-xs text-[#DCA51B] font-semibold mb-3">Clinic</p>
              <p className="font-sans text-sm text-zinc-600 leading-relaxed mb-4 font-light">
                Dedicated to gentle dental care, natural smile restorations, and patient comfort.
              </p>
              <Link
                to="/book"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#141518] hover:text-[#DCA51B] border-b border-[#141518] hover:border-[#DCA51B] pb-0.5 transition-colors cursor-pointer font-sans"
              >
                Book Appointment <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
      </div>

      {/* Final CTA Banner (Seamlessly touches Footer with zero gap) */}
      <FinalCTA />
    </main>
  );
};
