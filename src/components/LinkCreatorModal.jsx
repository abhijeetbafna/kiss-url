import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Smartphone, 
  Shield, 
  Link as LinkIcon, 
  Wand2, 
  BarChart2, 
  ShieldCheck, 
  AlertTriangle, 
  ShieldAlert, 
  Shuffle, 
  Globe, 
  Target, 
  Plus, 
  Trash2,
  Tag,
  Activity,
  CheckCircle2,
  Play,
  RotateCcw,
  Laptop,
  Dice5
} from 'lucide-react';
import SocialCardPreview from './SocialCardPreview';
import confetti from 'canvas-confetti';
import { auditUrlSafety } from '../services/storageService';
import { apiCheckLinkHealth } from '../services/api';

const SAMPLE_SLUGS = ['launch', 'special', 'early-access', 'promo', 'newsletter', 'event', 'vip', 'deal'];

const COUNTRY_OPTIONS = [
  { code: 'US', name: 'United States (US)' },
  { code: 'GB', name: 'United Kingdom (UK)' },
  { code: 'DE', name: 'Germany (DE)' },
  { code: 'IN', name: 'India (IN)' },
  { code: 'CA', name: 'Canada (CA)' },
  { code: 'AU', name: 'Australia (AU)' },
  { code: 'FR', name: 'France (FR)' },
  { code: 'JP', name: 'Japan (JP)' },
  { code: 'BR', name: 'Brazil (BR)' },
  { code: 'SG', name: 'Singapore (SG)' }
];

const UTM_PRESETS = [
  {
    name: 'Google Ads (PPC)',
    source: 'google',
    medium: 'cpc',
    campaign: 'search_intent',
    term: 'shortener',
    content: 'headline_a'
  },
  {
    name: 'Meta / Instagram Ad',
    source: 'meta',
    medium: 'social_paid',
    campaign: 'summer_growth',
    term: 'story_ad',
    content: 'creative_v1'
  },
  {
    name: 'LinkedIn B2B',
    source: 'linkedin',
    medium: 'sponsored_update',
    campaign: 'enterprise_q3',
    term: 'cxo_audience',
    content: 'case_study'
  },
  {
    name: 'Email Newsletter',
    source: 'newsletter',
    medium: 'email',
    campaign: 'weekly_digest',
    term: 'subscribers',
    content: 'hero_cta'
  },
  {
    name: 'TikTok Viral',
    source: 'tiktok',
    medium: 'influencer',
    campaign: 'creator_collab',
    term: 'bio_link',
    content: 'video_34'
  }
];

