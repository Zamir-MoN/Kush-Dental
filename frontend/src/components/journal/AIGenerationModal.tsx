import React, { useState } from 'react';
import { X, Bot, RefreshCw } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { formatMarkdownToHtml } from '../../lib/markdown';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: any) => void;
}

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({ isOpen, onClose, onTransfer }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const [formData, setFormData] = useState({
    topic: '',
    tone: '',
    length: '',
    keywords: '',
    audience: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const payload: any = { ...formData };
      Object.keys(payload).forEach(key => {
        if (!payload[key]) delete payload[key];
      });

      if (payload.keywords) {
        payload.keywords = payload.keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
      }
      if (payload.length && !isNaN(Number(payload.length))) {
        payload.length = Number(payload.length);
      }

      const res: any = await apiClient('/api/v1/blog/generate', {
        method: 'POST',
        data: payload,
      });

      if (res.content) {
        setGeneratedContent(res.content);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = () => {
    if (generatedContent) {
      onTransfer({
        ...generatedContent,
        body: formatMarkdownToHtml(generatedContent.body || '')
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#E8E2D5]">
        <div className="flex items-center justify-between p-6 border-b border-[#E8E2D5]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#FAF3E0] border border-[#DCA51B]/30 text-[#8C6B14] rounded-xl">
              <Bot size={22} className="text-[#DCA51B]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">AI Article Generator</h2>
              <p className="text-xs text-zinc-500">Draft rich dental clinic content with Google Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-[#FAF7F2] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!generatedContent ? (
            <form id="ai-generate-form" onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Topic *</label>
                <input
                  type="text"
                  name="topic"
                  required
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
                  placeholder="E.g. The importance of flossing"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Tone</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all cursor-pointer"
                  >
                    <option value="">Default</option>
                    <option value="professional">Professional</option>
                    <option value="educational">Educational</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Length (words)</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
                  placeholder="dental care, flossing, hygiene (comma separated)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Audience</label>
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all"
                  placeholder="E.g. Parents"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-4">
                Content generated successfully! Review the output below.
              </div>
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Title</span>
                <p className="text-zinc-900 font-bold mt-1 text-base">{generatedContent.title}</p>
              </div>
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Body Preview</span>
                <div className="mt-1 bg-[#FAF7F2] p-4 rounded-xl border border-[#E2DACB] text-zinc-800 text-sm h-36 overflow-hidden relative">
                  <div 
                    className="prose prose-sm max-w-none text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(generatedContent.body || '') }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none" />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Meta Description</span>
                <p className="text-zinc-600 text-sm mt-1">{generatedContent.metaDescription}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#E8E2D5] flex justify-end space-x-3 bg-[#FAF7F2]/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E2DACB] rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white hover:bg-[#FAF7F2] transition-colors"
          >
            Cancel
          </button>
          
          {!generatedContent ? (
            <button
              type="submit"
              form="ai-generate-form"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <><RefreshCw className="animate-spin text-[#141518]" size={16} /> Generating...</>
              ) : (
                'Generate'
              )}
            </button>
          ) : (
            <button
              onClick={handleTransfer}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] shadow-md hover:shadow-lg transition-all"
            >
              Transfer to Editor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
