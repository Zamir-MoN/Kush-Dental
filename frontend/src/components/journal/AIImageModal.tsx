import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, RefreshCw, Check, Image as ImageIcon, ChevronDown, Wand2, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';
import { useLenis } from '../ui/SmoothScroll';

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  initialPrompt?: string;
}

const STYLE_OPTIONS = [
  { id: 'Commercial Photography', label: 'Commercial Photography', desc: 'Crisp editorial commercial dental photography' },
  { id: 'Realistic', label: 'Realistic Clinical Care', desc: 'Authentic clinical dental care and hygiene' },
  { id: 'Minimal', label: 'Minimalist Luxury', desc: 'High-end aesthetic with clean white backgrounds' },
  { id: 'Studio Lighting', label: 'Studio Lighting', desc: 'Dramatic studio softbox lighting and depth' },
  { id: 'Macro Dental Detail', label: 'Macro Dental Detail', desc: 'Extreme close-up precision of tooth structure' },
];

const ASPECT_RATIOS = [
  { id: '16:9', label: '16:9 (Landscape)', desc: 'Best for Blog Covers' },
  { id: '1:1', label: '1:1 (Square)', desc: 'Social & Cards' },
  { id: '4:5', label: '4:5 (Portrait)', desc: 'Mobile Feeds' },
  { id: '9:16', label: '9:16 (Vertical)', desc: 'Story & Reels' },
];

const PROMPT_SUGGESTIONS = [
  'Aesthetic porcelain veneers with natural translucency and radiant smile',
  'Modern luxury dental clinic operatory with warm ambient clinical lighting',
  'Dentist examining a gleaming white tooth model with precision instruments',
  'Healthy polished teeth close-up demonstrating oral hygiene excellence',
];

