import { useEffect } from 'react';
import { useLenis } from '../components/ui/SmoothScroll';
import { FinalCTA } from '../components/appointment/FinalCTA';
import { formatMarkdownToHtml } from '../lib/markdown';

interface LegalPageProps {
  title: string;
  markdownContent: string;
}

export const LegalPage = ({ title, markdownContent }: LegalPageProps) => {
  const { scrollTo } = useLenis();

  useEffect(() => {
    scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    document.title = `Kush Dental Clinic - ${title}`;
  }, [title, scrollTo]);

  return (
    <main className="w-full flex-grow pt-28 md:pt-36 bg-[#FAF7F2]">
      <div className="pb-16 sm:pb-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 md:p-16 rounded-3xl shadow-sm border border-[#E8E2D5]">
            <div 
              className="article-content max-w-none prose-zinc"
              dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(markdownContent) }}
            />
          </div>
        </article>
      </div>
      <FinalCTA />
    </main>
  );
};
