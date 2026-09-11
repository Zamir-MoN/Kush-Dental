import { useState, useMemo } from 'react';
import { BlogHero } from '../components/journal/BlogHero';
import { BlogList } from '../components/journal/BlogList';
import { blogPosts } from '../data';

export const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Compute matched total articles for hero feedback
  const totalArticles = useMemo(() => {
    if (!searchQuery) return blogPosts.length;
    const q = searchQuery.toLowerCase().trim();
    return blogPosts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
    ).length;
  }, [searchQuery]);

  return (
    <main className="w-full flex-grow">
      {/* Luxury Obsidian Hero Section */}
      <BlogHero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        totalArticles={totalArticles}
      />

      {/* Dynamic Journal Listing with Filters, Spotlight, Newsletter & Standards */}
      <BlogList 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
    </main>
  );
};
