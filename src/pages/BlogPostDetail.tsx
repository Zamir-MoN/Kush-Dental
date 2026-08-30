import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FinalCTA } from '../components/appointment/FinalCTA';
import { blogPosts } from '../data';
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
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const postId = Number(id);
  const post = blogPosts.find((p) => p.id === postId) || blogPosts[0];
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!post) {
    return (
      <div className="bg-background min-h-screen">
        <Header />
        <main className="pt-36 pb-20 max-w-container mx-auto px-margin-mobile text-center">
          <h1 className="font-display font-bold text-4xl text-tertiary mb-4">Post Not Found</h1>
          <p className="font-body text-neutral mb-8">The clinical article you are looking for does not exist or has been moved.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-secondary text-white font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-[#c49216] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Return to Clinical Journal
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />

      <main className="pt-28 md:pt-36 pb-16">
        {/* Navigation & Breadcrumb */}
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button 
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-tertiary hover:text-secondary font-medium text-sm transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-secondary group-hover:-translate-x-1 transition-transform" />
              <span>Back to Clinical Journal</span>
            </button>

            <nav className="flex items-center gap-1.5 text-xs text-neutral">
              <Link to="/" className="hover:text-tertiary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-border" />
              <Link to="/blog" className="hover:text-tertiary transition-colors">Journal</Link>
              <ChevronRight className="w-3 h-3 text-border" />
              <span className="text-secondary font-medium truncate max-w-[150px] sm:max-w-none">{post.category}</span>
            </nav>
          </div>
        </div>

        {/* Article Header Section */}
        <header className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet mb-10 md:mb-12">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3.5 py-1 bg-secondary/15 text-secondary text-xs font-bold uppercase tracking-wider rounded-full">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-neutral font-medium">
              <Calendar className="w-3.5 h-3.5 text-secondary" />
              {post.date}
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1 text-xs text-neutral font-medium">
              <Clock className="w-3.5 h-3.5 text-secondary" />
              {post.readTime}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] leading-[1.18] text-tertiary mb-8 tracking-tight">
            {post.title}
          </h1>

          {/* Author Info Bar & Share Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-border/50">
            {/* Author Profile */}
            <div className="flex items-center gap-4">
              <img 
                src={post.authorAvatar} 
                alt={post.author} 
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-secondary/40 shadow-sm"
              />
              <div>
                <p className="font-display font-bold text-base text-tertiary leading-tight">{post.author}</p>
                <p className="font-body text-xs text-neutral mt-0.5">{post.authorRole}</p>
              </div>
            </div>

            {/* Social Share & Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/80 border border-border/60 hover:border-secondary text-xs font-semibold text-tertiary transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                title="Copy Article Link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-secondary" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/80 border border-border/60 hover:border-secondary flex items-center justify-center text-neutral hover:text-tertiary transition-colors shadow-sm"
                title="Share on Twitter / X"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>

              <Link
                to="/book"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c49216] transition-colors shadow-sm"
              >
                Consult Author
              </Link>
            </div>
          </div>
        </header>

        {/* Feature Image Banner */}
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-tablet mb-12 md:mb-16">
          <div className="relative rounded-[24px] overflow-hidden shadow-md border border-white/60">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-[280px] sm:h-[380px] md:h-[480px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-tertiary/60 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white/90 text-xs sm:text-sm font-body">
              <span className="font-semibold text-secondary">Clinical Archive:</span> {post.title} • Kush Dental Clinic
            </div>
          </div>
        </div>

        {/* Article Body Content */}
        <article className="max-w-3xl mx-auto px-margin-mobile md:px-margin-tablet">
          {/* Introduction Callout */}
          <div className="bg-white/85 backdrop-blur-md border-l-4 border-secondary p-6 sm:p-8 rounded-r-[20px] rounded-l-[4px] shadow-sm mb-10">
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Clinical Overview</span>
            </div>
            <p className="font-body text-base sm:text-lg text-tertiary/90 leading-relaxed font-medium">
              {post.introduction}
            </p>
          </div>

          {/* Dynamic Article Sections */}
          <div className="space-y-10 mb-12">
            {post.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-tertiary tracking-tight">
                  {section.heading}
                </h2>
                
                {section.body.map((para, pIdx) => (
                  <p key={pIdx} className="font-body text-base sm:text-lg text-neutral leading-relaxed">
                    {para}
                  </p>
                ))}

                {section.highlight && (
                  <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-2xl my-4">
                    <p className="font-body text-sm sm:text-base font-semibold text-tertiary leading-relaxed flex items-start gap-3">
                      <Bookmark className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <span>{section.highlight}</span>
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Pull Quote */}
          {post.quote && (
            <figure className="my-12 py-8 px-6 sm:px-10 border-y border-secondary/30 bg-white/40 rounded-2xl text-center">
              <blockquote className="font-display italic text-xl sm:text-2xl text-tertiary leading-snug mb-4">
                "{post.quote.text}"
              </blockquote>
              <figcaption className="font-body font-bold text-sm text-secondary uppercase tracking-widest">
                — {post.quote.author}
              </figcaption>
            </figure>
          )}

          {/* Key Clinical Takeaways Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-[24px] p-6 sm:p-8 border border-border/50 shadow-sm my-12">
            <h3 className="font-display font-bold text-xl text-tertiary mb-5 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <span>Key Clinical Takeaways</span>
            </h3>
            <ul className="space-y-3.5">
              {post.keyTakeaways.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral text-sm sm:text-base leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 mt-2" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tags Cloud */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-border/40 mb-12">
            <span className="text-xs font-bold text-neutral uppercase tracking-wider mr-2">Tags:</span>
            {post.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1.5 bg-tertiary/5 hover:bg-secondary/15 hover:text-secondary rounded-full text-xs font-medium text-neutral transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Bio Box */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[24px] p-6 sm:p-8 shadow-sm mb-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <img 
                src={post.authorAvatar} 
                alt={post.author} 
                className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-secondary shadow-md shrink-0"
              />
              <div className="flex-1">
                <span className="inline-block px-3 py-0.5 bg-secondary/15 text-secondary text-[11px] font-bold uppercase tracking-wider rounded-full mb-1.5">
                  About the Author
                </span>
                <h4 className="font-display font-bold text-xl text-tertiary">{post.author}</h4>
                <p className="font-body text-xs text-secondary font-semibold mb-3">{post.authorRole}</p>
                <p className="font-body text-sm text-neutral leading-relaxed mb-4">
                  Dedicated to biological tissue preservation, bespoke smile aesthetics, and patient-centered hospitality. Providing clinical leadership across cosmetic and reconstructive procedures.
                </p>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-tertiary hover:text-secondary border-b border-tertiary hover:border-secondary pb-0.5 transition-colors cursor-pointer"
                >
                  Book Appointment with {post.author.split(' ')[1] || 'Doctor'} <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles Section */}
        <section className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-12 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="label-small text-secondary block text-xs">Further Reading</span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-tertiary">Related Clinical Articles</h3>
            </div>
            <Link 
              to="/blog" 
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-tertiary hover:text-secondary transition-colors inline-flex items-center gap-1"
            >
              All Articles <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((rPost) => (
              <Link
                key={rPost.id}
                to={`/blog/${rPost.id}`}
                className="group bg-white/70 backdrop-blur-md rounded-[20px] p-5 sm:p-6 border border-border/40 hover:border-secondary/40 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="h-[200px] sm:h-[220px] rounded-[14px] overflow-hidden mb-5 relative">
                  <img 
                    src={rPost.image} 
                    alt={rPost.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md text-tertiary text-xs font-bold uppercase rounded-full shadow-sm">
                    {rPost.category}
                  </span>
                </div>
                <h4 className="font-display font-bold text-xl text-tertiary group-hover:text-secondary transition-colors mb-2 line-clamp-2">
                  {rPost.title}
                </h4>
                <p className="font-body text-neutral text-sm line-clamp-2 mb-4 leading-relaxed">
                  {rPost.excerpt}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-secondary group-hover:underline mt-auto">
                  Read post <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
};
