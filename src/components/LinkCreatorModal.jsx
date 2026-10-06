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
  Shuffle, 
  Globe, 
  Plus, 
  Trash2,
  Tag,
  Activity,
  CheckCircle2,
  Play,
  Laptop,
  Dice5,
  Lock,
  Layers,
  Calendar,
  Share2
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
    { id: 'g_1', country: 'US', url: '' },
    { id: 'g_2', country: 'GB', url: '' },
  ]);

  // Security & Protection
  const [isPasswordProtected, setIsPasswordProtected] = useState(initialData?.protection?.isPasswordProtected ?? false);
  const [password, setPassword] = useState(initialData?.protection?.password || '');
  const [expiresAt, setExpiresAt] = useState(initialData?.protection?.expiresAt || '');
  const [maxClicks, setMaxClicks] = useState(initialData?.protection?.maxClicks || '');
  const [fallbackUrl, setFallbackUrl] = useState(initialData?.protection?.fallbackUrl || '');

  // UTM Parameters
  const [utmSource, setUtmSource] = useState(initialData?.utmSource || '');
  const [utmMedium, setUtmMedium] = useState(initialData?.utmMedium || '');
  const [utmCampaign, setUtmCampaign] = useState(initialData?.utmCampaign || '');
  const [utmTerm, setUtmTerm] = useState(initialData?.utmTerm || '');
  const [utmContent, setUtmContent] = useState(initialData?.utmContent || '');

  // Health Sentinel status
  const [healthStatus, setHealthStatus] = useState(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Live Simulator sandbox states
  const [simDevice, setSimDevice] = useState('Desktop');
  const [simCountry, setSimCountry] = useState('US');
  const [simResult, setSimResult] = useState(null);

  // Auto audit health sentinel whenever targetUrl changes
  useEffect(() => {
    if (!targetUrl || !targetUrl.includes('.')) {
      setHealthStatus(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCheckingHealth(true);
      try {
        const fullUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
        const res = await apiCheckLinkHealth(fullUrl);
        setHealthStatus(res);
      } catch {
        const localAudit = auditUrlSafety(targetUrl);
        setHealthStatus({
          isHealthy: localAudit.isSafe,
          statusCode: localAudit.isSafe ? 200 : 400,
          statusText: localAudit.isSafe ? 'OK (Simulated)' : localAudit.flaggedIssues[0] || 'Unsafe',
          latencyMs: 42,
          isHttps: targetUrl.startsWith('https://'),
          flaggedReason: localAudit.flaggedIssues[0] || null
        });
      } finally {
        setIsCheckingHealth(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [targetUrl]);

  if (!isOpen) return null;

  const generateRandomSlug = () => {
    const randomWord = SAMPLE_SLUGS[Math.floor(Math.random() * SAMPLE_SLUGS.length)];
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSlug(`${randomWord}-${randomNum}`);
  };

  const handleSmartAutoSuggest = () => {
    if (!targetUrl) return;
    try {
      const cleanUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
      const parsed = new URL(cleanUrl);
      const hostParts = parsed.hostname.replace('www.', '').split('.');
      const brand = hostParts[0] || 'link';
      const pathSegments = parsed.pathname.split('/').filter(Boolean);
      const lastSeg = pathSegments[pathSegments.length - 1] || 'deal';

      const candidate = `${brand}-${lastSeg}`.substring(0, 18).toLowerCase().replace(/[^a-z0-9]/g, '-');
      setSlug(candidate);

      if (!title) {
        setTitle(`${brand.toUpperCase()} - ${lastSeg.replace(/[-_]/g, ' ')}`);
      }
      if (!tags) {
        setTags(`${brand}, promo, web`);
      }
    } catch {
      generateRandomSlug();
    }
  };

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
      const base = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
      const urlObj = new URL(base);
      if (utmSource) urlObj.searchParams.set('utm_source', utmSource);
      if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium);
      if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign);
      if (utmTerm) urlObj.searchParams.set('utm_term', utmTerm);
      if (utmContent) urlObj.searchParams.set('utm_content', utmContent);
      return urlObj.toString();
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
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent,
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

  const tabs = [
    { key: 'general', label: 'General', icon: LinkIcon },
    { key: 'utm', label: 'UTM Builder', icon: Tag },
    { key: 'split', label: 'A/B Split', icon: Shuffle },
    { key: 'routing', label: 'Devices', icon: Smartphone },
    { key: 'geo', label: 'Geo-Target', icon: Globe },
    { key: 'social', label: 'Social Card', icon: Sparkles },
    { key: 'protection', label: 'Protection', icon: Shield }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {initialData ? 'Edit Smart Short Link' : 'Create Smart Short Link'}
              </h2>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem', padding: '1px 6px', fontWeight: '700' }}>
                PRO ENGINE
              </span>
            </div>
            <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
              Dynamic A/B routing, device & geo targeting, UTM campaign builder, and health sentinel.
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '0.35rem', 
          padding: '0.5rem 1.4rem', 
          borderBottom: '1px solid var(--border-subtle)', 
          backgroundColor: 'var(--bg-subtle)',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                style={{ 
                  fontSize: '0.775rem', 
                  padding: '0.3rem 0.65rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={12} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Target URL */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Destination Target URL <span style={{ color: 'var(--error-text)' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleSmartAutoSuggest}
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0 4px' }}
                  >
                    <Wand2 size={12} /> Smart Auto-Suggest
                  </button>
                </div>
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://yourbrand.com/special-launch"
                  className="input input-mono"
                  style={{ width: '100%' }}
                  required
                />

                {/* Health Sentinel Status Bar */}
                {targetUrl && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Activity size={13} style={{ color: isCheckingHealth ? 'var(--accent)' : '#10b981' }} />
                      <span style={{ color: 'var(--text-muted)' }}>Sentinel Health:</span>
                      {isCheckingHealth ? (
                        <span style={{ color: 'var(--text-muted)' }}>Pinging destination...</span>
                      ) : healthStatus?.isHealthy ? (
                        <span className="tabular-nums" style={{ color: '#15803d', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <CheckCircle2 size={12} /> 200 OK ({healthStatus.latencyMs}ms) • {healthStatus.isHttps ? 'HTTPS Secure' : 'HTTP'}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--warning-text)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <AlertTriangle size={12} /> {healthStatus?.statusText || 'Unreachable or Redirect'}
                        </span>
                      )}
                    </div>
                    <span className="badge" style={{ fontSize: '0.65rem' }}>Live Sentinel</span>
                  </div>
                )}
              </div>

              {/* Domain & Slug */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="select"
                    style={{ width: '100%' }}
                  >
                    <option value="kiss.url">kiss.url (Default)</option>
                    <option value="go.brand.io">go.brand.io (Custom)</option>
                    <option value="link.io">link.io</option>
                  </select>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Custom Slug
                    </label>
                    <button
                      type="button"
                      onClick={generateRandomSlug}
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0 4px' }}
                    >
                      <Dice5 size={12} /> Randomize
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      /
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="launch-deal"
                      className="input input-mono"
                      style={{ width: '100%', paddingLeft: '1.4rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Title & Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    Internal Reference Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Summer 2026 Promo Campaign"
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., marketing, social, q3"
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UTM BUILDER */}
          {activeTab === 'utm' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                  1-Click Campaign Presets
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {UTM_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.55rem' }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    utm_source
                  </label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    placeholder="google, meta"
                    className="input input-mono"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    utm_medium
                  </label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    placeholder="cpc, social"
                    className="input input-mono"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    utm_campaign
                  </label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    placeholder="launch_2026"
                    className="input input-mono"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    utm_term (keywords / audience)
                  </label>
                  <input
                    type="text"
                    value={utmTerm}
                    onChange={(e) => setUtmTerm(e.target.value)}
                    placeholder="tech_founders"
                    className="input input-mono"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    utm_content (ad variation)
                  </label>
                  <input
                    type="text"
                    value={utmContent}
                    onChange={(e) => setUtmContent(e.target.value)}
                    placeholder="hero_banner"
                    className="input input-mono"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Live Appended Preview */}
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-text)' }}>
                  Calculated Destination with UTMs:
                </span>
                <div style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  wordBreak: 'break-all',
                  backgroundColor: 'var(--bg-surface)',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  {getComputedUtmUrl() || 'Enter a Target URL in General tab to preview.'}
                </div>
                <button
                  type="button"
                  onClick={handleApplyUtmToTarget}
                  className="btn btn-secondary"
                  style={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
                >
                  Apply to Target URL
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: A/B SPLIT TESTING */}
          {activeTab === 'split' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Enable A/B Split Traffic Distribution
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Route incoming visitors across multiple landing pages based on percentage weights.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={splitEnabled}
                  onChange={(e) => setSplitEnabled(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {splitEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {variants.map((v, idx) => (
                    <div key={v.id || idx} style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[idx].name = e.target.value;
                            setVariants(updated);
                          }}
                          placeholder={`Variant ${String.fromCharCode(65 + idx)}`}
                          className="input"
                          style={{ width: '130px', fontSize: '0.8rem', fontWeight: '600' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="tabular-nums" style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            {v.weight}% weight
                          </span>
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
                            style={{ width: '90px' }}
                          />
                          {variants.length > 2 && (
                            <button
                              type="button"
                              onClick={() => setVariants(variants.filter((_, i) => i !== idx))}
                              className="btn-icon"
                              style={{ color: 'var(--error-text)' }}
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
                        className="input input-mono"
                        style={{ width: '100%', fontSize: '0.785rem' }}
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setVariants([...variants, { id: 'v_' + Date.now(), name: `Variant ${String.fromCharCode(65 + variants.length)}`, url: '', weight: 30 }])}
                    className="btn btn-secondary"
                    style={{ alignSelf: 'flex-start', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Plus size={13} /> Add Another Variant
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DEVICE ROUTING */}
          {activeTab === 'routing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Device-Aware Dynamic Redirection
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Redirect iOS visitors to the Apple App Store, Android to Google Play, and Desktop to your web app.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={routingEnabled}
                  onChange={(e) => setRoutingEnabled(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {routingEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <Smartphone size={13} style={{ color: 'var(--accent)' }} /> iOS / iPhone / iPad Destination URL
                    </label>
                    <input
                      type="url"
                      value={iosUrl}
                      onChange={(e) => setIosUrl(e.target.value)}
                      placeholder="https://apps.apple.com/app/id123456789"
                      className="input input-mono"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <Smartphone size={13} style={{ color: '#10b981' }} /> Android Destination URL
                    </label>
                    <input
                      type="url"
                      value={androidUrl}
                      onChange={(e) => setAndroidUrl(e.target.value)}
                      placeholder="https://play.google.com/store/apps/details?id=com.brand.app"
                      className="input input-mono"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      <Laptop size={13} style={{ color: 'var(--text-muted)' }} /> Desktop / Web Fallback URL
                    </label>
                    <input
                      type="url"
                      value={desktopUrl}
                      onChange={(e) => setDesktopUrl(e.target.value)}
                      placeholder="https://app.yourbrand.com"
                      className="input input-mono"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GEO ROUTING */}
          {activeTab === 'geo' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Geo-Location Country Targeting
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Serve localized landing pages based on visitor country origin.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={geoEnabled}
                  onChange={(e) => setGeoEnabled(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {geoEnabled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {geoRules.map((r, idx) => (
                    <div key={r.id || idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-default)'
                    }}>
                      <select
                        value={r.country}
                        onChange={(e) => {
                          const updated = [...geoRules];
                          updated[idx].country = e.target.value;
                          setGeoRules(updated);
                        }}
                        className="select"
                        style={{ width: '160px', fontSize: '0.75rem' }}
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
                        className="input input-mono"
                        style={{ flex: 1, fontSize: '0.785rem' }}
                      />
                      {geoRules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setGeoRules(geoRules.filter((_, i) => i !== idx))}
                          className="btn-icon"
                          style={{ color: 'var(--error-text)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setGeoRules([...geoRules, { id: 'g_' + Date.now(), country: 'GB', url: '' }])}
                    className="btn btn-secondary"
                    style={{ alignSelf: 'flex-start', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Plus size={13} /> Add Country Rule
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SOCIAL CARD */}
          {activeTab === 'social' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Custom Social OpenGraph Card
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Customize rich preview cards for Twitter/X, Discord, Slack, iMessage, and WhatsApp.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={ogEnabled}
                  onChange={(e) => setOgEnabled(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {ogEnabled && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        OG Title
                      </label>
                      <input
                        type="text"
                        value={ogTitle}
                        onChange={(e) => setOgTitle(e.target.value)}
                        placeholder="e.g., Check out our brand new release"
                        className="input"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        OG Description
                      </label>
                      <textarea
                        value={ogDesc}
                        onChange={(e) => setOgDesc(e.target.value)}
                        placeholder="Brief summary for rich preview cards..."
                        rows={3}
                        className="input"
                        style={{ width: '100%', resize: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        OG Image URL
                      </label>
                      <input
                        type="url"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        placeholder="https://yourbrand.com/og-banner.png"
                        className="input input-mono"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Social Preview */}
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                      Live Preview (Twitter/X & Discord)
                    </span>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Passcode Protection Gate
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Require visitors to enter a passcode before unlocking the destination URL.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPasswordProtected}
                  onChange={(e) => setIsPasswordProtected(e.target.checked)}
                  style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                />
              </div>

              {isPasswordProtected && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Secret Access Passcode
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secret passcode..."
                    className="input input-mono"
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Link Expiration Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.785rem', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Max Click Limit (0 for unlimited)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxClicks}
                    onChange={(e) => setMaxClicks(e.target.value)}
                    className="input tabular-nums"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Live Dynamic Routing Sandbox Simulator */}
          <div style={{
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.785rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Play size={12} style={{ color: 'var(--accent)' }} /> Live Routing Simulator
              </span>
              <button
                type="button"
                onClick={handleRunSimulation}
                className="btn btn-secondary"
                style={{ fontSize: '0.725rem', padding: '0.25rem 0.55rem' }}
              >
                Test Dynamic Resolution
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.75rem' }}>
              <select
                value={simDevice}
                onChange={(e) => setSimDevice(e.target.value)}
                className="select"
                style={{ fontSize: '0.75rem' }}
              >
                <option value="Desktop">Device: Desktop (Mac/Win)</option>
                <option value="iOS">Device: Apple iOS / iPhone</option>
                <option value="Android">Device: Android</option>
              </select>

              <select
                value={simCountry}
                onChange={(e) => setSimCountry(e.target.value)}
                className="select"
                style={{ fontSize: '0.75rem' }}
              >
                {COUNTRY_OPTIONS.map(c => (
                  <option key={c.code} value={c.code}>Country: {c.code}</option>
                ))}
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <Dice5 size={12} /> Random Roll Ready
              </div>
            </div>

            {simResult && (
              <div style={{
                padding: '0.6rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                fontSize: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}>
                <div style={{ fontWeight: '600', color: 'var(--accent-text)' }}>{simResult.rule}</div>
                <div className="input-mono" style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {simResult.target}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="tabular-nums" style={{ fontSize: '0.785rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            {domain}/{slug || '...'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!targetUrl}
              className="btn btn-primary"
            >
              {initialData ? 'Save Changes' : 'Create Link'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