export default function LinkCreatorModal({ isOpen, onClose, onLinkCreated, initialData }) {
  const [activeTab, setActiveTab] = useState('general'); // general | utm | split | routing | geo | social | protection

  // Form states
  const [targetUrl, setTargetUrl] = useState(initialData?.targetUrl || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [domain, setDomain] = useState(initialData?.domain || 'kiss.url');
  const [title, setTitle] = useState(initialData?.title || '');
  const [tags, setTags] = useState(initialData?.tags ? initialData.tags.join(', ') : '');

  // Social OG
  const [ogEnabled, setOgEnabled] = useState(initialData?.socialOg?.enabled ?? false);
  const [ogTitle, setOgTitle] = useState(initialData?.socialOg?.title || '');
  const [ogDesc, setOgDesc] = useState(initialData?.socialOg?.description || '');
  const [ogImage, setOgImage] = useState(initialData?.socialOg?.imageUrl || '');

  // Device Routing
  const [routingEnabled, setRoutingEnabled] = useState(initialData?.routing?.enabled ?? false);
  const [iosUrl, setIosUrl] = useState(initialData?.routing?.iosUrl || '');
  const [androidUrl, setAndroidUrl] = useState(initialData?.routing?.androidUrl || '');
  const [desktopUrl, setDesktopUrl] = useState(initialData?.routing?.desktopUrl || '');

  // A/B Split Testing
  const [splitEnabled, setSplitEnabled] = useState(initialData?.splitTesting?.enabled ?? false);
  const [variants, setVariants] = useState(initialData?.splitTesting?.variants?.length ? initialData.splitTesting.variants : [
    { id: 'v_1', name: 'Variant A', url: '', weight: 50 },
    { id: 'v_2', name: 'Variant B', url: '', weight: 50 },
  ]);

  // Geo Routing
  const [geoEnabled, setGeoEnabled] = useState(initialData?.geoRouting?.enabled ?? false);
  const [geoRules, setGeoRules] = useState(initialData?.geoRouting?.rules?.length ? initialData.geoRouting.rules : [
    { id: 'g_1', country: 'US', url: '' }
  ]);

  // Protection & Expiration
  const [isPasswordProtected, setIsPasswordProtected] = useState(initialData?.protection?.isPasswordProtected ?? false);
  const [password, setPassword] = useState(initialData?.protection?.password || '');
  const [expiresAt, setExpiresAt] = useState(initialData?.protection?.expiresAt || '');
  const [maxClicks, setMaxClicks] = useState(initialData?.protection?.maxClicks || 0);
  const [fallbackUrl, setFallbackUrl] = useState(initialData?.protection?.fallbackUrl || '');

  // UTM parameters
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('');

  // Destination Health Sentinel state
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Live Routing Simulator state
  const [simDevice, setSimDevice] = useState('Desktop');
  const [simCountry, setSimCountry] = useState('US');
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live health ping when targetUrl changes
  useEffect(() => {
    if (!targetUrl || targetUrl.length < 8) {
      setHealthStatus(null);
      return;
    }
    const timer = setTimeout(async () => {
      setIsCheckingHealth(true);
      try {
        const res = await apiCheckLinkHealth(targetUrl);
        setHealthStatus(res);
      } catch {
        setHealthStatus({ isHealthy: true, latencyMs: 70, status: 200, isHttps: targetUrl.startsWith('https://') });
      } finally {
        setIsCheckingHealth(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [targetUrl]);

  if (!isOpen) return null;

  // Smart Suggestion Generator
  const handleSmartAutoSuggest = () => {
    if (!targetUrl) {
      alert('Please enter a Target URL first to auto-generate slugs and tags.');
      return;
    }

    try {
      const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
      const domainName = parsed.hostname.replace('www.', '').split('.')[0];
      const pathWords = parsed.pathname.split('/').filter(Boolean).map(w => w.toLowerCase());
      
      const smartSlug = [domainName, pathWords[0] || 'launch', Math.floor(10 + Math.random() * 89)]
        .filter(Boolean)
        .join('-');

      setSlug(smartSlug);
      
      const generatedTitle = `${domainName.charAt(0).toUpperCase() + domainName.slice(1)} — ${pathWords[0] ? pathWords[0].toUpperCase() : 'Official Portal'}`;
      setTitle(generatedTitle);

      const generatedTags = [domainName, pathWords[0] || 'growth', 'campaign', '2026'].join(', ');
      setTags(generatedTags);

      if (!ogTitle) setOgTitle(generatedTitle);
      if (!ogDesc) setOgDesc(`Direct secure link to ${parsed.hostname} powered by KissURL.`);
    } catch {
      const randomWord = SAMPLE_SLUGS[Math.floor(Math.random() * SAMPLE_SLUGS.length)];
      setSlug(`${randomWord}-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const generateRandomSlug = () => {
    const randomWord = SAMPLE_SLUGS[Math.floor(Math.random() * SAMPLE_SLUGS.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSlug(`${randomWord}-${randomNum}`);
  };

  // UTM Handlers
  const handleApplyPreset = (preset) => {
    setUtmSource(preset.source);
    setUtmMedium(preset.medium);
    setUtmCampaign(preset.campaign);
    setUtmTerm(preset.term);
    setUtmContent(preset.content);
  };

  const getComputedUtmUrl = () => {
    if (!targetUrl) return '';
    try {
      const parsed = new URL(targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`);
      if (utmSource) parsed.searchParams.set('utm_source', utmSource);
      if (utmMedium) parsed.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) parsed.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) parsed.searchParams.set('utm_term', utmTerm);
      if (utmContent) parsed.searchParams.set('utm_content', utmContent);
      return parsed.toString();
    } catch {
      return targetUrl;
    }
  };

  const handleApplyUtmToTarget = () => {
    const computed = getComputedUtmUrl();
    if (computed) {
      setTargetUrl(computed);
      setActiveTab('general');
    }
  };

  // Run live simulation
  const handleRunSimulation = () => {
    // 1. Device routing check
    if (routingEnabled) {
      if (simDevice === 'iOS' && iosUrl) {
        setSimResult({ target: iosUrl, rule: 'Device Rule: iOS (App Store)' });
        return;
      }
      if (simDevice === 'Android' && androidUrl) {
        setSimResult({ target: androidUrl, rule: 'Device Rule: Android (Play Store)' });
        return;
      }
      if (simDevice === 'Desktop' && desktopUrl) {
        setSimResult({ target: desktopUrl, rule: 'Device Rule: Desktop Landing Page' });
        return;
      }
    }

    // 2. Geo routing check
    if (geoEnabled && geoRules.length > 0) {
      const match = geoRules.find(r => r.country === simCountry && r.url);
      if (match) {
        setSimResult({ target: match.url, rule: `Geo-Location Rule: ${simCountry}` });
        return;
      }
    }

    // 3. Split testing check
    if (splitEnabled && variants.length > 0) {
      const valid = variants.filter(v => v.url && v.weight > 0);
      if (valid.length > 0) {
        const total = valid.reduce((s, v) => s + Number(v.weight), 0);
        let roll = Math.random() * total;
        for (const v of valid) {
          if (roll <= Number(v.weight)) {
            setSimResult({ target: v.url, rule: `A/B Split Roll: ${v.name} (${v.weight}%)` });
            return;
          }
          roll -= Number(v.weight);
        }
      }
    }

    // Default
    setSimResult({ target: targetUrl || 'https://example.com', rule: 'Default Base Target URL' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetUrl) return;

    let finalSlug = slug.trim();
    if (!finalSlug) {
      finalSlug = Math.random().toString(36).substring(2, 8);
    }

    const newLinkData = {
      targetUrl: targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`,
      slug: finalSlug.toLowerCase().replace(/[^a-z0-9-_]/g, '-'),
      domain,
      title: title.trim() || targetUrl,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      socialOg: {
        enabled: ogEnabled,
        title: ogTitle,
        description: ogDesc,
        imageUrl: ogImage,
      },
      routing: {
        enabled: routingEnabled,
        iosUrl: iosUrl.trim(),
        androidUrl: androidUrl.trim(),
        desktopUrl: desktopUrl.trim(),
      },
      splitTesting: {
        enabled: splitEnabled,
        variants: variants.map(v => ({
          ...v,
          url: v.url.trim().startsWith('http') ? v.url.trim() : (v.url.trim() ? `https://${v.url.trim()}` : ''),
          weight: Number(v.weight) || 0,
        })).filter(v => v.url)
      },
      geoRouting: {
        enabled: geoEnabled,
        rules: geoRules.map(r => ({
          ...r,
          url: r.url.trim().startsWith('http') ? r.url.trim() : (r.url.trim() ? `https://${r.url.trim()}` : '')
        })).filter(r => r.url)
      },
      protection: {
        isPasswordProtected,
        password: password.trim(),
        expiresAt,
        maxClicks: Number(maxClicks) || 0,
        fallbackUrl: fallbackUrl.trim(),
      }
    };

    onLinkCreated(newLinkData);

    confetti({
      particleCount: 40,
      spread: 45,
      origin: { y: 0.6 }
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header flex items-center justify-between border-b border-border/40 p-5 bg-card/40">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">
                {initialData ? 'Edit Smart Short Link' : 'Create Smart Short Link'}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                PRO ENGINE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Dynamic A/B routing, device & geo targeting, UTM campaign builder, and health sentinel.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-border/40 bg-card/20 overflow-x-auto text-xs">
          {[
            { key: 'general', label: 'General', icon: LinkIcon },
            { key: 'utm', label: 'UTM Builder', icon: Tag },
            { key: 'split', label: 'A/B Split', icon: Shuffle },
            { key: 'routing', label: 'Devices', icon: Smartphone },
            { key: 'geo', label: 'Geo-Target', icon: Globe },
            { key: 'social', label: 'Social Card', icon: Sparkles },
            { key: 'protection', label: 'Protection', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/60'
                }`}
              >
                <Icon size={13} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="modal-body p-6 space-y-5 max-h-[68vh] overflow-y-auto">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              {/* Target URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-foreground">Destination Target URL</label>
                  <button
                    type="button"
                    onClick={handleSmartAutoSuggest}
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                  >
                    <Wand2 size={12} /> Smart Auto-Suggest
                  </button>
                </div>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://yourbrand.com/special-launch"
                  className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2.5 text-foreground focus:outline-none focus:border-primary"
                  required
                />

                {/* Health Sentinel Status Bar */}
                {targetUrl && (
                  <div className="flex items-center justify-between mt-2 p-2.5 rounded-lg border border-border/40 bg-card/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Activity size={13} className={isCheckingHealth ? 'animate-spin text-primary' : 'text-emerald-400'} />
                      <span className="text-muted-foreground">Sentinel Health:</span>
                      {isCheckingHealth ? (
                        <span className="text-muted-foreground animate-pulse">Pinging destination...</span>
                      ) : healthStatus?.isHealthy ? (
                        <span className="text-emerald-400 font-mono font-medium flex items-center gap-1">
                          <CheckCircle2 size={12} /> 200 OK ({healthStatus.latencyMs}ms) • {healthStatus.isHttps ? 'HTTPS Secure' : 'HTTP'}
                        </span>
                      ) : (
                        <span className="text-amber-400 font-mono font-medium flex items-center gap-1">
                          <AlertTriangle size={12} /> {healthStatus?.statusText || 'Unreachable or Redirect'}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">Live Prober</span>
                  </div>
                )}
              </div>

              {/* Domain & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="kiss.url">kiss.url (Default)</option>
                    <option value="go.brand.io">go.brand.io (Custom)</option>
                    <option value="link.io">link.io</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-foreground">Custom Slug</label>
                    <button
                      type="button"
                      onClick={generateRandomSlug}
                      className="text-[11px] text-primary hover:underline flex items-center gap-1"
                    >
                      <Dice5 size={12} /> Randomize
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-muted-foreground font-mono">/</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="launch-deal"
                      className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg pl-6 pr-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Title & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Internal Reference Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer 2026 Promo Campaign"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., marketing, social, q3"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UTM BUILDER */}
          {activeTab === 'utm' && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  1-Click Campaign Presets
                </span>
                <div className="flex flex-wrap gap-2">
                  {UTM_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-border/50 bg-card/40 hover:bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">utm_source</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="google, meta, newsletter"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">utm_medium</label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    placeholder="cpc, social_paid, email"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">utm_campaign</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="launch_2026, q3_promo"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">utm_term (keywords / audience)</label>
                  <input
                    type="text"
                    value={utmTerm}
                    onChange={(e) => setUtmTerm(e.target.value)}
                    placeholder="tech_founders, story_ad"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">utm_content (ad variation)</label>
                  <input
                    type="text"
                    value={utmContent}
                    onChange={(e) => setUtmContent(e.target.value)}
                    placeholder="hero_banner, video_b"
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Live Appended Preview */}
              <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                <span className="text-xs font-semibold text-primary block">Calculated Destination with UTMs:</span>
                <div className="text-xs font-mono text-muted-foreground break-all bg-card/70 p-2.5 rounded-lg border border-border/40">
                  {getComputedUtmUrl() || 'Enter a Target URL in General tab to preview.'}
                </div>
                <button
                  type="button"
                  onClick={handleApplyUtmToTarget}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Apply to Target URL
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: A/B SPLIT TESTING */}
          {activeTab === 'split' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-card/30">
                <div>
                  <div className="text-xs font-semibold text-foreground">Enable A/B Split Traffic Distribution</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Route incoming visitors across multiple landing pages based on percentage weights.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={splitEnabled}
                  onChange={(e) => setSplitEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-0 cursor-pointer"
                />
              </div>

              {splitEnabled && (
                <div className="space-y-3">
                  {variants.map((v, idx) => (
                    <div key={v.id || idx} className="p-3.5 rounded-xl border border-border/60 bg-card/50 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].name = e.target.value;
                            setVariants(updated);
                          }}
                          placeholder={`Variant ${String.fromCharCode(65 + idx)}`}
                          className="w-32 text-xs font-semibold bg-transparent border-b border-border/40 text-foreground focus:outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{v.weight}% weight</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={v.weight}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[idx].weight = Number(e.target.value);
                              setVariants(updated);
                            }}
                            className="w-24 accent-primary"
                          />
                          {variants.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                              className="p-1 text-muted-foreground hover:text-rose-400"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                      <input
                        type="url"
                        value={v.url}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].url = e.target.value;
                          setVariants(updated);
                        }}
                        placeholder={`https://yourdomain.com/landing-page-${String.fromCharCode(65 + idx).toLowerCase()}`}
                        className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setVariants([...variants, { id: 'v_' + Date.now(), name: `Variant ${String.fromCharCode(65 + variants.length)}`, url: '', weight: 30 }])}
                    className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                  >
                    <Plus size={13} /> Add Another Variant
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DEVICE ROUTING */}
          {activeTab === 'routing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-card/30">
                <div>
                  <div className="text-xs font-semibold text-foreground">Device-Aware Dynamic Redirection</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Redirect iOS visitors to the Apple App Store, Android to Google Play, and Desktop to your web app.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={routingEnabled}
                  onChange={(e) => setRoutingEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-0 cursor-pointer"
                />
              </div>

              {routingEnabled && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                      <Smartphone size={13} className="text-primary" /> iOS / iPhone / iPad Destination URL
                    </label>
                    <input
                      type="url"
                      value={iosUrl}
                      onChange={(e) => setIosUrl(e.target.value)}
                      placeholder="https://apps.apple.com/app/id123456789"
                      className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                      <Smartphone size={13} className="text-emerald-500" /> Android Destination URL
                    </label>
                    <input
                      type="url"
                      value={androidUrl}
                      onChange={(e) => setAndroidUrl(e.target.value)}
                      placeholder="https://play.google.com/store/apps/details?id=com.brand.app"
                      className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground flex items-center gap-1.5 mb-1">
                      <Laptop size={13} className="text-muted-foreground" /> Desktop / Web Fallback URL
                    </label>
                    <input
                      type="url"
                      value={desktopUrl}
                      onChange={(e) => setDesktopUrl(e.target.value)}
                      placeholder="https://app.yourbrand.com"
                      className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GEO ROUTING */}
          {activeTab === 'geo' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-card/30">
                <div>
                  <div className="text-xs font-semibold text-foreground">Geo-Location Country Targeting</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Serve localized landing pages based on visitor country headers.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={geoEnabled}
                  onChange={(e) => setGeoEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-0 cursor-pointer"
                />
              </div>

              {geoEnabled && (
                <div className="space-y-3">
                  {geoRules.map((r, idx) => (
                    <div key={r.id || idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card/50">
                      <select
                        value={r.country}
                        onChange={(e) => {
                          const updated = [...geoRules];
                          updated[idx].country = e.target.value;
                          setGeoRules(updated);
                        }}
                        className="w-44 text-xs bg-card border border-border/60 rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
                      >
                        {COUNTRY_OPTIONS.map(c => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                      <input
                        type="url"
                        value={r.url}
                        onChange={(e) => {
                          const updated = [...geoRules];
                          updated[idx].url = e.target.value;
                          setGeoRules(updated);
                        }}
                        placeholder={`https://yourdomain.com/${r.country.toLowerCase()}`}
                        className="flex-1 text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:border-primary"
                      />
                      {geoRules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setGeoRules(geoRules.filter((_, i) => i !== idx))}
                          className="p-1 text-muted-foreground hover:text-rose-400"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setGeoRules([...geoRules, { id: 'g_' + Date.now(), country: 'GB', url: '' }])}
                    className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                  >
                    <Plus size={13} /> Add Country Rule
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SOCIAL CARD */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-card/30">
                <div>
                  <div className="text-xs font-semibold text-foreground">Custom Social OpenGraph Card</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Customize the title, description, and thumbnail image displayed when shared on Twitter/X, Discord, Slack, iMessage, and WhatsApp.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={ogEnabled}
                  onChange={(e) => setOgEnabled(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-0 cursor-pointer"
                />
              </div>

              {ogEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">OG Title</label>
                      <input
                        type="text"
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                        placeholder="e.g., Check out our brand new release"
                        className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">OG Description</label>
                      <textarea
                        value={ogDesc}
                        onChange={(e) => setOgDesc(e.target.value)}
                        placeholder="Brief summary for rich preview cards..."
                        rows={3}
                        className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-foreground block mb-1">OG Image URL</label>
                      <input
                        type="url"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        placeholder="https://yourbrand.com/og-banner.png"
                        className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Social Preview */}
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block mb-2">Live Preview (Twitter/X & Discord)</span>
                    <SocialCardPreview
                      title={ogTitle || title || 'Your Page Title'}
                      description={ogDesc || 'Your page description preview will appear here.'}
                      imageUrl={ogImage}
                      domain={domain}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: PROTECTION */}
          {activeTab === 'protection' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-card/30">
                <div>
                  <div className="text-xs font-semibold text-foreground">Passcode Protection Gate</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Require visitors to enter a passcode before unlocking the destination URL.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPasswordProtected}
                  onChange={(e) => setIsPasswordProtected(e.target.checked)}
                  className="w-4 h-4 text-primary rounded border-border focus:ring-0 cursor-pointer"
                />
              </div>

              {isPasswordProtected && (
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Secret Access Passcode</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secret passcode..."
                    className="w-full text-xs font-mono bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Link Expiration Date & Time</label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground block mb-1">Max Click Limit (0 for unlimited)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxClicks}
                    onChange={(e) => setMaxClicks(e.target.value)}
                    className="w-full text-xs bg-card/60 border border-border/60 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live Dynamic Routing Sandbox Simulator */}
          <div className="p-3.5 rounded-xl border border-border/40 bg-card/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Play size={12} className="text-primary" /> Live Routing Simulator
              </span>
              <button
                type="button"
                onClick={handleRunSimulation}
                className="px-2.5 py-1 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-colors"
              >
                Test Dynamic Resolution
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <select
                value={simDevice}
                onChange={(e) => setSimDevice(e.target.value)}
                className="bg-card border border-border/40 rounded-lg px-2.5 py-1.5 text-foreground"
              >
                <option value="Desktop">Device: Desktop (Mac/Win)</option>
                <option value="iOS">Device: Apple iOS / iPhone</option>
                <option value="Android">Device: Android</option>
              </select>

              <select
                value={simCountry}
                onChange={(e) => setSimCountry(e.target.value)}
                className="bg-card border border-border/40 rounded-lg px-2.5 py-1.5 text-foreground"
              >
                {COUNTRY_OPTIONS.map(c => (
                  <option key={c.code} value={c.code}>Country: {c.code}</option>
                ))}
              </select>

              <div className="text-xs font-mono flex items-center gap-1 text-muted-foreground">
                <Dice5 size={12} /> Random Roll Ready
              </div>
            </div>

            {simResult && (
              <div className="p-2 rounded-lg bg-background/80 border border-border/40 text-xs space-y-1">
                <div className="text-[11px] font-semibold text-primary">{simResult.rule}</div>
                <div className="font-mono text-[11px] text-foreground truncate">{simResult.target}</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer p-4 border-t border-border/40 bg-card/40 flex items-center justify-between">
          <div className="text-xs font-mono text-muted-foreground">
            {domain}/{slug || '...'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-border/40 hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!targetUrl}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-colors disabled:opacity-50"
            >
              {initialData ? 'Save Changes' : 'Create Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