export const AIImageModal: React.FC<AIImageModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  initialPrompt = '',
}) => {
  const { lenis } = useLenis();
  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState('Commercial Photography');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [model, setModel] = useState('flux-schnell');
  const [negativePrompt, setNegativePrompt] = useState('blurry, cartoon, 3d render, deformed teeth, watermark, text, low resolution');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [loading, setLoading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  // Sync initialPrompt when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialPrompt && !prompt) {
        setPrompt(initialPrompt);
      }
      setError(null);
    }
  }, [isOpen, initialPrompt]);

  // Lock body scroll and stop Lenis smooth scroll
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const originalPaddingRight = document.body.style.paddingRight;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

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

  // Elapsed seconds timer during generation
  useEffect(() => {
    let interval: any;
    if (loading) {
      setElapsedSeconds(0);
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a description for the image.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        prompt: prompt.trim(),
        style,
        aspectRatio,
        model,
        negativePrompt: negativePrompt.trim() || undefined,
      };

      const res: any = await apiClient('/api/v1/dxgen/images/generate', {
        method: 'POST',
        data: payload,
      });

      if (res?.image?.url) {
        setGeneratedImage(res.image);
      } else {
        throw new Error('Image generation succeeded but no image URL was returned.');
      }
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedImage?.url) {
      onSelectImage(generatedImage.url);
      onClose();
    }
  };

  const modalContent = (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/70 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        data-lenis-prevent
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#E8E2D5] overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-[#E8E2D5] flex items-center justify-between bg-gradient-to-r from-[#FCF9F7] via-white to-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/40 flex items-center justify-center text-[#8C6B14] shadow-sm">
              <Sparkles size={18} className="text-[#DCA51B]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                AI Cover Image Studio
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/30 tracking-wider">
                  FLUX Schnell
                </span>
              </h2>
              <p className="text-xs text-zinc-500">
                Generate high-resolution clinical photography for your blog cover
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar space-y-5">
          {error && (
            <div className="bg-rose-50 text-rose-800 p-3.5 rounded-2xl text-xs border border-rose-200 flex items-start gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Generation Failed</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Generated Result Preview (if available) */}
          {generatedImage?.url && (
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2DACB] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 flex items-center gap-1.5">
                  <Check size={14} className="text-emerald-600 font-bold" />
                  Generated Image Preview
                </span>
                <span className="text-[11px] font-mono text-zinc-500 bg-white px-2 py-0.5 rounded-md border border-[#E8E2D5]">
                  {aspectRatio} &bull; {model}
                </span>
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden border border-[#E2DACB] bg-zinc-950 shadow-md group">
                <img
                  src={generatedImage.url}
                  alt="Generated AI"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 shadow-sm">
                  <Sparkles size={13} className="text-[#DCA51B]" />
                  <span>{style}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-zinc-700 bg-white hover:bg-zinc-50 border border-[#E2DACB] rounded-xl transition-all shadow-sm"
                >
                  <RefreshCw size={13} className={loading ? 'animate-spin text-[#DCA51B]' : 'text-zinc-500'} />
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-[#141518] bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Check size={14} />
                  Use as Cover Image
                </button>
              </div>
            </div>
          )}

          {/* Loading Screen Overlay / Progress Card */}
          {loading && (
            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-[#DCA51B]/40 text-center space-y-4 shadow-sm animate-pulse">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF3E0] border border-[#DCA51B]/50 flex items-center justify-center text-[#8C6B14] shadow-sm">
                <RefreshCw size={24} className="animate-spin text-[#DCA51B]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">
                  Synthesizing High-Detail Clinical Image
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Powered by FLUX Schnell AI. Rendering tooth lighting, reflections, and textures...
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-600 bg-white px-3 py-1.5 rounded-full border border-[#E8E2D5]">
                <Sparkles size={13} className="text-[#DCA51B]" />
                Elapsed: <span className="font-bold text-zinc-900">{elapsedSeconds}s</span>
              </div>
            </div>
          )}

          {/* Image Generation Form Controls */}
          <form onSubmit={handleGenerate} className="space-y-4">
            {/* PROMPT */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-700 tracking-wide uppercase">
                  Image Prompt / Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {prompt.length}/1000
                </span>
              </div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                required
                maxLength={1000}
                placeholder="e.g. A macro close-up of a perfectly polished ceramic tooth veneer with soft clinic lighting and depth of field"
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 rounded-2xl text-zinc-900 text-sm outline-none transition-all placeholder:text-zinc-400 font-medium"
              />

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1 self-center mr-1">
                  <Wand2 size={12} className="text-[#DCA51B]" /> Presets:
                </span>
                {PROMPT_SUGGESTIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF3E0] hover:bg-[#F5EACB] text-[#8C6B14] border border-[#DCA51B]/30 transition-all text-left truncate max-w-[280px]"
                    title={preset}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* STYLE & ASPECT RATIO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                  Visual Style
                </label>
                <div className="relative">
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                  >
                    {STYLE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
                  Aspect Ratio
                </label>
                <div className="relative">
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-2 focus:ring-[#DCA51B]/20 rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
                  >
                    {ASPECT_RATIOS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label} &mdash; {opt.desc}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            {/* ADVANCED TOGGLE */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <SlidersHorizontal size={13} className="text-[#DCA51B]" />
                {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings (Model & Negative Prompt)'}
              </button>
            </div>

            {showAdvanced && (
              <div className="p-4 bg-[#FAF7F2] border border-[#E2DACB] rounded-2xl space-y-3.5 animate-in fade-in duration-200">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1">
                    AI Image Engine Model
                  </label>
                  <div className="relative">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#E2DACB] focus:border-[#DCA51B] rounded-xl text-zinc-900 text-xs outline-none font-medium appearance-none pr-8"
                    >
                      <option value="flux-schnell">FLUX Schnell (High Detail, ~4-8s)</option>
                      <option value="flux-dev">FLUX Dev (Maximum Quality, ~12-20s)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-500">
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 uppercase tracking-wide mb-1">
                    Negative Prompt (Elements to Exclude)
                  </label>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g. blurry, text, cartoon, low quality"
                    className="w-full px-3 py-2 bg-white border border-[#E2DACB] focus:border-[#DCA51B] rounded-xl text-zinc-900 text-xs outline-none font-medium"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#DCA51B]" />
                Direct Pixazo / FLUX AI Integration
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] text-[#141518] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-[#141518]" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-[#141518]" />
                      Generate Image
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
