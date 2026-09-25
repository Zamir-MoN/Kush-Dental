import React, { useState } from 'react';
import { apiClient } from '../../lib/apiClient';
import {
  Bot,
  RefreshCw,
  Activity,
  Search,
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
  ExternalLink
} from 'lucide-react';

type Tab = 'universal' | 'blog' | 'social' | 'business' | 'lookup' | 'usage' | 'health';

export const DXGenStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('universal');

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-4 sm:p-6 lg:p-8 rounded-2xl border border-[#162138] shadow-2xl">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#17233d]">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.18)]">
            <Bot size={28} />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">AI Content Studio</h1>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                v1.0 Live
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-0.5">Kush Dental DXGen Integration</p>
          </div>
        </div>

        {/* Quick Service Link / Status */}
        <div className="flex items-center space-x-3">
          <a
            href="http://51.20.121.253:3101"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0f172a] hover:bg-[#16223b] text-slate-300 hover:text-cyan-300 text-xs font-medium rounded-lg border border-[#1e2d4d] transition-colors"
          >
            <span>DXGen Engine</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-[#0b1325] rounded-xl border border-[#182746] p-1.5 mb-8 overflow-x-auto custom-scrollbar">
        <nav className="flex space-x-1 min-w-max" aria-label="Tabs">
          {[
            { id: 'universal', label: 'Universal' },
            { id: 'blog', label: 'Blog' },
            { id: 'social', label: 'Social' },
            { id: 'business', label: 'Business' },
            { id: 'lookup', label: 'Content Lookup' },
            { id: 'usage', label: 'Usage' },
            { id: 'health', label: 'Health' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121f3a]'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab View */}
      <div>
        {activeTab === 'universal' && (
          <GeneratorForm
            endpoint="/api/v1/dxgen/generate"
            defaultContentType="seo_blog_article"
            defaultPlatform="website"
            title="Universal Generator"
          />
        )}
        {activeTab === 'blog' && (
          <GeneratorForm
            endpoint="/api/v1/blog/generate"
            defaultContentType="seo_blog_article"
            defaultPlatform="website"
            title="Blog Generator"
          />
        )}
        {activeTab === 'social' && (
          <GeneratorForm
            endpoint="/api/v1/dxgen/generate/social"
            defaultContentType="instagram_caption"
            defaultPlatform="instagram"
            title="Social Generator"
          />
        )}
        {activeTab === 'business' && (
          <GeneratorForm
            endpoint="/api/v1/dxgen/generate/business"
            defaultContentType="google_business_profile_post"
            defaultPlatform="google_business"
            title="Business Generator"
          />
        )}
        {activeTab === 'lookup' && <ContentLookup />}
        {activeTab === 'usage' && <UsageTab />}
        {activeTab === 'health' && <HealthTab />}
      </div>
    </div>
  );
};

interface GeneratorFormProps {
  endpoint: string;
  title: string;
  defaultContentType?: string;
  defaultPlatform?: string;
}

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

  const [formData, setFormData] = useState({
    topic: '',
    contentType: defaultContentType,
    platform: defaultPlatform,
    language: 'English',
    tone: 'professional',
    length: '1000',
    businessProfile: 'Fasun',
    customTone: '',
    audience: '',
    location: '',
    primaryKeyword: '',
    searchIntent: 'Informational',
    customInstructions: '',
  });

  const promptSuggestions = [
    'AI Marketing Strategies',
    'Best CRM for B2B Startups',
    'Instagram Launch Hook',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setFormData((prev) => ({ ...prev, topic: suggestion }));
  };

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

      // Business Profile Injection
      if (formData.businessProfile === 'Fasun') {
        payload.brandName = 'Fasun';
      } else if (formData.businessProfile === 'Kush Dental Clinic') {
        payload.brandName = 'Kush Dental Clinic';
      }

      // Advanced SEO Parameters
      const seoObj: any = {};
      if (formData.primaryKeyword) seoObj.primaryKeyword = formData.primaryKeyword;
      if (formData.searchIntent) seoObj.searchIntent = formData.searchIntent;
      if (formData.businessProfile) seoObj.brandName = formData.businessProfile;
      if (Object.keys(seoObj).length > 0) {
        payload.seo = seoObj;
      }

      if (formData.audience) payload.audience = formData.audience;
      if (formData.location) payload.location = formData.location;
      if (formData.customTone) payload.customTone = formData.customTone;
      if (formData.customInstructions) payload.customInstructions = formData.customInstructions;

      const res = await apiClient(endpoint, {
        method: 'POST',
        data: payload,
      });

      setResponse(res);
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Generation failed');
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
    const title = response.content?.title || 'generated-content';
    const content = `# ${title}\n\n${response.content?.metaDescription ? `> **Meta Description:** ${response.content.metaDescription}\n\n` : ''}${response.content.body}`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Column */}
      <div className="lg:col-span-6 space-y-6 bg-[#0a1122] p-6 rounded-2xl border border-[#172542] shadow-xl">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">Fill out the parameters to generate AI content.</p>
        </div>

        {error && (
          <div className="bg-red-950/40 text-red-300 p-4 rounded-xl text-sm border border-red-800/60 flex items-start space-x-2">
            <span className="text-red-400 font-bold">Error:</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Topic or Headline */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
              Topic or Headline <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="topic"
              required
              rows={2}
              value={formData.topic}
              onChange={handleChange}
              placeholder="e.g. Best web development services for small businesses in 2026"
              className="w-full px-4 py-3 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none resize-none transition-all"
            />

            {/* Try Suggestions */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs text-slate-400 font-medium">Try:</span>
              {promptSuggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2.5 py-1 bg-[#121e36] hover:bg-[#1a2c4e] text-slate-300 hover:text-cyan-300 text-xs rounded-lg border border-[#1e3052] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type (Select Dropdown) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
              Content Type
            </label>
            <div className="relative">
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all"
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
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Platform & Language (2-Column Row) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
                Platform
              </label>
              <div className="relative">
                <select
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all"
                >
                  <option value="website">Website / Blog</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="google_business">Google Business</option>
                  <option value="email">Email</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
                Language
              </label>
              <div className="relative">
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Bengali">Bengali</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Tone & Length (2-Column Row) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
                Tone
              </label>
              <div className="relative">
                <select
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
                Length
              </label>
              <div className="relative">
                <select
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all"
                >
                  <option value="1000">Medium (800–1200w)</option>
                  <option value="500">Short (300–500w)</option>
                  <option value="1800">Long (1500–2000w)</option>
                  <option value="2500">Comprehensive (2500w+)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Keywords (Type and press Enter) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
              Keywords (Type and press Enter)
            </label>
            <div className="min-h-[44px] p-2 bg-[#0d1629] border border-[#1c2a47] focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 rounded-xl flex flex-wrap items-center gap-1.5 transition-all">
              {keywordsList.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center px-2 py-0.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs rounded-md"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeKeyword(kw)}
                    className="ml-1 text-cyan-400 hover:text-cyan-200"
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
                className="flex-1 min-w-[120px] bg-transparent text-slate-100 text-sm outline-none placeholder-slate-500 px-1"
              />
            </div>
          </div>

          {/* Attached Business Profile */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Attached Business Profile
              </label>
              <span className="text-xs text-slate-400 font-normal">Auto-injects brand voice & USPs</span>
            </div>
            <div className="relative">
              <select
                name="businessProfile"
                value={formData.businessProfile}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 text-sm outline-none appearance-none cursor-pointer pr-10 transition-all"
              >
                <option value="Fasun">Fasun</option>
                <option value="Kush Dental Clinic">Kush Dental Clinic</option>
                <option value="None">None (Generic)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Advanced SEO & Strategy Parameters (Collapsible Accordion) */}
          <div className="border border-[#1a2948] rounded-xl bg-[#0c1426] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold text-slate-300 tracking-wide hover:bg-[#111c33] transition-colors"
            >
              <div className="flex items-center space-x-2">
                <SlidersHorizontal size={14} className="text-cyan-400" />
                <span>Advanced SEO & Strategy Parameters</span>
              </div>
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-[#1a2948] space-y-4 bg-[#0a1020]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Primary Keyword</label>
                    <input
                      type="text"
                      name="primaryKeyword"
                      value={formData.primaryKeyword}
                      onChange={handleChange}
                      placeholder="e.g. web design tips"
                      className="w-full px-3 py-2 bg-[#0d1629] border border-[#1c2a47] rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Search Intent</label>
                    <select
                      name="searchIntent"
                      value={formData.searchIntent}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-[#0d1629] border border-[#1c2a47] rounded-lg text-xs text-slate-100 outline-none focus:border-cyan-500"
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
                    <label className="block text-xs text-slate-400 mb-1">Target Audience</label>
                    <input
                      type="text"
                      name="audience"
                      value={formData.audience}
                      onChange={handleChange}
                      placeholder="e.g. B2B Founders"
                      className="w-full px-3 py-2 bg-[#0d1629] border border-[#1c2a47] rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Global, New York"
                      className="w-full px-3 py-2 bg-[#0d1629] border border-[#1c2a47] rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Custom Tone Description</label>
                  <input
                    type="text"
                    name="customTone"
                    value={formData.customTone}
                    onChange={handleChange}
                    placeholder="e.g. Authoritative yet approachable industry expert"
                    className="w-full px-3 py-2 bg-[#0d1629] border border-[#1c2a47] rounded-lg text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Custom Instructions (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 tracking-wide mb-1.5 uppercase">
              Custom Instructions (Optional)
            </label>
            <textarea
              name="customInstructions"
              rows={2}
              value={formData.customInstructions}
              onChange={handleChange}
              placeholder="e.g. Include a comparison table and emphasize our 14-day free trial"
              className="w-full px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none resize-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin" size={18} />
                <span>Generating Content...</span>
              </>
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
      <div className="lg:col-span-6 bg-[#0a1122] rounded-2xl border border-[#172542] p-6 min-h-[580px] flex flex-col shadow-xl">
        {response ? (
          <div className="space-y-6 flex-1">
            {/* Top Bar with Badges and Copy/Download actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#172542]">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold rounded-lg flex items-center space-x-1">
                  <Sparkles size={12} />
                  <span>Generated Copy</span>
                </span>
                {response.content?.wordCount && (
                  <span className="px-2.5 py-1 bg-[#121f3a] text-slate-300 text-xs rounded-lg flex items-center space-x-1">
                    <FileText size={12} />
                    <span>{response.content.wordCount} words</span>
                  </span>
                )}
                {response.content?.readingTimeMinutes && (
                  <span className="px-2.5 py-1 bg-[#121f3a] text-slate-300 text-xs rounded-lg flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{response.content.readingTimeMinutes} min read</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(response.content?.body || '')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#121e38] hover:bg-[#1a2c52] text-slate-200 text-xs font-medium rounded-lg border border-[#1f3257] transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
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
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#121e38] hover:bg-[#1a2c52] text-slate-200 text-xs font-medium rounded-lg border border-[#1f3257] transition-colors"
                >
                  <Download size={14} />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            {/* Generated Title */}
            {response.content?.title && (
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Article Title
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                  {response.content.title}
                </h3>
              </div>
            )}

            {/* SEO Meta Box */}
            {(response.content?.metaTitle || response.content?.metaDescription || response.content?.slug) && (
              <div className="bg-[#0e182e] p-4 rounded-xl border border-[#1c2c4d] space-y-2">
                <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase flex items-center space-x-1">
                  <Zap size={13} />
                  <span>SEO Snippet</span>
                </span>
                {response.content?.slug && (
                  <p className="text-xs text-slate-400 font-mono">
                    <span className="text-slate-500">slug:</span> /{response.content.slug}
                  </p>
                )}
                {response.content?.metaTitle && (
                  <p className="text-xs font-semibold text-slate-200">
                    <span className="text-slate-400 font-normal">Meta Title: </span>
                    {response.content.metaTitle}
                  </p>
                )}
                {response.content?.metaDescription && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-slate-400 font-normal">Meta Description: </span>
                    {response.content.metaDescription}
                  </p>
                )}
              </div>
            )}

            {/* Formatted Body */}
            {response.content?.body && (
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  Content Body
                </span>
                <div className="mt-2 p-5 bg-[#0b1426] rounded-xl border border-[#1b2b4b] text-slate-200 text-sm leading-relaxed whitespace-pre-wrap max-h-[460px] overflow-y-auto custom-scrollbar font-normal">
                  {response.content.body}
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {response.content?.faq && Array.isArray(response.content.faq) && response.content.faq.length > 0 && (
              <div className="bg-[#0e182e] p-4 rounded-xl border border-[#1c2c4d] space-y-3">
                <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center space-x-1">
                  <HelpCircle size={13} className="text-cyan-400" />
                  <span>Frequently Asked Questions</span>
                </span>
                <div className="space-y-2">
                  {response.content.faq.map((item: any, idx: number) => (
                    <div key={idx} className="bg-[#091120] p-3 rounded-lg border border-[#182643]">
                      <p className="text-xs font-semibold text-slate-200">
                        Q: {typeof item === 'string' ? item : item.question}
                      </p>
                      {item.answer && (
                        <p className="text-xs text-slate-400 mt-1">A: {item.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords / Hashtags */}
            {((response.content?.keywords && response.content.keywords.length > 0) ||
              (response.content?.hashtags && response.content.hashtags.length > 0)) && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {response.content?.keywords?.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-[#121f3a] text-slate-300 text-xs rounded-md border border-[#1a2c4e]"
                  >
                    #{kw}
                  </span>
                ))}
                {response.content?.hashtags?.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-cyan-950/40 text-cyan-300 text-xs rounded-md border border-cyan-800/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Raw JSON Debug */}
            <details className="mt-4 pt-4 border-t border-[#172542]">
              <summary className="text-xs font-medium text-cyan-400 hover:text-cyan-300 cursor-pointer">
                View Raw JSON Metadata
              </summary>
              <pre className="mt-2 text-[11px] bg-[#070d1a] text-slate-300 p-4 rounded-xl border border-[#16233d] overflow-x-auto max-h-60 custom-scrollbar">
                {JSON.stringify(response, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          /* Empty / Initial State matching Image 2 */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#0f223d] border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 shadow-[0_0_25px_rgba(6,182,212,0.18)]">
              <Sparkles size={30} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Ready for your prompt</h3>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Configure your parameters on the left and click Generate Content. The system will build an
              optimized prompt internally and return formatted SEO-ready copy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/* Content Lookup Component */
const ContentLookup: React.FC = () => {
  const [contentId, setContentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentId.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await apiClient(`/api/v1/dxgen/content/${contentId.trim()}`);
      setResponse(res);
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 bg-[#0a1122] p-6 rounded-2xl border border-[#172542] shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-white">Content Lookup</h2>
        <p className="text-sm text-slate-400 mt-1">
          Retrieve previously generated content records and metadata by Content ID.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          placeholder="e.g. cnt_72948201a0bc"
          required
          className="flex-1 px-4 py-2.5 bg-[#0d1629] border border-[#1c2a47] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl text-slate-100 placeholder-slate-500 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-semibold rounded-xl shadow-md shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <RefreshCw className="animate-spin mr-2" size={18} />
          ) : (
            <Search className="mr-2" size={18} />
          )}
          Fetch Record
        </button>
      </form>

      {error && (
        <div className="bg-red-950/40 text-red-300 p-4 rounded-xl text-sm border border-red-800/60">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-[#0b1426] p-6 rounded-xl border border-[#1b2b4b]">
          <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto custom-scrollbar">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

/* Usage Tab Component */
const UsageTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const fetchUsage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient('/api/v1/dxgen/usage');
      setResponse(res);
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to fetch usage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 bg-[#0a1122] p-6 rounded-2xl border border-[#172542] shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-white">API Usage & Rate Quotas</h2>
        <p className="text-sm text-slate-400 mt-1">Check current token usage, limits, and credit allocation.</p>
      </div>

      <button
        onClick={fetchUsage}
        disabled={loading}
        className="flex items-center px-4 py-2.5 bg-[#0f1a30] hover:bg-[#162544] text-slate-200 border border-[#1d2f53] rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
      >
        <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
        Refresh Usage Stats
      </button>

      {error && (
        <div className="bg-red-950/40 text-red-300 p-4 rounded-xl text-sm border border-red-800/60">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-[#0b1426] p-6 rounded-xl border border-[#1b2b4b]">
          <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto custom-scrollbar">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

/* Health Check Component */
const HealthTab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient('/api/v1/dxgen/health');
      setResponse(res);
    } catch (err: any) {
      setError(err.details?.detail || err.message || 'Failed to check health');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 bg-[#0a1122] p-6 rounded-2xl border border-[#172542] shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-white">Service Health Diagnostics</h2>
        <p className="text-sm text-slate-400 mt-1">Verify live connectivity with the DXGen AI service cluster.</p>
      </div>

      <button
        onClick={checkHealth}
        disabled={loading}
        className="flex items-center px-4 py-2.5 bg-[#0f1a30] hover:bg-[#162544] text-slate-200 border border-[#1d2f53] rounded-xl text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
      >
        <Activity className={`mr-2 ${loading ? 'animate-pulse text-cyan-400' : 'text-slate-400'}`} size={16} />
        Check DXGen Health
      </button>

      {error && (
        <div className="bg-red-950/40 text-red-300 p-4 rounded-xl text-sm border border-red-800/60">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-[#0b1426] p-6 rounded-xl border border-[#1b2b4b] space-y-4">
          <div className="flex items-center space-x-2.5">
            <div
              className={`w-3 h-3 rounded-full ${
                response.status === 'ok' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'
              }`}
            />
            <span className="font-semibold text-white capitalize text-sm">
              Status: {response.status || 'Unknown'}
            </span>
          </div>
          <pre className="text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto custom-scrollbar">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
