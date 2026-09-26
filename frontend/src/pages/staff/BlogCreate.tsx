import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Sparkles, X } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { RichTextEditor } from '../../components/journal/RichTextEditor';
import { useAuth } from '../../context/AuthContext';
import { AIGenerationModal } from '../../components/journal/AIGenerationModal';
import { AIImageModal } from '../../components/journal/AIImageModal';

import { formatMarkdownToHtml } from '../../lib/markdown';

export const BlogCreate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      content: formattedHtml || prev.content,
      coverImage: contentData.imageUrl || contentData.image?.url || prev.coverImage,
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
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Cover Image URL</label>
            {user?.role === 'DOCTOR' && (
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#8C6B14] bg-[#FAF3E0] hover:bg-[#F5EACB] border border-[#DCA51B]/40 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Sparkles size={13} className="text-[#DCA51B]" />
                Generate with AI
              </button>
            )}
          </div>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
            placeholder="https://example.com/image.jpg"
          />
          {formData.coverImage && (
            <div className="mt-3 relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-[#E2DACB] bg-zinc-900 group shadow-sm">
              <img
                src={formData.coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, coverImage: '' }))}
                className="absolute top-2.5 right-2.5 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg transition-colors shadow-md"
                title="Remove image"
              >
                <X size={14} />
              </button>
              <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#DCA51B]" />
                <span>Cover Image</span>
              </div>
            </div>
          )}
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

      <AIImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        initialPrompt={
          formData.title.trim()
            ? `Professional clinical dental photography of ${formData.title.replace(/[:;]/g, ' - ').trim()}, modern luxury dental clinic operatory, sterile precision equipment, warm ambient lighting, 8k resolution, photorealistic`
            : formData.excerpt.trim()
            ? `Professional clinical dental photography of ${formData.excerpt.replace(/[:;]/g, ' - ').trim()}, modern luxury dental clinic operatory, sterile precision equipment, 8k resolution`
            : 'Aesthetic clinical dentistry and radiant smile'
        }
        onSelectImage={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
      />
    </div>
  );
};
