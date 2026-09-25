import React, { useState } from 'react';
import { X, Bot, RefreshCw } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

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
      onTransfer(generatedContent);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#162723]/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Bot size={24} />
            </div>
            <h2 className="text-xl font-bold text-[#162723]">AI Blog Generator</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!generatedContent ? (
            <form id="ai-generate-form" onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic *</label>
                <input
                  type="text"
                  name="topic"
                  required
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="E.g. The importance of flossing"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Default</option>
                    <option value="professional">Professional</option>
                    <option value="educational">Educational</option>
                    <option value="friendly">Friendly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length (words)</label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. 500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="dental care, flossing, hygiene (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="E.g. Parents"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm border border-green-200 mb-4">
                Content generated successfully! Review the output below.
              </div>
              
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Title</span>
                <p className="text-gray-900 font-medium">{generatedContent.title}</p>
              </div>
              
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Body Preview</span>
                <div className="mt-1 bg-gray-50 p-4 rounded border border-gray-200 text-gray-800 text-sm h-32 overflow-hidden relative">
                  {generatedContent.body}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">Meta Description</span>
                <p className="text-gray-700 text-sm">{generatedContent.metaDescription}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          
          {!generatedContent ? (
            <button
              type="submit"
              form="ai-generate-form"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <><RefreshCw className="animate-spin mr-2" size={20} /> Generating...</>
              ) : (
                'Generate'
              )}
            </button>
          ) : (
            <button
              onClick={handleTransfer}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Transfer to Editor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
