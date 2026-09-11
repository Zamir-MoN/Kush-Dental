import { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { Sparkles, Search, BookOpen, ShieldCheck, Microscope, Layers } from 'lucide-react';

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalArticles: number;
}

export const BlogHero = ({ searchQuery, setSearchQuery, totalArticles }: BlogHeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#121316] text-white pt-28 sm:pt-36 pb-16 lg:pb-24 relative overflow-hidden"
    >
      {/* Background Topographic Ambient Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <svg className="w-full h-full object-cover" viewBox="0 0 1000 700" fill="none">
          <path d="M-50 150 C200 80 400 350 700 250 C900 180 1050 350 1200 280" stroke="#DCA51B" strokeWidth="1.2" />
          <path d="M-50 230 C200 160 400 430 700 330 C900 260 1050 430 1200 360" stroke="#DCA51B" strokeWidth="1.2" />
          <path d="M-50 310 C200 240 400 510 700 410 C900 340 1050 510 1200 440" stroke="#DCA51B" strokeWidth="1.2" />
        </svg>
      </div>

      {/* Subtle Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#DCA51B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="reveal-up mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 font-sans">
          <Link to="/" className="hover:text-[#DCA51B] transition-colors">Home</Link>
          <span className="text-zinc-600">/</span>
          <span className="text-[#DCA51B]">Clinical Journal & Insights</span>
        </div>

        {/* Hero Main Header Content */}
        <div className="max-w-4xl mx-auto text-center reveal-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DCA51B]/15 border border-[#DCA51B]/30 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#DCA51B]" />
            <span className="text-[#DCA51B] tracking-[0.22em] text-xs uppercase font-bold font-sans">
              EVIDENCE-BASED PERSPECTIVES • CLINICAL JOURNAL
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.12] text-white mb-6 tracking-tight">
            Surgical Breakthroughs & <br className="hidden sm:inline" />
            <span className="italic font-light">Aesthetic Mastery</span><span className="text-[#DCA51B]">.</span>
          </h1>

          <p className="text-zinc-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-light mb-10">
            Peer-reviewed perspectives, 3D guided surgical analyses, and biomimetic smile design methodologies authored directly by our resident dental surgeons.
          </p>

          {/* Search Box in Hero */}
          <div className="max-w-xl mx-auto relative mb-12">
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 focus-within:border-[#DCA51B] focus-within:ring-2 focus-within:ring-[#DCA51B]/25 transition-all shadow-xl">
              <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clinical topics, treatments, authors, or tags..."
                className="w-full bg-transparent text-white placeholder-zinc-400 px-4 py-3 text-sm sm:text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 text-xs font-semibold text-zinc-400 hover:text-white px-2.5 py-1 bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-xs text-zinc-400 mt-2 text-left sm:text-center">
                Showing results matching "<span className="text-[#DCA51B]">{searchQuery}</span>" ({totalArticles} articles found)
              </p>
            )}
          </div>

          {/* Quick Highlight Pillars / Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-sans font-medium text-center sm:text-left">
              <BookOpen className="w-4 h-4 text-[#DCA51B] shrink-0" />
              <span>6 In-Depth Papers</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-sans font-medium text-center sm:text-left">
              <ShieldCheck className="w-4 h-4 text-[#DCA51B] shrink-0" />
              <span>100% Peer-Reviewed</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-sans font-medium text-center sm:text-left">
              <Microscope className="w-4 h-4 text-[#DCA51B] shrink-0" />
              <span>Biomimetic Science</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-zinc-300 text-xs sm:text-sm font-sans font-medium text-center sm:text-left">
              <Layers className="w-4 h-4 text-[#DCA51B] shrink-0" />
              <span>5 Clinical Branches</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
