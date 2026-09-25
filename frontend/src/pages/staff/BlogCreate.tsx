import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { RichTextEditor } from '../../components/journal/RichTextEditor';
import { useAuth } from '../../context/AuthContext';
import { AIGenerationModal } from '../../components/journal/AIGenerationModal';
import { Sparkles } from 'lucide-react';

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
    setFormData((prev) => ({
      ...prev,
      title: contentData.title || prev.title,
      slug: contentData.slug || prev.slug,
      excerpt: contentData.metaDescription || prev.excerpt,
      content: contentData.body || prev.content
    }));
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/staff/blog" className="text-gray-500 hover:text-gray-900">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-[#162723]">Create Blog Post</h1>
        {user?.role === 'DOCTOR' && (
          <button
            onClick={() => setIsAIModalOpen(true)}
            className="ml-auto flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
          >
            <Sparkles size={16} className="mr-2" />
            Generate with AI
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateDraft} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            required
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent"
            placeholder="my-first-post"
          />
          <p className="mt-1 text-sm text-gray-500">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent"
            placeholder="Brief summary of the post"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#162723] focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <RichTextEditor
            content={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2 bg-[#162723] text-white rounded-lg hover:bg-[#1a302b] transition-colors disabled:opacity-50"
          >
            <Save size={20} className="mr-2" />
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
