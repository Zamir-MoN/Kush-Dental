import React, { useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import {
  Bot,
  RefreshCw,
  Copy,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Download,
  X,
  Clock,
  FileText,
  Zap,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class StudioErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error?.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AI Content Studio Crash Captured:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-rose-300 text-center max-w-xl mx-auto my-12 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 font-bold shadow-xs">
            <AlertTriangle size={28} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 mb-2">Display Recovery</h2>
          <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
            The studio encountered a temporary formatting issue: <br />
            <span className="font-mono text-xs text-rose-700 font-semibold">{this.state.errorMessage}</span>
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: '' })}
            className="px-6 py-2.5 bg-gradient-to-r from-[#E5B22D] to-[#DCA51B] hover:brightness-105 text-[#141518] font-bold rounded-xl text-sm shadow-md shadow-[#DCA51B]/20 cursor-pointer transition-all"
          >
            Reload AI Studio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const extractErrorMessage = (err: any, fallback: string = 'Operation failed'): string => {
  if (!err) return fallback;
  if (typeof err === 'string') return err;
  const detail = err.details?.detail ?? err.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: any) => (typeof d === 'string' ? d : d.msg || d.message || JSON.stringify(d)))
      .join(', ');
  }
  if (typeof detail === 'object' && detail !== null) {
    return detail.message || JSON.stringify(detail);
  }
  if (typeof err.message === 'string') return err.message;
  return fallback;
};

export const DXGenStudio: React.FC = () => {
  return (
    <StudioErrorBoundary>
      <div className="bg-[#FAF7F2] text-zinc-900 p-4 sm:p-6 lg:p-8 rounded-3xl border border-[#E8E2D5] shadow-lg">
        {/* Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E2D5]">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-[#FAF3E0] to-[#F5E8C7] border border-[#DCA51B]/40 text-[#B8860B] rounded-2xl shadow-[0_4px_16px_rgba(220,165,27,0.15)]">
              <Bot size={28} />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">AI Content Studio</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#FAF3E0] text-[#B8860B] border border-[#DCA51B]/40 rounded-full">
                  v1.0 Live
                </span>
              </div>
              <p className="text-sm text-zinc-500 mt-0.5">Kush Dental AI Article & Copy Generator</p>
            </div>
          </div>
        </div>

        {/* Content Generator */}
        <GeneratorForm
          endpoint="/api/v1/blog/generate"
          defaultContentType="seo_blog_article"
          defaultPlatform="website"
          title="Article & Content Generator"
        />
      </div>
    </StudioErrorBoundary>
  );
};

interface GeneratorFormProps {
  endpoint: string;
  title: string;
  defaultContentType?: string;
  defaultPlatform?: string;
}

