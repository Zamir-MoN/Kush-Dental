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

  const [keywordInput, setKeywordInput] = useState('');
  const [keywordsList, setKeywordsList] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    topic: '',
    platform: 'website',
    language: 'English',
    tone: 'professional',
    length: '1000',
    businessProfile: 'Kush Dental Clinic',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = keywordInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !keywordsList.includes(trimmed)) {
        setKeywordsList([...keywordsList, trimmed]);
      }
      setKeywordInput('');
    }
  };

  const removeKeyword = (kwToRemove: string) => {
    setKeywordsList(keywordsList.filter((k) => k !== kwToRemove));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      setError('Please provide a Topic or Headline.');
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const finalKeywords = [...keywordsList];
      if (keywordInput.trim()) {
        const extra = keywordInput.split(',').map((k) => k.trim()).filter(Boolean);
        extra.forEach((k) => {
          if (!finalKeywords.includes(k)) finalKeywords.push(k);
        });
      }

      const payload: any = {
        topic: formData.topic.trim(),
        platform: formData.platform || 'website',
        language: formData.language || 'English',
        tone: formData.tone || 'professional',
        length: Number(formData.length) || 1000,
      };

      if (finalKeywords.length > 0) {
        payload.keywords = finalKeywords;
      }

      if (formData.businessProfile && formData.businessProfile !== 'None') {
        payload.customInstructions = `Brand: ${formData.businessProfile}.`;
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
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] my-auto border border-[#E8E2D5] overflow-hidden">
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 border-b border-[#E8E2D5] bg-[#FAF7F2]/70">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-gradient-to-br from-[#FAF3E0] to-[#F5E8C7] border border-[#DCA51B]/40 text-[#8C6B14] rounded-2xl shadow-sm">
              <Bot size={22} className="text-[#DCA51B]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">Article &amp; Content Generator</h2>
              <p className="text-xs text-zinc-500">Fill out the parameters to generate AI content.</p>
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
            /* Input Form Matching Image 2 */
            <form id="ai-generate-form" onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200">
                  {error}
                </div>
              )}
              
              {/* TOPIC OR HEADLINE */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                  Topic or Headline <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="topic"
                  required
                  rows={2}
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. The Ultimate Guide to Tooth Health: Daily Habits for a Radiant Smile"
                  className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 placeholder-zinc-400 text-sm outline-none resize-none transition-all font-medium"
                />
              </div>

              {/* PLATFORM & LANGUAGE (2-Column Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                    Platform
                  </label>
                  <div className="relative">
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                    >
                      <option value="website">Website / Blog</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">X / Twitter</option>
                      <option value="facebook">Facebook</option>
                      <option value="google_business">Google Business</option>
                      <option value="email">Email</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* TONE & LENGTH (2-Column Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                    Tone
                  </label>
                  <div className="relative">
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="friendly">Friendly</option>
                      <option value="conversational">Conversational</option>
                      <option value="educational">Educational</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="promotional">Promotional</option>
                      <option value="luxury">Luxury</option>
                      <option value="technical">Technical</option>
                      <option value="empathetic">Empathetic</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                    Length
                  </label>
                  <div className="relative">
                    <select
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                    >
                      <option value="1000">Medium (800–1200w)</option>
                      <option value="500">Short (300–500w)</option>
                      <option value="1800">Long (1500–2000w)</option>
                      <option value="2500">Comprehensive (2500w+)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* KEYWORDS (TYPE AND PRESS ENTER) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                  Keywords (Type and press Enter)
                </label>
                <div className="min-h-[44px] p-2 bg-[#FAF7F2] border border-[#E2DACB] focus-within:border-[#DCA51B] focus-within:ring-1 focus-within:ring-[#DCA51B] rounded-2xl flex flex-wrap items-center gap-1.5 transition-all">
                  {keywordsList.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center px-2.5 py-0.5 bg-[#FAF3E0] border border-[#DCA51B]/40 text-[#8C6B14] text-xs font-semibold rounded-lg"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(kw)}
                        className="ml-1 text-[#8C6B14] hover:text-zinc-900 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder={keywordsList.length === 0 ? 'Add keywords...' : ''}
                    className="flex-1 min-w-[120px] bg-transparent text-zinc-900 text-sm outline-none placeholder-zinc-400 px-1 font-medium"
                  />
                </div>
              </div>

              {/* ATTACHED BUSINESS PROFILE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-700 tracking-wide uppercase">
                    Attached Business Profile
                  </label>
                  <span className="text-xs text-zinc-500 font-normal">Auto-injects brand voice &amp; USPs</span>
                </div>
                <div className="relative">
                  <select
                    name="businessProfile"
                    value={formData.businessProfile}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                  >
                    <option value="Kush Dental Clinic">Kush Dental Clinic</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
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
                  <span>Generate Content</span>
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
