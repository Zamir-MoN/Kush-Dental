import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { RichTextEditor } from '../../components/journal/RichTextEditor';
import { useAuth } from '../../context/AuthContext';
import { AIGenerationModal } from '../../components/journal/AIGenerationModal';
import { Sparkles } from 'lucide-react';

import { formatMarkdownToHtml } from '../../lib/markdown';

export const BlogCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    content: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await apiClient('/api/v1/blog', { method: 'POST', data: formData });
      navigate('/staff/blog');
    } catch (err: any) {
      setError(err.details?.detail || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = (contentData: any) => {
    if (formData.title || formData.content) {
      if (!window.confirm('Replace current draft with AI-generated content?')) {
        return;
      }
    }
    const formattedHtml = formatMarkdownToHtml(contentData.body || '');
    setFormData((prev) => ({
      ...prev,
      title: contentData.title || prev.title,
      slug: contentData.slug || prev.slug,
      excerpt: contentData.metaDescription || prev.excerpt,
      content: formattedHtml || prev.content
    }));
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/staff/blog" className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-[#FAF7F2] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Create Blog Post</h1>
          <p className="text-sm text-zinc-500">Draft clinical insights and patient education articles</p>
        </div>
        {user?.role === 'DOCTOR' && (
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/40 hover:bg-[#F5EACB] transition-all shadow-sm"
          >
            <Sparkles size={15} className="text-[#DCA51B]" />
            Generate with AI
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateDraft} className="bg-white rounded-2xl shadow-sm border border-[#E8E2D5] p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
            placeholder="my-first-post"
          />
          <p className="mt-1 text-xs text-zinc-400">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
            placeholder="Brief summary of the post"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Cover Image URL</label>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Content</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E8E2D5]">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </form>

      <AIGenerationModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onTransfer={handleAIGenerate}
      />
    </div>
  );
};