const GENERATION_PHASES = [
  { label: 'Initializing prompt & brand voice guardrails...', minPct: 5 },
  { label: 'Connecting to Google Gemini AI engine...', minPct: 25 },
  { label: 'Structuring clinical outline & headings...', minPct: 50 },
  { label: 'Drafting high-authority dental copy...', minPct: 70 },
  { label: 'Formulating SEO meta tags, FAQs & keywords...', minPct: 88 },
  { label: 'Finalizing response & verifying markdown...', minPct: 96 },
  { label: 'Content generated successfully!', minPct: 100 },
];

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  endpoint,
  title,
  defaultContentType = 'seo_blog_article',
  defaultPlatform = 'website',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordsList, setKeywordsList] = useState<string[]>([]);

  // Real-time progress bar state
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [formData, setFormData] = useState({
    topic: '',
    contentType: defaultContentType,
    platform: defaultPlatform,
    language: 'English',
    tone: 'professional',
    length: '1000',
    businessProfile: 'Kush Dental Clinic',
    customTone: '',
    audience: '',
    location: '',
    primaryKeyword: '',
    searchIntent: 'Informational',
    customInstructions: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) {
      setError('Please provide a Topic or Headline.');
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);
    setCopied(false);
    setProgress(8);
    setPhaseIndex(0);
    setElapsedSeconds(0);

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedSeconds(Math.round(elapsed * 10) / 10);

      setProgress((prev) => {
        if (prev >= 94) {
          return Math.min(97, +(prev + 0.1).toFixed(1));
        }
        if (elapsed < 2.5) {
          setPhaseIndex(0);
          return Math.min(22, Math.round(8 + elapsed * 6));
        } else if (elapsed < 5.5) {
          setPhaseIndex(1);
          return Math.min(48, Math.round(22 + (elapsed - 2.5) * 8.5));
        } else if (elapsed < 9.0) {
          setPhaseIndex(2);
          return Math.min(72, Math.round(48 + (elapsed - 5.5) * 6.8));
        } else if (elapsed < 12.5) {
          setPhaseIndex(3);
          return Math.min(88, Math.round(72 + (elapsed - 9.0) * 4.5));
        } else {
          setPhaseIndex(4);
          return Math.min(94, Math.round(88 + (elapsed - 12.5) * 1.5));
        }
      });
    }, 150);

    try {
      const payload: any = {
        topic: formData.topic.trim(),
        contentType: formData.contentType || 'seo_blog_article',
        platform: formData.platform || 'website',
        tone: formData.tone || 'professional',
        language: formData.language || 'English',
      };

      if (formData.length) {
        payload.length = isNaN(Number(formData.length)) ? formData.length : Number(formData.length);
      }

      // Merge tags list with any remaining keyword in the input box
      const finalKeywords = [...keywordsList];
      if (keywordInput.trim()) {
        const extra = keywordInput.split(',').map((k) => k.trim()).filter(Boolean);
        extra.forEach((k) => {
          if (!finalKeywords.includes(k)) finalKeywords.push(k);
        });
      }
      if (finalKeywords.length > 0) {
        payload.keywords = finalKeywords;
      }

      // Safe instructions with brand context injected cleanly
      let instructions = (formData.customInstructions || '').trim();
      if (formData.businessProfile && formData.businessProfile !== 'None') {
        instructions = `Brand: ${formData.businessProfile}. ${instructions}`.trim();
      }
      if (instructions) {
        payload.customInstructions = instructions;
      }

      // Advanced SEO Parameters matching backend schema
      const seoObj: any = {};
      if (formData.primaryKeyword) seoObj.primaryKeyword = formData.primaryKeyword.trim();
      if (formData.searchIntent) seoObj.searchIntent = formData.searchIntent;
      if (formData.businessProfile && formData.businessProfile !== 'None') {
        seoObj.brandName = formData.businessProfile;
      }
      if (Object.keys(seoObj).length > 0) {
        payload.seo = seoObj;
      }

      if (formData.audience && formData.audience.trim()) {
        payload.audience = formData.audience.trim();
      }
      if (formData.location && formData.location.trim()) {
        payload.location = formData.location.trim();
      }
      if (formData.customTone && formData.customTone.trim()) {
        payload.customTone = formData.customTone.trim();
      }

      const res = await apiClient(endpoint, {
        method: 'POST',
        data: payload,
      });

      clearInterval(timerInterval);
      setProgress(100);
      setPhaseIndex(6);
      await new Promise((r) => setTimeout(r, 450));
      setResponse(res);
    } catch (err: any) {
      setError(extractErrorMessage(err, 'Content generation failed. Please verify AI service configuration.'));
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMarkdown = () => {
    if (!response?.content?.body) return;
    const itemTitle = response.content?.title || 'generated-content';
    const content = `# ${itemTitle}\n\n${response.content?.metaDescription ? `> **Meta Description:** ${response.content.metaDescription}\n\n` : ''}${response.content.body}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${String(itemTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Column */}
      <div className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-7 rounded-3xl border border-[#E8E2D5] shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Fill out the parameters to generate AI content.</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl text-sm border border-rose-200 flex items-start space-x-2">
            <span className="text-rose-600 font-bold shrink-0">Error:</span>
            <span className="break-words leading-relaxed">{String(error)}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Topic or Headline */}
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
              className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 placeholder-zinc-400 text-sm outline-none resize-none transition-all"
            />
          </div>

          {/* Content Type (Select Dropdown) */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
              Content Type
            </label>
            <div className="relative">
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all font-medium"
              >
                <option value="seo_blog_article">SEO Blog Article</option>
                <option value="how_to_article">How-To Article / Guide</option>
                <option value="listicle">Listicle</option>
                <option value="product_review">Product Review</option>
                <option value="promotional_content">Promotional Content</option>
                <option value="sales_copy">Sales Copy</option>
                <option value="landing_page_copy">Landing Page Copy</option>
                <option value="instagram_caption">Instagram Caption</option>
                <option value="linkedin_post">LinkedIn Post</option>
                <option value="x_twitter_post">X / Twitter Post</option>
                <option value="google_business_profile_post">Google Business Profile Post</option>
                <option value="email">Email Newsletter</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-zinc-500">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Platform & Language (2-Column Row) */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Tone & Length (2-Column Row) */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Keywords (Type and press Enter) */}
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

          {/* Attached Business Profile */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-zinc-700 tracking-wide uppercase">
                Attached Business Profile
              </label>
              <span className="text-xs text-zinc-500 font-normal">Auto-injects brand voice & USPs</span>
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

          {/* Advanced SEO & Strategy Parameters (Collapsible Accordion) */}
          <div className="border border-[#E2DACB] rounded-2xl bg-[#FAF7F2] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-zinc-700 tracking-wide hover:bg-[#F2ECE1] transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <SlidersHorizontal size={14} className="text-[#B8860B]" />
                <span>Advanced SEO & Strategy Parameters</span>
              </div>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-[#E2DACB] space-y-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Primary Keyword</label>
                    <input
                      type="text"
                      name="primaryKeyword"
                      value={formData.primaryKeyword}
                      onChange={handleChange}
                      placeholder="e.g. cosmetic dentistry"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-[#DCA51B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Search Intent</label>
                    <select
                      name="searchIntent"
                      value={formData.searchIntent}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs text-zinc-900 outline-none focus:border-[#DCA51B] cursor-pointer"
                    >
                      <option value="Informational">Informational</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Transactional">Transactional</option>
                      <option value="Navigational">Navigational</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Target Audience</label>
                    <input
                      type="text"
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      placeholder="e.g. Local Dental Patients"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-[#DCA51B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Kolkata, India"
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-[#DCA51B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-600 mb-1">Custom Tone Description</label>
                  <input
                    type="text"
                    name="customTone"
                    value={formData.customTone}
                    onChange={handleChange}
                    placeholder="e.g. Compassionate, clinically expert, reassuring"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E2DACB] rounded-xl text-xs text-zinc-900 placeholder-zinc-400 outline-none focus:border-[#DCA51B]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Custom Instructions (Optional) */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 tracking-wide mb-1.5 uppercase">
              Custom Instructions (Optional)
            </label>
            <textarea
              name="customInstructions"
              rows={2}
              value={formData.customInstructions}
              onChange={handleChange}
              placeholder="e.g. Highlight painless laser dentistry and state-of-the-art clinic hygiene"
              className="w-full px-4 py-2.5 bg-[#FAF7F2] border border-[#E2DACB] focus:border-[#DCA51B] focus:ring-1 focus:ring-[#DCA51B] rounded-2xl text-zinc-900 placeholder-zinc-400 text-sm outline-none resize-none transition-all"
            />
          </div>

          {/* Real-time Progress Bar (Active when loading) */}
          {loading && (
            <div className="bg-[#FAF7F2] border border-[#E2DACB] p-4 rounded-2xl space-y-2.5 transition-all">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 font-semibold text-zinc-800">
                  <RefreshCw size={13} className="animate-spin text-[#DCA51B] shrink-0" />
                  <span className="truncate max-w-[270px]">
                    {GENERATION_PHASES[phaseIndex]?.label || 'Generating AI content...'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="font-mono text-zinc-500 text-[11px]">{elapsedSeconds.toFixed(1)}s</span>
                  <span className="font-bold text-[#8C6B14] font-mono text-xs">{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Luxury Gold Progress Bar Track */}
              <div className="relative w-full h-2.5 bg-[#E8E2D5] rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#DCA51B] via-[#F3C969] to-[#C49216] rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${Math.min(100, Math.max(6, progress))}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] hover:brightness-105 text-[#141518] font-bold rounded-2xl shadow-md shadow-[#DCA51B]/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-60 cursor-pointer overflow-hidden relative"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <RefreshCw className="animate-spin" size={18} />
                <span>Generating Content... ({Math.round(progress)}%)</span>
              </div>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate Content</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Content / Preview Column */}
      <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E8E2D5] p-6 sm:p-7 min-h-[580px] flex flex-col shadow-sm">
        {response ? (
          <div className="space-y-6 flex-1">
            {/* Top Bar with Badges and Copy/Download actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5]">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-[#FAF3E0] border border-[#DCA51B]/40 text-[#9E7309] text-xs font-bold rounded-xl flex items-center space-x-1.5">
                  <Sparkles size={13} />
                  <span>Generated Copy</span>
                </span>
                {response.content?.wordCount && (
                  <span className="px-2.5 py-1 bg-[#FAF7F2] text-zinc-700 text-xs font-medium rounded-lg border border-[#E8E2D5] flex items-center space-x-1">
                    <FileText size={12} />
                    <span>{response.content.wordCount} words</span>
                  </span>
                )}
                {response.content?.readingTimeMinutes && (
                  <span className="px-2.5 py-1 bg-[#FAF7F2] text-zinc-700 text-xs font-medium rounded-lg border border-[#E8E2D5] flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{response.content.readingTimeMinutes} min read</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(response.content?.body || '')}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-zinc-800 text-xs font-semibold rounded-xl border border-[#E2DACB] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Body</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={downloadMarkdown}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-zinc-800 text-xs font-semibold rounded-xl border border-[#E2DACB] transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            {/* Generated Title */}
            {response.content?.title && (
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#9E7309] uppercase">
                  Article Title
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mt-1 leading-snug">
                  {String(response.content.title)}
                </h3>
              </div>
            )}

            {/* SEO Meta Box */}
            {(response.content?.metaTitle || response.content?.metaDescription || response.content?.slug) && (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-2">
                <span className="text-[11px] font-bold tracking-wider text-[#9E7309] uppercase flex items-center space-x-1">
                  <Zap size={13} />
                  <span>SEO Snippet</span>
                </span>
                {response.content?.slug && (
                  <p className="text-xs text-zinc-500 font-mono">
                    <span className="text-zinc-400 font-sans">slug:</span> /{String(response.content.slug)}
                  </p>
                )}
                {response.content?.metaTitle && (
                  <p className="text-xs font-semibold text-zinc-800">
                    <span className="text-zinc-500 font-normal">Meta Title: </span>
                    {String(response.content.metaTitle)}
                  </p>
                )}
                {response.content?.metaDescription && (
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    <span className="text-zinc-500 font-normal">Meta Description: </span>
                    {String(response.content.metaDescription)}
                  </p>
                )}
              </div>
            )}

            {/* Formatted Body */}
            {response.content?.body && (
              <div>
                <span className="text-[11px] font-bold tracking-wider text-[#9E7309] uppercase">
                  Content Body
                </span>
                <div className="mt-2 p-5 bg-[#FAF7F2] rounded-2xl border border-[#E8E2D5] text-zinc-800 text-sm leading-relaxed whitespace-pre-wrap max-h-[460px] overflow-y-auto custom-scrollbar font-normal">
                  {String(response.content.body)}
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {Array.isArray(response.content?.faq) && response.content.faq.length > 0 && (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E2D5] space-y-3">
                <span className="text-[11px] font-bold tracking-wider text-[#9E7309] uppercase flex items-center space-x-1">
                  <HelpCircle size={13} />
                  <span>Frequently Asked Questions</span>
                </span>
                <div className="space-y-2">
                  {response.content.faq.map((item: any, idx: number) => {
                    const q = typeof item === 'string' ? item : item?.question || `Question ${idx + 1}`;
                    const a = typeof item === 'object' && item?.answer ? item.answer : null;
                    return (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#E8E2D5]">
                        <p className="text-xs font-bold text-zinc-800">Q: {String(q)}</p>
                        {a && <p className="text-xs text-zinc-600 mt-1 leading-relaxed">A: {String(a)}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Keywords / Hashtags */}
            {((Array.isArray(response.content?.keywords) && response.content.keywords.length > 0) ||
              (Array.isArray(response.content?.hashtags) && response.content.hashtags.length > 0)) && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {Array.isArray(response.content?.keywords) &&
                  response.content.keywords.map((kw: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#FAF3E0] text-[#8C6B14] font-medium text-xs rounded-lg border border-[#DCA51B]/30"
                    >
                      #{String(kw)}
                    </span>
                  ))}
                {Array.isArray(response.content?.hashtags) &&
                  response.content.hashtags.map((tag: any, i: number) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-[#F5EFE4] text-zinc-700 font-medium text-xs rounded-lg border border-[#E2DACB]"
                    >
                      {String(tag)}
                    </span>
                  ))}
              </div>
            )}

            {/* Raw JSON Debug */}
            <details className="mt-4 pt-4 border-t border-[#E8E2D5]">
              <summary className="text-xs font-semibold text-[#9E7309] hover:text-[#B8860B] cursor-pointer">
                View Raw JSON Metadata
              </summary>
              <pre className="mt-2 text-[11px] bg-[#FAF7F2] text-zinc-800 p-4 rounded-2xl border border-[#E8E2D5] overflow-x-auto max-h-60 custom-scrollbar font-mono">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        ) : loading ? (
          /* Live AI Generation In-Progress State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FAF3E0] to-[#F5E8C7] border border-[#DCA51B]/50 flex items-center justify-center text-[#B8860B] shadow-[0_8px_24px_rgba(220,165,27,0.22)]">
                <Sparkles size={30} className="animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-[#DCA51B] flex items-center justify-center text-[#B8860B] shadow-xs">
                <RefreshCw size={12} className="animate-spin" />
              </div>
            </div>

            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#FAF3E0] text-[#9E7309] border border-[#DCA51B]/40 mb-2">
                AI Generation In Progress
              </span>
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                Crafting Content for &ldquo;{formData.topic}&rdquo;
              </h3>
              <p className="text-xs text-zinc-500 mt-1 max-w-md mx-auto">
                Powered by Google Gemini. Structuring clinical accuracy, SEO headings, and dental brand voice.
              </p>
            </div>

            {/* Detailed Progress Card */}
            <div className="w-full max-w-md bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E2D5] space-y-3.5 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 truncate max-w-[280px]">
                  {GENERATION_PHASES[phaseIndex]?.label || 'Generating AI content...'}
                </span>
                <span className="font-bold text-[#8C6B14] font-mono text-sm">
                  {Math.round(progress)}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="relative w-full h-3 bg-[#E8E2D5] rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#DCA51B] via-[#F3C969] to-[#C49216] rounded-full transition-all duration-300 ease-out relative"
                  style={{ width: `${Math.min(100, Math.max(6, progress))}%` }}
                >
                  <div className="absolute inset-0 bg-white/25 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                <span>Elapsed: <strong className="text-zinc-800 font-mono">{elapsedSeconds.toFixed(1)}s</strong></span>
                <span>Expected: <strong className="text-zinc-800 font-mono">~12–15s</strong></span>
              </div>
            </div>

            {/* Shimmer Skeleton Placeholder */}
            <div className="w-full max-w-md space-y-2.5 opacity-50 pt-2">
              <div className="h-4 bg-[#E8E2D5] rounded-md animate-pulse w-3/4 mx-auto" />
              <div className="h-3 bg-[#EFE8D9] rounded-md animate-pulse w-full" />
              <div className="h-3 bg-[#EFE8D9] rounded-md animate-pulse w-5/6 mx-auto" />
              <div className="h-3 bg-[#EFE8D9] rounded-md animate-pulse w-2/3 mx-auto" />
            </div>
          </div>
        ) : (
          /* Empty / Initial State matching Kush Dental Theme */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF3E0] border border-[#DCA51B]/40 flex items-center justify-center text-[#B8860B] mb-5 shadow-[0_4px_16px_rgba(220,165,27,0.18)]">
              <Sparkles size={30} />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Ready for your prompt</h3>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              Configure your parameters on the left and click Generate Content. The system will build an
              optimized prompt internally and return formatted SEO-ready copy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

