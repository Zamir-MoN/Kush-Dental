import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, CheckCircle, XCircle, Sparkles, X } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { RichTextEditor } from '../../components/journal/RichTextEditor';
import { useAuth } from '../../context/AuthContext';
import { AIGenerationModal } from '../../components/journal/AIGenerationModal';
import { AIImageModal } from '../../components/journal/AIImageModal';
import { formatMarkdownToHtml } from '../../lib/markdown';

export const BlogEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    content: ''
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await apiClient<any>(`/api/v1/blog/${id}`, { method: 'GET' });
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          coverImage: data.coverImage || '',
          content: formatMarkdownToHtml(data.content || '')
        });
        setStatus(data.status);
      } catch (err: any) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await apiClient(`/api/v1/blog/${id}`, { method: 'PATCH', data: formData });
      navigate('/staff/blog');
    } catch (err: any) {
      setError(err.details?.detail || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      setSaving(true);
      if (status === 'DRAFT') {
        await apiClient(`/api/v1/blog/${id}/publish`, { method: 'POST' });
        setStatus('PUBLISHED');
      } else {
        await apiClient(`/api/v1/blog/${id}/unpublish`, { method: 'POST' });
        setStatus('DRAFT');
      }
    } catch (err: any) {
      setError(err.details?.detail || 'Failed to change publish status');
    } finally {
      setSaving(false);
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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading editor...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link to="/staff/blog" className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-[#FAF7F2] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Edit Blog Post</h1>
            <p className="text-sm text-zinc-500">Update content and publication status</p>
          </div>
          <span className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${
            status === 'PUBLISHED' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-[#FAF3E0] text-[#8C6B14] border-[#DCA51B]/40'
          }`}>
            {status}
          </span>
          {user?.role === 'DOCTOR' && (
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/40 hover:bg-[#F5EACB] transition-all shadow-sm"
            >
              <Sparkles size={14} className="text-[#DCA51B]" />
              AI Draft
            </button>
          )}
        </div>
        
        <button
          onClick={handlePublishToggle}
          disabled={saving}
          className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 ${
            status === 'DRAFT' 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-zinc-100 text-zinc-700 border border-zinc-200 hover:bg-zinc-200'
          }`}
        >
          {status === 'DRAFT' ? (
            <><CheckCircle size={16} className="mr-2" /> Publish Now</>
          ) : (
            <><XCircle size={16} className="mr-2" /> Revert to Draft</>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-[#E8E2D5] p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
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
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
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
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
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
        initialPrompt={formData.title.trim() || formData.excerpt.trim() || 'Aesthetic clinical dentistry and radiant smile'}
        onSelectImage={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
      />
    </div>
  );
};
