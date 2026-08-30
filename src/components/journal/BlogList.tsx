import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useGsap';
import { blogPosts } from '../../data';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ['View all', 'Cosmetics', 'Implantology', 'Orthodontics', 'Oral Surgery', 'Restorative', 'Technology'];

export const BlogList = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [activeCategory, setActiveCategory] = useState('View all');

  const filteredPosts = activeCategory === 'View all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <section ref={sectionRef} className="max-w-container mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pb-12 md:pb-16">
      <div className="reveal-up mb-12">
        <Link to="/" className="inline-flex items-center gap-2 hover:opacity-70 transition-opacity cursor-hover group">
          <ArrowLeft className="w-5 h-5 text-secondary group-hover:-translate-x-1 transition-transform" />
          <span className="text-tertiary font-medium text-lg">Back to Home</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 reveal-up">
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-tertiary tracking-tight font-medium">Clinical Insights & Journal</h1>
        
        <div className="flex flex-col items-start lg:items-end gap-4 text-left lg:text-right">
          <p className="text-neutral text-base max-w-sm">
            Expert articles, surgical breakthroughs, and aesthetic smile design perspectives by our lead dentists.
          </p>
          <div className="flex w-full sm:w-auto gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 sm:w-64 px-4 py-3 rounded-full border border-border focus:outline-none focus:border-tertiary bg-white text-sm"
            />
            <button className="bg-tertiary text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-tertiary/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-8 border-b border-border mb-12 reveal-up relative">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors relative z-10 ${
              activeCategory === cat ? 'text-tertiary' : 'text-neutral hover:text-tertiary'
            }`}
          >
            {cat}
            {activeCategory === cat && (
              <motion.div 
                layoutId="activeCategory"
                className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-tertiary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {filteredPosts.map((post, i) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group flex flex-col"
          >
            <Link to={`/blog/${post.id}`} className="block relative h-[240px] md:h-[280px] rounded-[16px] overflow-hidden mb-6 cursor-pointer">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/95 via-white/50 to-transparent backdrop-blur-[2px]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end text-tertiary">
                <div>
                  <p className="font-semibold text-sm">{post.author}</p>
                  <p className="text-xs mt-1 font-medium">{post.date}</p>
                </div>
                <span className="text-xs font-semibold tracking-wide">
                  {post.category}
                </span>
              </div>
            </Link>
            
            <Link to={`/blog/${post.id}`} className="block">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-display text-2xl text-tertiary font-bold mb-3 group-hover:text-secondary transition-colors">
                  {post.title}
                </h3>
                <ArrowUpRight className="w-6 h-6 text-tertiary shrink-0 opacity-0 -translate-y-2 translate-x-2 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
              </div>
              <p className="text-neutral text-base line-clamp-2 mb-6">
                {post.excerpt}
              </p>
            </Link>
            <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-tertiary group-hover:text-secondary transition-colors mt-auto w-max cursor-pointer">
              Read post <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
