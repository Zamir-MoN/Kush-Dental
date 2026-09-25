import { useState, useMemo, useEffect } from 'react';
import { BlogHero } from '../components/journal/BlogHero';
import { BlogList } from '../components/journal/BlogList';
import { apiClient } from '../lib/apiClient';

export const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await apiClient<any[]>('/api/v1/public/blog', { method: 'GET' });
        setBlogPosts(data);
      } catch (err) {
        console.error('Failed to load blog posts', err);
      }
    };
    fetchPosts();
  }, []);

  // Compute matched total articles for hero feedback
  const totalArticles = useMemo(() => {
    if (!searchQuery) return blogPosts.length;
    const q = searchQuery.toLowerCase().trim();
    return blogPosts.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        (p.excerpt && p.excerpt.toLowerCase().includes(q))
    ).length;
  }, [searchQuery, blogPosts]);

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
        blogPosts={blogPosts}
      />
    </main>
  );
};
