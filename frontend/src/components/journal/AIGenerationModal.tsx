import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bot, RefreshCw, Sparkles, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { formatMarkdownToHtml } from '../../lib/markdown';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: any) => void;
}

const GENERATION_PHASES = [
  { label: 'Initializing prompt & clinic brand voice...', minPct: 8 },
  { label: 'Connecting to Google Gemini AI engine...', minPct: 24 },
  { label: 'Structuring clinical outline & headings...', minPct: 48 },
  { label: 'Drafting high-authority dental care copy...', minPct: 68 },
  { label: 'Formatting headings, bold terms & bullet points...', minPct: 85 },
  { label: 'Finalizing response & verifying layout...', minPct: 96 },
  { label: 'Article drafted successfully!', minPct: 100 },
];

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({ isOpen, onClose, onTransfer }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Real-time progress bar state
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [formData, setFormData] = useState({
    topic: '',
    tone: '',
    length: '1000',
    keywords: '',
    audience: '',
  });

  // Simulated smooth generation progress with realistic phases and timer
  useEffect(() => {
    let timer: any;
    let secondsTimer: any;

    if (loading) {
      setProgress(8);
      setPhaseIndex(0);
      setElapsedSeconds(0);

      secondsTimer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 94) return 94;
          const next = prev + Math.floor(Math.random() * 4) + 1;
          const matchedPhase = GENERATION_PHASES.reduce((acc, p, idx) => {
            if (next >= p.minPct) return idx;
            return acc;
          }, 0);
          setPhaseIndex(matchedPhase);
          return next;
        });
      }, 350);
    } else {
      if (progress > 0) {
        setProgress(100);
        setPhaseIndex(GENERATION_PHASES.length - 1);
      }
    }

    return () => {
      clearInterval(timer);
      clearInterval(secondsTimer);
    };
  }, [loading]);

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
        setProgress(100);
        setPhaseIndex(GENERATION_PHASES.length - 1);
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

  const modalElement = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[88vh] my-auto border border-[#E8E2D5] overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 border-b border-[#E8E2D5] bg-[#FAF7F2]/70">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-gradient-to-br from-[#FAF3E0] to-[#F5E8C7] border border-[#DCA51B]/40 text-[#8C6B14] rounded-2xl shadow-sm">
              <Bot size={22} className="text-[#DCA51B]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">AI Article Generator</h2>
              <p className="text-xs text-zinc-500">Draft rich dental clinic content with Google Gemini</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-[#FAF7F2] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar space-y-4">
          {loading ? (
            /* Real-Time Generation Progress Bar View */
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FAF3E0] to-[#F5E8C7] border border-[#DCA51B]/50 flex items-center justify-center text-[#8C6B14] shadow-[0_8px_24px_rgba(220,165,27,0.22)]">
                  <Sparkles size={30} className="animate-pulse text-[#DCA51B]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-[#DCA51B] flex items-center justify-center text-[#8C6B14] shadow-xs">
                  <RefreshCw size={12} className="animate-spin text-[#DCA51B]" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/40">
                  AI Generation In Progress
                </span>
                <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                  Drafting Article for &ldquo;{formData.topic}&rdquo;
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Powered by Google Gemini. Formatting semantic headings, bold key terms, and bullet lists.
                </p>
              </div>

              {/* Progress Bar Card */}
              <div className="w-full max-w-md bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E2D5] space-y-3.5 text-left shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DCA51B] animate-ping" />
                    {GENERATION_PHASES[phaseIndex]?.label || 'Generating article...'}
                  </span>
                  <span className="text-[#8C6B14] font-mono text-sm">{progress}%</span>
                </div>

                {/* The Progress Track */}
                <div className="w-full h-3 bg-zinc-200/80 rounded-full overflow-hidden p-0.5 border border-zinc-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] rounded-full transition-all duration-300 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium pt-1 border-t border-[#E8E2D5]/70">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-[#DCA51B]" />
                    Elapsed: <span className="font-mono text-zinc-700 font-bold">{elapsedSeconds}s</span>
                  </span>
                  <span>Phase {phaseIndex + 1} of {GENERATION_PHASES.length}</span>
                </div>
              </div>
            </div>
          ) : !generatedContent ? (
            /* Input Form */
            <form id="ai-generate-form" onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Topic or Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="topic"
                  required
                  value={formData.topic}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all outline-none font-medium placeholder:text-zinc-400"
                  placeholder="E.g. Daily Habits for a Radiant Smile"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Proper Tone Dropdown Menu */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Tone & Voice
                  </label>
                  <div className="relative">
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all cursor-pointer appearance-none pr-10 font-medium outline-none"
                    >
                      <option value="">Default (Balanced)</option>
                      <option value="professional">Professional (Clinical & Authoritative)</option>
                      <option value="educational">Educational (Patient-Friendly Guide)</option>
                      <option value="friendly">Warm & Empathetic (Reassuring)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#8C6B14]">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                {/* Proper Length Dropdown Menu */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                    Length
                  </label>
                  <div className="relative">
                    <select
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all cursor-pointer appearance-none pr-10 font-medium outline-none"
                    >
                      <option value="1000">Medium (800–1200w)</option>
                      <option value="500">Short (300–500w)</option>
                      <option value="1800">Long (1500–2000w)</option>
                      <option value="2500">Comprehensive (2500w+)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#8C6B14]">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Target Keywords (Optional)
                </label>
                <input
                  type="text"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all outline-none font-medium placeholder:text-zinc-400"
                  placeholder="dental hygiene, flossing, enamel (comma separated)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
                  Target Audience (Optional)
                </label>
                <input
                  type="text"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-sm text-zinc-900 focus:ring-2 focus:ring-[#DCA51B]/30 focus:border-[#DCA51B] transition-all outline-none font-medium placeholder:text-zinc-400"
                  placeholder="E.g. Patients seeking preventive care, parents, teenagers"
                />
              </div>
            </form>
          ) : (
            /* Result Preview */
            <div className="space-y-4">
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-2xl text-sm border border-emerald-200 mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>Content generated successfully! Review the output below.</span>
              </div>
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Title</span>
                <p className="text-zinc-900 font-bold mt-1 text-base">{generatedContent.title}</p>
              </div>
              
              {/* Fully Scrollable Body Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Article Body Preview
                  </span>
                  <span className="text-[11px] text-[#8C6B14] font-medium bg-[#FAF3E0] px-2.5 py-0.5 rounded-full border border-[#DCA51B]/30">
                    Scrollable Preview
                  </span>
                </div>
                <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#E2DACB] max-h-72 min-h-[160px] overflow-y-auto custom-scrollbar shadow-inner">
                  <div 
                    className="article-content text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(generatedContent.body || '') }}
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Meta Description</span>
                <p className="text-zinc-600 text-sm mt-1">{generatedContent.metaDescription}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 p-5 sm:p-6 border-t border-[#E8E2D5] flex justify-end space-x-3 bg-[#FAF7F2]/50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 border border-[#E2DACB] rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white hover:bg-[#FAF7F2] transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          
          {!generatedContent ? (
            <button
              type="submit"
              form="ai-generate-form"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] shadow-md hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin text-[#141518]" size={15} />
                  <span>Generating ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} className="text-[#141518]" />
                  <span>Generate Article</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleTransfer}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              Transfer to Editor
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalElement, document.body) : modalElement;
};
