import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Bot, RefreshCw, Sparkles, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { formatMarkdownToHtml } from '../../lib/markdown';

import { useLenis } from '../ui/SmoothScroll';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: any) => void;
}

const GENERATION_PHASES = [
  { label: 'Initializing prompt & clinic brand voice...', minPct: 8 },
  { label: 'Connecting to Google Gemini AI engine...', minPct: 24 },
  { label: 'Structuring clinical outline & headings...', minPct: 45 },
  { label: 'Drafting high-authority dental care copy...', minPct: 65 },
  { label: 'Generating cinematic dental photography...', minPct: 82 },
  { label: 'Formatting headings, bold terms & layout...', minPct: 94 },
  { label: 'Article & image ready!', minPct: 100 },
];

export const AIGenerationModal: React.FC<AIGenerationModalProps> = ({ isOpen, onClose, onTransfer }) => {
  const { lenis } = useLenis();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  // Real-time progress bar state
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [keywordInput, setKeywordInput] = useState('');
  const [keywordsList, setKeywordsList] = useState<string[]>([]);

  const [includeImage, setIncludeImage] = useState(true);
  const [imageStyle, setImageStyle] = useState('Commercial Photography');
  const [imageAspectRatio, setImageAspectRatio] = useState('16:9');
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  const [formData, setFormData] = useState({
    topic: '',
    platform: 'website',
    language: 'English',
    tone: 'professional',
    length: '1000',
    businessProfile: 'Kush Dental Clinic',
  });

  // Stop background scroll and pause Lenis smooth scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scrolling via native overflow lock
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Stop Lenis smooth scroll engine from capturing mouse wheel and scrolling background
    if (lenis) {
      lenis.stop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
      if (lenis) {
        lenis.start();
      }
    };
  }, [isOpen, lenis, loading, onClose]);

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
        includeImage: includeImage,
        imageStyle: imageStyle,
        imageAspectRatio: imageAspectRatio,
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
        setGeneratedContent(res.content);
        let finalImage = res.image || null;

        // If user asked to generate an image and none was returned, generate it using the article title
        if (includeImage && (!finalImage || !finalImage.url)) {
          try {
            const articleTitle = (res.content.title || formData.topic).replace(/[:;]/g, ' - ').trim();
            const prompt = `Professional clinical dental photography of ${articleTitle}, modern luxury dental clinic operatory, sterile precision equipment, warm ambient lighting, 8k resolution`;
            const imgRes: any = await apiClient('/api/v1/dxgen/images/generate', {
              method: 'POST',
              data: {
                prompt,
                style: imageStyle,
                aspectRatio: imageAspectRatio,
                model: 'flux-schnell',
              },
            });
            if (imgRes?.image?.url) {
              finalImage = imgRes.image;
            }
          } catch (imgErr) {
            console.warn('Accompanying image generation fallback failed:', imgErr);
          }
        }

        setGeneratedImage(finalImage);
        setProgress(100);
        setPhaseIndex(GENERATION_PHASES.length - 1);
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
        body: formatMarkdownToHtml(generatedContent.body || ''),
        image: generatedImage,
        imageUrl: generatedImage?.url,
      });
      onClose();
    }
  };

  const modalElement = (
    <div 
      data-lenis-prevent
      className="portal-dark fixed inset-0 z-[9999] overflow-hidden bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div 
        data-lenis-prevent
        className="relative w-full max-w-2xl bg-[#13151A] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] my-auto border border-[#22252E] text-zinc-100 overflow-hidden overscroll-contain"
      >
        {/* Modal Header */}
        <div className="shrink-0 flex items-center justify-between p-5 sm:p-6 border-b border-[#22252E] bg-[#16181E]">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-[#DCA51B]/15 border border-[#DCA51B]/40 text-[#F5C242] rounded-2xl shadow-sm">
              <Bot size={22} className="text-[#DCA51B]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Article &amp; Content Generator</h2>
              <p className="text-xs text-zinc-400">Fill out the parameters to generate AI content.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={loading}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div 
          data-lenis-prevent
          className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar overscroll-contain space-y-4"
        >
          {loading ? (
            /* Real-Time Generation Progress Bar View */
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-[#DCA51B]/15 border border-[#DCA51B]/50 flex items-center justify-center text-[#F5C242] shadow-[0_8px_24px_rgba(220,165,27,0.22)]">
                  <Sparkles size={30} className="animate-pulse text-[#DCA51B]" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#181A22] rounded-full border border-[#DCA51B] flex items-center justify-center text-[#F5C242] shadow-xs">
                  <RefreshCw size={12} className="animate-spin text-[#DCA51B]" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#DCA51B]/20 text-[#F5C242] border border-[#DCA51B]/40">
                  AI Generation In Progress
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Drafting Article for &ldquo;{formData.topic}&rdquo;
                </h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Powered by Google Gemini. Formatting semantic headings, bold key terms, and bullet lists.
                </p>
              </div>

              {/* Progress Bar Card */}
              <div className="w-full max-w-md bg-[#16181E] p-5 rounded-2xl border border-[#22252E] space-y-3.5 text-left shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-zinc-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#DCA51B] animate-ping" />
                    {GENERATION_PHASES[phaseIndex]?.label || 'Generating article...'}
                  </span>
                  <span className="text-[#F5C242] font-mono text-sm">{progress}%</span>
                </div>

                {/* The Progress Track */}
                <div className="w-full h-3 bg-[#181A22] rounded-full overflow-hidden p-0.5 border border-[#2A2E3B]">
                  <div
                    className="h-full bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] rounded-full transition-all duration-300 ease-out shadow-sm"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium pt-1 border-t border-[#22252E]">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-[#DCA51B]" />
                    Elapsed: <span className="font-mono text-zinc-200 font-bold">{elapsedSeconds}s</span>
                  </span>
                  <span>Phase {phaseIndex + 1} of {GENERATION_PHASES.length}</span>
                </div>
              </div>
            </div>
          ) : !generatedContent ? (
            /* Input Form Matching Image 2 */
            <form id="ai-generate-form" onSubmit={handleGenerate} className="space-y-4">
              {error && (
                <div className="bg-rose-950/40 text-rose-300 p-4 rounded-xl text-sm border border-rose-500/30">
                  {error}
                </div>
              )}
              
              {/* TOPIC OR HEADLINE */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 tracking-wide mb-1.5 uppercase">
                  Topic or Headline <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="topic"
                  required
                  rows={2}
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. The Ultimate Guide to Tooth Health: Daily Habits for a Radiant Smile"
                  className="w-full px-4 py-2.5 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/25 rounded-2xl text-zinc-100 placeholder-zinc-500 text-sm outline-none resize-none transition-all font-medium"
                />
              </div>

              {/* PLATFORM & LANGUAGE (2-Column Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 tracking-wide mb-1.5 uppercase">
                    Platform
                  </label>
                  <div className="relative">
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/25 rounded-2xl text-zinc-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                    >
                      <option value="website">Website / Blog</option>
                      <option value="instagram">Instagram</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">X / Twitter</option>
                      <option value="facebook">Facebook</option>
                      <option value="google_business">Google Business</option>
                      <option value="email">Email</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 tracking-wide mb-1.5 uppercase">
                    Language
                  </label>
                  <div className="relative">
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/25 rounded-2xl text-zinc-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* TONE & LENGTH (2-Column Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 tracking-wide mb-1.5 uppercase">
                    Tone
                  </label>
                  <div className="relative">
                    <select
                      name="tone"
                      value={formData.tone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/25 rounded-2xl text-zinc-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
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
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 tracking-wide mb-1.5 uppercase">
                    Length
                  </label>
                  <div className="relative">
                    <select
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/25 rounded-2xl text-zinc-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                    >
                      <option value="1000">Medium (800–1200w)</option>
                      <option value="500">Short (300–500w)</option>
                      <option value="1800">Long (1500–2000w)</option>
                      <option value="2500">Comprehensive (2500w+)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* KEYWORDS (TYPE AND PRESS ENTER) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 tracking-wide mb-1.5 uppercase">
                  Keywords (Type and press Enter)
                </label>
                <div className="min-h-[44px] p-2 bg-[#181A22] border border-[#2A2E3B] focus-within:border-[#DCA51B] focus-within:ring-2 focus-within:ring-[#DCA51B]/25 rounded-2xl flex flex-wrap items-center gap-1.5 transition-all">
                  {keywordsList.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center px-2.5 py-0.5 bg-[#DCA51B]/20 border border-[#DCA51B]/40 text-[#F5C242] text-xs font-semibold rounded-lg"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword(kw)}
                        className="ml-1 text-[#F5C242] hover:text-white cursor-pointer"
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
                    className="flex-1 min-w-[120px] bg-transparent text-zinc-100 text-sm outline-none placeholder-zinc-500 px-1 font-medium"
                  />
                </div>
              </div>

              {/* ATTACHED BUSINESS PROFILE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-zinc-300 tracking-wide uppercase">
                    Attached Business Profile
                  </label>
                  <span className="text-xs text-zinc-400 font-normal">Auto-injects brand voice &amp; USPs</span>
                </div>
                <div className="relative">
                  <select
                    name="businessProfile"
                    value={formData.businessProfile}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/25 rounded-2xl text-zinc-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                  >
                    <option value="Kush Dental Clinic">Kush Dental Clinic</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* AI COVER IMAGE OPTION */}
              <div className="p-4 bg-[#16181E] border border-[#22252E] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#DCA51B]" />
                    <span className="text-xs font-bold text-zinc-200 tracking-wide uppercase">
                      Generate AI Cover Image (FLUX)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeImage}
                      onChange={(e) => setIncludeImage(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-700 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#DCA51B]"></div>
                  </label>
                </div>

                {includeImage && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-[#22252E]">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 tracking-wide mb-1 uppercase">
                        Image Style
                      </label>
                      <div className="relative">
                        <select
                          value={imageStyle}
                          onChange={(e) => setImageStyle(e.target.value)}
                          className="w-full px-3 py-2 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-xl text-zinc-100 text-xs outline-none appearance-none cursor-pointer pr-8 font-medium"
                        >
                          <option value="Commercial Photography">Commercial Photography</option>
                          <option value="Realistic">Realistic Dental Care</option>
                          <option value="Minimal">Minimalist Luxury</option>
                          <option value="Studio Lighting">Studio Lighting</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-300 tracking-wide mb-1 uppercase">
                        Aspect Ratio
                      </label>
                      <div className="relative">
                        <select
                          value={imageAspectRatio}
                          onChange={(e) => setImageAspectRatio(e.target.value)}
                          className="w-full px-3 py-2 bg-[#181A22] border border-[#2A2E3B] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-xl text-zinc-100 text-xs outline-none appearance-none cursor-pointer pr-8 font-medium"
                        >
                          <option value="16:9">Landscape (16:9)</option>
                          <option value="1:1">Square (1:1)</option>
                          <option value="4:5">Portrait (4:5)</option>
                          <option value="9:16">Story / Reel (9:16)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          ) : (
            /* Result Preview */
            <div className="space-y-4">
              <div className="bg-emerald-950/40 text-emerald-300 p-4 rounded-2xl text-sm border border-emerald-500/30 mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>Content generated successfully! Review the output below.</span>
              </div>
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Title</span>
                <p className="text-white font-bold mt-1 text-base">{generatedContent.title}</p>
              </div>

              {/* Generated Cover Image Preview */}
              {generatedImage?.url && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Generated AI Cover Image
                    </span>
                    <span className="text-[11px] font-bold text-[#F5C242] bg-[#DCA51B]/20 px-2 py-0.5 rounded-full border border-[#DCA51B]/40 flex items-center gap-1">
                      <Sparkles size={11} className="text-[#DCA51B]" />
                      Auto-transfers to Cover Image URL
                    </span>
                  </div>
                  <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-[#2A2E3B] bg-zinc-950 shadow-sm group">
                    <img
                      src={generatedImage.url}
                      alt="AI Generated Cover"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-medium text-white flex items-center gap-1.5 border border-white/10">
                      <Sparkles size={12} className="text-[#DCA51B]" />
                      <span>FLUX Schnell &bull; {generatedImage.style || 'Commercial Photography'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Fully Scrollable Body Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Article Body Preview
                  </span>
                  <span className="text-[11px] text-[#F5C242] font-medium bg-[#DCA51B]/20 px-2.5 py-0.5 rounded-full border border-[#DCA51B]/40">
                    Scrollable Preview
                  </span>
                </div>
                <div 
                  data-lenis-prevent
                  onWheel={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-[#181A22] p-4 sm:p-5 rounded-2xl border border-[#2A2E3B] text-zinc-200 max-h-72 sm:max-h-80 min-h-[160px] overflow-y-auto custom-scrollbar overscroll-contain shadow-inner select-text"
                >
                  <div 
                    className="article-content text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatMarkdownToHtml(generatedContent.body || '') }}
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Meta Description</span>
                <p className="text-zinc-300 text-sm mt-1">{generatedContent.metaDescription}</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 p-5 sm:p-6 border-t border-[#22252E] flex justify-end space-x-3 bg-[#16181E]">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 border border-[#2A2E3B] rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 bg-[#181A22] hover:bg-[#20232E] hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          
          {!generatedContent ? (
            <button
              type="submit"
              form="ai-generate-form"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DCA51B] to-[#C89211] text-[#0D0E12] shadow-md hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin text-[#0D0E12]" size={15} />
                  <span>Generating ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} className="text-[#0D0E12]" />
                  <span>Generate Content</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleTransfer}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DCA51B] to-[#C89211] text-[#0D0E12] shadow-md hover:brightness-110 transition-all cursor-pointer"
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
