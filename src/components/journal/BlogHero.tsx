import React, { useRef } from 'react';
import { useScrollReveal } from '../../hooks/useGsap';
import { Link } from 'react-router-dom';
import { 
  Search, 
  X
} from 'lucide-react';
import { 
  ToothSparkleIcon, 
  DentalShieldIcon, 
  DentalMirrorIcon, 
  DentalCrownIcon 
} from '../common/DentalIcons';
import { AnimatedWaveContours } from '../common/AnimatedWaveContours';

interface BlogHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalArticles: number;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  totalArticles 
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const popularTopics = [
    'Teeth Whitening',
    'Dental Implants',
    'Clear Aligners',
    'Teeth Cleaning'
  ];

  const editorialCredentials = [
    {
      icon: ToothSparkleIcon,
      title: "Helpful Guides",
      subtitle: "Easy patient guides"
    },
    {
      icon: DentalShieldIcon,
      title: "Doctor Verified",
      subtitle: "Written by dentists"
    },
    {
      icon: DentalMirrorIcon,
      title: "Preventive Care",
      subtitle: "Enamel & oral hygiene"
    },
    {
      icon: DentalCrownIcon,
      title: "Full Dental Care",
      subtitle: "Restorations & implants"
    }
  ];

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#FAF7F2] text-zinc-900 pt-28 sm:pt-36 pb-16 lg:pb-24 relative overflow-hidden border-b border-[#E8E2D5]"
    >
      {/* Background Topographic Wave Contours (Golden Luxury Wave Flow) */}
      <AnimatedWaveContours />

      {/* Radial Gold Ambient Glow */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-[#DCA51B]/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* 1. Centered Breadcrumb Navigation */}
        <div className="reveal-up mb-5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 font-sans">
          <Link to="/" className="hover:text-[#DCA51B] transition-colors">Home</Link>
          <span className="text-zinc-300">/</span>
          <span className="text-[#DCA51B]">Blog</span>
        </div>

        {/* 2. Grand Scholarly Editorial Masthead */}
        <div className="max-w-4xl mx-auto text-center reveal-up">
          
          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-normal leading-[1.1] text-zinc-900 mb-5 tracking-tight">
            Dental Health &amp; <br />
            <span className="italic font-normal text-[#DCA51B]">Smile Care Guides</span><span className="text-[#DCA51B]">.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-zinc-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-sans font-light mb-9">
            Clear dental advice, treatment guides, and simple oral health tips from our experienced dental team.
          </p>

          {/* 3. Bespoke Floating Search Hub */}
          <div className="max-w-2xl mx-auto relative mb-5">
            <div className="relative flex items-center bg-white border border-[#E8E2D5] focus-within:border-[#DCA51B] focus-within:ring-2 focus-within:ring-[#DCA51B]/20 rounded-2xl p-1.5 transition-all shadow-sm">
              <Search className="w-5 h-5 text-[#DCA51B] ml-4 shrink-0" />
              <input
                id="blog-search-input"
                name="searchQuery"
                aria-label="Search dental topics, treatments, or questions"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dental topics, treatments, or questions..."
                className="w-full bg-transparent text-zinc-900 placeholder-zinc-400 px-4 py-3 text-sm sm:text-base focus:outline-none font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mr-3 inline-flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-900 px-2.5 py-1.5 bg-[#FAF7F2] hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer border border-[#E8E2D5]"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Search Match Counter */}
            {searchQuery && (
              <p className="text-xs text-zinc-500 mt-2 text-center font-sans">
                Showing results matching "<span className="text-[#DCA51B] font-bold">{searchQuery}</span>" ({totalArticles} articles found)
              </p>
            )}
          </div>

          {/* Quick Popular Topics Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs text-zinc-500 font-sans">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-zinc-400 mr-1">Trending Topics:</span>
            {popularTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => setSearchQuery(topic)}
                className={`px-3.5 py-1.5 rounded-full border transition-all cursor-pointer font-medium text-xs ${
                  searchQuery.toLowerCase() === topic.toLowerCase()
                    ? 'bg-[#141518] text-white border-[#141518]'
                    : 'bg-white hover:bg-[#FAF7F2] text-zinc-700 hover:text-zinc-900 border-[#E8E2D5] hover:border-[#DCA51B]/50'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* 4. Scholarly Editorial Credentials Banner */}
          <div className="bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-7 shadow-sm max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D5] text-center">
              {editorialCredentials.map((cred, idx) => {
                const Icon = cred.icon;
                return (
                  <div key={idx} className={`${idx !== 0 ? 'pt-4 md:pt-0 md:pl-4' : 'pt-2 md:pt-0'}`}>
                    <div className="flex items-center justify-center gap-2 mb-1.5">
                      <Icon className="w-4 h-4 text-[#DCA51B] shrink-0" />
                      <p className="font-serif text-sm sm:text-base font-bold text-zinc-900">
                        {cred.title}
                      </p>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-sans">
                      {cred.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
