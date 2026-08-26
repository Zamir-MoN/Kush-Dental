import { useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BlogList } from '../components/journal/BlogList';

export const Blog = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <Header />
      
      <main className="pt-24 md:pt-32 pb-16">
        <BlogList />
      </main>

      <Footer />
    </div>
  );
};
